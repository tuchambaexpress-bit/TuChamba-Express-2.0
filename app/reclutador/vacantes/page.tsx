'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ReclutadorNav from '@/components/reclutador/ReclutadorNav'
import ModalCompartirVacante from '@/components/reclutador/ModalCompartirVacante'

interface Vacante {
  id: string
  titulo: string
  ciudad: string
  estado: string
  status: string
  prioridad: string
  comision_base_mxn: number
  dias_garantia: number
  tiene_promocion: boolean
  promocion_fin: string | null
  fecha_publicacion: string
  salario_min: number | null
  salario_max: number | null
  salario_tipo: string | null
  salario_periodo: string | null
  salario_visible: boolean
  cupo_requerido: number
  cupo_desde: string
  negocios: { nombre: string; dias_entrevista: number[] } | null
}

const NOMBRES_SALARIO_TIPO: Record<string, string> = {
  neto: 'neto', bruto: 'bruto', convenir: 'a convenir', segun_experiencia: 'según experiencia'
}
const NOMBRES_PERIODO: Record<string, string> = {
  semanal: 'sem.', quincenal: 'quinc.', mensual: 'mes', por_hora: 'hora'
}

const NOMBRES_DIA_CORTO: Record<number, string> = {
  0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb',
}

const COLUMNAS_GRID = 'minmax(220px,2fr) minmax(130px,1fr) minmax(110px,auto) minmax(170px,auto) minmax(110px,auto) minmax(170px,auto) minmax(90px,auto) minmax(100px,auto)'
const COLUMNAS_ENCABEZADO = [
  { campo: 'titulo', label: 'Título' },
  { campo: 'empresa', label: 'Empresa' },
  { campo: 'fecha_publicacion', label: 'Publicada' },
  { campo: 'sueldo', label: 'Sueldo' },
  { campo: 'requerimiento', label: 'Requerimiento' },
  { campo: 'dias_entrevista', label: 'Días de entrevista' },
  { campo: 'estatus', label: 'Estatus' },
]

export default function VacantesReclutador() {
  const router = useRouter()
  const [vacantes, setVacantes] = useState<Vacante[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [reclutadorId, setReclutadorId] = useState<string | null>(null)
  const [tokenReferido, setTokenReferido] = useState<string | null>(null)
  const [vacanteCompartir, setVacanteCompartir] = useState<Vacante | null>(null)
  const [cupoReal, setCupoReal] = useState<Map<string, number>>(new Map())
  const [ordenPor, setOrdenPor] = useState<string | null>(null)
  const [ordenAsc, setOrdenAsc] = useState(true)
  // Fix (2026-08-29): position:sticky causaba que los encabezados se
  // renderizaran en la posición equivocada en el entorno de José —
  // confirmado con una versión de prueba sin ningún sticky (se veía
  // bien) — así que en vez de sticky, se calcula "a mano" con scroll +
  // position:fixed, que no depende del mismo mecanismo del navegador.
  const [fijo, setFijo] = useState(false)
  const refBuscador = useRef<HTMLDivElement>(null)
  const offsetOriginal = useRef(0)

  useEffect(() => {
    if (refBuscador.current) {
      offsetOriginal.current = refBuscador.current.getBoundingClientRect().top + window.scrollY
    }
    function onScroll() {
      setFijo(window.scrollY >= offsetOriginal.current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function alternarOrden(campo: string) {
    if (ordenPor === campo) {
      setOrdenAsc(!ordenAsc)
    } else {
      setOrdenPor(campo)
      setOrdenAsc(true)
    }
  }

  useEffect(() => {
    const data = localStorage.getItem('reclutador_sesion')
    if (!data) { router.push('/reclutador/login'); return }
    const s = JSON.parse(data)
    setReclutadorId(s.id)
    setTokenReferido(s.token_referido)
    cargarVacantes(s.id)
  }, [])

  // 5.21 — Realtime sin filtro por agencia: el reclutador puede estar activo
  // en varias agencias (reclutador_agencia), y postgres_changes solo soporta
  // filtro simple de igualdad (no "IN" sobre una lista). Se escucha cualquier
  // cambio en `vacantes` y se recarga la lista ya filtrada por sus agencias
  // (cargarVacantes ya hace ese filtro). Decisión B1: sin filtro en el canal
  // — volumen bajo hoy, más simple que abrir un canal por cada agencia.
  useEffect(() => {
    if (!reclutadorId) return
    const supabase = createClient()
    const canal = supabase
      .channel(`vacantes-reclutador-${reclutadorId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vacantes' }, () => cargarVacantes(reclutadorId))
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [reclutadorId])

  async function cargarVacantes(reclutadorId: string) {
    const supabase = createClient()

    // El reclutador puede estar activo en más de una agencia
    const { data: agencias } = await supabase
      .from('reclutador_agencia')
      .select('agencia_id')
      .eq('reclutador_id', reclutadorId)
      .eq('activo', true)

    const agenciaIds = (agencias ?? []).map((a: any) => a.agencia_id)
    if (agenciaIds.length === 0) { setLoading(false); return }

    const { data } = await supabase
      .from('vacantes')
      .select('id, titulo, ciudad, estado, status, prioridad, comision_base_mxn, dias_garantia, tiene_promocion, promocion_fin, fecha_publicacion, salario_min, salario_max, salario_tipo, salario_periodo, salario_visible, cupo_requerido, cupo_desde, negocios(nombre, dias_entrevista)')
      .in('agencia_id', agenciaIds)
      .order('status', { ascending: true }) // 'pausada' < 'vigente' alfabéticamente — se reordena abajo
      .order('created_at', { ascending: false })

    if (data) {
      // Vigentes primero, pausadas después — sin ocultar ninguna
      const ordenadas = [...data].sort((a: any, b: any) => {
        if (a.status === b.status) return 0
        return a.status === 'vigente' ? -1 : 1
      })
      setVacantes(ordenadas as any)

      // Cupo real ocupado — mismo criterio "por rondas" que ya usa el
      // coordinador (HU-16, 6.8b): solo cuenta lo que entró a Inducción
      // DESPUÉS de cupo_desde de CADA vacante (una reactivación resetea
      // el conteo). Solo entre las vacantes de este reclutador.
      const vacanteIds = ordenadas.map((v: any) => v.id)
      const mapaCupoDesde = new Map(ordenadas.map((v: any) => [v.id, (v.cupo_desde ?? '1970-01-01').split('T')[0]]))
      const { data: postulacionesData } = await supabase
        .from('postulaciones')
        .select('vacante_id, fecha_contratacion')
        .in('vacante_id', vacanteIds)
        .eq('comision_aplicable', true)

      const conteo = new Map<string, number>()
      ;(postulacionesData ?? []).forEach((p: any) => {
        const cupoDesde = mapaCupoDesde.get(p.vacante_id)
        if (p.fecha_contratacion && cupoDesde && p.fecha_contratacion >= cupoDesde) {
          conteo.set(p.vacante_id, (conteo.get(p.vacante_id) ?? 0) + 1)
        }
      })
      setCupoReal(conteo)
    }
    setLoading(false)
  }

  const hoy = new Date().toISOString().split('T')[0]
  const vacantesFiltradas = vacantes.filter(v => {
    const texto = `${v.titulo} ${(v.negocios as any)?.nombre ?? ''} ${v.ciudad}`.toLowerCase()
    return texto.includes(busqueda.toLowerCase())
  })

  const vacantesOrdenadas = [...vacantesFiltradas].sort((a, b) => {
    if (!ordenPor) return 0
    let valA: any, valB: any
    switch (ordenPor) {
      case 'titulo': valA = a.titulo; valB = b.titulo; break
      case 'empresa': valA = (a.negocios as any)?.nombre ?? ''; valB = (b.negocios as any)?.nombre ?? ''; break
      case 'fecha_publicacion': valA = a.fecha_publicacion; valB = b.fecha_publicacion; break
      case 'sueldo': valA = a.salario_min ?? 0; valB = b.salario_min ?? 0; break
      case 'requerimiento': valA = a.cupo_requerido ?? 1; valB = b.cupo_requerido ?? 1; break
      case 'dias_entrevista': valA = (a.negocios as any)?.dias_entrevista?.length ?? 0; valB = (b.negocios as any)?.dias_entrevista?.length ?? 0; break
      case 'estatus': valA = a.status; valB = b.status; break
      default: return 0
    }
    if (typeof valA === 'string') {
      return ordenAsc ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    return ordenAsc ? valA - valB : valB - valA
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <ReclutadorNav subtitulo="Vacantes de tu agencia" />

      {/* Barra fija (2026-08-29) — reemplaza a position:sticky, que
          fallaba en el entorno de José. Se activa con JS/scroll, no con
          CSS sticky. Duplica visualmente el buscador + encabezados,
          mismas columnas exactas que la rejilla de abajo. */}
      {fijo && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-gray-50 shadow-md">
          <div className="max-w-6xl mx-auto px-4 pt-3 pb-3">
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por puesto, empresa o ciudad..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] mb-2"
            />
            <div className="bg-white rounded-t-2xl shadow-sm overflow-x-auto">
              <div className="grid text-sm min-w-[900px]" style={{ gridTemplateColumns: COLUMNAS_GRID }}>
                {COLUMNAS_ENCABEZADO.map(col => (
                  <div key={col.campo} className="bg-white border-b border-gray-100 px-4 py-3">
                    <button
                      onClick={() => alternarOrden(col.campo)}
                      className="flex items-center gap-1 text-left text-xs font-medium text-gray-500 hover:text-gray-700"
                    >
                      {col.label}
                      <span className="text-gray-300">
                        {ordenPor === col.campo ? (ordenAsc ? '▲' : '▼') : '⇅'}
                      </span>
                    </button>
                  </div>
                ))}
                <div className="bg-white border-b border-gray-100 px-4 py-3"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div ref={refBuscador} className="bg-gray-50 pt-6 pb-4">
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por puesto, empresa o ciudad..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
          />
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Cargando...</div>
        ) : vacantesFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-gray-500 font-medium">Sin vacantes que coincidan</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <div
              className="grid text-sm min-w-[900px]"
              style={{ gridTemplateColumns: COLUMNAS_GRID }}
            >
              {/* Encabezados normales, sin sticky — la versión fija de
                  arriba es la que se encarga de "quedarse pegada" */}
              {COLUMNAS_ENCABEZADO.map(col => (
                <div key={col.campo} className="bg-white border-b border-gray-100 px-4 py-3">
                  <button
                    onClick={() => alternarOrden(col.campo)}
                    className="flex items-center gap-1 text-left text-xs font-medium text-gray-500 hover:text-gray-700"
                  >
                    {col.label}
                    <span className="text-gray-300">
                      {ordenPor === col.campo ? (ordenAsc ? '▲' : '▼') : '⇅'}
                    </span>
                  </button>
                </div>
              ))}
              <div className="bg-white border-b border-gray-100 px-4 py-3"></div>

              {/* Filas — cada una envuelta en "contents" para que sus
                  celdas participen directo en la rejilla exterior, sin
                  dejar de comportarse como una fila para el hover
                  (patrón "group"/"group-hover") */}
              {vacantesOrdenadas.map(v => {
                const promoActiva = v.tiene_promocion && v.promocion_fin && hoy <= v.promocion_fin
                const salario = v.salario_visible && v.salario_min
                  ? `$${v.salario_min.toLocaleString('es-MX')}${v.salario_max ? `–$${v.salario_max.toLocaleString('es-MX')}` : ''} ${NOMBRES_SALARIO_TIPO[v.salario_tipo ?? ''] ?? ''} / ${NOMBRES_PERIODO[v.salario_periodo ?? ''] ?? ''}`.trim()
                  : 'A convenir'
                const diasEntrevista = (v.negocios as any)?.dias_entrevista?.length > 0
                  ? [...(v.negocios as any).dias_entrevista].sort().map((d: number) => NOMBRES_DIA_CORTO[d]).join(', ')
                  : '—'
                return (
                  <div key={v.id} className="contents group">
                    <div className="px-4 py-3 border-b border-gray-50 group-hover:bg-gray-50 transition-colors">
                      <Link href={`/reclutador/detalle/${v.id}?from=vacantes`} className="font-medium text-gray-900 hover:text-[#1A6B3C] hover:underline">
                        {v.titulo}
                      </Link>
                      <div className="flex gap-1 mt-0.5">
                        {v.prioridad === 'urgente' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">🔴 Urgente</span>
                        )}
                        {v.prioridad === 'alta' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">🟠 Alta</span>
                        )}
                        {promoActiva && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">🔥 Bono</span>
                        )}
                      </div>
                    </div>
                    <div className="px-4 py-3 border-b border-gray-50 text-gray-600 group-hover:bg-gray-50 transition-colors">
                      {(v.negocios as any)?.nombre ?? 'Empresa'}
                    </div>
                    <div className="px-4 py-3 border-b border-gray-50 text-gray-600 whitespace-nowrap group-hover:bg-gray-50 transition-colors">
                      {new Date(v.fecha_publicacion).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="px-4 py-3 border-b border-gray-50 text-gray-600 whitespace-nowrap group-hover:bg-gray-50 transition-colors">
                      {salario}
                    </div>
                    <div className="px-4 py-3 border-b border-gray-50 text-gray-600 group-hover:bg-gray-50 transition-colors">
                      {cupoReal.get(v.id) ?? 0}/{v.cupo_requerido ?? 1}
                    </div>
                    <div className="px-4 py-3 border-b border-gray-50 text-gray-600 whitespace-nowrap group-hover:bg-gray-50 transition-colors">
                      {diasEntrevista}
                    </div>
                    <div className="px-4 py-3 border-b border-gray-50 group-hover:bg-gray-50 transition-colors">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        v.status === 'vigente' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                    <div className="px-4 py-3 border-b border-gray-50 group-hover:bg-gray-50 transition-colors">
                      <button
                        onClick={() => setVacanteCompartir(v)}
                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                      >
                        🔗 Compartir
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {vacanteCompartir && (
        <ModalCompartirVacante
          vacanteId={vacanteCompartir.id}
          vacanteTitulo={vacanteCompartir.titulo}
          tokenReferido={tokenReferido}
          onClose={() => setVacanteCompartir(null)}
        />
      )}
    </div>
  )
}
