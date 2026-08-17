import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSemanaISO(fecha: Date = new Date()): string {
  const date = new Date(fecha)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  const week1 = new Date(date.getFullYear(), 0, 4)
  const weekNum = 1 + Math.round(
    ((date.getTime() - week1.getTime()) / 86400000 - 3 +
    (week1.getDay() + 6) % 7) / 7
  )
  return `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

export function calcularComision(
  vacante: {
    tiene_promocion: boolean
    promocion_fin: string | null
    promocion_monto_mxn: number | null
    comision_base_mxn: number
  },
  fechaContratacion: string
): { monto: number; esPromocion: boolean } {
  if (
    vacante.tiene_promocion &&
    vacante.promocion_fin &&
    new Date(fechaContratacion) <= new Date(vacante.promocion_fin)
  ) {
    return { monto: vacante.promocion_monto_mxn ?? 0, esPromocion: true }
  }
  return { monto: vacante.comision_base_mxn, esPromocion: false }
}

export function calcularGarantiaFin(
  fechaContratacion: string,
  diasGarantia: number
): string {
  // Mantenido por compatibilidad — usar calcularGarantiaFinHabil() para el
  // cálculo correcto que respeta días de descanso (ver CA-02.8).
  const fecha = new Date(fechaContratacion)
  fecha.setDate(fecha.getDate() + diasGarantia)
  return fecha.toISOString().split('T')[0]
}

/**
 * CA-02.8 — Calcula fecha_garantia_fin contando solo días HÁBILES,
 * saltándose los días de descanso configurados por empresa (negocios.dias_descanso).
 *
 * @param fechaInicio - fecha de inicio de inducción (YYYY-MM-DD)
 * @param diasGarantia - número de días de garantía a cumplir (vacantes.dias_garantia)
 * @param diasDescanso - array de días de la semana que NO cuentan (0=Domingo...6=Sábado)
 */
export function calcularGarantiaFinHabil(
  fechaInicio: string,
  diasGarantia: number,
  diasDescanso: number[] = [0],
  diasInduccion: number = 0,
  induccionDentroGarantia: boolean = true
): string {
  const fecha = new Date(fechaInicio + 'T00:00:00')
  let diasContados = 0

  // Si la inducción NO va dentro de la garantía, la garantía empieza a
  // contar hasta que terminan los días de inducción — equivale a contar
  // diasInduccion + diasGarantia días hábiles de corrido desde el inicio.
  const diasTotales = induccionDentroGarantia ? diasGarantia : diasGarantia + diasInduccion

  while (diasContados < diasTotales) {
    fecha.setDate(fecha.getDate() + 1)
    if (!diasDescanso.includes(fecha.getDay())) {
      diasContados++
    }
  }

  return fecha.toISOString().split('T')[0]
}