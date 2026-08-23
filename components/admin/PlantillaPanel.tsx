'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Coordinador {
  id: string
  nombre: string
  email: string
  telefono: string | null
  status: string
  created_at: string
  agencias: { nombre: string } | null
}

interface ReclutadorAgencia {
  id: string
  activo: boolean
  agencias: { nombre: string } | null
}

interface Reclutador {
  id: string
  nombre: string
  codigo: string
  email: string | null
  lada: string
  telefono: string | null
  pais: string
  activo: boolean
  created_at: string
  reclutador_agencia: ReclutadorAgencia[]
}

interface Props {
  coordinadoresIniciales: Coordinador[]
  reclutadoresIniciales: Reclutador[]
}

const mono = { fontFamily: "'JetBrains Mono', monospace" }
const display = { fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }

type OrdenCoord = 'nombre' | 'agencia' | 'status'
type OrdenReclu = 'nombre' | 'codigo' | 'pais'

export default function PlantillaPanel({ coordinadoresIniciales, reclutadoresIniciales }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'coordinadores' | 'reclutadores'>('coordinadores')
  const [busqueda, setBusqueda] = useState('')
  const [filtroAgencia, setFiltroAgencia] = useState('')
  const [ordenCoord, setOrdenCoord] = useState<OrdenCoord>('nombre')
  const [ordenCoordAsc, setOrdenCoordAsc] = useState(true)
  const [ordenReclu, setOrdenReclu] = useState<OrdenReclu>('nombre')
  const [ordenRecluAsc, setOrdenRecluAsc] = useState(true)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const agenciasUnicas = useMemo(() => {
    const set = new Set<string>()
    coordinadoresIniciales.forEach(c => c.agencias?.nombre && set.add(c.agencias.nombre))
    reclutadoresIniciales.forEach(r => r.reclutador_agencia.forEach(ra => ra.agencias?.nombre && set.add(ra.agencias.nombre)))
    return Array.from(set).sort()
  }, [coordinadoresIniciales, reclutadoresIniciales])

  function ordenarCoord(col: OrdenCoord) {
    if (ordenCoord === col) setOrdenCoordAsc(v => !v)
    else { setOrdenCoord(col); setOrdenCoordAsc(true) }
  }
  function ordenarReclu(col: OrdenReclu) {
    if (ordenReclu === col) setOrdenRecluAsc(v => !v)
    else { setOrdenReclu(col); setOrdenRecluAsc(true) }
  }

  const coordinadoresFiltrados = useMemo(() => {
    let lista = coordinadoresIniciales.filter(c => {
      const texto = `${c.nombre} ${c.email} ${c.agencias?.nombre ?? ''}`.toLowerCase()
      if (busqueda && !texto.includes(busqueda.toLowerCase())) return false
      if (filtroAgencia && c.agencias?.nombre !== filtroAgencia) return false
      return true
    })
    lista = [...lista].sort((a, b) => {
      let av = '', bv = ''
      if (ordenCoord === 'nombre') { av = a.nombre; bv = b.nombre }
      if (ordenCoord === 'agencia') { av = a.agencias?.nombre ?? ''; bv = b.agencias?.nombre ?? '' }
      if (ordenCoord === 'status') { av = a.status; bv = b.status }
      const cmp = av.localeCompare(bv)
      return ordenCoordAsc ? cmp : -cmp
    })
    return lista
  }, [coordinadoresIniciales, busqueda, filtroAgencia, ordenCoord, ordenCoordAsc])

  const reclutadoresFiltrados = useMemo(() => {
    let lista = reclutadoresIniciales.filter(r => {
      const agenciasTexto = r.reclutador_agencia.map(ra => ra.agencias?.nombre ?? '').join(' ')
      const texto = `${r.nombre} ${r.codigo} ${r.email ?? ''} ${agenciasTexto}`.toLowerCase()
      if (busqueda && !texto.includes(busqueda.toLowerCase())) return false
      if (filtroAgencia && !r.reclutador_agencia.some(ra => ra.agencias?.nombre === filtroAgencia)) return false
      return true
    })
    lista = [...lista].sort((a, b) => {
      let av = '', bv = ''
      if (ordenReclu === 'nombre') { av = a.nombre; bv = b.nombre }
      if (ordenReclu === 'codigo') { av = a.codigo; bv = b.codigo }
      if (ordenReclu === 'pais') { av = a.pais; bv = b.pais }
      const cmp = av.localeCompare(bv)
      return ordenRecluAsc ? cmp : -cmp
    })
    return lista
  }, [reclutadoresIniciales, busqueda, filtroAgencia, ordenReclu, ordenRecluAsc])

  async function toggleReclutadorAgencia(ra: ReclutadorAgencia) {
    setLoadingId(ra.id)
    await fetch('/api/admin/toggle-reclutador-agencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reclutadorAgenciaId: ra.id, activo: !ra.activo }),
    })
    setLoadingId(null)
    router.refresh()
  }

  function Encabezado({ label, col, activa, asc, onClick }: { label: string; col: string; activa: boolean; asc: boolean; onClick: () => void }) {
    return (
      <th
        onClick={onClick}
        className="px-3 py-2 text-left cursor-pointer select-none text-[#E8EDF4] hover:text-[#00D9FF] transition-colors"
        style={mono}
      >
        <span className="text-[10px] uppercase tracking-wide font-semibold">
          {label} {activa && (asc ? '▲' : '▼')}
        </span>
      </th>
    )
  }

  return (
    <div>
      {/* Pestañas */}
      <div className="flex gap-2 mb-6">
        {(['coordinadores', 'reclutadores'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs uppercase tracking-wide transition-colors ${
              tab === t ? 'bg-[#2563EB] text-white' : 'border border-[#1E2330] text-[#5B6478] hover:text-[#E8EDF4]'
            }`}
            style={display}
          >
            {t === 'coordinadores' ? `Coordinadores (${coordinadoresIniciales.length})` : `Reclutadores (${reclutadoresIniciales.length})`}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, email, código, agencia..."
          className="flex-1 min-w-[240px] bg-[#12151C] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
          style={mono}
        />
        <select
          value={filtroAgencia}
          onChange={e => setFiltroAgencia(e.target.value)}
          className="bg-[#12151C] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
          style={mono}
        >
          <option value="">Toda agencia</option>
          {agenciasUnicas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Tabla Coordinadores */}
      {tab === 'coordinadores' && (
        <div className="bg-[#12151C] border border-[#1E2330] overflow-x-auto" style={{ clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)' }}>
          <table className="w-full text-sm">
            <thead className="border-b border-[#1E2330]">
              <tr>
                <Encabezado label="Nombre" col="nombre" activa={ordenCoord === 'nombre'} asc={ordenCoordAsc} onClick={() => ordenarCoord('nombre')} />
                <th className="px-3 py-2 text-left text-[10px] text-[#E8EDF4] uppercase tracking-wide font-semibold" style={mono}>Email</th>
                <th className="px-3 py-2 text-left text-[10px] text-[#E8EDF4] uppercase tracking-wide font-semibold" style={mono}>Teléfono</th>
                <Encabezado label="Agencia" col="agencia" activa={ordenCoord === 'agencia'} asc={ordenCoordAsc} onClick={() => ordenarCoord('agencia')} />
                <Encabezado label="Status" col="status" activa={ordenCoord === 'status'} asc={ordenCoordAsc} onClick={() => ordenarCoord('status')} />
              </tr>
            </thead>
            <tbody>
              {coordinadoresFiltrados.map(c => (
                <tr key={c.id} className="border-b border-[#1E2330] last:border-0">
                  <td className="px-3 py-2 text-[#E8EDF4]">{c.nombre}</td>
                  <td className="px-3 py-2 text-[#8B94A8]" style={mono}>{c.email}</td>
                  <td className="px-3 py-2 text-[#8B94A8]" style={mono}>{c.telefono ?? '—'}</td>
                  <td className="px-3 py-2 text-[#8B94A8]" style={mono}>{c.agencias?.nombre ?? '—'}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 uppercase ${c.status === 'activo' ? 'text-[#39FF88] border border-[#39FF88]/30' : 'text-[#5B6478] border border-[#1E2330]'}`}
                      style={mono}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {coordinadoresFiltrados.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-[#5B6478] text-sm" style={mono}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabla Reclutadores */}
      {tab === 'reclutadores' && (
        <div className="bg-[#12151C] border border-[#1E2330] overflow-x-auto" style={{ clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)' }}>
          <table className="w-full text-sm">
            <thead className="border-b border-[#1E2330]">
              <tr>
                <Encabezado label="Nombre" col="nombre" activa={ordenReclu === 'nombre'} asc={ordenRecluAsc} onClick={() => ordenarReclu('nombre')} />
                <Encabezado label="Código" col="codigo" activa={ordenReclu === 'codigo'} asc={ordenRecluAsc} onClick={() => ordenarReclu('codigo')} />
                <th className="px-3 py-2 text-left text-[10px] text-[#E8EDF4] uppercase tracking-wide font-semibold" style={mono}>Teléfono</th>
                <Encabezado label="País" col="pais" activa={ordenReclu === 'pais'} asc={ordenRecluAsc} onClick={() => ordenarReclu('pais')} />
                <th className="px-3 py-2 text-left text-[10px] text-[#E8EDF4] uppercase tracking-wide font-semibold" style={mono}>Agencias (clic para activar/desactivar)</th>
              </tr>
            </thead>
            <tbody>
              {reclutadoresFiltrados.map(r => (
                <tr key={r.id} className="border-b border-[#1E2330] last:border-0">
                  <td className="px-3 py-2 text-[#E8EDF4]">{r.nombre}</td>
                  <td className="px-3 py-2 text-[#8B94A8]" style={mono}>{r.codigo}</td>
                  <td className="px-3 py-2 text-[#8B94A8]" style={mono}>{r.telefono ? `${r.lada} ${r.telefono}` : '—'}</td>
                  <td className="px-3 py-2 text-[#8B94A8]" style={mono}>{r.pais}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1.5">
                      {r.reclutador_agencia.map(ra => (
                        <button
                          key={ra.id}
                          onClick={() => toggleReclutadorAgencia(ra)}
                          disabled={loadingId === ra.id}
                          className={`text-[10px] px-2 py-0.5 uppercase transition-colors disabled:opacity-50 ${
                            ra.activo
                              ? 'text-[#39FF88] border border-[#39FF88]/30 hover:bg-[#39FF88]/10'
                              : 'text-red-400 border border-red-400/30 hover:bg-red-400/10'
                          }`}
                          style={mono}
                          title={ra.activo ? 'Clic para desactivar' : 'Clic para activar'}
                        >
                          {loadingId === ra.id ? '...' : `${ra.agencias?.nombre ?? '—'} ${ra.activo ? '●' : '○'}`}
                        </button>
                      ))}
                      {r.reclutador_agencia.length === 0 && <span className="text-[10px] text-[#5B6478]" style={mono}>Sin agencias</span>}
                    </div>
                  </td>
                </tr>
              ))}
              {reclutadoresFiltrados.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-[#5B6478] text-sm" style={mono}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
