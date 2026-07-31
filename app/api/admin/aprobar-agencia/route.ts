import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const adminKey = request.headers.get('x-admin-key')
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { agenciaId, coordinadorId, email } = await request.json()

  // 1. Activar agencia
  await supabase
    .from('agencias')
    .update({ status: 'activa', aprobado_at: new Date().toISOString() })
    .eq('id', agenciaId)

  // 2. Activar coordinador
  await supabase
    .from('coordinadores')
    .update({ status: 'activo' })
    .eq('id', coordinadorId)

  // 3. Crear cuenta en Supabase Auth para el coordinador
  const { error: authError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: {
      coordinador_id: coordinadorId,
      agencia_id: agenciaId,
      rol: 'coordinador'
    }
  })

  if (authError) {
    console.error('Error al crear cuenta Auth:', authError)
    // No bloqueamos el flujo — la agencia queda activa aunque falle el email
  }

  return NextResponse.json({ ok: true })
}