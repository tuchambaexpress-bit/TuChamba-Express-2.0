export function JobPostingSchema({ vacante }: { vacante: any }) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": vacante.titulo,
    "description": vacante.descripcion,
    "datePosted": vacante.created_at?.split('T')[0],
    "employmentType": "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": vacante.empresa_visible
        ? vacante.negocios?.nombre ?? "Empresa"
        : "Empresa Confidencial"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": vacante.ciudad,
        "addressRegion": vacante.estado,
        "addressCountry": "MX"
      }
    },
    ...(vacante.salario_visible && vacante.salario_min ? {
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "MXN",
        "value": {
          "@type": "QuantitativeValue",
          "value": vacante.salario_min,
          "unitText": "MONTH"
        }
      }
    } : {})
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}