'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'
import ChatCoordinadorReclutador from '@/components/shared/ChatCoordinadorReclutador'

interface ChatAgencia {
  agenciaId: string
  nombreAgencia: string
  coordinadorId: string
  nombreCoordinador: string
  chatId: string
}

export default function ChatCoordinadorReclutadorPage() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [chatsAgencias, setChatsAgencias] = useState<ChatAgencia[]>([])
  const [agenciaSeleccionadaId, setAgenciaSeleccionadaId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) { router.push('/reclutador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarChats(s)
  }, [])

  // Multi-agencia (2026-09-05) — antes asumía que el reclutador solo
  // tenía UNA agencia activa (.maybeSingle(), truena con 2+ filas y
  // mostraba "No se encontró tu coordinador asignado", aunque sí tuviera
  // coordinador). Ahora trae TODAS las agencias activas — si es solo 1,
  // se comporta exactamente igual que antes (va directo al chat, sin
  // ninguna lista de por medio); si son 2+, se muestra una lista tipo
  // WhatsApp para elegir. No depende de es_maestro — cualquier
  // reclutador con 2+ agencias activas ve la lista, por diseño general.
  async function cargarChats(s: any) {
    const supabase = createClient()

    const { data: relaciones } = await supabase
      .from('reclutador_agencia')
      .select('agencia_id, agencias(nombre)')
      .eq('reclutador_id', s.id)
      .eq('activo', true)

    if (!relaciones || relaciones.length === 0) { setLoading(false); return }

    const resultados: ChatAgencia[] = []

    for (const rel of relaciones as any[]) {
      const { data: coordinadoresDisponibles } = await supabase
        .from('coordinadores')
        .select('id, nombre')
        .eq('agencia_id', rel.agencia_id)
        .eq('status', 'activo')
        .order('created_at', { ascending: true })
        .limit(1)

      const coordinador = coordinadoresDisponibles?.[0] ?? null
      if (!coordinador) continue // esta agencia no tiene coordinador activo — se omite, no bloquea a las demás

      let { data: chatExistente } = await supabase
        .from('chats')
        .select('id')
        .eq('tipo', 'reclutador_coordinador')
        .eq('reclutador_id', s.id)
        .eq('coordinador_id', coordinador.id)
        .is('vacante_id', null)
        .maybeSingle()

      if (!chatExistente) {
        const { data: chatNuevo, error: errorCreacion } = await supabase
          .from('chats')
          .insert({
            tipo: 'reclutador_coordinador',
            reclutador_id: s.id,
            coordinador_id: coordinador.id,
            agencia_id: rel.agencia_id,
          })
          .select('id')
          .single()

        if (errorCreacion) {
          const { data: chatYaExistente } = await supabase
            .from('chats')
            .select('id')
            .eq('tipo', 'reclutador_coordinador')
            .eq('reclutador_id', s.id)
            .eq('coordinador_id', coordinador.id)
            .is('vacante_id', null)
            .single()
          chatExistente = chatYaExistente
        } else {
          chatExistente = chatNuevo
        }
      }

      if (chatExistente) {
        resultados.push({
          agenciaId: rel.agencia_id,
          nombreAgencia: rel.agencias?.nombre ?? 'Agencia',
          coordinadorId: coordinador.id,
          nombreCoordinador: coordinador.nombre,
          chatId: chatExistente.id,
        })
      }
    }

    setChatsAgencias(resultados)
    // Con 1 sola agencia, se selecciona sola — el reclutador nunca ve
    // ninguna lista, mismo comportamiento de siempre.
    if (resultados.length === 1) setAgenciaSeleccionadaId(resultados[0].agenciaId)
    setLoading(false)
  }

  if (!sesion) return null

  const chatActivo = chatsAgencias.find(c => c.agenciaId === agenciaSeleccionadaId) ?? null
  const esMultiAgencia = chatsAgencias.length > 1

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ReclutadorNav subtitulo="Chat con coordinador" />

      <div className="max-w-4xl mx-auto w-full flex bg-white shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 90px)' }}>
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-8 w-full">Cargando...</p>
        ) : chatsAgencias.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8 w-full">No se encontró tu coordinador asignado.</p>
        ) : (
          <>
            {/* Lista de agencias — solo se muestra si hay 2 o más.
                En móvil ocupa toda la pantalla hasta que se elige una
                (patrón tipo WhatsApp); en escritorio va fija a la
                izquierda, siempre visible. */}
            {esMultiAgencia && (
              <div className={`w-full md:w-72 border-r border-gray-100 flex-shrink-0 overflow-y-auto ${agenciaSeleccionadaId ? 'hidden md:block' : 'block'}`}>
                <div className="p-4 border-b border-gray-100">
                  <p className="font-bold text-gray-900">Coordinadores</p>
                  <p className="text-xs text-gray-400">{chatsAgencias.length} agencias</p>
                </div>
                {chatsAgencias.map(c => (
                  <button
                    key={c.agenciaId}
                    onClick={() => setAgenciaSeleccionadaId(c.agenciaId)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      agenciaSeleccionadaId === c.agenciaId ? 'bg-green-50' : ''
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900">{c.nombreCoordinador}</p>
                    <p className="text-xs text-[#1A6B3C]">{c.nombreAgencia}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Chat activo */}
            <div className={`flex-1 flex flex-col min-w-0 ${esMultiAgencia && !agenciaSeleccionadaId ? 'hidden md:flex' : 'flex'}`}>
              {chatActivo ? (
                <>
                  <div className="p-4 border-b border-gray-100 bg-blue-50 flex-shrink-0 flex items-center gap-2">
                    {esMultiAgencia && (
                      <button
                        onClick={() => setAgenciaSeleccionadaId(null)}
                        className="md:hidden text-gray-500 hover:text-gray-700"
                      >
                        ←
                      </button>
                    )}
                    <p className="text-sm font-medium text-gray-700">
                      💬 Chat con {chatActivo.nombreCoordinador}
                      {esMultiAgencia && <span className="text-gray-400"> — {chatActivo.nombreAgencia}</span>}
                    </p>
                  </div>
                  <div className="flex-1 min-h-0">
                    <ChatCoordinadorReclutador
                      chatId={chatActivo.chatId}
                      nombreRemitente={sesion.nombre}
                      senderTipo="reclutador"
                    />
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-400 text-sm py-8">Selecciona un coordinador para ver la conversación.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
