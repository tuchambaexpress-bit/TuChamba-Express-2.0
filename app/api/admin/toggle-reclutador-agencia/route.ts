import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
  const { data: { user } } = await supabaseAuth.auth.getUser()

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: admin } = await supabase
    .from('administradores')
    .select('rol, status')
    .eq('email', user?.email ?? '')
    .single()

  if (!admin || admin.status !== 'activo') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { reclutadorAgenciaId, activo } = await request.json()

  if (!reclutadorAgenciaId || typeof activo !== 'boolean') {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const { error } = await supabase
    .from('reclutador_agencia')
    .update({ activo })
    .eq('id', reclutadorAgenciaId)

  if (error) {
    return NextResponse.json({ error: 'No se pudo actualizar' }, { status: 500 })
  }

  // 7.16 — escalación: el admin desactiva un reclutador cuando el
  // coordinador no puede o no debe hacerlo directo desde su propio panel.
  await supabase.from('bitacora_admin').insert({
    admin_email: user?.email ?? '',
    admin_rol: admin.rol,
    accion: activo ? 'activar_reclutador_agencia' : 'desactivar_reclutador_agencia',
    entidad: 'reclutador_agencia',
    entidad_id: reclutadorAgenciaId,
    detalle: { activo },
  })

  return NextResponse.json({ ok: true })
}
