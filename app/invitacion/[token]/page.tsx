import { createClient } from '@supabase/supabase-js'
import FormularioInvitacion from '@/components/invitacion/FormularioInvitacion'

// Always revalidate invitation state on the server; never cache a privileged read.
export const dynamic = 'force-dynamic'

interface Props {
  params: { token: string }
}

export default async function InvitacionPage({ params }: Props) {
  let invitacion: { id: string; usado: boolean | null; expira_at: string } | null = null
  try {
    // Server Component: visitor cookies never authorize this service query.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
    )
    const { data, error } = await supabase
      .from('invitaciones')
      .select('id, usado, expira_at')
      .eq('token', params.token)
      .single()
    if (!error && typeof data?.id === 'string' && data.id.trim()) invitacion = data
  } catch {
    // Fail closed without exposing backend errors or privileged configuration.
  }

  // Token inválido
  if (!invitacion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
          <p className="text-4xl mb-4">❌</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Link inválido</h2>
          <p className="text-gray-500 text-sm">
            Este link de invitación no existe o fue eliminado.
          </p>
        </div>
      </div>
    )
  }

  // Token ya usado
  if (invitacion.usado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Link ya utilizado</h2>
          <p className="text-gray-500 text-sm">
            Este link de invitación ya fue usado. Solicita uno nuevo al administrador.
          </p>
        </div>
      </div>
    )
  }

  // Token expirado
  const expiraAt = Date.parse(invitacion.expira_at)
  if (!Number.isFinite(expiraAt) || expiraAt <= Date.now()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
          <p className="text-4xl mb-4">⏰</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Link expirado</h2>
          <p className="text-gray-500 text-sm">
            Este link de invitación expiró. Solicita uno nuevo al administrador.
          </p>
        </div>
      </div>
    )
  }

  // Token válido — mostrar formulario
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A6B3C] px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-white font-bold text-xl">Tu Chamba Express</h1>
          <p className="text-green-200 text-sm">Registro de nueva agencia</p>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <FormularioInvitacion token={params.token} invitacionId={invitacion.id} />
      </div>
    </div>
  )
}
