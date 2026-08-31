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

const MOTIVO_NO_CONCLUYO_INDUCCION = { value: 'no_concluyo_induccion', label: 'No concluyó inducción' }

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
  const [mostrarModalDetalleDescarte, setMostrarModalDetalleDescarte] = useState(false)
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
        setMostrarModalDetalleDescarte(false)
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
  const [fechaUltimoDiaPresente, setFechaUltimoDiaPresente] = useState(
    new Date().toISOString().split('T')[0]
  )

  // CA-02.10: "No efectivo" solo disponible desde etapa Inducción
  const motivosDescarteDisponibles = postulacion.etapa_actual === 'Inducción'
    ? [...MOTIVOS_DESCARTE, MOTIVO_NO_CONCLUYO_INDUCCION]
    : MOTIVOS_DESCARTE

  // Estado modal entrevista
  const [mostrarConsulta, setMostrarConsulta] = useState(false)

  useEffect(() => {
    if (!mostrarConsulta) return
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setMostrarConsulta(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [mostrarConsulta])
  const [mostrarModalNoAsistio, setMostrarModalNoAsistio] = useState(false)
  const [motivoNoAsistio, setMotivoNoAsistio] = useState('')
  const [fechaEntrevista, setFechaEntrevista] = useState('')
  const [horaEntrevista, setHoraEntrevista] = useState('')
  // 8.23 — modo de llegada (las 4 opciones de 7.38), catálogo disponible
  // para ESTA vacante (se carga al abrir el modal), y el flujo de
  // reagendar cuando el candidato no se presentó.
  const [modoLlegada, setModoLlegada] = useState('')
  const [rutaSeleccionadaId, setRutaSeleccionadaId] = useState('')
  const [puntoSeleccionadoId, setPuntoSeleccionadoId] = useState('')
  const [opcionesLlegada, setOpcionesLlegada] = useState<{
    permiteDirecto: boolean
    ofreceTransporteEmpresa: boolean
    rutas: { id: string; nombre: string }[]
    puntos: { id: string; nombre: string }[]
  } | null>(null)
  const [mostrarPreguntaReagendar, setMostrarPreguntaReagendar] = useState(false)
  const [edadCandidato, setEdadCandidato] = useState('')
  const [escolaridadCandidato, setEscolaridadCandidato] = useState('')
  const [residenciaCandidato, setResidenciaCandidato] = useState('')

  // Precarga el formulario con lo que ya esté guardado, cada vez que se abre
  // esta tarjeta — antes siempre arrancaba en blanco, aunque ya hubiera datos.
  useEffect(() => {
    if (postulacion.fecha_entrevista) {
      const d = new Date(postulacion.fecha_entrevista)
      setFechaEntrevista(d.toISOString().split('T')[0])
      setHoraEntrevista(d.toTimeString().slice(0, 5))
    }
    setLugarEntrevista(postulacion.lugar_entrevista ?? '')
    setEdadCandidato(postulacion.candidatos?.edad ? String(postulacion.candidatos.edad) : '')
    setEscolaridadCandidato(postulacion.candidatos?.escolaridad ?? '')
    setResidenciaCandidato(postulacion.candidatos?.residencia ?? '')
  }, [postulacion.id])

  const diasEnEtapa = Math.floor(
    (Date.now() - new Date(postulacion.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  const telefono = postulacion.candidatos?.telefono
  const nombre = postulacion.candidatos?.nombre
  const vacante = postulacion.vacantes?.titulo
  const empresa = postulacion.vacantes?.negocios?.nombre
  const enEntrevista = postulacion.etapa_actual === 'Entrevista'
  const tieneEntrevista = postulacion.fecha_entrevista

  // HU-24: mismo criterio que la alerta "sin_movimiento" ya existente (CA-07.2)
  const horasSinMovimientoSeguimiento = (Date.now() - new Date(postulacion.updated_at).getTime()) / (1000 * 60 * 60)
  const etapasActivasSeguimiento = ['Aplicado', 'Contactado', 'Entrevista', 'Inducción']
  const sinMovimiento48h = etapasActivasSeguimiento.includes(postulacion.etapa_actual) && horasSinMovimientoSeguimiento > 48

  function generarLinkSeguimiento() {
    const mensajesPorEtapa: Record<string, string> = {
      'Aplicado': `Hola ${nombre}, vimos tu interés en la vacante de ${vacante}. ¿Sigues buscando trabajo? Contáctanos para continuar tu proceso.`,
      'Contactado': `Hola ${nombre}, ¿pudiste ver mi mensaje anterior sobre la vacante de ${vacante}? Quedamos al pendiente de ti.`,
      'Entrevista': `Hola ${nombre}, seguimos con la vacante de ${vacante} disponible para ti. ¿Agendamos tu entrevista?`,
      'Inducción': `Hola ${nombre}, ¿cómo vas con tu proceso de inducción en ${vacante}? Cualquier duda, aquí estamos para apoyarte.`,
    }
    const mensaje = mensajesPorEtapa[postulacion.etapa_actual] ?? `Hola ${nombre}, seguimos en contacto por la vacante de ${vacante}.`
    return `https://wa.me/52${telefono}?text=${encodeURIComponent(mensaje)}`
  }

  // CA-02.9: flujo secuencial, un paso a la vez (adelante o atrás, tipo Ctrl+Z)
  const ORDEN_ETAPAS = ['Aplicado', 'Contactado', 'Entrevista', 'Inducción', 'Contratado']
  const indiceActual = ORDEN_ETAPAS.indexOf(postulacion.etapa_actual)
  const siguienteEtapa = indiceActual >= 0 && indiceActual < ORDEN_ETAPAS.length - 1
    ? ORDEN_ETAPAS[indiceActual + 1]
    : null
  const anteriorEtapa = indiceActual > 0 ? ORDEN_ETAPAS[indiceActual - 1] : null
  const opcionesMenu = postulacion.etapa_actual === 'Descartado' || postulacion.etapa_actual === 'Contratado'
    ? [] // etapas terminales, sin acciones de movimiento
    : [
        ...(siguienteEtapa ? [siguienteEtapa] : []),
        ...(anteriorEtapa ? [anteriorEtapa] : []),
        'Descartado'
      ]

  async function cambiarEtapa(nuevaEtapa: string) {
    if (nuevaEtapa === 'Descartado') {
      setMostrarMenu(false)
      setMostrarModalDescarte(true)
      return
    }
    if (nuevaEtapa === 'Inducción') {
      // Candado: no se puede pasar a Inducción sin fecha de entrevista,
      // ficha del candidato completa, y confirmación de asistencia.
      const faltantes: string[] = []
      if (!postulacion.fecha_entrevista) faltantes.push('fecha de entrevista agendada')
      if (!postulacion.candidatos?.edad) faltantes.push('edad')
      if (!postulacion.candidatos?.escolaridad) faltantes.push('escolaridad')
      if (!postulacion.candidatos?.residencia) faltantes.push('residencia')
      if (postulacion.asistio_entrevista !== true) faltantes.push('confirmar que sí se presentó a la entrevista')

      if (faltantes.length > 0) {
        setMostrarMenu(false)
        alert(`Antes de pasar a Inducción, completa: ${faltantes.join(', ')}.`)
        return
      }

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
      const diasInduccion = postulacion.vacantes?.dias_induccion ?? 0
      const induccionDentroGarantia = postulacion.vacantes?.induccion_dentro_garantia ?? true
      setGarantiaFin(calcularGarantiaFinHabil(fechaInduccion, diasGarantia, diasDescanso, diasInduccion, induccionDentroGarantia))
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

    // Si retrocede desde "Inducción", la garantía/comisión ya calculada
    // deja de tener sentido — se limpia para no dejar datos fantasma.
    const retrocedeDesdeInduccion = postulacion.etapa_actual === 'Inducción'
    const camposReset = retrocedeDesdeInduccion
      ? {
          fecha_contratacion: null,
          fecha_garantia_fin: null,
          comision_aplicable: false,
          comision_aplicada_mxn: null
        }
      : {}

    await supabase
      .from('postulaciones')
      .update({
        etapa_actual: nuevaEtapa,
        updated_at: new Date().toISOString(),
        ...camposReset
      })
      .eq('id', postulacion.id)

    await supabase.from('historial_etapas').insert({
      postulacion_id: postulacion.id,
      etapa_anterior: postulacion.etapa_actual,
      etapa_nueva: nuevaEtapa,
      cambiado_por: reclutadorId,
      nota: retrocedeDesdeInduccion ? 'Retrocedido — garantía y comisión reiniciadas' : undefined
    })

    onActualizarEtapa(postulacion.id, nuevaEtapa)
    setMoviendo(false)
  }

  async function descartarUnaPostulacion(postulacionId: string, etapaAnterior: string, nota: string) {
    const supabase = createClient()

    // CA-02.10: "No concluyó inducción" limpia garantía/comisión ya calculadas
    // y guarda el último día real de presencia en el detalle, para trazabilidad.
    const esNoEfectivo = motivoDescarte === 'no_concluyo_induccion'
    const detalleFinal = esNoEfectivo
      ? `Último día presente: ${fechaUltimoDiaPresente}${motivoDetalle ? ' — ' + motivoDetalle : ''}`
      : (motivoDetalle || null)

    await supabase
      .from('postulaciones')
      .update({
        etapa_actual: 'Descartado',
        motivo_descarte: motivoDescarte,
        descartado_por: 'reclutador',
        motivo_descarte_detalle: detalleFinal,
        ...(esNoEfectivo ? {
          fecha_contratacion: null,
          fecha_garantia_fin: null,
          comision_aplicable: false,
          comision_aplicada_mxn: null
        } : {}),
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

  // 8.23 — carga qué opciones de llegada (de las 4 de 7.38) están
  // disponibles para ESTA vacante en particular, no el catálogo
  // completo de la empresa — solo lo que el coordinador marcó como
  // aplicable en la Sección 9 del VacanteModal.
  async function cargarOpcionesLlegada() {
    const supabase = createClient()
    const vacanteId = postulacion.vacante_id

    const { data: vacanteData } = await supabase
      .from('vacantes')
      .select('permite_directo_planta, tiene_ruta, ruta_para_entrevista')
      .eq('id', vacanteId)
      .single()

    const { data: vRutas } = await supabase
      .from('vacante_ruta_reclutamiento')
      .select('ruta_id, rutas_reclutamiento(id, nombre)')
      .eq('vacante_id', vacanteId)
    const { data: vPuntos } = await supabase
      .from('vacante_punto_reclutamiento')
      .select('punto_id, puntos_reclutamiento(id, nombre)')
      .eq('vacante_id', vacanteId)

    setOpcionesLlegada({
      permiteDirecto: vacanteData?.permite_directo_planta ?? true,
      ofreceTransporteEmpresa: !!(vacanteData?.tiene_ruta && vacanteData?.ruta_para_entrevista),
      rutas: (vRutas ?? []).map((r: any) => ({ id: r.ruta_id, nombre: r.rutas_reclutamiento?.nombre ?? '' })),
      puntos: (vPuntos ?? []).map((p: any) => ({ id: p.punto_id, nombre: p.puntos_reclutamiento?.nombre ?? '' })),
    })
  }

  async function guardarEntrevista() {
    const supabase = createClient()
    // Fecha/hora ya no son obligatorias (José, 2026-08-31) — un
    // reclutador puede querer guardar el modo de llegada o avanzar el
    // checklist de documentos antes de tener fecha agendada.
    const fechaCompleta = fechaEntrevista && horaEntrevista ? new Date(`${fechaEntrevista}T${horaEntrevista}`) : null

    // 5.25 — candado: no se puede agendar fuera de los días de entrevista
    // configurados para esa empresa (si la empresa tiene el dato configurado)
    if (fechaCompleta) {
      const diasEntrevista = postulacion.vacantes?.negocios?.dias_entrevista
      if (diasEntrevista && diasEntrevista.length > 0 && !diasEntrevista.includes(fechaCompleta.getDay())) {
        alert('Fecha fuera de días de entrevista de la empresa.')
        return
      }
    }

    // 8.23 — cada intento de entrevista es su propia fila en `entrevistas`,
    // no se sobrescribe como antes — así un reagendado no borra el
    // historial del intento fallido anterior.
    const { data: nuevaEntrevista } = await supabase.from('entrevistas').insert({
      postulacion_id: postulacion.id,
      fecha_entrevista: fechaCompleta ? fechaCompleta.toISOString() : null,
      modo_llegada: modoLlegada || null,
      ruta_reclutamiento_id: modoLlegada === 'ruta_reclutamiento' ? (rutaSeleccionadaId || null) : null,
      punto_reclutamiento_id: modoLlegada === 'punto_reclutamiento' ? (puntoSeleccionadoId || null) : null,
    }).select('id').single()

    await supabase
      .from('postulaciones')
      .update({
        fecha_entrevista: fechaCompleta ? fechaCompleta.toISOString() : null,
        asistio_entrevista: null,
        motivo_no_asistencia: null,
        entrevista_activa_id: nuevaEntrevista?.id ?? null,
      })
      .eq('id', postulacion.id)

    postulacion.fecha_entrevista = fechaCompleta ? fechaCompleta.toISOString() : null
    postulacion.asistio_entrevista = null
    postulacion.motivo_no_asistencia = null
    postulacion.entrevista_activa_id = nuevaEntrevista?.id ?? null

    // HU-23: ficha del candidato — solo actualiza si el reclutador capturó algo
    if (edadCandidato || escolaridadCandidato || residenciaCandidato) {
      await supabase
        .from('candidatos')
        .update({
          ...(edadCandidato ? { edad: Number(edadCandidato) } : {}),
          ...(escolaridadCandidato ? { escolaridad: escolaridadCandidato } : {}),
          ...(residenciaCandidato ? { residencia: residenciaCandidato } : {}),
        })
        .eq('id', postulacion.candidato_id)

      // Actualiza la copia en memoria para que la tarjeta se vea al instante,
      // sin esperar a recargar la página.
      if (postulacion.candidatos) {
        if (edadCandidato) postulacion.candidatos.edad = Number(edadCandidato)
        if (escolaridadCandidato) postulacion.candidatos.escolaridad = escolaridadCandidato
        if (residenciaCandidato) postulacion.candidatos.residencia = residenciaCandidato
      }
    }

    // El resumen al coordinador solo tiene sentido si de verdad hay una
    // fecha agendada — con fecha/hora opcionales ahora, puede que este
    // guardado sea solo para capturar el modo de llegada sin fecha todavía.
    if (fechaCompleta) await enviarResumenAlCoordinador(fechaCompleta)
    setMostrarModalEntrevista(false)
    setModoLlegada('')
    setRutaSeleccionadaId('')
    setPuntoSeleccionadoId('')
    onActualizarEtapa(postulacion.id, postulacion.etapa_actual)
  }

  // HU-23: arma y envía el resumen automático (mismo formato que ya usan los
  // reclutadores por WhatsApp) como mensaje de sistema al chat con el coordinador.
  async function enviarResumenAlCoordinador(fechaCompleta: Date) {
    const supabase = createClient()

    const { data: coordinadorData } = await supabase
      .from('coordinadores')
      .select('id, nombre')
      .eq('agencia_id', postulacion.agencia_id)
      .eq('status', 'activo')
      .maybeSingle()
    if (!coordinadorData) return // no hay coordinador activo en esta agencia, no hay a quién avisar

    const { data: reclutadorData } = await supabase
      .from('reclutadores')
      .select('nombre')
      .eq('id', reclutadorId)
      .maybeSingle()

    const v = postulacion.vacantes
    const empresa = v?.negocios?.nombre ?? 'Empresa'
    const rutaOPunto = v?.ruta_para_entrevista && v?.punto_reunion
      ? v.punto_reunion
      : 'Directo a Empresa'

    const resumen =
      `🏭 Empresa: ${empresa}\n` +
      `📅 Fecha de entrevista: ${fechaCompleta.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}\n` +
      `✅ Vacante: ${v?.titulo ?? ''}\n` +
      `🔰 Nombre Candidato: ${nombre}\n` +
      (edadCandidato ? `💠 Edad: ${edadCandidato} años\n` : '') +
      (escolaridadCandidato ? `🧑🏻‍🎓 Escolaridad: ${escolaridadCandidato}\n` : '') +
      (residenciaCandidato ? `📌 Residencia: ${residenciaCandidato}\n` : '') +
      (v?.horario ? `🕛 Horario Laboral: ${v.horario}\n` : '') +
      `🚌 Ruta o Punto de Reclutamiento: ${rutaOPunto}\n` +
      `🕛 Hora: ${fechaCompleta.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}\n` +
      `⭕ Reclutador: ${reclutadorData?.nombre ?? ''}\n` +
      `⭕ Coordinador: ${coordinadorData.nombre}`

    // Mismo chat único por par reclutador-coordinador ya usado en HU-22 (5.13)
    let { data: chat } = await supabase
      .from('chats')
      .select('id')
      .eq('tipo', 'reclutador_coordinador')
      .eq('reclutador_id', reclutadorId)
      .eq('coordinador_id', coordinadorData.id)
      .is('vacante_id', null)
      .maybeSingle()

    if (!chat) {
      const { data: nuevoChat } = await supabase
        .from('chats')
        .insert({ tipo: 'reclutador_coordinador', reclutador_id: reclutadorId, coordinador_id: coordinadorData.id })
        .select('id')
        .maybeSingle()
      chat = nuevoChat
    }
    if (!chat) return

    await supabase.from('mensajes').insert({
      chat_id: chat.id,
      sender_tipo: 'reclutador',
      sender_id: reclutadorId,
      sender_nombre: reclutadorData?.nombre ?? 'Reclutador',
      texto: resumen,
      es_sistema: true,
    })
  }

  async function guardarScore(nuevoScore: number) {
    setScore(nuevoScore)
    const supabase = createClient()
    await supabase
      .from('postulaciones')
      .update({ score: nuevoScore })
      .eq('id', postulacion.id)
  }

  // HU-16 (6.8b) — revisa y pausa el cupo si ya se cubrió. Se llama tanto al
  // entrar a Inducción como al confirmar Contratado, porque el lugar se
  // "ocupa" desde Inducción (comision_aplicable = true desde ahí), no hasta
  // el final — evita pedir de más mientras candidatos siguen en proceso.
  async function verificarYPausarCupo(vacanteId: string) {
    const supabase = createClient()
    const { data: vacanteInfo } = await supabase
      .from('vacantes')
      .select('id, titulo, cupo_requerido, agencia_id, status, cupo_desde')
      .eq('id', vacanteId)
      .maybeSingle()

    if (!vacanteInfo || vacanteInfo.status === 'pausada') return // ya pausada, no duplicar alerta

    // HU-16 (6.8b) "por rondas": solo cuenta lo que entró a Inducción después
    // de la última reactivación (cupo_desde), no el histórico completo.
    const cupoDesde = (vacanteInfo.cupo_desde ?? '1970-01-01').split('T')[0]
    const { count } = await supabase
      .from('postulaciones')
      .select('*', { count: 'exact', head: true })
      .eq('vacante_id', vacanteInfo.id)
      .eq('comision_aplicable', true)
      .gte('fecha_contratacion', cupoDesde)

    if ((count ?? 0) >= (vacanteInfo.cupo_requerido ?? 1)) {
      await supabase.from('vacantes').update({ status: 'pausada' }).eq('id', vacanteInfo.id)

      const { data: coordinador } = await supabase
        .from('coordinadores')
        .select('id')
        .eq('agencia_id', vacanteInfo.agencia_id)
        .eq('status', 'activo')
        .maybeSingle()

      if (coordinador) {
        await supabase.from('alertas').insert({
          tipo: 'cupo_cubierto',
          destinatario_id: coordinador.id,
          destinatario_rol: 'coordinador',
          vacante_id: vacanteInfo.id,
          mensaje: `✅ Cupo cubierto: "${vacanteInfo.titulo}" ya tiene ${count} lugares ocupados. La vacante fue pausada automáticamente.`,
          leida: false,
        })
      }
    }
  }

  async function confirmarInduccion() {
    setMoviendo(true)
    const supabase = createClient()
    const diasGarantia = postulacion.vacantes?.dias_garantia ?? 30
    const diasDescanso = postulacion.vacantes?.negocios?.dias_descanso ?? [0]
    const diasInduccion = postulacion.vacantes?.dias_induccion ?? 0
    const induccionDentroGarantia = postulacion.vacantes?.induccion_dentro_garantia ?? true
    const fechaFin = calcularGarantiaFinHabil(fechaInduccion, diasGarantia, diasDescanso, diasInduccion, induccionDentroGarantia)

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

    await verificarYPausarCupo(postulacion.vacante_id)

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

    await verificarYPausarCupo(postulacion.vacante_id)

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

    let mensaje = `Hola ${nombre}, te contactamos de Tu Chamba Express sobre la vacante de ${vacante}. ¿Sigues interesado?`
    if (postulacion.etapa_actual === 'Entrevista' && tieneEntrevista) {
      mensaje = `Hola ${nombre}, te recordamos que tienes entrevista para ${vacante} el ${fecha} a las ${hora} en ${lugar}. ¿Confirmas tu asistencia?`
    } else if (postulacion.etapa_actual === 'Inducción' && postulacion.fecha_contratacion) {
      mensaje = `Hola ${nombre}, ¿todo bien con tu inducción en ${vacante}? Cualquier duda, aquí estamos.`
    }

    return `https://wa.me/52${telefono}?text=${encodeURIComponent(mensaje)}`
  }

  return (
    <>
      <div className={`rounded-xl p-3 shadow-sm border ${
        postulacion.motivo_descarte === 'no_concluyo_induccion'
          ? 'bg-red-50 border-red-100'
          : 'bg-white border-gray-100'
      } ${moviendo ? 'opacity-50' : ''}`}>
        {/* Nombre candidato */}
        <button
          onClick={() => setMostrarConsulta(true)}
          className="font-semibold text-gray-900 text-sm hover:text-[#1A6B3C] hover:underline text-left"
        >
          {nombre}
        </button>

        {/* Badge de pre-calificado (CA-17.3) */}
        {postulacion.precalificado && (
          <span className="inline-block text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium mt-1 mr-1">
            ✅ Pre-calificado
          </span>
        )}

        {/* Badge de inactividad prolongada (CA-02.11) */}
        {(() => {
          const etapasActivas = ['Aplicado', 'Contactado', 'Entrevista', 'Inducción']
          const horasSinMovimiento = (Date.now() - new Date(postulacion.updated_at).getTime()) / (1000 * 60 * 60)
          const sinActividad = etapasActivas.includes(postulacion.etapa_actual) && horasSinMovimiento > 72
          return sinActividad && (
            <span className="inline-block text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium mt-1 mr-1">
              🚨 Sin actividad
            </span>
          )
        })()}

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
        <p className="text-xs text-[#1A6B3C] mt-0.5">{vacante}{empresa ? ` — ${empresa}` : ''}</p>

        {/* Confirmación de asistencia (CA-15.5) — solo si ya pasó la fecha y no se ha contestado */}
        {postulacion.etapa_actual === 'Entrevista' && postulacion.fecha_entrevista && new Date(postulacion.fecha_entrevista) < new Date() && (
          postulacion.asistio_entrevista === null || postulacion.asistio_entrevista === undefined
        ) && (
          <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-2">
            <p className="text-[11px] text-blue-700 mb-1.5">¿Se presentó a la entrevista?</p>
            <div className="flex gap-1.5">
              <button
                onClick={async () => {
                  const supabase = createClient()
                  await supabase.from('postulaciones').update({ asistio_entrevista: true }).eq('id', postulacion.id)
                  postulacion.asistio_entrevista = true
                  onActualizarEtapa(postulacion.id, postulacion.etapa_actual)
                }}
                className="flex-1 text-[11px] bg-green-100 hover:bg-green-200 text-green-700 py-1 rounded-lg font-medium"
              >
                ✅ Sí
              </button>
              <button
                onClick={() => setMostrarModalNoAsistio(true)}
                className="flex-1 text-[11px] bg-red-100 hover:bg-red-200 text-red-700 py-1 rounded-lg font-medium"
              >
                ❌ No
              </button>
            </div>
          </div>
        )}

        {mostrarModalNoAsistio && (
          <div className="mt-2 bg-red-50 border border-red-100 rounded-lg p-2" onClick={e => e.stopPropagation()}>
            <p className="text-[11px] text-red-700 mb-1.5">¿Alguna razón? (opcional — algo fuera de su control cuenta distinto que si ya no contesta)</p>
            <textarea
              value={motivoNoAsistio}
              onChange={e => setMotivoNoAsistio(e.target.value)}
              placeholder="Ej. Se enfermó, le surgió una emergencia..."
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
            <div className="flex gap-1.5 mt-1.5">
              <button
                onClick={async () => {
                  const supabase = createClient()
                  await supabase.from('postulaciones').update({
                    asistio_entrevista: false,
                    motivo_no_asistencia: motivoNoAsistio.trim() || null
                  }).eq('id', postulacion.id)
                  // 8.23 — refleja el resultado en el intento de entrevista
                  // activo también (la fila en `entrevistas`), no solo en
                  // postulaciones — para conservar el historial real.
                  if (postulacion.entrevista_activa_id) {
                    await supabase.from('entrevistas').update({
                      asistio_entrevista: false,
                      motivo_no_asistencia: motivoNoAsistio.trim() || null,
                      updated_at: new Date().toISOString(),
                    }).eq('id', postulacion.entrevista_activa_id)
                  }
                  postulacion.asistio_entrevista = false
                  postulacion.motivo_no_asistencia = motivoNoAsistio.trim() || null
                  setMostrarModalNoAsistio(false)
                  // En vez de cerrar y ya, se pregunta si se reagenda —
                  // José, 2026-08-31: "que el sistema me pregunte después
                  // ¿Se reagenda entrevista? ¿Motivo de falta?"
                  setMostrarPreguntaReagendar(true)
                  onActualizarEtapa(postulacion.id, postulacion.etapa_actual)
                }}
                className="flex-1 text-[11px] bg-red-600 hover:bg-red-700 text-white py-1 rounded-lg font-medium"
              >
                Guardar
              </button>
              <button
                onClick={() => { setMostrarModalNoAsistio(false); setMotivoNoAsistio('') }}
                className="flex-1 text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-600 py-1 rounded-lg font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* 8.23 — pregunta de reagendar, tras marcar que no se presentó.
            Sin límite de reintentos (José: el reclutador decide cuándo
            pasarlo a Descartar/Rechazado manualmente, no hay tope). */}
        {mostrarPreguntaReagendar && (
          <div className="mt-2 bg-amber-50 border border-amber-100 rounded-lg p-2" onClick={e => e.stopPropagation()}>
            <p className="text-[11px] text-amber-700 mb-1.5">¿Se reagenda la entrevista?</p>
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  setMostrarPreguntaReagendar(false)
                  setMotivoNoAsistio('')
                  setFechaEntrevista('')
                  setHoraEntrevista('')
                  setModoLlegada('')
                  setRutaSeleccionadaId('')
                  setPuntoSeleccionadoId('')
                  setMostrarModalEntrevista(true)
                  cargarOpcionesLlegada()
                }}
                className="flex-1 text-[11px] bg-amber-600 hover:bg-amber-700 text-white py-1 rounded-lg font-medium"
              >
                Sí, reagendar
              </button>
              <button
                onClick={() => { setMostrarPreguntaReagendar(false); setMotivoNoAsistio('') }}
                className="flex-1 text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-600 py-1 rounded-lg font-medium"
              >
                No por ahora
              </button>
            </div>
          </div>
        )}

        {postulacion.asistio_entrevista !== null && postulacion.asistio_entrevista !== undefined && (
          <p className="text-[10px] mt-1.5 font-medium">
            {postulacion.asistio_entrevista ? '✅ Sí se presentó a entrevista' : '❌ No se presentó a entrevista'}
          </p>
        )}

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
          {!postulacion.es_manual && (
            <a href={`/reclutador/chats?chat=${postulacion.chats?.[0]?.id}`}
              className="flex-1 text-center text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 py-1.5 rounded-lg border border-gray-200 transition-colors"
            >
              💬 Chat
            </a>
          )}
          <a href={`/reclutador/detalle/${postulacion.vacante_id}?from=pipeline`} className="text-sm bg-gray-50 hover:bg-gray-100 text-gray-600 w-7 h-7 rounded-lg border border-gray-200 transition-colors flex items-center justify-center flex-shrink-0">📋</a>
          <button
            onClick={abrirModalDocumentos}
            className="text-sm bg-gray-50 hover:bg-gray-100 text-gray-600 w-7 h-7 rounded-lg border border-gray-200 transition-colors flex items-center justify-center flex-shrink-0"
          >
            📎
          </button>
          {postulacion.etapa_actual === 'Descartado' && (
            <button
              onClick={() => setMostrarModalDetalleDescarte(true)}
              className="text-sm bg-gray-50 hover:bg-gray-100 text-red-500 w-7 h-7 rounded-lg border border-gray-200 transition-colors flex items-center justify-center flex-shrink-0"
            >
              ❌
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setMostrarMenu(!mostrarMenu)}
              className="text-xs bg-[#1A6B3C] hover:bg-[#155c33] text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Mover ▾
            </button>
            {mostrarMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[160px]">
                {opcionesMenu.map(etapa => (
                  <button
                    key={etapa}
                    onClick={() => cambiarEtapa(etapa)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                      etapa === 'Descartado' ? 'text-red-500 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {etapa === 'Descartado' ? '❌ Descartar/Rechazado' : etapa === anteriorEtapa ? `← ${etapa}` : `→ ${etapa}`}
                  </button>
                ))}
                {opcionesMenu.length === 0 && (
                  <p className="px-3 py-2 text-xs text-gray-400">Sin acciones disponibles</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Botón de entrevista — solo en etapa Entrevista; WhatsApp — Contactado/Entrevista/Inducción */}
        {sinMovimiento48h && (
          <span className="inline-block text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium mt-2">
            🔔 Sin movimiento 48h
          </span>
        )}

        {(enEntrevista || postulacion.etapa_actual === 'Contactado' || postulacion.etapa_actual === 'Inducción' || sinMovimiento48h) && (
          <div className="flex gap-2 mt-2">
            {enEntrevista && (
              <button
                onClick={() => { setMostrarModalEntrevista(true); cargarOpcionesLlegada() }}
                className="flex-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-lg border border-blue-200 transition-colors"
              >
                📅 {tieneEntrevista ? 'Ver entrevista' : 'Agendar'}
              </button>
            )}
            <a href={sinMovimiento48h ? generarLinkSeguimiento() : generarLinkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 text-center text-xs py-1.5 rounded-lg border transition-colors ${
                sinMovimiento48h
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                  : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
              }`}
            >
              {sinMovimiento48h ? '🔔 Enviar seguimiento' : '📱 WhatsApp'}
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
              {motivosDescarteDisponibles.map(m => (
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

            {motivoDescarte === 'no_concluyo_induccion' && (
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-700 block mb-1">
                  Último día que se presentó *
                </label>
                <input
                  type="date"
                  value={fechaUltimoDiaPresente}
                  onChange={e => setFechaUltimoDiaPresente(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  El sistema considera la falta a partir del día siguiente a esta fecha.
                </p>
              </div>
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
              {motivoDescarte === 'no_concluyo_induccion' && (
                <button type="button" onClick={() => setMensajeRetro('Notamos que no continuaste con tu proceso de inducción. Si fue un malentendido o quieres platicarlo, contáctanos.')}
                  className="text-[10px] px-2 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50">No concluyó inducción</button>
              )}
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
                    const diasInduccion = postulacion.vacantes?.dias_induccion ?? 0
                    const induccionDentroGarantia = postulacion.vacantes?.induccion_dentro_garantia ?? true
                    setGarantiaFin(calcularGarantiaFinHabil(e.target.value, diasGarantia, diasDescanso, diasInduccion, induccionDentroGarantia))
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

      {/* Modal de detalle del descarte (CA-13.4) — solo lectura, compacto */}
      {mostrarModalDetalleDescarte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-4 max-w-xs w-full shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-sm">Detalle del descarte</h3>
              <button onClick={() => setMostrarModalDetalleDescarte(false)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs">✕</button>
            </div>
            <p className="text-xs text-gray-500 mb-3">{nombre}</p>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-gray-400">Motivo</p>
                <p className="text-gray-800 font-medium">
                  {[...MOTIVOS_DESCARTE, MOTIVO_NO_CONCLUYO_INDUCCION].find(m => m.value === postulacion.motivo_descarte)?.label ?? postulacion.motivo_descarte ?? '—'}
                </p>
              </div>
              {postulacion.motivo_descarte_detalle && (
                <div>
                  <p className="text-gray-400">Detalle</p>
                  <p className="text-gray-800">{postulacion.motivo_descarte_detalle}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400">Fecha y hora</p>
                <p className="text-gray-800">
                  {new Date(postulacion.updated_at).toLocaleString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalle del descarte (CA-13.4) — solo lectura, compacto */}
      {mostrarModalDetalleDescarte && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-4 max-w-xs w-full shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-sm">Detalle del descarte</h3>
              <button onClick={() => setMostrarModalDetalleDescarte(false)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs">✕</button>
            </div>
            <p className="text-xs text-gray-500 mb-3">{nombre}</p>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-gray-400">Motivo</p>
                <p className="text-gray-800 font-medium">
                  {[...MOTIVOS_DESCARTE, MOTIVO_NO_CONCLUYO_INDUCCION].find(m => m.value === postulacion.motivo_descarte)?.label ?? postulacion.motivo_descarte ?? '—'}
                </p>
              </div>
              {postulacion.motivo_descarte_detalle && (
                <div>
                  <p className="text-gray-400">Detalle</p>
                  <p className="text-gray-800">{postulacion.motivo_descarte_detalle}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400">Fecha y hora</p>
                <p className="text-gray-800">
                  {new Date(postulacion.updated_at).toLocaleString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
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
                <label className="text-xs font-medium text-gray-700 block mb-1">Fecha</label>
                <input type="date" value={fechaEntrevista}
                  onChange={e => setFechaEntrevista(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Hora</label>
                <input type="time" value={horaEntrevista}
                  onChange={e => setHoraEntrevista(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">¿Cómo llega a la entrevista?</label>
                <select
                  value={modoLlegada}
                  onChange={e => { setModoLlegada(e.target.value); setRutaSeleccionadaId(''); setPuntoSeleccionadoId('') }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                >
                  <option value="">Selecciona...</option>
                  {opcionesLlegada?.permiteDirecto && <option value="directo_planta">Directo a planta</option>}
                  {(opcionesLlegada?.rutas?.length ?? 0) > 0 && <option value="ruta_reclutamiento">Ruta especializada (con chofer)</option>}
                  {(opcionesLlegada?.puntos?.length ?? 0) > 0 && <option value="punto_reclutamiento">Oficina / punto fijo</option>}
                  {opcionesLlegada?.ofreceTransporteEmpresa && <option value="transporte_empresa">Transporte de la empresa</option>}
                </select>
                {!opcionesLlegada && (
                  <p className="text-[11px] text-gray-400 mt-1">Cargando opciones disponibles...</p>
                )}
                {opcionesLlegada && !opcionesLlegada.permiteDirecto && opcionesLlegada.rutas.length === 0 && opcionesLlegada.puntos.length === 0 && !opcionesLlegada.ofreceTransporteEmpresa && (
                  <p className="text-[11px] text-amber-600 mt-1">Esta vacante no tiene ninguna opción de llegada configurada — revísalo con el coordinador (Sección 9 de la vacante).</p>
                )}

                {modoLlegada === 'ruta_reclutamiento' && (
                  <select
                    value={rutaSeleccionadaId}
                    onChange={e => setRutaSeleccionadaId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white mt-2 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                  >
                    <option value="">¿Cuál ruta?</option>
                    {opcionesLlegada?.rutas.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                  </select>
                )}
                {modoLlegada === 'punto_reclutamiento' && (
                  <select
                    value={puntoSeleccionadoId}
                    onChange={e => setPuntoSeleccionadoId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white mt-2 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                  >
                    <option value="">¿Cuál punto?</option>
                    {opcionesLlegada?.puntos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                )}
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-medium text-gray-700 mb-2">Ficha del candidato (opcional)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={edadCandidato}
                    onChange={e => setEdadCandidato(e.target.value)}
                    placeholder="Edad"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                  />
                  <select value={escolaridadCandidato}
                    onChange={e => setEscolaridadCandidato(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
                  >
                    <option value="">Escolaridad</option>
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                    <option value="Preparatoria">Preparatoria</option>
                    <option value="Universidad">Universidad</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <input type="text" value={residenciaCandidato}
                  onChange={e => setResidenciaCandidato(e.target.value)}
                  placeholder="Residencia (ciudad o colonia)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
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
                className="flex-1 bg-[#1A6B3C] hover:bg-[#155c33] text-white py-2.5 rounded-xl text-sm font-medium"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarConsulta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setMostrarConsulta(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">{nombre}</h3>
              <button onClick={() => setMostrarConsulta(false)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
            </div>

            {tieneHistorialPrevio && (
              <span className="inline-block text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium mb-2">
                ⚠️ Candidato con historial previo
              </span>
            )}

            <p className="text-sm text-[#1A6B3C] font-medium">{vacante}{empresa ? ` — ${empresa}` : ''}</p>
            <p className="text-xs text-gray-400 mt-0.5">📱 {telefono}</p>

            <div className="mt-2 pt-2 border-t border-gray-100 text-xs space-y-0.5">
              <p className="text-gray-400 font-medium mb-1">Requisitos para pasar a Inducción:</p>
              <p className={postulacion.fecha_entrevista ? 'text-gray-600' : 'text-red-500'}>
                📅 {postulacion.fecha_entrevista
                  ? `${new Date(postulacion.fecha_entrevista).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} · ${new Date(postulacion.fecha_entrevista).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
                  : 'Fecha de entrevista: sin capturar'}
              </p>
              {postulacion.lugar_entrevista && <p className="text-gray-500">📍 {postulacion.lugar_entrevista}</p>}
              <p className={postulacion.candidatos?.edad ? 'text-gray-600' : 'text-red-500'}>
                🎂 {postulacion.candidatos?.edad ? `${postulacion.candidatos.edad} años` : 'Edad: sin capturar'}
              </p>
              <p className={postulacion.candidatos?.escolaridad ? 'text-gray-600' : 'text-red-500'}>
                🎓 {postulacion.candidatos?.escolaridad || 'Escolaridad: sin capturar'}
              </p>
              <p className={postulacion.candidatos?.residencia ? 'text-gray-600' : 'text-red-500'}>
                📍 {postulacion.candidatos?.residencia || 'Residencia: sin capturar'}
              </p>
              <p className={postulacion.asistio_entrevista === true ? 'text-gray-600' : 'text-red-500'}>
                {postulacion.asistio_entrevista === true ? '✅ Sí se presentó a entrevista'
                  : postulacion.asistio_entrevista === false ? '❌ No se presentó a entrevista'
                  : '⏳ Asistencia: sin confirmar'}
              </p>
              {postulacion.motivo_no_asistencia && (
                <p className="text-gray-400">Razón: {postulacion.motivo_no_asistencia}</p>
              )}
            </div>

            {postulacion.precalificado && (
              <span className="inline-block text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium mt-2">
                ✅ Pre-calificado
              </span>
            )}

            <button
              onClick={() => setMostrarConsulta(false)}
              className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}