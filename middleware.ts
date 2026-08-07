import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Solo protegemos rutas del coordinador, excepto login y en-revision
  // (evita loops de redirección) y assets estáticos/API internas de Next.
  if (!pathname.startsWith('/coordinador')) {
    return NextResponse.next()
  }
  if (pathname === '/coordinador/login' || pathname === '/coordinador/en-revision') {
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

  // Sin sesión → login
  if (!user || !user.email) {
    return NextResponse.redirect(new URL('/coordinador/login', request.url))
  }

  // Con sesión: confirmar que existe como coordinador activo.
  // El vínculo es por email (coordinadores.id NO coincide con auth.users.id).
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
  matcher: '/coordinador/:path*',
}
