import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import VacanteDetalle from '@/components/candidato/VacanteDetalle'
import { JobPostingSchema } from '@/components/seo/JobPostingSchema'
import TraficoTracker from '@/components/candidato/TraficoTracker'
import CapturaReferido from '@/components/candidato/CapturaReferido'
import RedesSocialesFooter from '@/components/shared/RedesSocialesFooter'

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
      empresa_visible, destacada, status, created_at, fecha_publicacion,
      requiere_examen_medico, requiere_antidoping, comentarios_salario,
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
      <CapturaReferido />
      <div className="max-w-3xl mx-auto bg-white min-h-screen">
        <VacanteDetalle
          vacante={vacanteFormateada}
          esModal={false}
        />
      </div>

      {/* Footer — agregado por primera vez (HU-26, 7.52, 2026-09-03). Esta
          página nunca tuvo footer (nota pendiente de 7.26). Solo redes +
          aviso de privacidad, sin "Trámites útiles" — es info de toda la
          plataforma, no de una vacante específica. */}
      <footer className="border-t border-gray-100 px-4 py-3 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <RedesSocialesFooter />
            <span className="text-gray-300">·</span>
            <a href="/aviso-de-privacidad" className="text-gray-500 hover:text-[#1A6B3C] text-sm underline">
              Aviso de Privacidad
            </a>
          </div>
          <p className="text-xs text-gray-400 max-w-xl mx-auto">
            Tu Chamba Express © 2026. Plataforma de vinculación laboral. No somos responsables de las contrataciones ni condiciones laborales (NOM-035) ofrecidas por terceros.
          </p>
        </div>
      </footer>
    </div>
  )
}
