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
  prioridad: string
  status: string
  created_at: string
  negocios: { nombre: string } | null
}

interface Props {
  vacante: Vacante
  seleccionada: boolean
  onClick: () => void
}

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

export default function VacanteCard({ vacante, seleccionada, onClick }: Props) {
  const empresa = vacante.empresa_visible
    ? vacante.negocios?.nombre ?? 'Empresa'
    : 'Empresa Confidencial'

  const salario = vacante.salario_visible && vacante.salario_min
    ? `$${vacante.salario_min.toLocaleString('es-MX')}${vacante.salario_max ? ` - $${vacante.salario_max.toLocaleString('es-MX')}` : ''} ${NOMBRES_SALARIO_TIPO[vacante.salario_tipo ?? ''] ?? vacante.salario_tipo ?? ''} ${NOMBRES_PERIODO[vacante.salario_periodo ?? ''] ?? ''}`.trim()
    : null

  const diasPublicada = Math.floor(
    (Date.now() - new Date(vacante.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${
        seleccionada ? 'bg-blue-50 border-l-4 border-l-[#0F52BA]' : ''
      }`}
    >
      {/* Badges */}
      <div className="flex gap-2 mb-1 flex-wrap">
        {vacante.destacada && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
            ⭐ Destacada
          </span>
        )}
        {vacante.tiene_ruta && (
          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium">
            🚌 Con ruta
          </span>
        )}
      </div>

      {/* Título y empresa */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-base leading-tight">
          {vacante.titulo}
        </h3>
        {vacante.prioridad === 'urgente' && (
          <span className="flex-shrink-0 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
            🔴 Urgente
          </span>
        )}
      </div>
      <p className="text-[#1A6B3C] text-sm font-medium mt-0.5">{empresa}</p>

      {/* Ubicación */}
      <p className="text-gray-500 text-sm mt-1">
        📍 {vacante.ciudad}, {vacante.estado}
      </p>

      {/* Salario y jornada */}
      <div className="flex gap-3 mt-2 flex-wrap">
        {salario && (
          <span className="text-xs text-gray-700 bg-gray-200 px-2 py-0.5 rounded">
            💰 {salario}
          </span>
        )}
        <span className="text-xs text-gray-700 bg-gray-200 px-2 py-0.5 rounded">
          🕐 {NOMBRES_JORNADA[vacante.jornada] ?? vacante.jornada}{vacante.turno && vacante.turno !== 'no_aplica' ? ` · ${vacante.turno.charAt(0).toUpperCase() + vacante.turno.slice(1)}` : ''}
        </span>
        <span className="text-xs text-gray-700 bg-gray-200 px-2 py-0.5 rounded">
          🏢 {NOMBRES_MODALIDAD[vacante.modalidad] ?? vacante.modalidad}
        </span>
      </div>

      {/* Días publicada */}
      <p className="text-gray-500 text-xs mt-2">
        {diasPublicada === 0 ? 'Hoy' : `Hace ${diasPublicada} día${diasPublicada !== 1 ? 's' : ''}`}
      </p>
    </div>
  )
}