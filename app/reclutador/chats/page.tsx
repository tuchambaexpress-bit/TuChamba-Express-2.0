'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ChatWindow from '@/components/candidato/ChatWindow'

interface Chat {
  id: string
  ultimo_mensaje: string | null
  ultimo_mensaje_at: string | null
  ultimo_sender_tipo: string | null
  leido_reclutador: boolean
  candidatos: { nombre: string; telefono: string }
  vacantes: { titulo: string }
  postulaciones: { etapa_actual: string }[]
}

export default function ChatsReclutador() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatIdParam = searchParams.get('chat')

  const [chats, setChats] = useState<Chat[]>([])
  const [chatSeleccionado, setChatSeleccionado] = useState<string | null>(chatIdParam)
  const [sesion, setSesion] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) { router.push('/reclutador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarChats(s.id)
  }, [])

  useEffect(() => {
    if (!sesion) return
    const supabase = createClient()
    const canal = supabase
      .channel('chats-reclutador')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chats',
        filter: `reclutador_id=eq.${sesion.id}`
      }, (payload) => {
        setChats(prev => prev.map(c =>
          c.id === payload.new.id ? { ...c, ...payload.new } : c
        ))
      })
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [sesion])

  async function cargarChats(reclutadorId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('chats')
      .select(`
        id, ultimo_mensaje, ultimo_mensaje_at, ultimo_sender_tipo, leido_reclutador,
        candidatos(nombre, telefono),
        vacantes(titulo),
        postulaciones(etapa_actual)
      `)
      .eq('reclutador_id', reclutadorId)
      .eq('tipo', 'candidato_reclutador')
      .order('ultimo_mensaje_at', { ascending: false })

    if (data) setChats(data as any)
    setLoading(false)
  }

  const chatActivo = chats.find(c => c.id === chatSeleccionado)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A6B3C] px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-white font-bold text-xl">Tu Chamba Express</h1>
          <div className="flex gap-4">
            <a href="/reclutador/dashboard" className="text-green-200 hover:text-white text-sm">Dashboard</a>
            <a href="/reclutador/pipeline" className="text-green-200 hover:text-white text-sm">Pipeline</a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex h-[calc(100vh-64px)]">
        {/* Lista de chats */}
        <div className="w-full md:w-80 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Chats</h2>
            <p className="text-xs text-gray-400">{chats.length} conversaciones</p>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-400 text-sm">Cargando...</div>
          ) : chats.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-2xl mb-2">💬</p>
              <p className="text-sm">No tienes chats activos</p>
            </div>
          ) : (
            chats.map(c => {
              const tieneNuevo = !c.leido_reclutador
              const etapa = c.postulaciones?.[0]?.etapa_actual ?? ''
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setChatSeleccionado(c.id)
                    setChats(prev => prev.map(chat => 
                      chat.id === c.id ? { ...chat, leido_reclutador: true } : chat
                    ))
                  }}
                  className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                    chatSeleccionado === c.id 
                      ? 'bg-green-50 border-l-4 border-l-[#1A6B3C]' 
                      : tieneNuevo 
                        ? 'bg-green-50 border-l-4 border-l-green-400' 
                        : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {c.candidatos?.nombre}
                      </p>
                      <p className="text-xs text-[#1A6B3C] truncate">{c.vacantes?.titulo}</p>
                      {c.ultimo_mensaje && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">{c.ultimo_mensaje}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2 flex-shrink-0">
                      {tieneNuevo && (
                        <span className="w-2 h-2 bg-[#1A6B3C] rounded-full"/>
                      )}
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                        {etapa}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Panel de chat */}
        <div className="hidden md:flex flex-1 flex-col bg-white">
          {chatActivo ? (
            <ChatWindow
              chatId={chatActivo.id}
              nombreCandidato={sesion?.nombre ?? 'Reclutador'}
              etapaActual={chatActivo.postulaciones?.[0]?.etapa_actual}
              senderTipo="reclutador"
              onClose={() => setChatSeleccionado(null)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-lg font-medium">Selecciona una conversación</p>
              <p className="text-sm">Elige un chat de la lista para ver los mensajes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}