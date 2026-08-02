import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const adminKey = request.headers.get('x-admin-key')
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { email, password } = await request.json()

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