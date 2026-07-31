import { createClient as createServerClient } from '@supabase/supabase-js'
import KanbanBoard from '@/components/reclutador/KanbanBoard'

export default async function PipelinePage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Las postulaciones se cargan en el cliente según la sesión del reclutador
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A6B3C] px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-white font-bold text-xl">Tu Chamba Express</h1>
          <div className="flex gap-4">
            <a href="/reclutador/dashboard" className="text-green-200 hover:text-white text-sm">Dashboard</a>
            <a href="/reclutador/chats" className="text-green-200 hover:text-white text-sm">Chats</a>
          </div>
        </div>
      </header>
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 max-w-7xl mx-auto">Pipeline de candidatos</h2>
        <div className="overflow-x-auto h-[calc(100vh-140px)]">
          <KanbanBoard />
        </div>
      </div>
    </div>
  )
}