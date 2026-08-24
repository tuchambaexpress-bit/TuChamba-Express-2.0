import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { codigo } = await request.json()

  if (!codigo) {
    return NextResponse.json({ error: 'Código requerido' }, { status: 400 })
  }

  // Buscar reclutador por código
  const { data: reclutador, error } = await supabase
    .from('reclutadores')
    .select(`
      id, nombre, codigo, token_referido, activo,
      reclutador_agencia(agencia_id, activo)
    `)
    .eq('codigo', codigo.toUpperCase())
    .eq('activo', true)
    .single()

  if (error || !reclutador) {
    return NextResponse.json({ error: 'Código inválido o reclutador inactivo' }, { status: 401 })
  }

  // Obtener agencia activa
  const agenciaActiva = reclutador.reclutador_agencia?.find((ra: any) => ra.activo)

  return NextResponse.json({
    ok: true,
    reclutador: {
      id: reclutador.id,
      nombre: reclutador.nombre,
      codigo: reclutador.codigo,
      token_referido: reclutador.token_referido,
      agencia_id: agenciaActiva?.agencia_id ?? null
    }
  })
}