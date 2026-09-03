// Catálogo único de plataformas soportadas — usado por el selector del
// reclutador (app/reclutador/perfil/page.tsx), el widget público
// (components/shared/RedesSocialesFooter.tsx) y la validación del
// endpoint (app/api/reclutador/perfil/route.ts). Un solo lugar de verdad,
// mismo criterio que DOCUMENTOS_TRONCO_COMUN en excel-vacantes.ts (7.47)
// — evita que un valor se acepte en un lado y no se reconozca en otro.

export interface RedSocial {
  plataforma: string
  url: string
}

export const MAX_REDES_SOCIALES = 6

export const PLATAFORMAS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'otro', label: 'Otro' },
] as const

export type PlataformaValue = typeof PLATAFORMAS[number]['value']

// Actualizado 2026-09-04: José subió los 6 íconos reales a /public
// (mismo formato que fb_icon.png). Ya no hay emoji ni caso especial de
// Facebook en ningún componente — un solo <img> para las 7 plataformas.
export const ICONO_PLATAFORMA: Record<string, string> = {
  facebook: '/fb_icon.png',
  instagram: '/instagram_icon.png',
  tiktok: '/tiktok_icon.png',
  whatsapp: '/whatsapp_icon.png',
  youtube: '/youtube_icon.png',
  x: '/x_icon.png',
  otro: '/otro_icon.png',
}

export function iconoPlataforma(value: string): string {
  return ICONO_PLATAFORMA[value] ?? ICONO_PLATAFORMA.otro
}

export function nombrePlataforma(value: string): string {
  return PLATAFORMAS.find(p => p.value === value)?.label ?? value
}

// Validación server-side (usada también por el endpoint) — no confía
// solo en que el frontend mande datos limpios.
export function validarRedesSociales(redes: any): redes is RedSocial[] {
  if (!Array.isArray(redes)) return false
  if (redes.length > MAX_REDES_SOCIALES) return false
  const valoresValidos = PLATAFORMAS.map(p => p.value)
  return redes.every(r =>
    r &&
    typeof r.plataforma === 'string' &&
    valoresValidos.includes(r.plataforma) &&
    typeof r.url === 'string' &&
    /^https?:\/\/.+/.test(r.url.trim())
  )
}