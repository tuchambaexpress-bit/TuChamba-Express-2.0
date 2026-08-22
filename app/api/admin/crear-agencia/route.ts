import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Autenticación real: sesión de Supabase Auth + administradores.status = 'activo'.
  // No usa x-admin-key/ADMIN_SECRET_KEY (el mecanismo viejo, compartido) — este
  // endpoint es nuevo, se construye directo con el sistema bueno.
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

  const { nombreAgencia, nombreCoordinador, emailCoordinador, telefonoCoordinador } = await request.json()

  if (!nombreAgencia?.trim() || !nombreCoordinador?.trim() || !emailCoordinador?.trim()) {
    return NextResponse.json({ error: 'Nombre de agencia, nombre y email del coordinador son obligatorios.' }, { status: 400 })
  }

  // 1. Crear agencia ya activa (sin pasar por pendiente_aprobacion)
  const { data: agencia, error: agenciaError } = await supabase
    .from('agencias')
    .insert({ nombre: nombreAgencia.trim(), status: 'activa', aprobado_at: new Date().toISOString() })
    .select('id')
    .single()

  if (agenciaError || !agencia) {
    return NextResponse.json({ error: 'No se pudo crear la agencia.' }, { status: 500 })
  }

  // 2. Crear coordinador ya activo
  const { data: coordinador, error: coordinadorError } = await supabase
    .from('coordinadores')
    .insert({
      agencia_id: agencia.id,
      nombre: nombreCoordinador.trim(),
      email: emailCoordinador.trim(),
      telefono: telefonoCoordinador?.trim() || null,
      status: 'activo',
    })
    .select('id')
    .single()

  if (coordinadorError || !coordinador) {
    // Rollback manual: si falla el coordinador (ej. email duplicado), no
    // dejamos una agencia huérfana sin coordinador.
    await supabase.from('agencias').delete().eq('id', agencia.id)
    return NextResponse.json({ error: 'No se pudo crear el coordinador (¿el email ya está registrado?)' }, { status: 500 })
  }

  // 3. Invitar al coordinador vía Supabase Auth — crea su cuenta y le manda
  // el correo para establecer su propia contraseña, reutilizando la misma
  // página que ya construimos para recuperación (/coordinador/reset-password).
  const origin = request.headers.get('origin') ?? new URL(request.url).origin
  const { error: authError } = await supabase.auth.admin.inviteUserByEmail(emailCoordinador.trim(), {
    data: { coordinador_id: coordinador.id, agencia_id: agencia.id, rol: 'coordinador' },
    redirectTo: `${origin}/coordinador/reset-password`,
  })

  if (authError) {
    console.error('Error al invitar coordinador:', authError)
    // No revertimos agencia/coordinador — mismo criterio que aprobar-agencia:
    // no bloqueamos el alta aunque falle el correo, se puede reenviar después.
  }

  // 4. Bitácora
  await supabase.from('bitacora_admin').insert({
    admin_email: user?.email ?? '',
    admin_rol: admin.rol,
    accion: 'crear_agencia',
    entidad: 'agencias',
    entidad_id: agencia.id,
    detalle: { nombreAgencia, nombreCoordinador, emailCoordinador },
  })

  return NextResponse.json({ ok: true, agenciaId: agencia.id })
}
