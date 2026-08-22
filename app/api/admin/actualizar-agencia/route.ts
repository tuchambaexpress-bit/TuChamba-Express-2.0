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

  const { agenciaId, coordinadorId, nombreAgencia, nombreCoordinador, telefonoCoordinador, activar } = await request.json()

  if (!agenciaId) {
    return NextResponse.json({ error: 'Falta agenciaId' }, { status: 400 })
  }

  // Editar nombre de agencia (si viene)
  if (nombreAgencia?.trim()) {
    await supabase.from('agencias').update({ nombre: nombreAgencia.trim() }).eq('id', agenciaId)
  }

  // Editar nombre/teléfono del coordinador (email NO es editable aquí — está
  // ligado 1 a 1 con su cuenta de Supabase Auth, cambiarlo requeriría otra
  // llamada aparte a la API de administración; fuera de alcance por ahora)
  if (coordinadorId && (nombreCoordinador?.trim() || telefonoCoordinador !== undefined)) {
    const cambios: Record<string, string | null> = {}
    if (nombreCoordinador?.trim()) cambios.nombre = nombreCoordinador.trim()
    if (telefonoCoordinador !== undefined) cambios.telefono = telefonoCoordinador?.trim() || null
    await supabase.from('coordinadores').update(cambios).eq('id', coordinadorId)
  }

  // Activar/Desactivar agencia + coordinador juntos — si la agencia se
  // desactiva, no tendría sentido que su coordinador siguiera pudiendo entrar.
  if (typeof activar === 'boolean') {
    await supabase.from('agencias').update({ status: activar ? 'activa' : 'inactiva' }).eq('id', agenciaId)
    if (coordinadorId) {
      await supabase.from('coordinadores').update({ status: activar ? 'activo' : 'inactivo' }).eq('id', coordinadorId)
    }
  }

  await supabase.from('bitacora_admin').insert({
    admin_email: user?.email ?? '',
    admin_rol: admin.rol,
    accion: typeof activar === 'boolean' ? (activar ? 'activar_agencia' : 'desactivar_agencia') : 'editar_agencia',
    entidad: 'agencias',
    entidad_id: agenciaId,
    detalle: { nombreAgencia, nombreCoordinador, telefonoCoordinador, activar },
  })

  return NextResponse.json({ ok: true })
}
