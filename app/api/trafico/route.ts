import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { fuente, vacanteId, codigoRef } = await request.json()

  // Buscar reclutador_id y su agencia por código si viene referido
  let reclutadorId = null
  let agenciaId = null
  if (codigoRef) {
    const { data } = await supabase
      .from('reclutadores')
      .select('id, reclutador_agencia(agencia_id)')
      .eq('token_referido', codigoRef)
      .single()
    if (data) {
      reclutadorId = data.id
      agenciaId = (data.reclutador_agencia as any)?.[0]?.agencia_id ?? null
    }
  }

  // Si no vino por referido pero sí sabemos la vacante, atribuye la visita a esa agencia
  if (!agenciaId && vacanteId) {
    const { data: vacante } = await supabase
      .from('vacantes')
      .select('agencia_id')
      .eq('id', vacanteId)
      .maybeSingle()
    agenciaId = vacante?.agencia_id ?? null
  }

  await supabase.from('trafico_referidos').insert({
    fuente: fuente ?? 'directo',
    vacante_id: vacanteId ?? null,
    reclutador_id: reclutadorId ?? null,
    agencia_id: agenciaId
  })

  return NextResponse.json({ ok: true })
}