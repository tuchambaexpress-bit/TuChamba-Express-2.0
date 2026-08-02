import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tu Chamba Express',
  description: 'Plataforma de reclutamiento para Nuevo León',
  manifest: '/manifest.json',
  themeColor: '#1A6B3C',
  icons: {
    icon: '/favicon.png',
    apple: '/icon-192.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
