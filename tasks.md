# ✅ TASKS: TUCHAMBA EXPRESS 2.0
> **Versión:** 2.0 | **Fecha de actualización:** 2026-06-27

---

## 🔒 PROTOCOLO OPENSPEC / SPECBOOT POR TAREA

> Cada tarea atómica de este documento sigue el mismo ciclo, sin excepción:

```
/new      → Claude genera el proposal (qué se va a hacer y cómo)
/apply    → Claude ejecuta (branch, código, SQL, tests, documentación)
/verify   → Tú confirmas contra el Criterio de Aceptación del spec.md
/code_review → Claude audita su propio código contra plan.md
            (sin equipo de revisores humanos: Claude es el revisor)
implement changes → si hay observaciones, se corrige antes de archivar
/archive + /commit → Marcas [X] en tasks.md — esa tarea es inmutable
```

**REGLA CONSTITUCIONAL:** Una sola tarea activa a la vez. Sin `/verify` no hay `/archive`. Sin `/archive` no hay `/new` de la siguiente tarea. Si surge una idea nueva a mitad de un sprint, va al Backlog — nunca interrumpe la tarea activa.

---

## SPRINT 0 — DISEÑO DE API INTERNA (API-first desde el día 1)
> **Objetivo:** Documentar los endpoints que cualquier humano o agente futuro (Cline, Claude Code, OpenClaw) va a necesitar — antes de escribir el primer Edge Function real. Esto es lo que hace al sistema "preparado para autonomía" sin construir autonomía todavía.

- [ ] 0.1 Crear carpeta `supabase/functions/` con un archivo `API.md` documentando cada endpoint planeado (ver plan.md §10): método, ruta, input esperado, output esperado.
- [ ] 0.2 Definir el esquema de autenticación por API key para los endpoints internos (header `Authorization: Bearer <key>`).
- [ ] 0.3 Crear `CLAUDE.md` en la raíz del proyecto con las reglas permanentes (ver plantilla en este documento, sección final).
- [ ] 0.4 Auditar el código existente en la carpeta del proyecto (`registro-agencia`, `dashboard` mockup) contra spec.md — decidir explícitamente: se reescribe, se descarta a backup, o se conserva parcialmente.

**✓ Criterio de avance:** `API.md` documentado, `CLAUDE.md` en la raíz, decisión tomada y registrada sobre el código preexistente.

---

## SPRINT 1 — CIMIENTOS SUPABASE
> **Objetivo:** Base de datos funcionando con RLS activado. Sin esto no existe ningún otro sprint.

- [ ] 1.1 Crear proyecto en Supabase (o confirmar el ya existente). Copiar `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` a `.env.local`.
- [ ] 1.2 Verificar `.gitignore` con `.env.local` incluido. Confirmar con `git status` que NO aparece como archivo trackeado.
- [ ] 1.3 Tabla `agencias` (con `status`, `invitacion_id`, `aprobado_por`, `aprobado_at` — ver spec.md §8).
- [ ] 1.4 Tabla `coordinadores` (con `status` — ver spec.md §8).
- [ ] 1.5 Tabla `reclutadores`.
- [ ] 1.6 Tabla `reclutador_agencia` con UNIQUE(reclutador_id, agencia_id).
- [ ] 1.7 Tabla `negocios`.
- [ ] 1.8 Tabla `vacantes` con todos los campos (capa pública + logística + operativo + ATS + comercial).
- [ ] 1.9 Tabla `candidatos`.
- [ ] 1.10 Tabla `postulaciones` (incluyendo `score`).
- [ ] 1.11 Tabla `historial_etapas` (trazabilidad del ATS).
- [ ] 1.12 Tabla `documentos_candidato`.
- [ ] 1.13 Tabla `chats` (sistema unificado — 4 tipos de conversación).
- [ ] 1.14 Tabla `mensajes` (sistema unificado).
- [ ] 1.15 Tabla `faqs_vacante`.
- [ ] 1.16 Tabla `invitaciones`.
- [ ] 1.17 Tabla `alertas`.
- [ ] 1.18 Tabla `cortes_semana` con UNIQUE(agencia_id, semana).
- [ ] 1.19 Tabla `trafico_referidos`.
- [ ] 1.20 Activar Realtime en: `mensajes`, `chats`, `alertas`.
- [ ] 1.21 Activar RLS en TODAS las tablas. Crear políticas de plan.md §5 (incluyendo la regla de que coordinador nunca edita/elimina su propia agencia).
- [ ] 1.22 Insertar datos de prueba: 1 agencia activa, 1 coordinador activo, 2 reclutadores, 2 negocios, 3 vacantes vigentes.
- [ ] 1.23 Verificar desde Supabase Table Editor que los datos se ven correctamente y que RLS bloquea acceso no autorizado.

**✓ Criterio de avance:** Las 3 vacantes de prueba son visibles desde una query pública (anon key). Las tablas operativas no son accesibles sin autenticación correspondiente.

---

## SPRINT 2 — PROYECTO NEXT.JS + DEPLOY BASE
> **Objetivo:** App Next.js en Vercel, conectada a Supabase, con `.env.local` correcto.

- [ ] 2.1 Decisión sobre código existente del Sprint 0.4 ya ejecutada: crear proyecto con `npx create-next-app@latest tuchamba-v2 --typescript --tailwind --app` (o adaptar el existente según lo decidido).
- [ ] 2.2 Instalar dependencias: `@supabase/ssr`, `@supabase/supabase-js`, `lucide-react`, `@dnd-kit/core`, `@dnd-kit/sortable`, `recharts`.
- [ ] 2.3 Instalar y configurar Shadcn/ui (`npx shadcn-ui@latest init`).
- [ ] 2.4 Crear `lib/supabase/client.ts` y `lib/supabase/server.ts` (ver plan.md §4).
- [ ] 2.5 Crear `lib/utils.ts` con `getSemanaISO`, `calcularComision`, `calcularGarantiaFin`, `generarTokenInvitacion`.
- [ ] 2.6 Crear estructura de carpetas `app/` según plan.md §2 (rutas vacías por ahora, solo el esqueleto).
- [ ] 2.7 Crear `public/robots.txt` y `public/manifest.json` base.
- [ ] 2.8 Configurar Sentry (`npx @sentry/wizard@latest -i nextjs`).
- [ ] 2.9 Configurar PostHog (instalar `posthog-js`, inicializar en root layout).
- [ ] 2.10 Subir a GitHub. Verificar que `.env.local` NO está en el repositorio.
- [ ] 2.11 Conectar repositorio a Vercel. Configurar variables de entorno en Vercel Dashboard (incluyendo las que NO llevan `NEXT_PUBLIC_`).
- [ ] 2.12 Verificar que el deploy en Vercel carga sin errores de consola.
- [ ] 2.13 Query de prueba a Supabase desde un Server Component, confirmar que devuelve las 3 vacantes de prueba.

**✓ Criterio de avance:** URL de Vercel carga, Server Component trae las 3 vacantes, `.env.local` no está en GitHub, Sentry y PostHog reciben al menos un evento de prueba.

---

## SPRINT 3 — PORTAL CANDIDATO + SISTEMA DE INVITACIÓN
> **Objetivo:** Candidato puede ver vacantes, postularse, y el flujo de invitación de agencias funciona de punta a punta.

- [ ] 3.1 `app/page.tsx`: listado de vacantes vigentes (Server Component, query directa a Supabase).
- [ ] 3.2 Paginación de 15 vacantes por página.
- [ ] 3.3 Buscador por texto (título, empresa, ciudad) con normalización de acentos — Client Component.
- [ ] 3.4 Filtros de Estado y Ciudad (dependientes).
- [ ] 3.5 `app/vacante/[id]/page.tsx`: detalle completo, incluyendo letras chiquitas, rutas, logística y beneficios.
- [ ] 3.6 `generateMetadata` dinámico por vacante (título, description, canonical limpio) — ver plan.md §8.
- [ ] 3.7 `JobPostingSchema.tsx` como Server Component dentro del detalle de vacante.
- [ ] 3.8 Verificar en DevTools que el canonical NUNCA incluye `?ref=`.
- [ ] 3.9 Hook `useReferido.ts`: leer `?ref=CODIGO` de URL, guardar en localStorage, persistir entre navegaciones.
- [ ] 3.10 Modal/Client Component de chat: al hacer clic en "Postularme", pedir nombre y teléfono (mínimo 10 dígitos).
- [ ] 3.11 Al confirmar: crear `candidato` (si no existe, por teléfono), crear `postulacion` con `etapa_actual = "Aplicado"`, crear `chat` tipo `candidato_reclutador`.
- [ ] 3.12 Si ya existe chat para teléfono+vacante+reclutador: retomar sin duplicar.
- [ ] 3.13 `reclutador_id` de la postulación se asigna desde el código de referido en localStorage (si existe).
- [ ] 3.14 Componente `ChatWindow.tsx`: mensajes en tiempo real vía canal `chat:{chatId}` de Supabase Realtime.
- [ ] 3.15 Estado visible de postulación en la vista de chat del candidato (badge con etapa actual).
- [ ] 3.16 Detección de fuente de tráfico al cargar la página, registro en `trafico_referidos`.
- [ ] 3.17 Botón admin oculto cuando URL contiene `?ref=`.
- [ ] 3.18 `app/admin/invitaciones/page.tsx`: botón "Generar invitación", crea token único con expiración de 7 días.
- [ ] 3.19 `app/invitacion/[token]/page.tsx`: valida token (existe, no usado, no expirado). Si inválido, mensaje de error claro.
- [ ] 3.20 Paso 1 del formulario de invitación: datos de la agencia → status `pendiente_aprobacion`.
- [ ] 3.21 Paso 2 (mismo flujo, sin cortar sesión): datos del coordinador → status `pendiente_aprobacion`, vinculado a la agencia recién creada.
- [ ] 3.22 Pantalla de "Tu cuenta está en revisión" para coordinador con status pendiente.
- [ ] 3.23 `app/coordinador/solicitudes/page.tsx` (vista admin): lista de agencias+coordinadores pendientes con botones Aprobar/Rechazar.
- [ ] 3.24 Al aprobar: `agencia.status = 'activa'`, `coordinador.status = 'activo'` simultáneamente.

**✓ Criterio de avance:** Candidato puede ver vacantes, postularse, chatear en tiempo real. Un coordinador puede completar el flujo de invitación de punta a punta y quedar pendiente hasta que el admin lo aprueba.

---

## SPRINT 4 — PORTAL RECLUTADOR (PWA) + ATS
> **Objetivo:** Reclutador gestiona su pipeline con trazabilidad completa.

- [ ] 4.1 `app/reclutador/login/page.tsx`: login por código. Consulta tabla `reclutadores`. Sesión en cookie/localStorage (sin Supabase Auth nativo).
- [ ] 4.2 `app/reclutador/dashboard/page.tsx`: métricas básicas (candidatos activos, colocados este mes, comisión estimada).
- [ ] 4.3 `app/reclutador/pipeline/page.tsx`: Kanban con columnas de etapas personalizadas por vacante.
- [ ] 4.4 Cards de candidato: nombre, vacante, días en etapa actual (calculado desde `historial_etapas`), badge mensaje nuevo.
- [ ] 4.5 Drag and drop con `@dnd-kit` entre columnas.
- [ ] 4.6 Al soltar card: actualizar `postulaciones.etapa_actual` + insertar fila en `historial_etapas` (etapa_anterior, etapa_nueva, cambiado_por).
- [ ] 4.7 Modal de confirmación al mover a "Contratado": pedir fecha de contratación, calcular garantía (`calcularGarantiaFin`), calcular comisión (`calcularComision`).
- [ ] 4.8 Modal de confirmación al mover a "Descartado": pedir motivo (renuncia/despido_empresa/despido_causa/otro).
- [ ] 4.9 Campo opcional de `score` (1-5) por postulación, editable desde la card.
- [ ] 4.10 `app/reclutador/chats/page.tsx`: lista de chats tipo `candidato_reclutador`, badge "Nuevo" si último sender fue candidato.
- [ ] 4.11 `ChatWindow.tsx` reusado: mensajes en tiempo real, input multiline, scroll automático.
- [ ] 4.12 Formulario de registro manual de candidato externo (`es_manual = true`).
- [ ] 4.13 `app/reclutador/vacante/[id]/page.tsx`: ficha operativa completa (contacto RRHH, logística, FAQ existente).
- [ ] 4.14 Input de pregunta nueva: primero consulta Nivel 1 (campos estructurados) localmente antes de llamar a cualquier función.
- [ ] 4.15 Si Nivel 1 no resuelve, invoca Edge Function `agente-faq` (que internamente revisa Nivel 2 FAQ, y si no hay match, escala a Nivel 3 coordinador).
- [ ] 4.16 `app/reclutador/comisiones/page.tsx`: resumen de la semana actual con estado de garantía y monto a cobrar el viernes.
- [ ] 4.17 Panel de alertas: lista de alertas no leídas, click navega al contexto relevante.
- [ ] 4.18 Hook `useAlertas.ts`: verificación periódica de candidatos sin movimiento 48h, garantías ≤3 días, entrevistas vencidas.
- [ ] 4.19 `documentos_candidato`: subida de CV/identificación a Supabase Storage, vinculado a la postulación.
- [ ] 4.20 Configurar PWA: `manifest.json` completo, `public/sw.js` básico.
- [ ] 4.21 Verificar en Chrome DevTools → Application → Manifest que el PWA es instalable en Android.

**✓ Criterio de avance:** Reclutador gestiona pipeline con historial de cambios registrado, chatea en tiempo real, ve su comisión semanal, y las preguntas estructuradas (Nivel 1) se resuelven sin ningún costo de IA.

---

## SPRINT 5 — PORTAL COORDINADOR — ALTA DE VACANTE Y GESTIÓN
> **Objetivo:** Coordinador gestiona vacantes (8 bloques), reclutadores y FAQ.

- [ ] 5.1 `app/coordinador/login/page.tsx`: email + password con Supabase Auth.
- [ ] 5.2 Middleware de ruta: redirige a login si no hay sesión, y a "en revisión" si `status != 'activo'`.
- [ ] 5.3 `app/coordinador/vacantes/page.tsx`: listado de vacantes de la agencia, filtros de status y prioridad.
- [ ] 5.4 `VacanteForm` — Bloque 1: Identidad (título, negocio, visibilidad empresa).
- [ ] 5.5 `VacanteForm` — Bloque 2: Ubicación y modalidad.
- [ ] 5.6 `VacanteForm` — Bloque 3: Condiciones laborales.
- [ ] 5.7 `VacanteForm` — Bloque 4: Descripción operativa (requisitos, beneficios como listas).
- [ ] 5.8 `VacanteForm` — Bloque 5: Logística especial (rutas, zonas, ruta para entrevista, estacionamiento, comedor, uniforme).
- [ ] 5.9 `VacanteForm` — Bloque 6: Letras chiquitas (texto libre, visible al candidato).
- [ ] 5.10 `VacanteForm` — Bloque 7: Parámetros de reclutamiento (posiciones, reclutadores asignados, garantía, comisión base, promoción, deadline, prioridad).
- [ ] 5.11 `VacanteForm` — Bloque 8: Proceso de selección (etapas personalizadas drag-to-reorder, documentos, examen médico, estudio socioeconómico, contacto RRHH).
- [ ] 5.12 Botón "Generar con IA ✨" que invoca `agente-descripcion-vacante` para autocompletar descripción/beneficios/letras chiquitas desde los datos básicos.
- [ ] 5.13 Al guardar vacante: trigger de sincronización de sitemap (`sync-sitemap` Edge Function).
- [ ] 5.14 `app/coordinador/reclutadores/page.tsx`: CRUD de reclutadores de la agencia.
- [ ] 5.15 `app/coordinador/pipeline/page.tsx`: Kanban global de la agencia (filtrable por vacante/reclutador).
- [ ] 5.16 `app/coordinador/faq/page.tsx`: preguntas escaladas (Nivel 3) sin responder con alerta visual, formulario de respuesta, toggle "Publicar en FAQ".
- [ ] 5.17 Chat coordinador↔reclutador (tipo `reclutador_coordinador`): lista de conversaciones, contextuales por vacante o generales.
- [ ] 5.18 Trigger de alerta proactiva: al cambiar `vacantes.status`, notificar a todos los reclutadores con postulaciones activas en esa vacante (ver spec.md CA-07.6).
- [ ] 5.19 `app/coordinador/corte-semanal/page.tsx`: resumen automático por reclutador (efectivos, no efectivos, total a pagar).
- [ ] 5.20 Botón "Marcar semana como pagada": actualiza `cortes_semana.pagado` y `postulaciones.pagado`, genera resumen descargable.

**✓ Criterio de avance:** Coordinador crea una vacante completa (8 bloques), la IA ayuda a redactar la descripción, el sitemap se sincroniza, el reclutador la ve en su ficha, y el FAQ resuelve dudas en cascada.

---

## SPRINT 6 — DASHBOARD POWER BI + AGENTES RESTANTES
> **Objetivo:** Coordinador tiene visibilidad completa de su agencia. Los 5 agentes están activos.

- [ ] 6.1 `app/coordinador/dashboard/page.tsx` — Gráfica 1: Vacantes por status (dona).
- [ ] 6.2 Gráfica 2: Embudo de conversión (candidatos por etapa acumulado).
- [ ] 6.3 Gráfica 3: Efectividad por reclutador (colocados vs no efectivos).
- [ ] 6.4 Gráfica 4: Comisiones pagadas vs pendientes vs perdidas (barras apiladas).
- [ ] 6.5 Gráfica 5: Fuentes de tráfico (dona, desde `trafico_referidos`).
- [ ] 6.6 Gráfica 6: Tiempo promedio de colocación por vacante (calculado desde `historial_etapas`).
- [ ] 6.7 Filtros de rango de fechas para todas las gráficas.
- [ ] 6.8 Edge Function `agente-matching`: evalúa mensaje del candidato vs requisitos de la vacante, da retroalimentación en el chat.
- [ ] 6.9 Edge Function `agente-seguimiento`: genera mensaje sugerido cuando una alerta de "sin movimiento 48h" se dispara.
- [ ] 6.10 Edge Function `agente-resumen-semanal`: resumen narrativo automático cada jueves (Supabase Cron) para el coordinador.
- [ ] 6.11 Verificar que `agente-faq` (ya creado en Sprint 4) cierra correctamente el ciclo: estructurado → FAQ → escalación → guardado opcional en FAQ.

**✓ Criterio de avance:** Las 6 gráficas muestran datos reales de las pruebas. Los 5 agentes están desplegados (aunque algunos solo se invoquen manualmente por ahora, sin trigger automático todavía).

---

## SPRINT 7 — PORTAL ADMIN + SEO FINAL + QA
> **Objetivo:** Admin funcional, SEO auditado, pruebas de estrés básicas.

- [ ] 7.1 `app/admin/agencias/page.tsx`: CRUD completo de agencias (única entidad con permiso de editar/eliminar).
- [ ] 7.2 `app/admin/metrics/page.tsx`: métricas globales de la plataforma (todas las agencias).
- [ ] 7.3 Vista global de postulaciones sin filtro de agencia.
- [ ] 7.4 Auditoría SEO: título, meta description, JSON-LD en 3 vacantes distintas con DevTools.
- [ ] 7.5 Verificar canonical sin `?ref=` en 3 escenarios: directo, con referido, compartido en redes.
- [ ] 7.6 Probar sitemap.xml en Google Search Console (submit manual).
- [ ] 7.7 Prueba de estrés Chat: 2 dispositivos simultáneos, verificar tiempo real sin duplicados.
- [ ] 7.8 Prueba de estrés Kanban: mismo candidato movido en 2 tabs simultáneos, verificar resolución de conflicto.
- [ ] 7.9 Prueba de referido: `?ref=CODIGO`, cerrar navegador, reabrir — verificar persistencia en localStorage.
- [ ] 7.10 Prueba PWA: instalar portal reclutador en Android, verificar funcionamiento sin Chrome abierto.
- [ ] 7.11 Lighthouse audit portal candidato: meta >80 Performance, >90 SEO, >90 Accessibility.
- [ ] 7.12 Verificar que ningún coordinador, en ningún status, puede editar/eliminar su propia agencia (prueba manual de RLS).

**✓ Criterio de avance:** Todos los portales funcionan, SEO auditado, chat verificado, PWA instalable, Lighthouse >80, RLS de agencias confirmado infranqueable desde el lado coordinador.

---

## 🗂️ BACKLOG — FASE 2 (post-lanzamiento, fuera del roadmap de 6 meses)

- [ ] Notificaciones push en PWA
- [ ] Integración WhatsApp Business API oficial
- [ ] Sistema de pagos de comisión integrado
- [ ] Exportación de reportes a Excel/PDF
- [ ] Portal empresa (empresa ve sus propias vacantes y candidatos)
- [ ] App nativa Android + iOS con React Native / Expo (3 portales completos)
- [ ] Módulo de ofertas formales
- [ ] Importación masiva de vacantes desde Excel
- [ ] n8n self-hosted para flujos complejos
- [ ] Agente Monitor de Base de Datos (alertas de anomalías)
- [ ] Agente Monitor de Vercel (diagnóstico automático de deploys fallidos)
- [ ] Agente de Salud del Producto (reporte semanal automático al admin)

## 🗂️ BACKLOG — FASE 3 (visión a 12+ meses)

- [ ] Agente de Marketing (ver spec.md §9 — requiere 2-3 meses de datos reales)
- [ ] Agente Competitivo (rastreo de OCC/Indeed/Computrabajo)
- [ ] OpenClaw o agente orquestador propio sobre la API ya documentada
- [ ] Integración estilo Leadsales
- [ ] API pública para terceros (monetización como infraestructura)

---

## 📋 REGISTRO DE SPRINTS COMPLETADOS

| Sprint | Fecha inicio | Fecha cierre | Status |
|--------|-------------|-------------|--------|
| Sprint 0 — Diseño de API | — | — | Pendiente |
| Sprint 1 — Supabase | — | — | Pendiente |
| Sprint 2 — Next.js + Deploy | — | — | Pendiente |
| Sprint 3 — Candidato + Invitación | — | — | Pendiente |
| Sprint 4 — Reclutador + ATS | — | — | Pendiente |
| Sprint 5 — Coordinador + Alta vacante | — | — | Pendiente |
| Sprint 6 — Power BI + Agentes | — | — | Pendiente |
| Sprint 7 — Admin + QA | — | — | Pendiente |

---

## 📄 PLANTILLA CLAUDE.md (crear en la raíz del proyecto — Tarea 0.3)

```markdown
# CLAUDE.md — TuChamba Express 2.0

## Contexto del proyecto
Lee spec.md, plan.md y tasks.md antes de cualquier tarea.
Soy José, fundador sin background técnico profesional previo.
Explica decisiones técnicas en términos simples cuando
recomiendes algo que no esté ya en plan.md.

## Reglas inquebrantables
- NUNCA hardcodear credenciales. Todo va en .env.local
- NUNCA desactivar RLS en Supabase
- NUNCA cambiar el stack definido en plan.md sin preguntarme
- NUNCA marcar una tarea de tasks.md como completa sin que
  yo confirme que pasó el Criterio de Aceptación de spec.md
- NUNCA saltarte el ciclo SPECBOOT (/new antes de /apply)

## Protocolo de cada sesión
1. Al iniciar, revisa qué tareas de tasks.md están [X] vs [ ]
2. Trabaja SOLO la siguiente tarea pendiente en orden
3. Al terminar, hazme un resumen de qué cambió y por qué
4. Espera mi confirmación antes de hacer commit

## Modo sostenimiento (post-lanzamiento, cuando tasks.md esté 100%)
- Revisa logs de Sentry al inicio de cada sesión si están conectados
- Sugiere mejoras de performance solo si las pido explícitamente
- Prioriza estabilidad sobre features nuevas
- Cualquier cambio a código en producción necesita mi aprobación
  explícita antes de aplicarse
```
