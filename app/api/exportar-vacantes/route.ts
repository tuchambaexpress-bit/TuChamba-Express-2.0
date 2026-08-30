import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import {
  NOMBRES_JORNADA, NOMBRES_MODALIDAD, NOMBRES_SALARIO_TIPO, NOMBRES_PERIODO,
  generarHojaInstrucciones, formatearDiasDescanso,
  DOCUMENTOS_TRONCO_COMUN, COLUMNAS_TRONCO_COMUN,
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

    const maxRequisitos = Math.max(1, ...(vacantes ?? []).map((v: any) => (v.requisitos ?? []).length))
    const maxBeneficios = Math.max(1, ...(vacantes ?? []).map((v: any) => (v.beneficios ?? []).length))
    // Documentos (2026-08-30): DOCUMENTO_N solo exporta los EXTRA, no los
    // de tronco común (esos ya tienen su propia columna SI/NO más abajo)
    const maxDocumentos = Math.max(1, ...(vacantes ?? []).map((v: any) =>
      (v.documentos_requeridos ?? []).filter((d: string) => !DOCUMENTOS_TRONCO_COMUN.includes(d)).length
    ))
    const maxRutas = Math.max(1, ...(vacantes ?? []).map((v: any) => (v.negocios?.rutas ?? []).length))

    const filas = (vacantes ?? []).map((v: any) => {
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

      for (let i = 0; i < maxRequisitos; i++) {
        fila[`REQUISITO_${i + 1}`] = v.requisitos?.[i] ?? ''
      }
      for (let i = 0; i < maxBeneficios; i++) {
        fila[`BENEFICIO_${i + 1}`] = v.beneficios?.[i] ?? ''
      }
      // Documentos extra (no tronco común) en las columnas dinámicas
      const documentosExtra = (v.documentos_requeridos ?? []).filter((d: string) => !DOCUMENTOS_TRONCO_COMUN.includes(d))
      for (let i = 0; i < maxDocumentos; i++) {
        fila[`DOCUMENTO_${i + 1}`] = documentosExtra[i] ?? ''
      }

      fila['RUTA'] = v.tiene_ruta ? 'SI' : 'NO'
      fila['RUTA PARA ENTREVISTA'] = v.ruta_para_entrevista ? 'SI' : 'NO'
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
      // Documentos de tronco común (2026-08-30): 8 columnas fijas SI/NO,
      // una por cada documento — reemplaza el texto libre de antes
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
      // Rutas con nombre: exporta pares RUTA_N_NOMBRE/RUTA_N_PARADAS.
      // Se garantiza al menos 1 par (aunque esté vacío), mismo criterio
      // que Requisitos/Beneficios/Documentos.
      const rutasEmpresa = v.negocios?.rutas ?? []
      for (let i = 0; i < maxRutas; i++) {
        fila[`RUTA_${i + 1}_NOMBRE`] = rutasEmpresa[i]?.nombre ?? ''
        fila[`RUTA_${i + 1}_PARADAS`] = Array.isArray(rutasEmpresa[i]?.paradas) ? rutasEmpresa[i].paradas.join(', ') : ''
      }
      fila['UBICACIÓN MAPS EMPRESA'] = v.negocios?.ubicacion_maps ?? ''
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
