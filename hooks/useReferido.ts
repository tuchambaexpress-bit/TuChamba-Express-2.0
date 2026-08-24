'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const CLAVE = 'ref_codigo'
const DIAS_EXPIRACION = 30

interface RefGuardado {
  codigo: string
  guardado_en: string // ISO date
}

// Función standalone (no hook) — así también la pueden usar componentes
// que no están dentro del árbol de <Suspense>/useSearchParams, como
// VacanteDetalle.tsx y useTrafico.ts, sin duplicar la lógica de expiración.
export function getCodigoReferido(): string | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(CLAVE)
  if (!raw) return null

  try {
    const data: RefGuardado = JSON.parse(raw)
    const guardadoEn = new Date(data.guardado_en)
    const limite = new Date()
    limite.setDate(limite.getDate() - DIAS_EXPIRACION)

    if (guardadoEn < limite) {
      localStorage.removeItem(CLAVE) // expirado — se limpia solo
      return null
    }
    return data.codigo
  } catch {
    // Formato viejo (string plano, de antes de que existiera expiración)
    // — se descarta directo, no sabemos hace cuánto se guardó.
    localStorage.removeItem(CLAVE)
    return null
  }
}

function guardarCodigoReferido(codigo: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    CLAVE,
    JSON.stringify({ codigo, guardado_en: new Date().toISOString() })
  )
}

export function useReferido() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      guardarCodigoReferido(ref)
    }
  }, [searchParams])

  return {
    getCodigo: getCodigoReferido
  }
}
