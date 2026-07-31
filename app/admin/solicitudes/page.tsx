import { createClient as createServerClient } from '@supabase/supabase-js'
import SolicitudesPanel from '@/components/admin/SolicitudesPanel'

export default async function SolicitudesPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: solicitudes } = await supabase
    .from('agencias')
    .select(`
      id, nombre, status, created_at,
      coordinadores(id, nombre, email, telefono, status)
    `)
    .eq('status', 'pendiente_aprobacion')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A6B3C] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Tu Chamba Express</h1>
            <p className="text-green-200 text-sm">Panel Admin</p>
          </div>
          <a href="/admin/invitaciones" className="text-green-200 text-sm hover:text-white">
            + Nueva invitación
          </a>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Solicitudes pendientes
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {solicitudes?.length ?? 0} agencia{(solicitudes?.length ?? 0) !== 1 ? 's' : ''} esperando aprobación
        </p>
        <SolicitudesPanel solicitudes={solicitudes ?? []} />
      </div>
    </div>
  )
}