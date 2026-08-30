import { createClient as createServerClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import FaqWidget from '@/components/reclutador/FaqWidget'
import RutasColapsables from '@/components/shared/RutasColapsables'

export const revalidate = 0 // nunca cachear — siempre datos frescos de Supabase

interface Props {
  params: { id: string }
  searchParams: { from?: string }
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
const TURNOS: Record<string, string> = {
  matutino: 'Matutino', vespertino: 'Vespertino', nocturno: 'Nocturno', rotativo: 'Rotativo',
}
const NOMBRES_DIA_CORTO: Record<number, string> = {
  0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb',
}

export default async function FichaVacante({ params, searchParams }: Props) {
  const origen = searchParams?.from === 'vacantes'
    ? { href: '/reclutador/vacantes', label: '← Vacantes' }
    : { href: '/reclutador/pipeline', label: '← Pipeline' }
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Mismas 8 secciones que VacanteModal (coordinador) — hoy toda esta
  // información vive repartida, aquí se agrupa igual para que sea fácil
  // saber "esto viene de la Sección N" (José, 2026-08-29). Se agregó
  // `tags` (Sección 4, Etiquetas) — se traía en ningún lugar antes.
  const { data: vacante } = await supabase
    .from('vacantes')
    .select(`
      id, titulo, descripcion, requisitos, beneficios, tags,
      letras_chiquitas, salario_min, salario_max, salario_tipo,
      salario_visible, ciudad, estado, colonia_zona,
      modalidad, jornada, horario, tipo_contrato, turno, salario_periodo,
      tiene_ruta, ruta_para_entrevista,
      estacionamiento, comedor, uniforme,
      empresa_visible, destacada, status, prioridad,
      dias_garantia, dias_induccion, induccion_dentro_garantia,
      comision_base_mxn, tiene_promocion, promocion_descripcion, promocion_monto_mxn, promocion_fin,
      contacto_rrhh, contacto_rrhh_telefono, contacto_rrhh_horario,
      punto_reunion, documentos_requeridos, guion_candidato, comentarios_salario,
      requiere_examen_medico, requiere_antidoping, requiere_estudio_socioeconomico,
      cupo_requerido, cupo_desde, agencia_id,
      negocios(nombre, dias_entrevista, ubicacion_maps, rutas, documentos_negocio(id, nombre_archivo, archivo_url))
    `)
    .eq('id', params.id)
    .single()

  if (!vacante) notFound()

  // HU-16 (6.8b): mismo criterio "por rondas" ya usado en el resto —
  // solo cuenta desde la última reactivación (cupo_desde).
  const cupoDesde = (vacante.cupo_desde ?? '1970-01-01').split('T')[0]
  const { count: cupoOcupado } = await supabase
    .from('postulaciones')
    .select('*', { count: 'exact', head: true })
    .eq('vacante_id', params.id)
    .eq('comision_aplicable', true)
    .gte('fecha_contratacion', cupoDesde)

  const empresa = vacante.empresa_visible
    ? (vacante.negocios as any)?.nombre ?? 'Empresa'
    : 'Empresa Confidencial'

  const salario = vacante.salario_min
    ? `$${vacante.salario_min.toLocaleString('es-MX')}${vacante.salario_max ? ` - $${vacante.salario_max.toLocaleString('es-MX')}` : ''} ${NOMBRES_SALARIO_TIPO[vacante.salario_tipo ?? ''] ?? vacante.salario_tipo ?? ''} ${vacante.salario_periodo ?? ''}`
    : 'A convenir'

  const hoy = new Date().toISOString().split('T')[0]
  const tienePromoActiva = vacante.tiene_promocion && vacante.promocion_fin && hoy <= vacante.promocion_fin
  const comisionFinal = tienePromoActiva ? vacante.promocion_monto_mxn : vacante.comision_base_mxn

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-[#1A6B3C] px-6 py-4 shadow-md flex-shrink-0">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">{vacante.titulo}</h1>
            <p className="text-green-200 text-sm">{empresa} · Ficha operativa</p>
          </div>
          <Link href={origen.href} className="text-green-200 hover:text-white text-sm">
            {origen.label}
          </Link>
        </div>
      </header>

      {/* 3 columnas, cada una con su propio scroll vertical independiente
          — sin sticky/fixed (falló en el entorno de José hoy, 7.44). El
          scroll de cada columna es normal, nativo, sin trucos de CSS. */}
      <div className="flex-1 min-h-0 max-w-[1700px] w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">

        {/* Columna 1 — Secciones 1, 2, 3 */}
        <div className="overflow-y-auto space-y-4 pr-1">

          {/* Sección 1 — Identidad */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Sección 1 — Identidad</p>
            <h2 className="text-lg font-bold text-gray-900">{vacante.titulo}</h2>
            <p className="text-[#1A6B3C] font-semibold mt-1">{empresa}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded-lg font-medium ${vacante.status === 'vigente' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {vacante.status}
              </span>
              {vacante.prioridad && vacante.prioridad !== 'normal' && (
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${vacante.prioridad === 'urgente' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                  {vacante.prioridad === 'urgente' ? '🔴 Urgente' : '🟠 Alta'}
                </span>
              )}
              {vacante.destacada && (
                <span className="text-xs px-2 py-1 rounded-lg font-medium bg-amber-100 text-amber-700">⭐ Destacada</span>
              )}
              <span className="text-xs px-2 py-1 rounded-lg font-medium bg-gray-100 text-gray-600">
                {vacante.empresa_visible ? '👁️ Empresa visible al candidato' : '🙈 Empresa oculta (Confidencial)'}
              </span>
            </div>
          </div>

          {/* Sección 2 — Ubicación y modalidad */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Sección 2 — Ubicación y modalidad</p>
            <p className="text-sm text-gray-700 mt-1">
              📍 {vacante.ciudad}, {vacante.estado}{vacante.colonia_zona ? ` · ${vacante.colonia_zona}` : ''}
            </p>
            <p className="text-sm text-gray-700 mt-1">🏢 {NOMBRES_MODALIDAD[vacante.modalidad] ?? vacante.modalidad}</p>
          </div>

          {/* Sección 3 — Condiciones laborales */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Sección 3 — Condiciones laborales</p>
            <p className="text-lg font-bold text-gray-900 mt-1">💵 {salario}</p>
            <p className="text-[10px] text-gray-400 mb-2">
              {vacante.salario_visible ? '👁️ Visible al candidato' : '🙈 Oculto — candidato ve "A convenir"'}
            </p>
            {vacante.comentarios_salario && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-2">
                <p className="text-xs text-blue-700">💬 {vacante.comentarios_salario}</p>
              </div>
            )}
            <p className="text-sm text-gray-700 mt-2">🕐 {NOMBRES_JORNADA[vacante.jornada] ?? vacante.jornada}</p>
            {vacante.turno && TURNOS[vacante.turno] && <p className="text-sm text-gray-700 mt-1">🔄 Turno {TURNOS[vacante.turno]}</p>}
            {vacante.horario && <p className="text-sm text-gray-700 mt-1">🕐 {vacante.horario}</p>}
            {vacante.tipo_contrato && <p className="text-sm text-gray-700 mt-1">📋 {vacante.tipo_contrato}</p>}
          </div>

          {/* Secciones 6 + 8 (avisos) — fusionadas en un solo recuadro
              amarillo (José, 2026-08-29: "para que se vean como en el
              portal de vacantes") — mismo patrón que ya usa
              VacanteDetalle.tsx del lado del candidato: letras chiquitas
              + avisos médicos juntos en un solo bloque. Movida a Columna
              1, justo debajo de Sección 3 (pedido de José). */}
          {(vacante.letras_chiquitas || vacante.requiere_examen_medico || vacante.requiere_antidoping || vacante.requiere_estudio_socioeconomico) && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide mb-1">Información importante</p>
              {vacante.letras_chiquitas && (
                <p className="text-sm text-amber-700 mt-1">⚠️ {vacante.letras_chiquitas}</p>
              )}
              {vacante.requiere_examen_medico && <p className="text-sm text-amber-700 mt-1">🩺 Se realizará examen médico.</p>}
              {vacante.requiere_antidoping && <p className="text-sm text-amber-700 mt-1">🧪 Se realizará prueba antidoping.</p>}
              {vacante.requiere_estudio_socioeconomico && <p className="text-sm text-amber-700 mt-1">🏠 Se realizará estudio socioeconómico.</p>}
            </div>
          )}

        </div>

        {/* Columna 2 — Secciones 4, 5 */}
        <div className="overflow-y-auto space-y-4 pr-1">

          {/* Sección 4 — Descripción operativa (José, 2026-08-29: dividida
              en 3 tarjetas separadas — Descripción / Requisitos /
              Beneficios — en vez de una sola. Etiquetas (tags) quitadas
              de la vista, ya no se muestran.) */}
          {vacante.descripcion && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Sección 4 — Descripción del puesto</p>
              <p className="text-sm text-gray-600 leading-relaxed mt-1">{vacante.descripcion}</p>
            </div>
          )}

          {vacante.requisitos?.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-700 mb-2">✅ Requisitos</p>
              <ul className="space-y-1">
                {vacante.requisitos.map((r: string, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-[#1A6B3C]">•</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {vacante.beneficios?.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-700 mb-2">🎁 Beneficios</p>
              <ul className="space-y-1">
                {vacante.beneficios.map((b: string, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-green-500">✓</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sección 5 — Logística especial */}
          {(vacante.tiene_ruta || vacante.estacionamiento || vacante.comedor || vacante.uniforme || (vacante.negocios as any)?.ubicacion_maps) && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Sección 5 — Logística especial</p>
              <div className="flex flex-wrap gap-2">
                {vacante.tiene_ruta && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 w-full">
                    <p className="text-xs font-semibold text-green-700">🚌 Ruta de transporte</p>
                    {(vacante.negocios as any)?.rutas?.length > 0 && (
                      <RutasColapsables rutas={(vacante.negocios as any).rutas} />
                    )}
                    {vacante.ruta_para_entrevista && (
                      <p className="text-xs text-green-600 underline mt-0.5">✅ Disponible para ir a la entrevista</p>
                    )}
                    {(vacante.negocios as any)?.documentos_negocio?.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-green-200 space-y-0.5">
                        <p className="text-xs font-semibold text-green-700 mb-0.5">📎 Documentos de la ruta</p>
                        {(vacante.negocios as any).documentos_negocio.map((doc: any) => (
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
                {vacante.estacionamiento && <span className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-3 py-2 rounded-xl">🅿️ Estacionamiento</span>}
                {vacante.comedor && <span className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-3 py-2 rounded-xl">🍽️ Comedor</span>}
                {vacante.uniforme && <span className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-3 py-2 rounded-xl">👕 Uniforme</span>}
                {(vacante.negocios as any)?.ubicacion_maps && (
                  <a
                    href={(vacante.negocios as any).ubicacion_maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 flex flex-col hover:bg-blue-100 transition-colors"
                  >
                    <p className="text-xs font-semibold text-blue-700">📍 Ubicación de la empresa</p>
                    <span className="text-xs text-blue-600 underline">Abrir en Google Maps</span>
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Columna 3 — Secciones 7, 8 */}
        <div className="overflow-y-auto space-y-4 pr-1">

          {/* Sección 7 — Parámetros de reclutamiento */}
          <div className={`rounded-2xl p-5 shadow-sm ${tienePromoActiva ? 'bg-amber-50 border border-amber-200' : 'bg-white'}`}>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
              Sección 7 — Parámetros de reclutamiento {tienePromoActiva ? '🔥' : ''}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <p className="text-xs text-gray-500">Comisión base</p>
                <p className="text-lg font-bold text-gray-900">${vacante.comision_base_mxn?.toLocaleString('es-MX')} MXN</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Días de garantía</p>
                <p className="text-base font-bold text-gray-900">{vacante.dias_garantia} días</p>
              </div>
              {vacante.dias_induccion > 0 && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Días de inducción</p>
                  <p className="text-base font-bold text-gray-900">
                    {vacante.dias_induccion} días
                    <span className="text-xs font-normal text-gray-400 ml-1">
                      ({vacante.induccion_dentro_garantia ? 'dentro de garantía' : 'antes de garantía'})
                    </span>
                  </p>
                </div>
              )}
              {tienePromoActiva && (
                <div className="col-span-2">
                  <p className="text-xs text-amber-600">🔥 Bono especial</p>
                  <p className="text-lg font-bold text-amber-700">${vacante.promocion_monto_mxn?.toLocaleString('es-MX')} MXN</p>
                  <p className="text-xs text-amber-600">Válido hasta {new Date(vacante.promocion_fin!).toLocaleDateString('es-MX')}</p>
                  {vacante.promocion_descripcion && (
                    <p className="text-xs text-amber-600 mt-0.5">{vacante.promocion_descripcion}</p>
                  )}
                </div>
              )}
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Requerimiento (cupo)</p>
                <p className="text-base font-bold text-gray-900">{cupoOcupado ?? 0}/{vacante.cupo_requerido ?? 1}</p>
              </div>
            </div>
            <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-sm text-green-700 font-medium">
                ✅ Cobras ${comisionFinal?.toLocaleString('es-MX')} MXN cuando el candidato cumple {vacante.induccion_dentro_garantia ? vacante.dias_garantia : (vacante.dias_garantia + (vacante.dias_induccion ?? 0))} días
              </p>
            </div>
          </div>

          {/* Sección 8 — Proceso de selección */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide mb-1">Sección 8 — Proceso de selección</p>
            <p className="text-sm text-blue-800 whitespace-pre-line mt-1">
              {vacante.guion_candidato ?? 'El coordinador aún no ha agregado instrucciones específicas para esta vacante.'}
            </p>

            {vacante.punto_reunion && (
              <div className="mt-3 bg-white rounded-xl p-3">
                <p className="text-xs text-gray-500">Punto de reunión / entrevista</p>
                <p className="text-sm font-medium text-gray-800">{vacante.punto_reunion}</p>
              </div>
            )}

            {(vacante.negocios as any)?.dias_entrevista?.length > 0 && (
              <div className="mt-3 bg-white rounded-xl p-3">
                <p className="text-xs text-gray-500">📅 Días de entrevista de la empresa</p>
                <p className="text-sm font-medium text-gray-800">
                  {(vacante.negocios as any).dias_entrevista.sort().map((d: number) => NOMBRES_DIA_CORTO[d]).join(', ')}
                </p>
              </div>
            )}

            {vacante.documentos_requeridos?.length > 0 && (
              <div className="mt-3 bg-white rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">📄 Documentos que debe llevar</p>
                <ul className="space-y-0.5">
                  {vacante.documentos_requeridos.map((d: string, i: number) => (
                    <li key={i} className="text-xs text-gray-700 flex gap-1">
                      <span className="text-[#1A6B3C]">•</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {vacante.contacto_rrhh && (
              <div className="mt-3 bg-white rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">📞 Contacto RRHH</p>
                <p className="text-sm font-medium text-gray-800">{vacante.contacto_rrhh}</p>
                {vacante.contacto_rrhh_telefono && <p className="text-xs text-gray-500 mt-0.5">📱 {vacante.contacto_rrhh_telefono}</p>}
                {vacante.contacto_rrhh_horario && <p className="text-xs text-gray-500 mt-0.5">🕐 {vacante.contacto_rrhh_horario}</p>}
              </div>
            )}
          </div>

          {/* Sección 9 — Proceso de reclutamiento: pausada (7.38), sin
              construir todavía. Se deja el espacio anotado a propósito. */}
          <div className="bg-gray-100 border border-dashed border-gray-300 rounded-2xl p-5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Sección 9 — Proceso de reclutamiento</p>
            <p className="text-xs text-gray-400 mt-1">Pendiente de construir (7.38) — catálogo de puntos de reclutamiento.</p>
          </div>

          <FaqWidget
            vacanteId={vacante.id}
            agenciaId={vacante.agencia_id}
            vacante={{
              status: vacante.status,
              tiene_ruta: vacante.tiene_ruta,
              rutas: (vacante.negocios as any)?.rutas ?? [],
              ruta_para_entrevista: vacante.ruta_para_entrevista,
              estacionamiento: vacante.estacionamiento,
              comedor: vacante.comedor,
              uniforme: vacante.uniforme,
              horario: vacante.horario,
              turno: vacante.turno,
              dias_garantia: vacante.dias_garantia,
              comision_base_mxn: vacante.comision_base_mxn,
              punto_reunion: vacante.punto_reunion,
              dias_entrevista: (vacante.negocios as any)?.dias_entrevista ?? [],
            }}
          />

        </div>

      </div>
    </div>
  )
}
