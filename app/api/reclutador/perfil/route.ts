import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { validarRedesSociales } from '@/lib/redes-sociales'

// GET /api/reclutador/perfil?token=XXXX — público, lo consume
// RedesSocialesFooter.tsx sin sesión. Regresa SOLO nombre + redes_sociales,
// nunca el resto de la fila de reclutadores (ver spec.md CA-26.6).
export async function GET(request: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const token = new URL(request.url).searchParams.get('token')
  if (!token) {
    return NextResponse.json({ nombre: null, redes_sociales: [] })
  }

  const { data } = await supabase
    .from('reclutadores')
    .select('nombre, redes_sociales')
    .eq('token_referido', token)
    .maybeSingle()

  return NextResponse.json({
    nombre: data?.nombre ?? null,
    redes_sociales: data?.redes_sociales ?? []
  })
}

// POST /api/reclutador/perfil — body: { reclutadorId, redesSociales }
// Actualiza ÚNICAMENTE la columna redes_sociales (ver spec.md CA-26.7) —
// mismo criterio de service_role que reclutador/login/route.ts, porque
// esta tabla también guarda email/telefono/codigo.
export async function POST(request: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { reclutadorId, redesSociales } = await request.json()

  if (!reclutadorId) {
    return NextResponse.json({ error: 'reclutadorId requerido' }, { status: 400 })
  }
  if (!validarRedesSociales(redesSociales)) {
    return NextResponse.json(
      { error: 'redesSociales inválido — máximo 6, plataforma reconocida, URL con http(s)' },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('reclutadores')
    .update({ redes_sociales: redesSociales })
    .eq('id', reclutadorId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}