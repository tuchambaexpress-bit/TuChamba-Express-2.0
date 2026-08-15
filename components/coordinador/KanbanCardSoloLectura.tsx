'use client'

interface Props {
  postulacion: any
  tieneHistorialPrevio?: boolean
}

export default function KanbanCardSoloLectura({ postulacion, tieneHistorialPrevio }: Props) {
  const nombre = postulacion.candidatos?.nombre
  const telefono = postulacion.candidatos?.telefono
  const vacante = postulacion.vacantes?.titulo

  const horasSinMovimiento = (Date.now() - new Date(postulacion.updated_at).getTime()) / (1000 * 60 * 60)
  const etapasActivas = ['Aplicado', 'Contactado', 'Entrevista', 'Inducción']
  const sinActividad = etapasActivas.includes(postulacion.etapa_actual) && horasSinMovimiento > 72

  const esNoEfectivo = postulacion.motivo_descarte === 'no_concluyo_induccion'

  return (
    <div className={`rounded-xl p-3 shadow-sm border ${esNoEfectivo ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
      {sinActividad && (
        <span className="inline-block text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium mb-1 mr-1">
          🚨 Sin actividad
        </span>
      )}
      {tieneHistorialPrevio && (
        <span className="inline-block text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium mb-1">
          ⚠️ Historial previo
        </span>
      )}

      <p className="font-semibold text-gray-900 text-sm">{nombre}</p>
      <p className="text-xs text-[#1A6B3C] mt-0.5">{vacante}</p>
      <p className="text-xs text-gray-400 mt-0.5">📱 {telefono}</p>

      {postulacion.score > 0 && (
        <div className="flex gap-0.5 mt-1.5">
          {[1, 2, 3, 4, 5].map(n => (
            <span key={n} className={n <= postulacion.score ? 'text-amber-400' : 'text-gray-200'}>★</span>
          ))}
        </div>
      )}

      {esNoEfectivo && (
        <p className="text-[10px] text-red-600 mt-1.5">No concluyó inducción</p>
      )}
    </div>
  )
}
