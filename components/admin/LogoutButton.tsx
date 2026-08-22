'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  async function salir() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={salir}
      className="text-[10px] text-[#5B6478] hover:text-[#00D9FF] uppercase tracking-[0.15em] transition-colors"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      Salir
    </button>
  )
}
