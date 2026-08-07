'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function EnRevisionPage() {
  const router = useRouter()

  async function cerrarSesion() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/coordinador/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-sm text-center">
        <p className="text-4xl mb-4">🕐</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Tu cuenta está en revisión</h1>
        <p className="text-gray-500 text-sm mb-6">
          Un administrador de Tu Chamba Express está revisando tu solicitud de acceso.
          Te avisaremos en cuanto quede aprobada — normalmente toma poco tiempo.
        </p>
        <button
          onClick={cerrarSesion}
          className="text-[#1A6B3C] hover:underline text-sm font-medium"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
