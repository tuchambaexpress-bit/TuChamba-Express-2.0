'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  subtitulo?: string
}

interface NavLink {
  href: string
  label: string
  badgeKey?: 'chats' | 'corte' | 'faq'
}

const LINKS: NavLink[] = [
  { href: '/coordinador/dashboard', label: 'Dashboard' },
  { href: '/coordinador/vacantes', label: 'Vacantes' },
  { href: '/coordinador/reclutadores', label: 'Reclutadores' },
  { href: '/coordinador/pipeline', label: 'Pipeline' },
  { href: '/coordinador/chat-reclutadores', label: 'Chat', badgeKey: 'chats' },
  { href: '/coordinador/corte-semanal', label: 'Corte semanal', badgeKey: 'corte' },
  { href: '/coordinador/faq', label: 'FAQ', badgeKey: 'faq' },
  { href: '/coordinador/perfil-agencia', label: 'Perfil' },
  { href: '/coordinador/contratados', label: 'Histórico' },
]

export default function CoordinadorNav({ subtitulo }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [chatsSinLeer, setChatsSinLeer] = useState(0)
  const [avisoCorte, setAvisoCorte] = useState(0)
  const [preguntasSinContestar, setPreguntasSinContestar] = useState(0)
  const [menuAbierto, setMenuAbierto] = useState(false)

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

  function cerrarSesion() {
    localStorage.removeItem('coordinador_sesion')
    router.push('/coordinador/login')
  }

  function badgeDe(key?: 'chats' | 'corte' | 'faq') {
    if (key === 'chats') return chatsSinLeer
    if (key === 'corte') return avisoCorte
    if (key === 'faq') return preguntasSinContestar
    return 0
  }

  const totalBadges = chatsSinLeer + avisoCorte + preguntasSinContestar

  return (
    <header className="bg-[#1A6B3C] px-6 py-4 shadow-md relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <img src="/Logo_Header.png" alt="Tu Chamba Express" className="h-8 object-contain" />
          <p className="text-green-200 text-sm mt-1">{subtitulo ?? 'Portal Coordinador'}</p>
        </div>

        {/* Fila normal — solo desktop (7.19, 2026-08-24: antes se veía en
            todas las pantallas, 9 links sin ningún colapso para celular) */}
        <div className="hidden md:flex gap-4 items-center">
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className={`relative text-sm pb-1 ${
                pathname === l.href
                  ? 'text-white font-semibold border-b-2 border-white'
                  : 'text-green-200 hover:text-white'
              }`}
            >
              {l.label}
              {badgeDe(l.badgeKey) > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {badgeDe(l.badgeKey) > 9 ? '9+' : badgeDe(l.badgeKey)}
                </span>
              )}
            </a>
          ))}
          {sesion?.nombre && (
            <span className="text-green-200 text-sm hidden lg:inline">Hola, {sesion.nombre}</span>
          )}
          <button onClick={cerrarSesion} className="text-green-200 hover:text-white text-sm">
            Cerrar sesión
          </button>
        </div>

        {/* Botón hamburguesa — solo celular/tablet */}
        <button
          onClick={() => setMenuAbierto(v => !v)}
          className="md:hidden relative text-white w-9 h-9 flex items-center justify-center"
          aria-label="Menú"
        >
          <span className="text-2xl leading-none">{menuAbierto ? '✕' : '☰'}</span>
          {totalBadges > 0 && !menuAbierto && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {totalBadges > 9 ? '9+' : totalBadges}
            </span>
          )}
        </button>
      </div>

      {/* Menú desplegable — solo celular/tablet */}
      {menuAbierto && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#155c33] shadow-lg z-50 border-t border-white/10">
          <div className="flex flex-col px-6 py-2">
            {sesion?.nombre && (
              <p className="text-green-200 text-xs py-2 border-b border-white/10">Hola, {sesion.nombre}</p>
            )}
            {LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuAbierto(false)}
                className={`flex items-center justify-between text-sm py-3 border-b border-white/10 last:border-0 ${
                  pathname === l.href ? 'text-white font-semibold' : 'text-green-100 hover:text-white'
                }`}
              >
                <span>{l.label}</span>
                {badgeDe(l.badgeKey) > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                    {badgeDe(l.badgeKey) > 9 ? '9+' : badgeDe(l.badgeKey)}
                  </span>
                )}
              </a>
            ))}
            <button
              onClick={cerrarSesion}
              className="text-left text-green-100 hover:text-white text-sm py-3"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
