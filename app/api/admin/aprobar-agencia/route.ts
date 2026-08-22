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
  // Nota (2026-08-22): ya NO se crea la cuenta de Supabase Auth aquí — nace
  // completa (con la contraseña que el propio coordinador eligió) desde
  // app/api/registro-agencia/route.ts, en el momento del registro. Aprobar
  // solo enciende el permiso de entrar (status), no crea nada nuevo.
  await supabase
    .from('coordinadores')
    .update({ status: 'activo' })
    .eq('id', coordinadorId)

  return NextResponse.json({ ok: true })
}