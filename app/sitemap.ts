import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://tu-chamba-express-2-0.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: vacantes } = await supabase
    .from('vacantes')
    .select('id, updated_at')
    .eq('status', 'vigente')

  const urlsVacantes = (vacantes ?? []).map((v) => ({
    url: `${BASE_URL}/vacante/${v.id}`,
    lastModified: new Date(v.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...urlsVacantes,
  ]
}
