import { createClient as createServerClient } from '@supabase/supabase-js'
import KanbanBoard from '@/components/reclutador/KanbanBoard'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'

export default async function PipelinePage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Las postulaciones se cargan en el cliente según la sesión del reclutador
  return (
    <div className="min-h-screen bg-gray-50">
      <ReclutadorNav />
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 max-w-7xl mx-auto">Pipeline de candidatos</h2>
        <div className="overflow-x-auto h-[calc(100vh-140px)] relative">
          <KanbanBoard />
        </div>
      </div>
    </div>
  )
}