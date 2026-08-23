import { createClient } from '@/lib/supabase/server'
import VacantesPortal from '@/components/candidato/VacantesPortal'

export const revalidate = 0 // nunca cachear — siempre datos frescos de Supabase

export default async function Home() {
  const supabase = await createClient()
  const { data: vacantes } = await supabase
    .from('vacantes')
    .select(`
      id, titulo, descripcion, requisitos, beneficios,
      letras_chiquitas, salario_min, salario_max, salario_tipo, salario_periodo,
      salario_visible, ciudad, estado, colonia_zona,
      modalidad, jornada, horario, turno, tipo_contrato,
      tiene_ruta, zonas_ruta, ruta_para_entrevista,
      estacionamiento, comedor, uniforme,
      empresa_visible, destacada, prioridad, status, created_at,
      requiere_examen_medico, requiere_antidoping, 
      negocios(nombre, documentos_negocio(id, nombre_archivo, archivo_url))
    `)
    .eq('status', 'vigente')
    .order('destacada', { ascending: false })
    .order('created_at', { ascending: false })

  const vacantesFormateadas = (vacantes ?? []).map(v => ({
    ...v,
    negocios: Array.isArray(v.negocios) ? v.negocios[0] ?? null : v.negocios
  }))

  return <VacantesPortal vacantes={vacantesFormateadas} />
}