'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function useReferido() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      localStorage.setItem('ref_codigo', ref.toUpperCase())
    }
  }, [searchParams])

  return {
    getCodigo: () => {
      if (typeof window === 'undefined') return null
      return localStorage.getItem('ref_codigo')
    }
  }
}