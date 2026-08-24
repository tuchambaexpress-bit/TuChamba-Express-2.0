'use client'

import { useState, useEffect } from 'react'
import ChatWindow from './ChatWindow'
import { createClient } from '@/lib/supabase/client'
import { getCodigoReferido } from '@/hooks/useReferido'

interface Pregunta {
  id: string
  pregunta: string
  tipo: 'si_no' | 'opcion_multiple' | 'texto_libre'
  opciones?: string[]
  respuesta_correcta: string
}

interface VacanteAlternativa {
  id: string
  titulo: string
  ciudad: string
  estado: string
}

interface SesionGuardada {
  telefono: string
  nombre: string
  chatId: string
  vacanteId: string
}

interface Props {
  vacanteId: string
  vacanteTitulo: string
  reclutadorId?: string | null
  onClose: () => void
}

const MAX_SESIONES_GUARDADAS = 5 // Principio #4 "Ligero" — no crecer sin límite

export default function ChatModal({ vacanteId, vacanteTitulo, reclutadorId, onClose }: Props) {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [mensajeExito, setMensajeExito] = useState('')
  const [etapaActual, setEtapaActual] = useState('Aplicado')
  const [chatIdActivo, setChatIdActivo] = useState<string | null>(null)
  const [nombreActivo, setNombreActivo] = useState<string>('')

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  // Detectar sesión(es) existentes (cero fricción, con confirmación —
  // CA-01.5 rediseñado 2026-08-24). Guardamos un ARREGLO por vacante, no un
  // solo objeto: si más de una persona se postula desde el mismo teléfono a
  // la misma vacante, no queremos perder a ninguna de las 2 la próxima vez
  // que alguna regrese. Compatible con el formato viejo (objeto único).
  const sesiones: SesionGuardada[] = (() => {
    if (typeof window === 'undefined') return []
    const raw = localStorage.getItem(`chat_sesion_${vacanteId}`)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      return []
    }
  })()
  const [decisionSesion, setDecisionSesion] = useState<'pendiente' | 'decidida'>(sesiones.length > 0 ? 'pendiente' : 'decidida')

  // HU-17 — Agente de pre-calificación
  const [preguntas, setPreguntas] = useState<Pregunta[] | null>(null) // null = aún cargando
  const [indicePregunta, setIndicePregunta] = useState(0)
  const [noCalifico, setNoCalifico] = useState(false)
  const [preguntaQueFallo, setPreguntaQueFallo] = useState('')
  const [alternativas, setAlternativas] = useState<VacanteAlternativa[]>([])
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [textoLibre, setTextoLibre] = useState('')

  useEffect(() => {
    // Mientras haya una sesión sin confirmar, no cargamos preguntas todavía
    // — esperamos a que el candidato diga si de verdad es él (ver JSX abajo)
    if (decisionSesion === 'pendiente') return

    async function cargarPreguntas() {
      const supabase = createClient()
      const { data } = await supabase
        .from('vacantes')
        .select('preguntas_precalificacion')
        .eq('id', vacanteId)
        .maybeSingle()
      setPreguntas((data?.preguntas_precalificacion as Pregunta[]) ?? [])
    }
    cargarPreguntas()
  }, [decisionSesion])

  // "Sí, soy yo" (o "soy este de la lista") — trae la etapa real actual
  // (no la que quedó guardada de la última vez) y abre el chat directo.
  async function confirmarEsMismoCandidato(elegida: SesionGuardada) {
    const supabase = createClient()
    const { data: candidato } = await supabase
      .from('candidatos')
      .select('id')
      .eq('telefono', elegida.telefono)
      .maybeSingle()

    if (candidato) {
      const { data: postulacion } = await supabase
        .from('postulaciones')
        .select('etapa_actual')
        .eq('candidato_id', candidato.id)
        .eq('vacante_id', vacanteId)
        .maybeSingle()
      if (postulacion) setEtapaActual(postulacion.etapa_actual)
    }

    setChatIdActivo(elegida.chatId)
    setNombreActivo(elegida.nombre)
    setMensajeExito('¡Bienvenido de nuevo! Aquí puedes seguir la conversación.')
    setDecisionSesion('decidida')
    setEnviado(true)
  }

  // "No, soy alguien más" / "Ninguno de estos" — sigue el camino normal
  // (formulario + precalificación si aplica). No borra las sesiones
  // guardadas — si esta persona termina postulándose, se AGREGA a la
  // lista, no reemplaza a las anteriores.
  function noEsMismoCandidato() {
    setPreguntas(null)
    setDecisionSesion('decidida')
  }

  async function responderPregunta(pregunta: Pregunta, respuesta: string) {
    const esInformativa = pregunta.tipo === 'texto_libre' || (pregunta.tipo === 'opcion_multiple' && !pregunta.respuesta_correcta)
    if (esInformativa || respuesta === pregunta.respuesta_correcta) {
      setRespuestas(prev => ({ ...prev, [pregunta.pregunta]: respuesta }))
      setTextoLibre('')
      if (preguntas && indicePregunta < preguntas.length - 1) {
        setIndicePregunta(i => i + 1)
      } else setIndicePregunta(i => i + 1)
      return
    }

    const supabase = createClient()
    await supabase.from('precalificaciones_fallidas').insert({
      vacante_id: vacanteId,
      pregunta_fallida: pregunta.pregunta,
    })

    const { data: vacante } = await supabase.from('vacantes').select('estado').eq('id', vacanteId).maybeSingle()
    const { data: alternativasData } = await supabase
      .from('vacantes')
      .select('id, titulo, ciudad, estado')
      .eq('status', 'vigente')
      .eq('estado', vacante?.estado ?? '')
      .neq('id', vacanteId)
      .order('destacada', { ascending: false })
      .limit(3)

    setAlternativas(alternativasData ?? [])
    setPreguntaQueFallo(pregunta.pregunta)
    setNoCalifico(true)
  }

  async function handleSubmit() {
    if (!nombre.trim()) { setError('Ingresa tu nombre'); return }
    if (telefono.trim().length < 10) { setError('Ingresa un teléfono válido de 10 dígitos'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/postular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          telefono: telefono.trim(),
          vacanteId,
          reclutadorId: reclutadorId ?? null,
          codigoRef: getCodigoReferido(),
          precalificado: preguntas ? preguntas.length > 0 : false,
          respuestasPrecalificacion: respuestas
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Ocurrió un error, intenta de nuevo')
      } else {
        if (data.chatId) {
          // Se AGREGA a la lista de sesiones de esta vacante (sin duplicar
          // si esta misma persona ya estaba, ej. reintento) — así el
          // dispositivo recuerda a todos los que se postularon desde él.
          const nuevaSesion: SesionGuardada = {
            telefono: telefono.trim(),
            nombre: nombre.trim(),
            chatId: data.chatId,
            vacanteId
          }
          const sinDuplicado = sesiones.filter(s => s.telefono !== nuevaSesion.telefono)
          const actualizadas = [...sinDuplicado, nuevaSesion].slice(-MAX_SESIONES_GUARDADAS)
          localStorage.setItem(`chat_sesion_${vacanteId}`, JSON.stringify(actualizadas))

          setChatIdActivo(data.chatId)
          setNombreActivo(nombre.trim())
        }
        if (data.etapaActual) setEtapaActual(data.etapaActual)
        setMensajeExito(data.yaExistia
          ? '¡Ya estabas postulado! Un reclutador se pondrá en contacto contigo pronto.'
          : '¡Postulación enviada! Un reclutador se pondrá en contacto contigo pronto.'
        )
        setEnviado(true)
      }
    } catch {
      setError('Error de conexión, intenta de nuevo')
    }

    setLoading(false)
  }

  // Confirmación de identidad — antes que cualquier otra cosa
  if (decisionSesion === 'pendiente') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Postularme</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">✕</button>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            {sesiones.length === 1
              ? <>¿Sigues siendo <strong>{sesiones[0].nombre}</strong>? Ya tienes una conversación abierta para esta vacante.</>
              : 'Ya hay conversaciones abiertas desde este dispositivo para esta vacante. ¿Eres alguno de ellos?'}
          </p>
          <div className="space-y-2">
            {sesiones.map(s => (
              <button
                key={s.chatId}
                onClick={() => confirmarEsMismoCandidato(s)}
                className="w-full bg-[#1A6B3C] hover:bg-[#155c33] text-white font-semibold py-3 rounded-xl text-sm"
              >
                {sesiones.length === 1 ? 'Sí, continuar' : `Soy ${s.nombre}`}
              </button>
            ))}
            <button
              onClick={noEsMismoCandidato}
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-xl text-sm"
            >
              {sesiones.length === 1 ? 'No, soy alguien más' : 'Ninguno, soy nuevo'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // HU-17 — todavía cargando las preguntas de esa vacante
  if (preguntas === null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center text-gray-400 text-sm">
          Cargando...
        </div>
      </div>
    )
  }

  // HU-17 — no pasó el filtro (CA-17.2)
  if (noCalifico) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Postularme</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">✕</button>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Para esta vacante necesitas: <strong>{preguntaQueFallo.replace(/[¿?]/g, '')}</strong>. En este momento no cumples el perfil, pero tenemos otras vacantes donde podrías encajar:
          </p>
          {alternativas.length === 0 ? (
            <p className="text-sm text-gray-400">No tenemos otras vacantes disponibles en este momento.</p>
          ) : (
            <div className="space-y-2">
              {alternativas.map(v => (
                <div key={v.id} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-sm font-semibold text-gray-800">{v.titulo}</p>
                  <p className="text-xs text-gray-500">📍 {v.ciudad}, {v.estado}</p>
                </div>
              ))}
            </div>
          )}
          <button onClick={onClose} className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium text-sm">
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  // HU-17 — quiz de pre-calificación (CA-17.1), antes del formulario normal
  if (preguntas.length > 0 && indicePregunta < preguntas.length) {
    const p = preguntas[indicePregunta]
    const opciones = p.tipo === 'si_no' ? ['Sí', 'No'] : (p.opciones ?? [])
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Pregunta {indicePregunta + 1} de {preguntas.length}</span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">✕</button>
          </div>
          <p className="text-sm font-medium text-gray-900 mb-4">{p.pregunta}</p>
          {p.tipo === 'texto_libre' ? (
            <div className="space-y-2">
              <textarea
                value={textoLibre}
                onChange={e => setTextoLibre(e.target.value)}
                placeholder="Escribe tu respuesta..."
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C] resize-none"
              />
              <button
                onClick={() => responderPregunta(p, textoLibre.trim())}
                className="w-full bg-[#1A6B3C] hover:bg-[#155c33] text-white font-medium py-2.5 rounded-xl text-sm"
              >
                Continuar
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {opciones.map(op => (
                <button
                  key={op}
                  onClick={() => responderPregunta(p, op)}
                  className="w-full text-left border border-gray-200 hover:border-[#1A6B3C] hover:bg-green-50 rounded-xl px-4 py-3 text-sm text-gray-700 transition-colors"
                >
                  {op}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (enviado) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl flex flex-col" style={{ height: '85vh', maxHeight: '600px' }}>
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
            <p className="text-xl">
              {mensajeExito.includes('Ya estabas') || mensajeExito.includes('Bienvenido') ? '👀' : '🎉'}
            </p>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">
                {mensajeExito.includes('Ya estabas') || mensajeExito.includes('Bienvenido') ? '¡Ya estás en proceso!' : '¡Postulación enviada!'}
              </p>
              <p className="text-xs text-gray-500 line-clamp-2">{mensajeExito}</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm flex-shrink-0">✕</button>
          </div>
          {chatIdActivo && (
            <div className="flex flex-col flex-1 min-h-0">
              <ChatWindow
                chatId={chatIdActivo}
                nombreCandidato={nombreActivo}
                etapaActual={etapaActual}
                onClose={onClose}
              />
            </div>
          )}
          {!chatIdActivo && (
            <div className="p-4">
              <button
                onClick={onClose}
                className="w-full bg-[#1A6B3C] text-white py-3 rounded-xl font-semibold"
              >
                Entendido
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Postularme</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Vacante: <strong className="text-gray-700">{vacanteTitulo}</strong>
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej. Juan Pérez García"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Teléfono (10 dígitos)
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={e => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Ej. 8112345678"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#1A6B3C] hover:bg-[#155c33] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? 'Enviando...' : '💬 Enviar postulación'}
          </button>
        </div>
      </div>
    </div>
  )
}
