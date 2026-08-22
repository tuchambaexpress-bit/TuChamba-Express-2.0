import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protegemos rutas de coordinador Y de admin. Todo lo demás pasa sin
  // verificación de este middleware (portal público, reclutador con su
  // propio login por código, no por Supabase Auth).
  const esRutaCoordinador = pathname.startsWith('/coordinador')
  const esRutaAdmin = pathname.startsWith('/admin')

  if (!esRutaCoordinador && !esRutaAdmin) {
    return NextResponse.next()
  }
  if (pathname === '/coordinador/login' || pathname === '/coordinador/en-revision' || pathname === '/coordinador/reset-password') {
    return NextResponse.next()
  }
  if (pathname === '/admin/login' || pathname === '/admin/reset-password') {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Sin sesión → login correspondiente según a qué ruta intentaba entrar
  if (!user || !user.email) {
    const loginUrl = esRutaAdmin ? '/admin/login' : '/coordinador/login'
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }

  // Con sesión: confirmar que existe como coordinador o admin activo,
  // según a qué ruta está entrando. Mismo patrón: vínculo por email
  // (nunca por auth.uid(), que no coincide con el id de estas tablas).
  if (esRutaAdmin) {
    const { data: admin } = await supabase
      .from('administradores')
      .select('status')
      .eq('email', user.email)
      .single()

    if (!admin || admin.status !== 'activo') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return response
  }

  const { data: coordinador } = await supabase
    .from('coordinadores')
    .select('status')
    .eq('email', user.email)
    .single()

  if (!coordinador || coordinador.status !== 'activo') {
    return NextResponse.redirect(new URL('/coordinador/en-revision', request.url))
  }

  return response
}

export const config = {
  matcher: ['/coordinador/:path*', '/admin/:path*'],
}
