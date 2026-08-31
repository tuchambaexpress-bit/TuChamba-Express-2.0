'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import KanbanBoard from '@/components/reclutador/KanbanBoard'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'
import HistorialEntrevistas from '@/components/shared/HistorialEntrevistas'

const FUENTES_MANUALES = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'whatsapp_referido', label: 'WhatsApp personal' },
  { value: 'presencial', label: 'Presencial / volanteo' },
  { value: 'otro', label: 'Otro medio' },
]

export default function PipelinePage() {
  const [sesion, setSesion] = useState<any>(null)
  const [vistaActiva, setVistaActiva] = useState<'kanban' | 'entrevistas'>('kanban')
  const [mostrarAltaManual, setMostrarAltaManual] = useState(false)
  const [vacantesDisponibles, setVacantesDisponibles] = useState<{ id: string; titulo: string; negocio: string }[]>([])
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoTelefono, setNuevoTelefono] = useState('')
  const [nuevaVacanteId, setNuevaVacanteId] = useState('')
  const [nuevaFuente, setNuevaFuente] = useState('facebook')
  const [guardandoManual, setGuardandoManual] = useState(false)
  const [errorManual, setErrorManual] = useState('')

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) return
    const s = JSON.parse(data)
    setSesion(s)
    cargarVacantesParaAlta(s.id)
  }, [])

  useEffect(() => {
    if (!mostrarAltaManual) return
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setMostrarAltaManual(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [mostrarAltaManual])

  async function cargarVacantesParaAlta(reclutadorId: string) {
    const supabase = createClient()
    const { data: agenciasData } = await supabase
      .from('reclutador_agencia')
      .select('agencia_id')
      .eq('reclutador_id', reclutadorId)
      .eq('activo', true)
    const agenciaIds = (agenciasData ?? []).map((a: any) => a.agencia_id)
    if (agenciaIds.length === 0) return

    const { data: vacantesData } = await supabase
      .from('vacantes')
      .select('id, titulo, negocios(nombre)')
      .in('agencia_id', agenciaIds)
      .eq('status', 'vigente')
    setVacantesDisponibles((vacantesData ?? []).map((v: any) => ({
      id: v.id, titulo: v.titulo, negocio: v.negocios?.nombre ?? 'Empresa'
    })))
  }

  async function registrarCandidatoManual() {
    setErrorManual('')
    if (!nuevoNombre.trim()) return setErrorManual('Ingresa el nombre')
    if (nuevoTelefono.trim().length < 10) return setErrorManual('Teléfono inválido (10 dígitos)')
    if (!nuevaVacanteId) return setErrorManual('Selecciona una vacante')

    setGuardandoManual(true)
    const supabase = createClient()

    const { data: vacanteInfo } = await supabase
      .from('vacantes')
      .select('agencia_id')
      .eq('id', nuevaVacanteId)
      .maybeSingle()

    if (!vacanteInfo) {
      setErrorManual('No se pudo encontrar la vacante')
      setGuardandoManual(false)
      return
    }

    // Buscar o crear candidato por teléfono (mismo patrón que /api/postular)
    let candidatoId: string
    const { data: existente } = await supabase
      .from('candidatos')
      .select('id')
      .eq('telefono', nuevoTelefono.trim())
      .maybeSingle()

    if (existente) {
      candidatoId = existente.id
    } else {
      const { data: nuevo, error } = await supabase
        .from('candidatos')
        .insert({ nombre: nuevoNombre.trim(), telefono: nuevoTelefono.trim() })
        .select('id')
        .single()
      if (error || !nuevo) {
        setErrorManual('No se pudo crear el candidato')
        setGuardandoManual(false)
        return
      }
      candidatoId = nuevo.id
    }

    // Evitar duplicar si ya está postulado a esa vacante
    const { data: postulacionExistente } = await supabase
      .from('postulaciones')
      .select('id')
      .eq('candidato_id', candidatoId)
      .eq('vacante_id', nuevaVacanteId)
      .maybeSingle()

    if (postulacionExistente) {
      setErrorManual('Este candidato ya está postulado a esta vacante')
      setGuardandoManual(false)
      return
    }

    const { data: postulacionCreada, error: errorPost } = await supabase
      .from('postulaciones')
      .insert({
        candidato_id: candidatoId,
        vacante_id: nuevaVacanteId,
        reclutador_id: sesion.id,
        agencia_id: vacanteInfo.agencia_id,
        etapa_actual: 'Aplicado',
        es_manual: true,
      })
      .select('id')
      .single()

    if (errorPost || !postulacionCreada) {
      setErrorManual('No se pudo crear la postulación')
      setGuardandoManual(false)
      return
    }

    // Crea el chat, igual que cuando llega por el portal
    await supabase.from('chats').insert({
      tipo: 'candidato_reclutador',
      candidato_id: candidatoId,
      reclutador_id: sesion.id,
      vacante_id: nuevaVacanteId,
      postulacion_id: postulacionCreada.id,
      agencia_id: vacanteInfo.agencia_id,
      ultimo_sender_tipo: 'reclutador',
      leido_reclutador: true,
    })

    // Registra la fuente real, para que el Dashboard refleje de dónde llegó
    await supabase.from('trafico_referidos').insert({
      fuente: nuevaFuente,
      reclutador_id: sesion.id,
      agencia_id: vacanteInfo.agencia_id,
      vacante_id: nuevaVacanteId,
    })

    setGuardandoManual(false)
    setMostrarAltaManual(false)
    setNuevoNombre('')
    setNuevoTelefono('')
    setNuevaVacanteId('')
    // El Kanban se actualiza solo vía Realtime (canal ya existente en KanbanBoard)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReclutadorNav />
      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setVistaActiva('kanban')}
              className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
                vistaActiva === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setVistaActiva('entrevistas')}
              className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
                vistaActiva === 'entrevistas' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              📅 Entrevistas
            </button>
          </div>
          {vistaActiva === 'kanban' && (
            <button
              onClick={() => setMostrarAltaManual(true)}
              className="bg-[#1A6B3C] hover:bg-[#155c33] text-white text-sm px-4 py-2 rounded-lg font-medium"
            >
              + Candidato
            </button>
          )}
        </div>
        {vistaActiva === 'kanban' ? (
          <div className="overflow-x-auto h-[calc(100vh-140px)] relative">
            <div className="h-full">
              <KanbanBoard />
            </div>
          </div>
        ) : (
          sesion && <HistorialEntrevistas scope={{ tipo: 'reclutador', reclutadorId: sesion.id }} />
        )}
      </div>

      {mostrarAltaManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setMostrarAltaManual(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Nuevo candidato</h3>
              <button onClick={() => setMostrarAltaManual(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Nombre completo</label>
                <input type="text" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)}
                  placeholder="Ej. Juan Pérez García"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Teléfono (10 dígitos)</label>
                <input type="tel" value={nuevoTelefono} onChange={e => setNuevoTelefono(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Ej. 8112345678"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Vacante</label>
                <select value={nuevaVacanteId} onChange={e => setNuevaVacanteId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]">
                  <option value="">Selecciona una vacante...</option>
                  {vacantesDisponibles.map(v => (
                    <option key={v.id} value={v.id}>{v.titulo} — {v.negocio}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">¿Por dónde llegó?</label>
                <select value={nuevaFuente} onChange={e => setNuevaFuente(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]">
                  {FUENTES_MANUALES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              {errorManual && <p className="text-red-500 text-xs">{errorManual}</p>}
              <button
                onClick={registrarCandidatoManual}
                disabled={guardandoManual}
                className="w-full bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm"
              >
                {guardandoManual ? 'Guardando...' : 'Agregar candidato'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
