import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import {
  NOMBRES_JORNADA, NOMBRES_MODALIDAD, NOMBRES_SALARIO_TIPO, NOMBRES_PERIODO,
  generarHojaInstrucciones, formatearDiasDescanso,
  DOCUMENTOS_TRONCO_COMUN, COLUMNAS_TRONCO_COMUN, NOMBRES_OPERADO_POR,
} from '@/lib/excel-vacantes'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function formatearFecha(fecha: string | null) {
  if (!fecha) return ''
  const d = new Date(fecha)
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const anio = d.getFullYear()
  return `${dia}/${mes}/${anio}`
}

export async function GET(req: NextRequest) {
  try {
    const agenciaId = req.nextUrl.searchParams.get('agenciaId')
    if (!agenciaId) {
      return NextResponse.json({ error: 'Falta agenciaId' }, { status: 400 })
    }

    const supabase = getServiceClient()

    const { data: vacantes, error } = await supabase
      .from('vacantes')
      .select(`
        id, created_at, fecha_publicacion, titulo, empresa_visible, destacada,
        estado, ciudad, colonia_zona, modalidad,
        salario_min, salario_max, salario_tipo, salario_periodo, salario_visible,
        jornada, turno, horario,
        descripcion, tags, requisitos, beneficios,
        tiene_ruta, zonas_ruta, ruta_para_entrevista, estacionamiento, comedor, uniforme,
        permite_directo_planta,
        proceso_reclutamiento, filtro_1, pase_de_visita,
        letras_chiquitas,
        dias_garantia, comision_base_mxn,
        tiene_promocion, promocion_descripcion, promocion_monto_mxn, promocion_fin,
        requiere_examen_medico, requiere_antidoping, requiere_estudio_socioeconomico,
        documentos_requeridos,
        contacto_rrhh_nombre, contacto_rrhh_telefono, mejor_horario_contacto,
        punto_reunion, guion_candidato, comentarios_salario,
        dias_induccion, induccion_dentro_garantia, cupo_requerido,
        status,
        negocios(nombre, dias_descanso, dias_entrevista, rutas, ubicacion_maps)
      `)
      .eq('agencia_id', agenciaId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 7.38 en Excel — catálogo de rutas/puntos de reclutamiento, por
    // negocio. Se trae aparte (no viene embebido en el select de arriba
    // porque son tablas propias sin FK directa desde vacantes) y se
    // arma un mapa por negocio_id para usarlo abajo.
    const { data: vacantesConNegocioId } = await supabase.from('vacantes').select('id, negocio_id').eq('agencia_id', agenciaId)
    const mapaVacanteNegocio = new Map((vacantesConNegocioId ?? []).map((v: any) => [v.id, v.negocio_id]))

    const idsNegociosReales = [...new Set([...mapaVacanteNegocio.values()].filter(Boolean))]

    const { data: rutasReclData } = idsNegociosReales.length > 0
      ? await supabase.from('rutas_reclutamiento').select('*').in('negocio_id', idsNegociosReales).order('created_at')
      : { data: [] }
    const { data: puntosReclData } = idsNegociosReales.length > 0
      ? await supabase.from('puntos_reclutamiento').select('*').in('negocio_id', idsNegociosReales).order('created_at')
      : { data: [] }

    const rutasReclPorNegocio = new Map<string, any[]>()
    for (const r of rutasReclData ?? []) {
      if (!rutasReclPorNegocio.has(r.negocio_id)) rutasReclPorNegocio.set(r.negocio_id, [])
      rutasReclPorNegocio.get(r.negocio_id)!.push(r)
    }
    const puntosReclPorNegocio = new Map<string, any[]>()
    for (const p of puntosReclData ?? []) {
      if (!puntosReclPorNegocio.has(p.negocio_id)) puntosReclPorNegocio.set(p.negocio_id, [])
      puntosReclPorNegocio.get(p.negocio_id)!.push(p)
    }

    const maxRequisitos = Math.max(1, ...(vacantes ?? []).map((v: any) => (v.requisitos ?? []).length))
    const maxBeneficios = Math.max(1, ...(vacantes ?? []).map((v: any) => (v.beneficios ?? []).length))
    // Documentos (2026-08-30): DOCUMENTO_N solo exporta los EXTRA, no los
    // de tronco común (esos ya tienen su propia columna SI/NO más abajo)
    const maxDocumentos = Math.max(1, ...(vacantes ?? []).map((v: any) =>
      (v.documentos_requeridos ?? []).filter((d: string) => !DOCUMENTOS_TRONCO_COMUN.includes(d)).length
    ))
    const maxRutas = Math.max(1, ...(vacantes ?? []).map((v: any) => (v.negocios?.rutas ?? []).length))
    // 7.38 en Excel — máximos por empresa, para columnas RUTA_RECLUTAMIENTO_N/PUNTO_RECLUTAMIENTO_N
    const maxRutasRecl = Math.max(1, ...(vacantes ?? []).map((v: any) => (rutasReclPorNegocio.get(mapaVacanteNegocio.get(v.id)) ?? []).length))
    const maxPuntosRecl = Math.max(1, ...(vacantes ?? []).map((v: any) => (puntosReclPorNegocio.get(mapaVacanteNegocio.get(v.id)) ?? []).length))

    const filas = (vacantes ?? []).map((v: any) => {
      const negocioIdDeEsta = mapaVacanteNegocio.get(v.id)
      const rutasReclEmpresa = negocioIdDeEsta ? (rutasReclPorNegocio.get(negocioIdDeEsta) ?? []) : []
      const puntosReclEmpresa = negocioIdDeEsta ? (puntosReclPorNegocio.get(negocioIdDeEsta) ?? []) : []

      const fila: Record<string, any> = {
        ID: v.id,
        FECHA: formatearFecha(v.fecha_publicacion),
        'TÍTULO': v.titulo,
        EMPRESA: v.negocios?.nombre ?? '',
        'MOSTRAR EMPRESA': v.empresa_visible ? 'SI' : 'NO',
        DESTACADA: v.destacada ? 'SI' : 'NO',
        ESTADO: v.estado,
        MUNICIPIO: v.ciudad,
        ZONA: v.colonia_zona ?? '',
        MODALIDAD: NOMBRES_MODALIDAD[v.modalidad] ?? v.modalidad,
        'SALARIO MÍNIMO': v.salario_min ?? '',
        'SALARIO MÁXIMO': v.salario_max ?? '',
        'TIPO SALARIO': NOMBRES_SALARIO_TIPO[v.salario_tipo] ?? '',
        'PERIODO SALARIO': NOMBRES_PERIODO[v.salario_periodo] ?? '',
        'MOSTRAR SALARIO': v.salario_visible ? 'SI' : 'NO',
        JORNADA: NOMBRES_JORNADA[v.jornada] ?? v.jornada,
        TURNO: v.turno && v.turno !== 'no_aplica' ? v.turno : '',
        HORARIO: v.horario ?? '',
        'DESCRIPCIÓN': v.descripcion,
        ETIQUETAS: Array.isArray(v.tags) ? v.tags.join(', ') : '',
      }

      // Layout reordenado a pedido de José (2026-09-01) para no
      // confundir RUTA PARA ENTREVISTA (Opción 4) con DIRECTO A PLANTA
      // (Opción 1) — quedan separadas, cada una junto a lo que sí se
      // relaciona con ella.
      for (let i = 0; i < maxRequisitos; i++) {
        fila[`REQUISITO_${i + 1}`] = v.requisitos?.[i] ?? ''
      }
      for (let i = 0; i < maxBeneficios; i++) {
        fila[`BENEFICIO_${i + 1}`] = v.beneficios?.[i] ?? ''
      }
      const documentosExtra = (v.documentos_requeridos ?? []).filter((d: string) => !DOCUMENTOS_TRONCO_COMUN.includes(d))
      for (let i = 0; i < maxDocumentos; i++) {
        fila[`DOCUMENTO_${i + 1}`] = documentosExtra[i] ?? ''
      }

      fila['RUTA'] = v.tiene_ruta ? 'SI' : 'NO'
      fila['ESTACIONAMIENTO'] = v.estacionamiento ? 'SI' : 'NO'
      fila['COMEDOR'] = v.comedor ? 'SI' : 'NO'
      fila['UNIFORME'] = v.uniforme ? 'SI' : 'NO'
      fila['LETRAS CHIQUITAS'] = v.letras_chiquitas ?? ''
      fila['DÍAS DE GARANTÍA'] = v.dias_garantia
      fila['COMISIÓN'] = v.comision_base_mxn
      fila['TIENE PROMOCIÓN'] = v.tiene_promocion ? 'SI' : 'NO'
      fila['DESCRIPCIÓN PROMOCIÓN'] = v.promocion_descripcion ?? ''
      fila['MONTO PROMOCIÓN'] = v.promocion_monto_mxn ?? ''
      fila['VENCE PROMOCIÓN'] = formatearFecha(v.promocion_fin)
      fila['EXAMEN MÉDICO'] = v.requiere_examen_medico ? 'SI' : 'NO'
      fila['ANTIDOPING'] = v.requiere_antidoping ? 'SI' : 'NO'
      fila['ESTUDIO SOCIOECONÓMICO'] = v.requiere_estudio_socioeconomico ? 'SI' : 'NO'
      fila['CONTACTO RRHH NOMBRE'] = v.contacto_rrhh_nombre ?? ''
      fila['CONTACTO RRHH TELÉFONO'] = v.contacto_rrhh_telefono ?? ''
      fila['MEJOR HORARIO CONTACTO'] = v.mejor_horario_contacto ?? ''

      // Documentos de tronco común: 8 columnas fijas SI/NO
      DOCUMENTOS_TRONCO_COMUN.forEach((nombreCompleto, i) => {
        fila[COLUMNAS_TRONCO_COMUN[i]] = (v.documentos_requeridos ?? []).includes(nombreCompleto) ? 'SI' : 'NO'
      })

      fila['PUNTO DE REUNIÓN'] = v.punto_reunion ?? ''
      fila['QUÉ DECIRLE AL CANDIDATO'] = v.guion_candidato ?? ''
      fila['COMENTARIOS SALARIO'] = v.comentarios_salario ?? ''
      fila['DÍAS DE INDUCCIÓN'] = v.dias_induccion ?? ''
      fila['INDUCCIÓN DENTRO DE GARANTÍA'] = v.induccion_dentro_garantia === false ? 'NO' : 'SI'
      fila['CUPO REQUERIDO'] = v.cupo_requerido ?? 1
      fila['DÍAS DE DESCANSO EMPRESA'] = formatearDiasDescanso(v.negocios?.dias_descanso)
      fila['DÍAS DE ENTREVISTA EMPRESA'] = formatearDiasDescanso(v.negocios?.dias_entrevista)

      // Rutas con nombre (transporte de trabajadores): pares NOMBRE/PARADAS
      const rutasEmpresa = v.negocios?.rutas ?? []
      for (let i = 0; i < maxRutas; i++) {
        fila[`RUTA_${i + 1}_NOMBRE`] = rutasEmpresa[i]?.nombre ?? ''
        fila[`RUTA_${i + 1}_PARADAS`] = Array.isArray(rutasEmpresa[i]?.paradas) ? rutasEmpresa[i].paradas.join(', ') : ''
      }

      fila['UBICACIÓN MAPS EMPRESA'] = v.negocios?.ubicacion_maps ?? ''

      // 7.38 en Excel — Opción 1 (directo a planta) y catálogo de
      // Opciones 2/3 (rutas y puntos de reclutamiento), todo junto
      fila['DIRECTO A PLANTA'] = v.permite_directo_planta === false ? 'NO' : 'SI'

      for (let i = 0; i < maxRutasRecl; i++) {
        const r = rutasReclEmpresa[i]
        fila[`RUTA_RECLUTAMIENTO_${i + 1}_NOMBRE`] = r?.nombre ?? ''
        fila[`RUTA_RECLUTAMIENTO_${i + 1}_OPERADO_POR`] = r ? (NOMBRES_OPERADO_POR[r.operado_por] ?? '') : ''
        fila[`RUTA_RECLUTAMIENTO_${i + 1}_CHOFER_VEHICULO`] = r?.chofer_vehiculo ?? ''
        fila[`RUTA_RECLUTAMIENTO_${i + 1}_CONTACTO`] = r?.contacto_nombre ?? ''
        fila[`RUTA_RECLUTAMIENTO_${i + 1}_MAPS`] = r?.ubicacion_maps ?? ''
        fila[`RUTA_RECLUTAMIENTO_${i + 1}_PARADAS`] = Array.isArray(r?.paradas) ? r.paradas.join('\n') : ''
      }
      for (let i = 0; i < maxPuntosRecl; i++) {
        const p = puntosReclEmpresa[i]
        fila[`PUNTO_RECLUTAMIENTO_${i + 1}_NOMBRE`] = p?.nombre ?? ''
        fila[`PUNTO_RECLUTAMIENTO_${i + 1}_OPERADO_POR`] = p ? (NOMBRES_OPERADO_POR[p.operado_por] ?? '') : ''
        fila[`PUNTO_RECLUTAMIENTO_${i + 1}_DIRECCION`] = p?.direccion ?? ''
        fila[`PUNTO_RECLUTAMIENTO_${i + 1}_MAPS`] = p?.ubicacion_maps ?? ''
        fila[`PUNTO_RECLUTAMIENTO_${i + 1}_HORARIO`] = p?.horario ?? ''
        fila[`PUNTO_RECLUTAMIENTO_${i + 1}_CONTACTO_NOMBRE`] = p?.contacto_nombre ?? ''
      }

      // Opción 4 (transporte de la empresa) — al final, para no
      // confundirla con "Directo a planta" (José, 2026-09-01)
      fila['RUTA PARA ENTREVISTA'] = v.ruta_para_entrevista ? 'SI' : 'NO'

      // Nuevo (2026-09-05) — por VACANTE, no por empresa
      fila['PROCESO_RECLUTAMIENTO'] = v.proceso_reclutamiento ?? ''
      fila['FILTRO_1'] = v.filtro_1 ?? ''
      fila['PASE_DE_VISITA'] = v.pase_de_visita ? 'SI' : 'NO'

      fila['ESTATUS'] = v.status === 'vigente' ? 'Vigente' : v.status === 'pausada' ? 'Pausada' : 'Cerrada'

      return fila
    })

    const libro = XLSX.utils.book_new()

    const hojaVacantes = XLSX.utils.json_to_sheet(filas)
    XLSX.utils.book_append_sheet(libro, hojaVacantes, 'Vacantes')

    const hojaInstrucciones = XLSX.utils.aoa_to_sheet(generarHojaInstrucciones())
    XLSX.utils.book_append_sheet(libro, hojaInstrucciones, 'Instrucciones')

    const buffer = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="vacantes_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error inesperado' }, { status: 500 })
  }
}
