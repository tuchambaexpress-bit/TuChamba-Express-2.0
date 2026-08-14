'use client'

import { useState } from 'react'
import ChatModal from './ChatModal'

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
  negocios: { nombre: string; documentos_negocio?: { id: string; nombre_archivo: string; archivo_url: string }[] } | null
}

interface Props {
  vacante: Vacante
  onClose?: () => void
  esModal: boolean
  reclutadorId?: string | null
}

export default function VacanteDetalle({ vacante, esModal, reclutadorId }: Props) {
  const [chatAbierto, setChatAbierto] = useState(false)
const codigoRef = typeof window !== 'undefined'
  ? localStorage.getItem('ref_codigo')
  : null
  const empresa = vacante.empresa_visible
    ? vacante.negocios?.nombre ?? 'Empresa'
    : 'Empresa Confidencial'

  const NOMBRES_PERIODO: Record<string, string> = {
    semanal: 'semanal', quincenal: 'quincenal', mensual: 'mensual', por_hora: 'por hora'
  }
  const NOMBRES_SALARIO_TIPO: Record<string, string> = {
    neto: 'neto', bruto: 'bruto', convenir: 'a convenir'
  }
  const NOMBRES_JORNADA: Record<string, string> = {
    completo: 'Tiempo completo', medio: 'Medio tiempo', proyecto: 'Por proyecto', fines: 'Fines de semana'
  }
  const NOMBRES_MODALIDAD: Record<string, string> = {
    presencial: 'Presencial', hibrido: 'Híbrido', remoto: 'Remoto'
  }
  const salario = vacante.salario_visible && vacante.salario_min
    ? `$${vacante.salario_min.toLocaleString('es-MX')}${vacante.salario_max ? ` - $${vacante.salario_max.toLocaleString('es-MX')}` : ''} ${NOMBRES_SALARIO_TIPO[vacante.salario_tipo ?? ''] ?? vacante.salario_tipo ?? ''} ${NOMBRES_PERIODO[vacante.salario_periodo ?? ''] ?? ''}`.trim()
    : 'Salario a convenir'

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="mb-6">
        <div className="flex gap-2 mb-2 flex-wrap">
          {vacante.destacada && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              ⭐ Destacada
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{vacante.titulo}</h2>
        <p className="text-[#1A6B3C] font-semibold mt-1">{empresa}</p>
        <p className="text-gray-500 text-sm mt-1">
          📍 {vacante.ciudad}, {vacante.estado}
          {vacante.colonia_zona ? ` · ${vacante.colonia_zona}` : ''}
        </p>
      </div>

      {/* Botón postular */}
      <button
        onClick={() => setChatAbierto(true)}
        className="w-full bg-[#1A6B3C] hover:bg-[#155c33] text-white font-semibold py-3 px-6 rounded-xl mb-6 transition-colors text-sm"
      >
        💬 Postularme / Iniciar Chat
      </button>

      {chatAbierto && (
        <ChatModal
          vacanteId={vacante.id}
          vacanteTitulo={vacante.titulo}
          reclutadorId={reclutadorId}
          onClose={() => setChatAbierto(false)}
        />
      )}

      {/* Info rápida */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Salario</p>
          <p className="text-sm font-semibold text-gray-800">{salario}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Jornada / Turno</p>
          <p className="text-sm font-semibold text-gray-800">
            {NOMBRES_JORNADA[vacante.jornada] ?? vacante.jornada}{vacante.turno && vacante.turno !== 'no_aplica' ? ` · ${vacante.turno.charAt(0).toUpperCase() + vacante.turno.slice(1)}` : ''}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">Modalidad</p>
          <p className="text-sm font-semibold text-gray-800">{NOMBRES_MODALIDAD[vacante.modalidad] ?? vacante.modalidad}</p>
        </div>
        {vacante.horario && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Horario</p>
            <p className="text-sm font-semibold text-gray-800">{vacante.horario}</p>
          </div>
        )}
        {vacante.tipo_contrato && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Contrato</p>
            <p className="text-sm font-semibold text-gray-800">{vacante.tipo_contrato}</p>
          </div>
        )}
      </div>

      {/* Descripción */}
      {vacante.descripcion && (
        <div className="mb-5">
          <h3 className="font-semibold text-gray-800 mb-2">Descripción</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{vacante.descripcion}</p>
        </div>
      )}

      {/* Requisitos */}
      {vacante.requisitos?.length > 0 && (
        <div className="mb-5">
          <h3 className="font-semibold text-gray-800 mb-2">Requisitos</h3>
          <ul className="space-y-1">
            {vacante.requisitos.map((r, i) => (
              <li key={i} className="text-sm text-gray-600 flex gap-2">
                <span className="text-[#1A6B3C] mt-0.5">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Beneficios */}
      {vacante.beneficios?.length > 0 && (
        <div className="mb-5">
          <h3 className="font-semibold text-gray-800 mb-2">Beneficios</h3>
          <ul className="space-y-1">
            {vacante.beneficios.map((b, i) => (
              <li key={i} className="text-sm text-gray-600 flex gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Logística */}
      {(vacante.tiene_ruta || vacante.estacionamiento || vacante.comedor || vacante.uniforme) && (
        <div className="mb-5">
          <h3 className="font-semibold text-gray-800 mb-2">Logística</h3>
          <div className="flex flex-wrap gap-2">
            {vacante.tiene_ruta && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <p className="text-xs font-semibold text-green-700">🚌 Ruta de transporte</p>
                {vacante.zonas_ruta?.length > 0 && (
                  <p className="text-xs text-green-600 mt-0.5">
                    {vacante.zonas_ruta.join(', ')}
                  </p>
                )}
                {vacante.ruta_para_entrevista && (
                  <p className="text-xs text-green-600">Disponible para entrevista</p>
                )}
                {vacante.negocios?.documentos_negocio && vacante.negocios.documentos_negocio.length > 0 && (
                  <div className="mt-1.5 space-y-0.5">
                    {vacante.negocios.documentos_negocio.map((doc) => (
                      <a
                        key={doc.id}
                        href={doc.archivo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-700 underline block"
                      >
                        📄 {doc.nombre_archivo}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
            {vacante.estacionamiento && (
              <span className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-3 py-2 rounded-lg">
                🅿️ Estacionamiento
              </span>
            )}
            {vacante.comedor && (
              <span className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-3 py-2 rounded-lg">
                🍽️ Comedor
              </span>
            )}
            {vacante.uniforme && (
              <span className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-3 py-2 rounded-lg">
                👕 Uniforme
              </span>
            )}
          </div>
        </div>
      )}

      {/* Letras chiquitas */}
      {vacante.letras_chiquitas && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-semibold text-amber-800 mb-1 text-sm">
            ⚠️ Información importante
          </h3>
          <p className="text-sm text-amber-700 leading-relaxed">
            {vacante.letras_chiquitas}
          </p>
        </div>
      )}
    </div>
  )
}