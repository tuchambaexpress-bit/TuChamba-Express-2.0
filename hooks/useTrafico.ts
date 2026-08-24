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