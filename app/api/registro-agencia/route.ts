import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { validarPassword } from '@/lib/validarPassword'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const textoRequerido = (value: unknown): value is string =>
    typeof value === 'string' && value.trim().length > 0

  if (!body || typeof body !== 'object' || Array.isArray(body) ||
      !textoRequerido(body.token) || !textoRequerido(body.invitacionId) ||
      !textoRequerido(body.agencia?.nombre) ||
      !textoRequerido(body.coordinador?.nombre) ||
      !textoRequerido(body.coordinador?.email) ||
      typeof body.password !== 'string' ||
      (body.coordinador?.telefono != null && typeof body.coordinador.telefono !== 'string')) {
    return NextResponse.json({ error: 'Solicitud de registro inválida' }, { status: 400 })
  }
  const { token, invitacionId, agencia, coordinador, password } = body

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Verificar que el token sigue válido
  const { data: invitacion, error: errorInvitacion } = await supabase
    .from('invitaciones')
    .select('id, usado, expira_at, telefono_esperado')
    .eq('token', token)
    .single()

  if (errorInvitacion || !textoRequerido(invitacion?.id)) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 400 })
  }
  // El ID del cliente solo confirma compatibilidad; nunca determina la invitación.
  if (invitacionId !== invitacion.id) {
    return NextResponse.json({ error: 'Datos incorrectos para registro' }, { status: 400 })
  }
  const invitacionIdValidada = invitacion.id

  if (invitacion.usado) {
    return NextResponse.json({ error: 'Este link ya fue utilizado' }, { status: 400 })
  }
  const expiraAt = typeof invitacion.expira_at === 'string' ? Date.parse(invitacion.expira_at) : NaN
  if (!Number.isFinite(expiraAt) || expiraAt <= Date.now()) {
    return NextResponse.json({ error: 'Este link ha expirado' }, { status: 400 })
  }

  // Invitación dirigida a un teléfono específico — debe coincidir exacto
  if (invitacion.telefono_esperado && invitacion.telefono_esperado.trim() !== (coordinador.telefono ?? '').trim()) {
    return NextResponse.json({ error: 'Datos incorrectos para registro' }, { status: 400 })
  }

  // Validación de contraseña también del lado del servidor — nunca confiar
  // solo en la validación del navegador, que cualquiera puede saltarse
  const mensajeValidacion = validarPassword(password ?? '')
  if (mensajeValidacion) {
    return NextResponse.json({ error: mensajeValidacion }, { status: 400 })
  }

  // 1. Crear la cuenta en Supabase Auth PRIMERO — si el email ya existe o
  // algo falla aquí, no queremos agencia/coordinador huérfanos sin cuenta.
  // email_confirm: true porque no depende de ningún correo de confirmación.
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: coordinador.email,
    password,
    email_confirm: true,
    user_metadata: { rol: 'coordinador' },
  })

  if (authError || !authUser?.user) {
    return NextResponse.json({ error: authError?.message ?? 'No se pudo crear la cuenta. ¿El email ya está registrado?' }, { status: 400 })
  }

  // 2. Crear agencia
  const { data: nuevaAgencia, error: errorAgencia } = await supabase
    .from('agencias')
    .insert({
      nombre: agencia.nombre,
      status: 'pendiente_aprobacion',
      invitacion_id: invitacionIdValidada
    })
    .select('id')
    .single()

  if (errorAgencia || !nuevaAgencia) {
    await supabase.auth.admin.deleteUser(authUser.user.id) // rollback
    return NextResponse.json({ error: errorAgencia?.message ?? 'Error al crear la agencia' }, { status: 500 })
  }

  // 3. Crear coordinador
  const { error: errorCoord } = await supabase
    .from('coordinadores')
    .insert({
      agencia_id: nuevaAgencia.id,
      nombre: coordinador.nombre,
      email: coordinador.email,
      telefono: coordinador.telefono ?? null,
      status: 'pendiente_aprobacion',
      auth_user_id: authUser.user.id
    })

  if (errorCoord) {
    console.error('Error real al crear coordinador:', errorCoord)
    await supabase.from('agencias').delete().eq('id', nuevaAgencia.id) // rollback
    await supabase.auth.admin.deleteUser(authUser.user.id) // rollback
    return NextResponse.json({ error: `Error al crear el coordinador: ${errorCoord.message}` }, { status: 500 })
  }

  // 4. Marcar invitación como usada
  await supabase
    .from('invitaciones')
    .update({ usado: true, agencia_id: nuevaAgencia.id })
    .eq('id', invitacionIdValidada)

  return NextResponse.json({ ok: true })
}