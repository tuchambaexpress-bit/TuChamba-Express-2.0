import { createClient } from '@/lib/supabase/server'
import HomePortada from '@/components/candidato/HomePortada'

export const revalidate = 0 // nunca cachear — el contador debe ser real

export default async function Home() {
  const supabase = await createClient()
  const { count } = await supabase
    .from('vacantes')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'vigente')

  return <HomePortada totalVacantes={count ?? 0} />
}
