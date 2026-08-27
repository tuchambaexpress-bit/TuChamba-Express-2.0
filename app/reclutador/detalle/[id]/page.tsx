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

export default async function FichaVacante({ params, searchParams }: Props) {
  const origen = searchParams?.from === 'vacantes'
    ? { href: '/reclutador/vacantes', label: '← Vacantes' }
    : { href: '/reclutador/pipeline', label: '← Pipeline' }
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: vacante } = await supabase
    .from('vacantes')
    .select(`
      id, titulo, descripcion, requisitos, beneficios,
      letras_chiquitas, salario_min, salario_max, salario_tipo,
      salario_visible, ciudad, estado, colonia_zona,
      modalidad, jornada, horario, tipo_contrato, turno, salario_periodo, turno,
      tiene_ruta, ruta_para_entrevista,
      estacionamiento, comedor, uniforme,
      empresa_visible, destacada, status, prioridad,
      dias_garantia, dias_induccion, induccion_dentro_garantia,
      comision_base_mxn, tiene_promocion, promocion_monto_mxn, promocion_fin,
      contacto_rrhh, contacto_rrhh_telefono, contacto_rrhh_horario,
      punto_reunion, documentos_requeridos, guion_candidato, comentarios_salario,
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

  // El reclutador siempre ve el salario real (salario_visible solo aplica
  // al portal público de candidatos, no a la ficha operativa interna).
  const salario = vacante.salario_min
    ? `$${vacante.salario_min.toLocaleString('es-MX')}${vacante.salario_max ? ` - $${vacante.salario_max.toLocaleString('es-MX')}` : ''} ${vacante.salario_tipo ?? ''} ${vacante.salario_periodo ?? ''}`
    : 'A convenir'

  const TURNOS: Record<string, string> = {
    matutino: 'Matutino', vespertino: 'Vespertino', nocturno: 'Nocturno', rotativo: 'Rotativo',
  }
  const NOMBRES_DIA_CORTO: Record<number, string> = {
    0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb',
  }

  const hoy = new Date().toISOString().split('T')[0]
  const tienePromoActiva = vacante.tiene_promocion && vacante.promocion_fin && hoy <= vacante.promocion_fin
  const comisionFinal = tienePromoActiva ? vacante.promocion_monto_mxn : vacante.comision_base_mxn

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A6B3C] px-6 py-4 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-xl">Tu Chamba Express</h1>
            <p className="text-green-200 text-sm">Ficha operativa</p>
          </div>
          <Link href={origen.href} className="text-green-200 hover:text-white text-sm">
            {origen.label}
          </Link>
        </div>
      </header>

    <div className="max-w-5xl mx-auto px-4 py-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Encabezado */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">{vacante.titulo}</h2>
          <p className="text-[#1A6B3C] font-semibold mt-1">{empresa}</p>
          <p className="text-gray-500 text-sm mt-1">📍 {vacante.ciudad}, {vacante.estado}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">{vacante.jornada}</span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">{vacante.modalidad}</span>
            <span className={`text-xs px-2 py-1 rounded-lg font-medium ${vacante.status === 'vigente' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {vacante.status}
            </span>
            {vacante.prioridad && vacante.prioridad !== 'normal' && (
              <span className={`text-xs px-2 py-1 rounded-lg font-medium ${vacante.prioridad === 'urgente' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                {vacante.prioridad === 'urgente' ? '🔴 Urgente' : '🟠 Alta'}
              </span>
            )}
          </div>
        </div>

        {/* Comisión — lo más importante para el reclutador */}
        <div className={`rounded-2xl p-5 shadow-sm ${tienePromoActiva ? 'bg-amber-50 border border-amber-200' : 'bg-white'}`}>
          <h3 className="font-bold text-gray-900 mb-3">
            💰 Tu comisión {tienePromoActiva ? '🔥 ¡Bono activo!' : ''}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Comisión base</p>
              <p className="text-lg font-bold text-gray-900">${vacante.comision_base_mxn?.toLocaleString('es-MX')} MXN</p>
            </div>
            {tienePromoActiva && (
              <div>
                <p className="text-xs text-amber-600">🔥 Bono especial</p>
                <p className="text-lg font-bold text-amber-700">${vacante.promocion_monto_mxn?.toLocaleString('es-MX')} MXN</p>
                <p className="text-xs text-amber-600">Válido hasta {new Date(vacante.promocion_fin!).toLocaleDateString('es-MX')}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Días de garantía</p>
              <p className="text-base font-bold text-gray-900">{vacante.dias_garantia} días</p>
            </div>
            {vacante.dias_induccion > 0 && (
              <div>
                <p className="text-xs text-gray-500">Días de inducción</p>
                <p className="text-base font-bold text-gray-900">
                  {vacante.dias_induccion} días
                  <span className="text-xs font-normal text-gray-400 ml-1">
                    ({vacante.induccion_dentro_garantia ? 'dentro de garantía' : 'antes de garantía'})
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
            <p className="text-sm text-green-700 font-medium">
              ✅ Cobras ${comisionFinal?.toLocaleString('es-MX')} MXN cuando el candidato cumple {vacante.induccion_dentro_garantia ? vacante.dias_garantia : (vacante.dias_garantia + (vacante.dias_induccion ?? 0))} días
            </p>
          </div>
        </div>

        {/* Salario del candidato */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">💵 Salario del candidato</h3>
          <p className="text-lg font-bold text-gray-900">{salario}</p>
          {vacante.comentarios_salario && (
            <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              <p className="text-xs text-blue-700">💬 {vacante.comentarios_salario}</p>
            </div>
          )}
        </div>

        {/* Horario y turno */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">🕐 Horario y turno</h3>
          {vacante.turno && TURNOS[vacante.turno] && <p className="text-sm text-gray-500 mt-1">🔄 Turno {TURNOS[vacante.turno]}</p>}
          {vacante.horario && <p className="text-sm text-gray-500 mt-1">🕐 {vacante.horario}</p>}
          {vacante.tipo_contrato && <p className="text-sm text-gray-500 mt-1">📋 {vacante.tipo_contrato}</p>}
          {!vacante.turno && !vacante.horario && !vacante.tipo_contrato && (
            <p className="text-sm text-gray-400">Sin información adicional de horario.</p>
          )}
        </div>

        {/* Qué decirle al candidato (CA-09.2) */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-blue-900 mb-2">💬 Qué decirle al candidato</h3>
          <p className="text-sm text-blue-800 whitespace-pre-line">
            {vacante.guion_candidato ?? 'El coordinador aún no ha agregado instrucciones específicas para esta vacante.'}
          </p>
          <div className="inline-flex items-center gap-1.5 bg-white rounded-lg px-3 py-1.5 mt-3">
            <p className="text-xs text-gray-500">Requerimiento:</p>
            <p className="text-sm font-bold text-gray-900">{cupoOcupado ?? 0}/{vacante.cupo_requerido ?? 1}</p>
          </div>
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
        </div>

        {/* Documentos requeridos */}
        {vacante.documentos_requeridos?.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">📄 Documentos que debe llevar</h3>
            <ul className="space-y-1">
              {vacante.documentos_requeridos.map((d: string, i: number) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-[#1A6B3C]">•</span>{d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contacto RRHH */}
        {vacante.contacto_rrhh && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">📞 Contacto RRHH</h3>
            <p className="text-sm font-medium text-gray-800">{vacante.contacto_rrhh}</p>
            {vacante.contacto_rrhh_telefono && (
              <p className="text-sm text-gray-500 mt-1">📱 {vacante.contacto_rrhh_telefono}</p>
            )}
            {vacante.contacto_rrhh_horario && (
              <p className="text-sm text-gray-500 mt-1">🕐 {vacante.contacto_rrhh_horario}</p>
            )}
          </div>
        )}

        {/* Requisitos */}
        {vacante.requisitos?.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">✅ Requisitos</h3>
            <ul className="space-y-1">
              {vacante.requisitos.map((r: string, i: number) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-[#1A6B3C]">•</span>{r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Beneficios */}
        {vacante.beneficios?.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">🎁 Beneficios</h3>
            <ul className="space-y-1">
              {vacante.beneficios.map((b: string, i: number) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-green-500">✓</span>{b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Logística */}
        {(vacante.tiene_ruta || vacante.estacionamiento || vacante.comedor || vacante.uniforme || (vacante.negocios as any)?.ubicacion_maps) && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">🚌 Logística</h3>
            <div className="flex flex-wrap gap-2">
              {vacante.tiene_ruta && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2">
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

        {/* Letras chiquitas */}
        {vacante.letras_chiquitas && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-amber-800 mb-2">⚠️ Información importante</h3>
            <p className="text-sm text-amber-700">{vacante.letras_chiquitas}</p>
          </div>
        )}

        {/* 4.14/4.15 — Agente FAQ (3 niveles: campo estructurado, FAQ guardado, escalación) */}
        <div className="md:col-span-2">
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
  </div>
  )
}