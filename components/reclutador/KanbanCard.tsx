'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getSemanaISO, calcularGarantiaFinHabil } from '@/lib/utils'


interface Props {
  postulacion: any
  etapasDisponibles: string[]
  onActualizarEtapa: (postulacionId: string, nuevaEtapa: string) => void
  reclutadorId: string
  tieneHistorialPrevio?: boolean
}

const MOTIVOS_DESCARTE = [
  { value: 'no_cumple_perfil', label: 'No cumple el perfil' },
  { value: 'no_se_presento', label: 'No se presentó a la entrevista' },
  { value: 'rechazo_candidato', label: 'El candidato declinó' },
  { value: 'rechazo_empresa', label: 'La empresa no lo aceptó' },
  { value: 'no_contesta', label: 'No contesta' },
  { value: 'otro', label: 'Otro' },
]

export default function KanbanCard({ postulacion, etapasDisponibles, onActualizarEtapa, reclutadorId, tieneHistorialPrevio }: Props) {
  const [moviendo, setMoviendo] = useState(false)
  const [mostrarMenu, setMostrarMenu] = useState(false)
  const [mostrarModalDescarte, setMostrarModalDescarte] = useState(false)
  const [mostrarModalEntrevista, setMostrarModalEntrevista] = useState(false)
  const [mostrarModalInduccion, setMostrarModalInduccion] = useState(false)
  const [fechaInduccion, setFechaInduccion] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [mostrarModalFirmaContrato, setMostrarModalFirmaContrato] = useState(false)
  const [fechaFirmaContrato, setFechaFirmaContrato] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [comisionCalculada, setComisionCalculada] = useState<number | null>(null)
  const [garantiaFin, setGarantiaFin] = useState<string | null>(null)
  const [score, setScore] = useState<number>(postulacion.score ?? 0)
  const [mostrarModalDocumentos, setMostrarModalDocumentos] = useState(false)
  const [documentos, setDocumentos] = useState<any[]>([])
  const [cargandoDocs, setCargandoDocs] = useState(false)
  const [tipoDocumento, setTipoDocumento] = useState('cv')
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null)
  const [subiendoDoc, setSubiendoDoc] = useState(false)
  const [errorDoc, setErrorDoc] = useState('')
  const [fileInputKey, setFileInputKey] = useState(0)
  const [eliminandoDoc, setEliminandoDoc] = useState<string | null>(null)

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMostrarModalDescarte(false)
        setMostrarModalEntrevista(false)
        setMostrarModalInduccion(false)
        setMostrarModalFirmaContrato(false)
        setMostrarMenu(false)
        if (mostrarModalDocumentos) cerrarModalDocumentos()
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [mostrarModalDocumentos])

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
    if (nuevaEtapa === 'Inducción') {
      setMostrarMenu(false)
      // Calcular comisión y garantía preview (CA-02.8: se fija aquí, no en Contratado)
      const diasGarantia = postulacion.vacantes?.dias_garantia ?? 30
      const comisionBase = postulacion.vacantes?.comision_base_mxn ?? 0
      const tienePromo = postulacion.vacantes?.tiene_promocion ?? false
      const promoFin = postulacion.vacantes?.promocion_fin
      const promoMonto = postulacion.vacantes?.promocion_monto_mxn ?? 0
      const diasDescanso = postulacion.vacantes?.negocios?.dias_descanso ?? [0]
      const hoy = new Date().toISOString().split('T')[0]
      const monto = tienePromo && promoFin && hoy <= promoFin ? promoMonto : comisionBase
      setComisionCalculada(monto)
      setGarantiaFin(calcularGarantiaFinHabil(fechaInduccion, diasGarantia, diasDescanso))
      setMostrarModalInduccion(true)
      return
    }
    if (nuevaEtapa === 'Contratado') {
      setMostrarMenu(false)
      setMostrarModalFirmaContrato(true)
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

  async function descartarUnaPostulacion(postulacionId: string, etapaAnterior: string, nota: string) {
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
      .eq('id', postulacionId)

    await supabase.from('historial_etapas').insert({
      postulacion_id: postulacionId,
      etapa_anterior: etapaAnterior,
      etapa_nueva: 'Descartado',
      cambiado_por: reclutadorId,
      nota
    })
  }

  async function confirmarDescarte() {
    if (!motivoDescarte) return
    setMoviendo(true)
    const supabase = createClient()

    // Descarte de la postulación activa (siempre ocurre)
    await descartarUnaPostulacion(
      postulacion.id,
      postulacion.etapa_actual,
      motivoDetalle || motivoDescarte
    )

    // Alcance "todas las vacantes": cerrar el resto de postulaciones activas
    // del mismo candidato en esta agencia (CA-13.1, Decisión A — no toca candidatos.vetado)
    if (alcanceDescarte === 'todas') {
      const { data: otras } = await supabase
        .from('postulaciones')
        .select('id, etapa_actual')
        .eq('candidato_id', postulacion.candidato_id)
        .eq('agencia_id', postulacion.agencia_id)
        .neq('id', postulacion.id)
        .not('etapa_actual', 'in', '("Descartado","Contratado")')

      for (const p of otras ?? []) {
        await descartarUnaPostulacion(
          p.id,
          p.etapa_actual,
          `${motivoDetalle || motivoDescarte} (descarte masivo desde ${vacante})`
        )
      }
    }

    // Enviar mensaje de retroalimentación al candidato si se escribió (CA-10.3)
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

    // Cerrar el chat en modo solo lectura (CA-10.4 — reutiliza chats.archivado)
    if (postulacion.chats?.[0]?.id) {
      await supabase
        .from('chats')
        .update({ archivado: true })
        .eq('id', postulacion.chats[0].id)
    }

    // Auto-veto por 3 inasistencias en esta agencia (CA-14.4)
    if (motivoDescarte === 'no_se_presento') {
      const { count } = await supabase
        .from('postulaciones')
        .select('id', { count: 'exact', head: true })
        .eq('candidato_id', postulacion.candidato_id)
        .eq('agencia_id', postulacion.agencia_id)
        .eq('motivo_descarte', 'no_se_presento')

      if ((count ?? 0) >= 3) {
        await supabase
          .from('candidatos')
          .update({
            vetado: true,
            motivo_veto: 'Auto-veto: 3 inasistencias a entrevista sin previo aviso en esta agencia',
            vetado_por: null,
            vetado_at: new Date().toISOString()
          })
          .eq('id', postulacion.candidato_id)

        await supabase.from('alertas').insert({
          tipo: 'candidato_auto_vetado',
          destinatario_id: postulacion.agencia_id,
          destinatario_rol: 'coordinador',
          candidato_id: postulacion.candidato_id,
          mensaje: `${nombre} (${telefono}) fue auto-vetado tras 3 inasistencias a entrevista en tu agencia. Puedes revisar el detalle y revertir el veto si lo consideras necesario.`
        })
      }
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

  async function confirmarInduccion() {
    setMoviendo(true)
    const supabase = createClient()
    const diasGarantia = postulacion.vacantes?.dias_garantia ?? 30
    const diasDescanso = postulacion.vacantes?.negocios?.dias_descanso ?? [0]
    const fechaFin = calcularGarantiaFinHabil(fechaInduccion, diasGarantia, diasDescanso)

    await supabase
      .from('postulaciones')
      .update({
        etapa_actual: 'Inducción',
        fecha_contratacion: fechaInduccion,
        fecha_garantia_fin: fechaFin,
        comision_aplicable: true,
        comision_aplicada_mxn: comisionCalculada,
        semana_corte: getSemanaISO(),
        updated_at: new Date().toISOString()
      })
      .eq('id', postulacion.id)

    await supabase.from('historial_etapas').insert({
      postulacion_id: postulacion.id,
      etapa_anterior: postulacion.etapa_actual,
      etapa_nueva: 'Inducción',
      cambiado_por: reclutadorId,
      nota: `Inicia inducción ${fechaInduccion}. Garantía hasta ${fechaFin}`
    })

    onActualizarEtapa(postulacion.id, 'Inducción')
    setMostrarModalInduccion(false)
    setMoviendo(false)
  }

  async function confirmarFirmaContrato() {
    setMoviendo(true)
    const supabase = createClient()

    await supabase
      .from('postulaciones')
      .update({
        etapa_actual: 'Contratado',
        fecha_firma_contrato: fechaFirmaContrato,
        updated_at: new Date().toISOString()
      })
      .eq('id', postulacion.id)

    await supabase.from('historial_etapas').insert({
      postulacion_id: postulacion.id,
      etapa_anterior: postulacion.etapa_actual,
      etapa_nueva: 'Contratado',
      cambiado_por: reclutadorId,
      nota: `Firma de contrato: ${fechaFirmaContrato}. Garantía y comisión ya fijadas desde Inducción.`
    })

    onActualizarEtapa(postulacion.id, 'Contratado')
    setMostrarModalFirmaContrato(false)
    setMoviendo(false)
  }

  async function abrirModalDocumentos() {
    setMostrarModalDocumentos(true)
    setCargandoDocs(true)
    const res = await fetch(`/api/documentos?candidatoId=${postulacion.candidato_id}`)
    const data = await res.json()
    setDocumentos(data.documentos ?? [])
    setCargandoDocs(false)
  }

  function cerrarModalDocumentos() {
    setMostrarModalDocumentos(false)
    setArchivoSeleccionado(null)
    setErrorDoc('')
    setFileInputKey(k => k + 1) // fuerza recrear el <input type="file"> limpio
  }

  async function eliminarDocumento(id: string) {
    if (!confirm('¿Eliminar este documento? Esta acción no se puede deshacer.')) return
    setEliminandoDoc(id)
    await fetch(`/api/documentos?id=${id}`, { method: 'DELETE' })
    setDocumentos(prev => prev.filter(d => d.id !== id))
    setEliminandoDoc(null)
  }

  async function subirDocumento() {
    if (!archivoSeleccionado) return
    setSubiendoDoc(true)
    setErrorDoc('')

    const formData = new FormData()
    formData.append('file', archivoSeleccionado)
    formData.append('candidatoId', postulacion.candidato_id)
    formData.append('postulacionId', postulacion.id)
    formData.append('tipo', tipoDocumento)

    const res = await fetch('/api/documentos', { method: 'POST', body: formData })
    const data = await res.json()

    if (!res.ok) {
      setErrorDoc(data.error ?? 'Error al subir el archivo')
    } else {
      setArchivoSeleccionado(null)
      setFileInputKey(k => k + 1)
      await abrirModalDocumentos()
    }
    setSubiendoDoc(false)
  }

  const NOMBRES_TIPO: Record<string, string> = {
    cv: 'CV',
    identificacion: 'Identificación',
    comprobante_domicilio: 'Comprobante de domicilio',
    comprobante_estudios: 'Comprobante de estudios',
    rfc: 'RFC',
    nss: 'NSS',
    curp: 'CURP',
    otro: 'Otro'
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

        {/* Badge de historial previo (CA-14.2) */}
        {tieneHistorialPrevio && (
          <a
            href={`/reclutador/chats?candidato=${postulacion.candidato_id}`}
            className="inline-block text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium mt-1 hover:bg-amber-200 transition-colors"
          >
            ⚠️ Candidato con historial previo
          </a>
        )}

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
          <a href={`/reclutador/detalle/${postulacion.vacante_id}`} className="text-lg bg-gray-50 hover:bg-gray-100 text-gray-600 px-2 py-1 rounded-lg border border-gray-200 transition-colors leading-none flex items-center">📋</a>
          <button
            onClick={abrirModalDocumentos}
            className="text-lg bg-gray-50 hover:bg-gray-100 text-gray-600 px-2 py-1 rounded-lg border border-gray-200 transition-colors leading-none"
          >
            📎
          </button>
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
            <div className="flex flex-wrap gap-1.5 mb-2">
              <button type="button" onClick={() => setMensajeRetro('Gracias por tu interés. Si en el futuro cambias de opinión, con gusto podemos reactivar tu postulación.')}
                className="text-[10px] px-2 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50">Renuncia</button>
              <button type="button" onClick={() => setMensajeRetro('Revisamos tu perfil y en este momento no es el match ideal para esta posición. Te invitamos a revisar otras vacantes en TuChamba.')}
                className="text-[10px] px-2 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50">No cumple perfil</button>
              <button type="button" onClick={() => setMensajeRetro('Notamos que no pudiste asistir a tu cita. Si deseas reagendar, escríbenos.')}
                className="text-[10px] px-2 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50">No se presentó</button>
              <button type="button" onClick={() => setMensajeRetro('La empresa tomó otra decisión en esta ocasión. Seguimos trabajando para encontrarte una oportunidad.')}
                className="text-[10px] px-2 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50">Empresa no aceptó</button>
            </div>
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

      {/* Modal de Inducción (CA-02.8) — aquí se fija garantía y comisión */}
      {mostrarModalInduccion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-900 mb-1">🎓 Inicia inducción</h3>
            <p className="text-sm text-gray-500 mb-4">{nombre} — {vacante}</p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Fecha de inicio de inducción *</label>
                <input
                  type="date"
                  value={fechaInduccion}
                  onChange={e => {
                    setFechaInduccion(e.target.value)
                    const diasGarantia = postulacion.vacantes?.dias_garantia ?? 30
                    const diasDescanso = postulacion.vacantes?.negocios?.dias_descanso ?? [0]
                    setGarantiaFin(calcularGarantiaFinHabil(e.target.value, diasGarantia, diasDescanso))
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
                <p className="text-[10px] text-gray-400 mt-1">Puedes seleccionar una fecha anterior a hoy si el candidato avisó tarde.</p>
              </div>
            </div>

            {/* Resumen */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 space-y-1">
              <p className="text-xs text-green-700">
                <span className="font-semibold">Días de garantía:</span> {postulacion.vacantes?.dias_garantia ?? 30} días hábiles
              </p>
              <p className="text-xs text-green-700">
                <span className="font-semibold">Garantía cumple:</span> {garantiaFin ? new Date(garantiaFin + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
              </p>
              <p className="text-xs text-green-700 text-lg font-bold">
                <span className="font-semibold">Tu comisión:</span> ${comisionCalculada?.toLocaleString('es-MX')} MXN
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMostrarModalInduccion(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarInduccion}
                className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] text-white py-2.5 rounded-xl text-sm font-medium"
              >
                ✅ Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Firma de Contrato — cierre administrativo, no recalcula nada */}
      {mostrarModalFirmaContrato && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-900 mb-1">🎉 Confirmar contratación</h3>
            <p className="text-sm text-gray-500 mb-4">{nombre} — {vacante}</p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Fecha de firma de contrato *</label>
                <input
                  type="date"
                  value={fechaFirmaContrato}
                  onChange={e => setFechaFirmaContrato(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-4">La garantía y tu comisión ya quedaron fijadas desde que el candidato inició inducción — este paso solo cierra el ciclo administrativamente.</p>

            <div className="flex gap-2">
              <button
                onClick={() => setMostrarModalFirmaContrato(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarFirmaContrato}
                className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] text-white py-2.5 rounded-xl text-sm font-medium"
              >
                ✅ Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Documentos (CA-02.7) */}
      {mostrarModalDocumentos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-900">📎 Documentos</h3>
              <button onClick={cerrarModalDocumentos} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">✕</button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{nombre}</p>

            {/* Lista de documentos existentes */}
            {cargandoDocs ? (
              <p className="text-xs text-gray-400 text-center py-4">Cargando...</p>
            ) : documentos.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Sin documentos subidos todavía</p>
            ) : (
              <div className="space-y-2 mb-4">
                {documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <div>
                      <p className="text-xs font-medium text-gray-800">{NOMBRES_TIPO[doc.tipo] ?? doc.tipo}</p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(doc.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={doc.url_firmada ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#1A6B3C] hover:underline"
                      >
                        Ver ↗
                      </a>
                      <button
                        onClick={() => eliminarDocumento(doc.id)}
                        disabled={eliminandoDoc === doc.id}
                        className="text-xs text-red-500 hover:text-red-600 disabled:opacity-40"
                      >
                        {eliminandoDoc === doc.id ? '...' : '🗑️'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Subir nuevo */}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-medium text-gray-700 mb-2">Tipo de documento</p>
              <select
                value={tipoDocumento}
                onChange={e => setTipoDocumento(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
              >
                <option value="cv">CV</option>
                <option value="identificacion">Identificación</option>
                <option value="comprobante_domicilio">Comprobante de domicilio</option>
                <option value="comprobante_estudios">Comprobante de estudios</option>
                <option value="rfc">RFC</option>
                <option value="nss">NSS</option>
                <option value="curp">CURP</option>
                <option value="otro">Otro</option>
              </select>
              <input
                key={fileInputKey}
                type="file"
                onChange={e => setArchivoSeleccionado(e.target.files?.[0] ?? null)}
                className="w-full text-xs text-gray-600 mb-2"
              />
              {errorDoc && <p className="text-red-500 text-xs mb-2">{errorDoc}</p>}
              <button
                onClick={subirDocumento}
                disabled={!archivoSeleccionado || subiendoDoc}
                className="w-full bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-40 text-white py-2 rounded-lg text-sm font-medium"
              >
                {subiendoDoc ? 'Subiendo...' : 'Subir documento'}
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