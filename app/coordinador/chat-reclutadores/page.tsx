'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CoordinadorNav from '@/components/coordinador/CoordinadorNav'
import ChatCoordinadorReclutador from '@/components/shared/ChatCoordinadorReclutador'

interface Chat {
  id: string
  reclutador_id: string
  ultimo_mensaje: string | null
  ultimo_mensaje_at: string | null
  leido_coordinador: boolean
  reclutadores: { nombre: string; codigo: string }
}

export default function ChatReclutadoresCoordinador() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [chatSeleccionado, setChatSeleccionado] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = localStorage.getItem('coordinador_sesion')
    if (!data) { router.push('/coordinador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarChats(s)
  }, [])

  useEffect(() => {
    if (!sesion?.id) return
    const supabase = createClient()
    const canal = supabase
      .channel(`chats-coordinador-${sesion.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chats',
        filter: `coordinador_id=eq.${sesion.id}`
      }, () => cargarChats(sesion))
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [sesion])

  async function cargarChats(s: any) {
    const supabase = createClient()

    // Trae todos los reclutadores de la agencia
    const { data: relaciones } = await supabase
      .from('reclutador_agencia')
      .select('reclutadores(id, nombre, codigo)')
      .eq('agencia_id', s.agencia_id)
      .eq('activo', true)

    const reclutadores = (relaciones ?? []).map((r: any) => r.reclutadores).filter(Boolean)

    // Por cada reclutador, busca o crea el chat general (sin vacante_id)
    const chatsCompletos: Chat[] = []
    for (const r of reclutadores) {
      let { data: chatExistente } = await supabase
        .from('chats')
        .select('id, reclutador_id, ultimo_mensaje, ultimo_mensaje_at, leido_coordinador')
        .eq('tipo', 'reclutador_coordinador')
        .eq('reclutador_id', r.id)
        .eq('coordinador_id', s.id)
        .is('vacante_id', null)
        .maybeSingle()

      if (!chatExistente) {
        const { data: chatNuevo, error: errorCreacion } = await supabase
          .from('chats')
          .insert({
            tipo: 'reclutador_coordinador',
            reclutador_id: r.id,
            coordinador_id: s.id,
            agencia_id: s.agencia_id,
          })
          .select('id, reclutador_id, ultimo_mensaje, ultimo_mensaje_at, leido_coordinador')
          .single()

        if (errorCreacion) {
          // El índice único lo rechazó (alguien más lo creó primero) — lo buscamos de nuevo
          const { data: chatYaExistente } = await supabase
            .from('chats')
            .select('id, reclutador_id, ultimo_mensaje, ultimo_mensaje_at, leido_coordinador')
            .eq('tipo', 'reclutador_coordinador')
            .eq('reclutador_id', r.id)
            .eq('coordinador_id', s.id)
            .is('vacante_id', null)
            .single()
          chatExistente = chatYaExistente
        } else {
          chatExistente = chatNuevo
        }
      }

      if (chatExistente) {
        chatsCompletos.push({ ...chatExistente, reclutadores: r })
      }
    }

    chatsCompletos.sort((a, b) => (b.ultimo_mensaje_at ?? '').localeCompare(a.ultimo_mensaje_at ?? ''))
    setChats(chatsCompletos)
    setLoading(false)
  }

  const [ordenPor, setOrdenPor] = useState<'reciente' | 'nombre' | 'sin_leer'>('reciente')

  const chatsOrdenados = [...chats].sort((a, b) => {
    if (ordenPor === 'nombre') {
      return (a.reclutadores?.nombre ?? '').localeCompare(b.reclutadores?.nombre ?? '')
    }
    if (ordenPor === 'sin_leer') {
      // Los no leídos primero; dentro de cada grupo, por más reciente
      if (a.leido_coordinador !== b.leido_coordinador) {
        return a.leido_coordinador ? 1 : -1
      }
      return (b.ultimo_mensaje_at ?? '').localeCompare(a.ultimo_mensaje_at ?? '')
    }
    return (b.ultimo_mensaje_at ?? '').localeCompare(a.ultimo_mensaje_at ?? '')
  })

  const chatActivo = chats.find(c => c.id === chatSeleccionado)

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CoordinadorNav subtitulo="Chat con reclutadores" />

      <div className="max-w-6xl mx-auto flex h-[calc(100vh-90px)] shadow-lg bg-white">
        <div className="w-full md:w-1/3 flex flex-col border-r border-gray-200">
          <div className="p-4 border-b border-gray-100 bg-blue-50">
            <h2 className="font-bold text-gray-900">Reclutadores</h2>
            <p className="text-xs text-gray-400 mb-2">{chats.length} conversaciones</p>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 whitespace-nowrap">Ordenar por:</label>
              <select
                value={ordenPor}
                onChange={e => setOrdenPor(e.target.value as 'reciente' | 'nombre' | 'sin_leer')}
                className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#1A6B3C]"
              >
                <option value="reciente">Más reciente</option>
                <option value="nombre">Nombre</option>
                <option value="sin_leer">Sin leer</option>
              </select>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-400 text-sm py-8">Cargando...</p>
            ) : (
              chatsOrdenados.map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    setChatSeleccionado(c.id)
                    if (!c.leido_coordinador) {
                      setChats(prev => prev.map(ch => ch.id === c.id ? { ...ch, leido_coordinador: true } : ch))
                    }
                  }}
                  className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 relative ${
                    chatSeleccionado === c.id ? 'bg-green-50' : !c.leido_coordinador ? 'bg-green-50/40' : ''
                  }`}
                >
                  {!c.leido_coordinador && (
                    <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-green-500 rounded-full" />
                  )}
                  <p className={`text-sm ${!c.leido_coordinador ? 'font-bold text-gray-900' : 'font-medium text-gray-900'}`}>
                    {c.reclutadores?.nombre}
                  </p>
                  <p className="text-xs text-gray-400">{c.reclutadores?.codigo}</p>
                  {c.ultimo_mensaje && (
                    <p className={`text-xs truncate mt-1 ${!c.leido_coordinador ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                      {c.ultimo_mensaje}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="hidden md:flex flex-1 flex-col">
          {chatActivo ? (
            <ChatCoordinadorReclutador
              key={chatActivo.id}
              chatId={chatActivo.id}
              nombreRemitente={sesion.nombre}
              senderTipo="coordinador"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <p className="text-4xl mb-3">💬</p>
              <p>Selecciona un reclutador para chatear</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
