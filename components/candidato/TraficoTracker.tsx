'use client'

import { useTrafico } from '@/hooks/useTrafico'

export default function TraficoTracker({ vacanteId }: { vacanteId: string }) {
  useTrafico(vacanteId)
  return null
}