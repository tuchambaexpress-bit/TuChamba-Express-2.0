import Link from 'next/link'

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
  fecha_publicacion: string
  negocios: { nombre: string } | null
}

interface Props {
  vacante: Vacante
  seleccionada: boolean
  onClick: () => void
}

const NOMBRES_PERIODO: Record<string, string> = {
  semanal: 'sem.', quincenal: 'quinc.', mensual: 'mes', por_hora: 'hora'
}
const NOMBRES_SALARIO_TIPO: Record<string, string> = {
  neto: 'neto', bruto: 'bruto', convenir: 'a convenir', segun_experiencia: 'según experiencia'
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
    ? `$${vacante.salario_min.toLocaleString('es-MX')}${vacante.salario_max ? `–$${vacante.salario_max.toLocaleString('es-MX')}` : ''} ${NOMBRES_SALARIO_TIPO[vacante.salario_tipo ?? ''] ?? ''} / ${NOMBRES_PERIODO[vacante.salario_periodo ?? ''] ?? ''}`.trim()
    : null

  const diasPublicada = Math.floor(
    (Date.now() - new Date(vacante.fecha_publicacion).getTime()) / (1000 * 60 * 60 * 24)
  )
  const publicadaTexto = diasPublicada === 0 ? 'Hoy' : diasPublicada === 1 ? 'Ayer' : `Hace ${diasPublicada} días`

  return (
    // 7.26 — antes era un <div onClick>, invisible para Google (nunca
    // hay un link real a /vacante/[id] en ningún lado del sitio). Ahora
    // es un <Link> real: los rastreadores lo siguen normal, pero al
    // humano el clic izquierdo normal le sigue abriendo el modal de
    // siempre (preventDefault bloquea la navegación de Next.js). Ctrl+clic,
    // clic central, o "abrir en pestaña nueva" siguen funcionando, porque
    // los navegadores no dejan que preventDefault() los bloquee.
    <Link
      href={`/vacante/${vacante.id}`}
      onClick={e => { e.preventDefault(); onClick() }}
      className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
        seleccionada
          ? 'bg-blue-50/60 border-[#0F52BA] ring-1 ring-[#0F52BA]/15'
          : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
      }`}
    >
      {/* Fila superior: badges a la izquierda, fecha a la derecha */}
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex gap-1.5 flex-wrap">
          {vacante.destacada && (
            <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              ⭐ Destacada
            </span>
          )}
          {vacante.prioridad === 'urgente' && (
            <span className="text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
              🔴 Urgente
            </span>
          )}
          {vacante.tiene_ruta && (
            <span className="text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">
              🚌 Con ruta
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{publicadaTexto}</span>
      </div>

      {/* Título y empresa */}
      <h3 className="font-semibold text-gray-900 text-base leading-snug">
        {vacante.titulo}
      </h3>
      <p className="text-[#1A6B3C] text-base font-medium mt-0.5">{empresa}</p>

      {/* Ubicación */}
      <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
        <span>📍</span> {vacante.ciudad}, {vacante.estado}
      </p>

      {/* Salario — destacado, es el dato que más pesa */}
      {salario && (
        <p className="mt-2.5 inline-block text-base font-semibold text-white bg-emerald-600 border border-emerald-600 px-2.5 py-1 rounded-lg">
          {salario}
        </p>
      )}

      {/* Meta: jornada + modalidad, como etiquetas delgadas sin fondo pesado */}
      <div className="flex gap-2 mt-2.5 flex-wrap">
        <span className="text-xs text-gray-700 bg-gray-200 border border-gray-300 px-2 py-1 rounded-md">
          🕐 {NOMBRES_JORNADA[vacante.jornada] ?? vacante.jornada}{vacante.turno && vacante.turno !== 'no_aplica' ? ` · ${vacante.turno.charAt(0).toUpperCase() + vacante.turno.slice(1)}` : ''}
        </span>
        <span className="text-xs text-gray-700 bg-gray-200 border border-gray-300 px-2 py-1 rounded-md">
          🏢 {NOMBRES_MODALIDAD[vacante.modalidad] ?? vacante.modalidad}
        </span>
      </div>
    </Link>
  )
}
