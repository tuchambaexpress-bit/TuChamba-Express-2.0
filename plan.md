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
GitHub (repositorio de código, sin ningún rol en el sitemap desde el 10/08/2026 —
  ver corrección abajo, §9)
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

> **Estado:** Actualizado al Sprint 6 (19/08/2026 — sesión larga, ver tasks.md para detalle de cada tarea). Las rutas marcadas con ✅ ya existen en producción.

```
tuchamba-v2/
├── .env.local                    ← NUNCA en GitHub
├── .gitignore
├── CLAUDE.md                     ← Reglas permanentes para el copiloto IA
├── spec.md                       ← Especificación funcional completa
├── plan.md                       ← Arquitectura técnica (este archivo)
├── tasks.md                      ← Sprints con tareas atómicas
├── middleware.ts                 ✅ Protege /coordinador/* (sesión + status activo)
├── next.config.js                ✅
├── tailwind.config.ts            ✅
├── tsconfig.json                 ✅ (⚠️ moduleResolution "node" obsoleto, ver tasks.md 7.13)
├── package.json                  ✅ (+ xlsx, recharts, ver tasks.md 7.13 riesgo conocido)
├── public/                       ✅
│   ├── manifest.json             ✅ PWA manifest
│   ├── favicon.png               ✅
│   ├── Logo_Header.png           ✅
│   ├── Logo_Header_02.png        ✅
│   ├── icon-192.png / icon-512.png ✅
│   └── ojo-abierto.png / ojo-cerrado.png ✅
├── supabase/
│   └── functions/
│       └── API.md                ✅ Endpoints documentados (aún sin Edge Functions
│                                     reales desplegadas — 6.8/6.9/6.10 se construyeron
│                                     deliberadamente sin IA en tiempo real, ver backlog)
├── hooks/                        ✅
│   ├── useReferido.ts            ✅ Captura ?ref= en localStorage
│   ├── useTrafico.ts             ✅ Detecta fuente de tráfico
│   └── useAlertas.ts             ✅ Genera alertas automáticas (sin_movimiento,
│                                     garantia_proxima, entrevista_proxima,
│                                     confirmar_asistencia)
├── lib/                          ✅
│   ├── utils.ts                  ✅ cn, getSemanaISO, calcularComision,
│   │                                 calcularGarantiaFin (legado),
│   │                                 calcularGarantiaFinHabil (CA-02.8, días hábiles +
│   │                                 días de inducción, 5.16b)
│   │                                 (⚠️ obtenerPeriodoCorte/periodoCorteAdyacente,
│   │                                 usadas por el sistema de periodo automático de
│   │                                 5.17, eliminadas 2026-08-20 al reemplazar por el
│   │                                 corte manual de 5.26 — código muerto confirmado
│   │                                 y limpiado, no quedó ninguna referencia)
│   ├── excel-vacantes.ts         ✅ Columnas (44+, ver spec.md CA-08.8), mapas de
│   │                                 traducción bidireccionales, parser de fechas,
│   │                                 normalización de nombres de empresa, mapa de
│   │                                 días de la semana (LUN..DOM, 3 letras — 1 sola
│   │                                 letra es ambigua entre Martes y Miércoles)
│   ├── faq.ts                    ✅ NUEVO (4.14/4.15) — buscarRespuestaNivel1()
│   │                                 (~10 reglas por palabra clave, sin IA),
│   │                                 buscarRespuestaNivel2() (overlap de palabras
│   │                                 clave contra faqs_vacante, sin IA)
│   └── supabase/
│       ├── client.ts             ✅ Cliente browser
│       └── server.ts             ✅ Cliente servidor
├── components/
│   ├── ui/
│   │   ├── button.tsx            ✅ Shadcn/ui
│   │   └── InfoTooltip.tsx       ✅ Tooltip "!" estilo nota de Excel, usado en VacanteModal
│   ├── candidato/
│   │   ├── VacantesPortal.tsx    ✅ Layout split + búsqueda + filtros + paginación
│   │   │                            + Realtime (vacantes y documentos_negocio)
│   │   ├── VacanteCard.tsx       ✅ Card de vacante en lista
│   │   ├── VacanteDetalle.tsx    ✅ Panel detalle + botón postular + PDFs de ruta
│   │   │                            + examen médico/antidoping visibles
│   │   ├── ChatModal.tsx         ✅ Modal postulación + chat candidato + quiz de
│   │   │                            pre-calificación (HU-17/6.8, antes del formulario
│   │   │                            si la vacante tiene preguntas configuradas)
│   │   ├── ChatWindow.tsx        ✅ Chat Realtime (candidato y reclutador), + prop
│   │   │                            `soloLectura` (consulta del coordinador, HU-21)
│   │   └── TraficoTracker.tsx    ✅ Tracker de fuente en página vacante individual
│   ├── invitacion/
│   │   └── FormularioInvitacion.tsx ✅ Formulario 2 pasos registro agencia
│   ├── admin/
│   │   └── SolicitudesPanel.tsx  ✅ Panel aprobar/rechazar agencias
│   ├── reclutador/
│   │   ├── KanbanBoard.tsx       ✅ Tablero principal (desktop + móvil), incluye
│   │   │                            columna "Descartados", Realtime (canal sobre
│   │   │                            `postulaciones`, agregado 6.8b — antes no existía
│   │   │                            ningún Realtime en esta pantalla), historial previo
│   │   ├── KanbanColumn.tsx      ✅ Columna por etapa (incl. "Descartado")
│   │   ├── KanbanCard.tsx        ✅ Card candidato — modales descarte/inducción/firma
│   │   │                            contrato/entrevista/documentos; botón único de
│   │   │                            WhatsApp que cambia a "seguimiento" tras 48h sin
│   │   │                            movimiento (6.9); botones ✅/❌ de confirmación de
│   │   │                            asistencia (5.24, no mueve de columna, distinto de
│   │   │                            Descartar); candado de datos completos antes de
│   │   │                            Inducción (CA-15.6); candado de días de entrevista
│   │   │                            por empresa al agendar — bloquea de verdad, no solo
│   │   │                            informativo (5.25); modal de consulta del
│   │   │                            candidato al hacer clic en su nombre (Esc cierra);
│   │   │                            control de cupo por vacante al entrar a Inducción
│   │   │                            y al confirmar Contratado (6.8b); botón de chat
│   │   │                            interno oculto si `es_manual = true` (HU-25)
│   │   ├── FaqWidget.tsx         ✅ NUEVO (4.14/4.15) — widget de preguntas del
│   │   │                            reclutador, montado en la ficha operativa.
│   │   │                            Cascada 3 niveles, modal "Ejemplos de preguntas",
│   │   │                            borrado manual, Realtime
│   │   └── ReclutadorNav.tsx     ✅ Nav compartido, contadores Realtime de chats/alertas
│   ├── coordinador/
│   │   ├── CoordinadorNav.tsx    ✅ Nav compartido, contador de chats sin leer
│   │   ├── VacanteModal.tsx      ✅ Modal de 8 secciones — crear/editar/duplicar
│   │   │                            vacante, selector de negocio con creación inline
│   │   │                            y filtro anti-duplicados + selector de días de
│   │   │                            descanso (Sección 1, por empresa, HU-16) y
│   │   │                            selector de días de entrevista (Sección 8, por
│   │   │                            empresa, 5.25 — deliberadamente en sección
│   │   │                            distinta a días de descanso), toggle Vigente/No
│   │   │                            vigente, indicador de completitud (bloquea guardar,
│   │   │                            CA-09.3), preguntas de pre-calificación (HU-17,
│   │   │                            máx 5, 3 tipos), campo cupo_requerido + indicador
│   │   │                            en tiempo real "por rondas" (HU-16)
│   │   └── KanbanCardSoloLectura.tsx ✅ Card sin botones de acción para el Kanban
│   │                                     global (5.11) — sí incluye botón "Ver chat"
│   │                                     (solo lectura, CA-21.4) y badges de ficha del
│   │                                     candidato/asistencia/pre-calificado
│   ├── shared/
│   │   └── ChatCoordinadorReclutador.tsx ✅ Chat general único por par
│   │                                          reclutador-coordinador
│   ├── forms/
│   │   └── EditableList.tsx      ✅ Lista editable con drag-and-drop (@dnd-kit) —
│   │                                 requisitos, beneficios, documentos, zonas_ruta,
│   │                                 opciones de pregunta de opción múltiple (HU-17)
│   └── seo/
│       └── JobPostingSchema.tsx  ✅ JSON-LD para Google Jobs
└── app/
    ├── layout.tsx                ✅ Root layout con metadata PWA
    ├── globals.css                ✅ Tailwind base
    ├── page.tsx                  ✅ Portal Candidato (Home pública), revalidate=0,
    │                                 Realtime, salario_periodo/turno incluidos
    ├── sitemap.ts                ✅ Sitemap dinámico nativo de Next.js
    ├── vacante/[id]/
    │   └── page.tsx              ✅ Detalle vacante SSR + SEO + JSON-LD, revalidate=0
    ├── invitacion/[token]/
    │   └── page.tsx              ✅ Registro agencia + coordinador
    ├── admin/
    │   ├── invitaciones/page.tsx ✅ Generador de links de invitación
    │   └── solicitudes/page.tsx  ✅ Panel aprobar/rechazar agencias
    ├── reclutador/
    │   ├── layout.tsx            ✅
    │   ├── login/page.tsx        ✅ Login por código
    │   ├── dashboard/page.tsx    ✅ Métricas + link referido + filtro fechas
    │   ├── pipeline/page.tsx     ✅ Client Component (antes Server, la conexión a
    │   │                            Supabase del servidor nunca se usaba) — botón
    │   │                            "+ Candidato" junto al título (HU-25, alta manual
    │   │                            para candidatos que llegan por redes/WhatsApp/
    │   │                            presencial), envuelve KanbanBoard
    │   ├── chats/page.tsx        ✅ Lista chats + ChatWindow Realtime, "Ordenar por"
    │   ├── chat-coordinador/     ✅ Chat con su coordinador (5.13)
    │   │   └── page.tsx
    │   ├── detalle/[id]/
    │   │   └── page.tsx          ✅ Ficha operativa, revalidate=0, PDFs de ruta de
    │   │                            empresa, salario/turno siempre reales al reclutador
    │   │                            (`salario_visible` solo aplica al portal público),
    │   │                            recuadro "Requerimiento" (cupo real, HU-16), días
    │   │                            de entrevista de la empresa (5.25, dentro de "Qué
    │   │                            decirle al candidato"), widget FaqWidget montado
    │   │                            al final (4.14/4.15, cascada 3 niveles)
    │   ├── vacantes/page.tsx     ✅ Listado para consulta libre (5.20), incluye días
    │   │                            de entrevista de la empresa (5.25)
    │   ├── comisiones/page.tsx   ✅ Panel comisiones — corregido para calcular
    │   │                            "cumplida" en vivo desde `fecha_garantia_fin`,
    │   │                            no desde `garantia_cumplida` (campo roto, nunca
    │   │                            se actualiza, mismo hueco de 5.1c/5.17/Dashboard)
    │   └── alertas/page.tsx      ✅ Panel alertas automáticas
    ├── coordinador/
    │   ├── layout.tsx            ✅
    │   ├── login/page.tsx        ✅ Login email+password Supabase Auth
    │   ├── dashboard/page.tsx    ✅ 6 gráficas (Recharts, Sprint 6): vacantes por
    │   │                            status, embudo de conversión (vía historial_etapas,
    │   │                            cuenta candidatos que llegaron a cada etapa alguna
    │   │                            vez), efectividad por reclutador, comisiones
    │   │                            pagadas/pendientes/perdidas, fuentes de tráfico,
    │   │                            días promedio de colocación; filtro de fechas
    │   │                            compartido; botón "📝 Ver resumen" (6.10, texto por
    │   │                            reglas, sin IA/Cron todavía — ver backlog)
    │   ├── en-revision/page.tsx  ✅ Pantalla coordinador pendiente de aprobación
    │   ├── vacantes/page.tsx     ✅ Listado + filtros + Exportar/Importar Excel +
    │   │                            Duplicar, Realtime, columna "Cupo" calculada en
    │   │                            vivo (HU-16, no depende de `cupo_cubierto`)
    │   ├── reclutadores/page.tsx ✅ CRUD reclutadores, LADA internacional
    │   ├── pipeline/page.tsx     ✅ Panel de reclutadores → Kanban solo-lectura (5.11),
    │   │                            botón "Ver chat" por tarjeta, badge de asistencia
    │   ├── chat-reclutadores/    ✅ Chat con cada reclutador (5.13)
    │   │   └── page.tsx
    │   ├── corte-semanal/        ✅ Corte 100% manual (5.26, reescrito 2026-08-20 —
    │   │   └── page.tsx              reemplaza la navegación por periodos automáticos):
    │   │                             botón "✅ Generar Corte", pendiente en vivo desde
    │   │                             `ultimo_corte_at`, historial con hora exacta por
    │   │                             corte + descarga individual/completa
    │   ├── perfil-agencia/        ✅ dia_corte/dia_pago/hora_corte (informativos, 5.19/5.26)
    │   │   └── page.tsx
    │   ├── contratados/          ✅ Histórico completo de "Contratado", filtrable por
    │   │   └── page.tsx              reclutador y rango de fechas, exportable (5.22)
    │   └── faq/                  ✅ Preguntas escaladas (5.12/6.11, 2026-08-20) —
    │       └── page.tsx              pendientes + contestadas (borrado manual,
    │                                 Realtime), toggle "Agregar al FAQ"
    └── api/
        ├── postular/route.ts     ✅ Crea candidato + postulación + chat; guarda
        │                            `precalificado` y `respuestas_precalificacion` (HU-17)
        ├── trafico/route.ts      ✅ Registra fuente de tráfico — corregido: sí guarda
        │                            `agencia_id` (bug de Sprint 3, nunca se usaba el
        │                            dato aunque sí se consultaba)
        ├── invitaciones/route.ts ✅ Genera token de invitación (protegido admin)
        ├── registro-agencia/route.ts ✅ Registra agencia + coordinador
        ├── documentos/route.ts   ✅ Documentos del candidato (bucket privado, links firmados)
        ├── documentos-negocio/route.ts ✅ PDFs de rutas por empresa (bucket público)
        ├── exportar-vacantes/route.ts  ✅ Excel hoja Vacantes + hoja Instrucciones
        │                                    (44+ columnas, incluye DÍAS DE DESCANSO
        │                                    EMPRESA — campo de `negocios`, no `vacantes`)
        ├── importar-vacantes/route.ts  ✅ Parser con columnas dinámicas REQUISITO_N/
        │                                    BENEFICIO_N/DOCUMENTO_N, crea o actualiza,
        │                                    reporte por fila, aplica días de descanso
        │                                    por empresa ("última fila gana")
        ├── reclutador/
        │   └── login/route.ts    ✅ Verifica código de reclutador
        └── admin/
            ├── aprobar-agencia/route.ts  ✅ Activa agencia + crea cuenta Auth
            ├── rechazar-agencia/route.ts ✅ Rechaza solicitud
            └── reset-password/route.ts  ✅ Reset password via Admin API
```

---

## 3. VARIABLES DE ENTORNO

### `.env.example` (lo que va en GitHub)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# GitHub — ya NO se usa para sitemap (corregido 2026-08-10, ver §9).
# Sin variables de GITHUB_TOKEN/GITHUB_REPO/GITHUB_SITEMAP_PATH — el
# sitemap dinámico (app/sitemap.ts) no necesita ningún acceso a GitHub.

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

> ⚠️ **Esta sección es el plan original, previo a construir nada — quedó desactualizada y nunca se corrigió hasta ahora (2026-08-21).** El ejemplo de abajo usaba `auth.uid()` para coordinadores, que es **el bug de origen real** que afectó 14 políticas en 9 tablas (confirmado y corregido en producción — ver tasks.md, sección "RLS — corrección masiva"). Se deja corregido aquí como referencia del patrón correcto, no como lista exhaustiva (hay decenas de políticas reales en producción; para el estado exacto de una tabla, consultar directo en Supabase con `select policyname, cmd, qual from pg_policies where tablename = 'X'` — es más confiable que cualquier documento).

### Principio general
- **Lectura pública:** solo `vacantes` con `status = 'vigente'` y campos de capa pública
- **Escritura:** el reclutador opera como rol `anon` (sin Supabase Auth) — sus políticas suelen ser abiertas (`qual = true`) en vez de comparar contra `auth.uid()`, ya que no hay sesión de Auth de la cual leer. El coordinador sí usa Supabase Auth.
- **Aislamiento por agencia:** coordinadores solo ven/editan datos de su propia agencia
- **Status de aprobación:** agencias/coordinadores en `pendiente_aprobacion` no tienen acceso operativo

### El patrón correcto — SIEMPRE por email, nunca por `auth.uid()`, para coordinador

```sql
-- ❌ INCORRECTO — coordinadores.id NUNCA coincide con el id de Supabase Auth
CREATE POLICY "mal_ejemplo" ON alguna_tabla
  FOR SELECT USING (
    agencia_id IN (SELECT agencia_id FROM coordinadores WHERE id = auth.uid())
  );

-- ✅ CORRECTO — el vínculo real es por email
CREATE POLICY "buen_ejemplo" ON alguna_tabla
  FOR SELECT USING (
    agencia_id IN (SELECT agencia_id FROM coordinadores WHERE email = auth.email())
  );
```

### Ejemplos reales ya en producción (patrón, no lista completa)

```sql
-- VACANTES: lectura pública solo de vigentes
CREATE POLICY "vacantes_lectura_publica" ON vacantes
  FOR SELECT USING (status = 'vigente');

-- POSTULACIONES: reclutador opera como anon — política abierta
CREATE POLICY "postulaciones_select_publico" ON postulaciones
  FOR SELECT USING (true);

-- AGENCIAS: coordinador SÍ puede editar su propia agencia (5.19, 2026-08-20 —
-- corrige el plan original de abajo, que decía lo contrario)
CREATE POLICY "agencias_update_coordinador" ON agencias
  FOR UPDATE USING (
    id IN (SELECT agencia_id FROM coordinadores WHERE email = auth.email())
  )
  WITH CHECK (
    id IN (SELECT agencia_id FROM coordinadores WHERE email = auth.email())
  );

-- FAQ_ESCALACIONES (nueva, 6.11): insert/select abiertos (reclutador anon),
-- update/delete solo coordinador de esa agencia
CREATE POLICY "faq_escalaciones_update_coordinador" ON faq_escalaciones
  FOR UPDATE USING (
    agencia_id IN (SELECT agencia_id FROM coordinadores WHERE email = auth.email())
  );
```

### Administradores — dos roles, RLS a nivel de base de datos (2026-08-21)

Mismo patrón de vínculo por email que coordinador (nunca `auth.uid()`), con una diferencia: además de "activo", hay 2 niveles de rol — `maestro` (control total, único que gestiona otros administradores) y `limitado` (gestión operativa, sin poder tocar la tabla `administradores`). La razón de fondo: un panel con acceso total sobre agencias/coordinadores necesita que la diferencia de poder viva en RLS, no solo en la interfaz — así, aunque haya un error de código o alguien manipule el navegador, Supabase igual rechaza la operación si el rol no es el correcto.

```sql
-- Funciones SECURITY DEFINER: necesarias porque una política de RLS sobre
-- "administradores" no puede consultar "administradores" dentro de sí misma
-- sin esto (recursión). Corren con permisos elevados solo para esta
-- verificación puntual, nunca se usan para lectura/escritura general.
CREATE OR REPLACE FUNCTION is_admin_activo(check_email text)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM administradores WHERE email = check_email AND status = 'activo'
  )
$$;

CREATE OR REPLACE FUNCTION is_admin_maestro(check_email text)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM administradores WHERE email = check_email AND status = 'activo' AND rol = 'maestro'
  )
$$;

-- administradores: cualquier admin activo puede leer el directorio completo
-- (para saber quién más tiene acceso), pero solo Maestro puede
-- crear/editar/eliminar registros — así nadie "limitado" se auto-asciende.
CREATE POLICY "administradores_lectura_admin_activo" ON administradores
  FOR SELECT USING ( is_admin_activo(auth.email()) );
CREATE POLICY "administradores_insert_maestro" ON administradores
  FOR INSERT WITH CHECK ( is_admin_maestro(auth.email()) );
CREATE POLICY "administradores_update_maestro" ON administradores
  FOR UPDATE USING ( is_admin_maestro(auth.email()) ) WITH CHECK ( is_admin_maestro(auth.email()) );
CREATE POLICY "administradores_delete_maestro" ON administradores
  FOR DELETE USING ( is_admin_maestro(auth.email()) );

-- bitacora_admin: append-only a propósito. Cualquier admin activo puede
-- insertar (queda registrada su propia acción), pero SOLO Maestro puede
-- leerla — y no existe política de UPDATE ni DELETE para nadie, ni
-- siquiera Maestro: es la protección contra "borrar el rastro".
CREATE POLICY "bitacora_admin_insert_activo" ON bitacora_admin
  FOR INSERT WITH CHECK ( is_admin_activo(auth.email()) );
CREATE POLICY "bitacora_admin_lectura_maestro" ON bitacora_admin
  FOR SELECT USING ( is_admin_maestro(auth.email()) );
```

**Nota de arquitectura importante:** estas políticas protegen el acceso *directo* a `administradores`/`bitacora_admin` (ej. si alguien consultara con la llave pública sin pasar por el panel). Las páginas del panel admin en sí (`/admin/solicitudes`, futuras pantallas de CRUD) operan del lado del servidor con `SUPABASE_SERVICE_ROLE_KEY` — la misma llave que ya usa `solicitudes/page.tsx` — que **salta RLS por diseño**. Eso significa que la diferencia Maestro/Limitado sobre `agencias`/`coordinadores` (ej. "Limitado no puede borrar, solo desactivar") debe programarse explícitamente en cada acción del panel, revisando `admin.rol` antes de permitir la operación — RLS no la aplica sola ahí. Se resuelve conforme se construya cada pantalla de CRUD (pendiente, ver tasks.md Sprint 7).

### Autenticación del Portal Admin (2026-08-21)

Login real vía Supabase Auth (no llave compartida — el diseño original de `invitaciones/page.tsx` usaba `NEXT_PUBLIC_ADMIN_KEY`, una variable pública visible en el navegador; se mantiene solo como llave del lado del navegador para esa API puntual, no como mecanismo de acceso al panel). Mismo patrón que coordinador: `middleware.ts` protege `/admin/*` (excepto `/admin/login` y `/admin/reset-password`, ver nota abajo), verificando sesión de Supabase Auth + `administradores.status = 'activo'` por email. Sesión con timer de inactividad de 20 minutos (`components/admin/InactivityGuard.tsx`, envuelve todo `/admin/*` vía `app/admin/layout.tsx`): aviso de 4 segundos sin opción de cancelar, después cierra sesión y redirige a `/admin/login`.

### Recuperación de contraseña — coordinador y admin (2026-08-22)

> **Alcance de esta sección, aclarado 2026-08-22:** esto cubre únicamente "olvidé mi contraseña" de una cuenta que **ya existe**. Para cómo nace la cuenta y su contraseña la primera vez, ver "Alta de cuenta con contraseña propia" más abajo — son 2 mecanismos distintos que comparten componentes (`lib/validarPassword.ts`) pero no la misma llamada de Supabase.

Self-service vía `supabase.auth.resetPasswordForEmail()` (link "¿Olvidaste tu contraseña?" en `/coordinador/login` y `/admin/login`, mini-formulario inline con el email) + `supabase.auth.updateUser({ password })` en la página de destino (`/coordinador/reset-password`, `/admin/reset-password`). Validación de contraseña centralizada en `lib/validarPassword.ts` (8-12 caracteres, letra + número + símbolo), usada por ambos portales para no duplicar la regla.

**Hallazgo técnico — por qué `/admin/reset-password` y `/coordinador/reset-password` están excluidas de `middleware.ts`:** el token de recuperación que genera Supabase viaja en el fragmento de la URL (después de `#`), que por especificación HTTP el navegador **nunca envía al servidor**. `middleware.ts` corre del lado del servidor, en el primer instante en que la página carga — antes de que el JavaScript del navegador alcance a leer ese fragmento y establecer la sesión temporal de recuperación. Sin la excepción, el middleware ve "sin sesión" en ese primer instante y redirige al login, rompiendo el link antes de que el usuario pueda poner su contraseña nueva. Aplica el mismo problema a cualquier futuro flujo de Supabase Auth que dependa de un link por correo (magic link, invitación por email, etc.) — **cualquier ruta de destino de un link de este tipo necesita la misma excepción explícita en `middleware.ts`.**

> ⚠️ **Bug conocido, sin corregir (2026-08-22):** el mismo problema del fragmento de URL puede ocurrir *dentro* de la ventana de tiempo entre que la página carga y el JS termina de procesar el token — nuestra revisión de sesión (`getSession()`) puede correr primero, mostrando "Link inválido o expirado" en un link en realidad válido. Diagnosticado con logs reales de Supabase (confirmado `user_recovery_requested` sí se disparó, pero la página igual mostró error). Pendiente: escuchar el evento de Supabase que avisa cuándo termina de procesar el link, en vez de solo preguntar una vez al cargar.

> ⚠️ **Límite de correos de Supabase, sin resolver (2026-08-22):** el correo default de Supabase (sin SMTP propio) tiene un límite bajo (~3-4/hora) y falla en silencio — responde 200 OK aunque el correo nunca se envíe (por diseño de Supabase, para no revelar qué correos existen). Confirmado con logs de auditoría real durante varias horas de pruebas de esta sesión. Se evaluaron 2 soluciones, ninguna implementada: Resend (requiere dominio propio verificado — José no quiere pagar un dominio todavía) y Gmail SMTP con contraseña de aplicación (José decidió no arriesgar la cuenta de Admin ante la posibilidad, aunque baja, de que Google la marque por actividad automatizada). **Este límite sigue afectando "¿Olvidaste tu contraseña?" y el botón "Resetear contraseña" del admin** — no afecta el alta de cuenta nueva, que se rediseñó para no depender de correo en absoluto (ver abajo).

### Alta de cuenta con contraseña propia — reemplaza el correo automático (2026-08-22)

**Por qué:** el correo automático de Supabase (`inviteUserByEmail`) falló repetidamente durante la sesión — 3 casos reales confirmados con logs de auditoría de Supabase (coordinador de alta manual, coordinador de invitación pública, y una segunda prueba), todos con el mismo patrón: la llamada respondía 200 OK pero el correo nunca llegaba, sin ningún error visible del lado de la aplicación. En vez de resolver la entrega del correo (ver límite de Supabase arriba, sin resolver), se rediseñó el mecanismo para que la contraseña nazca directo en Supabase Auth, sin depender de ningún correo:

- **`supabase.auth.admin.createUser({ email, password, email_confirm: true })`** — crea la cuenta ya confirmada, con la contraseña que la persona (coordinador o José) ya escribió, sin mandar ningún correo. Reemplaza `inviteUserByEmail` en los 2 caminos de alta de coordinador.
- **Camino A (registro público vía invitación):** `FormularioInvitacion.tsx` pide la contraseña directo en el formulario (paso 2, junto con teléfono ahora obligatorio). `app/api/registro-agencia/route.ts` valida y crea la cuenta **antes** de crear agencia/coordinador — si la cuenta falla (ej. email duplicado), no quedan registros huérfanos. Si agencia o coordinador fallan después, se hace rollback de la cuenta de Auth ya creada (`supabase.auth.admin.deleteUser()`).
- **Camino B (alta manual desde `/admin/agencias`):** mismo patrón — José captura una contraseña temporal en el formulario, se crea la cuenta directo, José se la comparte manualmente al coordinador (WhatsApp, etc.).
- **Invitaciones dirigidas por teléfono:** columna `invitaciones.telefono_esperado` (nullable). Si está presente, `registro-agencia` exige que el teléfono capturado coincida exacto antes de crear nada — capa extra de seguridad opcional para cuando José ya sabe con quién está hablando, sin obligar a que todo link sea personalizado.
- **`coordinadores.auth_user_id`** (columna nueva) — guarda el `id` de la cuenta de Auth de cada coordinador, en ambos caminos de creación. Necesaria para poder borrar la cuenta de Auth limpiamente cuando se rechaza o elimina un coordinador (antes no había forma de encontrar qué cuenta de Auth correspondía a qué coordinador sin buscar por email).
- **"Rechazar" ahora borra de verdad:** `app/api/admin/rechazar-agencia/route.ts` pasó de solo cambiar `status` a `'rechazada'` (lo cual acumulaba registros para siempre, sin límite) a borrar la fila de coordinador, agencia, y su cuenta de Auth vía `auth_user_id`. Detectado por José al ver 11 agencias de prueba acumuladas con ese status.

**Pendiente, no resuelto hoy:** el límite de "1 reset de contraseña al día" que José pidió para el flujo de "olvidé mi contraseña" (arriba) — no se construyó, requiere columna de fecha + mover la llamada a un endpoint propio que la revise antes de dejar pasar la solicitud.

### Sistema de referido — token separado del código de login + expiración (2026-08-23/24)

**Reclutador maestro (`7.22`):** `reclutadores.es_maestro` (boolean). Recibe automáticamente todo el tráfico sin `?ref=` (vía fallback en `app/api/postular/route.ts`) y se auto-inscribe en cada agencia nueva que se active (`aprobar-agencia`/`crear-agencia`). Backfill manual a agencias ya existentes al momento de crear el primer maestro, desde `app/api/admin/crear-reclutador-maestro/route.ts`.

**Token público de referido, separado del código de login (`7.25`):** `reclutadores.token_referido` (10 caracteres, `DEFAULT substr(replace(gen_random_uuid()::text,'-',''),1,10)` a nivel de columna — cualquier reclutador nuevo lo recibe automáticamente, sin depender de que cada endpoint que lo crea "se acuerde" de generarlo). El link de referido usa este token (`?ref=fdc6719e6d`), no el `codigo` (`LAURA01`, que sigue siendo exclusivo para el login). `app/api/postular/route.ts` y `app/api/trafico/route.ts` buscan por `token_referido`.

**`localStorage.ref_codigo` con expiración de 30 días (`7.23`):** cambió de string plano a JSON `{ codigo, guardado_en }`. Función centralizada `getCodigoReferido()` en `hooks/useReferido.ts` (standalone, no atada al hook — así la pueden llamar componentes fuera del árbol de `useSearchParams`) revisa la fecha y descarta el valor si ya expiró.

> ⚠️ **Punto de fricción real, para no repetir la próxima vez que se toque este flujo:** existían/existen **3 lugares** que leen este dato — `useReferido.ts`, `useTrafico.ts`, y `components/candidato/ChatModal.tsx` (el que arma la llamada real a `/api/postular`). El tercero no se detectó en el diseño inicial de `7.23`/`7.25` y siguió leyendo `localStorage.getItem('ref_codigo')` directo — con el nuevo formato JSON, eso rompió la asignación de referido en silencio (ninguna postulación fallaba, simplemente todas caían al reclutador maestro sin ningún error visible). Costó cerca de una hora de diagnóstico en vivo antes de encontrarlo. **Antes de dar por completo cualquier cambio futuro a este dato, buscar el texto exacto `ref_codigo` en todo el repo (`Ctrl+Shift+F`) en vez de confiar en la lista de archivos que el diseño original identificó.**

### RLS faltante para reclutador — 3 tablas encontradas en cadena (2026-08-23)

Al construir `4.12d` (KPIs personales del reclutador en su Dashboard), salieron 3 políticas de `SELECT` faltantes seguidas, todas con el mismo origen: el reclutador opera como rol `anon` (sin sesión de Supabase Auth), y estas 3 tablas nunca antes habían tenido un caso de uso donde el reclutador necesitara leerlas directo desde el navegador — siempre se habían consultado desde el lado del coordinador. El hueco llevaba ahí desde que se crearon las tablas, sin que nada lo hubiera expuesto hasta ahora.

```sql
-- agencias: el reclutador necesita leer ultimo_corte_at para calcular
-- "Corte abierto". La única política existente (agencias_lectura_coordinador)
-- usa auth.email(), que el reclutador nunca tiene.
CREATE POLICY "agencias_lectura_reclutador" ON agencias
  FOR SELECT TO anon USING (true);

-- trafico_referidos: el reclutador necesita ver SUS propias fuentes de
-- tráfico (gráfica de dona). Ya existía trafico_referidos_select_coordinador,
-- ninguna para anon.
CREATE POLICY "trafico_referidos_lectura_reclutador" ON trafico_referidos
  FOR SELECT TO anon USING (true);

-- cortes_semana: el reclutador necesita encontrar el corte_id de su último
-- corte pagado, para el resumen de "Corte anterior".
CREATE POLICY "cortes_lectura_reclutador" ON cortes_semana
  FOR SELECT TO anon USING (true);
```

**Nota:** las 3 son políticas abiertas (`using (true)`) porque el reclutador no tiene una sesión de la cual verificar identidad — el filtro real (solo sus propios datos) ya lo hace el código del lado del cliente, con el `reclutador_id`/`agencia_id` que trae desde su sesión local (mismo patrón ya documentado arriba para `postulaciones`, `coordinadores`, `reclutador_agencia`).

### Recordatorio operativo — el bug más común del proyecto

Antes de construir cualquier función que escriba (`INSERT`/`UPDATE`/`DELETE`) en una tabla, **verificar primero sus políticas** con:
```sql
select policyname, cmd from pg_policies where tablename = 'nombre_tabla';
```
Ha pasado **muchísimas veces**: una tabla tiene `SELECT` pero le falta `INSERT`, o tiene `INSERT` pero le falta `DELETE` — Supabase falla en silencio, sin ningún error visible en pantalla, y el síntoma se ve como "no se guarda" o "el botón no hace nada".

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

> **Recordatorio operativo (bug recurrente #2 del proyecto):** un canal Realtime bien escrito en el código **no sirve de nada** si la tabla no está agregada a la publicación de Supabase. Ha pasado varias veces (`postulaciones`, `historial_etapas`, `trafico_referidos`, `vacantes`, `documentos_negocio`, `faq_escalaciones` — todas tuvieron que agregarse manualmente en algún momento, ninguna lo traía por default). Verificar siempre con:
> ```sql
> select tablename from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'nombre_tabla';
> ```
> Si no sale ninguna fila: `alter publication supabase_realtime add table nombre_tabla;`

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

**SEO de sitio completo, independiente del SEO por vacante (agregado 2026-08-25, ver spec.md CA-05.4):** `app/layout.tsx` (raíz) tiene su propio `metadata` estático, aplicado a todo el sitio (Home, `/vacantes`, etc.) — distinto del `generateMetadata` dinámico por vacante de arriba, que solo aplica a `/vacante/[id]`.

```typescript
// app/layout.tsx
const SITE_URL = 'https://tu-chamba-express.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Empleos en Nuevo León, CDMX y más | TuChamba Express — Contratación Directa',
  description: 'Encuentra vacantes en Nuevo León, CDMX, Estado de México y más...',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: '...', description: '...', url: SITE_URL,
    type: 'website', images: ['/Logo_Header.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EmploymentAgency',  // distinto de "JobPosting" — identidad de la organización, no de una vacante
  name: 'TuChamba Express',
  url: SITE_URL,
  areaServed: [/* Nuevo León, CDMX, Estado de México — cobertura real */],
  sameAs: ['https://www.facebook.com/tuchambaexpressoficial'],
}
// inyectado como <script type="application/ld+json"> dentro de <head>, vía JSX manual
```

**Nota de tooling, no arquitectura (2026-08-25):** al agregar `import './globals.css'` (línea ya existente, sin tocar) apareció el error `TS2882: Cannot find module or type declarations for side-effect import`. Confirmado que **no es un bug real ni relacionado a los cambios de SEO** — es un cambio de comportamiento de TypeScript 6.0 (`noUncheckedSideEffectImports`, activado por defecto), que ahora exige declaración explícita para imports sin exports (como CSS). Next.js aún no incluye esa declaración por defecto. Resuelto agregando `globals.d.ts` en la raíz del repo:
```typescript
declare module '*.css';
```

---

## 9. SITEMAP — dinámico con Next.js (corregido 2026-08-10)

> **Reemplaza por completo el mecanismo de V1** (Edge Function que generaba
> el XML y lo commiteaba a GitHub vía API, con trigger manual en cada
> guardado). Se detectó que Next.js 14 App Router soporta sitemaps dinámicos
> de forma nativa — más simple, sin GitHub token que administrar, sin
> despliegues extra, y siempre actualizado por diseño (se genera fresco en
> cada visita a `/sitemap.xml`, no depende de que un trigger se ejecute
> correctamente). Ver spec.md CA-05.3 corregida.

**Implementación real:** `app/sitemap.ts` — ver §2 (estructura de repositorio)
para su ubicación. Consulta Supabase en vivo, filtra `status = 'vigente'`,
usa `updated_at` como `lastModified`. No requiere ninguna Edge Function,
ningún `GITHUB_TOKEN`, ningún trigger de base de datos.

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

```
Nota (2026-08-20): el diseño original de esta sección proponía una Edge
Function `agente-faq` con Claude API para el Nivel 3. Se construyó distinto
(ver spec.md CA-03.6, tasks.md 4.14/4.15/5.12) — decisión explícita de no
usar Edge Function ni IA todavía:

- Niveles 1 y 2: lib/faq.ts, funciones puras client-side (buscarRespuestaNivel1,
  buscarRespuestaNivel2), sin llamada a ningún servidor — se ejecutan en el
  navegador del reclutador, instantáneo.
- Nivel 3: en vez de un mensaje_interno + Claude, inserta directo en la tabla
  faq_escalaciones (nueva, distinta de faqs_vacante que ya existía) + una
  alerta al coordinador. El coordinador responde en /coordinador/faq (5.12),
  con un toggle para guardar la respuesta en faqs_vacante y así habilitar el
  Nivel 2 la próxima vez.

La versión con Edge Function + Claude queda en el backlog de "agentes de IA
reales" (tasks.md, ~4-5 meses) — se retomará cuando llegue ese momento.
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

### Mapa de dependencias de llaves foráneas — para borrados masivos (2026-08-25)

Al limpiar todos los datos de prueba para el arranque de producción (`8.22`), el orden de borrado intuitivo falló 2 veces por FKs no anticipadas. Mapa completo, consultado vía `information_schema`, para no tener que redescubrirlo si se vuelve a necesitar un borrado masivo:

```
Depende de → agencias:       chats, coordinadores, cortes_semana, faq_escalaciones,
                              postulaciones, reclutador_agencia, trafico_referidos, vacantes
Depende de → candidatos:     chats, documentos_candidato, postulaciones
Depende de → coordinadores:  chats, cortes_semana (generado_por), faq_escalaciones (respondido_por),
                              faqs_vacante (respondido_por), vacantes (creado_por)
Depende de → negocios:       documentos_negocio, vacantes
Depende de → reclutadores:   alertas, chats, faq_escalaciones (preguntado_por),
                              faqs_vacante (preguntado_por), postulaciones,
                              reclutador_agencia, trafico_referidos
Depende de → vacantes:       chats, faq_escalaciones, faqs_vacante, postulaciones,
                              precalificaciones_fallidas, trafico_referidos
```

**Orden seguro de borrado** (hijos antes que padres): `mensajes` → `chats` → `historial_etapas` → `precalificaciones_fallidas` → `faqs_vacante` → `faq_escalaciones` → `documentos_candidato` → `alertas` → `postulaciones` → `trafico_referidos` → `documentos_negocio` → `vacantes` → `negocios` → `cortes_semana` → `invitaciones` → `reclutador_agencia` → `coordinadores` → `reclutadores` → `candidatos` → `agencias`.

**Nota:** borrar `coordinadores` por SQL directo **no borra sus cuentas de Supabase Auth** — quedan huérfanas y hay que borrarlas manualmente desde Authentication → Users, o intentar volver a registrar ese mismo correo fallará por duplicado.

### Patrón de riesgo — campos cargados async que se guardan sin confirmar que ya llegaron (2026-08-27)

En `VacanteModal.tsx`, los campos "de empresa, no de vacante" (`dias_descanso`, `dias_entrevista`, `rutas`, `ubicacion_maps` — todos con el mismo diseño: viven en `negocios`, se cargan en memoria vía `useEffect` cuando llega la lista completa de `negocios` de Supabase) tenían un hueco real: si "Guardar" se disparaba antes de que esa carga terminara, el `update` mandaba el valor inicial vacío de esos campos a la base de datos, **sobreescribiendo en silencio datos reales que la empresa ya tenía** (caso real: las 20 rutas con nombre de TOPBAND se borraron así, sin ningún error visible).

**Fix aplicado:** bandera `datosEmpresaCargados`, activada solo dentro del mismo `useEffect` cuando se confirma que la empresa sí se encontró y cargó — el guardado de esos campos se bloquea con un error explícito si la bandera sigue en `false`, en vez de escribir valores vacíos.

**Este mismo patrón de riesgo aplica a cualquier campo futuro con el mismo diseño** (cargado async en un `useEffect`, editable, y guardado en un `update` separado del payload principal de la vacante) — si se agrega un campo nuevo así, replicar la misma protección desde el inicio, no solo después de perder datos reales.

### `position: sticky` NO funciona en el entorno de José — usar siempre el patrón de JS + `position: fixed` (2026-08-29/30)

**Hallazgo confirmado con un experimento controlado, no una sospecha:** en el navegador/entorno real de José, `position: sticky` produce renderizado roto — no es que "no se pegue", el contenido se coloca en la posición equivocada (encabezados de tabla apareciendo debajo de la primera fila de datos, en vez de arriba). Se probaron y descartaron 3 técnicas distintas de `sticky` (en `<thead>`, en cada `<th>`, y en una rejilla CSS completa), las 3 con el mismo resultado roto — se descartó código propio, `globals.css`, y layouts intermedios (los 3 confirmados limpios con `diff`). Solo se confirmó la causa real quitando `sticky` por completo: sin él, todo se veía correcto.

**Patrón obligatorio a partir de ahora para cualquier "esto debe quedarse fijo al hacer scroll":**
1. `useRef` en el elemento que debe quedarse fijo (o uno de referencia)
2. Un solo `useEffect` que mida `ref.current.getBoundingClientRect().top + window.scrollY` — **cuidado con el timing:** si el elemento está detrás de un condicional (`loading`, etc.), la dependencia del `useEffect` debe incluir esa condición (ej. `[loading]`), no solo `[]` — si se mide antes de que el elemento exista, la medición se queda en `0`, y `0` "parece" que ya se hizo scroll desde el principio. Agregar también un guard (`if (offset === 0) return`) como protección extra.
3. Un listener de `window.addEventListener('scroll', ...)` que compara `window.scrollY` contra esa medición, y activa un estado (`fijo`)
4. Cuando `fijo` es `true`, renderizar una **barra duplicada** con `position: fixed`, con el mismo contenido visual (mismas columnas exactas si es una tabla — usar una constante de ancho de columnas compartida entre la versión real y la duplicada, para que queden alineadas)

**Nunca usar `sticky` primero "para probar"** — ya se confirmó que falla en este entorno específico, ir directo al patrón de arriba ahorra tiempo. Aplicado hoy en `Vacantes` del reclutador y `Vacantes` del coordinador (`7.44`).

### Patrón de diseño: catálogo compartido por empresa + selección con excepción por vacante (`7.38`, 2026-08-31)

Cuando un dato "pertenece" a la empresa pero una vacante puntual necesita poder excluirlo (caso real: una ruta de Hyundai Glovis que solo aplica a un puesto, no a toda la empresa), la solución que funcionó fue: **tabla de catálogo por `negocio_id`** (no por `vacante_id`) + **tabla de relación N a N** entre esa vacante y el catálogo, **con todo autoseleccionado por default**. La selección manual solo sirve para desmarcar la excepción rara — nunca para marcar el caso normal, que sería fricción sin valor real en el 95% de los casos. Este patrón (catálogo de empresa + default-todo-seleccionado + relación para excepciones) es replicable para cualquier dato futuro con la misma forma ("la empresa lo tiene, casi todas sus vacantes lo usan igual, mismo caso raro de excepción").

**Lección de proceso, no solo de datos:** este mismo feature (`7.38`) se había intentado diseñar 3 veces en sesiones anteriores y se pausó las 3 sin construirse — lo que finalmente lo destrabó no fue iterar más rápido, sino **una conversación de una sola pregunta directa a la persona que de verdad opera el proceso en la vida real (Roxana)**, que reveló que la variedad aparente en los documentos crudos en realidad eran solo 4 categorías fijas, no un caos sin patrón. Cuando un feature se resiste a diseñarse bien después de varios intentos, vale la pena parar de iterar sobre el diseño y buscar la fuente humana correcta primero.

### Nunca confiar en un `prop` de un componente padre que no se tiene a la vista — consultar la BD directo (`8.23`, 2026-09-01)

**El bug más caro del día, repetido 3 veces sin que se notara hasta la verificación final.** `KanbanCard.tsx` recibe `postulacion` como prop desde `KanbanBoard.tsx` — un archivo que nunca se ha pedido ni modificado en ninguna sesión, así que no hay visibilidad real de qué columnas selecciona su `.select()`. Código nuevo que asumía "seguro que `postulacion.campo_nuevo` ya viene ahí" falló en silencio 3 veces distintas hoy:
1. Al reabrir "Ver entrevista", destino/medio/ruta/punto no se precargaban (el prop no traía `entrevista_activa`)
2. Al reabrir el modal 📎, el checklist de documentos no se precargaba (el prop no traía `documentos_entrevista_checklist`)
3. **El más serio, no descubierto hasta que José probó el flujo completo con SQL en mano:** los botones "Sí"/"No" de asistencia a entrevista nunca escribían el resultado en la tabla `entrevistas` — dependían de `postulacion.entrevista_activa_id`, que casi seguro nunca llegaba en el prop, así que la condición `if (postulacion.entrevista_activa_id)` se saltaba en silencio, sin ningún error visible. El historial de asistencia real **nunca se estaba guardando**, aunque la tarjeta del momento se veía perfecta — el bug era invisible sin ir a la base de datos a confirmar.

**Regla concreta para cualquier componente que reciba datos por prop de un padre no visible en la sesión actual:** si el código va a **leer** un campo que se agregó recién (no estaba en el diseño original del padre), o va a **depender de un campo para decidir si ejecuta una escritura** (como el `if` del punto 3), hacer una consulta propia a Supabase en ese momento en vez de confiar en el prop. Cuesta una consulta extra; el precio de no hacerlo es un fallo silencioso que puede pasar desapercibido durante toda una sesión de pruebas, porque el estado *visible* en pantalla se ve correcto aunque lo que se guarda no lo sea.

### RLS `TO anon` se rompe si el navegador tiene CUALQUIER sesión de Auth abierta en otra pestaña — usar `TO anon, authenticated` (`7.39`, 2026-09-02)

**Bug real, encontrado tras una sesión larga de diagnóstico paso a paso (SQL editor → RLS → `fetch()` directo sin la librería de Supabase → por fin aislado).** El reclutador entra por código, sin sesión de Supabase Auth — así que sus políticas de lectura (`agencias`, `reclutador_agencia`, y probablemente otras) se escribieron `TO anon` únicamente, con el razonamiento de "el reclutador siempre es anónimo". **Ese razonamiento es incorrecto en la práctica:** el cliente de Supabase en el navegador manda automáticamente **cualquier** sesión de Auth que exista en ese navegador — sin importar qué pantalla esté abierta. Si José (o cualquiera) tiene una pestaña de Admin o Coordinador con sesión activa, **todas** las peticiones de ese mismo navegador —incluidas las del reclutador, en otra pestaña— se mandan con rol `authenticated`, no `anon`. Como esas políticas no cubrían `authenticated`, el resultado era un arreglo vacío `[]`, sin ningún error — parecía que la pantalla se quedaba "cargando" para siempre.

**Cómo se diagnosticó, para repetir el método si vuelve a pasar:** (1) confirmar que el dato existe en la BD vía SQL editor (usa una conexión privilegiada, no ve el problema); (2) confirmar que las políticas RLS se ven correctas en `pg_policies`; (3) hacer la MISMA petición con `fetch()` directo desde la consola del navegador, sin pasar por la librería de Supabase — esto reveló que la tabla base sí respondía bien, pero el embed relacionado no; (4) la pista que cerró el caso: José mencionó que Admin y Coordinador se cierran la sesión mutuamente en el mismo navegador — eso llevó a probar el reclutador en una pestaña completamente aislada (sin ninguna otra sesión abierta), que sí funcionó. La combinación de "funciona solo/aislado" + "falla con otras sesiones abiertas" es la huella dactilar exacta de este bug.

**Regla para toda política RLS pensada para el reclutador (o cualquier rol que entra "sin sesión real"):** nunca escribirla solo `TO anon` — siempre `TO anon, authenticated`, porque no hay forma de garantizar que el navegador del usuario esté "limpio" de otras sesiones. Pendiente auditar el resto de la base de datos por el mismo patrón — ver `7.50`.

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
