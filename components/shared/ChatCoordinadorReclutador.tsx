'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AvisoPrivacidadChat from '@/components/shared/AvisoPrivacidadChat'

interface Mensaje {
  id: string
  sender_tipo: string
  sender_nombre: string
  texto: string
  timestamp: string
}

interface Props {
  chatId: string
  nombreRemitente: string
  senderTipo: 'reclutador' | 'coordinador'
}

export default function ChatCoordinadorReclutador({ chatId, nombreRemitente, senderTipo }: Props) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

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

    // Al abrir el chat, marca como leído del lado correspondiente
    if (senderTipo === 'coordinador') {
      supabase.from('chats').update({ leido_coordinador: true }).eq('id', chatId)
    }
  }, [chatId])

  useEffect(() => {
    const canal = supabase
      .channel(`chat-cr-${chatId}-${Math.random()}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mensajes',
        filter: `chat_id=eq.${chatId}`
      }, (payload) => {
        const nuevo = payload.new as Mensaje
        setMensajes(prev => prev.some(m => m.id === nuevo.id) ? prev : [...prev, nuevo])
      })
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [chatId])

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }, 100)
  }, [mensajes])

  async function enviarMensaje() {
    if (!texto.trim() || enviando) return
    setEnviando(true)

    const { data: mensajeInsertado, error } = await supabase
      .from('mensajes')
      .insert({
        chat_id: chatId,
        sender_tipo: senderTipo,
        sender_nombre: nombreRemitente,
        texto: texto.trim(),
        timestamp: new Date().toISOString()
      })
      .select('id, sender_tipo, sender_nombre, texto, timestamp')
      .single()

    if (!error && mensajeInsertado) {
      setMensajes(prev => prev.some(m => m.id === mensajeInsertado.id) ? prev : [...prev, mensajeInsertado])
    }

    await supabase.from('chats').update({
      ultimo_mensaje: texto.trim(),
      ultimo_mensaje_at: new Date().toISOString(),
      ultimo_sender_tipo: senderTipo,
      leido_coordinador: senderTipo === 'reclutador' ? false : true,
    }).eq('id', chatId)

    setTexto('')
    setEnviando(false)
  }

  return (
    <div className="flex flex-col h-full">
      <AvisoPrivacidadChat />

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {mensajes.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">
            Aquí puedes platicar directo con {senderTipo === 'reclutador' ? 'tu coordinador' : 'tu reclutador'}.
          </p>
        )}
        {mensajes.map((m, i) => {
          const fechaActual = new Date(m.timestamp).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
          const fechaAnterior = i > 0 ? new Date(mensajes[i - 1].timestamp).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : null
          const mostrarFecha = fechaActual !== fechaAnterior
          const esPropio = m.sender_tipo === senderTipo

          return (
            <div key={m.id}>
              {mostrarFecha && (
                <div className="flex items-center justify-center my-2">
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{fechaActual}</span>
                </div>
              )}
              <div className={`flex ${esPropio ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                  esPropio ? 'bg-[#1A6B3C] text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {!esPropio && <p className="text-[10px] font-medium opacity-70 mb-0.5">{m.sender_nombre}</p>}
                  <p>{m.texto}</p>
                  <p className={`text-xs mt-1 ${esPropio ? 'text-green-200' : 'text-gray-400'}`}>
                    {new Date(m.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-gray-100 p-3 flex gap-2">
        <textarea
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensaje() } }}
          placeholder="Escribe un mensaje..."
          rows={1}
          className="flex-1 border border-gray-200 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] resize-none"
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
          className="w-9 h-9 bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-40 text-white rounded-full flex items-center justify-center flex-shrink-0"
        >
          ➤
        </button>
      </div>
    </div>
  )
}
