'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  subtitulo?: string
}

export default function CoordinadorNav({ subtitulo }: Props) {
  const router = useRouter()
  const [chatsSinLeer, setChatsSinLeer] = useState(0)
  const [avisoCorte, setAvisoCorte] = useState(0)
  const [preguntasSinContestar, setPreguntasSinContestar] = useState(0)

  function obtenerSesion() {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem('coordinador_sesion')
    return data ? JSON.parse(data) : null
  }

  const sesion = obtenerSesion()

  useEffect(() => {
    if (!sesion?.id) return
    const supabase = createClient()

    async function cargarConteoChats() {
      const { count } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })
        .eq('coordinador_id', sesion.id)
        .eq('leido_coordinador', false)
      setChatsSinLeer(count ?? 0)
    }
    cargarConteoChats()

    const canal = supabase
      .channel(`chats-nav-coordinador-${sesion.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chats',
        filter: `coordinador_id=eq.${sesion.id}`
      }, () => cargarConteoChats())
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [sesion?.id])

  // 5.26: si hoy es el día de corte configurado, avisa cuántas comisiones
  // siguen pendientes de generar — mismo estilo que el badge de chats.
  useEffect(() => {
    if (!sesion?.agencia_id) return
    const supabase = createClient()

    async function revisarCorte() {
      const { data: agencia } = await supabase
        .from('agencias')
        .select('dia_corte')
        .eq('id', sesion.agencia_id)
        .single()

      const hoyEsDiaCorte = new Date().getDay() === ((agencia?.dia_corte ?? 4) % 7)
      if (!hoyEsDiaCorte) { setAvisoCorte(0); return }

      const d = new Date()
      const hoy = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const { count } = await supabase
        .from('postulaciones')
        .select('*', { count: 'exact', head: true })
        .eq('agencia_id', sesion.agencia_id)
        .eq('comision_aplicable', true)
        .eq('pagado', false)
        .lt('fecha_garantia_fin', hoy)
      setAvisoCorte(count ?? 0)
    }
    revisarCorte()

    const canal = supabase
      .channel(`corte-nav-coordinador-${sesion.agencia_id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'postulaciones',
        filter: `agencia_id=eq.${sesion.agencia_id}`
      }, () => revisarCorte())
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [sesion?.agencia_id])

  // 5.12: preguntas escaladas sin contestar
  useEffect(() => {
    if (!sesion?.agencia_id) return
    const supabase = createClient()

    async function cargarConteoFaq() {
      const { count } = await supabase
        .from('faq_escalaciones')
        .select('*', { count: 'exact', head: true })
        .eq('agencia_id', sesion.agencia_id)
        .is('respuesta', null)
      setPreguntasSinContestar(count ?? 0)
    }
    cargarConteoFaq()

    const canal = supabase
      .channel(`faq-nav-coordinador-${sesion.agencia_id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'faq_escalaciones',
        filter: `agencia_id=eq.${sesion.agencia_id}`
      }, () => cargarConteoFaq())
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [sesion?.agencia_id])

  return (
    <header className="bg-[#1A6B3C] px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <img src="/Logo_Header.png" alt="Tu Chamba Express" className="h-8 object-contain" />
          <p className="text-green-200 text-sm mt-1">{subtitulo ?? 'Portal Coordinador'}</p>
        </div>
        <div className="flex gap-4 items-center">
          <a href="/coordinador/dashboard" className="text-green-200 hover:text-white text-sm">Dashboard</a>
          <a href="/coordinador/vacantes" className="text-green-200 hover:text-white text-sm">Vacantes</a>
          <a href="/coordinador/reclutadores" className="text-green-200 hover:text-white text-sm">Reclutadores</a>
          <a href="/coordinador/pipeline" className="text-green-200 hover:text-white text-sm">Pipeline</a>
          <a href="/coordinador/chat-reclutadores" className="relative text-green-200 hover:text-white text-sm">
            Chat
            {chatsSinLeer > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {chatsSinLeer > 9 ? '9+' : chatsSinLeer}
              </span>
            )}
          </a>
          <a href="/coordinador/corte-semanal" className="relative text-green-200 hover:text-white text-sm">
            Corte semanal
            {avisoCorte > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {avisoCorte > 9 ? '9+' : avisoCorte}
              </span>
            )}
          </a>
          <a href="/coordinador/faq" className="relative text-green-200 hover:text-white text-sm">
            FAQ
            {preguntasSinContestar > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {preguntasSinContestar > 9 ? '9+' : preguntasSinContestar}
              </span>
            )}
          </a>
          <a href="/coordinador/perfil-agencia" className="text-green-200 hover:text-white text-sm">Perfil</a>
          <a href="/coordinador/contratados" className="text-green-200 hover:text-white text-sm">Histórico</a>
          {sesion?.nombre && (
            <span className="text-green-200 text-sm hidden lg:inline">Hola, {sesion.nombre}</span>
          )}
          <button
            onClick={() => {
              localStorage.removeItem('coordinador_sesion')
              router.push('/coordinador/login')
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
