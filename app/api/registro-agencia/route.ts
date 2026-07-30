import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { token, invitacionId, agencia, coordinador } = await request.json()

  // Verificar que el token sigue válido
  const { data: invitacion } = await supabase
    .from('invitaciones')
    .select('id, usado, expira_at')
    .eq('token', token)
    .single()

  if (!invitacion) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 400 })
  }
  if (invitacion.usado) {
    return NextResponse.json({ error: 'Este link ya fue utilizado' }, { status: 400 })
  }
  if (new Date(invitacion.expira_at) < new Date()) {
    return NextResponse.json({ error: 'Este link ha expirado' }, { status: 400 })
  }

  // Crear agencia
  const { data: nuevaAgencia, error: errorAgencia } = await supabase
    .from('agencias')
    .insert({
      nombre: agencia.nombre,
      status: 'pendiente_aprobacion',
      invitacion_id: invitacionId
    })
    .select('id')
    .single()

  if (errorAgencia || !nuevaAgencia) {
    return NextResponse.json({ error: errorAgencia?.message ?? 'Error al crear la agencia' }, { status: 500 })
  }

  // Crear coordinador
  const { error: errorCoord } = await supabase
    .from('coordinadores')
    .insert({
      agencia_id: nuevaAgencia.id,
      nombre: coordinador.nombre,
      email: coordinador.email,
      telefono: coordinador.telefono ?? null,
      status: 'pendiente_aprobacion'
    })

  if (errorCoord) {
    return NextResponse.json({ error: 'Error al crear el coordinador' }, { status: 500 })
  }

  // Marcar invitación como usada
  await supabase
    .from('invitaciones')
    .update({ usado: true, agencia_id: nuevaAgencia.id })
    .eq('id', invitacionId)

  return NextResponse.json({ ok: true })
}