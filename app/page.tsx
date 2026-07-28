import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: vacantes, error } = await supabase
    .from('vacantes')
    .select('titulo, ciudad')
    .eq('status', 'vigente')
    .limit(3)

  return (
    <main style={{ padding: '20px' }}>
      <h1>TuChamba Express 2.0</h1>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {vacantes?.map((v, i) => (
        <p key={i}>{v.titulo} — {v.ciudad}</p>
      ))}
    </main>
  )
}