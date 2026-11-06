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
  let adminRole: string
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
    adminRole = admin.rol
  } catch {
    return NextResponse.json({ error: 'No se pudo verificar autorización' }, { status: 503 })
  }

  const { email, password } = await request.json()

  // SPEC: only Maestro may manage other administrators.
  if (adminRole !== 'maestro') {
    try {
      const { data: targetAdmin, error: targetError } = await supabase
        .from('administradores')
        .select('rol')
        .eq('email', email)
        .maybeSingle()
      if (targetError) {
        return NextResponse.json({ error: 'No se pudo verificar el destinatario' }, { status: 503 })
      }
      if (targetAdmin) {
        return NextResponse.json({ error: 'Permiso insuficiente' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'No se pudo verificar el destinatario' }, { status: 503 })
    }
  }

  const { data: user } = await supabase.auth.admin.listUsers()
  const userFound = user?.users?.find(u => u.email === email)

  if (!userFound) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  const { error } = await supabase.auth.admin.updateUserById(userFound.id, {
    password
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
