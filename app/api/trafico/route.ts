import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { fuente, vacanteId, codigoRef } = await request.json()

  // Buscar reclutador_id por código si viene referido
  let reclutadorId = null
  if (codigoRef) {
    const { data } = await supabase
      .from('reclutadores')
      .select('id, reclutador_agencia(agencia_id)')
      .eq('codigo', codigoRef.toUpperCase())
      .single()
    if (data) reclutadorId = data.id
  }

  await supabase.from('trafico_referidos').insert({
    fuente: fuente ?? 'directo',
    vacante_id: vacanteId ?? null,
    reclutador_id: reclutadorId ?? null,
    agencia_id: null
  })

  return NextResponse.json({ ok: true })
}