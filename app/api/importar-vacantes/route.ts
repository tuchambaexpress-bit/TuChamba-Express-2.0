import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import {
  JORNADA_INVERSO, MODALIDAD_INVERSO, SALARIO_TIPO_INVERSO, PERIODO_INVERSO,
  esSiNo, parsearFecha, normalizarNombre, parsearDiasDescanso,
  DOCUMENTOS_TRONCO_COMUN, COLUMNAS_TRONCO_COMUN, OPERADO_POR_INVERSO,
} from '@/lib/excel-vacantes'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function extraerListaDinamica(fila: Record<string, any>, prefijo: string): string[] {
  const items: string[] = []
  let i = 1
  while (fila[`${prefijo}_${i}`] !== undefined) {
    const valor = String(fila[`${prefijo}_${i}`] ?? '').trim()
    if (valor) items.push(valor)
    i++
  }
  return items
}

// Documentos de tronco común (2026-08-30) — ahora son 8 columnas fijas
// SI/NO (una por documento), no texto libre. Se recupera el nombre
// completo exacto desde DOCUMENTOS_TRONCO_COMUN por índice, evitando
// el bug real reportado por José: una diferencia mínima de texto entre
// el Excel y el checkbox hacía que no se marcara al importar.
function extraerDocumentosTroncoComun(fila: Record<string, any>): string[] {
  return DOCUMENTOS_TRONCO_COMUN.filter((_, i) => esSiNo(fila[COLUMNAS_TRONCO_COMUN[i]]))
}

// Extrae pares RUTA_N_NOMBRE / RUTA_N_PARADAS de una fila, uno por ruta
function extraerRutas(fila: Record<string, any>): { nombre: string; paradas: string[] }[] {
  const rutas: { nombre: string; paradas: string[] }[] = []
  let i = 1
  while (fila[`RUTA_${i}_NOMBRE`] !== undefined || fila[`RUTA_${i}_PARADAS`] !== undefined) {
    const nombre = String(fila[`RUTA_${i}_NOMBRE`] ?? '').trim()
    const paradasTexto = String(fila[`RUTA_${i}_PARADAS`] ?? '').trim()
    const paradas = paradasTexto.split(',').map(p => p.trim()).filter(Boolean)
    // Antes exigía nombre + al menos 1 parada. José prefiere capturar
    // solo el nombre de la ruta cuando son muchas paradas por ruta (ej.
    // 20 rutas x 7 paradas) — el detalle completo vive en el PDF adjunto
    // a la empresa (documentos_negocio), no en el listado de paradas.
    if (nombre) rutas.push({ nombre, paradas })
    i++
  }
  return rutas
}

// 7.38 en Excel (2026-09-01) — rutas especializadas de reclutamiento
// (catálogo de empresa, Opción 2 de la Sección 9). Distinto de
// extraerRutas() de arriba, que es transporte de trabajadores ya
// contratados. Paradas y días quedan solo capturables en el sistema.
function extraerRutasReclutamiento(fila: Record<string, any>): {
  nombre: string; operado_por: string; chofer_vehiculo: string | null; contacto_nombre: string | null; ubicacion_maps: string | null; paradas: string[]
}[] {
  const rutas: ReturnType<typeof extraerRutasReclutamiento> = []
  let i = 1
  while (fila[`RUTA_RECLUTAMIENTO_${i}_NOMBRE`] !== undefined) {
    const nombre = String(fila[`RUTA_RECLUTAMIENTO_${i}_NOMBRE`] ?? '').trim()
    if (nombre) {
      const operadoTexto = String(fila[`RUTA_RECLUTAMIENTO_${i}_OPERADO_POR`] ?? '').trim().toLowerCase()
      // Paradas ahora también por Excel (2026-09-05) — antes solo se
      // capturaban en el sistema. Una por línea; \n real o literal
      // "\n" (por si el Excel guardó el salto como texto plano).
      const paradasTexto = String(fila[`RUTA_RECLUTAMIENTO_${i}_PARADAS`] ?? '').trim()
      const paradas = paradasTexto
        ? paradasTexto.split(/\r\n|\n|\\n/).map(p => p.trim()).filter(Boolean)
        : []
      rutas.push({
        nombre,
        operado_por: OPERADO_POR_INVERSO[operadoTexto] ?? 'hr_connect',
        chofer_vehiculo: String(fila[`RUTA_RECLUTAMIENTO_${i}_CHOFER_VEHICULO`] ?? '').trim() || null,
        contacto_nombre: String(fila[`RUTA_RECLUTAMIENTO_${i}_CONTACTO`] ?? '').trim() || null,
        ubicacion_maps: String(fila[`RUTA_RECLUTAMIENTO_${i}_MAPS`] ?? '').trim() || null,
        paradas,
      })
    }
    i++
  }
  return rutas
}

// Mismo patrón, para puntos fijos (Opción 3 de la Sección 9). Teléfono
// de contacto y días quedan solo capturables en el sistema.
function extraerPuntosReclutamiento(fila: Record<string, any>): {
  nombre: string; operado_por: string; direccion: string | null; ubicacion_maps: string | null; horario: string | null; contacto_nombre: string | null
}[] {
  const puntos: ReturnType<typeof extraerPuntosReclutamiento> = []
  let i = 1
  while (fila[`PUNTO_RECLUTAMIENTO_${i}_NOMBRE`] !== undefined) {
    const nombre = String(fila[`PUNTO_RECLUTAMIENTO_${i}_NOMBRE`] ?? '').trim()
    if (nombre) {
      const operadoTexto = String(fila[`PUNTO_RECLUTAMIENTO_${i}_OPERADO_POR`] ?? '').trim().toLowerCase()
      puntos.push({
        nombre,
        operado_por: OPERADO_POR_INVERSO[operadoTexto] ?? 'hr_connect',
        direccion: String(fila[`PUNTO_RECLUTAMIENTO_${i}_DIRECCION`] ?? '').trim() || null,
        ubicacion_maps: String(fila[`PUNTO_RECLUTAMIENTO_${i}_MAPS`] ?? '').trim() || null,
        horario: String(fila[`PUNTO_RECLUTAMIENTO_${i}_HORARIO`] ?? '').trim() || null,
        contacto_nombre: String(fila[`PUNTO_RECLUTAMIENTO_${i}_CONTACTO_NOMBRE`] ?? '').trim() || null,
      })
    }
    i++
  }
  return puntos
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const agenciaId = formData.get('agenciaId') as string | null

    if (!file || !agenciaId) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const bytes = await file.arrayBuffer()
    // cellDates: true — para que las celdas de fecha reales de Excel
    // lleguen como objetos Date, en vez de números de serie sin
    // formato (causa real de que las fechas se ignoraran en silencio)
    const libro = XLSX.read(bytes, { type: 'array', cellDates: true })

    const nombreHoja = libro.SheetNames.includes('Vacantes') ? 'Vacantes' : libro.SheetNames[0]
    const filas: Record<string, any>[] = XLSX.utils.sheet_to_json(libro.Sheets[nombreHoja], { defval: '' })

    if (filas.length === 0) {
      return NextResponse.json({ error: 'El archivo no tiene filas de datos en la hoja "Vacantes"' }, { status: 400 })
    }

    // Cache de negocios de la agencia, para no consultar Supabase en cada fila
    const { data: negociosExistentes } = await supabase.from('negocios').select('id, nombre')
    const mapaNegocios = new Map((negociosExistentes ?? []).map(n => [normalizarNombre(n.nombre), n.id]))

    let creadas = 0
    let actualizadas = 0
    const errores: { fila: number; motivo: string }[] = []
    // CA-08.8: dias_descanso vive en negocios, no en vacantes — se juntan aquí
    // y se aplican en un solo UPDATE por empresa al final (última fila gana)
    const diasDescansoPorNegocio = new Map<string, number[]>()
    // Mismo patrón para dias_entrevista (5.25), campo hermano de dias_descanso
    const diasEntrevistaPorNegocio = new Map<string, number[]>()
    // Mismo patrón para rutas con nombre (2026-08-26) — vive en negocios,
    // reemplaza a vacantes.zonas_ruta (en desuso)
    const rutasPorNegocio = new Map<string, { nombre: string; paradas: string[] }[]>()
    // Mismo patrón para ubicación de Maps (2026-08-27) — campo de empresa
    const ubicacionMapsPorNegocio = new Map<string, string>()
    // 7.38 en Excel — rutas/puntos de reclutamiento acumulados por
    // empresa (última fila gana, mismo criterio que los de arriba).
    // Distinto de los de arriba: estos son tablas reales, no una
    // columna que se reemplaza completa — se hace match por nombre
    // más abajo, no un simple UPDATE.
    const rutasReclutamientoPorNegocio = new Map<string, ReturnType<typeof extraerRutasReclutamiento>>()
    const puntosReclutamientoPorNegocio = new Map<string, ReturnType<typeof extraerPuntosReclutamiento>>()
    // Para poder auto-seleccionar, al final, lo nuevo del catálogo en
    // cada vacante que se tocó en este import
    const vacantesTocadas: { id: string; negocioId: string }[] = []

    for (let idx = 0; idx < filas.length; idx++) {
      const fila = filas[idx]
      const numFila = idx + 2 // +2 porque la fila 1 es encabezado, y Excel empieza en 1

      try {
        const titulo = String(fila['TÍTULO'] ?? '').trim()
        const estado = String(fila['ESTADO'] ?? '').trim()
        const municipio = String(fila['MUNICIPIO'] ?? '').trim()
        const jornadaTexto = String(fila['JORNADA'] ?? '').trim().toLowerCase()
        const diasGarantia = Number(fila['DÍAS DE GARANTÍA'])
        const comision = Number(fila['COMISIÓN'])

        // Validación de obligatorios
        if (!titulo) { errores.push({ fila: numFila, motivo: 'Falta TÍTULO' }); continue }
        if (!estado) { errores.push({ fila: numFila, motivo: 'Falta ESTADO' }); continue }
        if (!municipio) { errores.push({ fila: numFila, motivo: 'Falta MUNICIPIO' }); continue }
        if (!JORNADA_INVERSO[jornadaTexto]) { errores.push({ fila: numFila, motivo: `JORNADA "${fila['JORNADA']}" no reconocida` }); continue }
        if (!diasGarantia || diasGarantia <= 0) { errores.push({ fila: numFila, motivo: 'DÍAS DE GARANTÍA debe ser mayor a 0' }); continue }
        if (isNaN(comision)) { errores.push({ fila: numFila, motivo: 'COMISIÓN inválida' }); continue }

        // Empresa: buscar o crear
        const nombreEmpresa = String(fila['EMPRESA'] ?? '').trim()
        let negocioId: string | null = null
        if (nombreEmpresa) {
          const clave = normalizarNombre(nombreEmpresa)
          if (mapaNegocios.has(clave)) {
            negocioId = mapaNegocios.get(clave)!
          } else {
            const { data: nuevoNegocio, error: errorNegocio } = await supabase
              .from('negocios')
              .insert({ nombre: nombreEmpresa })
              .select('id')
              .single()
            if (errorNegocio || !nuevoNegocio) {
              errores.push({ fila: numFila, motivo: `No se pudo crear la empresa "${nombreEmpresa}"` })
              continue
            }
            negocioId = nuevoNegocio.id
            mapaNegocios.set(clave, negocioId)
          }
        }

        const payload: Record<string, any> = {
          titulo,
          negocio_id: negocioId,
          empresa_visible: esSiNo(fila['MOSTRAR EMPRESA']),
          destacada: esSiNo(fila['DESTACADA']),
          estado,
          ciudad: municipio,
          colonia_zona: String(fila['ZONA'] ?? '').trim() || null,
          modalidad: MODALIDAD_INVERSO[String(fila['MODALIDAD'] ?? '').trim().toLowerCase()] ?? 'presencial',
          salario_min: fila['SALARIO MÍNIMO'] ? Number(fila['SALARIO MÍNIMO']) : null,
          salario_max: fila['SALARIO MÁXIMO'] ? Number(fila['SALARIO MÁXIMO']) : null,
          salario_tipo: SALARIO_TIPO_INVERSO[String(fila['TIPO SALARIO'] ?? '').trim().toLowerCase()] ?? 'neto',
          salario_periodo: PERIODO_INVERSO[String(fila['PERIODO SALARIO'] ?? '').trim().toLowerCase()] ?? 'semanal',
          salario_visible: esSiNo(fila['MOSTRAR SALARIO'] ?? 'SI'),
          jornada: JORNADA_INVERSO[jornadaTexto],
          turno: String(fila['TURNO'] ?? '').trim().toLowerCase() || 'no_aplica',
          horario: String(fila['HORARIO'] ?? '').trim() || null,
          descripcion: String(fila['DESCRIPCIÓN'] ?? '').trim() || titulo,
          tags: String(fila['ETIQUETAS'] ?? '').split(',').map(t => t.trim()).filter(Boolean),
          requisitos: extraerListaDinamica(fila, 'REQUISITO'),
          beneficios: extraerListaDinamica(fila, 'BENEFICIO'),
          documentos_requeridos: [...extraerDocumentosTroncoComun(fila), ...extraerListaDinamica(fila, 'DOCUMENTO')],
          tiene_ruta: esSiNo(fila['RUTA']),
          ruta_para_entrevista: esSiNo(fila['RUTA PARA ENTREVISTA']),
          estacionamiento: esSiNo(fila['ESTACIONAMIENTO']),
          comedor: esSiNo(fila['COMEDOR']),
          uniforme: esSiNo(fila['UNIFORME']),
          // 7.38 en Excel — Opción 1 de Sección 9. Vacío = SI (mismo
          // default que la columna en Supabase).
          permite_directo_planta: esSiNo(fila['DIRECTO A PLANTA'] ?? 'SI'),
          letras_chiquitas: String(fila['LETRAS CHIQUITAS'] ?? '').trim() || null,
          dias_garantia: diasGarantia,
          comision_base_mxn: comision,
          tiene_promocion: esSiNo(fila['TIENE PROMOCIÓN']),
          promocion_descripcion: String(fila['DESCRIPCIÓN PROMOCIÓN'] ?? '').trim() || null,
          promocion_monto_mxn: fila['MONTO PROMOCIÓN'] ? Number(fila['MONTO PROMOCIÓN']) : null,
          promocion_fin: parsearFecha(fila['VENCE PROMOCIÓN']),
          requiere_examen_medico: esSiNo(fila['EXAMEN MÉDICO']),
          requiere_antidoping: esSiNo(fila['ANTIDOPING']),
          requiere_estudio_socioeconomico: esSiNo(fila['ESTUDIO SOCIOECONÓMICO']),
          contacto_rrhh_nombre: String(fila['CONTACTO RRHH NOMBRE'] ?? '').trim() || null,
          contacto_rrhh_telefono: String(fila['CONTACTO RRHH TELÉFONO'] ?? '').trim() || null,
          mejor_horario_contacto: String(fila['MEJOR HORARIO CONTACTO'] ?? '').trim() || null,
          punto_reunion: String(fila['PUNTO DE REUNIÓN'] ?? '').trim() || null,
          guion_candidato: String(fila['QUÉ DECIRLE AL CANDIDATO'] ?? '').trim() || null,
          comentarios_salario: String(fila['COMENTARIOS SALARIO'] ?? '').trim() || null,
          dias_induccion: fila['DÍAS DE INDUCCIÓN'] ? Number(fila['DÍAS DE INDUCCIÓN']) : 0,
          induccion_dentro_garantia: esSiNo(fila['INDUCCIÓN DENTRO DE GARANTÍA'] ?? 'SI'),
          cupo_requerido: fila['CUPO REQUERIDO'] ? Number(fila['CUPO REQUERIDO']) : 1,
          status: String(fila['ESTATUS'] ?? '').trim().toLowerCase() === 'vigente' ? 'vigente' : 'pausada',
          // Nuevo (2026-09-05) — por vacante, texto libre
          proceso_reclutamiento: String(fila['PROCESO_RECLUTAMIENTO'] ?? '').trim() || null,
          filtro_1: String(fila['FILTRO_1'] ?? '').trim() || null,
          pase_de_visita: esSiNo(fila['PASE_DE_VISITA']),
          agencia_id: agenciaId,
          // Si la columna FECHA viene vacía o no se puede leer, se omite
          // del payload por completo: en un INSERT toma el DEFAULT now()
          // de la base; en un UPDATE deja la fecha_publicacion existente
          // intacta, sin pisarla con nada.
          ...(parsearFecha(fila['FECHA']) ? { fecha_publicacion: parsearFecha(fila['FECHA']) } : {}),
        }

        // CA-08.8: guarda los días de descanso de esta fila para aplicarlos
        // a la empresa al final (si viene vacío, no se toca lo que ya tenía)
        const diasDescansoTexto = String(fila['DÍAS DE DESCANSO EMPRESA'] ?? '').trim()
        if (negocioId && diasDescansoTexto) {
          diasDescansoPorNegocio.set(negocioId, parsearDiasDescanso(diasDescansoTexto))
        }

        // 5.25: mismo patrón para días de entrevista
        const diasEntrevistaTexto = String(fila['DÍAS DE ENTREVISTA EMPRESA'] ?? '').trim()
        if (negocioId && diasEntrevistaTexto) {
          diasEntrevistaPorNegocio.set(negocioId, parsearDiasDescanso(diasEntrevistaTexto))
        }

        // Rutas con nombre (2026-08-26): mismo patrón, junta y aplica al final
        const rutasFila = extraerRutas(fila)
        if (negocioId && rutasFila.length > 0) {
          rutasPorNegocio.set(negocioId, rutasFila)
        }

        // Ubicación de Maps (2026-08-27): mismo patrón
        const ubicacionMapsTexto = String(fila['UBICACIÓN MAPS EMPRESA'] ?? '').trim()
        if (negocioId && ubicacionMapsTexto) {
          ubicacionMapsPorNegocio.set(negocioId, ubicacionMapsTexto)
        }

        // 7.38 en Excel — rutas/puntos de reclutamiento, mismo patrón
        const rutasReclutamientoFila = extraerRutasReclutamiento(fila)
        if (negocioId && rutasReclutamientoFila.length > 0) {
          rutasReclutamientoPorNegocio.set(negocioId, rutasReclutamientoFila)
        }
        const puntosReclutamientoFila = extraerPuntosReclutamiento(fila)
        if (negocioId && puntosReclutamientoFila.length > 0) {
          puntosReclutamientoPorNegocio.set(negocioId, puntosReclutamientoFila)
        }

        // CA-08.5: actualizar si ya existe (por ID, o por título+empresa en la misma agencia)
        const idExcel = String(fila['ID'] ?? '').trim()
        let idExistente: string | null = null

        if (idExcel) {
          const { data: porId } = await supabase.from('vacantes').select('id').eq('id', idExcel).eq('agencia_id', agenciaId).maybeSingle()
          if (porId) idExistente = porId.id
        }
        if (!idExistente) {
          const { data: porTituloEmpresa } = await supabase
            .from('vacantes')
            .select('id')
            .eq('agencia_id', agenciaId)
            .eq('titulo', titulo)
            .eq('negocio_id', negocioId)
            .maybeSingle()
          if (porTituloEmpresa) idExistente = porTituloEmpresa.id
        }

        let idVacanteFinal: string | null = null
        if (idExistente) {
          const { error: errorUpdate } = await supabase.from('vacantes').update(payload).eq('id', idExistente)
          if (errorUpdate) { errores.push({ fila: numFila, motivo: errorUpdate.message }); continue }
          actualizadas++
          idVacanteFinal = idExistente
        } else {
          const { data: vacanteCreada, error: errorInsert } = await supabase.from('vacantes').insert(payload).select('id').single()
          if (errorInsert || !vacanteCreada) { errores.push({ fila: numFila, motivo: errorInsert?.message ?? 'No se pudo crear' }); continue }
          creadas++
          idVacanteFinal = vacanteCreada.id
        }

        if (idVacanteFinal && negocioId) {
          vacantesTocadas.push({ id: idVacanteFinal, negocioId })
        }
      } catch (errFila: any) {
        errores.push({ fila: numFila, motivo: errFila?.message ?? 'Error inesperado en esta fila' })
      }
    }

    // CA-08.8: aplica los días de descanso acumulados, uno por empresa
    for (const [negocioId, dias] of diasDescansoPorNegocio) {
      await supabase.from('negocios').update({ dias_descanso: dias }).eq('id', negocioId)
    }

    // 5.25: aplica los días de entrevista acumulados, mismo patrón
    for (const [negocioId, dias] of diasEntrevistaPorNegocio) {
      await supabase.from('negocios').update({ dias_entrevista: dias }).eq('id', negocioId)
    }

    // Rutas con nombre: aplica las acumuladas, mismo patrón
    for (const [negocioId, rutas] of rutasPorNegocio) {
      await supabase.from('negocios').update({ rutas }).eq('id', negocioId)
    }

    // Ubicación de Maps: aplica las acumuladas, mismo patrón
    for (const [negocioId, ubicacionMaps] of ubicacionMapsPorNegocio) {
      await supabase.from('negocios').update({ ubicacion_maps: ubicacionMaps }).eq('id', negocioId)
    }

    // 7.38 en Excel — upsert de rutas/puntos de reclutamiento por
    // empresa, con match por nombre (a diferencia de los de arriba,
    // estas son tablas reales con relaciones — no se puede solo
    // reemplazar el array completo). Se recuerda cuáles quedaron
    // NUEVAS (creadas en este import), para auto-seleccionarlas abajo.
    const idsNuevasRutasReclPorNegocio = new Map<string, Set<string>>()
    const idsNuevosPuntosReclPorNegocio = new Map<string, Set<string>>()

    for (const [negocioId, rutas] of rutasReclutamientoPorNegocio) {
      const { data: existentes } = await supabase
        .from('rutas_reclutamiento')
        .select('id, nombre')
        .eq('negocio_id', negocioId)
      const mapaExistentes = new Map((existentes ?? []).map(r => [r.nombre.trim(), r.id]))
      const idsNuevos = new Set<string>()
      const nombresEnEsteImport = new Set(rutas.map(r => r.nombre))

      for (const r of rutas) {
        const registro: Record<string, any> = {
          negocio_id: negocioId,
          nombre: r.nombre,
          operado_por: r.operado_por,
          chofer_vehiculo: r.chofer_vehiculo,
          contacto_nombre: r.contacto_nombre,
          ubicacion_maps: r.ubicacion_maps,
        }
        // Paradas también por Excel (2026-09-05) — solo pisa si el
        // Excel trajo algo, para no borrar paradas ya capturadas a
        // mano en el sistema si la celda venía vacía.
        if (r.paradas.length > 0) registro.paradas = r.paradas

        if (mapaExistentes.has(r.nombre)) {
          await supabase.from('rutas_reclutamiento').update(registro).eq('id', mapaExistentes.get(r.nombre)!)
        } else {
          const { data: nueva } = await supabase.from('rutas_reclutamiento').insert(registro).select('id').single()
          if (nueva) idsNuevos.add(nueva.id)
        }
      }
      idsNuevasRutasReclPorNegocio.set(negocioId, idsNuevos)

      // 2026-09-05, a petición de José: el Excel es la fuente de verdad
      // completa del catálogo de esta empresa en cada import — cualquier
      // ruta que ya NO aparezca se borra de verdad (antes era aditivo:
      // nunca borraba nada, solo agregaba/actualizaba por nombre, lo que
      // dejaba pruebas/rutas viejas acumulándose para siempre).
      const idsABorrar = (existentes ?? [])
        .filter(r => !nombresEnEsteImport.has(r.nombre.trim()))
        .map(r => r.id)
      if (idsABorrar.length > 0) {
        await supabase.from('vacante_ruta_reclutamiento').delete().in('ruta_id', idsABorrar)
        await supabase.from('rutas_reclutamiento').delete().in('id', idsABorrar)
      }
    }

    for (const [negocioId, puntos] of puntosReclutamientoPorNegocio) {
      const { data: existentes } = await supabase
        .from('puntos_reclutamiento')
        .select('id, nombre')
        .eq('negocio_id', negocioId)
      const mapaExistentes = new Map((existentes ?? []).map(p => [p.nombre.trim(), p.id]))
      const idsNuevos = new Set<string>()
      const nombresEnEsteImport = new Set(puntos.map(p => p.nombre))

      for (const p of puntos) {
        const registro = {
          negocio_id: negocioId,
          nombre: p.nombre,
          operado_por: p.operado_por,
          direccion: p.direccion,
          ubicacion_maps: p.ubicacion_maps,
          horario: p.horario,
          contacto_nombre: p.contacto_nombre,
        }
        if (mapaExistentes.has(p.nombre)) {
          await supabase.from('puntos_reclutamiento').update(registro).eq('id', mapaExistentes.get(p.nombre)!)
        } else {
          const { data: nuevo } = await supabase.from('puntos_reclutamiento').insert(registro).select('id').single()
          if (nuevo) idsNuevos.add(nuevo.id)
        }
      }
      idsNuevosPuntosReclPorNegocio.set(negocioId, idsNuevos)

      // Mismo criterio que rutas, arriba
      const idsABorrar = (existentes ?? [])
        .filter(p => !nombresEnEsteImport.has(p.nombre.trim()))
        .map(p => p.id)
      if (idsABorrar.length > 0) {
        await supabase.from('vacante_punto_reclutamiento').delete().in('punto_id', idsABorrar)
        await supabase.from('puntos_reclutamiento').delete().in('id', idsABorrar)
      }
    }

    // Auto-selecciona lo NUEVO del catálogo (creado en este import) para
    // cada vacante tocada de la misma empresa — mismo criterio que ya
    // usa la Sección 9 en el sistema ("lo nuevo se autoselecciona").
    // No toca selección ya existente (respeta si alguien desmarcó algo
    // manualmente en el sistema para una vacante específica).
    for (const { id: vacanteId, negocioId } of vacantesTocadas) {
      const idsNuevasRutas = idsNuevasRutasReclPorNegocio.get(negocioId)
      if (idsNuevasRutas && idsNuevasRutas.size > 0) {
        await supabase.from('vacante_ruta_reclutamiento').insert(
          [...idsNuevasRutas].map(ruta_id => ({ vacante_id: vacanteId, ruta_id }))
        )
      }
      const idsNuevosPuntos = idsNuevosPuntosReclPorNegocio.get(negocioId)
      if (idsNuevosPuntos && idsNuevosPuntos.size > 0) {
        await supabase.from('vacante_punto_reclutamiento').insert(
          [...idsNuevosPuntos].map(punto_id => ({ vacante_id: vacanteId, punto_id }))
        )
      }
    }

    return NextResponse.json({ ok: true, creadas, actualizadas, errores })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error inesperado' }, { status: 500 })
  }
}
