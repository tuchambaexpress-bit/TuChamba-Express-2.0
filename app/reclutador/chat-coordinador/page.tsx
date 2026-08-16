'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'
import ChatCoordinadorReclutador from '@/components/shared/ChatCoordinadorReclutador'

export default function ChatCoordinadorReclutadorPage() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [chatId, setChatId] = useState<string | null>(null)
  const [nombreCoordinador, setNombreCoordinador] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) { router.push('/reclutador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarChat(s)
  }, [])

  async function cargarChat(s: any) {
    const supabase = createClient()

    // Busca la agencia y coordinador del reclutador
    const { data: relacion, error: errorRelacion } = await supabase
      .from('reclutador_agencia')
      .select('agencia_id')
      .eq('reclutador_id', s.id)
      .eq('activo', true)
      .maybeSingle()

    if (!relacion) { setLoading(false); return }

    const { data: coordinadoresDisponibles } = await supabase
      .from('coordinadores')
      .select('id, nombre')
      .eq('agencia_id', relacion.agencia_id)
      .eq('status', 'activo')
      .order('created_at', { ascending: true })
      .limit(1)

    const coordinador = coordinadoresDisponibles?.[0] ?? null

    if (!coordinador) { setLoading(false); return }
    setNombreCoordinador(coordinador.nombre)

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
          agencia_id: relacion.agencia_id,
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

    if (chatExistente) setChatId(chatExistente.id)
    setLoading(false)
  }

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ReclutadorNav subtitulo="Chat con coordinador" />

      <div className="max-w-2xl mx-auto w-full flex flex-col bg-white shadow-lg" style={{ height: 'calc(100vh - 90px)' }}>
        {loading ? (
          <p className="text-center text-gray-400 text-sm py-8">Cargando...</p>
        ) : chatId ? (
          <>
            <div className="p-4 border-b border-gray-100 bg-blue-50 flex-shrink-0">
              <p className="text-sm font-medium text-gray-700">💬 Chat con {nombreCoordinador}</p>
            </div>
            <div className="flex-1 min-h-0">
              <ChatCoordinadorReclutador
                chatId={chatId}
                nombreRemitente={sesion.nombre}
                senderTipo="reclutador"
              />
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 text-sm py-8">No se encontró tu coordinador asignado.</p>
        )}
      </div>
    </div>
  )
}
