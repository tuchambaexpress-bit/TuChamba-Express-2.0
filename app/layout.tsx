import type { Metadata, Viewport } from 'next'
import './globals.css'

const SITE_URL = 'https://tu-chamba-express.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Empleos en Nuevo León, CDMX y más | TuChamba Express — Contratación Directa',
  description: 'Encuentra vacantes en Nuevo León, CDMX, Estado de México y más. Postúlate directo por chat con el reclutador, sin registros complicados.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/icon-192.png',
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Empleos en Nuevo León, CDMX y más | TuChamba Express',
    description: 'Encuentra vacantes en Nuevo León, CDMX, Estado de México y más. Postúlate directo por chat con el reclutador, sin registros complicados.',
    url: SITE_URL,
    type: 'website',
    images: ['/Logo_Header.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#1A6B3C',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EmploymentAgency',
  name: 'TuChamba Express',
  url: SITE_URL,
  logo: `${SITE_URL}/Logo_Header.png`,
  description: 'Plataforma de vinculación laboral en México. Vacantes operativas y administrativas con contratación directa.',
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Nuevo León' },
    { '@type': 'City', name: 'Ciudad de México' },
    { '@type': 'AdministrativeArea', name: 'Estado de México' },
  ],
  sameAs: ['https://www.facebook.com/tuchambaexpressoficial'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
