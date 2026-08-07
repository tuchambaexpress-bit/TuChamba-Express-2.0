'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CoordinadorNav from '@/components/coordinador/CoordinadorNav'

export default function DashboardCoordinador() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem('coordinador_sesion')
    if (!data) {
      router.push('/coordinador/login')
      return
    }
    setSesion(JSON.parse(data))
  }, [])

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CoordinadorNav />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

        {/* Accesos rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <a href="/coordinador/vacantes" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
            <p className="text-3xl mb-2">💼</p>
            <p className="font-semibold text-gray-900 text-sm">Vacantes</p>
          </a>
          <a href="/coordinador/reclutadores" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
            <p className="text-3xl mb-2">👥</p>
            <p className="font-semibold text-gray-900 text-sm">Reclutadores</p>
          </a>
          <a href="/coordinador/pipeline" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
            <p className="text-3xl mb-2">📋</p>
            <p className="font-semibold text-gray-900 text-sm">Pipeline</p>
          </a>
          <a href="/coordinador/corte-semanal" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
            <p className="text-3xl mb-2">💰</p>
            <p className="font-semibold text-gray-900 text-sm">Corte semanal</p>
          </a>
        </div>

        {/* Próximamente */}
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <p className="text-4xl mb-3">🚧</p>
          <p className="text-gray-500 font-medium">Dashboard en construcción</p>
          <p className="text-gray-400 text-sm mt-1">Las métricas y gráficas estarán disponibles pronto</p>
        </div>
      </div>
    </div>
  )
}