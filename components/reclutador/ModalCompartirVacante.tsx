'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface Props {
  vacanteId: string
  vacanteTitulo: string
  tokenReferido: string | null
  onClose: () => void
}

export default function ModalCompartirVacante({ vacanteId, vacanteTitulo, tokenReferido, onClose }: Props) {
  const [copiado, setCopiado] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  // Mismo mecanismo que ya usa el botón "Compartir" del candidato
  // (VacanteDetalle.tsx) — el ref es el del reclutador que comparte,
  // así que la postulación de quien lo reciba queda atribuida a él.
  const url = `${window.location.origin}/vacante/${vacanteId}${tokenReferido ? `?ref=${tokenReferido}` : ''}`

  useEffect(() => {
    QRCode.toDataURL(url, { width: 240, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null))
  }, [url])

  async function copiarLink() {
    await navigator.clipboard.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 4000)
  }

  function descargarQR() {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `qr-${vacanteTitulo.replace(/\s+/g, '-').toLowerCase()}.png`
    a.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Compartir vacante</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">✕</button>
        </div>
        <p className="text-sm text-gray-500 mb-3">{vacanteTitulo}</p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-3 text-xs text-gray-600 break-all">
          {url}
        </div>

        <button
          onClick={copiarLink}
          className="w-full bg-[#1A6B3C] hover:bg-[#155c33] text-white font-semibold py-2.5 rounded-xl text-sm mb-4 transition-colors"
        >
          {copiado ? '✅ Copiado' : '🔗 Copiar'}
        </button>

        {qrDataUrl && (
          <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-100">
            <img src={qrDataUrl} alt="Código QR de la vacante" className="w-40 h-40" />
            <button
              onClick={descargarQR}
              className="text-sm text-[#1A6B3C] hover:text-[#155c33] font-medium underline"
            >
              ⬇️ Descargar QR
            </button>
          </div>
        )}
      </div>
    </div>
  )
}