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

  await supabase
    .from('agencias')
    .update({ status: 'rechazada' })
    .eq('id', agenciaId)

  await supabase
    .from('coordinadores')
    .update({ status: 'rechazado' })
    .eq('id', coordinadorId)

  return NextResponse.json({ ok: true })
}