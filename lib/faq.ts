// 4.14/4.15 — Agente FAQ, Niveles 1 y 2 (ver spec.md CA-03.4/CA-03.5).
// Determinístico, sin IA — solo coincidencia de palabras clave.

export interface VacanteParaFaq {
  status: string
  tiene_ruta: boolean
  zonas_ruta: string[]
  ruta_para_entrevista: boolean
  estacionamiento: boolean
  comedor: boolean
  uniforme: boolean
  horario: string | null
  turno: string | null
  dias_garantia: number
  comision_base_mxn: number
  punto_reunion: string | null
  dias_entrevista?: number[]
}

const NOMBRES_DIA_CORTO: Record<number, string> = {
  0: 'domingo', 1: 'lunes', 2: 'martes', 3: 'miércoles', 4: 'jueves', 5: 'viernes', 6: 'sábado',
}

function normalizar(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

interface ReglaNivel1 {
  palabras: string[]
  responder: (v: VacanteParaFaq) => string
}

const REGLAS_NIVEL1: ReglaNivel1[] = [
  {
    palabras: ['vigente', 'activa', 'sigue abierta', 'sigue disponible'],
    responder: v => v.status === 'vigente'
      ? '✅ Sí, esta vacante sigue vigente.'
      : `❌ Esta vacante ya no está vigente (status: ${v.status}).`,
  },
  {
    palabras: ['ruta', 'transporte', 'camion'],
    responder: v => v.tiene_ruta
      ? `🚌 Sí, tiene ruta de transporte.${v.zonas_ruta?.length ? ` Zonas: ${v.zonas_ruta.join(', ')}.` : ''}${v.ruta_para_entrevista ? ' La ruta también aplica para ir a la entrevista.' : ''}`
      : '🚌 Esta vacante no tiene ruta de transporte.',
  },
  {
    palabras: ['dias de entrevista', 'que dias reciben', 'cuando entrevista'],
    responder: v => {
      const dias = v.dias_entrevista
      if (!dias || dias.length === 0) return 'No hay días de entrevista específicos configurados para esta empresa.'
      return `📅 Esta empresa recibe candidatos a entrevista: ${[...dias].sort().map(d => NOMBRES_DIA_CORTO[d]).join(', ')}.`
    },
  },
  {
    palabras: ['estacionamiento', 'parking'],
    responder: v => v.estacionamiento ? '🅿️ Sí, cuenta con estacionamiento.' : '🅿️ No cuenta con estacionamiento.',
  },
  {
    palabras: ['comedor'],
    responder: v => v.comedor ? '🍽️ Sí, cuenta con comedor.' : '🍽️ No cuenta con comedor.',
  },
  {
    palabras: ['uniforme'],
    responder: v => v.uniforme ? '👕 Sí, la empresa da uniforme.' : '👕 La empresa no da uniforme.',
  },
  {
    palabras: ['horario', 'turno'],
    responder: v => {
      const partes: string[] = []
      if (v.turno) partes.push(`Turno: ${v.turno}`)
      if (v.horario) partes.push(`Horario: ${v.horario}`)
      return partes.length > 0 ? `🕐 ${partes.join(' · ')}` : 'No hay información de horario capturada.'
    },
  },
  {
    palabras: ['garantia', 'dias de garantia'],
    responder: v => `🛡️ Los días de garantía son ${v.dias_garantia} días.`,
  },
  {
    palabras: ['comision', 'cuanto pagan', 'cuanto se gana', 'cuanto es la comision'],
    responder: v => `💰 La comisión base es $${v.comision_base_mxn?.toLocaleString('es-MX')} MXN.`,
  },
  {
    palabras: ['punto de reunion', 'donde es la entrevista', 'donde nos vemos'],
    responder: v => v.punto_reunion
      ? `📍 Punto de reunión: ${v.punto_reunion}`
      : 'No hay un punto de reunión específico capturado.',
  },
]

/** Nivel 1 — coincide con un campo estructurado de la vacante. Instantáneo, sin IA. */
export function buscarRespuestaNivel1(pregunta: string, vacante: VacanteParaFaq): string | null {
  const preguntaNorm = normalizar(pregunta)
  for (const regla of REGLAS_NIVEL1) {
    if (regla.palabras.some(p => preguntaNorm.includes(normalizar(p)))) {
      return regla.responder(vacante)
    }
  }
  return null
}

const STOPWORDS = new Set([
  'que', 'la', 'el', 'de', 'en', 'y', 'a', 'los', 'las', 'un', 'una', 'es', 'para',
  'con', 'se', 'como', 'esta', 'este', 'hay', 'tiene', 'cual', 'cuales', 'cuando', 'donde',
])

function palabrasClave(texto: string): string[] {
  return normalizar(texto)
    .replace(/[¿?¡!.,]/g, '')
    .split(/\s+/)
    .filter(p => p.length > 2 && !STOPWORDS.has(p))
}

/** Nivel 2 — busca una pregunta parecida ya contestada antes para esa vacante. Sin IA. */
export function buscarRespuestaNivel2(
  pregunta: string,
  faqsExistentes: { pregunta: string; respuesta: string }[]
): { respuesta: string; preguntaOriginal: string } | null {
  const palabrasNueva = new Set(palabrasClave(pregunta))
  if (palabrasNueva.size === 0) return null

  let mejor: { faq: { pregunta: string; respuesta: string }; score: number } | null = null
  for (const faq of faqsExistentes) {
    const palabrasFaq = new Set(palabrasClave(faq.pregunta))
    const comunes = [...palabrasNueva].filter(p => palabrasFaq.has(p)).length
    if (comunes >= 2 && (!mejor || comunes > mejor.score)) {
      mejor = { faq, score: comunes }
    }
  }
  return mejor ? { respuesta: mejor.faq.respuesta, preguntaOriginal: mejor.faq.pregunta } : null
}
