# 🏗️ PLAN ARQUITECTÓNICO: TUCHAMBA EXPRESS 2.0
> **Versión:** 2.0 | **Fecha:** 2026-06-27
> **Estado:** CERTIFICADO — La IA tiene prohibido usar tecnologías fuera de este stack sin autorización explícita del arquitecto.

---

## POLÍTICA DE SEGURIDAD INMUTABLE

1. **CERO hardcoded keys.** Ninguna credencial, URL de base de datos, token o llave de API puede aparecer dentro del código. Todo va en variables de entorno `.env.local`.
2. **`.env.local` está en `.gitignore` desde el primer commit.** Si no está en `.gitignore`, no se hace el primer push.
3. **RLS activado en todas las tablas desde el inicio.** No se desactiva RLS para "hacer pruebas rápidas". Se usa el rol `service_role` solo en funciones de servidor (Edge Functions), nunca en el frontend.
4. **El frontend nunca escribe directo a tablas protegidas.** Usa Supabase Auth + RLS para filtrar automáticamente por usuario autenticado.
5. **La API Key de Claude (Anthropic) nunca toca el navegador.** Vive exclusivamente en variables de entorno de Supabase Edge Functions.

---

## 1. STACK TECNOLÓGICO DEFINITIVO

> Criterio de decisión para cada pieza: **Escalable, Gratuito, Seguro.**

### Frontend
```
Next.js 14 (App Router)
Tailwind CSS
Shadcn/ui (componentes accesibles, open source)
@dnd-kit (drag and drop para el Kanban)
Recharts (gráficas del dashboard del coordinador)
```
> Next.js gana sobre React+Vite por SSR nativo — crítico para que Google
> indexe cada vacante como página real, no como JS dinámico. Elimina
> también la necesidad de actualizar SEO manualmente vía JavaScript.

### Backend / Base de Datos
```
Supabase (PostgreSQL 15)
  ├── Auth: email+password para coordinadores y admin
  │         código propio para reclutadores (tabla propia, sin Auth nativo)
  ├── Database: tablas relacionales con RLS en TODAS las tablas
  ├── Realtime: canal por chat_id para mensajes en tiempo real
  ├── Storage: CVs y documentos de candidatos (bucket privado)
  └── Edge Functions: agentes IA + automatizaciones + API interna
```

### IA / Agentes
```
Anthropic Claude API (claude-sonnet-4-... — el más reciente disponible)
  — llamadas SOLO desde Supabase Edge Functions
  — NUNCA desde el frontend (la API key nunca toca el browser)
  — usado en cascada: la mayoría de preguntas se resuelven con
    consultas SQL directas, Claude solo se invoca cuando es necesario
    (ver spec.md §HU-03 — Agente FAQ de 3 niveles)
```

### Deploy e Infraestructura
```
Vercel (Next.js nativo — zero config, auto-deploy desde GitHub main)
GitHub (repositorio + sync automático de sitemap.xml)
```

### Monitoreo (desde el MVP)
```
Sentry (errores en producción — gratis hasta 5,000 eventos/mes)
PostHog (analytics de comportamiento — gratis hasta 1M eventos/mes,
         open source y self-hosteable si escala)
```

### PWA (Portal Reclutador y Coordinador — provisional hasta Fase 2)
```
manifest.json (nombre, íconos, colores, display: standalone)
Service Worker básico (instalación en Android sin Play Store)
```

### Metodología y copiloto
```
SPECBOOT by LIDR (evolución de OpenSpec)
  Ciclo: User Story → /enrich_us → Refined User Story →
         /propose → Proposal Artifacts (spec+plan+tasks) →
         /apply → Branch + Tests + Code + Testing Report →
         /verify + /code_review → implement changes (si aplica) →
         /archive + /commit → Feature Ready → PR → Feature Published

COPILOTO PRINCIPAL: Claude Code (terminal o VS Code) — requiere
  cuenta Pro/Max O Claude Console (pago por uso, prepago desde $5 USD)

COPILOTO ALTERNATIVO: Cline (extensión VS Code, open source,
  conectado a la misma cuenta de Anthropic Console) — usar mientras
  no haya plan Pro activo. Mismo modelo Claude, mismo nivel de calidad.

FORMATO DE SPEC: compatible con OpenSpec — legible por Claude Code,
  Kiro, Windsurf, Cline, Cursor, Codex. El spec no cambia aunque
  cambie el copiloto que lo ejecuta.
```

---

## 2. ESTRUCTURA DE REPOSITORIO (Next.js App Router)

> **Estado:** Actualizado al Sprint 5 (01/08/2026). Las rutas marcadas con ✅ ya existen en producción.

```
tuchamba-v2/
├── .env.local                    ← NUNCA en GitHub
├── .gitignore
├── CLAUDE.md                     ← Reglas permanentes para el copiloto IA
├── spec.md                       ← Especificación funcional completa
├── plan.md                       ← Arquitectura técnica
├── tasks.md                      ← Sprints con tareas atómicas
├── next.config.js                ✅
├── tailwind.config.ts            ✅
├── tsconfig.json                 ✅
├── package.json                  ✅
├── public/                       ✅
│   ├── manifest.json             ✅ PWA manifest
│   ├── favicon.png               ✅ Favicon portal candidato
│   ├── Logo_Header.png           ✅ Logo horizontal (portal candidato)
│   ├── Logo_Header_02.png        ✅ Logo alternativo (portales internos)
│   ├── icon-192.png              ✅ Ícono PWA 192x192
│   ├── icon-512.png              ✅ Ícono PWA 512x512
│   ├── ojo-abierto.png           ✅ Botón ver contraseña
│   └── ojo-cerrado.png           ✅ Botón ocultar contraseña
├── supabase/
│   └── functions/
│       └── API.md                ✅ Endpoints documentados
├── hooks/                        ✅
│   ├── useReferido.ts            ✅ Captura ?ref= en localStorage
│   ├── useTrafico.ts             ✅ Detecta fuente de tráfico
│   └── useAlertas.ts             ✅ Genera alertas automáticas
├── lib/                          ✅
│   ├── utils.ts                  ✅ cn, getSemanaISO, calcularComision, calcularGarantiaFin
│   └── supabase/
│       ├── client.ts             ✅ Cliente browser
│       └── server.ts             ✅ Cliente servidor
├── components/
│   ├── ui/
│   │   └── button.tsx            ✅ Shadcn/ui
│   ├── candidato/
│   │   ├── VacantesPortal.tsx    ✅ Layout split + búsqueda + filtros + paginación
│   │   ├── VacanteCard.tsx       ✅ Card de vacante en lista
│   │   ├── VacanteDetalle.tsx    ✅ Panel detalle + botón postular
│   │   ├── ChatModal.tsx         ✅ Modal postulación + chat candidato
│   │   ├── ChatWindow.tsx        ✅ Chat Realtime (candidato y reclutador)
│   │   └── TraficoTracker.tsx    ✅ Tracker de fuente en página vacante individual
│   ├── invitacion/
│   │   └── FormularioInvitacion.tsx ✅ Formulario 2 pasos registro agencia
│   ├── admin/
│   │   └── SolicitudesPanel.tsx  ✅ Panel aprobar/rechazar agencias
│   ├── reclutador/
│   │   ├── KanbanBoard.tsx       ✅ Tablero principal (desktop + móvil)
│   │   ├── KanbanColumn.tsx      ✅ Columna por etapa
│   │   └── KanbanCard.tsx        ✅ Card candidato con modales descarte/contratado/entrevista
│   └── seo/
│       └── JobPostingSchema.tsx  ✅ JSON-LD para Google Jobs
└── app/
    ├── layout.tsx                ✅ Root layout con metadata PWA
    ├── globals.css               ✅ Tailwind base
    ├── page.tsx                  ✅ Portal Candidato (Home pública)
    ├── vacante/[id]/
    │   └── page.tsx              ✅ Detalle vacante SSR + SEO + JSON-LD
    ├── invitacion/[token]/
    │   └── page.tsx              ✅ Registro agencia + coordinador
    ├── admin/
    │   ├── invitaciones/
    │   │   └── page.tsx          ✅ Generador de links de invitación
    │   └── solicitudes/
    │       └── page.tsx          ✅ Panel aprobar/rechazar agencias
    ├── reclutador/
    │   ├── layout.tsx            ✅
    │   ├── login/page.tsx        ✅ Login por código
    │   ├── dashboard/page.tsx    ✅ Métricas + link referido + filtro fechas
    │   ├── pipeline/page.tsx     ✅ Kanban con modales
    │   ├── chats/page.tsx        ✅ Lista chats + ChatWindow Realtime
    │   ├── detalle/[id]/
    │   │   └── page.tsx          ✅ Ficha operativa de vacante
    │   ├── comisiones/page.tsx   ✅ Panel comisiones con día de pago por agencia
    │   └── alertas/page.tsx      ✅ Panel alertas automáticas
    ├── coordinador/
    │   ├── layout.tsx            ✅
    │   ├── login/page.tsx        ✅ Login email+password Supabase Auth
    │   ├── dashboard/page.tsx    ✅ Dashboard base con accesos rápidos
    │   ├── vacantes/             ⏳ Sprint 5
    │   ├── reclutadores/         ⏳ Sprint 5
    │   ├── pipeline/             ⏳ Sprint 5
    │   └── corte-semanal/        ⏳ Sprint 5
    └── api/
        ├── postular/route.ts     ✅ Crea candidato + postulación + chat
        ├── trafico/route.ts      ✅ Registra fuente de tráfico
        ├── invitaciones/route.ts ✅ Genera token de invitación (protegido admin)
        ├── registro-agencia/route.ts ✅ Registra agencia + coordinador
        ├── reclutador/
        │   └── login/route.ts    ✅ Verifica código de reclutador
        └── admin/
            ├── aprobar-agencia/route.ts  ✅ Activa agencia + crea cuenta Auth
            ├── rechazar-agencia/route.ts ✅ Rechaza solicitud
            └── reset-password/route.ts  ✅ Reset password via Admin API
```
    │   ├── ChatBubble.tsx
    │   └── ChatInput.tsx
    ├── kanban/
    │   ├── KanbanBoard.tsx
    │   ├── KanbanColumn.tsx
    │   └── KanbanCard.tsx
    ├── seo/
    │   └── JobPostingSchema.tsx   ← JSON-LD como Server Component
    ├── forms/
    │   └── EditableList.tsx        ← Componente reusable: requisitos,
    │                                  beneficios, documentos_requeridos,
    │                                  zonas_ruta, tags (ver §13)
    └── ui/                          ← Shadcn/ui components
└── lib/
    ├── supabase/
    │   ├── client.ts             ← Cliente browser
    │   └── server.ts              ← Cliente Server Components
    └── utils.ts                    ← getSemanaISO, calcularComision, etc.
└── hooks/
    ├── useRealtime.ts
    ├── useAlertas.ts
    └── useReferido.ts
```

---

## 3. VARIABLES DE ENTORNO

### `.env.example` (lo que va en GitHub)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# GitHub (para sync automático de sitemap)
GITHUB_TOKEN=tu_github_token_aqui
GITHUB_REPO=usuario/tuchamba-v2
GITHUB_SITEMAP_PATH=public/sitemap.xml

# Anthropic (SOLO en Edge Functions — nunca en NEXT_PUBLIC_*)
ANTHROPIC_API_KEY=tu_api_key_aqui

# Monitoreo
NEXT_PUBLIC_SENTRY_DSN=tu_dsn_aqui
NEXT_PUBLIC_POSTHOG_KEY=tu_key_aqui
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# App
NEXT_PUBLIC_APP_URL=https://tuchamba-express.vercel.app
NEXT_PUBLIC_APP_NAME=TuChamba Express
```

> **Regla de nomenclatura Next.js:** todo lo que empieza con `NEXT_PUBLIC_`
> SÍ es visible en el navegador. `ANTHROPIC_API_KEY` y `SUPABASE_SERVICE_ROLE_KEY`
> NUNCA llevan ese prefijo — viven solo en el servidor / Edge Functions.

---

## 4. CLIENTES SUPABASE (browser y servidor por separado)

```typescript
// lib/supabase/client.ts — para Client Components
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// lib/supabase/server.ts — para Server Components y Edge Functions
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )
}
```

---

## 5. ROW LEVEL SECURITY — Políticas por tabla

### Principio general
- **Lectura pública:** solo `vacantes` con `status = 'vigente'` y campos de capa pública
- **Escritura:** siempre requiere autenticación o función de servidor
- **Aislamiento por agencia:** coordinadores y reclutadores solo ven datos de su agencia
- **Status de aprobación:** agencias/coordinadores en `pendiente_aprobacion` no tienen acceso operativo

### Políticas críticas

```sql
-- VACANTES: lectura pública solo de vigentes
CREATE POLICY "vacantes_lectura_publica" ON vacantes
  FOR SELECT USING (status = 'vigente');

-- POSTULACIONES: reclutador solo ve las suyas
CREATE POLICY "postulaciones_reclutador" ON postulaciones
  FOR SELECT USING (reclutador_id = auth.uid());

-- MENSAJES: acceso solo si participas en el chat (sistema unificado)
CREATE POLICY "mensajes_acceso" ON mensajes
  FOR SELECT USING (
    chat_id IN (
      SELECT id FROM chats
      WHERE reclutador_id = auth.uid()
         OR coordinador_id = auth.uid()
    )
  );

-- CHATS internos: solo miembros de la agencia
CREATE POLICY "chats_agencia" ON chats
  FOR SELECT USING (
    tipo != 'reclutador_coordinador'
    OR agencia_id IN (
      SELECT agencia_id FROM reclutador_agencia
      WHERE reclutador_id = auth.uid()
    )
  );

-- CORTES_SEMANA: coordinador solo ve su agencia
CREATE POLICY "cortes_agencia" ON cortes_semana
  FOR SELECT USING (
    agencia_id IN (
      SELECT agencia_id FROM coordinadores
      WHERE id = auth.uid()
    )
  );

-- AGENCIAS: coordinador no puede editar ni eliminar su propia agencia
CREATE POLICY "agencias_solo_lectura_coordinador" ON agencias
  FOR SELECT USING (
    id IN (SELECT agencia_id FROM coordinadores WHERE id = auth.uid())
  );
-- (UPDATE/DELETE en agencias: solo policy de rol admin, sin excepción)

-- COORDINADORES pendientes: sin acceso operativo hasta aprobación
CREATE POLICY "coordinador_activo_acceso" ON vacantes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM coordinadores
      WHERE id = auth.uid() AND status = 'activo'
    )
  );

-- INVITACIONES: solo el admin puede crear/leer
CREATE POLICY "invitaciones_solo_admin" ON invitaciones
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 6. REALTIME — Canales

```typescript
// Canal de mensajes por chat (sistema unificado: candidato, reclutador, coordinador)
const canal = supabase
  .channel(`chat:${chatId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'mensajes',
    filter: `chat_id=eq.${chatId}`
  }, (payload) => {
    // Agregar mensaje nuevo al estado local
  })
  .subscribe()

// Canal de alertas por destinatario (reclutador/coordinador/admin)
const alertasCanal = supabase
  .channel(`alertas:${destinatarioId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'alertas',
    filter: `destinatario_id=eq.${destinatarioId}`
  }, (payload) => {
    // Mostrar notificación
  })
  .subscribe()
```

---

## 7. UTILIDADES — Lógica de negocio compartida

```typescript
// lib/utils.ts

export function getSemanaISO(fecha: Date = new Date()): string {
  const date = new Date(fecha)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  const week1 = new Date(date.getFullYear(), 0, 4)
  const weekNum = 1 + Math.round(
    ((date.getTime() - week1.getTime()) / 86400000 - 3 +
    (week1.getDay() + 6) % 7) / 7
  )
  return `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

export function calcularComision(
  vacante: { tiene_promocion: boolean; promocion_fin: string | null;
             promocion_monto_mxn: number | null; comision_base_mxn: number },
  fechaContratacion: string
) {
  if (
    vacante.tiene_promocion &&
    vacante.promocion_fin &&
    new Date(fechaContratacion) <= new Date(vacante.promocion_fin)
  ) {
    return { monto: vacante.promocion_monto_mxn!, esPromocion: true }
  }
  return { monto: vacante.comision_base_mxn, esPromocion: false }
}

export function calcularGarantiaFin(fechaContratacion: string, diasGarantia: number): string {
  const fecha = new Date(fechaContratacion)
  fecha.setDate(fecha.getDate() + diasGarantia)
  return fecha.toISOString().split('T')[0]
}

export function generarTokenInvitacion(): string {
  return crypto.randomUUID()
}
```

---

## 8. SEO — Next.js nativo (reemplaza la manipulación manual del DOM)

Con Next.js App Router, el SEO se resuelve con `generateMetadata` — Server Component, no JavaScript en el cliente. Esto es superior a lo que haríamos con React+Vite.

```typescript
// app/vacante/[id]/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const { data: vacante } = await supabase
    .from('vacantes')
    .select('*, negocios(nombre)')
    .eq('id', params.id)
    .single()

  if (!vacante) return {}

  return {
    title: `${vacante.titulo} en ${vacante.ciudad} | TuChamba Express`,
    description: `Vacante: ${vacante.titulo} en ${vacante.ciudad}. ${
      vacante.salario_visible ? `$${vacante.salario_min} MXN. ` : ''
    }Postúlate hoy desde TuChamba Express.`,
    alternates: {
      // Canonical SIEMPRE limpio, sin ?ref=
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/vacante/${params.id}`
    },
    openGraph: {
      title: vacante.titulo,
      description: vacante.descripcion,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/vacante/${params.id}`
    }
  }
}
```

```typescript
// components/seo/JobPostingSchema.tsx — Server Component, JSON-LD
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
      "name": vacante.empresa_visible ? vacante.negocios?.nombre : "Empresa Confidencial"
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
        "value": { "@type": "QuantitativeValue", "value": vacante.salario_min, "unitText": "MONTH" }
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
```

---

## 9. SITEMAP AUTO-SYNC A GITHUB (Edge Function)

```typescript
// supabase/functions/sync-sitemap/index.ts
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: vacantes } = await supabase
    .from('vacantes')
    .select('id, updated_at')
    .eq('status', 'vigente')

  const baseUrl = Deno.env.get('APP_URL')
  const hoy = new Date().toISOString().split('T')[0]

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  xml += `  <url><loc>${baseUrl}/</loc><lastmod>${hoy}</lastmod><priority>1.0</priority></url>\n`

  for (const v of vacantes ?? []) {
    xml += `  <url><loc>${baseUrl}/vacante/${v.id}</loc>`
    xml += `<lastmod>${v.updated_at?.split('T')[0]}</lastmod><priority>0.8</priority></url>\n`
  }
  xml += '</urlset>'

  const repo = Deno.env.get('GITHUB_REPO')
  const path = Deno.env.get('GITHUB_SITEMAP_PATH')
  const token = Deno.env.get('GITHUB_TOKEN')

  const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const existing = getRes.ok ? await getRes.json() : null

  await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'sitemap: actualización automática',
      content: btoa(xml),
      ...(existing?.sha ? { sha: existing.sha } : {})
    })
  })

  return new Response('ok')
})
```
> Se invoca vía trigger de base de datos o llamada directa al guardar/editar/cerrar una vacante desde el portal coordinador.

---

## 10. AGENTES IA — Edge Functions (arquitectura API-first)

> Diseñadas desde el día 1 para que un humano (vía Next.js) o un agente
> externo (futuro OpenClaw / orquestador propio) puedan invocarlas igual.
> La función no sabe ni le importa quién la llama.

```typescript
// supabase/functions/agente-descripcion-vacante/index.ts
import Anthropic from 'npm:@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })

Deno.serve(async (req) => {
  const { titulo, requisitos, salario, ciudad, jornada } = await req.json()

  const mensaje = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Eres experto en reclutamiento en México. Genera la descripción
      completa de esta vacante para TuChamba Express. Lenguaje claro y directo
      para candidatos de perfil operativo en Nuevo León.

      Título: ${titulo} | Salario: ${salario} | Ciudad: ${ciudad} | Jornada: ${jornada}
      Requisitos en bruto: ${requisitos}

      Responde SOLO en JSON: {"descripcion": "...", "beneficios": ["..."], "letras_chiquitas": "..."}`
    }]
  })

  const resultado = JSON.parse(mensaje.content[0].text)
  return new Response(JSON.stringify(resultado), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

```typescript
// supabase/functions/agente-faq/index.ts — Cascada de 3 niveles (ver spec.md HU-03)
Deno.serve(async (req) => {
  const { vacante_id, pregunta, reclutador_id } = await req.json()
  const supabase = createClient(/* service role */)

  // NIVEL 1 — campo estructurado (sin IA, sin costo)
  const { data: vacante } = await supabase
    .from('vacantes').select('*').eq('id', vacante_id).single()

  const respuestaEstructurada = buscarEnCamposEstructurados(pregunta, vacante)
  if (respuestaEstructurada) {
    return new Response(JSON.stringify({ respuesta: respuestaEstructurada, fuente: 'estructurado' }))
  }

  // NIVEL 2 — FAQ existente (sin IA, sin costo)
  const { data: faqs } = await supabase
    .from('faqs_vacante').select('*').eq('vacante_id', vacante_id)
  const faqMatch = buscarFaqSimilar(pregunta, faqs ?? [])
  if (faqMatch) {
    return new Response(JSON.stringify({ respuesta: faqMatch.respuesta, fuente: 'faq' }))
  }

  // NIVEL 3 — escalar al coordinador (genera mensaje_interno + alerta)
  await supabase.from('mensajes').insert({ /* ...crea el chat/mensaje hacia el coordinador... */ })
  await supabase.from('alertas').insert({
    tipo: 'pregunta_sin_responder',
    destinatario_rol: 'coordinador',
    vacante_id, mensaje: `Nueva pregunta sin responder: "${pregunta}"`
  })

  return new Response(JSON.stringify({ respuesta: null, fuente: 'escalado_coordinador' }))
})
```

### Endpoints internos disponibles para agentes (humano o autónomo)
```
GESTIÓN DE VACANTES
  POST   /vacantes/crear
  PATCH  /vacantes/:id/status
  PATCH  /vacantes/:id

GESTIÓN DE CANDIDATOS
  GET    /postulaciones/activas
  PATCH  /postulaciones/:id/etapa
  POST   /postulaciones/manual

COMUNICACIÓN
  POST   /mensajes/enviar
  GET    /chats/:id/historial

REPORTES
  GET    /reportes/corte-semanal
  GET    /reportes/salud-sistema
  GET    /reportes/pipeline

AGENTES
  POST   /agentes/descripcion
  POST   /agentes/seguimiento
  POST   /agentes/matching
  POST   /agentes/faq
  POST   /agentes/resumen
```
> Cada endpoint usa autenticación por API key. Esto permite que en Fase 3,
> OpenClaw o cualquier orquestador propio opere el sistema sin reescribir nada.

---

## 11. COMPONENTE REUTILIZABLE — EditableList

> Origen: TuChamba V1 ya permitía agregar requisitos/beneficios uno por
> uno (input + botón "+"), pero no permitía editar o borrar un ítem
> individual después de creado. Este componente resuelve eso, y se
> reutiliza en TODOS los campos tipo array del modelo de datos:
> `requisitos`, `beneficios`, `documentos_requeridos`, `zonas_ruta`, `tags`.

### Comportamiento esperado
```
[ Input para escribir nuevo ítem ]  [+ Agregar]

┌─────────────────────────────────────────┐
│ Ítem existente 1              ✏️   🗑️  │
│ Ítem existente 2              ✏️   🗑️  │
│ Ítem existente 3              ✏️   🗑️  │
└─────────────────────────────────────────┘
```
- **✏️ Editar:** convierte ese renglón en un input editable in-line.
  Enter o blur guarda el cambio. Escape cancela.
- **🗑️ Borrar:** elimina ese ítem específico al instante, sin
  confirmación adicional (la lista completa sigue siendo editable,
  no hay pérdida irreversible de datos del formulario completo).
- **Reordenar (opcional, mismo patrón que etapas personalizadas):**
  drag handle a la izquierda de cada ítem, usando `@dnd-kit` —
  mismo paquete que ya usamos para el Kanban, cero dependencia nueva.

### Código de referencia
```typescript
// components/forms/EditableList.tsx
'use client'
import { useState } from 'react'
import { Pencil, Trash2, Plus, GripVertical } from 'lucide-react'

interface EditableListProps {
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
}

export function EditableList({ items, onChange, placeholder = 'Agregar ítem...' }: EditableListProps) {
  const [nuevoItem, setNuevoItem] = useState('')
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null)
  const [valorEditado, setValorEditado] = useState('')

  function agregar() {
    if (!nuevoItem.trim()) return
    onChange([...items, nuevoItem.trim()])
    setNuevoItem('')
  }

  function borrar(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function guardarEdicion(index: number) {
    if (!valorEditado.trim()) return
    const copia = [...items]
    copia[index] = valorEditado.trim()
    onChange(copia)
    setEditandoIndex(null)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={nuevoItem}
          onChange={(e) => setNuevoItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && agregar()}
          placeholder={placeholder}
          className="flex-1 border rounded-md p-2"
        />
        <button onClick={agregar} className="bg-blue-600 text-white px-3 rounded-md">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2 bg-gray-50 rounded-md p-2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
            {editandoIndex === index ? (
              <input
                autoFocus
                value={valorEditado}
                onChange={(e) => setValorEditado(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && guardarEdicion(index)}
                onBlur={() => guardarEdicion(index)}
                className="flex-1 border rounded-md p-1"
              />
            ) : (
              <span className="flex-1">{item}</span>
            )}
            <button onClick={() => { setEditandoIndex(index); setValorEditado(item) }}>
              <Pencil className="w-4 h-4 text-gray-500" />
            </button>
            <button onClick={() => borrar(index)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Uso dentro del VacanteModal
```tsx
<EditableList
  items={vacante.requisitos}
  onChange={(nuevos) => setVacante({ ...vacante, requisitos: nuevos })}
  placeholder="Ej. Secundaria terminada"
/>
```

> El mismo componente, sin modificar nada, sirve para `beneficios`,
> `documentos_requeridos`, `zonas_ruta` y `tags` — solo cambia qué
> array del estado se le pasa. Esto es exactamente la ventaja de
> haberlos modelado como `jsonb` arrays desde spec.md §3.

---

## 12. ROADMAP DE 6 MESES

```
MES 1 — Cimientos: Sprint 0-2 (Supabase, Next.js, Deploy base)
MES 2 — Portal Candidato: Sprint 3-4 (vacantes, SEO, chat)
MES 3 — Portal Reclutador: Sprint 5-6 (Kanban, comisiones, PWA)
MES 4 — Portal Coordinador: Sprint 7-9 (alta vacante, Power BI, FAQ)
MES 5 — Agentes IA + Admin: Sprint 10-12 (5 agentes, portal admin, API)
MES 6 — APK + Lanzamiento: Sprint 13-15 (Expo, QA, Play Store, Nuevo León)
```

### Fases posteriores (fuera del roadmap de 6 meses, documentadas para no perderse)
```
FASE 2 — n8n self-hosted (automatización compleja),
          App móvil completa (React Native + Expo, 3 portales)
FASE 3 — OpenClaw o agente propio (autonomía avanzada),
          Agente de Marketing (ver spec.md §9),
          Posible integración Leadsales-style,
          API pública para terceros (monetización como infraestructura)
```

> **Nota 2026-08-02:** se agregó un Sprint 8 nuevo en `tasks.md` — Limpieza y
> retención de datos (ver spec.md HU-19). Surgió como necesidad real detectada
> durante Sprint 4, no estaba contemplado en este roadmap original. Se
> documentó en tasks.md como backlog para retomarlo en su turno, sin renumerar
> el resto del roadmap de 6 meses.

---

## 13. PROTOCOLO DE CONTINGENCIA (Troubleshooting)

### Síntomas de Prompt Drifting — detener y corregir cuando:
- La IA sugiere cambiar el stack (Firebase, MongoDB, Vite en vez de Next.js, etc.)
- La IA propone hardcodear credenciales "temporalmente"
- La IA olvida el nombre de una tabla ya definida en spec.md
- El mismo error aparece 3 veces sin solución correcta
- La IA desactiva RLS "para simplificar"
- La IA intenta saltarse el ciclo SPECBOOT (codear sin `/propose` primero)

### Comandos de reset Git
```bash
git status
git diff
git reset --hard HEAD        # descarta TODO lo no commiteado
git log --oneline -10
git reset --hard <hash>       # vuelve a un commit específico
```

### Template de reprompting limpio
```
Actúa como ingeniero senior de TuChamba Express 2.0.
Stack: Next.js 14 + Supabase + Vercel + Claude API.
Lee spec.md, plan.md, tasks.md y CLAUDE.md antes de responder.
NUNCA hardcodear credenciales.
NUNCA desactivar RLS.
NUNCA cambiar nombres de tablas definidos en spec.md.
NUNCA saltarte el ciclo SPECBOOT.

Contexto del error:
[Pegar aquí el mensaje exacto de la consola]

Tarea atómica activa en tasks.md:
[Pegar aquí la tarea específica]

Último código que funcionaba:
[Pegar aquí el fragmento relevante]

Entrega SOLO la corrección quirúrgica. Sin reescribir lo que funciona.
```
