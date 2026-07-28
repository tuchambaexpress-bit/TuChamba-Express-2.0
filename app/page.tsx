import { createClient } from '@/lib/supabase/server'
import VacantesPortal from '@/components/candidato/VacantesPortal'

export default async function Home() {
  const supabase = await createClient()
  const { data: vacantes } = await supabase
    .from('vacantes')
    .select(`
      id, titulo, descripcion, requisitos, beneficios,
      letras_chiquitas, salario_min, salario_max, salario_tipo,
      salario_visible, ciudad, estado, colonia_zona,
      modalidad, jornada, horario, tipo_contrato,
      tiene_ruta, zonas_ruta, ruta_para_entrevista,
      estacionamiento, comedor, uniforme,
      empresa_visible, destacada, status, created_at,
      negocios(nombre)
    `)
    .eq('status', 'vigente')
    .order('destacada', { ascending: false })
    .order('created_at', { ascending: false })

  return <VacantesPortal vacantes={vacantes ?? []} />
}