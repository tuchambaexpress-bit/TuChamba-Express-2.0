'use client'

import { useState } from 'react'
import ChatWindow from '@/components/candidato/ChatWindow'

interface Props {
  postulacion: any
  tieneHistorialPrevio?: boolean
}

export default function KanbanCardSoloLectura({ postulacion, tieneHistorialPrevio }: Props) {
  const [chatAbierto, setChatAbierto] = useState(false)
  const chatId = postulacion.chats?.[0]?.id
  const nombre = postulacion.candidatos?.nombre
  const telefono = postulacion.candidatos?.telefono
  const vacante = postulacion.vacantes?.titulo
  const empresa = postulacion.vacantes?.negocios?.nombre
  const rutaOPunto = postulacion.vacantes?.ruta_para_entrevista && postulacion.vacantes?.punto_reunion
    ? postulacion.vacantes.punto_reunion
    : 'Directo a Empresa'

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
      {postulacion.precalificado && (
        <span className="inline-block text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium mb-1">
          ✅ Pre-calificado
        </span>
      )}
      <p className="text-xs text-[#1A6B3C] mt-0.5">{vacante}{empresa ? ` — ${empresa}` : ''}</p>
      <p className="text-xs text-gray-400 mt-0.5">📱 {telefono}</p>

      {/* HU-23: datos de entrevista + ficha del candidato — se muestran en
          cualquier etapa donde exista el dato, sin restringir por etapa_actual */}
      {postulacion.fecha_entrevista && (
        <div className="mt-1.5 pt-1.5 border-t border-gray-100 text-xs text-gray-500 space-y-0.5">
          <p>📅 {new Date(postulacion.fecha_entrevista).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} · {new Date(postulacion.fecha_entrevista).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</p>
          <p>🚌 {rutaOPunto}</p>
        </div>
      )}

      {(postulacion.candidatos?.edad || postulacion.candidatos?.escolaridad || postulacion.candidatos?.residencia) && (
        <div className="mt-1.5 pt-1.5 border-t border-gray-100 text-xs text-gray-500 space-y-0.5">
          {postulacion.candidatos?.edad && <p>🎂 {postulacion.candidatos.edad} años</p>}
          {postulacion.candidatos?.escolaridad && <p>🎓 {postulacion.candidatos.escolaridad}</p>}
          {postulacion.candidatos?.residencia && <p>📍 {postulacion.candidatos.residencia}</p>}
        </div>
      )}

      {postulacion.score > 0 && (
        <div className="flex gap-0.5 mt-1.5">
          {[1, 2, 3, 4, 5].map(n => (
            <span key={n} className={n <= postulacion.score ? 'text-amber-400' : 'text-gray-200'}>★</span>
          ))}
        </div>
      )}

      {postulacion.asistio_entrevista !== null && postulacion.asistio_entrevista !== undefined && (
        <p className="text-[10px] mt-1.5 font-medium">
          {postulacion.asistio_entrevista ? '✅ Sí se presentó a entrevista' : '❌ No se presentó a entrevista'}
        </p>
      )}

      {esNoEfectivo && (
        <p className="text-[10px] text-red-600 mt-1.5">No concluyó inducción</p>
      )}

      {chatId && (
        <button
          onClick={() => setChatAbierto(true)}
          className="w-full mt-2 text-[11px] bg-gray-50 hover:bg-gray-100 text-gray-600 py-1 rounded-lg border border-gray-200 transition-colors"
        >
          💬 Ver chat
        </button>
      )}

      {chatAbierto && chatId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setChatAbierto(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl flex flex-col" style={{ height: '75vh', maxHeight: '550px' }} onClick={e => e.stopPropagation()}>
            <ChatWindow
              chatId={chatId}
              nombreCandidato={postulacion.candidatos?.nombre ?? ''}
              etapaActual={postulacion.etapa_actual}
              senderTipo="reclutador"
              soloLectura
              onClose={() => setChatAbierto(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
