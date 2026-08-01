'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useAlertas(reclutadorId: string | null) {
  useEffect(() => {
    if (!reclutadorId) return

    async function verificarAlertas() {
      const supabase = createClient()
      const ahora = new Date()

      // 1. Candidatos sin movimiento 48h
      const hace48h = new Date(ahora.getTime() - 48 * 60 * 60 * 1000).toISOString()
      const { data: sinMovimiento } = await supabase
        .from('postulaciones')
        .select('id, candidato_id, vacante_id, etapa_actual, updated_at, candidatos(nombre), vacantes(titulo)')
        .eq('reclutador_id', reclutadorId)
        .not('etapa_actual', 'in', '("Descartado","Contratado")')
        .lt('updated_at', hace48h)

      for (const p of sinMovimiento ?? []) {
        // Verificar que no existe alerta reciente del mismo tipo
        const { count } = await supabase
          .from('alertas')
          .select('*', { count: 'exact', head: true })
          .eq('reclutador_id', reclutadorId)
          .eq('postulacion_id', p.id)
          .eq('tipo', 'sin_movimiento')
          .gte('created_at', hace48h)

        if (!count) {
          await supabase.from('alertas').insert({
            tipo: 'sin_movimiento',
            reclutador_id: reclutadorId,
            postulacion_id: p.id,
            candidato_id: p.candidato_id,
            vacante_id: p.vacante_id,
            mensaje: `${(p.candidatos as any)?.nombre} lleva más de 48h sin movimiento en "${(p.vacantes as any)?.titulo}" (etapa: ${p.etapa_actual})`,
            leida: false,
            destinatario_id: reclutadorId,
            destinatario_rol: 'reclutador'
          })
        }
      }

      // 2. Garantías próximas a vencer (≤3 días)
      const en3dias = new Date(ahora.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const { data: garantiasProximas } = await supabase
        .from('postulaciones')
        .select('id, candidato_id, vacante_id, fecha_garantia_fin, candidatos(nombre), vacantes(titulo)')
        .eq('reclutador_id', reclutadorId)
        .eq('garantia_cumplida', false)
        .eq('comision_aplicable', true)
        .lte('fecha_garantia_fin', en3dias)
        .gte('fecha_garantia_fin', ahora.toISOString().split('T')[0])

      for (const p of garantiasProximas ?? []) {
        const { count } = await supabase
          .from('alertas')
          .select('*', { count: 'exact', head: true })
          .eq('reclutador_id', reclutadorId)
          .eq('postulacion_id', p.id)
          .eq('tipo', 'garantia_proxima')

        if (!count) {
          await supabase.from('alertas').insert({
            tipo: 'garantia_proxima',
            reclutador_id: reclutadorId,
            postulacion_id: p.id,
            candidato_id: p.candidato_id,
            vacante_id: p.vacante_id,
            mensaje: `⚠️ La garantía de ${(p.candidatos as any)?.nombre} en "${(p.vacantes as any)?.titulo}" vence el ${new Date(p.fecha_garantia_fin!).toLocaleDateString('es-MX')}`,
            leida: false,
            destinatario_id: reclutadorId,
            destinatario_rol: 'reclutador'
          })
        }
      }

      // 3. Entrevistas próximas (24h)
      const en24h = new Date(ahora.getTime() + 24 * 60 * 60 * 1000).toISOString()
      const { data: entrevistas } = await supabase
        .from('postulaciones')
        .select('id, candidato_id, vacante_id, fecha_entrevista, candidatos(nombre), vacantes(titulo)')
        .eq('reclutador_id', reclutadorId)
        .eq('etapa_actual', 'Entrevista')
        .not('fecha_entrevista', 'is', null)
        .gte('fecha_entrevista', ahora.toISOString())
        .lte('fecha_entrevista', en24h)

      for (const p of entrevistas ?? []) {
        const { count } = await supabase
          .from('alertas')
          .select('*', { count: 'exact', head: true })
          .eq('reclutador_id', reclutadorId)
          .eq('postulacion_id', p.id)
          .eq('tipo', 'entrevista_proxima')

        if (!count) {
          await supabase.from('alertas').insert({
            tipo: 'entrevista_proxima',
            reclutador_id: reclutadorId,
            postulacion_id: p.id,
            candidato_id: p.candidato_id,
            vacante_id: p.vacante_id,
            mensaje: `📅 Mañana tiene entrevista ${(p.candidatos as any)?.nombre} para "${(p.vacantes as any)?.titulo}". ¿Ya confirmaste su asistencia?`,
            leida: false,
            destinatario_id: reclutadorId,
            destinatario_rol: 'reclutador'
          })
        }
      }
    }

    // Ejecutar al cargar y cada 30 minutos
    verificarAlertas()
    const intervalo = setInterval(verificarAlertas, 30 * 60 * 1000)
    return () => clearInterval(intervalo)
  }, [reclutadorId])
}