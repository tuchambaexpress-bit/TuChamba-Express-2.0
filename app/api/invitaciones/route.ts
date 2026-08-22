import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const adminKey = request.headers.get('x-admin-key')
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const body = await request.json().catch(() => ({}))
  const telefonoEsperado: string | null = body?.telefonoEsperado || null

  const token = crypto.randomUUID()
  const expira = new Date()
  expira.setDate(expira.getDate() + 7)

  const { data, error } = await supabase
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