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
  agencias: { nombre: string }[] | { nombre: string } | null
}

function nombreAgencia(agencias: Coordinador['agencias'] | ReclutadorAgencia['agencias']): string {
  if (!agencias) return ''
  if (Array.isArray(agencias)) return agencias[0]?.nombre ?? ''
  return agencias.nombre
}

interface ReclutadorAgencia {
  id: string
  activo: boolean
  agencias: { nombre: string }[] | { nombre: string } | null
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
  es_maestro: boolean
  created_at: string
  reclutador_agencia: ReclutadorAgencia[]
}

interface Postulacion {
  id: string
  etapa_actual: string
  created_at: string
  candidatos: { nombre: string; lada: string; telefono: string }[] | { nombre: string; lada: string; telefono: string } | null
  vacantes: { titulo: string }[] | { titulo: string } | null
  agencias: { nombre: string }[] | { nombre: string } | null
  reclutadores: { nombre: string }[] | { nombre: string } | null
}

function nombreCandidato(p: Postulacion): string {
  const c = Array.isArray(p.candidatos) ? p.candidatos[0] : p.candidatos
  return c?.nombre ?? '—'
}
function telefonoCandidato(p: Postulacion): string {
  const c = Array.isArray(p.candidatos) ? p.candidatos[0] : p.candidatos
  return c ? `${c.lada} ${c.telefono}` : '—'
}
function tituloVacante(p: Postulacion): string {
  const v = Array.isArray(p.vacantes) ? p.vacantes[0] : p.vacantes
  return v?.titulo ?? '—'
}
function agenciaPostulacion(p: Postulacion): string {
  const a = Array.isArray(p.agencias) ? p.agencias[0] : p.agencias
  return a?.nombre ?? '—'
}
function reclutadorPostulacion(p: Postulacion): string {
  const r = Array.isArray(p.reclutadores) ? p.reclutadores[0] : p.reclutadores
  return r?.nombre ?? '—'
}

const ETAPAS = ['Aplicado', 'Contactado', 'Entrevista', 'Inducción', 'Contratado', 'Descartado']
const COLOR_ETAPA: Record<string, string> = {
  Aplicado: 'text-[#8B94A8] border-[#1E2330]',
  Contactado: 'text-[#00D9FF] border-[#00D9FF]/30',
  Entrevista: 'text-amber-400 border-amber-400/30',
  Inducción: 'text-[#2563EB] border-[#2563EB]/30',
  Contratado: 'text-[#39FF88] border-[#39FF88]/30',
  Descartado: 'text-red-400 border-red-400/30',
}

interface Props {
  coordinadoresIniciales: Coordinador[]
  reclutadoresIniciales: Reclutador[]
  postulacionesIniciales: Postulacion[]
}

const mono = { fontFamily: "'JetBrains Mono', monospace" }
const display = { fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }

type OrdenCoord = 'nombre' | 'agencia' | 'status'
type OrdenReclu = 'nombre' | 'codigo' | 'pais'
type OrdenPost = 'candidato' | 'vacante' | 'agencia' | 'etapa' | 'fecha'

export default function PlantillaPanel({ coordinadoresIniciales, reclutadoresIniciales, postulacionesIniciales }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'coordinadores' | 'reclutadores' | 'postulaciones'>('coordinadores')
  const [busqueda, setBusqueda] = useState('')
  const [filtroAgencia, setFiltroAgencia] = useState('')
  const [filtroEtapa, setFiltroEtapa] = useState('')
  const [ordenCoord, setOrdenCoord] = useState<OrdenCoord>('nombre')
  const [ordenCoordAsc, setOrdenCoordAsc] = useState(true)
  const [ordenReclu, setOrdenReclu] = useState<OrdenReclu>('nombre')
  const [ordenRecluAsc, setOrdenRecluAsc] = useState(true)
  const [ordenPost, setOrdenPost] = useState<OrdenPost>('fecha')
  const [ordenPostAsc, setOrdenPostAsc] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [mostrarNuevoMaestro, setMostrarNuevoMaestro] = useState(false)
  const [nombreMaestro, setNombreMaestro] = useState('')
  const [codigoMaestro, setCodigoMaestro] = useState('')
  const [telefonoMaestro, setTelefonoMaestro] = useState('')
  const [creandoMaestro, setCreandoMaestro] = useState(false)
  const [errorMaestro, setErrorMaestro] = useState('')

  const agenciasUnicas = useMemo(() => {
    const set = new Set<string>()
    coordinadoresIniciales.forEach(c => { const n = nombreAgencia(c.agencias); if (n) set.add(n) })
    reclutadoresIniciales.forEach(r => r.reclutador_agencia.forEach(ra => { const n = nombreAgencia(ra.agencias); if (n) set.add(n) }))
    postulacionesIniciales.forEach(p => { const n = agenciaPostulacion(p); if (n) set.add(n) })
    return Array.from(set).sort()
  }, [coordinadoresIniciales, reclutadoresIniciales, postulacionesIniciales])

  function ordenarCoord(col: OrdenCoord) {
    if (ordenCoord === col) setOrdenCoordAsc(v => !v)
    else { setOrdenCoord(col); setOrdenCoordAsc(true) }
  }
  function ordenarReclu(col: OrdenReclu) {
    if (ordenReclu === col) setOrdenRecluAsc(v => !v)
    else { setOrdenReclu(col); setOrdenRecluAsc(true) }
  }
  function ordenarPost(col: OrdenPost) {
    if (ordenPost === col) setOrdenPostAsc(v => !v)
    else { setOrdenPost(col); setOrdenPostAsc(col !== 'fecha') }
  }

  const coordinadoresFiltrados = useMemo(() => {
    let lista = coordinadoresIniciales.filter(c => {
      const agencia = nombreAgencia(c.agencias)
      const texto = `${c.nombre} ${c.email} ${agencia}`.toLowerCase()
      if (busqueda && !texto.includes(busqueda.toLowerCase())) return false
      if (filtroAgencia && agencia !== filtroAgencia) return false
      return true
    })
    lista = [...lista].sort((a, b) => {
      let av = '', bv = ''
      if (ordenCoord === 'nombre') { av = a.nombre; bv = b.nombre }
      if (ordenCoord === 'agencia') { av = nombreAgencia(a.agencias); bv = nombreAgencia(b.agencias) }
      if (ordenCoord === 'status') { av = a.status; bv = b.status }
      const cmp = av.localeCompare(bv)
      return ordenCoordAsc ? cmp : -cmp
    })
    return lista
  }, [coordinadoresIniciales, busqueda, filtroAgencia, ordenCoord, ordenCoordAsc])

  const postulacionesFiltradas = useMemo(() => {
    let lista = postulacionesIniciales.filter(p => {
      const texto = `${nombreCandidato(p)} ${tituloVacante(p)} ${agenciaPostulacion(p)} ${reclutadorPostulacion(p)}`.toLowerCase()
      if (busqueda && !texto.includes(busqueda.toLowerCase())) return false
      if (filtroAgencia && agenciaPostulacion(p) !== filtroAgencia) return false
      if (filtroEtapa && p.etapa_actual !== filtroEtapa) return false
      return true
    })
    lista = [...lista].sort((a, b) => {
      let av = '', bv = ''
      if (ordenPost === 'candidato') { av = nombreCandidato(a); bv = nombreCandidato(b) }
      if (ordenPost === 'vacante') { av = tituloVacante(a); bv = tituloVacante(b) }
      if (ordenPost === 'agencia') { av = agenciaPostulacion(a); bv = agenciaPostulacion(b) }
      if (ordenPost === 'etapa') { av = a.etapa_actual; bv = b.etapa_actual }
      if (ordenPost === 'fecha') { av = a.created_at; bv = b.created_at }
      const cmp = av.localeCompare(bv)
      return ordenPostAsc ? cmp : -cmp
    })
    return lista
  }, [postulacionesIniciales, busqueda, filtroAgencia, filtroEtapa, ordenPost, ordenPostAsc])

  const reclutadoresFiltrados = useMemo(() => {
    let lista = reclutadoresIniciales.filter(r => {
      const agenciasTexto = r.reclutador_agencia.map(ra => nombreAgencia(ra.agencias)).join(' ')
      const texto = `${r.nombre} ${r.codigo} ${r.email ?? ''} ${agenciasTexto}`.toLowerCase()
      if (busqueda && !texto.includes(busqueda.toLowerCase())) return false
      if (filtroAgencia && !r.reclutador_agencia.some(ra => nombreAgencia(ra.agencias) === filtroAgencia)) return false
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

  async function crearReclutadorMaestro() {
    if (!nombreMaestro.trim() || !codigoMaestro.trim()) {
      setErrorMaestro('Nombre y código son obligatorios.')
      return
    }
    setCreandoMaestro(true)
    setErrorMaestro('')

    const res = await fetch('/api/admin/crear-reclutador-maestro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombreMaestro.trim(),
        codigo: codigoMaestro.trim(),
        telefono: telefonoMaestro.trim(),
      }),
    })
    const data = await res.json()
    setCreandoMaestro(false)

    if (!res.ok) {
      setErrorMaestro(data.error ?? 'No se pudo crear el reclutador maestro.')
      return
    }

    setMostrarNuevoMaestro(false)
    setNombreMaestro('')
    setCodigoMaestro('')
    setTelefonoMaestro('')
    router.refresh()
  }

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
        {(['coordinadores', 'reclutadores', 'postulaciones'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs uppercase tracking-wide transition-colors ${
              tab === t ? 'bg-[#2563EB] text-white' : 'border border-[#1E2330] text-[#5B6478] hover:text-[#E8EDF4]'
            }`}
            style={display}
          >
            {t === 'coordinadores' ? `Coordinadores (${coordinadoresIniciales.length})` : t === 'reclutadores' ? `Reclutadores (${reclutadoresIniciales.length})` : `Postulaciones (${postulacionesIniciales.length})`}
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
        {tab === 'postulaciones' && (
          <select
            value={filtroEtapa}
            onChange={e => setFiltroEtapa(e.target.value)}
            className="bg-[#12151C] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
            style={mono}
          >
            <option value="">Toda etapa</option>
            {ETAPAS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        )}
      </div>

      {/* Tabla Coordinadores */}
      {tab === 'coordinadores' && (
        <div className="bg-[#12151C] border border-[#1E2330] overflow-auto max-h-[600px]" style={{ clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)' }}>
          <table className="w-full text-sm">
            <thead className="border-b border-[#1E2330] sticky top-0 bg-[#12151C] z-10">
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
                  <td className="px-3 py-2 text-[#8B94A8]" style={mono}>{nombreAgencia(c.agencias) || '—'}</td>
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

      {/* Botón + formulario de Reclutador Maestro */}
      {tab === 'reclutadores' && (
        <div className="mb-4">
          <button
            onClick={() => setMostrarNuevoMaestro(v => !v)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs uppercase tracking-wide px-4 py-2"
            style={{ ...display, clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
          >
            {mostrarNuevoMaestro ? 'Cancelar' : '+ Nuevo reclutador maestro'}
          </button>

          {mostrarNuevoMaestro && (
            <div
              className="bg-[#12151C] border border-[#00D9FF]/30 p-5 mt-3"
              style={{ clipPath: 'polygon(0 12px, 12px 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              <p className="text-[#E8EDF4] uppercase tracking-wide mb-1" style={display}>Reclutador maestro</p>
              <p className="text-[10px] text-[#5B6478] mb-4" style={mono}>
                Recibe automáticamente el tráfico sin link de referido (?ref) y se inscribe solo en cada agencia nueva que se active.
              </p>
              <div className="grid md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>Nombre</label>
                  <input
                    value={nombreMaestro}
                    onChange={e => setNombreMaestro(e.target.value)}
                    className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
                    style={mono}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>Código</label>
                  <input
                    value={codigoMaestro}
                    onChange={e => setCodigoMaestro(e.target.value)}
                    className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
                    style={mono}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#5B6478] uppercase tracking-wide mb-1" style={mono}>Teléfono (opcional)</label>
                  <input
                    value={telefonoMaestro}
                    onChange={e => setTelefonoMaestro(e.target.value)}
                    className="w-full bg-[#0B0D12] border border-[#1E2330] text-[#E8EDF4] px-3 py-2 text-sm focus:outline-none focus:border-[#00D9FF]"
                    style={mono}
                  />
                </div>
              </div>
              {errorMaestro && <p className="text-red-400 text-xs mb-3" style={mono}>⚠ {errorMaestro}</p>}
              <button
                onClick={crearReclutadorMaestro}
                disabled={creandoMaestro}
                className="bg-[#39FF88] hover:bg-[#2ee073] disabled:opacity-50 text-[#0B0D12] text-xs uppercase tracking-wide px-4 py-2 font-semibold"
                style={{ fontFamily: "'Chakra Petch', sans-serif" }}
              >
                {creandoMaestro ? 'Creando...' : 'Crear reclutador maestro'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tabla Reclutadores */}
      {tab === 'reclutadores' && (
        <div className="bg-[#12151C] border border-[#1E2330] overflow-auto max-h-[600px]" style={{ clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)' }}>
          <table className="w-full text-sm">
            <thead className="border-b border-[#1E2330] sticky top-0 bg-[#12151C] z-10">
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
                  <td className="px-3 py-2 text-[#E8EDF4]">
                    {r.nombre}
                    {r.es_maestro && (
                      <span className="ml-2 text-[9px] bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30 px-1.5 py-0.5 uppercase" style={mono}>
                        Maestro
                      </span>
                    )}
                  </td>
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
                          {loadingId === ra.id ? '...' : `${nombreAgencia(ra.agencias) || '—'} ${ra.activo ? '●' : '○'}`}
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

      {/* Tabla Postulaciones — histórico de consulta, sin acciones */}
      {tab === 'postulaciones' && (
        <div className="bg-[#12151C] border border-[#1E2330] overflow-auto max-h-[600px]" style={{ clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)' }}>
          <table className="w-full text-sm">
            <thead className="border-b border-[#1E2330] sticky top-0 bg-[#12151C] z-10">
              <tr>
                <Encabezado label="Candidato" col="candidato" activa={ordenPost === 'candidato'} asc={ordenPostAsc} onClick={() => ordenarPost('candidato')} />
                <th className="px-3 py-2 text-left text-[10px] text-[#E8EDF4] uppercase tracking-wide font-semibold" style={mono}>Teléfono</th>
                <Encabezado label="Vacante" col="vacante" activa={ordenPost === 'vacante'} asc={ordenPostAsc} onClick={() => ordenarPost('vacante')} />
                <Encabezado label="Agencia" col="agencia" activa={ordenPost === 'agencia'} asc={ordenPostAsc} onClick={() => ordenarPost('agencia')} />
                <th className="px-3 py-2 text-left text-[10px] text-[#E8EDF4] uppercase tracking-wide font-semibold" style={mono}>Reclutador</th>
                <Encabezado label="Etapa" col="etapa" activa={ordenPost === 'etapa'} asc={ordenPostAsc} onClick={() => ordenarPost('etapa')} />
                <Encabezado label="Fecha" col="fecha" activa={ordenPost === 'fecha'} asc={ordenPostAsc} onClick={() => ordenarPost('fecha')} />
              </tr>
            </thead>
            <tbody>
              {postulacionesFiltradas.map(p => (
                <tr key={p.id} className="border-b border-[#1E2330] last:border-0">
                  <td className="px-3 py-2 text-[#E8EDF4]">{nombreCandidato(p)}</td>
                  <td className="px-3 py-2 text-[#8B94A8]" style={mono}>{telefonoCandidato(p)}</td>
                  <td className="px-3 py-2 text-[#8B94A8]" style={mono}>{tituloVacante(p)}</td>
                  <td className="px-3 py-2 text-[#8B94A8]" style={mono}>{agenciaPostulacion(p)}</td>
                  <td className="px-3 py-2 text-[#8B94A8]" style={mono}>{reclutadorPostulacion(p)}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-2 py-0.5 uppercase border ${COLOR_ETAPA[p.etapa_actual] ?? 'text-[#5B6478] border-[#1E2330]'}`} style={mono}>
                      {p.etapa_actual}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[#5B6478] text-xs" style={mono}>
                    {new Date(p.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {postulacionesFiltradas.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-[#5B6478] text-sm" style={mono}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
