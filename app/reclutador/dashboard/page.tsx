'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardReclutador() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) {
      router.push('/reclutador/login')
      return
    }
    setSesion(JSON.parse(data))
  }, [])

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A6B3C] px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Tu Chamba Express</h1>
            <p className="text-green-200 text-sm">Hola, {sesion.nombre}</p>
          </div>
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
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Métricas básicas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Candidatos activos</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Colocados este mes</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Comisión estimada</p>
            <p className="text-2xl font-bold text-[#1A6B3C]">$0</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Chats nuevos</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>

        {/* Guía de inicio rápido para reclutadores nuevos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">🚀 Guía de inicio rápido</h2>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="w-7 h-7 bg-[#1A6B3C] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Revisa las vacantes activas</p>
                <p className="text-gray-500 text-xs">Ve al Pipeline para ver las vacantes que puedes trabajar</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="w-7 h-7 bg-[#1A6B3C] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Comparte tu link de referido</p>
                <p className="text-gray-500 text-xs">tuchambaexpress.com?ref={sesion.codigo}</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="w-7 h-7 bg-[#1A6B3C] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Da seguimiento a tus candidatos</p>
                <p className="text-gray-500 text-xs">Revisa los chats y mueve candidatos en el pipeline</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="w-7 h-7 bg-[#1A6B3C] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Cobra tu comisión</p>
                <p className="text-gray-500 text-xs">Los cortes son los jueves, pago los viernes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}