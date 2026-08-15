'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CoordinadorNav from '@/components/coordinador/CoordinadorNav'

interface Reclutador {
  id: string
  nombre: string
  codigo: string
  lada: string
  telefono: string | null
  email: string | null
  pais: string
  activo: boolean
  created_at: string
}

const LADAS_AMERICA = [
  { pais: 'México', lada: '+52' },
  { pais: 'Estados Unidos / Canadá', lada: '+1' },
  { pais: 'Guatemala', lada: '+502' },
  { pais: 'Belice', lada: '+501' },
  { pais: 'El Salvador', lada: '+503' },
  { pais: 'Honduras', lada: '+504' },
  { pais: 'Nicaragua', lada: '+505' },
  { pais: 'Costa Rica', lada: '+506' },
  { pais: 'Panamá', lada: '+507' },
  { pais: 'Cuba', lada: '+53' },
  { pais: 'Haití', lada: '+509' },
  { pais: 'República Dominicana', lada: '+1' },
  { pais: 'Colombia', lada: '+57' },
  { pais: 'Venezuela', lada: '+58' },
  { pais: 'Ecuador', lada: '+593' },
  { pais: 'Perú', lada: '+51' },
  { pais: 'Brasil', lada: '+55' },
  { pais: 'Bolivia', lada: '+591' },
  { pais: 'Chile', lada: '+56' },
  { pais: 'Paraguay', lada: '+595' },
  { pais: 'Argentina', lada: '+54' },
  { pais: 'Uruguay', lada: '+598' },
  { pais: 'Guyana', lada: '+592' },
  { pais: 'Surinam', lada: '+597' },
]

function sugerirCodigo(nombre: string): string {
  const limpio = nombre
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z\s]/g, '')
    .trim()
  const partes = limpio.split(/\s+/)
  const base = (partes[0] ?? 'REC').slice(0, 6)
  return `${base}${new Date().getFullYear().toString().slice(-2)}`
}

export default function ReclutadoresCoordinador() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [reclutadores, setReclutadores] = useState<Reclutador[]>([])
  const [conteos, setConteos] = useState<Record<string, { vacantes: number; candidatos: number }>>({})
  const [loading, setLoading] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Reclutador | null>(null)
  const [form, setForm] = useState({ nombre: '', codigo: '', lada: '+52', telefono: '', email: '', pais: 'México' })
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('coordinador_sesion')
    if (!data) { router.push('/coordinador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarReclutadores(s.agencia_id)
  }, [])

  async function cargarReclutadores(agenciaId: string) {
    const supabase = createClient()

    const { data: relaciones } = await supabase
      .from('reclutador_agencia')
      .select('reclutador_id, reclutadores(id, nombre, codigo, lada, telefono, email, pais, activo, created_at)')
      .eq('agencia_id', agenciaId)
      .eq('activo', true)

    const lista = (relaciones ?? [])
      .map((r: any) => r.reclutadores)
      .filter(Boolean)

    setReclutadores(lista)

    // Conteos: vacantes activas que trabajan + candidatos en proceso (CA-12.4)
    const nuevosConteos: Record<string, { vacantes: number; candidatos: number }> = {}
    for (const r of lista) {
      const { data: postulaciones } = await supabase
        .from('postulaciones')
        .select('vacante_id, etapa_actual')
        .eq('reclutador_id', r.id)
        .not('etapa_actual', 'in', '("Descartado","Contratado")')

      nuevosConteos[r.id] = {
        vacantes: new Set((postulaciones ?? []).map((p: any) => p.vacante_id)).size,
        candidatos: (postulaciones ?? []).length,
      }
    }
    setConteos(nuevosConteos)
    setLoading(false)
  }

  function abrirNuevo() {
    setEditando(null)
    setForm({ nombre: '', codigo: '', lada: '+52', telefono: '', email: '', pais: 'México' })
    setError('')
    setModalAbierto(true)
  }

  function abrirEditar(r: Reclutador) {
    setEditando(r)
    setForm({
      nombre: r.nombre, codigo: r.codigo, lada: r.lada,
      telefono: r.telefono ?? '', email: r.email ?? '', pais: r.pais,
    })
    setError('')
    setModalAbierto(true)
  }

  async function guardar() {
    setError('')
    if (!form.nombre.trim()) return setError('El nombre es obligatorio')
    if (!form.codigo.trim()) return setError('El código es obligatorio')

    setGuardando(true)
    const supabase = createClient()

    if (editando) {
      const { error: errorUpdate } = await supabase
        .from('reclutadores')
        .update({
          nombre: form.nombre.trim(),
          codigo: form.codigo.trim().toUpperCase(),
          lada: form.lada,
          telefono: form.telefono.trim() || null,
          email: form.email.trim() || null,
          pais: form.pais,
        })
        .eq('id', editando.id)

      if (errorUpdate) {
        setError(errorUpdate.message.includes('duplicate') ? 'Ese código ya está en uso' : errorUpdate.message)
        setGuardando(false)
        return
      }
    } else {
      const { data: nuevoReclutador, error: errorInsert } = await supabase
        .from('reclutadores')
        .insert({
          nombre: form.nombre.trim(),
          codigo: form.codigo.trim().toUpperCase(),
          lada: form.lada,
          telefono: form.telefono.trim() || null,
          email: form.email.trim() || null,
          pais: form.pais,
          activo: true,
        })
        .select('id')
        .single()

      if (errorInsert || !nuevoReclutador) {
        setError(errorInsert?.message.includes('duplicate') ? 'Ese código ya está en uso' : (errorInsert?.message ?? 'Error al crear'))
        setGuardando(false)
        return
      }

      await supabase.from('reclutador_agencia').insert({
        reclutador_id: nuevoReclutador.id,
        agencia_id: sesion.agencia_id,
        activo: true,
      })
    }

    setGuardando(false)
    setModalAbierto(false)
    cargarReclutadores(sesion.agencia_id)
  }

  async function toggleActivo(r: Reclutador) {
    const supabase = createClient()
    await supabase.from('reclutadores').update({ activo: !r.activo }).eq('id', r.id)
    cargarReclutadores(sesion.agencia_id)
  }

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CoordinadorNav subtitulo="Reclutadores" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reclutadores</h2>
          <button
            onClick={abrirNuevo}
            className="bg-[#1A6B3C] hover:bg-[#155c33] text-white text-sm px-4 py-2 rounded-lg font-medium"
          >
            + Nuevo reclutador
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando...</div>
        ) : reclutadores.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-3xl mb-2">👥</p>
            <p className="text-gray-500 font-medium">Aún no tienes reclutadores registrados</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs">
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Código</th>
                  <th className="px-4 py-3 font-medium">País / LADA</th>
                  <th className="px-4 py-3 font-medium">Teléfono</th>
                  <th className="px-4 py-3 font-medium">Vacantes activas</th>
                  <th className="px-4 py-3 font-medium">Candidatos en proceso</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {reclutadores.map(r => (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => abrirEditar(r)}
                        className="font-medium text-gray-900 hover:text-[#1A6B3C] hover:underline text-left"
                      >
                        {r.nombre}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.codigo}</td>
                    <td className="px-4 py-3 text-gray-600">{r.pais} ({r.lada})</td>
                    <td className="px-4 py-3 text-gray-600">{r.telefono ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{conteos[r.id]?.vacantes ?? 0}</td>
                    <td className="px-4 py-3 text-gray-600">{conteos[r.id]?.candidatos ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {r.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActivo(r)}
                        className="text-xs text-gray-500 hover:text-[#1A6B3C] border border-gray-200 rounded-lg px-2 py-1"
                      >
                        {r.activo ? 'Desactivar' : 'Reactivar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-900 mb-4">{editando ? 'Editar reclutador' : 'Nuevo reclutador'}</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Nombre *</label>
                <input
                  value={form.nombre}
                  onChange={e => {
                    const nombre = e.target.value
                    setForm(prev => ({ ...prev, nombre, codigo: editando ? prev.codigo : sugerirCodigo(nombre) }))
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Código único *</label>
                <input
                  value={form.codigo}
                  onChange={e => setForm({ ...form, codigo: e.target.value.toUpperCase() })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
                <p className="text-[10px] text-gray-400 mt-1">Sugerido automáticamente — puedes cambiarlo si quieres.</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">País</label>
                <select
                  value={form.pais}
                  onChange={e => {
                    const paisSeleccionado = e.target.value
                    const ladaCorrespondiente = LADAS_AMERICA.find(l => l.pais === paisSeleccionado)?.lada ?? '+52'
                    setForm({ ...form, pais: paisSeleccionado, lada: ladaCorrespondiente })
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                >
                  {LADAS_AMERICA.map(l => (
                    <option key={l.pais} value={l.pais}>{l.pais} ({l.lada})</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">La LADA se ajusta automáticamente según el país.</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Teléfono</label>
                <input
                  value={form.telefono}
                  onChange={e => setForm({ ...form, telefono: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Email (opcional)</label>
                <input
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setModalAbierto(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando}
                className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium"
              >
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
