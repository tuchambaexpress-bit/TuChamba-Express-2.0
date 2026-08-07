'use client'

import { useRouter } from 'next/navigation'

interface Props {
  subtitulo?: string
}

export default function CoordinadorNav({ subtitulo }: Props) {
  const router = useRouter()

  function obtenerSesion() {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem('coordinador_sesion')
    return data ? JSON.parse(data) : null
  }

  const sesion = obtenerSesion()

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
          <a href="/coordinador/corte-semanal" className="text-green-200 hover:text-white text-sm">Corte semanal</a>
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
