'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  titulo?: string
  subtitulo?: string
}

export default function ReclutadorNav({ titulo = 'Tu Chamba Express', subtitulo }: Props) {
  const router = useRouter()
  const [reclutadorId, setReclutadorId] = useState<string | null>(null)
  const [alertasSinLeer, setAlertasSinLeer] = useState(0)
  const [chatsSinLeer, setChatsSinLeer] = useState(0)

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) return
    const s = JSON.parse(data)
    setReclutadorId(s.id)
  }, [])

  useEffect(() => {
    if (!reclutadorId) return
    const supabase = createClient()

    async function cargarConteoAlertas() {
      const { count } = await supabase
        .from('alertas')
        .select('*', { count: 'exact', head: true })
        .eq('reclutador_id', reclutadorId)
        .eq('leida', false)
      setAlertasSinLeer(count ?? 0)
    }

    async function cargarConteoChats() {
      const { count } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('reclutador_id', reclutadorId)
        .eq('leido_reclutador', false)
      setChatsSinLeer(count ?? 0)
    }

    cargarConteoAlertas()
    cargarConteoChats()

    const canalAlertas = supabase
      .channel(`alertas-nav-${reclutadorId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'alertas',
        filter: `reclutador_id=eq.${reclutadorId}`
      }, () => cargarConteoAlertas())
      .subscribe()

    const canalChats = supabase
      .channel(`chats-nav-${reclutadorId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chats',
        filter: `reclutador_id=eq.${reclutadorId}`
      }, () => cargarConteoChats())
      .subscribe()

    return () => {
      supabase.removeChannel(canalAlertas)
      supabase.removeChannel(canalChats)
    }
  }, [reclutadorId])

  return (
    <header className="bg-[#1A6B3C] px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl">{titulo}</h1>
          {subtitulo && <p className="text-green-200 text-sm">{subtitulo}</p>}
        </div>
        <div className="flex gap-4 items-center">
          <a href="/reclutador/dashboard" className="text-green-200 hover:text-white text-sm">Dashboard</a>
          <a href="/reclutador/pipeline" className="text-green-200 hover:text-white text-sm">Pipeline</a>
          <a href="/reclutador/chats" className="relative text-green-200 hover:text-white text-sm">
            Chats
            {chatsSinLeer > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {chatsSinLeer > 9 ? '9+' : chatsSinLeer}
              </span>
            )}
          </a>
          <a href="/reclutador/comisiones" className="text-green-200 hover:text-white text-sm">Comisiones</a>
          <a href="/reclutador/chat-coordinador" className="text-green-200 hover:text-white text-sm">Coordinador</a>
          <a href="/reclutador/alertas" className="relative text-green-200 hover:text-white text-sm">
            Alertas
            {alertasSinLeer > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {alertasSinLeer > 9 ? '9+' : alertasSinLeer}
              </span>
            )}
          </a>
          <button
            onClick={() => {
              localStorage.removeItem('reclutador_sesion')
              router.push('/reclutador/login')
            }}
            className="text-green-200 hover:text-white text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}
