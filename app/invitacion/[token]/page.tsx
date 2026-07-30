import { createClient } from '@/lib/supabase/server'
import FormularioInvitacion from '@/components/invitacion/FormularioInvitacion'

interface Props {
  params: { token: string }
}

export default async function InvitacionPage({ params }: Props) {
  const supabase = await createClient()

  const { data: invitacion } = await supabase
    .from('invitaciones')
    .select('id, token, usado, expira_at')
    .eq('token', params.token)
    .single()

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
  if (new Date(invitacion.expira_at) < new Date()) {
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