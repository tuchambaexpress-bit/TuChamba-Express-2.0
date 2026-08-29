'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getCodigoReferido } from './useReferido'

export function useTrafico(vacanteId?: string) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const referrer = document.referrer
    const ref = searchParams.get('ref')
    const utm = searchParams.get('utm_source')

    let fuente = 'directo'

    if (utm) {
      fuente = utm
    } else if (ref) {
      fuente = 'whatsapp_referido'
    } else if (referrer.includes('google')) {
      fuente = 'google_organico'
    } else if (referrer.includes('facebook') || referrer.includes('fb.com')) {
      fuente = 'facebook'
    } else if (referrer.includes('instagram')) {
      fuente = 'instagram'
    } else if (referrer.includes('tiktok')) {
      fuente = 'tiktok'
    }

    const reclutadorCodigo = ref ?? getCodigoReferido()

    fetch('/api/trafico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fuente,
        vacanteId: vacanteId ?? null,
        codigoRef: reclutadorCodigo ?? null
      })
    }).catch(() => {})

  }, [])
}

// Registra clics específicos (no cargas de página) — "ver detalle de
// vacante" y "postularme". Se llama directo desde un onClick, por eso
// es una función normal, no un hook: useSearchParams() no se puede
// usar fuera de un componente/hook, así que aquí se lee la URL
// directo con window.location.search. Misma lógica de detección de
// fuente que el useEffect de arriba, duplicada a propósito por el
// contexto distinto (imperativo vs. declarativo en el mount).
export async function registrarEventoTrafico(
  tipoEvento: 'ver_vacante' | 'postularme',
  vacanteId?: string
) {
  try {
    const referrer = document.referrer
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    const utm = params.get('utm_source')

    let fuente = 'directo'
    if (utm) fuente = utm
    else if (ref) fuente = 'whatsapp_referido'
    else if (referrer.includes('google')) fuente = 'google_organico'
    else if (referrer.includes('facebook') || referrer.includes('fb.com')) fuente = 'facebook'
    else if (referrer.includes('instagram')) fuente = 'instagram'
    else if (referrer.includes('tiktok')) fuente = 'tiktok'

    const reclutadorCodigo = ref ?? getCodigoReferido()

    await fetch('/api/trafico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fuente,
        vacanteId: vacanteId ?? null,
        codigoRef: reclutadorCodigo ?? null,
        tipoEvento,
      })
    })
  } catch {
    // silencioso — un fallo de tracking nunca debe romper la experiencia real
  }
}