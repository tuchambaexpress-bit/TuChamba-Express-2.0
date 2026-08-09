'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChevronDown, X } from 'lucide-react'
import InfoTooltip from '@/components/ui/InfoTooltip'
import { EditableList } from '@/components/forms/EditableList'

interface Negocio {
  id: string
  nombre: string
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
  salario_min: '',
  salario_max: '',
  salario_tipo: 'neto',
  salario_periodo: 'semanal',
  salario_visible: true,
  destacada: false,
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
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [creandoNegocio, setCreandoNegocio] = useState(false)
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
      .select('id, nombre')
      .order('nombre')
    if (data) setNegocios(data)
  }

  async function cargarVacante(id: string) {
    const supabase = createClient()
    const { data } = await supabase.from('vacantes').select('*').eq('id', id).single()
    if (data) setForm(data)
  }

  function toggleSeccion(id: string) {
    setSeccionAbierta(prev => prev === id ? '' : id)
  }

  async function guardar() {
    setError('')

    // Campos siempre requeridos (ver spec.md CA-06 / tasks.md 5.6)
    if (!form.titulo?.trim()) return setError('El título es obligatorio')
    if (!form.ciudad?.trim()) return setError('La ciudad es obligatoria')
    if (!form.estado?.trim()) return setError('El estado es obligatorio')
    if (!form.jornada) return setError('La jornada es obligatoria')
    if (form.dias_garantia === '' || Number(form.dias_garantia) <= 0) return setError('Los días de garantía deben ser mayores a 0')
    if (form.comision_base_mxn === '' || form.comision_base_mxn === null || isNaN(Number(form.comision_base_mxn))) return setError('La comisión base es obligatoria')

    setGuardando(true)
    const supabase = createClient()

    let negocioId = form.negocio_id

    // CA-20.1: crear negocio inline si se seleccionó esa opción
    if (creandoNegocio) {
      if (!nuevoNegocio.nombre.trim()) {
        setError('El nombre del negocio es obligatorio')
        setGuardando(false)
        return
      }
      const { data: negocioCreado, error: errorNegocio } = await supabase
        .from('negocios')
        .insert(nuevoNegocio)
        .select('id')
        .single()

      if (errorNegocio || !negocioCreado) {
        setError('No se pudo crear el negocio: ' + (errorNegocio?.message ?? ''))
        setGuardando(false)
        return
      }
      negocioId = negocioCreado.id
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
      status: form.status ?? 'vigente',
      descripcion: form.descripcion?.trim() || form.titulo.trim(),
      requisitos: form.requisitos,
      beneficios: form.beneficios,
      salario_min: form.salario_min ? Number(form.salario_min) : null,
      salario_max: form.salario_max ? Number(form.salario_max) : null,
      salario_tipo: form.salario_tipo,
      salario_periodo: form.salario_periodo,
      salario_visible: form.salario_visible,
      destacada: form.destacada,
    }

    const { error: errorGuardado } = vacanteId && !vacanteDuplicar
      ? await supabase.from('vacantes').update(payload).eq('id', vacanteId)
      : await supabase.from('vacantes').insert(payload)

    setGuardando(false)

    if (errorGuardado) {
      setError('Error al guardar: ' + errorGuardado.message)
      return
    }

    onGuardado()
    onCerrar()
  }

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
                <span className={`text-sm font-medium ${seccionAbierta === s.id ? 'text-blue-800' : 'text-gray-800'}`}>{s.titulo}</span>
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
                    </>
                  ) : s.id === 'logistica' ? (
                    <div>
                      <p className="text-sm text-gray-400 italic mb-2">🚧 Próximamente — se construye en la siguiente pasada.</p>
                      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        Información operativa sobre <strong>cómo llegar y qué hay en el sitio</strong> — distinta de los requisitos del puesto. Incluye: si hay ruta de transporte de la empresa (y qué zonas cubre), si esa ruta también sirve para ir a la entrevista, si hay estacionamiento, comedor y uniforme. Visible al candidato.
                      </p>
                    </div>
                  ) : s.id === 'proceso' ? (
                    <div>
                      <p className="text-sm text-gray-400 italic mb-2">🚧 Próximamente — se construye en la siguiente pasada.</p>
                      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        Configuración del proceso interno de selección — <strong>solo para el reclutador</strong>, el candidato no la ve. Incluye: el orden de las etapas del Kanban para esta vacante, qué documentos hay que pedir (CV, identificación, etc.), si requiere examen médico o estudio socioeconómico, y el contacto de RRHH de la empresa para dudas.
                      </p>
                    </div>
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 block mb-1">Estado *</label>
                          <input
                            value={form.estado}
                            onChange={e => setForm({ ...form, estado: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                          />
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

                      <p className="text-xs text-gray-400">Posiciones, reclutadores asignados, deadline y prioridad se agregan en la siguiente pasada.</p>
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
