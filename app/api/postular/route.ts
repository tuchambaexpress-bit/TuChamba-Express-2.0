import { createClient as createServerClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
  const { nombre, telefono, vacanteId, reclutadorId, codigoRef } = await request.json()

  // Si no viene reclutadorId pero sí codigoRef, buscar por código
  let reclutadorIdFinal = reclutadorId ?? null
  if (!reclutadorIdFinal && codigoRef) {
    const { data: reclutador, error: errorRef } = await supabase
      .from('reclutadores')
      .select('id')
      .eq('codigo', codigoRef.toUpperCase())
      .single()
    if (reclutador) reclutadorIdFinal = reclutador.id
  }

  // Validaciones básicas
  if (!nombre || !telefono || !vacanteId) {
    return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
  }
  if (telefono.length < 10) {
    return NextResponse.json({ error: 'Teléfono inválido' }, { status: 400 })
  }

  // 1. Buscar o crear candidato por teléfono
  let candidatoId: string

  const { data: existente } = await supabase
    .from('candidatos')
    .select('id')
    .eq('telefono', telefono)
    .single()

  if (existente) {
    candidatoId = existente.id
  } else {
    const { data: nuevo, error } = await supabase
      .from('candidatos')
      .insert({ nombre, telefono })
      .select('id')
      .single()

    if (error || !nuevo) {
      console.error('Error al crear candidato:', error)
      return NextResponse.json({ error: error?.message ?? 'Error al crear candidato' }, { status: 500 })
    }
    candidatoId = nuevo.id
  }

  // 2. Verificar si ya existe postulación para esta vacante y candidato
  const { data: postulacionExistente } = await supabase
    .from('postulaciones')
    .select('id')
    .eq('candidato_id', candidatoId)
    .eq('vacante_id', vacanteId)
    .single()

  if (postulacionExistente) {
    // Obtener etapa actual de la postulación existente
  const { data: postExistente } = await supabase
    .from('postulaciones')
    .select('etapa_actual, chats(id)')
    .eq('candidato_id', candidatoId)
    .eq('vacante_id', vacanteId)
    .single()

  return NextResponse.json({ 
    ok: true, 
    yaExistia: true,
    chatId: postExistente?.chats?.[0]?.id ?? null,
    etapaActual: postExistente?.etapa_actual ?? 'Aplicado'
  })
  }

  // 3. Obtener datos de la vacante para el chat
  const { data: vacante } = await supabase
    .from('vacantes')
    .select('titulo, agencia_id')
    .eq('id', vacanteId)
    .single()

  if (!vacante) {
    return NextResponse.json({ error: 'Vacante no encontrada' }, { status: 404 })
  }

  // 4. Crear postulación
  const { data: postulacion, error: errorPost } = await supabase
    .from('postulaciones')
    .insert({
      candidato_id: candidatoId,
      vacante_id: vacanteId,
      reclutador_id: reclutadorIdFinal ?? null,
      agencia_id: vacante.agencia_id,
      etapa_actual: 'Aplicado',
      es_manual: false
    })
    .select('id')
    .single()

  if (errorPost || !postulacion) {
    console.error('Error al crear postulación:', errorPost)
    return NextResponse.json({ error: errorPost?.message ?? 'Error al crear postulación' }, { status: 500 })
  }

  // 5. Crear chat
  const { data: chatCreado, error: errorChat } = await supabase
    .from('chats')
    .insert({
      tipo: 'candidato_reclutador',
      candidato_id: candidatoId,
      reclutador_id: reclutadorIdFinal ?? null,
      vacante_id: vacanteId,
      postulacion_id: postulacion.id,
      agencia_id: vacante.agencia_id,
      ultimo_sender_tipo: 'candidato'
    })
    .select('id')
    .single()

  if (errorChat) {
    return NextResponse.json({ error: 'Error al crear chat' }, { status: 500 })
  }

  // Obtener el chatId recién creado
return NextResponse.json({ 
  ok: true, 
  chatId: chatCreado?.id ?? null,
  etapaActual: 'Aplicado'
})
}