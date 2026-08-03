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
  etapaActual?: string
  senderTipo?: 'candidato' | 'reclutador'
  onClose: () => void
}

export default function ChatWindow({ chatId, nombreCandidato, etapaActual, senderTipo = 'candidato', onClose }: Props) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [archivado, setArchivado] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Cargar mensajes existentes + estado actual del chat
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

    async function cargarEstadoChat() {
      const { data } = await supabase
        .from('chats')
        .select('archivado')
        .eq('id', chatId)
        .single()
      if (data) setArchivado(data.archivado)
    }
    cargarEstadoChat()

    // Marcar como leído cuando el reclutador abre el chat
    if (senderTipo === 'reclutador') {
      supabase.from('chats')
        .update({ leido_reclutador: true })
        .eq('id', chatId)
        .then(({ error }) => console.log('leido update:', error ?? 'ok'))
    }
  }, [chatId])

  // Realtime: si el reclutador descarta al candidato mientras tiene el chat
  // abierto, el bloqueo se aplica al instante sin necesidad de recargar.
  useEffect(() => {
    const canalChat = supabase
      .channel(`chat-status-${chatId}-${Math.random()}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chats',
        filter: `id=eq.${chatId}`
      }, (payload) => {
        setArchivado((payload.new as { archivado: boolean }).archivado)
      })
      .subscribe()

    return () => { supabase.removeChannel(canalChat) }
  }, [chatId])

  // Suscripción Realtime
  useEffect(() => {
    const canal = supabase
      .channel(`chat-${chatId}-${Math.random()}`)
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
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 100)
  }, [mensajes])

  async function enviarMensaje() {
    if (!texto.trim() || enviando) return
    setEnviando(true)

    await supabase.from('mensajes').insert({
      chat_id: chatId,
      sender_tipo: senderTipo,
      sender_nombre: nombreCandidato,
      texto: texto.trim(),
      timestamp: new Date().toISOString()
    })

    // Actualizar último mensaje en el chat
    await supabase.from('chats').update({
      ultimo_mensaje: texto.trim(),
      ultimo_mensaje_at: new Date().toISOString(),
      ultimo_sender_tipo: senderTipo,
      leido_reclutador: senderTipo === 'candidato' ? false : true
    }).eq('id', chatId)

    setTexto('')
    setEnviando(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
        <p className="text-sm font-medium text-gray-700">💬 Chat con el reclutador</p>
        {(archivado || etapaActual) && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            {archivado ? 'Descartado' : etapaActual}
          </span>
        )}
      </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm"
        >
          ✕
        </button>
      </div>

      {/* Mensajes */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {mensajes.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">
            Tu mensaje será enviado al reclutador. Pronto te contactarán.
          </p>
        )}
        {mensajes.map((m, i) => {
          const fechaActual = new Date(m.timestamp).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
          const fechaAnterior = i > 0 ? new Date(mensajes[i-1].timestamp).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : null
          const mostrarFecha = fechaActual !== fechaAnterior
          return (
            <div key={m.id}>
              {mostrarFecha && (
                <div className="flex items-center justify-center my-2">
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {fechaActual}
                  </span>
                </div>
              )}
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
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input — bloqueado si la postulación fue descartada (CA-10.4) */}
      {archivado && senderTipo === 'candidato' ? (
        <div className="border-t border-gray-100 p-3 text-center">
          <p className="text-xs text-gray-400">
            Esta postulación ha sido cerrada. Puedes aplicar a otras vacantes en TuChamba.
          </p>
        </div>
      ) : (
        <div className="border-t border-gray-100 p-3 flex gap-2">
          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensaje() } }}
            placeholder="Escribe un mensaje..."
            rows={1}
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] resize-none overflow-hidden"
            style={{ maxHeight: '80px', overflowY: 'auto' }}
            onInput={e => {
              const t = e.target as HTMLTextAreaElement
              t.style.height = 'auto'
              t.style.height = Math.min(t.scrollHeight, 80) + 'px'
            }}
          />
          <button
            onClick={enviarMensaje}
            disabled={!texto.trim() || enviando}
            className="w-9 h-9 bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-40 text-white rounded-full flex items-center justify-center"
          >
            ➤
          </button>
        </div>
      )}
    </div>
  )
}