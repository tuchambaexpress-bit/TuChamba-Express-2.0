import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

const SITE_URL = 'https://tu-chamba-express.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Empleos en Nuevo León, CDMX y más | TuChamba Express — Contratación Directa',
  description: 'Encuentra vacantes en Nuevo León, CDMX, Estado de México y más. Postúlate directo por chat con el reclutador, sin registros complicados.',
  icons: {
    icon: '/favicon.png',
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Empleos en Nuevo León, CDMX y más | TuChamba Express',
    description: 'Encuentra vacantes en Nuevo León, CDMX, Estado de México y más. Postúlate directo por chat con el reclutador, sin registros complicados.',
    url: SITE_URL,
    type: 'website',
    images: [
      {
        url: '/banner_01.jpeg',
        width: 1200,
        height: 630,
        alt: 'TuChamba Express — Empleos en Nuevo León, CDMX y más',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Empleos en Nuevo León, CDMX y más | TuChamba Express',
    description: 'Encuentra vacantes en Nuevo León, CDMX, Estado de México y más. Postúlate directo por chat con el reclutador, sin registros complicados.',
    images: ['/banner_01.jpeg'],
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

// Meta Pixel (José, 2026-08-28) — mide visitas al portal (PageView
// automático en cada carga) y sirve de base para el evento "Lead" que
// se dispara en VacanteDetalle.tsx al hacer clic en "Postularme /
// Iniciar Chat". strategy="afterInteractive": no bloquea el render
// inicial de la página, carga justo después de que sea interactiva.
const FB_PIXEL_ID = '1048167607816863'

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
      <body>
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  )
}
