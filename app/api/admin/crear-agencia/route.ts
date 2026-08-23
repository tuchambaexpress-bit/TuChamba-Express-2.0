import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { validarPassword } from '@/lib/validarPassword'

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

  const { nombreAgencia, nombreCoordinador, emailCoordinador, telefonoCoordinador, password } = await request.json()

  if (!nombreAgencia?.trim() || !nombreCoordinador?.trim() || !emailCoordinador?.trim()) {
    return NextResponse.json({ error: 'Nombre de agencia, nombre y email del coordinador son obligatorios.' }, { status: 400 })
  }

  const mensajeValidacion = validarPassword(password ?? '')
  if (mensajeValidacion) {
    return NextResponse.json({ error: mensajeValidacion }, { status: 400 })
  }

  // 1. Crear la cuenta en Supabase Auth PRIMERO (sin correo — Camino B es
  // 100% manual, José comparte la contraseña temporal él mismo). Si el
  // email ya existe, no queremos agencia/coordinador huérfanos.
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: emailCoordinador.trim(),
    password,
    email_confirm: true,
    user_metadata: { rol: 'coordinador' },
  })

  if (authError || !authUser?.user) {
    return NextResponse.json({ error: authError?.message ?? 'No se pudo crear la cuenta. ¿El email ya está registrado?' }, { status: 400 })
  }

  // 2. Crear agencia ya activa (sin pasar por pendiente_aprobacion)
  const { data: agencia, error: agenciaError } = await supabase
    .from('agencias')
    .insert({ nombre: nombreAgencia.trim(), status: 'activa', aprobado_at: new Date().toISOString() })
    .select('id')
    .single()

  if (agenciaError || !agencia) {
    await supabase.auth.admin.deleteUser(authUser.user.id) // rollback
    return NextResponse.json({ error: 'No se pudo crear la agencia.' }, { status: 500 })
  }

  // 3. Crear coordinador ya activo, con auth_user_id para poder borrar su
  // cuenta de Auth limpiamente si algún día se elimina (7.15)
  const { data: coordinador, error: coordinadorError } = await supabase
    .from('coordinadores')
    .insert({
      agencia_id: agencia.id,
      nombre: nombreCoordinador.trim(),
      email: emailCoordinador.trim(),
      telefono: telefonoCoordinador?.trim() || null,
      status: 'activo',
      auth_user_id: authUser.user.id,
    })
    .select('id')
    .single()

  if (coordinadorError || !coordinador) {
    await supabase.from('agencias').delete().eq('id', agencia.id) // rollback
    await supabase.auth.admin.deleteUser(authUser.user.id) // rollback
    return NextResponse.json({ error: 'No se pudo crear el coordinador.' }, { status: 500 })
  }

  // 4. Inscribir automáticamente a los reclutadores maestro (José, 2026-08-23)
  const { data: maestros } = await supabase
    .from('reclutadores')
    .select('id')
    .eq('es_maestro', true)
    .eq('activo', true)

  if (maestros && maestros.length > 0) {
    await supabase.from('reclutador_agencia').insert(
      maestros.map(m => ({ reclutador_id: m.id, agencia_id: agencia.id, activo: true }))
    )
  }

  // 5. Bitácora
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
