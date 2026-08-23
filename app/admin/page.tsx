import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'
import SaludMarketplace from '@/components/admin/SaludMarketplace'

export const revalidate = 0 // siempre datos frescos, nunca cacheado

export default async function AdminHome() {
  // Identificamos al admin vía su sesión real de Supabase Auth (misma
  // cookie que ya valida middleware.ts) — no vía service_role_key, esa
  // llave no tiene sesión de usuario, solo permisos elevados de servidor.
  const cookieStore = cookies()
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabaseAuth.auth.getUser()

  // Para las consultas de datos sí usamos service_role_key, mismo patrón
  // ya usado en app/admin/solicitudes/page.tsx.
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: admin } = await supabase
    .from('administradores')
    .select('nombre, rol')
    .eq('email', user?.email ?? '')
    .single()

  const [
    { count: agenciasActivas },
    { count: coordinadoresActivos },
    { count: reclutadoresActivos },
    { count: vacantesVigentes },
    { count: solicitudesPendientes },
  ] = await Promise.all([
    supabase.from('agencias').select('*', { count: 'exact', head: true }).eq('status', 'activa'),
    supabase.from('coordinadores').select('*', { count: 'exact', head: true }).eq('status', 'activo'),
    supabase.from('reclutador_agencia').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('vacantes').select('*', { count: 'exact', head: true }).eq('status', 'vigente'),
    supabase.from('agencias').select('*', { count: 'exact', head: true }).eq('status', 'pendiente_aprobacion'),
  ])

  // 7.2 redefinida (2026-08-23) — Salud del Marketplace: métricas de negocio
  // de la plataforma en sí, no de reclutamiento (eso vive en 4.12d, por
  // coordinador/reclutador). Confirmado con José: se agrega como sección al
  // Panel de Control, no como pantalla aparte.
  const { data: todasAgencias } = await supabase
    .from('agencias')
    .select('id, status, created_at, aprobado_at')

  const { data: todasVacantes } = await supabase
    .from('vacantes')
    .select('id, agencia_id, created_at')

  const { data: comisionesPagadas } = await supabase
    .from('postulaciones')
    .select('comision_aplicada_mxn')
    .eq('pagado', true)

  const comisionesTotales = (comisionesPagadas ?? []).reduce((s, p) => s + (p.comision_aplicada_mxn ?? 0), 0)

  // Tasa de activación: de las agencias que llegaron a existir de verdad
  // (activa o inactiva — no pendientes ni rechazadas), ¿cuántas publicaron
  // al menos una vacante alguna vez?
  const agenciasConsideradas = (todasAgencias ?? []).filter(a => a.status === 'activa' || a.status === 'inactiva')
  const idsConVacante = new Set((todasVacantes ?? []).map(v => v.agencia_id))
  const agenciasActivadas = agenciasConsideradas.filter(a => idsConVacante.has(a.id))
  const tasaActivacion = agenciasConsideradas.length > 0
    ? Math.round((agenciasActivadas.length / agenciasConsideradas.length) * 100)
    : 0

  // Agencias "dormidas": activas hoy, pero sin ninguna vacante publicada en
  // los últimos 30 días (o nunca publicaron nada)
  const hace30 = new Date()
  hace30.setDate(hace30.getDate() - 30)
  const ultimaVacantePorAgencia = new Map<string, string>()
  ;(todasVacantes ?? []).forEach(v => {
    const actual = ultimaVacantePorAgencia.get(v.agencia_id)
    if (!actual || v.created_at > actual) ultimaVacantePorAgencia.set(v.agencia_id, v.created_at)
  })
  const agenciasDurmientes = (todasAgencias ?? []).filter(a => {
    if (a.status !== 'activa') return false
    const ultima = ultimaVacantePorAgencia.get(a.id)
    if (!ultima) return true
    return new Date(ultima) < hace30
  }).length

  // Últimos 6 meses, para las 2 gráficas de crecimiento
  function ultimosMeses(n: number) {
    const meses = []
    const hoy = new Date()
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
      meses.push({ year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleDateString('es-MX', { month: 'short' }) })
    }
    return meses
  }
  const meses6 = ultimosMeses(6)

  const agenciasPorMes = meses6.map(m => ({
    mes: m.label,
    agencias: (todasAgencias ?? []).filter(a => {
      const fecha = a.aprobado_at ? new Date(a.aprobado_at) : new Date(a.created_at)
      return fecha.getFullYear() === m.year && fecha.getMonth() === m.month
    }).length,
  }))

  const vacantesPorMes = meses6.map(m => ({
    mes: m.label,
    vacantes: (todasVacantes ?? []).filter(v => {
      const fecha = new Date(v.created_at)
      return fecha.getFullYear() === m.year && fecha.getMonth() === m.month
    }).length,
  }))

  const modulos = [
    { nombre: 'Agencias', desc: 'Alta manual, editar, activar/desactivar', href: '/admin/agencias', badge: null as number | null },
    { nombre: 'Plantilla', desc: 'Coordinadores y reclutadores, todas las agencias', href: '/admin/plantilla', badge: null as number | null },
    { nombre: 'Solicitudes', desc: 'Agencias esperando aprobación', href: '/admin/solicitudes', badge: solicitudesPendientes ?? 0 },
    { nombre: 'Invitaciones', desc: 'Generar links de alta de agencia', href: '/admin/invitaciones', badge: null as number | null },
  ]

  const stats = [
    { label: 'Agencias activas', valor: agenciasActivas ?? 0 },
    { label: 'Coordinadores activos', valor: coordinadoresActivos ?? 0 },
    { label: 'Reclutadores activos', valor: reclutadoresActivos ?? 0 },
    { label: 'Vacantes vigentes', valor: vacantesVigentes ?? 0 },
  ]

  const hora = new Date().toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })

  return (
    <div className="h-screen bg-[#0B0D12] relative flex flex-col overflow-hidden">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />

      <div
        className="fixed inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#00D9FF 1px, transparent 1px), linear-gradient(90deg, #00D9FF 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Barra superior */}
      <header className="relative flex-shrink-0 border-b border-[#1E2330] bg-[#0F1116]/80 backdrop-blur px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="w-2 h-2 rounded-full bg-[#39FF88] animate-pulse"
              style={{ boxShadow: '0 0 8px #39FF88' }}
            />
            <div>
              <p
                className="text-[#E8EDF4] text-sm uppercase tracking-wide"
                style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
              >
                Panel de Control
              </p>
              <p className="text-[10px] text-[#5B6478] tracking-[0.15em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {hora}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[#E8EDF4] text-sm" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>
                {admin?.nombre ?? user?.email}
              </p>
              <p className="text-[10px] text-[#00D9FF] uppercase tracking-[0.15em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {admin?.rol === 'maestro' ? 'Admin Maestro' : 'Admin'}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="relative flex-1 min-h-0 max-w-[1600px] w-full mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 h-full">
          {/* Menú lateral de módulos — scroll propio */}
          <div className="min-h-0 overflow-y-auto pr-2">
            <p className="text-[11px] text-[#5B6478] uppercase tracking-[0.2em] mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Módulos disponibles
            </p>
            <div className="flex flex-col">
              {modulos.map(m => (
                <Link
                  key={m.href}
                  href={m.href}
                  className="group bg-[#12151C] border border-[#1E2330] hover:border-l-[#00D9FF] hover:border-l-2 p-4 transition-colors -mt-px first:mt-0"
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="text-[#E8EDF4] uppercase tracking-wide text-sm"
                      style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
                    >
                      {m.nombre}
                    </p>
                    {!!m.badge && (
                      <span
                        className="text-[10px] bg-[#2563EB] text-white px-2 py-0.5"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#5B6478] mt-1">{m.desc}</p>
                </Link>
              ))}

              {/* Placeholders de los módulos que siguen en el desglose de Sprint 7 */}
              {['Bitácora'].map(nombre => (
                <div
                  key={nombre}
                  className="bg-[#0F1116] border border-dashed border-[#1E2330] p-4 opacity-40 -mt-px"
                >
                  <p
                    className="text-[#5B6478] uppercase tracking-wide text-sm"
                    style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}
                  >
                    {nombre}
                  </p>
                  <p className="text-[11px] text-[#5B6478] mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Próximamente
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contenido principal — scroll propio, independiente del menú */}
          <div className="min-h-0 overflow-y-auto pr-2">
            {/* Grid de telemetría */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
              {stats.map(s => (
                <div
                  key={s.label}
                  className="bg-[#12151C] border border-[#1E2330] p-7"
                  style={{ clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)' }}
                >
                  <p className="text-[11px] text-[#5B6478] uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {s.label}
                  </p>
                  <p className="text-4xl text-[#00D9FF]" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
                    {String(s.valor).padStart(2, '0')}
                  </p>
                </div>
              ))}
            </div>

            <SaludMarketplace
              tasaActivacion={tasaActivacion}
              comisionesTotales={comisionesTotales}
              agenciasDurmientes={agenciasDurmientes}
              agenciasPorMes={agenciasPorMes}
              vacantesPorMes={vacantesPorMes}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
