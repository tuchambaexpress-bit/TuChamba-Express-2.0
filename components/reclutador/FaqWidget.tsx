'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { buscarRespuestaNivel1, buscarRespuestaNivel2, VacanteParaFaq } from '@/lib/faq'

interface Props {
  vacanteId: string
  agenciaId: string
  vacante: VacanteParaFaq
}

const EJEMPLOS_PREGUNTAS = [
  '¿Sigue vigente esta vacante?',
  '¿Tiene ruta de transporte?',
  '¿Qué días son de entrevista?',
  '¿Tiene estacionamiento?',
  '¿Tiene comedor?',
  '¿Da uniforme la empresa?',
  '¿Cuál es el horario/turno?',
  '¿Cuántos días de garantía tiene?',
  '¿Cuál es la comisión?',
  '¿Dónde es el punto de reunión para la entrevista?',
]

interface Escalacion {
  id: string
  pregunta: string
  respuesta: string | null
  created_at: string
}

export default function FaqWidget({ vacanteId, agenciaId, vacante }: Props) {
  const [pregunta, setPregunta] = useState('')
  const [respuestaInstantanea, setRespuestaInstantanea] = useState<string | null>(null)
  const [origen, setOrigen] = useState<'nivel1' | 'nivel2' | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [escalado, setEscalado] = useState(false)
  const [misPreguntas, setMisPreguntas] = useState<Escalacion[]>([])
  const [reclutadorId, setReclutadorId] = useState<string | null>(null)
  const [mostrarAyuda, setMostrarAyuda] = useState(false)
  const [faqsVacante, setFaqsVacante] = useState<{ pregunta: string; respuesta: string }[]>([])

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) return
    const s = JSON.parse(data)
    setReclutadorId(s.id)
    cargarMisPreguntas(s.id)

    // Realtime: cuando el coordinador contesta, se actualiza solo, sin recargar
    const supabase = createClient()
    const canal = supabase
      .channel(`faq-widget-${vacanteId}-${s.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'faq_escalaciones',
        filter: `preguntado_por=eq.${s.id}`
      }, () => cargarMisPreguntas(s.id))
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [])

  async function abrirAyuda() {
    setMostrarAyuda(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('faqs_vacante')
      .select('pregunta, respuesta')
      .eq('vacante_id', vacanteId)
      .eq('visible_reclutadores', true)
      .order('created_at', { ascending: false })
    setFaqsVacante(data ?? [])
  }

  async function borrarPregunta(id: string) {
    if (!reclutadorId) return
    const supabase = createClient()
    await supabase.from('faq_escalaciones').delete().eq('id', id)
    cargarMisPreguntas(reclutadorId)
  }

  async function borrarTodasMisPreguntas() {
    if (!reclutadorId) return
    if (!window.confirm('¿Borrar todas tus preguntas de esta vacante?')) return
    const supabase = createClient()
    await supabase
      .from('faq_escalaciones')
      .delete()
      .eq('vacante_id', vacanteId)
      .eq('preguntado_por', reclutadorId)
    cargarMisPreguntas(reclutadorId)
  }

  async function cargarMisPreguntas(recId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('faq_escalaciones')
      .select('id, pregunta, respuesta, created_at')
      .eq('vacante_id', vacanteId)
      .eq('preguntado_por', recId)
      .order('created_at', { ascending: false })
      .limit(5)
    setMisPreguntas((data ?? []) as any)
  }

  async function preguntar() {
    if (!pregunta.trim() || !reclutadorId) return
    setEnviando(true)
    setRespuestaInstantanea(null)
    setEscalado(false)

    // Nivel 1 — campo estructurado, instantáneo
    const nivel1 = buscarRespuestaNivel1(pregunta, vacante)
    if (nivel1) {
      setRespuestaInstantanea(nivel1)
      setOrigen('nivel1')
      setEnviando(false)
      return
    }

    // Nivel 2 — FAQ ya guardado para esta vacante
    const supabase = createClient()
    const { data: faqsExistentes } = await supabase
      .from('faqs_vacante')
      .select('pregunta, respuesta')
      .eq('vacante_id', vacanteId)
      .eq('visible_reclutadores', true)

    const nivel2 = buscarRespuestaNivel2(pregunta, faqsExistentes ?? [])
    if (nivel2) {
      setRespuestaInstantanea(nivel2.respuesta)
      setOrigen('nivel2')
      setEnviando(false)
      return
    }

    // Nivel 3 — escala al coordinador
    await supabase.from('faq_escalaciones').insert({
      vacante_id: vacanteId,
      agencia_id: agenciaId,
      pregunta: pregunta.trim(),
      preguntado_por: reclutadorId,
    })

    const { data: coordinador } = await supabase
      .from('coordinadores')
      .select('id')
      .eq('agencia_id', agenciaId)
      .eq('status', 'activo')
      .maybeSingle()

    if (coordinador) {
      await supabase.from('alertas').insert({
        tipo: 'pregunta_faq',
        destinatario_id: coordinador.id,
        destinatario_rol: 'coordinador',
        vacante_id: vacanteId,
        mensaje: `❓ Nueva pregunta sin resolver: "${pregunta.trim()}"`,
        leida: false,
      })
    }

    setEscalado(true)
    setPregunta('')
    cargarMisPreguntas(reclutadorId)
    setEnviando(false)
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">❓ ¿Tienes una duda?</h3>
        <button onClick={abrirAyuda} className="text-xs text-[#1A6B3C] hover:underline">
          💡 Ejemplos de preguntas
        </button>
      </div>
      <div className="flex gap-2">
        <input
          value={pregunta}
          onChange={e => setPregunta(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && preguntar()}
          placeholder="Ej. ¿Tiene ruta esta vacante?"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
        />
        <button
          onClick={preguntar}
          disabled={enviando || !pregunta.trim()}
          className="bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg font-medium"
        >
          {enviando ? '...' : 'Preguntar'}
        </button>
      </div>

      {respuestaInstantanea && (
        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">{respuestaInstantanea}</p>
          <p className="text-[10px] text-green-500 mt-1">
            {origen === 'nivel1' ? 'Respuesta automática' : 'Ya respondido antes para esta vacante'}
          </p>
        </div>
      )}

      {escalado && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            📨 No encontré una respuesta automática — tu pregunta se envió al coordinador. Te avisará aquí mismo cuando conteste.
          </p>
        </div>
      )}

      {misPreguntas.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-500">Tus preguntas para esta vacante</p>
            <button onClick={borrarTodasMisPreguntas} className="text-xs text-red-400 hover:underline">
              🗑️ Borrar todo
            </button>
          </div>
          <div className="space-y-2">
            {misPreguntas.map(p => (
              <div key={p.id} className="text-xs flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-gray-700">❓ {p.pregunta}</p>
                  {p.respuesta ? (
                    <p className="text-green-700 mt-0.5">✅ {p.respuesta}</p>
                  ) : (
                    <p className="text-amber-600 mt-0.5">⏳ Esperando respuesta del coordinador...</p>
                  )}
                </div>
                <button onClick={() => borrarPregunta(p.id)} className="text-gray-300 hover:text-red-500 flex-shrink-0">
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {mostrarAyuda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setMostrarAyuda(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">💡 Preguntas de ejemplo</h3>
              <button onClick={() => setMostrarAyuda(false)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
            </div>

            <p className="text-xs text-gray-500 mb-2">Estas se contestan al instante:</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {EJEMPLOS_PREGUNTAS.map(p => (
                <button
                  key={p}
                  onClick={() => { setPregunta(p); setMostrarAyuda(false) }}
                  className="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded-lg border border-green-200"
                >
                  {p}
                </button>
              ))}
            </div>

            {faqsVacante.length > 0 && (
              <>
                <p className="text-xs text-gray-500 mb-2">Ya preguntado antes para esta vacante:</p>
                <div className="space-y-2">
                  {faqsVacante.map((f, i) => (
                    <div key={i} className="text-xs bg-gray-50 rounded-lg p-2">
                      <p className="text-gray-700 font-medium">❓ {f.pregunta}</p>
                      <p className="text-gray-600 mt-0.5">{f.respuesta}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
