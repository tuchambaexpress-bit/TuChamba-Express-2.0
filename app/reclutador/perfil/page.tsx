'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'
import { PLATAFORMAS, MAX_REDES_SOCIALES, iconoPlataforma, nombrePlataforma, RedSocial } from '@/lib/redes-sociales'

export default function PerfilReclutadorPage() {
  const router = useRouter()
  const [reclutadorId, setReclutadorId] = useState<string | null>(null)
  const [tokenReferido, setTokenReferido] = useState<string | null>(null)
  const [redes, setRedes] = useState<RedSocial[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  // Formulario para agregar una red nueva
  const [nuevaPlataforma, setNuevaPlataforma] = useState('facebook')
  const [nuevaUrl, setNuevaUrl] = useState('')

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) {
      router.push('/reclutador/login')
      return
    }
    const s = JSON.parse(data)
    setReclutadorId(s.id)
    setTokenReferido(s.token_referido)
  }, [router])

  useEffect(() => {
    if (!tokenReferido) return
    fetch(`/api/reclutador/perfil?token=${encodeURIComponent(tokenReferido)}`)
      .then(r => r.json())
      .then(data => setRedes(data?.redes_sociales ?? []))
      .finally(() => setCargando(false))
  }, [tokenReferido])

  function agregarRed() {
    if (redes.length >= MAX_REDES_SOCIALES) return
    if (!nuevaUrl.trim()) return
    setRedes([...redes, { plataforma: nuevaPlataforma, url: nuevaUrl.trim() }])
    setNuevaUrl('')
    setNuevaPlataforma('facebook')
    setMensaje('')
  }

  function eliminarRed(i: number) {
    setRedes(redes.filter((_, idx) => idx !== i))
    setMensaje('')
  }

  async function guardar() {
    if (!reclutadorId) return
    setGuardando(true)
    setMensaje('')

    const res = await fetch('/api/reclutador/perfil', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reclutadorId, redesSociales: redes }),
    })
    const data = await res.json()

    setGuardando(false)
    setMensaje(res.ok ? '✅ Guardado' : `❌ ${data.error ?? 'Error al guardar'}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReclutadorNav subtitulo="👤 Perfil" />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-lg font-bold text-gray-900 mb-1">Mis redes sociales</h1>
        <p className="text-sm text-gray-500 mb-6">
          Estos links aparecen en vez del Facebook oficial de TuChamba cuando alguien llega por tu link de referido.
        </p>

        {cargando ? (
          <p className="text-sm text-gray-400">Cargando...</p>
        ) : (
          <>
            {/* Lista de redes guardadas/vigentes */}
            {redes.length > 0 && (
              <div className="space-y-2 mb-4">
                {redes.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2.5"
                  >
                    <img src={iconoPlataforma(r.plataforma)} alt="" className="h-[19px] w-[22px] object-contain" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{nombrePlataforma(r.plataforma)}</p>
                      <p className="text-xs text-gray-500 truncate">{r.url}</p>
                    </div>
                    <button
                      onClick={() => eliminarRed(i)}
                      className="text-red-500 hover:text-red-700 text-sm px-2 flex-shrink-0"
                      aria-label="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Formulario para agregar una red nueva */}
            {redes.length < MAX_REDES_SOCIALES ? (
              <div className="flex gap-2 items-center bg-white border border-gray-200 rounded-xl p-3">
                <div className="flex items-center gap-1.5 border border-gray-300 rounded-lg pl-2 bg-white">
                  <img src={iconoPlataforma(nuevaPlataforma)} alt="" className="h-4 w-4 object-contain" />
                  <select
                    value={nuevaPlataforma}
                    onChange={e => setNuevaPlataforma(e.target.value)}
                    className="border-0 rounded-lg px-1 py-2 text-sm bg-white focus:outline-none"
                  >
                    {PLATAFORMAS.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="url"
                  value={nuevaUrl}
                  onChange={e => setNuevaUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && agregarRed()}
                  placeholder="https://..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
                <button
                  onClick={agregarRed}
                  disabled={!nuevaUrl.trim()}
                  className="text-sm text-[#1A6B3C] hover:text-[#155c33] font-medium px-2 disabled:opacity-40"
                >
                  + Agregar
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400">Ya tienes el máximo de {MAX_REDES_SOCIALES} redes.</p>
            )}

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={guardar}
                disabled={guardando}
                className="bg-[#1A6B3C] hover:bg-[#155c33] text-white px-5 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
              {mensaje && <span className="text-sm">{mensaje}</span>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}