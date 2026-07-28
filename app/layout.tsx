import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TuChamba Express 2.0',
  description: 'Plataforma de reclutamiento para Nuevo León',
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