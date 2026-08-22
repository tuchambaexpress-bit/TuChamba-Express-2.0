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

  const { agenciaId, coordinadorId } = await request.json()

  // Antes de borrar, recuperamos la cuenta de Auth para eliminarla también
  // — si no, queda un usuario "fantasma" sin agencia, con contraseña activa
  // que nadie debería poder usar.
  const { data: coordinador } = await supabase
    .from('coordinadores')
    .select('auth_user_id')
    .eq('id', coordinadorId)
    .single()

  if (coordinador?.auth_user_id) {
    await supabase.auth.admin.deleteUser(coordinador.auth_user_id)
  }

  // Rechazar significa eliminar de verdad — no dejar basura marcada
  // "rechazada" acumulándose para siempre (decisión de José, 2026-08-22).
  await supabase.from('invitaciones').update({ agencia_id: null }).eq('agencia_id', agenciaId)
  await supabase.from('agencias').update({ invitacion_id: null }).eq('id', agenciaId)
  await supabase.from('coordinadores').delete().eq('id', coordinadorId)
  await supabase.from('agencias').delete().eq('id', agenciaId)

  return NextResponse.json({ ok: true })
}