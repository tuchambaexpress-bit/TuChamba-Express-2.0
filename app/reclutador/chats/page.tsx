'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ChatWindow from '@/components/candidato/ChatWindow'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'

interface Chat {
  id: string
  candidato_id: string
  ultimo_mensaje: string | null
  ultimo_mensaje_at: string | null
  ultimo_sender_tipo: string | null
  leido_reclutador: boolean
  candidatos: { nombre: string; telefono: string }
  vacantes: { titulo: string }
  postulaciones: { etapa_actual: string }[]
}

function ChatsReclutadorInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatIdParam = searchParams.get('chat')
  const candidatoIdParam = searchParams.get('candidato')

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
        event: '*',
        schema: 'public',
        table: 'chats',
        filter: `reclutador_id=eq.${sesion.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          // Chat nuevo (candidato recién postulado): sí necesitamos los
          // joins completos (nombre, vacante), así que recargamos todo.
          cargarChats(sesion.id)
          return
        }

        const cambio = payload.new as Record<string, any>
        const soloMarcadoLeido = payload.old &&
          Object.keys(cambio).every(k =>
            k === 'leido_reclutador' || (cambio as any)[k] === (payload.old as any)[k]
          )

        if (soloMarcadoLeido) {
          // Solo cambió el estado de "leído" — actualizamos esa fila sin
          // reordenar ni recargar todo, para que la lista no "baile".
          setChats(prev => prev.map(c =>
            c.id === cambio.id ? { ...c, leido_reclutador: cambio.leido_reclutador } : c
          ))
        } else {
          // Cambió algo que sí afecta el orden (mensaje nuevo, archivado, etc.)
          cargarChats(sesion.id)
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [sesion])

  async function cargarChats(reclutadorId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('chats')
      .select(`
        id, candidato_id, ultimo_mensaje, ultimo_mensaje_at, ultimo_sender_tipo, leido_reclutador,
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

  const [ordenPor, setOrdenPor] = useState<'fecha' | 'nombre' | 'vacante'>('fecha')

  const chatsFiltrados = candidatoIdParam
    ? chats.filter(c => c.candidato_id === candidatoIdParam)
    : chats

  const chatsOrdenados = [...chatsFiltrados].sort((a, b) => {
    if (ordenPor === 'nombre') {
      return (a.candidatos?.nombre ?? '').localeCompare(b.candidatos?.nombre ?? '')
    }
    if (ordenPor === 'vacante') {
      return (a.vacantes?.titulo ?? '').localeCompare(b.vacantes?.titulo ?? '')
    }
    // 'fecha' — más reciente primero (mismo orden que ya trae cargarChats)
    return (b.ultimo_mensaje_at ?? '').localeCompare(a.ultimo_mensaje_at ?? '')
  })

  const chatActivo = chats.find(c => c.id === chatSeleccionado)

  return (
    <div className="min-h-screen bg-gray-50">
      <ReclutadorNav />

      <div className="max-w-7xl mx-auto flex h-[calc(100vh-64px)]">
        {/* Lista de chats */}
        <div className="w-full md:w-80 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-gray-100 bg-blue-50">
            <h2 className="font-bold text-gray-900">Chats</h2>
            <p className="text-xs text-gray-400 mb-2">
              {chatsFiltrados.length} conversaciones
              {candidatoIdParam && (
                <> · <a href="/reclutador/chats" className="text-[#1A6B3C] underline">ver todos</a></>
              )}
            </p>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 whitespace-nowrap">Ordenar por:</label>
              <select
                value={ordenPor}
                onChange={e => setOrdenPor(e.target.value as 'fecha' | 'nombre' | 'vacante')}
                className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#1A6B3C]"
              >
                <option value="fecha">Más reciente</option>
                <option value="nombre">Nombre</option>
                <option value="vacante">Vacante</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-400 text-sm">Cargando...</div>
          ) : chats.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-2xl mb-2">💬</p>
              <p className="text-sm">No tienes chats activos</p>
            </div>
          ) : (
            chatsOrdenados.map(c => {
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
export default function ChatsReclutador() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400">Cargando...</p></div>}>
      <ChatsReclutadorInner />
    </Suspense>
  )
}