import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import {
  JORNADA_INVERSO, MODALIDAD_INVERSO, SALARIO_TIPO_INVERSO, PERIODO_INVERSO,
  esSiNo, parsearFecha, normalizarNombre, parsearDiasDescanso,
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
    const libro = XLSX.read(bytes, { type: 'array' })

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
          documentos_requeridos: extraerListaDinamica(fila, 'DOCUMENTO'),
          tiene_ruta: esSiNo(fila['RUTA']),
          zonas_ruta: String(fila['ZONAS DE RUTA'] ?? '').split(',').map(z => z.trim()).filter(Boolean),
          ruta_para_entrevista: esSiNo(fila['RUTA PARA ENTREVISTA']),
          estacionamiento: esSiNo(fila['ESTACIONAMIENTO']),
          comedor: esSiNo(fila['COMEDOR']),
          uniforme: esSiNo(fila['UNIFORME']),
          letras_chiquitas: String(fila['LETRAS CHIQUITAS'] ?? '').trim() || null,
          dias_garantia: diasGarantia,
          comision_base_mxn: comision,
          tiene_promocion: esSiNo(fila['TIENE PROMOCIÓN']),
          promocion_descripcion: String(fila['DESCRIPCIÓN PROMOCIÓN'] ?? '').trim() || null,
          promocion_monto_mxn: fila['MONTO PROMOCIÓN'] ? Number(fila['MONTO PROMOCIÓN']) : null,
          promocion_fin: parsearFecha(String(fila['VENCE PROMOCIÓN'] ?? '')),
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
          status: String(fila['ESTATUS'] ?? '').trim().toLowerCase() === 'vigente' ? 'vigente' : 'pausada',
          agencia_id: agenciaId,
        }

        // CA-08.8: guarda los días de descanso de esta fila para aplicarlos
        // a la empresa al final (si viene vacío, no se toca lo que ya tenía)
        const diasDescansoTexto = String(fila['DÍAS DE DESCANSO EMPRESA'] ?? '').trim()
        if (negocioId && diasDescansoTexto) {
          diasDescansoPorNegocio.set(negocioId, parsearDiasDescanso(diasDescansoTexto))
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

        if (idExistente) {
          const { error: errorUpdate } = await supabase.from('vacantes').update(payload).eq('id', idExistente)
          if (errorUpdate) { errores.push({ fila: numFila, motivo: errorUpdate.message }); continue }
          actualizadas++
        } else {
          const { error: errorInsert } = await supabase.from('vacantes').insert(payload)
          if (errorInsert) { errores.push({ fila: numFila, motivo: errorInsert.message }); continue }
          creadas++
        }
      } catch (errFila: any) {
        errores.push({ fila: numFila, motivo: errFila?.message ?? 'Error inesperado en esta fila' })
      }
    }

    // CA-08.8: aplica los días de descanso acumulados, uno por empresa
    for (const [negocioId, dias] of diasDescansoPorNegocio) {
      await supabase.from('negocios').update({ dias_descanso: dias }).eq('id', negocioId)
    }

    return NextResponse.json({ ok: true, creadas, actualizadas, errores })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error inesperado' }, { status: 500 })
  }
}
