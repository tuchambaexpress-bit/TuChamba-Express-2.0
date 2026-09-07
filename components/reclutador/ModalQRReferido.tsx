'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface Props {
  url: string
  onClose: () => void
}

export default function ModalQRReferido({ url, onClose }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    QRCode.toDataURL(url, { width: 240, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null))
  }, [url])

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  function descargarQR() {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = 'qr-mi-link-referido.png'
    a.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-xl text-center" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Tu QR de referido</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">✕</button>
        </div>
        {qrDataUrl ? (
          <>
            <img src={qrDataUrl} alt="Código QR de tu link de referido" className="w-48 h-48 mx-auto mb-4" />
            <button
              onClick={descargarQR}
              className="w-full bg-[#1A6B3C] hover:bg-[#155c33] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              ⬇️ Descargar QR
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-400 py-8">Generando QR...</p>
        )}
      </div>
    </div>
  )
}