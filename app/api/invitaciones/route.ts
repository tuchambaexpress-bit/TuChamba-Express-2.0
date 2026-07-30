import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const token = crypto.randomUUID()
  const expira = new Date()
  expira.setDate(expira.getDate() + 7)

  const { data, error } = await supabase
    .from('invitaciones')
    .insert({
      token,
      tipo: 'nueva_agencia',
      usado: false,
      expira_at: expira.toISOString()
    })
    .select('token')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Error al crear invitación' }, { status: 500 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tu-chamba-express-2-0.vercel.app'

  return NextResponse.json({
    token: data.token,
    url: `${appUrl}/invitacion/${data.token}`,
    expira: expira.toISOString()
  })
}