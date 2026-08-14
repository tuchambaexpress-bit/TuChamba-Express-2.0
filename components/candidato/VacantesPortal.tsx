'use client'

import { useState, useEffect } from 'react'
import VacanteCard from './VacanteCard'
import VacanteDetalle from './VacanteDetalle'
import { useReferido } from '@/hooks/useReferido'
import { useTrafico } from '@/hooks/useTrafico'
import { createClient } from '@/lib/supabase/client'

interface Vacante {
  id: string
  titulo: string
  descripcion: string
  requisitos: string[]
  beneficios: string[]
  letras_chiquitas: string | null
  salario_min: number | null
  salario_max: number | null
  salario_tipo: string | null
  salario_periodo: string | null
  salario_visible: boolean
  ciudad: string
  estado: string
  colonia_zona: string | null
  modalidad: string
  jornada: string
  horario: string | null
  turno: string | null
  tipo_contrato: string | null
  tiene_ruta: boolean
  zonas_ruta: string[]
  ruta_para_entrevista: boolean
  estacionamiento: boolean
  comedor: boolean
  uniforme: boolean
  empresa_visible: boolean
  destacada: boolean
  status: string
  created_at: string
  negocios: { nombre: string } | null
}

const SELECT_VACANTES = `
  id, titulo, descripcion, requisitos, beneficios,
  letras_chiquitas, salario_min, salario_max, salario_tipo, salario_periodo,
  salario_visible, ciudad, estado, colonia_zona,
  modalidad, jornada, horario, turno, tipo_contrato,
  tiene_ruta, zonas_ruta, ruta_para_entrevista,
  estacionamiento, comedor, uniforme,
  empresa_visible, destacada, status, created_at,
  negocios(nombre)
`

interface Props {
  vacantes: Vacante[]
}

const ITEMS_POR_PAGINA = 15

export default function VacantesPortal({ vacantes: vacantesIniciales }: Props) {
  const [vacantes, setVacantes] = useState<Vacante[]>(vacantesIniciales)
  const [seleccionada, setSeleccionada] = useState<Vacante | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroCiudad, setFiltroCiudad] = useState('')
  const [pagina, setPagina] = useState(1)
  const [tieneRef, setTieneRef] = useState(false)

  useEffect(() => {
    setTieneRef(new URLSearchParams(window.location.search).has('ref'))
  }, [])
  useReferido()
  useTrafico()

  // Realtime: refresca la lista sola cuando cualquier vacante vigente cambia
  useEffect(() => {
    const supabase = createClient()

    async function recargarVacantes() {
      const { data } = await supabase
        .from('vacantes')
        .select(SELECT_VACANTES)
        .eq('status', 'vigente')
        .order('destacada', { ascending: false })
        .order('created_at', { ascending: false })

      if (data) {
        const formateadas = data.map((v: any) => ({
          ...v,
          negocios: Array.isArray(v.negocios) ? v.negocios[0] ?? null : v.negocios
        }))
        setVacantes(formateadas)

        // Si la vacante abierta en el panel sigue vigente, refrescamos su detalle también
        setSeleccionada(prev => {
          if (!prev) return prev
          const actualizada = formateadas.find((v: Vacante) => v.id === prev.id)
          return actualizada ?? prev
        })
      }
    }

    const canal = supabase
      .channel('vacantes-portal-publico')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vacantes' }, () => recargarVacantes())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'documentos_negocio' }, () => recargarVacantes())
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [])

  const normalizar = (texto: string) =>
    texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const estados = [...new Set(vacantes.map(v => v.estado))].sort()
  const ciudades = filtroEstado
    ? [...new Set(vacantes.filter(v => v.estado === filtroEstado).map(v => v.ciudad))].sort()
    : []

  const vacantesFiltradas = vacantes.filter(v => {
    const texto = normalizar(`${v.titulo} ${v.negocios?.nombre ?? ''} ${v.ciudad}`)
    const q = normalizar(busqueda)
    const matchBusqueda = !busqueda || texto.includes(q)
    const matchEstado = !filtroEstado || v.estado === filtroEstado
    const matchCiudad = !filtroCiudad || v.ciudad === filtroCiudad
    return matchBusqueda && matchEstado && matchCiudad
  })

  const totalPaginas = Math.ceil(vacantesFiltradas.length / ITEMS_POR_PAGINA)
  const vacantesPaginadas = vacantesFiltradas.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  )

  function abrirVacante(vacante: Vacante) {
    setSeleccionada(vacante)
    setModalAbierto(true)
  }

  function cerrarModal() {
    setModalAbierto(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header verde Nuevo León */}
      <header className="bg-[#1A6B3C] px-4 py-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <img src="/Logo_Header.png" alt="Tu Chamba Express" className="h-8 object-contain" />
            <span className="text-sm text-green-200">{vacantesFiltradas.length} vacantes</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="🔍 Buscar puesto, empresa o ciudad..."
              value={busqueda}
              onChange={e => { setBusqueda(e.target.value); setPagina(1) }}
              className="flex-1 min-w-[200px] bg-white/20 text-white placeholder-green-200 border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
            <select
              value={filtroEstado}
              onChange={e => { setFiltroEstado(e.target.value); setFiltroCiudad(''); setPagina(1) }}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="" className="text-gray-800">📍 Estado</option>
              {estados.map(e => <option key={e} value={e} className="text-gray-800">{e}</option>)}
            </select>
            <select
              value={filtroCiudad}
              onChange={e => { setFiltroCiudad(e.target.value); setPagina(1) }}
              disabled={!filtroEstado}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-40"
            >
              <option value="" className="text-gray-800">🏙️ Ciudad</option>
              {ciudades.map(c => <option key={c} value={c} className="text-gray-800">{c}</option>)}
            </select>
            {(busqueda || filtroEstado || filtroCiudad) && (
              <button
                onClick={() => { setBusqueda(''); setFiltroEstado(''); setFiltroCiudad(''); setPagina(1) }}
                className="px-3 py-2 text-sm text-green-200 hover:text-white border border-white/30 rounded-lg"
              >
                ✕ Limpiar
              </button>
            )}
          </div>
        </div>
        {!tieneRef && (
          <div className="flex justify-end mt-1">
            <a 
              href="/admin" 
              className="text-xs text-green-300 hover:text-white opacity-50 hover:opacity-100 transition-opacity"
            >
              Admin
            </a>
          </div>
        )}
      </header>

      {/* Layout dos columnas */}
      <div className="max-w-7xl mx-auto flex h-[calc(100vh-110px)] shadow-lg">

        {/* Lista izquierda */}
        <div className="w-full md:w-2/5 flex flex-col border-r border-gray-200 bg-white">
          {/* Vacantes */}
          <div className="flex-1 overflow-y-auto">
            {vacantesFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <p className="text-lg">Sin resultados</p>
                <p className="text-sm">Intenta con otros términos</p>
              </div>
            ) : (
              vacantesPaginadas.map(v => (
                <VacanteCard
                  key={v.id}
                  vacante={v}
                  seleccionada={seleccionada?.id === v.id}
                  onClick={() => abrirVacante(v)}
                />
              ))
            )}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
              <button
                onClick={() => setPagina(p => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="px-3 py-1.5 text-sm bg-[#1A6B3C] text-white rounded-lg disabled:opacity-40"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-500">
                {pagina} / {totalPaginas}
              </span>
              <button
                onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className="px-3 py-1.5 text-sm bg-[#1A6B3C] text-white rounded-lg disabled:opacity-40"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>

        {/* Panel derecho — solo desktop */}
        <div className="hidden md:block md:w-3/5 overflow-y-auto bg-white">
          {seleccionada ? (
            <VacanteDetalle vacante={seleccionada} onClose={cerrarModal} esModal={false} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-5xl mb-4">💼</p>
              <p className="text-lg font-medium">Selecciona una vacante</p>
              <p className="text-sm">Elige una opción de la lista para ver los detalles</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal — solo móvil */}
      {modalAbierto && seleccionada && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={cerrarModal} />
          <div className="absolute inset-x-0 bottom-0 top-16 bg-white rounded-t-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 text-sm truncate pr-4">
                {seleccionada.titulo}
              </h2>
              <button
                onClick={cerrarModal}
                className="w-8 h-8 rounded-full bg-[#1A6B3C] hover:bg-[#155c33] flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              >
                ✕
              </button>
            </div>
            <VacanteDetalle vacante={seleccionada} onClose={cerrarModal} esModal={true} />
          </div>
        </div>
      )}
    </div>
  )
}
