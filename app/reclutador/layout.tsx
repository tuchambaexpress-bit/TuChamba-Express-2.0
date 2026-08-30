import type { Metadata } from 'next'

// manifest.json es solo del reclutador (PWA instalable, start_url
// apunta a /reclutador/dashboard) — vivía en el layout raíz por error,
// lo que hacía que TODO el sitio (incluido el portal público del
// candidato) pidiera icon-192.png/icon-512.png sin necesitarlos.
export const metadata: Metadata = {
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function ReclutadorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}