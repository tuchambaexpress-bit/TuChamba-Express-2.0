import { createClient as createServerClient } from '@supabase/supabase-js'
import Link from 'next/link'
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
    <div className="min-h-screen bg-[#0B0D12] relative">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />

      <div
        className="fixed inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#00D9FF 1px, transparent 1px), linear-gradient(90deg, #00D9FF 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <header className="relative border-b border-[#1E2330] bg-[#0F1116]/80 backdrop-blur px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="text-xs text-[#5B6478] hover:text-[#00D9FF] uppercase tracking-[0.15em] transition-colors font-medium"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              ← Torre de Control
            </Link>
            <h1
              className="text-[#E8EDF4] text-lg uppercase tracking-wide mt-1"
              style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
            >
              Solicitudes
            </h1>
          </div>
          <Link
            href="/admin/invitaciones"
            className="text-[10px] text-[#00D9FF] hover:text-white uppercase tracking-[0.15em] transition-colors"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            + Nueva invitación
          </Link>
        </div>
      </header>

      <div className="relative max-w-4xl mx-auto px-6 py-8">
        <p
          className="text-[11px] text-[#5B6478] uppercase tracking-[0.15em] mb-6"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {solicitudes?.length ?? 0} agencia{(solicitudes?.length ?? 0) !== 1 ? 's' : ''} esperando aprobación
        </p>
        <SolicitudesPanel solicitudes={solicitudes ?? []} />
      </div>
    </div>
  )
}
