import { createClient as createServerClient, type SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient as createAuthClient } from '@supabase/ssr'

export async function POST(request: Request) {
  // TCE-004: trusted deployment origin, never a client-supplied Host.
  let trustedOrigin: string
  try {
    const configuredUrl = new URL(process.env.NEXT_PUBLIC_APP_URL ?? '')
    if (configuredUrl.protocol !== 'https:' || configuredUrl.username || configuredUrl.password) {
      throw new Error('Invalid application origin')
    }
    trustedOrigin = configuredUrl.origin
  } catch {
    return NextResponse.json({ error: 'Origen administrativo no configurado' }, { status: 503 })
  }
  if (request.headers.get('origin') !== trustedOrigin ||
      request.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ error: 'Origen no autorizado' }, { status: 403 })
  }

  let supabase: SupabaseClient
  try {
    const cookieStore = await cookies()
    const supabaseAuth = createAuthClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: cookiesToSet => {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    )
    const { data: { user }, error: identityError } = await supabaseAuth.auth.getUser()
    if (identityError || !user?.id || !user.email) {
      return NextResponse.json({ error: 'Sesión no válida' }, { status: 401 })
    }

    // Only the administrator lookup precedes authorization; no business writes.
    supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: admin, error: adminError } = await supabase
      .from('administradores')
      .select('rol, status')
      .eq('email', user.email)
      .maybeSingle()
    if (adminError) {
      return NextResponse.json({ error: 'No se pudo verificar autorización' }, { status: 503 })
    }
    if (!admin || admin.status !== 'activo' ||
        !['maestro', 'limitado'].includes(admin.rol)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: 'No se pudo verificar autorización' }, { status: 503 })
  }

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

  // 3. Inscribir automáticamente a los reclutadores maestro (José, 2026-08-23)
  // — reciben el tráfico sin ?ref de esta agencia nueva desde el día 1.
  const { data: maestros } = await supabase
    .from('reclutadores')
    .select('id')
    .eq('es_maestro', true)
    .eq('activo', true)

  if (maestros && maestros.length > 0) {
    await supabase.from('reclutador_agencia').insert(
      maestros.map(m => ({ reclutador_id: m.id, agencia_id: agenciaId, activo: true }))
    )
  }

  return NextResponse.json({ ok: true })
}
