'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChevronDown, X } from 'lucide-react'
import InfoTooltip from '@/components/ui/InfoTooltip'
import { EditableList } from '@/components/forms/EditableList'

interface Negocio {
  id: string
  nombre: string
  dias_descanso: number[]
  dias_entrevista: number[]
}

interface Props {
  abierto: boolean
  onCerrar: () => void
  agenciaId: string
  vacanteId?: string | null       // si viene, es modo edición
  vacanteDuplicar?: any | null    // si viene, precarga datos (CA-20.2)
  onGuardado: () => void
}

const SECCIONES = [
  { id: 'identidad', titulo: '1. Identidad' },
  { id: 'ubicacion', titulo: '2. Ubicación y modalidad' },
  { id: 'condiciones', titulo: '3. Condiciones laborales' },
  { id: 'descripcion', titulo: '4. Descripción operativa' },
  { id: 'logistica', titulo: '5. Logística especial' },
  { id: 'letras', titulo: '6. Letras chiquitas' },
  { id: 'reclutamiento', titulo: '7. Parámetros de reclutamiento' },
  { id: 'proceso', titulo: '8. Proceso de selección' },
]

const DOCUMENTOS_TRONCO_COMUN = [
  'RFC (Constancia de situación fiscal)',
  'INE vigente',
  'Comprobante de domicilio (no mayor a 3 meses)',
  'CURP',
  'NSS (Hoja de seguridad social IMSS)',
  'Acta de nacimiento',
  'Hoja de retención Infonavit (de contar con crédito)',
  'Comprobante de estudios',
]

const FORM_INICIAL = {
  titulo: '',
  negocio_id: '',
  empresa_visible: true,
  ciudad: '',
  estado: '',
  colonia_zona: '',
  modalidad: 'presencial',
  jornada: 'completo',
  horario: '',
  turno: 'no_aplica',
  letras_chiquitas: '',
  dias_garantia: 30,
  comision_base_mxn: 0,
  tiene_promocion: false,
  promocion_descripcion: '',
  promocion_monto_mxn: '',
  promocion_fin: '',
  descripcion: '',
  requisitos: [] as string[],
  beneficios: [] as string[],
  preguntas_precalificacion: [] as any[],
  salario_min: '',
  comentarios_salario: '',
  salario_max: '',
  salario_tipo: 'neto',
  salario_periodo: 'semanal',
  salario_visible: true,
  destacada: false,
  tiene_ruta: false,
  zonas_ruta: [] as string[],
  ruta_para_entrevista: false,
  estacionamiento: false,
  comedor: false,
  uniforme: false,
  documentos_requeridos: [] as string[],
  requiere_examen_medico: false,
  requiere_antidoping: false,
  requiere_estudio_socioeconomico: false,
  contacto_rrhh_nombre: '',
  contacto_rrhh_telefono: '',
  mejor_horario_contacto: '',
  guion_candidato: '',
  punto_reunion: '',
  dias_induccion: 0,
  induccion_dentro_garantia: true,
  cupo_requerido: 1,
  prioridad: 'normal',
}

function normalizarNombreNegocio(texto: string) {
  return texto
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .replace(/\s+/g, ' ') // colapsa espacios dobles
    .trim()
}

export default function VacanteModal({ abierto, onCerrar, agenciaId, vacanteId, vacanteDuplicar, onGuardado }: Props) {
  const [seccionAbierta, setSeccionAbierta] = useState('identidad')

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar()
    }
    if (abierto) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [abierto, onCerrar])
  const [form, setForm] = useState<any>(FORM_INICIAL)
  const [ciudadesExistentes, setCiudadesExistentes] = useState<string[]>([])
  const [estadosExistentes, setEstadosExistentes] = useState<string[]>([])

  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [cupoInfo, setCupoInfo] = useState({ contratados: 0, enProceso: 0, disponibles: 0 })
  const statusOriginal = useRef<string | null>(null)

  useEffect(() => {
    if (!vacanteId || !abierto) return
    async function cargarCupo() {
      const supabase = createClient()
      const { data: vacanteData } = await supabase
        .from('vacantes')
        .select('cupo_desde, status')
        .eq('id', vacanteId)
        .maybeSingle()

      statusOriginal.current = vacanteData?.status ?? null
      const cupoDesde = vacanteData?.cupo_desde ?? '1970-01-01'

      const { data } = await supabase
        .from('postulaciones')
        .select('etapa_actual, comision_aplicable, fecha_contratacion')
        .eq('vacante_id', vacanteId)

      // HU-16 (6.8b): "por rondas" — solo cuenta lo que entró a Inducción
      // DESPUÉS de la última vez que se reactivó la vacante (cupo_desde).
      const ocupados = (data ?? []).filter(p =>
        p.comision_aplicable && p.fecha_contratacion && p.fecha_contratacion >= cupoDesde.split('T')[0]
      ).length
      const enProceso = (data ?? []).filter(p => p.etapa_actual === 'Entrevista').length
      const requerido = Number(form.cupo_requerido) || 1
      setCupoInfo({ contratados: ocupados, enProceso, disponibles: requerido - ocupados })
    }
    cargarCupo()
  }, [vacanteId, abierto, form.cupo_requerido])
  const [creandoNegocio, setCreandoNegocio] = useState(false)
  const [diasDescanso, setDiasDescanso] = useState<number[]>([0])
  const [diasEntrevista, setDiasEntrevista] = useState<number[]>([1, 2, 3, 4, 5])

  // Al elegir una empresa existente, carga sus días de descanso y de
  // entrevista ya guardados
  useEffect(() => {
    if (creandoNegocio || !form.negocio_id) return
    const negocio = negocios.find(n => n.id === form.negocio_id)
    if (negocio) {
      setDiasDescanso(negocio.dias_descanso ?? [0])
      setDiasEntrevista(negocio.dias_entrevista ?? [1, 2, 3, 4, 5])
    }
  }, [form.negocio_id, negocios, creandoNegocio])
  const [documentosRuta, setDocumentosRuta] = useState<any[]>([])
  const [cargandoDocsRuta, setCargandoDocsRuta] = useState(false)
  const [subiendoDocRuta, setSubiendoDocRuta] = useState(false)
  const [errorDocRuta, setErrorDocRuta] = useState('')
  const [fileInputRutaKey, setFileInputRutaKey] = useState(0)
  const [nuevoNegocio, setNuevoNegocio] = useState({ nombre: '', industria: '', contacto_nombre: '', contacto_telefono: '', contacto_email: '' })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!abierto) return
    cargarNegocios()

    if (vacanteDuplicar) {
      // CA-20.2: precarga todo excepto cupo_cubierto (0) y status ('vigente')
      setForm({
        ...FORM_INICIAL,
        ...vacanteDuplicar,
        id: undefined,
        cupo_cubierto: 0,
        status: 'vigente',
      })
    } else if (vacanteId) {
      cargarVacante(vacanteId)
    } else {
      setForm(FORM_INICIAL)
    }
  }, [abierto, vacanteId, vacanteDuplicar])

  async function cargarNegocios() {
    const supabase = createClient()
    const { data } = await supabase
      .from('negocios')
      .select('id, nombre, dias_descanso, dias_entrevista')
      .order('nombre')
    if (data) setNegocios(data)
  }

  async function cargarDocumentosRuta(negocioId: string) {
    setCargandoDocsRuta(true)
    const res = await fetch(`/api/documentos-negocio?negocioId=${negocioId}`)
    const data = await res.json()
    setDocumentosRuta(data.documentos ?? [])
    setCargandoDocsRuta(false)
  }

  async function subirDocumentoRuta(archivo: File) {
    if (!form.negocio_id) return
    setSubiendoDocRuta(true)
    setErrorDocRuta('')

    const formData = new FormData()
    formData.append('file', archivo)
    formData.append('negocioId', form.negocio_id)

    const res = await fetch('/api/documentos-negocio', { method: 'POST', body: formData })
    const data = await res.json()

    if (!res.ok) {
      setErrorDocRuta(data.error ?? 'Error al subir el archivo')
    } else {
      setFileInputRutaKey(k => k + 1)
      await cargarDocumentosRuta(form.negocio_id)
    }
    setSubiendoDocRuta(false)
  }

  async function eliminarDocumentoRuta(id: string) {
    if (!confirm('¿Eliminar este PDF de rutas? Esta acción no se puede deshacer.')) return
    await fetch(`/api/documentos-negocio?id=${id}`, { method: 'DELETE' })
    if (form.negocio_id) await cargarDocumentosRuta(form.negocio_id)
  }

  async function cargarCiudadesYEstados() {
    const supabase = createClient()
    const { data } = await supabase.from('vacantes').select('ciudad, estado').eq('agencia_id', agenciaId)
    if (data) {
      setCiudadesExistentes([...new Set(data.map((v: any) => v.ciudad).filter(Boolean))] as string[])
      setEstadosExistentes([...new Set(data.map((v: any) => v.estado).filter(Boolean))] as string[])
    }
  }

  useEffect(() => {
    if (abierto) cargarCiudadesYEstados()
  }, [abierto])

  async function cargarVacante(id: string) {
    const supabase = createClient()
    const { data } = await supabase.from('vacantes').select('*').eq('id', id).single()
    if (data) {
      // Ningún input controlado acepta `null` — convertimos cualquier campo
      // nulo a cadena vacía, sin importar cuál sea (texto, numérico, etc.)
      const dataLimpia: any = { ...data }
      Object.keys(dataLimpia).forEach(campo => {
        if (dataLimpia[campo] === null) dataLimpia[campo] = ''
      })
      setForm(dataLimpia)
    }
  }

  function toggleSeccion(id: string) {
    setSeccionAbierta(prev => prev === id ? '' : id)
  }

  async function guardar() {
    setError('')

    for (const p of form.preguntas_precalificacion) {
      if (p.tipo === 'opcion_multiple' && (p.opciones ?? []).length < 2) {
        return setError(`La pregunta "${p.pregunta || '(sin texto)'}" necesita al menos 2 opciones`)
      }
    }

    // Campos siempre requeridos (ver spec.md CA-06 / tasks.md 5.6)
    if (!form.titulo?.trim()) return setError('El título es obligatorio')
    if (!form.ciudad?.trim()) return setError('La ciudad es obligatoria')
    if (!form.estado?.trim()) return setError('El estado es obligatorio')
    if (!form.jornada) return setError('La jornada es obligatoria')
    if (form.dias_garantia === '' || Number(form.dias_garantia) <= 0) return setError('Los días de garantía deben ser mayores a 0')
    if (form.comision_base_mxn === '' || form.comision_base_mxn === null || isNaN(Number(form.comision_base_mxn))) return setError('La comisión base es obligatoria')
    if (faltantesObligatorios.length > 0) return setError(`Faltan campos obligatorios: ${faltantesObligatorios.join(', ')}`)

    setGuardando(true)
    const supabase = createClient()

    let negocioId = form.negocio_id

    // CA-20.1: crear negocio inline — verificando primero que no exista ya
    if (creandoNegocio) {
      const nombreLimpio = nuevoNegocio.nombre.trim()
      if (!nombreLimpio) {
        setError('El nombre del negocio es obligatorio')
        setGuardando(false)
        return
      }

      // Filtro inteligente: normaliza acentos/mayúsculas/espacios antes de comparar,
      // para detectar "Pastelería Lety" = "pasteleria  lety" = "PASTELERIA LETY"
      const { data: todosNegocios } = await supabase.from('negocios').select('id, nombre')
      const nombreNormalizado = normalizarNombreNegocio(nombreLimpio)
      const existente = (todosNegocios ?? []).find(
        n => normalizarNombreNegocio(n.nombre) === nombreNormalizado
      )

      if (existente) {
        setError(`Ya existe una empresa llamada "${existente.nombre}" — selecciónala de la lista en vez de crear una nueva.`)
        setGuardando(false)
        return
      }

      const { data: negocioCreado, error: errorNegocio } = await supabase
        .from('negocios')
        .insert({ ...nuevoNegocio, nombre: nombreLimpio, dias_descanso: diasDescanso, dias_entrevista: diasEntrevista })
        .select('id')
        .single()

      if (errorNegocio || !negocioCreado) {
        setError('No se pudo crear el negocio: ' + (errorNegocio?.message ?? ''))
        setGuardando(false)
        return
      }
      negocioId = negocioCreado.id
    } else if (negocioId) {
      // Empresa existente: días de descanso y de entrevista aplican a TODAS sus vacantes
      await supabase.from('negocios').update({ dias_descanso: diasDescanso, dias_entrevista: diasEntrevista }).eq('id', negocioId)
    }

    const payload = {
      titulo: form.titulo.trim(),
      negocio_id: negocioId || null,
      empresa_visible: form.empresa_visible,
      ciudad: form.ciudad.trim(),
      estado: form.estado.trim(),
      colonia_zona: form.colonia_zona?.trim() || null,
      modalidad: form.modalidad,
      jornada: form.jornada,
      horario: form.horario?.trim() || null,
      turno: form.turno ?? 'no_aplica',
      letras_chiquitas: form.letras_chiquitas || null,
      dias_garantia: Number(form.dias_garantia),
      comision_base_mxn: Number(form.comision_base_mxn),
      tiene_promocion: form.tiene_promocion,
      promocion_descripcion: form.tiene_promocion ? (form.promocion_descripcion || null) : null,
      promocion_monto_mxn: form.tiene_promocion && form.promocion_monto_mxn ? Number(form.promocion_monto_mxn) : null,
      promocion_fin: form.tiene_promocion && form.promocion_fin ? form.promocion_fin : null,
      agencia_id: agenciaId,
      // HU-16 (6.8b): si al guardar el nuevo cupo_requerido ya queda cubierto
      // con lo que hay, se pausa aquí también — no solo cuando el candidato
      // avanza, sino cuando el coordinador ajusta el número hacia abajo.
      status: (form.status === 'vigente' && cupoInfo.disponibles <= 0) ? 'pausada' : (form.status ?? 'vigente'),
      // HU-16 (6.8b): nueva ronda de cupo — se marca solo cuando de verdad
      // se reactiva (pasa de algo distinto a "vigente"), no en cada guardado.
      ...((!vacanteId || (statusOriginal.current && statusOriginal.current !== 'vigente' && form.status === 'vigente'))
        ? { cupo_desde: new Date().toISOString() }
        : {}),
      descripcion: form.descripcion?.trim() || form.titulo.trim(),
      requisitos: form.requisitos,
      beneficios: form.beneficios,
      preguntas_precalificacion: form.preguntas_precalificacion,
      salario_min: form.salario_min ? Number(form.salario_min) : null,
      comentarios_salario: form.comentarios_salario?.trim() || null,
      salario_max: form.salario_max ? Number(form.salario_max) : null,
      salario_tipo: form.salario_tipo,
      salario_periodo: form.salario_periodo,
      salario_visible: form.salario_visible,
      destacada: form.destacada,
      tiene_ruta: form.tiene_ruta,
      zonas_ruta: form.tiene_ruta ? form.zonas_ruta : [],
      ruta_para_entrevista: form.tiene_ruta ? form.ruta_para_entrevista : false,
      estacionamiento: form.estacionamiento,
      comedor: form.comedor,
      uniforme: form.uniforme,
      documentos_requeridos: form.documentos_requeridos,
      requiere_examen_medico: form.requiere_examen_medico,
      requiere_antidoping: form.requiere_antidoping,
      requiere_estudio_socioeconomico: form.requiere_estudio_socioeconomico,
      contacto_rrhh_nombre: form.contacto_rrhh_nombre || null,
      contacto_rrhh_telefono: form.contacto_rrhh_telefono || null,
      mejor_horario_contacto: form.mejor_horario_contacto || null,
      guion_candidato: form.guion_candidato?.trim() || null,
      punto_reunion: form.punto_reunion?.trim() || null,
      dias_induccion: form.dias_induccion ? Number(form.dias_induccion) : 0,
      induccion_dentro_garantia: form.induccion_dentro_garantia,
      cupo_requerido: form.cupo_requerido ? Number(form.cupo_requerido) : 1,
      prioridad: form.prioridad || 'normal',
    }

    const { error: errorGuardado } = vacanteId && !vacanteDuplicar
      ? await supabase.from('vacantes').update(payload).eq('id', vacanteId)
      : await supabase.from('vacantes').insert(payload)

    setGuardando(false)

    if (errorGuardado) {
      setError('Error al guardar: ' + errorGuardado.message)
      return
    }

    // 5.12: si la vacante ya no queda vigente, las preguntas pendientes sin
    // contestar dejan de tener sentido — se borran (las ya contestadas se quedan).
    if (payload.status !== 'vigente') {
      const idVacanteAfectada = vacanteId && !vacanteDuplicar ? vacanteId : null
      if (idVacanteAfectada) {
        await supabase
          .from('faq_escalaciones')
          .delete()
          .eq('vacante_id', idVacanteAfectada)
          .is('respuesta', null)
      }
    }

    onGuardado()
    onCerrar()
  }

  // 5.6 + 5.16: lista real de OBLIGATORIOS por sección (tabla de José, 2026-08-17)
  const faltantesObligatorios: string[] = []
  const seccionesConFaltantes = new Set<string>()

  if (!form.titulo?.trim()) { faltantesObligatorios.push('título'); seccionesConFaltantes.add('identidad') }
  if (!form.negocio_id && !(creandoNegocio && nuevoNegocio.nombre?.trim())) {
    faltantesObligatorios.push('empresa'); seccionesConFaltantes.add('identidad')
  }
  if (!form.ciudad?.trim() || !form.estado?.trim()) { faltantesObligatorios.push('ciudad/estado'); seccionesConFaltantes.add('ubicacion') }
  if (!form.horario?.trim()) { faltantesObligatorios.push('horario detallado'); seccionesConFaltantes.add('condiciones') }
  if (!form.salario_min) { faltantesObligatorios.push('salario'); seccionesConFaltantes.add('condiciones') }
  if (!form.requisitos || form.requisitos.length === 0) { faltantesObligatorios.push('requisitos (mínimo 1)'); seccionesConFaltantes.add('descripcion') }
  if (!form.beneficios || form.beneficios.length === 0) { faltantesObligatorios.push('beneficios (mínimo 1)'); seccionesConFaltantes.add('descripcion') }
  if (form.dias_garantia === '' || Number(form.dias_garantia) <= 0 || form.comision_base_mxn === '' || form.comision_base_mxn === null || isNaN(Number(form.comision_base_mxn))) {
    faltantesObligatorios.push('días de garantía / comisión base'); seccionesConFaltantes.add('reclutamiento')
  }
  const troncoComunSeleccionados = (form.documentos_requeridos ?? []).filter((d: string) => DOCUMENTOS_TRONCO_COMUN.includes(d))
  if (troncoComunSeleccionados.length === 0) { faltantesObligatorios.push('documentos tronco común (mínimo 1)'); seccionesConFaltantes.add('proceso') }

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b border-gray-100 z-10">
          <div>
            <h2 className="font-bold text-gray-900">
              {vacanteDuplicar ? 'Duplicar vacante' : vacanteId ? 'Editar vacante' : 'Nueva vacante'}
            </h2>
            {(vacanteId || vacanteDuplicar) && form.titulo && (
              <p className="text-xs text-gray-500 mt-0.5">
                {form.titulo}
                {negocios.find(n => n.id === form.negocio_id)?.nombre ? ` — ${negocios.find(n => n.id === form.negocio_id)?.nombre}` : ''}
              </p>
            )}
            {faltantesObligatorios.length > 0 ? (
              <p className="text-[11px] text-red-600 mt-1">
                ⚠️ Incompleta: falta {faltantesObligatorios.join(', ')}
              </p>
            ) : (
              <p className="text-[11px] text-green-600 mt-1">✅ Ficha completa</p>
            )}
          </div>
          <button onClick={onCerrar} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {SECCIONES.map(s => (
            <div key={s.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSeccion(s.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  seccionAbierta === s.id
                    ? 'bg-blue-50 hover:bg-blue-100'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <span className={`text-sm font-medium flex items-center gap-1.5 ${seccionAbierta === s.id ? 'text-blue-800' : 'text-gray-800'}`}>
                  {s.titulo}
                  {seccionesConFaltantes.has(s.id) && (
                    <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="Falta información obligatoria en esta sección" />
                  )}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${seccionAbierta === s.id ? 'rotate-180 text-blue-500' : 'text-gray-500'}`} />
              </button>

              {seccionAbierta === s.id && (
                <div className="p-4 space-y-3">
                  {s.id === 'descripcion' ? (
                    <>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-1">
                        <p className="text-[11px] text-blue-700">
                          👁️ Toda esta sección es visible al <strong>candidato</strong> en la ficha de la vacante.
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 flex items-center mb-1">
                          Descripción del puesto
                          <InfoTooltip texto="Breve resumen de en qué consiste el trabajo día a día. Si lo dejas vacío, se usa el título de la vacante." />
                        </label>
                        <textarea
                          value={form.descripcion}
                          onChange={e => setForm({ ...form, descripcion: e.target.value })}
                          placeholder="Ej. Operación de línea de producción bajo supervisión."
                          rows={2}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 flex items-center mb-1">
                          Requisitos
                          <InfoTooltip texto="Lo que el candidato debe cumplir para el puesto, uno por uno (ej. 'Secundaria terminada'). Arrastra el ícono ⠿ para reordenar." />
                        </label>
                        <EditableList
                          items={form.requisitos}
                          onChange={(items) => setForm({ ...form, requisitos: items })}
                          placeholder="Ej. Secundaria terminada"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 flex items-center mb-1">
                          Beneficios
                          <InfoTooltip texto="Lo que la empresa ofrece, uno por uno (ej. 'Vales de despensa')." />
                        </label>
                        <EditableList
                          items={form.beneficios}
                          onChange={(items) => setForm({ ...form, beneficios: items })}
                          placeholder="Ej. Vales de despensa"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700 flex items-center mb-1">
                          Preguntas de pre-calificación (máximo 5)
                          <InfoTooltip texto="El candidato las responde antes de conectarse con el reclutador. Si falla una, se le muestran vacantes alternativas en vez de conectarlo. Déjalo vacío si no quieres filtro." />
                        </label>
                        {form.preguntas_precalificacion.map((p: any, i: number) => (
                          <div key={p.id} className="border border-gray-200 rounded-xl p-3 mb-2 space-y-2">
                            <div className="flex items-start gap-2">
                              <input
                                value={p.pregunta}
                                onChange={e => {
                                  const nuevas = [...form.preguntas_precalificacion]
                                  nuevas[i] = { ...p, pregunta: e.target.value }
                                  setForm({ ...form, preguntas_precalificacion: nuevas })
                                }}
                                placeholder="Ej. ¿Tienes secundaria terminada?"
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                              />
                              <button
                                type="button"
                                onClick={() => setForm({ ...form, preguntas_precalificacion: form.preguntas_precalificacion.filter((_: any, idx: number) => idx !== i) })}
                                className="text-red-400 hover:text-red-600 text-sm px-2"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <select
                                value={p.tipo}
                                onChange={e => {
                                  const nuevas = [...form.preguntas_precalificacion]
                                  nuevas[i] = { ...p, tipo: e.target.value, opciones: e.target.value === 'si_no' ? undefined : [], respuesta_correcta: '', filtra: true }
                                  setForm({ ...form, preguntas_precalificacion: nuevas })
                                }}
                                className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                              >
                                <option value="si_no">Sí / No</option>
                                <option value="opcion_multiple">Opción múltiple</option>
                                <option value="texto_libre">Texto libre (no filtra, solo informativa)</option>
                              </select>
                              {p.tipo === 'si_no' && (
                                <select
                                  value={p.respuesta_correcta}
                                  onChange={e => {
                                    const nuevas = [...form.preguntas_precalificacion]
                                    nuevas[i] = { ...p, respuesta_correcta: e.target.value }
                                    setForm({ ...form, preguntas_precalificacion: nuevas })
                                  }}
                                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                                >
                                  <option value="">Respuesta correcta...</option>
                                  <option value="Sí">Sí</option>
                                  <option value="No">No</option>
                                </select>
                              )}
                            </div>

                            {p.tipo === 'opcion_multiple' && (
                              <div className="space-y-2">
                                <EditableList
                                  items={p.opciones ?? []}
                                  onChange={(items) => {
                                    const nuevas = [...form.preguntas_precalificacion]
                                    const siguenValida = items.includes(p.respuesta_correcta)
                                    nuevas[i] = { ...p, opciones: items, respuesta_correcta: siguenValida ? p.respuesta_correcta : '' }
                                    setForm({ ...form, preguntas_precalificacion: nuevas })
                                  }}
                                  placeholder="Ej. Ruta 1"
                                />
                                {(p.opciones ?? []).length < 2 && (
                                  <p className="text-[11px] text-amber-600">Agrega al menos 2 opciones.</p>
                                )}
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={p.filtra !== false}
                                    onChange={e => {
                                      const nuevas = [...form.preguntas_precalificacion]
                                      nuevas[i] = { ...p, filtra: e.target.checked, respuesta_correcta: e.target.checked ? p.respuesta_correcta : '' }
                                      setForm({ ...form, preguntas_precalificacion: nuevas })
                                    }}
                                    className="accent-[#1A6B3C]"
                                  />
                                  <span className="text-xs text-gray-600">¿Tiene respuesta correcta? (si no, solo es informativa)</span>
                                </label>
                                {p.filtra !== false && (
                                  <select
                                    value={p.respuesta_correcta}
                                    onChange={e => {
                                      const nuevas = [...form.preguntas_precalificacion]
                                      nuevas[i] = { ...p, respuesta_correcta: e.target.value }
                                      setForm({ ...form, preguntas_precalificacion: nuevas })
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                                  >
                                    <option value="">Respuesta correcta...</option>
                                    {(p.opciones ?? []).map((op: string) => <option key={op} value={op}>{op}</option>)}
                                  </select>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        {form.preguntas_precalificacion.length < 5 && (
                          <button
                            type="button"
                            onClick={() => setForm({
                              ...form,
                              preguntas_precalificacion: [...form.preguntas_precalificacion, { id: crypto.randomUUID(), pregunta: '', tipo: 'si_no', respuesta_correcta: '' }]
                            })}
                            className="text-xs text-[#1A6B3C] hover:underline"
                          >
                            + Agregar pregunta
                          </button>
                        )}
                      </div>
                    </>
                  ) : s.id === 'logistica' ? (
                    <>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-1">
                        <p className="text-[11px] text-blue-700">
                          👁️ Toda esta sección es visible al <strong>candidato</strong> en la ficha de la vacante.
                        </p>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.tiene_ruta}
                          onChange={e => {
                            const activado = e.target.checked
                            setForm({ ...form, tiene_ruta: activado })
                            if (activado && form.negocio_id) cargarDocumentosRuta(form.negocio_id)
                          }}
                          className="accent-[#1A6B3C]"
                        />
                        <span className="text-sm text-gray-700 flex items-center">
                          🚌 ¿La empresa ofrece ruta de transporte?
                        </span>
                      </label>

                      {form.tiene_ruta && !form.negocio_id && (
                        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
                          Selecciona primero una empresa en la Sección 1 para poder subir sus documentos de rutas.
                        </p>
                      )}

                      {form.tiene_ruta && form.negocio_id && (
                        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                          <p className="text-xs font-medium text-gray-700 flex items-center">
                            📎 PDFs de rutas de {negocios.find(n => n.id === form.negocio_id)?.nombre}
                            <InfoTooltip texto="Compartido entre todas las vacantes de esta empresa — si lo subes o borras aquí, se refleja en todas." />
                          </p>
                          {cargandoDocsRuta ? (
                            <p className="text-xs text-gray-400">Cargando...</p>
                          ) : documentosRuta.length === 0 ? (
                            <p className="text-xs text-gray-400">Sin documentos subidos todavía</p>
                          ) : (
                            <div className="space-y-1">
                              {documentosRuta.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-2 py-1.5">
                                  <a href={doc.archivo_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1A6B3C] hover:underline truncate flex-1">
                                    📄 {doc.nombre_archivo}
                                  </a>
                                  <button onClick={() => eliminarDocumentoRuta(doc.id)} className="text-xs text-red-500 hover:text-red-600 ml-2">🗑️</button>
                                </div>
                              ))}
                            </div>
                          )}
                          <input
                            key={fileInputRutaKey}
                            type="file"
                            accept="application/pdf"
                            onChange={e => e.target.files?.[0] && subirDocumentoRuta(e.target.files[0])}
                            disabled={subiendoDocRuta}
                            className="w-full text-xs text-gray-600"
                          />
                          {errorDocRuta && <p className="text-red-500 text-xs">{errorDocRuta}</p>}
                          {subiendoDocRuta && <p className="text-xs text-gray-400">Subiendo...</p>}
                        </div>
                      )}

                      {form.tiene_ruta && (
                        <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
                          <div>
                            <label className="text-xs font-medium text-gray-700 flex items-center mb-1">
                              Zonas que cubre la ruta
                              <InfoTooltip texto="Colonias o puntos de referencia por donde pasa el transporte, uno por uno." />
                            </label>
                            <EditableList
                              items={form.zonas_ruta}
                              onChange={(items) => setForm({ ...form, zonas_ruta: items })}
                              placeholder="Ej. Parque Industrial Apodaca"
                            />
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.ruta_para_entrevista}
                              onChange={e => setForm({ ...form, ruta_para_entrevista: e.target.checked })}
                              className="accent-[#1A6B3C]"
                            />
                            <span className="text-xs text-gray-600 flex items-center">
                              La ruta también está disponible para ir a la entrevista
                              <InfoTooltip texto="Si no está marcado, el candidato entiende que la ruta solo aplica una vez contratado, no antes." />
                            </span>
                          </label>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <label className="flex flex-col items-center gap-1 cursor-pointer border border-gray-200 rounded-lg p-2 hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={form.estacionamiento}
                            onChange={e => setForm({ ...form, estacionamiento: e.target.checked })}
                            className="accent-[#1A6B3C]"
                          />
                          <span className="text-xs text-gray-700">🅿️ Estacionamiento</span>
                        </label>
                        <label className="flex flex-col items-center gap-1 cursor-pointer border border-gray-200 rounded-lg p-2 hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={form.comedor}
                            onChange={e => setForm({ ...form, comedor: e.target.checked })}
                            className="accent-[#1A6B3C]"
                          />
                          <span className="text-xs text-gray-700">🍽️ Comedor</span>
                        </label>
                        <label className="flex flex-col items-center gap-1 cursor-pointer border border-gray-200 rounded-lg p-2 hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={form.uniforme}
                            onChange={e => setForm({ ...form, uniforme: e.target.checked })}
                            className="accent-[#1A6B3C]"
                          />
                          <span className="text-xs text-gray-700">👕 Uniforme</span>
                        </label>
                      </div>
                    </>
                  ) : s.id === 'proceso' ? (
                    <>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-1">
                        <p className="text-[11px] text-blue-700">
                          ℹ️ Esta sección es información para el <strong>reclutador</strong> — el candidato nunca la ve.
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700 flex items-center mb-1">
                          Documentos tronco común
                          <InfoTooltip texto="Los documentos que casi siempre se piden. Márcalos para que aparezcan en la lista de abajo automáticamente." />
                        </label>
                        <div className="grid grid-cols-2 gap-1.5 mb-2">
                          {DOCUMENTOS_TRONCO_COMUN.map(doc => (
                            <label key={doc} className="flex items-center gap-1.5 cursor-pointer text-xs">
                              <input
                                type="checkbox"
                                checked={form.documentos_requeridos.includes(doc)}
                                onChange={e => {
                                  const yaEsta = form.documentos_requeridos.includes(doc)
                                  if (e.target.checked && !yaEsta) {
                                    setForm({ ...form, documentos_requeridos: [...form.documentos_requeridos, doc] })
                                  } else if (!e.target.checked && yaEsta) {
                                    setForm({ ...form, documentos_requeridos: form.documentos_requeridos.filter((d: string) => d !== doc) })
                                  }
                                }}
                                className="accent-[#1A6B3C]"
                              />
                              <span className="text-gray-700">{doc}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700 flex items-center mb-1">
                          Otros documentos requeridos
                          <InfoTooltip texto="Cualquier documento adicional específico de esta vacante o empresa, que no esté en la lista de tronco común." />
                        </label>
                        <EditableList
                          items={form.documentos_requeridos.filter((d: string) => !DOCUMENTOS_TRONCO_COMUN.includes(d))}
                          onChange={(items) => {
                            const troncoComunActivos = form.documentos_requeridos.filter((d: string) => DOCUMENTOS_TRONCO_COMUN.includes(d))
                            setForm({ ...form, documentos_requeridos: [...troncoComunActivos, ...items] })
                          }}
                          placeholder="Ej. Certificado de estudios"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.requiere_examen_medico}
                            onChange={e => setForm({ ...form, requiere_examen_medico: e.target.checked })}
                            className="accent-[#1A6B3C]"
                          />
                          <span className="text-sm text-gray-700 flex items-center">
                            🩺 Examen médico
                            <InfoTooltip texto="Visible también para el candidato." />
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.requiere_antidoping}
                            onChange={e => setForm({ ...form, requiere_antidoping: e.target.checked })}
                            className="accent-[#1A6B3C]"
                          />
                          <span className="text-sm text-gray-700 flex items-center">
                            🧪 Antidoping
                            <InfoTooltip texto="Visible también para el candidato." />
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.requiere_estudio_socioeconomico}
                            onChange={e => setForm({ ...form, requiere_estudio_socioeconomico: e.target.checked })}
                            className="accent-[#1A6B3C]"
                          />
                          <span className="text-sm text-gray-700">📋 Socioeconómico</span>
                        </label>
                      </div>

                      <div className="border-t border-gray-100 pt-3">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-sm font-medium text-gray-700">
                            {form.status === 'vigente' ? '🟢 Vigente' : '⚪ No vigente'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, status: form.status === 'vigente' ? 'pausada' : 'vigente' })}
                            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${form.status === 'vigente' ? 'bg-[#1A6B3C]' : 'bg-gray-300'}`}
                          >
                            <span
                              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200"
                              style={{ transform: form.status === 'vigente' ? 'translateX(24px)' : 'translateX(0px)' }}
                            />
                          </button>
                        </label>
                        <p className="text-[10px] text-gray-400 mt-1">Solo las vacantes "Vigente" son visibles para candidatos y aparecen en el sitemap. Puedes reactivarla cuando quieras.</p>
                      </div>

                      <div className="pt-3">
                        <p className="text-xs font-medium text-gray-700 flex items-center mb-1">
                          Contacto RRHH de la empresa (opcional)
                          <InfoTooltip texto="Llenar solo si el reclutador tendrá contacto directo con la empresa para resolver dudas. Si el coordinador prefiere seguir siendo el intermediario, deja esto vacío." />
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={form.contacto_rrhh_nombre}
                            onChange={e => setForm({ ...form, contacto_rrhh_nombre: e.target.value })}
                            placeholder="Nombre"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          />
                          <input
                            value={form.contacto_rrhh_telefono}
                            onChange={e => setForm({ ...form, contacto_rrhh_telefono: e.target.value })}
                            placeholder="Teléfono"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          />
                        </div>
                        <input
                          value={form.mejor_horario_contacto}
                          onChange={e => setForm({ ...form, mejor_horario_contacto: e.target.value })}
                          placeholder="Mejor horario para contactarlo (ej. 9am-2pm)"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                        />
                      </div>

                      <div className="pt-3">
                        <p className="text-xs font-medium text-gray-700 flex items-center mb-1">
                          💬 Qué decirle al candidato
                          <InfoTooltip texto="Lo mínimo que el reclutador debe comunicar: salario, horario, punto de reunión, qué llevar, con quién preguntar. Esto se le muestra directo en su ficha operativa." />
                        </p>
                        <textarea
                          value={form.guion_candidato}
                          onChange={e => setForm({ ...form, guion_candidato: e.target.value })}
                          placeholder="Ej. Preséntate en punto a las 8am con INE y CURP. Pregunta por Lic. Ana Torres. Sueldo $3,360 semanal, turno rotativo."
                          rows={4}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                        />
                      </div>

                      <div className="pt-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Punto de reunión / entrevista</p>
                        <input
                          value={form.punto_reunion}
                          onChange={e => setForm({ ...form, punto_reunion: e.target.value })}
                          placeholder="Ej. Recepción de planta, entrada principal sobre Av. Industrias"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                        />
                      </div>

                      {(form.negocio_id || creandoNegocio) && (
                        <div className="pt-3">
                          <p className="text-xs font-medium text-gray-700 flex items-center mb-1">
                            Días de entrevista
                            <InfoTooltip texto="Los únicos días de la semana en que esta empresa recibe candidatos a entrevista (aplica a TODAS las vacantes de esta empresa, no solo a esta). El reclutador no podrá agendar entrevistas fuera de estos días." />
                          </p>
                          <div className="flex gap-1.5">
                            {[
                              { label: 'L', dia: 1 }, { label: 'M', dia: 2 }, { label: 'M', dia: 3 },
                              { label: 'J', dia: 4 }, { label: 'V', dia: 5 }, { label: 'S', dia: 6 }, { label: 'D', dia: 0 },
                            ].map(({ label, dia }) => (
                              <button
                                key={dia}
                                type="button"
                                onClick={() => setDiasEntrevista(prev =>
                                  prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
                                )}
                                className={`w-9 h-9 rounded-lg text-xs font-medium border transition-colors ${
                                  diasEntrevista.includes(dia)
                                    ? 'bg-[#1A6B3C] text-white border-[#1A6B3C]'
                                    : 'bg-white text-gray-600 border-gray-300'
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Días de inducción</p>
                        <input
                          type="number"
                          min={0}
                          value={form.dias_induccion}
                          onChange={e => setForm({ ...form, dias_induccion: e.target.value })}
                          placeholder="0"
                          className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                        />
                        <label className="flex items-center gap-2 cursor-pointer mt-2">
                          <input
                            type="checkbox"
                            checked={form.induccion_dentro_garantia}
                            onChange={e => setForm({ ...form, induccion_dentro_garantia: e.target.checked })}
                            className="accent-[#1A6B3C]"
                          />
                          <span className="text-xs text-gray-700">La inducción va dentro de los días de garantía</span>
                        </label>
                      </div>
                    </>
                  ) : s.id === 'identidad' ? (
                    <>
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">Título de la vacante *</label>
                        <input
                          value={form.titulo}
                          onChange={e => setForm({ ...form, titulo: e.target.value })}
                          placeholder="Ej. Operador de Producción"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">Empresa</label>
                        {!creandoNegocio ? (
                          <select
                            value={form.negocio_id ?? ''}
                            onChange={e => {
                              if (e.target.value === '__nuevo__') {
                                setCreandoNegocio(true)
                              } else {
                                setForm({ ...form, negocio_id: e.target.value })
                              }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          >
                            <option value="">Selecciona una empresa</option>
                            {negocios.map(n => <option key={n.id} value={n.id}>{n.nombre}</option>)}
                            <option value="__nuevo__">+ Nueva empresa</option>
                          </select>
                        ) : (
                          <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium text-gray-600">Nueva empresa</p>
                              <button type="button" onClick={() => setCreandoNegocio(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancelar</button>
                            </div>
                            <input
                              value={nuevoNegocio.nombre}
                              onChange={e => setNuevoNegocio({ ...nuevoNegocio, nombre: e.target.value })}
                              placeholder="Nombre de la empresa *"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                            />
                            <input
                              value={nuevoNegocio.industria}
                              onChange={e => setNuevoNegocio({ ...nuevoNegocio, industria: e.target.value })}
                              placeholder="Industria"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                            />
                            <input
                              value={nuevoNegocio.contacto_nombre}
                              onChange={e => setNuevoNegocio({ ...nuevoNegocio, contacto_nombre: e.target.value })}
                              placeholder="Contacto (nombre)"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                            />
                          </div>
                        )}
                      </div>

                      {(form.negocio_id || creandoNegocio) && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 flex items-center mb-1">
                            Días de descanso de esta empresa
                            <InfoTooltip texto="Estos días NO cuentan al calcular cuándo se cumple la garantía de un candidato (aplica a TODAS las vacantes de esta empresa, no solo a esta). Ej. si la empresa no da inducción los domingos, márcalo aquí." />
                          </p>
                          <div className="flex gap-1.5">
                            {[
                              { label: 'L', dia: 1 }, { label: 'M', dia: 2 }, { label: 'M', dia: 3 },
                              { label: 'J', dia: 4 }, { label: 'V', dia: 5 }, { label: 'S', dia: 6 }, { label: 'D', dia: 0 },
                            ].map(({ label, dia }) => (
                              <button
                                key={dia}
                                type="button"
                                onClick={() => setDiasDescanso(prev =>
                                  prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
                                )}
                                className={`w-9 h-9 rounded-lg text-xs font-medium border transition-colors ${
                                  diasDescanso.includes(dia)
                                    ? 'bg-[#1A6B3C] text-white border-[#1A6B3C]'
                                    : 'bg-white text-gray-600 border-gray-300'
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.empresa_visible}
                          onChange={e => setForm({ ...form, empresa_visible: e.target.checked })}
                          className="accent-[#1A6B3C]"
                        />
                        <span className="text-sm text-gray-700">Mostrar el nombre de la empresa al candidato</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.destacada}
                          onChange={e => setForm({ ...form, destacada: e.target.checked })}
                          className="accent-[#1A6B3C]"
                        />
                        <span className="text-sm text-gray-700 flex items-center">
                          ⭐ Destacar esta vacante
                          <InfoTooltip texto="Aparece con un badge especial en el portal público para llamar más la atención de candidatos." />
                        </span>
                      </label>
                    </>
                  ) : s.id === 'ubicacion' ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">Ciudad o Municipio *</label>
                          <input
                            value={form.ciudad}
                            onChange={e => setForm({ ...form, ciudad: e.target.value })}
                            list="lista-ciudades"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          />
                          <datalist id="lista-ciudades">
                            {ciudadesExistentes.map(c => <option key={c} value={c} />)}
                          </datalist>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">Estado *</label>
                          <input
                            value={form.estado}
                            onChange={e => setForm({ ...form, estado: e.target.value })}
                            list="lista-estados"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          />
                          <datalist id="lista-estados">
                            {estadosExistentes.map(e => <option key={e} value={e} />)}
                          </datalist>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">Colonia o zona (opcional)</label>
                        <input
                          value={form.colonia_zona ?? ''}
                          onChange={e => setForm({ ...form, colonia_zona: e.target.value })}
                          placeholder="Ej. Parque Industrial"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Ayuda al candidato a saber si le queda cerca antes de postularse.</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">Modalidad</label>
                        <select
                          value={form.modalidad}
                          onChange={e => setForm({ ...form, modalidad: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                        >
                          <option value="presencial">Presencial</option>
                          <option value="hibrido">Híbrido</option>
                          <option value="remoto">Remoto</option>
                        </select>
                      </div>
                    </>
                  ) : s.id === 'condiciones' ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">Jornada *</label>
                          <select
                            value={form.jornada}
                            onChange={e => setForm({ ...form, jornada: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          >
                            <option value="completo">Tiempo completo</option>
                            <option value="medio">Medio tiempo</option>
                            <option value="proyecto">Por proyecto</option>
                            <option value="fines">Fines de semana</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">Turno</label>
                          <select
                            value={form.turno ?? 'no_aplica'}
                            onChange={e => setForm({ ...form, turno: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          >
                            <option value="no_aplica">No aplica</option>
                            <option value="matutino">Matutino</option>
                            <option value="vespertino">Vespertino</option>
                            <option value="nocturno">Nocturno</option>
                            <option value="rotativo">Rotativo</option>
                            <option value="fijo">Turno fijo (varios turnos)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">Horario detallado</label>
                        <textarea
                          value={form.horario ?? ''}
                          onChange={e => setForm({ ...form, horario: e.target.value })}
                          placeholder="Ej. Turnos rotativos, 6:30am-6:30pm / 6:30pm-6:30am. Descanso rotativo entre semana."
                          rows={2}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">Salario</label>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            value={form.salario_min}
                            onChange={e => setForm({ ...form, salario_min: e.target.value })}
                            placeholder="Mínimo"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          />
                          <input
                            type="number"
                            value={form.salario_max}
                            onChange={e => setForm({ ...form, salario_max: e.target.value })}
                            placeholder="Máximo (opcional)"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          />
                          </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <select
                            value={form.salario_tipo}
                            onChange={e => setForm({ ...form, salario_tipo: e.target.value })}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          >
                            <option value="neto">Neto</option>
                            <option value="bruto">Bruto</option>
                            <option value="convenir">A convenir</option>
                          </select>
                          <select
                            value={form.salario_periodo}
                            onChange={e => setForm({ ...form, salario_periodo: e.target.value })}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          >
                            <option value="semanal">Semanal</option>
                            <option value="quincenal">Quincenal</option>
                            <option value="mensual">Mensual</option>
                            <option value="por_hora">Por hora</option>
                          </select>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer mt-2">
                          <input
                            type="checkbox"
                            checked={form.salario_visible}
                            onChange={e => setForm({ ...form, salario_visible: e.target.checked })}
                            className="accent-[#1A6B3C]"
                          />
                          <span className="text-xs text-gray-600">Mostrar el salario al candidato</span>
                        </label>

                        <div className="mt-2">
                          <label className="text-xs font-medium text-gray-700 flex items-center mb-1">
                            Comentarios del salario
                            <InfoTooltip texto="Solo para el reclutador — ej. 'Empieza en $3,267, sube conforme a experiencia y antigüedad hasta $4,487'. El candidato nunca ve esto." />
                          </label>
                          <textarea
                            value={form.comentarios_salario}
                            onChange={e => setForm({ ...form, comentarios_salario: e.target.value })}
                            placeholder="Ej. Empieza en el mínimo, sube conforme a experiencia y antigüedad."
                            rows={2}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] resize-none"
                          />
                        </div>
                      </div>
                    </>
                  ) : s.id === 'letras' ? (
                    <textarea
                      value={form.letras_chiquitas}
                      onChange={e => setForm({ ...form, letras_chiquitas: e.target.value })}
                      placeholder="Lo que el candidato debe saber antes de llegar..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] resize-none"
                    />
                  ) : s.id === 'reclutamiento' ? (
                    <>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-1">
                        <p className="text-[11px] text-blue-700">
                          ℹ️ Esta sección es información para el <strong>reclutador</strong> — el candidato nunca la ve.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-700 flex items-center mb-1">
                            Días de garantía *
                            <InfoTooltip texto="Días que el candidato debe permanecer trabajando para que se pague la comisión al reclutador. Se cuentan desde que inicia inducción, saltando los días de descanso de la empresa." />
                          </label>
                          <input
                            type="number"
                            value={form.dias_garantia}
                            onChange={e => setForm({ ...form, dias_garantia: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 flex items-center mb-1">
                            Comisión base (MXN) *
                            <InfoTooltip texto="Lo que gana el reclutador cuando su candidato cumple los días de garantía." />
                          </label>
                          <input
                            type="number"
                            value={form.comision_base_mxn}
                            onChange={e => setForm({ ...form, comision_base_mxn: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          />
                        </div>
                      </div>

                      <div className="pt-3">
                        <label className="text-xs font-medium text-gray-700 flex items-center mb-1">
                          Cupo requerido
                          <InfoTooltip texto="Cuántas personas necesita la empresa para esta vacante. Cuando se cubre, la vacante se pausa sola automáticamente." />
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={form.cupo_requerido}
                          onChange={e => setForm({ ...form, cupo_requerido: e.target.value })}
                          className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                        />
                        {vacanteId && (
                          <div className="mt-2 bg-gray-50 rounded-lg p-3 flex gap-4 text-xs">
                            <span className="text-gray-600">✅ Ocupando cupo: <strong>{cupoInfo.contratados}</strong></span>
                            <span className="text-gray-600">🔄 En entrevista: <strong>{cupoInfo.enProceso}</strong></span>
                            <span className={cupoInfo.disponibles <= 0 ? 'text-red-600 font-medium' : 'text-green-700 font-medium'}>
                              {cupoInfo.disponibles <= 0 ? '🔴 Cupo cubierto' : `🟢 ${cupoInfo.disponibles} disponibles`}
                            </span>
                          </div>
                        )}
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer pt-2">
                        <input
                          type="checkbox"
                          checked={form.tiene_promocion}
                          onChange={e => setForm({ ...form, tiene_promocion: e.target.checked })}
                          className="accent-[#1A6B3C]"
                        />
                        <span className="text-sm text-gray-700 flex items-center">
                          ¿Tiene promoción de comisión activa?
                          <InfoTooltip texto="Un monto de comisión distinto (usualmente más alto) por tiempo limitado, para motivar a los reclutadores a priorizar esta vacante." />
                        </span>
                      </label>

                      {form.tiene_promocion && (
                        <div className="border border-amber-200 bg-amber-50 rounded-lg p-3 space-y-2">
                          <input
                            value={form.promocion_descripcion}
                            onChange={e => setForm({ ...form, promocion_descripcion: e.target.value })}
                            placeholder="Descripción de la promoción (ej. Bono especial de lanzamiento)"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs font-medium text-gray-700 block mb-1">Monto promocional (MXN)</label>
                              <input
                                type="number"
                                value={form.promocion_monto_mxn}
                                onChange={e => setForm({ ...form, promocion_monto_mxn: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-700 block mb-1">Vence el</label>
                              <input
                                type="date"
                                value={form.promocion_fin}
                                onChange={e => setForm({ ...form, promocion_fin: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pt-3">
                        <label className="text-xs font-medium text-gray-700 flex items-center mb-1">
                          Prioridad de la vacante
                          <InfoTooltip texto="Qué tan urgente es cubrir esta vacante para la empresa. Se usa como filtro en el listado y el reclutador la ve marcada en su ficha." />
                        </label>
                        <div className="flex gap-2">
                          {(['normal', 'alta', 'urgente'] as const).map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setForm({ ...form, prioridad: p })}
                              className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${
                                form.prioridad === p
                                  ? p === 'urgente'
                                    ? 'bg-red-100 text-red-700 border-red-300'
                                    : p === 'alta'
                                    ? 'bg-orange-100 text-orange-700 border-orange-300'
                                    : 'bg-gray-200 text-gray-700 border-gray-300'
                                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {p === 'normal' ? 'Normal' : p === 'alta' ? 'Alta' : '🔴 Urgente'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 pt-2">Posiciones, reclutadores asignados y deadline se agregan en la siguiente pasada.</p>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>

        {error && <p className="px-4 text-red-500 text-xs">{error}</p>}

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-2">
          <button
            onClick={onCerrar}
            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium"
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
