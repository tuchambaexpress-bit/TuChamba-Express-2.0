'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getSemanaISO } from '@/lib/utils'


interface Props {
  postulacion: any
  etapasDisponibles: string[]
  onActualizarEtapa: (postulacionId: string, nuevaEtapa: string) => void
  reclutadorId: string
}

const MOTIVOS_DESCARTE = [
  { value: 'no_cumple_perfil', label: 'No cumple el perfil' },
  { value: 'no_se_presento', label: 'No se presentó a la entrevista' },
  { value: 'rechazo_candidato', label: 'El candidato declinó' },
  { value: 'rechazo_empresa', label: 'La empresa no lo aceptó' },
  { value: 'no_contesta', label: 'No contesta' },
  { value: 'otro', label: 'Otro' },
]

export default function KanbanCard({ postulacion, etapasDisponibles, onActualizarEtapa, reclutadorId }: Props) {
  const [moviendo, setMoviendo] = useState(false)
  const [mostrarMenu, setMostrarMenu] = useState(false)
  const [mostrarModalDescarte, setMostrarModalDescarte] = useState(false)
  const [mostrarModalEntrevista, setMostrarModalEntrevista] = useState(false)
  const [mostrarModalContratado, setMostrarModalContratado] = useState(false)
  const [fechaContratacion, setFechaContratacion] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [comisionCalculada, setComisionCalculada] = useState<number | null>(null)
  const [garantiaFin, setGarantiaFin] = useState<string | null>(null)
  const [score, setScore] = useState<number>(postulacion.score ?? 0)

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMostrarModalDescarte(false)
        setMostrarModalEntrevista(false)
        setMostrarModalContratado(false)
        setMostrarMenu(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  // Estado modal descarte
  const [motivoDescarte, setMotivoDescarte] = useState('')
  const [motivoDetalle, setMotivoDetalle] = useState('')
  const [alcanceDescarte, setAlcanceDescarte] = useState('esta_vacante')
  const [mensajeRetro, setMensajeRetro] = useState('')

  // Estado modal entrevista
  const [fechaEntrevista, setFechaEntrevista] = useState('')
  const [horaEntrevista, setHoraEntrevista] = useState('')
  const [lugarEntrevista, setLugarEntrevista] = useState('')

  const diasEnEtapa = Math.floor(
    (Date.now() - new Date(postulacion.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  const telefono = postulacion.candidatos?.telefono
  const nombre = postulacion.candidatos?.nombre
  const vacante = postulacion.vacantes?.titulo
  const enEntrevista = postulacion.etapa_actual === 'Entrevista'
  const tieneEntrevista = postulacion.fecha_entrevista

  async function cambiarEtapa(nuevaEtapa: string) {
    if (nuevaEtapa === 'Descartado') {
      setMostrarMenu(false)
      setMostrarModalDescarte(true)
      return
    }
    if (nuevaEtapa === 'Contratado') {
      setMostrarMenu(false)
      // Calcular comisión y garantía preview
      const diasGarantia = postulacion.vacantes?.dias_garantia ?? 30
      const comisionBase = postulacion.vacantes?.comision_base_mxn ?? 0
      const tienePromo = postulacion.vacantes?.tiene_promocion ?? false
      const promoFin = postulacion.vacantes?.promocion_fin
      const promoMonto = postulacion.vacantes?.promocion_monto_mxn ?? 0
      const hoy = new Date().toISOString().split('T')[0]
      const monto = tienePromo && promoFin && hoy <= promoFin ? promoMonto : comisionBase
      const fin = new Date()
      fin.setDate(fin.getDate() + diasGarantia)
      setComisionCalculada(monto)
      setGarantiaFin(fin.toISOString().split('T')[0])
      setMostrarModalContratado(true)
      return
    }
    setMostrarMenu(false)
    setMoviendo(true)
    const supabase = createClient()

    await supabase
      .from('postulaciones')
      .update({ etapa_actual: nuevaEtapa, updated_at: new Date().toISOString() })
      .eq('id', postulacion.id)

    await supabase.from('historial_etapas').insert({
      postulacion_id: postulacion.id,
      etapa_anterior: postulacion.etapa_actual,
      etapa_nueva: nuevaEtapa,
      cambiado_por: reclutadorId
    })

    onActualizarEtapa(postulacion.id, nuevaEtapa)
    setMoviendo(false)
  }

  async function confirmarDescarte() {
    if (!motivoDescarte) return
    setMoviendo(true)
    const supabase = createClient()

    await supabase
      .from('postulaciones')
      .update({
        etapa_actual: 'Descartado',
        motivo_descarte: motivoDescarte,
        descartado_por: 'reclutador',
        motivo_descarte_detalle: motivoDetalle || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', postulacion.id)

    await supabase.from('historial_etapas').insert({
      postulacion_id: postulacion.id,
      etapa_anterior: postulacion.etapa_actual,
      etapa_nueva: 'Descartado',
      cambiado_por: reclutadorId,
      nota: motivoDetalle || motivoDescarte
    })

    // Enviar mensaje de retroalimentación al candidato si se escribió
    if (mensajeRetro && postulacion.chats?.[0]?.id) {
      await supabase.from('mensajes').insert({
        chat_id: postulacion.chats[0].id,
        sender_tipo: 'agente',
        sender_nombre: 'Tu Chamba Express',
        texto: mensajeRetro,
        es_sistema: true,
        timestamp: new Date().toISOString()
      })
    }

    onActualizarEtapa(postulacion.id, 'Descartado')
    setMostrarModalDescarte(false)
    setMoviendo(false)
  }

  async function guardarEntrevista() {
    if (!fechaEntrevista || !horaEntrevista) return
    const supabase = createClient()
    const fechaCompleta = new Date(`${fechaEntrevista}T${horaEntrevista}`)

    await supabase
      .from('postulaciones')
      .update({
        fecha_entrevista: fechaCompleta.toISOString(),
        lugar_entrevista: lugarEntrevista || null
      })
      .eq('id', postulacion.id)

    setMostrarModalEntrevista(false)
  }

  async function guardarScore(nuevoScore: number) {
    setScore(nuevoScore)
    const supabase = createClient()
    await supabase
      .from('postulaciones')
      .update({ score: nuevoScore })
      .eq('id', postulacion.id)
  }

  async function confirmarContratado() {
    setMoviendo(true)
    const supabase = createClient()
    const diasGarantia = postulacion.vacantes?.dias_garantia ?? 30
    const fechaFin = new Date(fechaContratacion)
    fechaFin.setDate(fechaFin.getDate() + diasGarantia)

    await supabase
      .from('postulaciones')
      .update({
        etapa_actual: 'Contratado',
        fecha_contratacion: fechaContratacion,
        fecha_garantia_fin: fechaFin.toISOString().split('T')[0],
        comision_aplicable: true,
        comision_aplicada_mxn: comisionCalculada,
        semana_corte: getSemanaISO(),
        updated_at: new Date().toISOString()
      })
      .eq('id', postulacion.id)

    await supabase.from('historial_etapas').insert({
      postulacion_id: postulacion.id,
      etapa_anterior: postulacion.etapa_actual,
      etapa_nueva: 'Contratado',
      cambiado_por: reclutadorId,
      nota: `Contratado. Garantía hasta ${fechaFin.toISOString().split('T')[0]}`
    })

    onActualizarEtapa(postulacion.id, 'Contratado')
    setMostrarModalContratado(false)
    setMoviendo(false)
  }

  function generarLinkWhatsApp() {
    const fecha = tieneEntrevista
      ? new Date(postulacion.fecha_entrevista).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
      : ''
    const hora = tieneEntrevista
      ? new Date(postulacion.fecha_entrevista).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      : ''
    const lugar = postulacion.lugar_entrevista ?? 'las instalaciones de la empresa'

    const mensaje = tieneEntrevista
      ? `Hola ${nombre}, te recordamos que tienes entrevista para ${vacante} el ${fecha} a las ${hora} en ${lugar}. ¿Confirmas tu asistencia?`
      : `Hola ${nombre}, te contactamos de Tu Chamba Express sobre la vacante de ${vacante}. ¿Sigues interesado?`

    return `https://wa.me/52${telefono}?text=${encodeURIComponent(mensaje)}`
  }

  return (
    <>
      <div className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 ${moviendo ? 'opacity-50' : ''}`}>
        {/* Nombre candidato */}
        <p className="font-semibold text-gray-900 text-sm">{nombre}</p>

        {/* Vacante */}
        <p className="text-xs text-[#1A6B3C] mt-0.5">{vacante}</p>

        {/* Fecha entrevista si existe */}
        {tieneEntrevista && (
          <p className="text-xs text-blue-600 mt-1 font-medium">
            📅 {new Date(postulacion.fecha_entrevista).toLocaleDateString('es-MX', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        )}

        {/* Días en etapa */}
        <p className="text-xs text-gray-500 mt-1">
          {diasEnEtapa === 0 ? 'Hoy' : `Hace ${diasEnEtapa} día${diasEnEtapa !== 1 ? 's' : ''}`}
        </p>

        {/* Score 1-5 estrellas */}
        <div className="flex gap-0.5 mt-2">
          {[1,2,3,4,5].map(n => (
            <button
              key={n}
              onClick={() => guardarScore(n)}
              className={`text-lg leading-none ${n <= score ? 'text-yellow-400' : 'text-gray-200'} hover:text-yellow-400 transition-colors`}
            >
              ★
            </button>
          ))}
        </div>

        {/* Botones principales */}
        <div className="flex gap-2 mt-3">
          
            <a href={`/reclutador/chats?chat=${postulacion.chats?.[0]?.id}`}
            className="flex-1 text-center text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 py-1.5 rounded-lg border border-gray-200 transition-colors"
          >
            💬 Chat
          </a>
          <div className="relative">
            <button
              onClick={() => setMostrarMenu(!mostrarMenu)}
              className="text-xs bg-[#1A6B3C] hover:bg-[#155c33] text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Mover ▾
            </button>
            {mostrarMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[160px]">
                {etapasDisponibles
                  .filter(e => e !== postulacion.etapa_actual)
                  .map(etapa => (
                    <button
                      key={etapa}
                      onClick={() => cambiarEtapa(etapa)}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                        etapa === 'Descartado' ? 'text-red-500 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {etapa === 'Descartado' ? '❌ Descartar' : etapa}
                    </button>
                  ))
                }
              </div>
            )}
          </div>
        </div>

        {/* Botones de entrevista — solo en etapa Entrevista */}
        {enEntrevista && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setMostrarModalEntrevista(true)}
              className="flex-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-lg border border-blue-200 transition-colors"
            >
              📅 {tieneEntrevista ? 'Ver entrevista' : 'Agendar'}
            </button>
            
              <a href={generarLinkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs bg-green-50 hover:bg-green-100 text-green-700 py-1.5 rounded-lg border border-green-200 transition-colors"
            >
              📱 WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* Modal de Descarte */}
      {mostrarModalDescarte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-900 mb-1">Descartar candidato</h3>
            <p className="text-sm text-gray-500 mb-4">{nombre} — {vacante}</p>

            {/* Motivo */}
            <p className="text-xs font-medium text-gray-700 mb-2">Razón del descarte *</p>
            <div className="space-y-1.5 mb-4">
              {MOTIVOS_DESCARTE.map(m => (
                <label key={m.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="motivo"
                    value={m.value}
                    checked={motivoDescarte === m.value}
                    onChange={() => setMotivoDescarte(m.value)}
                    className="accent-[#1A6B3C]"
                  />
                  <span className="text-sm text-gray-700">{m.label}</span>
                </label>
              ))}
            </div>

            {motivoDescarte === 'otro' && (
              <input
                type="text"
                placeholder="Especifica el motivo..."
                value={motivoDetalle}
                onChange={e => setMotivoDetalle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
              />
            )}

            {/* Alcance */}
            <p className="text-xs font-medium text-gray-700 mb-2">¿Descartar para?</p>
            <div className="flex gap-3 mb-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="alcance" value="esta_vacante"
                  checked={alcanceDescarte === 'esta_vacante'}
                  onChange={() => setAlcanceDescarte('esta_vacante')}
                  className="accent-[#1A6B3C]"
                />
                <span className="text-xs text-gray-700">Solo esta vacante</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="alcance" value="todas"
                  checked={alcanceDescarte === 'todas'}
                  onChange={() => setAlcanceDescarte('todas')}
                  className="accent-[#1A6B3C]"
                />
                <span className="text-xs text-gray-700">Todas las vacantes</span>
              </label>
            </div>

            {/* Retroalimentación opcional */}
            <p className="text-xs font-medium text-gray-700 mb-1">Mensaje al candidato (opcional)</p>
            <textarea
              placeholder="Ej. Gracias por tu interés, en esta ocasión no continúas en el proceso..."
              value={mensajeRetro}
              onChange={e => setMensajeRetro(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] resize-none"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setMostrarModalDescarte(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDescarte}
                disabled={!motivoDescarte}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-medium"
              >
                Descartar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Contratado */}
      {mostrarModalContratado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-900 mb-1">🎉 Confirmar contratación</h3>
            <p className="text-sm text-gray-500 mb-4">{nombre} — {vacante}</p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Fecha de contratación *</label>
                <input
                  type="date"
                  value={fechaContratacion}
                  onChange={e => {
                    setFechaContratacion(e.target.value)
                    const diasGarantia = postulacion.vacantes?.dias_garantia ?? 30
                    const fin = new Date(e.target.value)
                    fin.setDate(fin.getDate() + diasGarantia)
                    setGarantiaFin(fin.toISOString().split('T')[0])
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
              </div>
            </div>

            {/* Resumen */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 space-y-1">
              <p className="text-xs text-green-700">
                <span className="font-semibold">Días de garantía:</span> {postulacion.vacantes?.dias_garantia ?? 30} días
              </p>
              <p className="text-xs text-green-700">
                <span className="font-semibold">Garantía cumple:</span> {garantiaFin ? new Date(garantiaFin).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
              </p>
              <p className="text-xs text-green-700 text-lg font-bold">
                <span className="font-semibold">Tu comisión:</span> ${comisionCalculada?.toLocaleString('es-MX')} MXN
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMostrarModalContratado(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarContratado}
                className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] text-white py-2.5 rounded-xl text-sm font-medium"
              >
                ✅ Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Entrevista */}
      {mostrarModalEntrevista && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-900 mb-1">Agendar entrevista</h3>
            <p className="text-sm text-gray-500 mb-4">{nombre} — {vacante}</p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Fecha *</label>
                <input type="date" value={fechaEntrevista}
                  onChange={e => setFechaEntrevista(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Hora *</label>
                <input type="time" value={horaEntrevista}
                  onChange={e => setHoraEntrevista(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Lugar o dirección</label>
                <input type="text" value={lugarEntrevista}
                  onChange={e => setLugarEntrevista(e.target.value)}
                  placeholder="Ej. Av. Constitución 100, Col. Centro"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setMostrarModalEntrevista(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEntrevista}
                disabled={!fechaEntrevista || !horaEntrevista}
                className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-medium"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}