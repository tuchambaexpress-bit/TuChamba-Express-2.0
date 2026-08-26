import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import VacanteDetalle from '@/components/candidato/VacanteDetalle'
import { JobPostingSchema } from '@/components/seo/JobPostingSchema'
import TraficoTracker from '@/components/candidato/TraficoTracker'

interface Props {
  params: { id: string }
}

export const revalidate = 0 // nunca cachear — siempre datos frescos de Supabase

export async function generateMetadata({ params }: Props) {
  const supabase = await createClient()
  const { data: vacante } = await supabase
    .from('vacantes')
    .select('titulo, ciudad, estado, descripcion, salario_min, salario_visible')
    .eq('id', params.id)
    .single()

  if (!vacante) return {}

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tu-chamba-express.vercel.app'

  return {
    title: `${vacante.titulo} en ${vacante.ciudad} | Tu Chamba Express`,
    description: `${vacante.titulo} en ${vacante.ciudad}, ${vacante.estado}. ${
      vacante.salario_visible && vacante.salario_min
        ? `$${vacante.salario_min.toLocaleString('es-MX')} MXN. `
        : ''
    }Postúlate hoy en Tu Chamba Express.`,
    alternates: {
      canonical: `${appUrl}/vacante/${params.id}`
    },
    openGraph: {
      title: `${vacante.titulo} en ${vacante.ciudad}`,
      description: vacante.descripcion,
      url: `${appUrl}/vacante/${params.id}`
    }
  }
}

export default async function VacantePage({ params }: Props) {
  const supabase = await createClient()
  const { data: vacante } = await supabase
    .from('vacantes')
    .select(`
      id, titulo, descripcion, requisitos, beneficios,
      letras_chiquitas, salario_min, salario_max, salario_tipo, salario_periodo,
      salario_visible, ciudad, estado, colonia_zona,
      modalidad, jornada, horario, turno, tipo_contrato,
      tiene_ruta, zonas_ruta, ruta_para_entrevista,
      estacionamiento, comedor, uniforme,
      empresa_visible, destacada, status, created_at,
      requiere_examen_medico, requiere_antidoping,
      negocios(nombre, rutas, documentos_negocio(id, nombre_archivo, archivo_url))
    `)
    .eq('id', params.id)
    .eq('status', 'vigente')
    .single()

  if (!vacante) notFound()

  const vacanteFormateada = {
    ...vacante,
    negocios: Array.isArray(vacante.negocios)
      ? vacante.negocios[0] ?? null
      : vacante.negocios
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A6B3C] px-4 py-4 shadow-md">
        <div className="max-w-7xl mx-auto">
          <a href="/" className="text-white font-bold text-xl hover:text-green-200 transition-colors">
            ← Tu Chamba Express
          </a>
        </div>
      </header>
      <JobPostingSchema vacante={vacanteFormateada} />
      <TraficoTracker vacanteId={params.id} />
      <div className="max-w-3xl mx-auto bg-white min-h-screen">
        <VacanteDetalle
          vacante={vacanteFormateada}
          esModal={false}
        />
      </div>
    </div>
  )
}