'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CoordinadorNav from '@/components/coordinador/CoordinadorNav'

interface Escalacion {
  id: string
  vacante_id: string
  pregunta: string
  respuesta: string | null
  created_at: string
  reclutadores: { nombre: string } | null
  vacantes: { titulo: string; negocios: { nombre: string } | null } | null
}

export default function FaqCoordinador() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [pendientes, setPendientes] = useState<Escalacion[]>([])
  const [contestadas, setContestadas] = useState<Escalacion[]>([])
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [guardarEnFaq, setGuardarEnFaq] = useState<Record<string, boolean>>({})
  const [enviando, setEnviando] = useState<string | null>(null)

  useEffect(() => {
    const data = localStorage.getItem('coordinador_sesion')
    if (!data) { router.push('/coordinador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarPreguntas(s.agencia_id)

    const supabase = createClient()
    const canal = supabase
      .channel(`faq-panel-coordinador-${s.agencia_id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'faq_escalaciones',
        filter: `agencia_id=eq.${s.agencia_id}`
      }, () => cargarPreguntas(s.agencia_id))
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [])

  async function cargarPreguntas(agenciaId: string) {
    setLoading(true)
    const supabase = createClient()

    const { data: pend } = await supabase
      .from('faq_escalaciones')
      .select('id, vacante_id, pregunta, respuesta, created_at, reclutadores(nombre), vacantes(titulo, negocios(nombre))')
      .eq('agencia_id', agenciaId)
      .is('respuesta', null)
      .order('created_at', { ascending: true })
    setPendientes((pend ?? []) as any)

    const { data: cont } = await supabase
      .from('faq_escalaciones')
      .select('id, vacante_id, pregunta, respuesta, created_at, reclutadores(nombre), vacantes(titulo, negocios(nombre))')
      .eq('agencia_id', agenciaId)
      .not('respuesta', 'is', null)
      .order('respondido_at', { ascending: false })
      .limit(20)
    setContestadas((cont ?? []) as any)

    setLoading(false)
  }

  async function borrarPregunta(id: string) {
    const supabase = createClient()
    await supabase.from('faq_escalaciones').delete().eq('id', id)
    cargarPreguntas(sesion.agencia_id)
  }

  async function borrarTodasContestadas() {
    if (!window.confirm('¿Borrar todas las preguntas contestadas? Esto no las borra del FAQ guardado, solo de este historial.')) return
    const supabase = createClient()
    await supabase
      .from('faq_escalaciones')
      .delete()
      .eq('agencia_id', sesion.agencia_id)
      .not('respuesta', 'is', null)
    cargarPreguntas(sesion.agencia_id)
  }

  async function contestar(esc: Escalacion) {
    const respuesta = respuestas[esc.id]?.trim()
    if (!respuesta) return

    setEnviando(esc.id)
    const supabase = createClient()

    await supabase
      .from('faq_escalaciones')
      .update({
        respuesta,
        respondido_por: sesion.id,
        respondido_at: new Date().toISOString(),
        guardado_en_faq: !!guardarEnFaq[esc.id],
      })
      .eq('id', esc.id)

    // CA-03.3: si el coordinador activó el toggle, se guarda en faqs_vacante
    // para que el Nivel 2 lo encuentre la próxima vez que alguien pregunte algo parecido.
    if (guardarEnFaq[esc.id]) {
      await supabase.from('faqs_vacante').insert({
        vacante_id: esc.vacante_id,
        pregunta: esc.pregunta,
        respuesta,
        respondido_por: sesion.id,
        visible_reclutadores: true,
      })
    }

    setEnviando(null)
    cargarPreguntas(sesion.agencia_id)
  }

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CoordinadorNav subtitulo="FAQ" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas de reclutadores</h2>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando...</div>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-3">
                ⏳ Pendientes ({pendientes.length})
              </h3>
              {pendientes.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <p className="text-gray-400 text-sm">No hay preguntas pendientes 🎉</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendientes.map(esc => (
                    <div key={esc.id} className="bg-white rounded-2xl p-4 shadow-sm">
                      <p className="text-xs text-gray-400">
                        {esc.reclutadores?.nombre} · {esc.vacantes?.titulo} — {esc.vacantes?.negocios?.nombre}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mt-1">❓ {esc.pregunta}</p>
                      <textarea
                        value={respuestas[esc.id] ?? ''}
                        onChange={e => setRespuestas({ ...respuestas, [esc.id]: e.target.value })}
                        placeholder="Escribe tu respuesta..."
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] resize-none"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!guardarEnFaq[esc.id]}
                            onChange={e => setGuardarEnFaq({ ...guardarEnFaq, [esc.id]: e.target.checked })}
                            className="accent-[#1A6B3C]"
                          />
                          <span className="text-xs text-gray-600">Agregar al FAQ (otros reclutadores verán esta respuesta automáticamente)</span>
                        </label>
                        <button
                          onClick={() => contestar(esc)}
                          disabled={enviando === esc.id || !respuestas[esc.id]?.trim()}
                          className="bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded-lg font-medium flex-shrink-0"
                        >
                          {enviando === esc.id ? 'Enviando...' : 'Responder'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">✅ Contestadas recientemente</h3>
                {contestadas.length > 0 && (
                  <button onClick={borrarTodasContestadas} className="text-xs text-red-500 hover:underline">
                    🗑️ Borrar todo
                  </button>
                )}
              </div>
              {contestadas.length === 0 ? (
                <p className="text-sm text-gray-400">Aún no has contestado ninguna.</p>
              ) : (
                <div className="space-y-2">
                  {contestadas.map(esc => (
                    <div key={esc.id} className="bg-white rounded-xl p-3 shadow-sm flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">{esc.reclutadores?.nombre} · {esc.vacantes?.titulo}</p>
                        <p className="text-xs text-gray-700 mt-1">❓ {esc.pregunta}</p>
                        <p className="text-xs text-green-700 mt-0.5">✅ {esc.respuesta}</p>
                      </div>
                      <button onClick={() => borrarPregunta(esc.id)} className="text-xs text-gray-300 hover:text-red-500 flex-shrink-0">
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
