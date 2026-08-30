// Definición compartida de columnas para Importar/Exportar/Plantilla de vacantes.
// Homologado 2026-08-10 (ver spec.md HU-08 actualizada) — mismo set de columnas
// en los 3 lugares, cubriendo las 8 secciones de VacanteModal.

// Documentos de "tronco común" (2026-08-30) — fuente única de verdad,
// compartida entre VacanteModal.tsx (los 8 checkboxes) e
// Importar/Exportar. Antes cada lado tenía su propia copia del texto
// exacto, y una diferencia de una sola letra hacía que el checkbox no
// se marcara al importar — causa raíz real reportada por José. Ahora
// solo existe en un lugar; VacanteModal.tsx importa este array en vez
// de declarar el suyo propio.
export const DOCUMENTOS_TRONCO_COMUN = [
  'RFC (Constancia de situación fiscal)',
  'INE vigente',
  'Comprobante de domicilio (no mayor a 3 meses)',
  'CURP',
  'NSS (Hoja de seguridad social IMSS)',
  'Acta de nacimiento',
  'Hoja de retención Infonavit (de contar con crédito)',
  'Comprobante de estudios',
]
// Nombre corto para la columna del Excel — mismo orden/índice que el
// array de arriba, para poder emparejarlos por posición.
export const COLUMNAS_TRONCO_COMUN = [
  'RFC', 'INE', 'COMPROBANTE DE DOMICILIO', 'CURP', 'NSS',
  'ACTA DE NACIMIENTO', 'RETENCIÓN INFONAVIT', 'COMPROBANTE DE ESTUDIOS',
]

export const NOMBRES_JORNADA: Record<string, string> = {
  completo: 'Tiempo completo', medio: 'Medio tiempo', proyecto: 'Por proyecto', fines: 'Fines de semana'
}
export const JORNADA_INVERSO: Record<string, string> = Object.fromEntries(
  Object.entries(NOMBRES_JORNADA).map(([k, v]) => [v.toLowerCase(), k])
)

export const NOMBRES_MODALIDAD: Record<string, string> = {
  presencial: 'Presencial', hibrido: 'Híbrido', remoto: 'Remoto'
}
export const MODALIDAD_INVERSO: Record<string, string> = Object.fromEntries(
  Object.entries(NOMBRES_MODALIDAD).map(([k, v]) => [v.toLowerCase(), k])
)

export const NOMBRES_SALARIO_TIPO: Record<string, string> = { neto: 'Neto', bruto: 'Bruto', convenir: 'A convenir', segun_experiencia: 'Según experiencia' }
export const SALARIO_TIPO_INVERSO: Record<string, string> = Object.fromEntries(
  Object.entries(NOMBRES_SALARIO_TIPO).map(([k, v]) => [v.toLowerCase(), k])
)
export const NOMBRES_PERIODO: Record<string, string> = {
  semanal: 'Semanales', quincenal: 'Quincenales', mensual: 'Mensuales', por_hora: 'Por hora'
}
export const PERIODO_INVERSO: Record<string, string> = Object.fromEntries(
  Object.entries(NOMBRES_PERIODO).map(([k, v]) => [v.toLowerCase(), k])
)

// Acepta 3 formas en que Excel puede entregar una fecha: texto exacto
// "DD/MM/AAAA" (como antes), una fecha real de Excel (Date, cuando la
// celda se guardó como fecha de verdad — el caso más común al usar el
// selector de fecha, y el que se estaba descartando en silencio antes
// de este fix), o un número de serie de Excel (por si cellDates no
// llegó a convertirla).
export function parsearFecha(fecha: string | number | Date | null | undefined): string | null {
  if (!fecha) return null

  if (fecha instanceof Date && !isNaN(fecha.getTime())) {
    const anio = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    return `${anio}-${mes}-${dia}`
  }

  if (typeof fecha === 'number') {
    const base = new Date(Date.UTC(1899, 11, 30)) // época de Excel
    const resultado = new Date(base.getTime() + fecha * 86400000)
    const anio = resultado.getUTCFullYear()
    const mes = String(resultado.getUTCMonth() + 1).padStart(2, '0')
    const dia = String(resultado.getUTCDate()).padStart(2, '0')
    return `${anio}-${mes}-${dia}`
  }

  const texto = String(fecha).trim()
  const [dia, mes, anio] = texto.split('/')
  if (!dia || !mes || !anio) return null
  return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
}

// 5 de agosto 2026-08-18: mapa de días de la semana para DÍAS DE DESCANSO EMPRESA.
// Se usan 3 letras (no 1 sola) porque una sola letra es ambigua entre Martes y Miércoles.
export const DIAS_SEMANA_INVERSO: Record<string, number> = {
  DOM: 0, LUN: 1, MAR: 2, MIE: 3, JUE: 4, VIE: 5, SAB: 6,
}
export const DIAS_SEMANA_NOMBRES: Record<number, string> = {
  0: 'DOM', 1: 'LUN', 2: 'MAR', 3: 'MIE', 4: 'JUE', 5: 'VIE', 6: 'SAB',
}

export function parsearDiasDescanso(texto: string): number[] {
  if (!texto) return []
  return texto
    .split(',')
    .map(d => DIAS_SEMANA_INVERSO[d.trim().toUpperCase()])
    .filter((d): d is number => d !== undefined)
}

export function formatearDiasDescanso(dias: number[] | null | undefined): string {
  if (!dias || dias.length === 0) return ''
  return [...dias].sort((a, b) => a - b).map(d => DIAS_SEMANA_NOMBRES[d]).join(', ')
}

export function normalizarNombre(texto: string): string {
  return texto
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

// Columnas fijas, en orden — las de REQUISITO_N y BENEFICIO_N se calculan aparte
export const COLUMNAS_FIJAS = [
  'ID', 'FECHA', 'TÍTULO', 'EMPRESA', 'MOSTRAR EMPRESA', 'DESTACADA',
  'ESTADO', 'MUNICIPIO', 'ZONA', 'MODALIDAD',
  'SALARIO MÍNIMO', 'SALARIO MÁXIMO', 'TIPO SALARIO', 'PERIODO SALARIO', 'MOSTRAR SALARIO',
  'JORNADA', 'TURNO', 'HORARIO',
  'DESCRIPCIÓN', 'ETIQUETAS',
  'RUTA', 'RUTA PARA ENTREVISTA', 'ESTACIONAMIENTO', 'COMEDOR', 'UNIFORME',
  'LETRAS CHIQUITAS',
  'DÍAS DE GARANTÍA', 'COMISIÓN',
  'TIENE PROMOCIÓN', 'DESCRIPCIÓN PROMOCIÓN', 'MONTO PROMOCIÓN', 'VENCE PROMOCIÓN',
  'EXAMEN MÉDICO', 'ANTIDOPING', 'ESTUDIO SOCIOECONÓMICO',
  'CONTACTO RRHH NOMBRE', 'CONTACTO RRHH TELÉFONO', 'MEJOR HORARIO CONTACTO', 'PUNTO DE REUNIÓN',
  'QUÉ DECIRLE AL CANDIDATO', 'COMENTARIOS SALARIO',
  ...COLUMNAS_TRONCO_COMUN,
  'DÍAS DE INDUCCIÓN', 'INDUCCIÓN DENTRO DE GARANTÍA', 'DÍAS DE DESCANSO EMPRESA',
  'CUPO REQUERIDO', 'UBICACIÓN MAPS EMPRESA',
  'ESTATUS',
]

export const INSTRUCCIONES: { columna: string; campoSistema: string; descripcion: string; ejemplo: string }[] = [
  { columna: 'ID', campoSistema: '(interno)', descripcion: 'Déjalo vacío para vacantes nuevas. Solo se usa para actualizar una vacante que ya existe (viene lleno si exportaste antes).', ejemplo: '(vacío)' },
  { columna: 'FECHA', campoSistema: 'Fecha de publicación mostrada al candidato ("Hoy", "Hace 2 días"...)', descripcion: 'Controla la fecha que ve el candidato y el orden del listado (más reciente primero). Si la dejas vacía: en una vacante NUEVA toma la fecha de hoy; en una vacante YA EXISTENTE no se toca, se queda con la que ya tenía.', ejemplo: '04/09/2026' },
  { columna: 'TÍTULO', campoSistema: 'Sección 1 — Título', descripcion: 'Nombre del puesto. Obligatorio.', ejemplo: 'Ayudante General' },
  { columna: 'EMPRESA', campoSistema: 'Sección 1 — Empresa', descripcion: 'Nombre de la empresa cliente. Si no existe, se crea automáticamente.', ejemplo: 'Pastelería Lety' },
  { columna: 'MOSTRAR EMPRESA', campoSistema: 'Sección 1 — Mostrar empresa', descripcion: 'SI = el candidato ve el nombre real. NO = aparece como "Empresa Confidencial".', ejemplo: 'SI' },
  { columna: 'DESTACADA', campoSistema: 'Sección 1 — Destacada', descripcion: 'SI = aparece con badge especial en el portal.', ejemplo: 'NO' },
  { columna: 'ESTADO', campoSistema: 'Sección 2 — Estado', descripcion: 'Estado de la República. Obligatorio.', ejemplo: 'Nuevo León' },
  { columna: 'MUNICIPIO', campoSistema: 'Sección 2 — Ciudad o Municipio', descripcion: 'Municipio o alcaldía. Obligatorio.', ejemplo: 'Apodaca' },
  { columna: 'ZONA', campoSistema: 'Sección 2 — Colonia o zona', descripcion: 'Opcional. Ayuda al candidato a saber si le queda cerca.', ejemplo: 'Parque Industrial' },
  { columna: 'MODALIDAD', campoSistema: 'Sección 2 — Modalidad', descripcion: 'Presencial, Híbrido o Remoto.', ejemplo: 'Presencial' },
  { columna: 'SALARIO MÍNIMO', campoSistema: 'Sección 3 — Salario', descripcion: 'Solo el número, sin signo de pesos ni comas.', ejemplo: '2500' },
  { columna: 'SALARIO MÁXIMO', campoSistema: 'Sección 3 — Salario', descripcion: 'Opcional, si el salario es un rango.', ejemplo: '3000' },
  { columna: 'COMENTARIOS SALARIO', campoSistema: 'Sección 3 — Comentarios del salario', descripcion: 'Solo para el reclutador, el candidato nunca lo ve. Ej. cómo sube el salario con la experiencia.', ejemplo: 'Pago los Jueves. Nómina Santander. Semana desfasada.' },
  { columna: 'TIPO SALARIO', campoSistema: 'Sección 3 — Salario', descripcion: 'Neto, Bruto, A convenir, o Según experiencia (cuando el rango sí es real pero varía según la experiencia del candidato).', ejemplo: 'Bruto' },
  { columna: 'PERIODO SALARIO', campoSistema: 'Sección 3 — Salario', descripcion: 'Semanales, Quincenales, Mensuales o Por hora.', ejemplo: 'Semanales' },
  { columna: 'MOSTRAR SALARIO', campoSistema: 'Sección 3 — Mostrar salario', descripcion: 'SI = visible al candidato. NO = aparece "A convenir".', ejemplo: 'SI' },
  { columna: 'JORNADA', campoSistema: 'Sección 3 — Jornada', descripcion: 'Tiempo completo, Medio tiempo, Por proyecto o Fines de semana. Obligatorio.', ejemplo: 'Tiempo completo' },
  { columna: 'TURNO', campoSistema: 'Sección 3 — Turno', descripcion: 'Matutino, Vespertino, Nocturno, Rotativo o Turno fijo (varios turnos). Déjalo vacío si no aplica.', ejemplo: 'Rotativo' },
  { columna: 'HORARIO', campoSistema: 'Sección 3 — Horario detallado', descripcion: 'Texto libre con el detalle de horarios.', ejemplo: 'Turnos de 12h, 6:30am-6:30pm / 6:30pm-6:30am' },
  { columna: 'DESCRIPCIÓN', campoSistema: 'Sección 4 — Descripción', descripcion: 'Resumen de actividades del puesto.', ejemplo: 'Empaquetado y sellado de producto' },
  { columna: 'ETIQUETAS', campoSistema: 'Sección 4 — Etiquetas', descripcion: 'Palabras clave separadas por coma.', ejemplo: 'Almacén, Sin experiencia' },
  { columna: 'REQUISITO_1, REQUISITO_2...', campoSistema: 'Sección 4 — Requisitos', descripcion: 'Un requisito por columna. Agrega tantas columnas REQUISITO_N como necesites — el sistema las detecta automáticamente.', ejemplo: 'Secundaria terminada' },
  { columna: 'BENEFICIO_1, BENEFICIO_2...', campoSistema: 'Sección 4 — Beneficios', descripcion: 'Un beneficio por columna, mismo patrón que Requisitos.', ejemplo: 'Vales de despensa' },
  { columna: 'RUTA', campoSistema: 'Sección 5 — ¿Tiene ruta?', descripcion: 'SI o NO.', ejemplo: 'SI' },
  { columna: 'RUTA PARA ENTREVISTA', campoSistema: 'Sección 5 — Ruta para entrevista', descripcion: 'SI o NO.', ejemplo: 'NO' },
  { columna: 'ESTACIONAMIENTO', campoSistema: 'Sección 5 — Estacionamiento', descripcion: 'SI o NO.', ejemplo: 'SI' },
  { columna: 'COMEDOR', campoSistema: 'Sección 5 — Comedor', descripcion: 'SI o NO.', ejemplo: 'SI' },
  { columna: 'UNIFORME', campoSistema: 'Sección 5 — Uniforme', descripcion: 'SI o NO.', ejemplo: 'NO' },
  { columna: 'LETRAS CHIQUITAS', campoSistema: 'Sección 6 — Letras chiquitas', descripcion: 'Avisos que el candidato debe saber antes de llegar.', ejemplo: 'Sin tatuajes en la cara' },
  { columna: 'DÍAS DE GARANTÍA', campoSistema: 'Sección 7 — Días de garantía', descripcion: 'Número entero. Obligatorio.', ejemplo: '30' },
  { columna: 'DÍAS DE INDUCCIÓN', campoSistema: 'Sección 7 — Días de inducción', descripcion: 'Número entero. Déjalo en 0 o vacío si no aplica.', ejemplo: '2' },
  { columna: 'INDUCCIÓN DENTRO DE GARANTÍA', campoSistema: 'Sección 7 — Inducción dentro de garantía', descripcion: 'SI = los días de inducción cuentan como parte de la garantía. NO = la garantía empieza a contar hasta que termina la inducción.', ejemplo: 'SI' },
  { columna: 'COMISIÓN', campoSistema: 'Sección 7 — Comisión base', descripcion: 'Solo el número, sin signo de pesos. Obligatorio.', ejemplo: '2500' },
  { columna: 'TIENE PROMOCIÓN', campoSistema: 'Sección 7 — Promoción', descripcion: 'SI o NO.', ejemplo: 'NO' },
  { columna: 'DESCRIPCIÓN PROMOCIÓN', campoSistema: 'Sección 7 — Promoción', descripcion: 'Solo si TIENE PROMOCIÓN = SI.', ejemplo: 'Bono de lanzamiento' },
  { columna: 'MONTO PROMOCIÓN', campoSistema: 'Sección 7 — Promoción', descripcion: 'Solo el número.', ejemplo: '3500' },
  { columna: 'VENCE PROMOCIÓN', campoSistema: 'Sección 7 — Promoción', descripcion: 'Formato DD/MM/AAAA.', ejemplo: '30/09/2026' },
  { columna: 'EXAMEN MÉDICO', campoSistema: 'Sección 8 — Examen médico', descripcion: 'SI o NO. Visible al candidato.', ejemplo: 'SI' },
  { columna: 'ANTIDOPING', campoSistema: 'Sección 8 — Antidoping', descripcion: 'SI o NO. Visible al candidato.', ejemplo: 'NO' },
  { columna: 'ESTUDIO SOCIOECONÓMICO', campoSistema: 'Sección 8 — Estudio socioeconómico', descripcion: 'SI o NO. Solo para el reclutador.', ejemplo: 'NO' },
  { columna: 'CONTACTO RRHH NOMBRE', campoSistema: 'Sección 8 — Contacto RRHH (opcional)', descripcion: 'Solo si el reclutador tendrá contacto directo con la empresa.', ejemplo: '(vacío)' },
  { columna: 'CONTACTO RRHH TELÉFONO', campoSistema: 'Sección 8 — Contacto RRHH (opcional)', descripcion: '10 dígitos, sin espacios ni guiones.', ejemplo: '(vacío)' },
  { columna: 'DOCUMENTO_1, DOCUMENTO_2...', campoSistema: 'Sección 8 — Documentos requeridos (extra)', descripcion: 'Solo documentos EXTRA que la empresa pida además de los de "tronco común" (esos 8 ya tienen su propia columna SI/NO, ver más abajo — no los repitas aquí). Un documento por columna. Mismo patrón que Requisitos/Beneficios.', ejemplo: 'Certificado de manejo de montacargas' },
  ...DOCUMENTOS_TRONCO_COMUN.map((nombreCompleto, i) => ({
    columna: COLUMNAS_TRONCO_COMUN[i],
    campoSistema: 'Sección 8 — Documentos de tronco común',
    descripcion: `SI o NO — si la empresa pide "${nombreCompleto}". Antes había que escribir el nombre completo en DOCUMENTO_N, y una sola letra distinta a como lo espera el sistema hacía que el checkbox no se marcara al importar — con SI/NO ese problema ya no puede pasar.`,
    ejemplo: 'SI',
  })),
  { columna: 'MEJOR HORARIO CONTACTO', campoSistema: 'Sección 8 — Contacto RRHH (opcional)', descripcion: 'Texto libre.', ejemplo: '(vacío)' },
  { columna: 'PUNTO DE REUNIÓN', campoSistema: 'Sección 8 — Punto de reunión (opcional)', descripcion: 'Dónde debe presentarse el candidato.', ejemplo: 'Recepción de planta, entrada principal' },
  { columna: 'QUÉ DECIRLE AL CANDIDATO', campoSistema: 'Sección 8 — Qué decirle al candidato', descripcion: 'Instrucciones para el reclutador: salario, horario, qué llevar, con quién preguntar.', ejemplo: 'Preséntate con INE y CURP, pregunta por Lic. Torres' },
  { columna: 'DÍAS DE DESCANSO EMPRESA', campoSistema: '(campo de la EMPRESA, no de la vacante)', descripcion: 'Días que NO cuentan para calcular la garantía. Abreviaturas de 3 letras separadas por coma: LUN, MAR, MIE, JUE, VIE, SAB, DOM. Aplica a TODAS las vacantes de esa empresa — si la misma EMPRESA aparece en varias filas con valores distintos, gana el de la última fila.', ejemplo: 'SAB, DOM' },
  { columna: 'DÍAS DE ENTREVISTA EMPRESA', campoSistema: '(campo de la EMPRESA, no de la vacante)', descripcion: 'Días en que la empresa RECIBE candidatos a entrevista. Distinto de "Días de descanso" (ese afecta la garantía, este bloquea agendar). Mismo formato: abreviaturas de 3 letras separadas por coma (LUN, MAR, MIE, JUE, VIE, SAB, DOM). Aplica a TODAS las vacantes de esa empresa — si la misma EMPRESA aparece en varias filas con valores distintos, gana el de la última fila. Vacío = sin restricción configurada.', ejemplo: 'LUN, MIE, VIE' },
  { columna: 'RUTA_1_NOMBRE, RUTA_2_NOMBRE...', campoSistema: '(campo de la EMPRESA, no de la vacante)', descripcion: 'Nombre de cada ruta de transporte de la empresa. Agrega tantos pares RUTA_N_NOMBRE/RUTA_N_PARADAS como rutas tenga — el sistema los detecta automáticamente. Solo aplica si RUTA = SI. Aplica a TODAS las vacantes de esa empresa — si la misma EMPRESA aparece en varias filas con valores distintos, gana el de la última fila.', ejemplo: 'Ruta Norte' },
  { columna: 'RUTA_1_PARADAS, RUTA_2_PARADAS...', campoSistema: '(campo de la EMPRESA, no de la vacante)', descripcion: 'Paradas de esa ruta específica, separadas por coma dentro de la misma celda. Debe venir en pareja con su RUTA_N_NOMBRE correspondiente (mismo número N).', ejemplo: 'Apodaca, Escobedo, Guadalupe' },
  { columna: 'CUPO REQUERIDO', campoSistema: 'Sección 7 — Cupo requerido', descripcion: 'Cuántas personas necesita la empresa para esta vacante. Cuando se cubre, la vacante se pausa sola. Número entero. Si se deja vacío, se asume 1.', ejemplo: '3' },
  { columna: 'UBICACIÓN MAPS EMPRESA', campoSistema: '(campo de la EMPRESA, no de la vacante)', descripcion: 'Link de Google Maps de la empresa/fábrica. Solo lo ve el reclutador en su ficha de la vacante — el candidato nunca lo ve. Aplica a TODAS las vacantes de esa empresa — si la misma EMPRESA aparece en varias filas con valores distintos, gana el de la última fila.', ejemplo: 'https://maps.app.goo.gl/...' },
  { columna: 'ESTATUS', campoSistema: 'Vigente/No vigente (toggle Sección 8)', descripcion: 'Vigente o No vigente.', ejemplo: 'Vigente' },
]

export function esSiNo(valor: string | boolean | undefined | null): boolean {
  if (typeof valor === 'boolean') return valor
  return String(valor ?? '').trim().toUpperCase() === 'SI'
}

export function generarHojaInstrucciones(): any[][] {
  return [
    ['REGLAS DE ORO'],
    ['1. NO cambies los encabezados de la Hoja 1 (TÍTULO, EMPRESA, etc.)'],
    ['2. Los campos SI/NO siempre van en mayúsculas: SI o NO'],
    ['3. Fechas en formato DD/MM/AAAA'],
    ['4. Para REQUISITOS, BENEFICIOS y DOCUMENTOS: usa una columna por cada uno (REQUISITO_1, REQUISITO_2..., BENEFICIO_1..., DOCUMENTO_1...) — agrega tantas como necesites, el sistema las detecta solas'],
    ['5. Los campos OBLIGATORIOS son: TÍTULO, ESTADO, MUNICIPIO, JORNADA, DÍAS DE GARANTÍA, COMISIÓN'],
    [],
    ['COLUMNA', 'SE RELACIONA CON (en el modal "+ Nueva vacante")', 'QUÉ PONER', 'EJEMPLO'],
    ...INSTRUCCIONES.map(i => [i.columna, i.campoSistema, i.descripcion, i.ejemplo]),
  ]
}
