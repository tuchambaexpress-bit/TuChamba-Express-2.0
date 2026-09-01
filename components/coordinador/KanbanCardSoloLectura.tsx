'use client'

interface Props {
  postulacion: any
}

export default function KanbanCardSoloLectura({ postulacion }: Props) {
  const nombre = postulacion.candidatos?.nombre
  const telefono = postulacion.candidatos?.telefono
  const vacante = postulacion.vacantes?.titulo
  const empresa = postulacion.vacantes?.negocios?.nombre

  // Alerta de inactividad — reclutador lleva más de 3 días (72h) sin
  // darle movimiento. Solo aplica a etapas activas — en Contratado o
  // Descartado ya no hay nada que "seguir moviendo".
  const horasSinMovimiento = (Date.now() - new Date(postulacion.updated_at).getTime()) / (1000 * 60 * 60)
  const etapasActivas = ['Aplicado', 'Contactado', 'Entrevista', 'Inducción']
  const sinActividad = etapasActivas.includes(postulacion.etapa_actual) && horasSinMovimiento > 72

  // Entrevista — "Se presentó/No se presentó" solo una vez que ya pasó
  // la fecha/hora agendada (José, 2026-08-31)
  const yaPasoLaEntrevista = postulacion.fecha_entrevista && new Date(postulacion.fecha_entrevista) <= new Date()

  return (
    <div className="rounded-xl p-3 shadow-sm border bg-white border-gray-100">
      {sinActividad && (
        <span className="inline-block text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium mb-1">
          🚨 Sin actividad
        </span>
      )}

      <p className="font-semibold text-gray-900 text-sm">{nombre}</p>
      <p className="text-xs text-[#1A6B3C] mt-0.5">{vacante}{empresa ? ` — ${empresa}` : ''}</p>
      <p className="text-xs text-gray-400 mt-0.5">📱 {telefono}</p>

      {/* Entrevista — fecha/hora + resultado, una vez que ya pasó */}
      {postulacion.fecha_entrevista && (
        <div className="mt-1.5 pt-1.5 border-t border-gray-100 text-xs text-gray-500 space-y-0.5">
          <p>📅 {new Date(postulacion.fecha_entrevista).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} · {new Date(postulacion.fecha_entrevista).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</p>
          {yaPasoLaEntrevista && postulacion.asistio_entrevista !== null && postulacion.asistio_entrevista !== undefined && (
            <p className="font-medium">
              {postulacion.asistio_entrevista ? '✅ Se presentó' : '❌ No se presentó'}
            </p>
          )}
        </div>
      )}

      {/* Inducción — fecha de inicio (José, 2026-08-31: fecha_contratacion
          en este proyecto significa "inicio de inducción", no la fecha de
          contratación real — ver CA-02.8) */}
      {postulacion.fecha_contratacion && (
        <p className="text-xs text-gray-500 mt-1.5 pt-1.5 border-t border-gray-100">
          🏭 Inicio de inducción: {new Date(postulacion.fecha_contratacion).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}

      {/* Contratado — fecha de contratación real (fecha_firma_contrato,
          distinto del campo de arriba) */}
      {postulacion.fecha_firma_contrato && (
        <p className="text-xs text-gray-500 mt-1">
          🎉 Fecha de contratación: {new Date(postulacion.fecha_firma_contrato).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}
    </div>
  )
}
