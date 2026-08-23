import { createClient as createServerClient } from '@supabase/supabase-js'
import Link from 'next/link'
import PlantillaPanel from '@/components/admin/PlantillaPanel'

export const revalidate = 0

export default async function PlantillaPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: coordinadores } = await supabase
    .from('coordinadores')
    .select('id, nombre, email, telefono, status, created_at, agencias(nombre)')
    .order('nombre', { ascending: true })

  const { data: reclutadores } = await supabase
    .from('reclutadores')
    .select(`
      id, nombre, codigo, email, lada, telefono, pais, activo, created_at,
      reclutador_agencia(id, activo, agencias(nombre))
    `)
    .order('nombre', { ascending: true })

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
        <div className="max-w-6xl mx-auto">
          <Link
            href="/admin"
            className="text-xs text-[#5B6478] hover:text-[#00D9FF] uppercase tracking-[0.15em] transition-colors font-medium"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ← Panel de Control
          </Link>
          <h1
            className="text-[#E8EDF4] text-lg uppercase tracking-wide mt-1"
            style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
          >
            Plantilla
          </h1>
        </div>
      </header>

      <div className="relative max-w-6xl mx-auto px-6 py-8">
        <PlantillaPanel
          coordinadoresIniciales={coordinadores ?? []}
          reclutadoresIniciales={reclutadores ?? []}
        />
      </div>
    </div>
  )
}
