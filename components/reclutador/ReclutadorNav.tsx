'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  titulo?: string
  subtitulo?: string
}

interface NavLink {
  href: string
  label: string
  badgeKey?: 'chats' | 'alertas'
}

const LINKS: NavLink[] = [
  { href: '/reclutador/dashboard', label: 'Dashboard' },
  { href: '/reclutador/pipeline', label: 'Pipeline' },
  { href: '/reclutador/vacantes', label: 'Vacantes' },
  { href: '/reclutador/chats', label: 'Chats', badgeKey: 'chats' },
  { href: '/reclutador/comisiones', label: 'Comisiones' },
  { href: '/reclutador/chat-coordinador', label: 'Coordinador' },
  { href: '/reclutador/recursos', label: '📚 Recursos' },
  { href: '/reclutador/alertas', label: 'Alertas', badgeKey: 'alertas' },
]

export default function ReclutadorNav({ titulo = 'Tu Chamba Express', subtitulo }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [reclutadorId, setReclutadorId] = useState<string | null>(null)
  const [alertasSinLeer, setAlertasSinLeer] = useState(0)
  const [chatsSinLeer, setChatsSinLeer] = useState(0)
  const [menuAbierto, setMenuAbierto] = useState(false)

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

  function cerrarSesion() {
    localStorage.removeItem('reclutador_sesion')
    router.push('/reclutador/login')
  }

  function badgeDe(key?: string) {
    if (key === 'chats') return chatsSinLeer
    if (key === 'alertas') return alertasSinLeer
    return 0
  }

  return (
    <header className="bg-[#1A6B3C] px-6 py-4 shadow-md relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl">{titulo}</h1>
          {subtitulo && <p className="text-green-200 text-sm">{subtitulo}</p>}
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
          {(chatsSinLeer + alertasSinLeer) > 0 && !menuAbierto && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {(chatsSinLeer + alertasSinLeer) > 9 ? '9+' : chatsSinLeer + alertasSinLeer}
            </span>
          )}
        </button>
      </div>

      {/* Menú desplegable — solo celular/tablet */}
      {menuAbierto && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#155c33] shadow-lg z-50 border-t border-white/10">
          <div className="flex flex-col px-6 py-2">
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
