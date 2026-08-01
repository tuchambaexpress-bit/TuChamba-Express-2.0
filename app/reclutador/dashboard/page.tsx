'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DashboardReclutador() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [copiadoRef, setCopiadoRef] = useState(false)

  const [metricas, setMetricas] = useState({
    candidatosActivos: 0,
    colocadosMes: 0,
    comisionEstimada: 0,
    chatsNuevos: 0
  })

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) {
      router.push('/reclutador/login')
      return
    }
    const s = JSON.parse(data)
    setSesion(s)
    cargarMetricas(s.id)
  }, [])

  async function cargarMetricas(reclutadorId: string) {
    const supabase = createClient()
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    const { count: activos } = await supabase
      .from('postulaciones')
      .select('*', { count: 'exact', head: true })
      .eq('reclutador_id', reclutadorId)
      .not('etapa_actual', 'in', '("Descartado","Contratado")')

    const { count: colocados } = await supabase
      .from('postulaciones')
      .select('*', { count: 'exact', head: true })
      .eq('reclutador_id', reclutadorId)
      .eq('etapa_actual', 'Contratado')
      .gte('fecha_contratacion', inicioMes.toISOString().split('T')[0])

    const { data: comisiones } = await supabase
      .from('postulaciones')
      .select('comision_aplicada_mxn')
      .eq('reclutador_id', reclutadorId)
      .eq('garantia_cumplida', false)
      .eq('comision_aplicable', true)

    const totalComision = comisiones?.reduce((sum, p) => sum + (p.comision_aplicada_mxn ?? 0), 0) ?? 0

    const { count: chatsNuevos } = await supabase
      .from('chats')
      .select('*', { count: 'exact', head: true })
      .eq('reclutador_id', reclutadorId)
      .eq('leido_reclutador', false)

    setMetricas({
      candidatosActivos: activos ?? 0,
      colocadosMes: colocados ?? 0,
      comisionEstimada: totalComision,
      chatsNuevos: chatsNuevos ?? 0
    })
  }

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
        {/* Link de referido */}
        <div className="bg-[#1A6B3C] rounded-2xl p-4 mb-6 text-white">
          <p className="text-sm font-semibold mb-1">🔗 Tu link de referido</p>
          <p className="text-xs text-green-200 mb-3">Comparte este link para que los candidatos queden vinculados a ti automáticamente</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-white/20 rounded-lg px-3 py-2 text-xs text-white truncate">
              tuchambaexpress.com?ref={sesion.codigo}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://tu-chamba-express-2-0.vercel.app?ref=${sesion.codigo}`)
                setCopiadoRef(true)
                setTimeout(() => setCopiadoRef(false), 2000)
              }}
              className="bg-white text-[#1A6B3C] font-semibold text-xs px-3 py-2 rounded-lg flex-shrink-0"
            >
              {copiadoRef ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
        </div>
        {/* Métricas básicas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Candidatos activos</p>
            <p className="text-2xl font-bold text-gray-900">{metricas.candidatosActivos}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Colocados este mes</p>
            <p className="text-2xl font-bold text-gray-900">{metricas.colocadosMes}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Comisión estimada</p>
            <p className="text-2xl font-bold text-[#1A6B3C]">${metricas.comisionEstimada.toLocaleString('es-MX')}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Chats sin leer</p>
            <p className="text-2xl font-bold text-gray-900">{metricas.chatsNuevos}</p>
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