'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Mensaje {
  id: string
  sender_tipo: string
  sender_nombre: string
  texto: string
  timestamp: string
}

interface Props {
  chatId: string
  nombreCandidato: string
  onClose: () => void
}

export default function ChatWindow({ chatId, nombreCandidato, onClose }: Props) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Cargar mensajes existentes
  useEffect(() => {
    async function cargarMensajes() {
      const { data } = await supabase
        .from('mensajes')
        .select('id, sender_tipo, sender_nombre, texto, timestamp')
        .eq('chat_id', chatId)
        .order('timestamp', { ascending: true })
      if (data) setMensajes(data)
    }
    cargarMensajes()
  }, [chatId])

  // Suscripción Realtime
  useEffect(() => {
    const canal = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mensajes',
        filter: `chat_id=eq.${chatId}`
      }, (payload) => {
        setMensajes(prev => [...prev, payload.new as Mensaje])
      })
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [chatId])

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  async function enviarMensaje() {
    if (!texto.trim() || enviando) return
    setEnviando(true)

    await supabase.from('mensajes').insert({
      chat_id: chatId,
      sender_tipo: 'candidato',
      sender_nombre: nombreCandidato,
      texto: texto.trim(),
      timestamp: new Date().toISOString()
    })

    // Actualizar último mensaje en el chat
    await supabase.from('chats').update({
      ultimo_mensaje: texto.trim(),
      ultimo_mensaje_at: new Date().toISOString(),
      ultimo_sender_tipo: 'candidato'
    }).eq('id', chatId)

    setTexto('')
    setEnviando(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-700">💬 Chat con el reclutador</p>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm"
        >
          ✕
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">
        {mensajes.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">
            Tu mensaje será enviado al reclutador. Pronto te contactarán.
          </p>
        )}
        {mensajes.map(m => (
          <div
            key={m.id}
            className={`flex ${m.sender_tipo === 'candidato' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
              m.sender_tipo === 'candidato'
                ? 'bg-[#1A6B3C] text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              <p>{m.texto}</p>
              <p className={`text-xs mt-1 ${m.sender_tipo === 'candidato' ? 'text-green-200' : 'text-gray-400'}`}>
                {new Date(m.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-3 flex gap-2">
        <input
          type="text"
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && enviarMensaje()}
          placeholder="Escribe un mensaje..."
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
        />
        <button
          onClick={enviarMensaje}
          disabled={!texto.trim() || enviando}
          className="w-9 h-9 bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-40 text-white rounded-full flex items-center justify-center"
        >
          ➤
        </button>
      </div>
    </div>
  )
}