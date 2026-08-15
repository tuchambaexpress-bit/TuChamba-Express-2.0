'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CoordinadorNav from '@/components/coordinador/CoordinadorNav'
import KanbanCardSoloLectura from '@/components/coordinador/KanbanCardSoloLectura'

interface Reclutador {
  id: string
  nombre: string
  codigo: string
}

const ETAPAS = ['Aplicado', 'Contactado', 'Entrevista', 'Inducción', 'Contratado', 'Descartado']

const COLORES_ETAPA: Record<string, string> = {
  'Aplicado': 'bg-gray-100 text-gray-700',
  'Contactado': 'bg-blue-100 text-blue-700',
  'Entrevista': 'bg-yellow-100 text-yellow-700',
  'Inducción': 'bg-purple-100 text-purple-700',
  'Contratado': 'bg-green-100 text-green-700',
  'Descartado': 'bg-red-100 text-red-700',
}

export default function PipelineCoordinador() {
  const router = useRouter()
  const [sesion, setSesion] = useState<any>(null)
  const [reclutadores, setReclutadores] = useState<Reclutador[]>([])
  const [reclutadorSeleccionado, setReclutadorSeleccionado] = useState<Reclutador | null>(null)
  const [postulaciones, setPostulaciones] = useState<any[]>([])
  const [candidatosConHistorial, setCandidatosConHistorial] = useState<Set<string>>(new Set())
  const [loadingReclutadores, setLoadingReclutadores] = useState(true)
  const [loadingPipeline, setLoadingPipeline] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('coordinador_sesion')
    if (!data) { router.push('/coordinador/login'); return }
    const s = JSON.parse(data)
    setSesion(s)
    cargarReclutadores(s.agencia_id)
  }, [])

  async function cargarReclutadores(agenciaId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('reclutador_agencia')
      .select('reclutadores(id, nombre, codigo)')
      .eq('agencia_id', agenciaId)
      .eq('activo', true)

    setReclutadores((data ?? []).map((r: any) => r.reclutadores).filter(Boolean))
    setLoadingReclutadores(false)
  }

  async function verPipeline(reclutador: Reclutador) {
    setReclutadorSeleccionado(reclutador)
    setLoadingPipeline(true)
    const supabase = createClient()

    const { data } = await supabase
      .from('postulaciones')
      .select(`
        id, etapa_actual, candidato_id, updated_at, score, motivo_descarte,
        candidatos(nombre, telefono),
        vacantes(titulo)
      `)
      .eq('reclutador_id', reclutador.id)
      .order('created_at', { ascending: false })

    setPostulaciones(data ?? [])

    if (data && data.length > 0) {
      const candidatoIds = [...new Set(data.map((p: any) => p.candidato_id))]
      const { data: historial } = await supabase
        .from('postulaciones')
        .select('candidato_id')
        .eq('reclutador_id', reclutador.id)
        .eq('etapa_actual', 'Descartado')
        .in('candidato_id', candidatoIds)
      setCandidatosConHistorial(new Set((historial ?? []).map((h: any) => h.candidato_id)))
    }

    setLoadingPipeline(false)
  }

  function volverALista() {
    setReclutadorSeleccionado(null)
    setPostulaciones([])
  }

  if (!sesion) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CoordinadorNav subtitulo="Pipeline global" />

      <div className={reclutadorSeleccionado ? 'px-4 py-8' : 'max-w-7xl mx-auto px-4 py-8'}>
        {!reclutadorSeleccionado ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Pipeline por reclutador</h2>
            <p className="text-sm text-gray-500 mb-6">Selecciona un reclutador para ver su pipeline completo (solo consulta).</p>

            {loadingReclutadores ? (
              <div className="text-center py-10 text-gray-400">Cargando...</div>
            ) : reclutadores.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <p className="text-gray-500">Aún no tienes reclutadores registrados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reclutadores.map(r => (
                  <button
                    key={r.id}
                    onClick={() => verPipeline(r)}
                    className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-left"
                  >
                    <p className="font-semibold text-gray-900">{r.nombre}</p>
                    <p className="text-xs text-gray-400 mt-1">Código: {r.codigo}</p>
                    <p className="text-xs text-[#1A6B3C] mt-2">Ver pipeline →</p>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={volverALista} className="text-sm text-gray-500 hover:text-[#1A6B3C]">
                ← Todos los reclutadores
              </button>
              <span className="text-gray-300">|</span>
              <h2 className="text-lg font-bold text-gray-900">{reclutadorSeleccionado.nombre}</h2>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Solo consulta</span>
            </div>

            {loadingPipeline ? (
              <div className="text-center py-10 text-gray-400">Cargando pipeline...</div>
            ) : (
              <div className="overflow-x-auto overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
                <div className="flex gap-4 min-w-max h-full">
                  {ETAPAS.map(etapa => {
                    const postulacionesEtapa = postulaciones.filter(p => p.etapa_actual === etapa)
                    return (
                      <div key={etapa} className="w-72 flex-shrink-0">
                        <div className="flex items-center gap-2 mb-3 sticky top-0 bg-gray-50 py-2 z-10">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${COLORES_ETAPA[etapa]}`}>
                            {etapa === 'Descartado' ? 'Descartados' : etapa}
                          </span>
                          <span className="text-xs text-gray-400">{postulacionesEtapa.length}</span>
                        </div>
                        <div className="space-y-3 min-h-[100px] h-full overflow-y-auto pr-1">
                          {postulacionesEtapa.map(p => (
                            <KanbanCardSoloLectura
                              key={p.id}
                              postulacion={p}
                              tieneHistorialPrevio={candidatosConHistorial.has(p.candidato_id)}
                            />
                          ))}
                          {postulacionesEtapa.length === 0 && (
                            <div className="border-2 border-dashed border-gray-200 rounded-xl h-20 flex items-center justify-center">
                              <p className="text-xs text-gray-300">Sin candidatos</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
