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

  const body = await request.json().catch(() => ({}))
  const telefonoEsperado: string | null = body?.telefonoEsperado || null

  // Preserve the existing invitation client's privilege level after authorization.
  const invitationClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const token = crypto.randomUUID()
  const expira = new Date()
  expira.setDate(expira.getDate() + 7)

  const { data, error } = await invitationClient
    .from('invitaciones')
    .insert({
      token,
      tipo: 'nueva_agencia',
      usado: false,
      expira_at: expira.toISOString(),
      telefono_esperado: telefonoEsperado
    })
    .select('token')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Error al crear invitación' }, { status: 500 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tu-chamba-express.vercel.app'

  return NextResponse.json({
    token: data.token,
    url: `${appUrl}/invitacion/${data.token}`,
    expira: expira.toISOString()
  })
}
