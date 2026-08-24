'use client'

import { useEffect, useState } from 'react'
import { getCodigoReferido } from '@/hooks/useReferido'

export default function DebugRefIndicator() {
  const [codigo, setCodigo] = useState<string | null>(null)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    setCodigo(getCodigoReferido())
    setListo(true)
  }, [])

  // Nunca se muestra en producción — solo mientras corres npm run dev
  if (process.env.NODE_ENV !== 'development' || !listo) return null

  return (
    <div
      className="fixed bottom-3 right-3 z-[9999] bg-black/85 text-white text-[10px] px-3 py-1.5 rounded-full"
      style={{ fontFamily: 'monospace' }}
    >
      {codigo ? `🔗 ref activo: ${codigo}` : '⚪ sin ref guardado'}
    </div>
  )
}
