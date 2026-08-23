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

  const { nombre, codigo, telefono } = await request.json()

  if (!nombre?.trim() || !codigo?.trim()) {
    return NextResponse.json({ error: 'Nombre y código son obligatorios.' }, { status: 400 })
  }

  const { data: reclutador, error } = await supabase
    .from('reclutadores')
    .insert({
      nombre: nombre.trim(),
      codigo: codigo.trim().toUpperCase(),
      telefono: telefono?.trim() || null,
      es_maestro: true,
      activo: true,
    })
    .select('id')
    .single()

  if (error || !reclutador) {
    return NextResponse.json({ error: error?.message ?? 'No se pudo crear el reclutador maestro (¿código ya existe?)' }, { status: 500 })
  }

  // Backfill: lo inscribe en TODAS las agencias ya activas hoy — de ahí en
  // adelante, cada agencia nueva lo hace sola (ver crear-agencia/aprobar-agencia)
  const { data: agenciasActivas } = await supabase
    .from('agencias')
    .select('id')
    .eq('status', 'activa')

  if (agenciasActivas && agenciasActivas.length > 0) {
    await supabase.from('reclutador_agencia').insert(
      agenciasActivas.map(a => ({ reclutador_id: reclutador.id, agencia_id: a.id, activo: true }))
    )
  }

  await supabase.from('bitacora_admin').insert({
    admin_email: user?.email ?? '',
    admin_rol: admin.rol,
    accion: 'crear_reclutador_maestro',
    entidad: 'reclutadores',
    entidad_id: reclutador.id,
    detalle: { nombre, codigo, agenciasInscritas: agenciasActivas?.length ?? 0 },
  })

  return NextResponse.json({ ok: true, agenciasInscritas: agenciasActivas?.length ?? 0 })
}
