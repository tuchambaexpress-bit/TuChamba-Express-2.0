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

- [X] 0.1 Crear carpeta `supabase/functions/` con un archivo `API.md` documentando cada endpoint planeado (ver plan.md §10): método, ruta, input esperado, output esperado.
- [X] 0.2 Definir el esquema de autenticación por API key para los endpoints internos (header `Authorization: Bearer <key>`).
- [X] 0.3 Crear `CLAUDE.md` en la raíz del proyecto con las reglas permanentes (ver plantilla en este documento, sección final).
- [X] 0.4 Auditar el código existente en la carpeta del proyecto (`registro-agencia`, `dashboard` mockup) contra spec.md — decidir explícitamente: se reescribe, se descarta a backup, o se conserva parcialmente.

  **Decisión registrada (2026-06-29):** Se REESCRIBE desde cero.
  Motivo: Supabase se confirmó completamente limpio (sin tabla
  `agencias` previa), por lo que el código viejo apuntaba a una
  estructura de datos que ya no existe. Además, ese formulario era
  autoregistro libre sin token de invitación — incompatible con el
  sistema de invitación con aprobación admin definido en spec.md §8.
  El `dashboard` viejo era solo un mockup visual sin lógica real
  (sidebar con `<div>` no navegables, sin conexión a Supabase).
  No hay pérdida real: ambas pantallas se reconstruyen correctamente
  en Sprint 3 (`/invitacion/[token]`) y Sprint 5 (`/coordinador/dashboard`).
  El diseño visual del sidebar puede inspirar la versión nueva,
  pero el código en sí no se reutiliza.

**✓ Criterio de avance:** `API.md` documentado, `CLAUDE.md` en la raíz, decisión tomada y registrada sobre el código preexistente.

---

## SPRINT 1 — CIMIENTOS SUPABASE
> **Objetivo:** Base de datos funcionando con RLS activado. Sin esto no existe ningún otro sprint.

- [X] 1.1 Crear proyecto en Supabase (o confirmar el ya existente). Copiar `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` a `.env.local`.
- [X] 1.2 Verificar `.gitignore` con `.env.local` incluido. Confirmar con `git status` que NO aparece como archivo trackeado.
- [X] 1.3 Tabla `agencias` (con `status`, `invitacion_id`, `aprobado_por`, `aprobado_at` — ver spec.md §8).
- [X] 1.4 Tabla `coordinadores` (con `status` — ver spec.md §8).
- [X] 1.5 Tabla `reclutadores`.
- [X] 1.6 Tabla `reclutador_agencia` con UNIQUE(reclutador_id, agencia_id).
- [X] 1.7 Tabla `negocios`.
- [X] 1.8 Tabla `vacantes` con todos los campos (capa pública + logística + operativo + ATS + comercial).
- [X] 1.9 Tabla `candidatos`.
- [X] 1.10 Tabla `postulaciones` (incluyendo `score`).
- [X] 1.11 Tabla `historial_etapas` (trazabilidad del ATS).
- [X] 1.12 Tabla `documentos_candidato`.
- [X] 1.13 Tabla `chats` (sistema unificado — 4 tipos de conversación).
- [X] 1.14 Tabla `mensajes` (sistema unificado).
- [X] 1.15 Tabla `faqs_vacante`.
- [X] 1.16 Tabla `invitaciones`.
- [X] 1.17 Tabla `alertas`.
- [X] 1.18 Tabla `cortes_semana` con UNIQUE(agencia_id, semana).
- [X] 1.19 Tabla `trafico_referidos`.
- [X] 1.20 Activar Realtime en: `mensajes`, `chats`, `alertas`.
- [X] 1.21 Activar RLS en TODAS las tablas. Crear políticas de plan.md §5 (incluyendo la regla de que coordinador nunca edita/elimina su propia agencia).
- [X] 1.22 Insertar datos de prueba: 1 agencia activa, 1 coordinador activo, 2 reclutadores, 2 negocios, 3 vacantes vigentes.
- [X] 1.23 Verificar desde Supabase Table Editor que los datos se ven correctamente y que RLS bloquea acceso no autorizado.

**✓ Criterio de avance:** Las 3 vacantes de prueba son visibles desde una query pública (anon key). Las tablas operativas no son accesibles sin autenticación correspondiente.

---

## SPRINT 2 — PROYECTO NEXT.JS + DEPLOY BASE
> **Objetivo:** App Next.js en Vercel, conectada a Supabase, con `.env.local` correcto.

- [X] 2.1 Decisión sobre código existente del Sprint 0.4 ya ejecutada: crear proyecto con `npx create-next-app@latest tuchamba-v2 --typescript --tailwind --app` (o adaptar el existente según lo decidido).
- [X] 2.2 Instalar dependencias: `@supabase/ssr`, `@supabase/supabase-js`, `lucide-react`, `@dnd-kit/core`, `@dnd-kit/sortable`, `recharts`.
- [X] 2.3 Instalar y configurar Shadcn/ui (`npx shadcn-ui@latest init`).
- [X] 2.4 Crear `lib/supabase/client.ts` y `lib/supabase/server.ts` (ver plan.md §4).
- [X] 2.5 Crear `lib/utils.ts` con `getSemanaISO`, `calcularComision`, `calcularGarantiaFin`, `generarTokenInvitacion`.
- [X] 2.6 Crear estructura de carpetas `app/` según plan.md §2 (rutas vacías por ahora, solo el esqueleto).
- [X] 2.7 Crear `public/robots.txt` y `public/manifest.json` base.
- [X] 2.8 Configurar Sentry (`npx @sentry/wizard@latest -i nextjs`).
- [X] 2.9 Configurar PostHog (instalar `posthog-js`, inicializar en root layout).
- [X] 2.10 Subir a GitHub. Verificar que `.env.local` NO está en el repositorio.
- [X] 2.11 Conectar repositorio a Vercel. Configurar variables de entorno en Vercel Dashboard (incluyendo las que NO llevan `NEXT_PUBLIC_`).
- [X] 2.12 Verificar que el deploy en Vercel carga sin errores de consola.
- [X] 2.13 Query de prueba a Supabase desde un Server Component, confirmar que devuelve las 3 vacantes de prueba.

**✓ Criterio de avance:** URL de Vercel carga, Server Component trae las 3 vacantes, `.env.local` no está en GitHub, Sentry y PostHog reciben al menos un evento de prueba.

---

## SPRINT 3 — PORTAL CANDIDATO + SISTEMA DE INVITACIÓN
> **Objetivo:** Candidato puede ver vacantes, postularse, y el flujo de invitación de agencias funciona de punta a punta.

- [X] 3.1 `app/page.tsx`: listado de vacantes vigentes (Server Component, query directa a Supabase).
- [X] 3.2 Paginación de 15 vacantes por página.
- [X] 3.3 Buscador por texto (título, empresa, ciudad) con normalización de acentos — Client Component.
- [X] 3.4 Filtros de Estado y Ciudad (dependientes).
- [X] 3.5 `app/vacante/[id]/page.tsx`: detalle completo, incluyendo letras chiquitas, rutas, logística y beneficios.
- [X] 3.6 `generateMetadata` dinámico por vacante (título, description, canonical limpio) — ver plan.md §8.
- [X] 3.7 `JobPostingSchema.tsx` como Server Component dentro del detalle de vacante.
- [X] 3.8 Verificar en DevTools que el canonical NUNCA incluye `?ref=`.
- [X] 3.9 Hook `useReferido.ts`: leer `?ref=CODIGO` de URL, guardar en localStorage, persistir entre navegaciones.
- [X] 3.10 Modal/Client Component de chat: al hacer clic en "Postularme", pedir nombre y teléfono (mínimo 10 dígitos).
- [X] 3.11 Al confirmar: crear `candidato` (si no existe, por teléfono), crear `postulacion` con `etapa_actual = "Aplicado"`, crear `chat` tipo `candidato_reclutador`.
- [X] 3.12 Si ya existe chat para teléfono+vacante+reclutador: retomar sin duplicar.
- [X] 3.13 `reclutador_id` de la postulación se asigna desde el código de referido en localStorage (si existe).
- [X] 3.14 Componente `ChatWindow.tsx`: mensajes en tiempo real vía canal `chat:{chatId}` de Supabase Realtime.
- [X] 3.15 Estado visible de postulación en la vista de chat del candidato (badge con etapa actual).
- [X] 3.16 Detección de fuente de tráfico al cargar la página, registro en `trafico_referidos`.
- [X] 3.17 Botón admin oculto cuando URL contiene `?ref=`.
- [X] 3.18 `app/admin/invitaciones/page.tsx`: botón "Generar invitación", crea token único con expiración de 7 días.
- [X] 3.19 `app/invitacion/[token]/page.tsx`: valida token (existe, no usado, no expirado). Si inválido, mensaje de error claro.
- [X] 3.20 Paso 1 del formulario de invitación: datos de la agencia → status `pendiente_aprobacion`.
- [X] 3.21 Paso 2 (mismo flujo, sin cortar sesión): datos del coordinador → status `pendiente_aprobacion`, vinculado a la agencia recién creada.
- [X] 3.22 Pantalla de "Tu cuenta está en revisión" para coordinador con status pendiente.
- [X] 3.23 `app/coordinador/solicitudes/page.tsx` (vista admin): lista de agencias+coordinadores pendientes con botones Aprobar/Rechazar.
- [X] 3.24 Al aprobar: `agencia.status = 'activa'`, `coordinador.status = 'activo'` simultáneamente.

**✓ Criterio de avance:** Candidato puede ver vacantes, postularse, chatear en tiempo real. Un coordinador puede completar el flujo de invitación de punta a punta y quedar pendiente hasta que el admin lo aprueba.

---

## SPRINT 4 — PORTAL RECLUTADOR (PWA) + ATS
> **Objetivo:** Reclutador gestiona su pipeline con trazabilidad completa.

- [X] 4.1 `app/reclutador/login/page.tsx`: login por código. Consulta tabla `reclutadores`. Sesión en cookie/localStorage (sin Supabase Auth nativo).
- [X] 4.2 `app/reclutador/dashboard/page.tsx`: métricas básicas (candidatos activos, colocados este mes, comisión estimada). Para reclutadores nuevos sin actividad: mostrar guía de inicio rápido de 4 pasos en lugar de métricas vacías (ver spec.md CA-09.1).
- [X] 4.3 `app/reclutador/pipeline/page.tsx`: Kanban con columnas de etapas personalizadas por vacante.
- [X] 4.4 Cards de candidato: nombre, vacante, días en etapa actual, badge mensaje nuevo. **Corrección de documentación 2026-08-19:** el texto original decía "calculado desde `historial_etapas`" — el código real usa `postulaciones.updated_at` (horas sin movimiento), no lee de `historial_etapas`. No es un bug (`updated_at` funciona correctamente para este propósito), solo la descripción original no coincidía con la implementación real. Detectado al preparar Sprint 6, donde se descubrió que `historial_etapas` nunca tuvo política RLS de `SELECT` — si esta tarea sí hubiera dependido de leerla, habría estado rota en silencio desde Sprint 4.
- [X] 4.5 Drag and drop con `@dnd-kit` entre columnas.
- [X] 4.6 Al soltar card: actualizar `postulaciones.etapa_actual` + insertar fila en `historial_etapas` (etapa_anterior, etapa_nueva, cambiado_por).
- [X] 4.7 Modal de confirmación al mover a "Contratado": pedir fecha de contratación, calcular garantía (`calcularGarantiaFin`), calcular comisión (`calcularComision`).
- [X] 4.8 Modal de confirmación al mover a "Descartado": pedir motivo + opción de enviar retroalimentación al candidato con plantillas predefinidas (ver spec.md HU-10, CA-10.1 a CA-10.4). Verificado en vivo 2026-08-02: plantillas, mensaje al chat, bloqueo de chat en tiempo real (Realtime en `chats.archivado`), alcance de descarte (CA-13.1) y auto-veto por 3 inasistencias (CA-14.4, nueva). En el camino se corrigieron 2 bugs preexistentes no relacionados: columna `motivo_descarte_detalle` faltante en `postulaciones`, y `onClose` pasado como prop a Client Component en `VacanteDetalle.tsx`/`app/vacante/[id]/page.tsx`.
- [X] 4.8b El mensaje de retroalimentación se envía como `es_sistema = true` en el chat del candidato. El chat queda en modo solo lectura con mensaje de cierre.
- [X] 4.8c Modal de descarte mejorado (ver spec.md HU-13): motivo específico, alcance (esta vacante / todas), ofrecer otra vacante al descartar.
- [X] 4.8d Columna "Descartados" al final del Kanban — visible solo si hay candidatos descartados.
- [X] 4.8e Badge "⚠️ Historial previo" en cards de candidatos reactivados (ver spec.md HU-14). Verificado en vivo 2026-08-03: detección real vía historial de descartes (no solo visual), badge clicable que filtra `/reclutador/chats?candidato=...` mostrando solo las conversaciones de ese candidato, con opción "ver todos" para regresar sin filtro.
- [X] 4.15b Botón "📱 Contactar por WhatsApp" en cards de candidatos en etapa "Entrevista" — genera link wa.me con mensaje pre-escrito (ver spec.md CA-15.1).
- [X] 4.15c Campo para registrar fecha_entrevista y lugar_entrevista directo desde la card del Kanban (ver spec.md CA-15.2).
- [X] 4.15d Alertas automáticas pre-entrevista: 24h antes al reclutador, 48h después si no avanzó (ver spec.md CA-15.3 y CA-15.4). Verificado en vivo 2026-08-05: nuevo tipo `confirmar_asistencia` agregado a `useAlertas.ts` y a spec.md, mensaje exacto confirmado en BD y en `/reclutador/alertas`.
- [X] 4.15e (mejora, no numerada originalmente) `components/reclutador/ReclutadorNav.tsx`: nav compartido para las 5 páginas del reclutador (antes había 3 versiones inconsistentes del header). Incluye contador en tiempo real de alertas sin leer y chats sin leer, ambos vía Realtime.
- [X] 4.9 Campo opcional de `score` (1-5) por postulación, editable desde la card.
- [X] 4.10 `app/reclutador/chats/page.tsx`: lista de chats tipo `candidato_reclutador`, badge "Nuevo" si último sender fue candidato.
- [X] 4.11 `ChatWindow.tsx` reusado: mensajes en tiempo real, input multiline, scroll automático.
- [X] 4.12 Formulario de registro manual de candidato externo (`es_manual = true`).
- [X] 4.12b Métricas reales en dashboard del reclutador: candidatos activos, colocados este mes, comisión estimada ($), chats sin leer. Filtro por mes/semana/fechas personalizadas pendiente (ver 4.12c).
- [X] 4.12c Filtro de fechas en métricas del dashboard: selector de período (mes actual, semana actual, rango personalizado) que recalcula todas las métricas en tiempo real.
- [X] 4.13 `app/reclutador/vacante/[id]/page.tsx`: ficha operativa completa (contacto RRHH, logística, FAQ existente).
- [ ] 4.14 Input de pregunta nueva: primero consulta Nivel 1 (campos estructurados) localmente antes de llamar a cualquier función.
- [ ] 4.15 Si Nivel 1 no resuelve, invoca Edge Function `agente-faq` (que internamente revisa Nivel 2 FAQ, y si no hay match, escala a Nivel 3 coordinador). **⚠️ Al construir esto (Sprint 6), retomar también `5.12`** (panel de FAQ del coordinador) — se saltó en Sprint 5 porque depende exactamente de este mecanismo: sin `4.14`/`4.15`, nunca se genera ninguna pregunta escalada Nivel 3 que `5.12` pueda mostrar (era una pantalla imposible de probar hasta que esto exista). Construir en este orden: 4.14 → 4.15 → 5.12, en la misma pasada.
- [X] 4.16 `app/reclutador/comisiones/page.tsx`: resumen de la semana actual con estado de garantía y monto a cobrar el viernes.
- [X] 4.17 Panel de alertas: lista de alertas no leídas, click navega al contexto relevante.
- [X] 4.18 Hook `useAlertas.ts`: verificación periódica de candidatos sin movimiento 48h, garantías ≤3 días, entrevistas vencidas.
- [X] 4.19 `documentos_candidato`: subida de CV/identificación a Supabase Storage, vinculado a la postulación (ver spec.md CA-02.7). Verificado en vivo 2026-08-06: subida, listado con links firmados, borrado, 8 tipos de documento, y fix de bug donde el archivo seleccionado persistía entre aperturas del modal (cierre con X/Escape ahora limpia el estado).
- [X] 4.20 Configurar PWA: `manifest.json` completo, `public/sw.js` básico.
- [X] 4.21 Verificar en Chrome DevTools → Application → Manifest que el PWA es instalable en Android.

**✓ Criterio de avance:** Reclutador gestiona pipeline con historial de cambios registrado, chatea en tiempo real, ve su comisión semanal, y las preguntas estructuradas (Nivel 1) se resuelven sin ningún costo de IA.

---

## SPRINT 5 — PORTAL COORDINADOR — ALTA DE VACANTE Y GESTIÓN
> **Objetivo:** Coordinador gestiona vacantes (8 bloques), reclutadores y FAQ.

> ⚠️ **BUG SISTÉMICO CORREGIDO 2026-08-07 — Todas las políticas RLS de `coordinadores`:**
> Se descubrió que **14 políticas RLS** en 9 tablas (`vacantes` ×3, `negocios` ×2, `agencias`, `alertas`, `chats`, `coordinadores`, `cortes_semana` ×2, `faqs_vacante`, `mensajes` ×2) comparaban `coordinadores.id = auth.uid()` — pero el coordinador **no usa ese vínculo**, ya que `coordinadores.id` nunca coincide con el `id` de Supabase Auth (confirmado desde `5.2`). El vínculo real es por **email**. Todas corregidas a `coordinadores.email = auth.email()`. Este era un bug de origen (probablemente todas las políticas se copiaron del mismo patrón equivocado desde el diseño inicial de RLS) — **si se crea alguna tabla nueva con política de coordinador, usar `auth.email()` desde el principio, nunca `auth.uid()`.**

- [X] 5.1 `app/coordinador/login/page.tsx`: email + password con Supabase Auth.
- [X] 5.1b `app/coordinador/dashboard/page.tsx`: dashboard base con accesos rápidos a vacantes, reclutadores, pipeline y corte semanal.
- [ ] 5.1c **CORRECCIÓN — Rediseño del disparo de garantía/comisión + ciclo de vida completo del candidato en el pipeline** (ver spec.md CA-02.2 corregida, CA-02.8 a CA-02.11, CA-19.3b/c — detectado y ampliado 2026-08-06 por José, confirmado con Roxana García):

  **Parte 1 — Disparo de garantía/comisión — ✅ COMPLETA, verificada en vivo:**
  - Renombrar etapa "Oferta" → "Inducción" en `etapas_personalizadas` y `KanbanColumn.tsx` (`COLORES_ETAPA`) — ✅
  - Al mover a "Inducción": selector de fecha de inicio (sin restricción de pasado) — ✅
  - Cálculo de garantía/comisión movido de "Contratado" a "Inducción"; "Contratado" solo guarda `fecha_firma_contrato` informativo — ✅
  - `negocios.dias_descanso` (jsonb, default `[0]`) + `calcularGarantiaFinHabil()` en `lib/utils.ts` — ✅ probado en vivo (Pedro Plata, 2026-08-06: 30 días hábiles = 35 días corridos con 5 domingos saltados, correcto)
  - Migraciones SQL `postulaciones.fecha_firma_contrato` y `negocios.dias_descanso` — ✅
  - **Fase 2 completada 2026-08-17 (junto con 5.16b):** UI en `VacanteModal.tsx` (Sección 1, Identidad) para configurar `dias_descanso` por empresa — selector horizontal de 7 botones (L-D), se carga solo al elegir una empresa existente y aplica a TODAS sus vacantes (campo vive en `negocios`, no en `vacantes`). Bug corregido en el camino: faltaba política RLS de `UPDATE` en `negocios` (solo existían `SELECT` e `INSERT` — nunca hacía falta editar una empresa ya creada desde la UI hasta ahora); existía una política vieja con el mismo nombre pero condición rota (comparaba `reclutador_agencia` sin sentido para esta tabla), se reemplazó por el mismo criterio que ya usa `negocios_insert_coordinador` (coordinador activo, sin restricción de agencia — `negocios` es compartido entre agencias).
  - **Pendiente:** actualizar comentarios de cupo (CA-16.2/16.4) con el nuevo nombre de etapa en el código (spec ya actualizado)

  **Parte 2 — Flujo secuencial obligatorio (CA-02.9) — ✅ COMPLETA, verificada en vivo:**
  - El menú "Mover" solo ofrece un paso adelante o un paso atrás (tipo Ctrl+Z), nunca saltos — verificado con Axel, Andy, Lex, Pedro Plata, Elliot en las 5 columnas
  - "Descartado" disponible desde cualquier etapa activa, oculto en "Contratado" (ya no hay a dónde ir)
  - Al retroceder desde "Inducción": `fecha_contratacion`, `fecha_garantia_fin`, `comision_aplicable`, `comision_aplicada_mxn` se limpian automáticamente — verificado en Supabase con Lex Luthor (los 4 campos quedaron en null/false tras regresar a "Entrevista")

  **Parte 3 — "No efectivo" en Inducción (CA-02.10) — ✅ COMPLETA, verificada en vivo:**
  - Motivo `no_concluyo_induccion`, disponible SOLO desde etapa "Inducción" (reutiliza el modal de Descartar)
  - Campo de fecha editable ("Último día que se presentó") — verificado con Pedro Plata
  - Al confirmar: limpia `fecha_contratacion`/`fecha_garantia_fin`/`comision_aplicable`/`comision_aplicada_mxn` (igual que Parte 2), guarda el detalle en `motivo_descarte_detalle` — verificado en Supabase, los 4 campos en null/false
  - Plantilla de mensaje al candidato agregada
  - NO cuenta para el auto-veto de 3 strikes (CA-14.4) — señal distinta a `no_se_presento`, decisión explícita
  - **Pendiente:** el envío de notificación por WhatsApp aparte (además del chat interno, que ya cubre CA-10.3) — José aclaró que el chat interno ya es suficiente, no se requiere WhatsApp adicional

  **Parte 4 — Reactivación manual del coordinador — ⏳ PENDIENTE (requiere pantalla nueva del portal coordinador):**
  - Botón "🔄 Reactivar candidato" en el panel de vetados/no-efectivos del coordinador
  - Limpia `vetado`, `motivo_veto`, reinicia contador en `strikes_inasistencia` — deja registro de quién/cuándo autorizó
  - Aplica tanto a vetados (CA-14.4) como a "No efectivo" (CA-02.10)
  - Depende de que exista el panel del coordinador (construir junto con Sprint 8/portal coordinador)

  **Parte 5 — Archivo automático (extensión de HU-19, ver CA-19.3b/CA-19.3c) — ✅ COMPLETA (mitad del reclutador), verificada en vivo 2026-08-07:**
  - Columna "Descartados" agregada al Kanban (CA-13.3, nunca se había construido — hueco detectado y cerrado hoy)
  - "No efectivo": se oculta del Kanban 2 días después de marcarse — verificado con Pedro Plata (desapareció tras simular `updated_at` de hace 3 días)
  - "Contratado" con garantía cumplida: se oculta 3 días después, calculado al vuelo comparando `fecha_garantia_fin` contra hoy (sin depender de un cron ni del campo `garantia_cumplida`, que nunca se actualiza automáticamente — hueco documentado, no resuelto, evitado con este enfoque)
  - Cards "No efectivo" con fondo rojo tenue distinguible — verificado
  - Menú "Mover" ya no ofrece acciones en etapas terminales (Descartado, Contratado)
  - **Pendiente:** panel del coordinador para ver lo archivado (Sprint 8/portal coordinador) — no bloquea lo ya construido

  **Parte 6 — Badge de inactividad (CA-02.11) — ✅ COMPLETA, verificada en vivo:**
  - Badge "🚨 Sin actividad" en la card, etapas activas con más de 72h sin `updated_at` — verificado con Lex Luthor (screenshot 2026-08-06)

  **Nota general:** no aplica retroactivo — José confirmó que todos los candidatos actuales son de prueba, sin comisiones reales en juego. Partes 1, 2, 3, 5 (mitad reclutador) y 6 completas y probadas en vivo. Solo queda pendiente la Parte 4, que depende del portal coordinador — 5.1c se marca [X] cuando esa parte se resuelva junto con Sprint 8.
- [X] 5.1d `Descartados`: botón de consulta en cada card mostrando motivo, detalle, **fecha y hora exactas** del descarte, quién lo descartó, y el mensaje de retroalimentación enviado (ver spec.md CA-13.4, idea de José 2026-08-07). Solo lectura, sin edición. Verificado en vivo: modal compacto, botón ❌, cierra con Escape.
- [X] 5.2 Middleware de ruta: redirige a login si no hay sesión, y a "en revisión" si `status != 'activo'`. Verificado en vivo 2026-08-06: nuevo `middleware.ts` (raíz del proyecto) protege `/coordinador/*` por si una sesión ya abierta pierde status activo a mitad de uso (el login en sí ya bloqueaba el caso de entrar con cuenta inactiva desde cero — el middleware cubre el caso complementario). Nueva página `app/coordinador/en-revision/page.tsx` (CA-08.3). Vínculo confirmado: `coordinadores.email` = `auth.users.email` (los IDs no coinciden).
- [X] 5.3 `app/coordinador/vacantes/page.tsx`: listado de vacantes de la agencia, filtros de status y prioridad. Verificado en vivo 2026-08-07: nuevo `components/coordinador/CoordinadorNav.tsx` (nav compartido, creado antes de que se duplicara en varias páginas como pasó con el reclutador). Bug corregido en el camino: 4 políticas RLS (`vacantes_lectura_coordinador`, `vacantes_update_coordinador`, `vacantes_insert_coordinador_activo`, `negocios_lectura_coordinador`) comparaban `coordinadores.id = auth.uid()` — mismo desajuste ya detectado en `5.2` (el vínculo real es por email, no por id). Corregidas a `coordinadores.email = auth.email()`. También se corrigió `agencia_id` de Roxana en datos de prueba (estaba en una agencia distinta a las vacantes de prueba).
- [X] 5.4 Construir `components/forms/EditableList.tsx` — componente reutilizable de lista editable (agregar, editar in-line, borrar, reordenar con `@dnd-kit`). Ver código de referencia en plan.md §11. Este componente se construye UNA vez y se reutiliza en requisitos, beneficios, documentos_requeridos, zonas_ruta y tags. Verificado en vivo 2026-08-07 con página de prueba temporal (`/coordinador/test-editablelist`, borrar antes de producción): agregar, editar in-line, cancelar con Escape, borrar y reordenar por drag confirmados funcionando.
- [X] 5.5 `VacanteModal` — un solo modal completo con secciones colapsables (accordion), no wizard de pasos. Usa `EditableList` para requisitos, beneficios, documentos requeridos y zonas de ruta. Diseño confirmado 2026-08-07 (ver spec.md HU-20): selector de negocio con opción "+ Nuevo negocio" inline (CA-20.1); modal reutilizable también para "Duplicar vacante" desde el listado, precargado con los datos de la vacante origen excepto `cupo_cubierto` (siempre 0) y `status` (siempre 'vigente') (CA-20.2). Estructura interna:
  - Sección 1: Identidad (título, negocio/agencia externa, visibilidad empresa)
  - Sección 2: Ubicación y modalidad
  - Sección 3: Condiciones laborales (salario, jornada, horario)
  - Sección 4: Descripción operativa (requisitos, beneficios como listas)
  - Sección 5: Logística especial (rutas, zonas, ruta para entrevista, estacionamiento, comedor, uniforme)
  - Sección 6: Letras chiquitas (texto libre, visible al candidato)
  - Sección 7: Parámetros de reclutamiento (posiciones, reclutadores asignados, garantía, comisión base, promoción, deadline, prioridad)
  - Sección 8: Proceso de selección (etapas personalizadas drag-to-reorder, documentos, examen médico, estudio socioeconómico, contacto RRHH)

  **📍 Progreso 2026-08-07 (construcción en curso, guardar/editar/duplicar ya funcionan de punta a punta con lo construido hasta ahora):**
  - ✅ Sección 1 (Identidad) — título, selector de negocio + "+ Nueva empresa" inline, visibilidad
  - ✅ Sección 2 (Ubicación) — Ciudad o Municipio, Estado, Colonia/zona (idea de José, ayuda al candidato a autofiltrarse por cercanía), Modalidad
  - ✅ Sección 3 (Condiciones) — Jornada (dropdown corto) + Turno (matutino/vespertino/nocturno/rotativo, campo nuevo, requirió migración) + Horario detallado (texto libre — campo `horario` ya existía en el esquema, nunca se había conectado). Ajustado tras revisar `Vacantes_Completo.xlsx` real de Roxana: `jornada` no puede ser un dropdown rígido, la realidad mezcla turnos/horarios en texto libre.
  - ✅ Sección 6 (Letras chiquitas) — texto libre completo
  - ✅ Sección 7 (Reclutamiento) — Días de garantía, Comisión base, y Promoción (checkbox + descripción/monto/fecha de vencimiento), con nota aclarando que es info solo para el reclutador (no visible al candidato) y tooltips (`InfoTooltip`) en campos ambiguos
  - 🚧 Secciones 4, 5, 8 — todavía "Próximamente", pero ya con texto explicativo de qué contendrán y para quién (candidato vs. reclutador), en vez del placeholder genérico inicial
  - Nuevo componente `components/ui/InfoTooltip.tsx` (círculo "!" con hover, estilo nota de Excel — idea de José) para explicar campos poco claros a lo largo de todo el formulario
  - Fix: inputs numéricos (`dias_garantia`, `comision_base_mxn`) se manejan como string mientras se edita, se convierten a número solo al guardar — antes no dejaban borrar el "0" inicial
  - Fix: cierre con tecla Escape
  - **Pendiente:** Secciones 4, 5, 8 funcionales; luego conectar con `EditableList` (ya construido en `5.4`) para requisitos/beneficios/documentos/zonas de ruta

  **📍 Progreso adicional 2026-08-08:**
  - ✅ Sección 4 (Descripción operativa) — descripción, requisitos y beneficios con `EditableList`, aviso de "visible al candidato"
  - ✅ Sección 3 ampliada — salario completo: min/max, `salario_tipo` (neto/bruto/convenir) separado de `salario_periodo` (semanal/quincenal/mensual/por_hora, campo nuevo, requirió migración) tras detectar que el esquema original los mezclaba
  - ✅ Sección 1 ampliada — checkbox "⭐ Destacada"
  - ✅ Estética: secciones del accordion con estado seleccionado distinguible (azul) vs. no seleccionado (gris oscuro)
  - ✅ Listado (`5.3`) — columna de empresa separada, Realtime agregado
  - Fix: `salario_periodo`/`turno` faltaban en `VacanteDetalle.tsx`, `app/page.tsx` y `app/vacante/[id]/page.tsx` (portal público) — agregados a interfaces y queries
  - Fix: `revalidate = 0` agregado a `app/page.tsx` y `app/vacante/[id]/page.tsx` — sin esto, Next.js servía datos cacheados del portal público indefinidamente
  - **Hallazgo de infraestructura importante:** la tabla `vacantes` nunca estaba agregada a la publicación de Realtime de Supabase (`supabase_realtime`) — por eso ningún canal Realtime sobre esa tabla funcionaba, en ningún lado del proyecto, sin importar qué tan bien estuviera el código. Corregido con `alter publication supabase_realtime add table vacantes;`. **Nota para el futuro:** cualquier tabla nueva que necesite Realtime debe agregarse explícitamente a esta publicación — no es automático.
  - Realtime agregado en `VacantesPortal.tsx` (portal público) — un solo canal compartido escuchando cambios en `vacantes`, incluyendo sincronización de la vacante actualmente seleccionada en el panel de detalle
  - Nuevo `components/ui/InfoTooltip.tsx` usado también para aclarar "⭐ Destacada"

  **📍 Progreso adicional 2026-08-08 (continuación):**
  - ✅ Sección 4 completa y probada en vivo (Ayudante General — PASTELERIA LETY, requisitos y beneficios reales)
  - Fix: `VacanteCard.tsx` (tarjeta de lista del portal público) tenía el mismo problema que `VacanteDetalle.tsx` — le faltaba `salario_periodo`/`turno` en la interfaz y los mismos mapas de traducción (`NOMBRES_JORNADA`, `NOMBRES_SALARIO_TIPO`, `NOMBRES_PERIODO`, `NOMBRES_MODALIDAD`) — corregido en ambos archivos
  - Fix: `VacanteDetalle.tsx` no mostraba el campo `turno` al candidato (se guardaba pero era invisible) — agregado, y luego fusionado visualmente con Jornada en un solo bloque "Jornada / Turno"
  - Limpieza: variable muerta `SECCIONES_LISTAS` en `VacanteModal.tsx` (dejó de usarse al construir la Sección 4 con lógica explícita, nunca se borró)
  - Mejora: header del modal ahora muestra título + empresa de la vacante que se está editando/duplicando — evita confusión cuando hay vacantes con nombres similares
  - **Nota de datos:** las 3 vacantes de prueba originales (creadas antes de `turno`/`salario_periodo`) tenían `jornada` con el valor crudo viejo (`tiempo_completo`) en vez del código corto nuevo (`completo`) — se corrigieron editando y re-guardando cada una desde el modal, no vía SQL directo

  **📍 Progreso adicional 2026-08-09 — Sección 5 (Logística especial) completa y verificada en vivo:**
  - ✅ Checkbox "¿Tiene ruta?" + `EditableList` de zonas + "ruta también para entrevista" + estacionamiento/comedor/uniforme — todos con aviso de "visible al candidato"
  - ✅ Nuevo campo `turno` con opción "Turno fijo (varios turnos)" agregada tras revisar perfiles reales de HR CONNECT (Perfil_Topband.pdf)
  - ✅ **Documentos de rutas por empresa (CA-20.3):** nueva tabla `documentos_negocio` + bucket público `documentos-negocio` (Storage) + políticas RLS (tabla y storage, usando `auth.email()` desde el inicio) + API route `app/api/documentos-negocio/route.ts` (mismo patrón que `documentos-candidato`, pero con `getPublicUrl()` en vez de links firmados, ya que el bucket es público) + interfaz de subida/lectura/borrado dentro de la Sección 5, compartida entre todas las vacantes de la misma empresa
  - ✅ **Filtro inteligente contra duplicados de empresa (CA-20.4):** normaliza acentos/mayúsculas/espacios antes de comparar en "+ Nueva empresa" — verificado bloqueando la creación de "Pasteleria Lety" cuando ya existía "PASTELERIA LETY"
  - ✅ Documento de rutas visible en la ficha operativa del reclutador (`app/reclutador/detalle/[id]/page.tsx`) — verificado en vivo con Ayudante General / PASTELERIA LETY
  - **Limpieza de datos:** se encontraron y borraron 4 registros duplicados de "PASTELERIA LETY" en `negocios` (generados por pruebas repetidas de "+ Nueva empresa" antes de que existiera el filtro) — solo el vinculado a una vacante real se conservó
  - Fix: `revalidate = 0` faltaba en `app/reclutador/detalle/[id]/page.tsx` — la ficha operativa servía datos cacheados, mismo patrón de bug que ya se había corregido en el portal público
  - ✅ Conectado al portal público del candidato (`VacanteDetalle.tsx` + `app/page.tsx` + `app/vacante/[id]/page.tsx`) — verificado en vivo
  - ✅ Realtime del portal público extendido a `documentos_negocio` (además de `vacantes`) — mismo hallazgo que con `vacantes`: la tabla no estaba en la publicación `supabase_realtime`, se agregó con `alter publication supabase_realtime add table documentos_negocio;`. Verificado en vivo: subir/borrar PDF desde el coordinador se refleja solo en el portal público, sin F5.
  - **Pendiente aparte (no bloquea):** `/reclutador/pipeline` (Kanban) no tiene Realtime — a diferencia de `/reclutador/chats`, `/coordinador/vacantes` y el portal público, que sí lo tienen
  **📍 Progreso final 2026-08-09 — Sección 8 (Proceso de selección) completa, VacanteModal 100% terminado:**
  - ✅ Documentos requeridos (`EditableList`)
  - ✅ Checkboxes: examen médico, estudio socioeconómico
  - ✅ Contacto RRHH de la empresa — marcado como **opcional**, con tooltip aclarando cuándo llenarlo (José: en la mayoría de los casos el reclutador no tiene contacto directo, es el coordinador quien lo controla)
  - ❌ **"Etapas del pipeline" removida de esta sección** (decisión de José, documentada en spec.md junto a `etapas_personalizadas`): el proceso del reclutador (filtrar y mandar a entrevista) es igual para todas las vacantes/empresas — lo que varía es el proceso de *contratación* de cada empresa, ya cubierto por examen médico/estudio socioeconómico/documentos/contacto RRHH. El campo `etapas_personalizadas` sigue en el esquema (no se borra) pero deja de exponerse como editable; el flujo de 5 etapas es fijo para todo el sistema.
  - **Con esto, las 8 secciones de `VacanteModal` quedan completas y verificadas en vivo: 5.5 se marca [X].**

  **📍 Progreso adicional 2026-08-10 — Documentos tronco común + Antidoping (ver spec.md CA-20.5):**
  - ✅ 6 checkboxes fijos de documentos comunes (RFC, INE, comprobante de domicilio, CURP, NSS, acta de nacimiento) que agregan/quitan automáticamente su texto de la misma lista `documentos_requeridos` — sin duplicar la fuente de datos; el campo de texto libre sigue disponible para documentos extra específicos de la vacante
  - ✅ Nuevo campo `vacantes.requiere_antidoping` (migración aplicada), hermano de `requiere_examen_medico`
  - ✅ Cambio de visibilidad: examen médico y antidoping ahora también se muestran al **candidato** (bloque "⚠️ Información importante" del portal público), a diferencia de estudio socioeconómico que se queda exclusivo del reclutador (normalmente lo hace la empresa directamente)
  - ✅ Realtime del portal público confirmado funcionando con los campos nuevos (tras agregar `requiere_examen_medico`/`requiere_antidoping` al `SELECT_VACANTES` e interfaz `Vacante` de `VacantesPortal.tsx`, que tiene su propia copia separada de `app/page.tsx`)
  - Fix: warning de React "`value` prop on `input` should not be null" / "uncontrolled to controlled" — `cargarVacante()` en `VacanteModal.tsx` ahora convierte cualquier campo `null` a cadena vacía de forma genérica (recorriendo todas las keys), en vez de una lista manual de campos de texto que no cubría todos los casos (ej. campos numéricos como `salario_max` también pueden venir `null`)
- [X] 5.6 Validación de campos obligatorios por sección antes de permitir guardar (título, ciudad, estado, jornada, dias_garantia, comision_base_mxn son siempre requeridos). Verificado en vivo 2026-08-10: punto rojo 🔴 junto al título de la sección en el acordeón cuando le falta información obligatoria, desaparece solo al completarse — sin recargar. Nota: jornada/días de garantía/comisión base ya traen valores por default al abrir el modal (Tiempo completo/30/0), así que solo Identidad y Ubicación muestran el punto rojo al crear una vacante nueva desde cero — comportamiento correcto, confirmado con José.
- [~] 5.7 ~~Botón "Generar con IA ✨" que invoca `agente-descripcion-vacante` para autocompletar descripción/beneficios/letras chiquitas desde los datos básicos.~~ **CANCELADA 2026-08-10** (decisión de José, con recomendación de Claude): la descripción, beneficios y letras chiquitas son datos que la empresa cliente dicta específicamente (confirmado contra los PDFs reales de Roxana/HR CONNECT — cifras y actividades exactas, no genéricas) — una IA generando ese contenido desde cero produciría información poco confiable, en contra del Principio de Diseño #3 ("Generador de confianza"). No se construye. Si en el futuro surge un caso de uso real y validado para IA generativa en este contexto específico, se documentaría como tarea nueva.
- [X] 5.8 ~~Al guardar vacante: trigger de sincronización de sitemap (`sync-sitemap` Edge Function).~~ **Rediseñado 2026-08-10** (ver spec.md CA-05.3 corregida): en vez de replicar el mecanismo de V1 (archivo estático sincronizado a GitHub vía token, con trigger manual en cada guardado), se usa `app/sitemap.ts` — función nativa de Next.js 14 que genera el sitemap dinámicamente en cada visita, consultando Supabase en vivo. Sin GitHub token, sin trigger que mantener, siempre actualizado por diseño. Verificado en vivo en `http://localhost:3000/sitemap.xml`, mostrando las 4 vacantes vigentes de prueba con formato XML correcto.
- [X] 5.9 **Importación masiva de vacantes vía Excel** (prioridad MVP) — **rediseño completo 2026-08-10**, ver spec.md HU-08 actualizada. Diseño final, distinto al original documentado:
  - **Homologación total Exportar/Importar** (decisión de José): mismas 38+ columnas fijas + dinámicas en ambos, cubriendo las 8 secciones completas de `VacanteModal` (no solo lo básico de la guía original de HR CONNECT) — el único dato que queda fuera es el PDF de rutas por empresa (binario, se sube aparte desde el modal)
  - **Sin delimitador `|`**: en vez de una celda con `Requisito 1 | Requisito 2`, cada requisito/beneficio/documento tiene su propia columna (`REQUISITO_1`, `REQUISITO_2`... `BENEFICIO_1`... `DOCUMENTO_1`...) — decisión de José para evitar errores de captura; el sistema detecta automáticamente cuántas columnas existan, sin límite fijo ni orden importante (se lee por nombre de encabezado, no por posición)
  - **Sin plantilla aparte**: el mismo endpoint de Exportar sirve como plantilla (con o sin filas de datos)
  - Nuevo módulo compartido `lib/excel-vacantes.ts`: columnas, mapas de traducción bidireccionales (jornada/modalidad/salario), parser de fechas DD/MM/AAAA, normalización de nombres de empresa (mismo filtro anti-duplicados que `VacanteModal`)
  - `app/api/exportar-vacantes/route.ts`: genera 2 hojas — "Vacantes" (los datos) y "Instrucciones" (tabla completa de qué es cada columna, a qué campo del modal corresponde, y ejemplo)
  - `app/api/importar-vacantes/route.ts`: valida obligatorios, busca/crea empresa, detecta columnas dinámicas, crea o actualiza (por ID o Título+Empresa), reporta errores por fila sin detener el proceso completo
  - Nuevo toggle Vigente/No vigente en Sección 8 de `VacanteModal` (hueco detectado en el camino — nunca existía forma de cambiar `status` desde la interfaz, solo se veía en el listado)
  - Librería `xlsx` (SheetJS) instalada — riesgo de seguridad conocido documentado en `7.13` (sin fix del mantenedor, aceptado porque solo coordinadores autenticados suben archivos)
  - **Verificado en vivo con prueba de estrés completa 2026-08-10**: exportar 4 vacantes reales → borrar TODA la base de datos relacionada (postulaciones, candidatos, chats, mensajes, historial, alertas, tráfico — 9 tablas) → reimportar desde el Excel → las 4 vacantes se recrearon correctamente con todos sus campos (salarios, jornada, turno, requisitos, beneficios, documentos, ruta, garantía, comisión, examen médico/antidoping) verificados con SQL, cero pérdida de datos relevantes
  - **Ampliación 2026-08-18 (ver spec.md CA-08.8):** homologación contra los campos agregados en 5.15/5.16b/hoy — 6 columnas nuevas: `COMENTARIOS SALARIO`, `DÍAS DE INDUCCIÓN`, `INDUCCIÓN DENTRO DE GARANTÍA`, `PUNTO DE REUNIÓN`, `QUÉ DECIRLE AL CANDIDATO`, `DÍAS DE DESCANSO EMPRESA`. Esta última es un caso especial: vive en `negocios`, no en `vacantes` (aplica a TODAS las vacantes de esa empresa) — formato de celda con abreviaturas de 3 letras (`LUN, MAR, MIE, JUE, VIE, SAB, DOM`; se descartó 1 sola letra por ser ambigua entre Martes y Miércoles). Regla "última fila gana" si la misma `EMPRESA` aparece varias veces con valores distintos — implementada acumulando en un `Map` durante el ciclo de importación y aplicando un solo `UPDATE` por empresa al final.
  - **Segunda prueba de estrés completa 2026-08-18** (repetida por José con los campos nuevos): exportar → borrar TODAS las vacantes de TODAS las agencias del sistema (incluyendo `alertas`, sin candado FK pero limpiadas también) → reimportar → los 5 campos nuevos de `vacantes` y `dias_descanso` de las 4 empresas se recrearon exactos, verificado con SQL. Prueba adicional específica de "última fila gana": archivo de 2 filas con la misma empresa (FEMSA) y valores de días de descanso distintos (`LUN` vs `SAB, DOM`) → confirmado que ganó el de la última fila.
- [X] 5.10 `app/coordinador/reclutadores/page.tsx`: CRUD de reclutadores de la agencia. Verificado en vivo 2026-08-10 (ver spec.md CA-12.2 a CA-12.4): alta con código único sugerido automáticamente desde el nombre, selector de País con LADA que se ajusta sola (lista de códigos de todo el continente americano), tabla con vacantes activas/candidatos en proceso por reclutador, desactivar/reactivar sin borrar historial. Bug de infraestructura corregido en el camino: `reclutador_agencia` no tenía **ninguna** política RLS (ni lectura ni escritura) — mismo patrón de huecos ya visto varias veces en la sesión; `reclutadores` tampoco tenía `INSERT`/`UPDATE` para coordinador. 5 políticas nuevas agregadas, todas con `auth.email()` desde el diseño. Ajuste adicional: columna "Teléfono" separada de "País / LADA" en la tabla, sin repetir el código de país (idea de José).
- [X] 5.11 `app/coordinador/pipeline/page.tsx`: Kanban global de la agencia, con panel de reclutadores (idea de José, 2026-08-07): lista de reclutadores de la agencia, y al seleccionar uno, su pipeline completo filtrado en modo solo consulta. Verificado en vivo 2026-08-10: nuevo `components/coordinador/KanbanCardSoloLectura.tsx` (sin botones de acción — decisión explícita de José para evitar que el coordinador mueva por accidente el pipeline de un reclutador), badges de "Sin actividad 72h", "Historial previo" y "No efectivo" reutilizados. Kanban ocupa el ancho completo de la pantalla (sin `max-w-7xl`) y altura ajustada al viewport (`calc(100vh - 180px)`) solo en esta vista, no en la lista de reclutadores. RLS confirmado abierto (`postulaciones_select_publico`, `qual = true`) — sin restricción, anotado como hallazgo de seguridad para la auditoría general, no corregido aquí para no desviar del alcance de esta tarea.
- [ ] 5.12 `app/coordinador/faq/page.tsx`: preguntas escaladas (Nivel 3) sin responder con alerta visual, formulario de respuesta, toggle "Publicar en FAQ". **⏸️ Saltada intencionalmente en Sprint 5 (2026-08-10)** — depende de `4.14`/`4.15` (Agente FAQ, Sprint 6): sin ese mecanismo, nunca se genera ninguna pregunta escalada real que esta pantalla pueda mostrar, sería imposible de probar hoy. Retomar junto con `4.14`/`4.15` cuando lleguemos a Sprint 6.
- [X] 5.13 Chat coordinador↔reclutador (tipo `reclutador_coordinador`). Simplificado a un solo chat general por par reclutador-coordinador (decisión de José, 2026-08-16) — el contexto por vacante (`vacante_id`) queda como mejora futura, el esquema ya lo soporta sin cambios. Nuevo `components/shared/ChatCoordinadorReclutador.tsx` (componente dedicado, no reutiliza `ChatWindow.tsx` por tener lógica específica de candidato). Páginas: `app/coordinador/chat-reclutadores/page.tsx` y `app/reclutador/chat-coordinador/page.tsx`.
  - ✅ Mensajería en tiempo real bidireccional, verificada de punta a punta
  - ✅ Indicador de no leído (`leido_coordinador`, nueva columna) con punto rojo en `CoordinadorNav.tsx`, mismo patrón que `ReclutadorNav.tsx`
  - ✅ Fondo verde + negrita + puntito en la lista de conversaciones del coordinador cuando hay mensajes sin leer
  - ✅ "Ordenar por": Más reciente / Nombre / Sin leer (los no leídos suben arriba, no se ocultan — José aclaró que quería orden, no filtro)
  - **Bug grave corregido — condición de carrera creando chats duplicados:** ambos lados (reclutador y coordinador) intentaban "buscar o crear" el chat general casi simultáneamente al cargar sus páginas; sin ninguna restricción a nivel BD, esto generó 17 chats duplicados en las pruebas. Corregido con índice único `chats_reclutador_coordinador_unico` (`tipo`, `reclutador_id`, `coordinador_id` — solo cuando `vacante_id is null`) + manejo en código: si la creación falla por el índice, se vuelve a buscar el chat que ya existe en vez de fallar. 17 duplicados limpiados manualmente (mensajes migrados al chat más antiguo de cada grupo antes de borrar los sobrantes).
  - **Bug corregido — coordinador no encontrado del lado reclutador:** el código esperaba exactamente un coordinador activo por agencia (`.maybeSingle()`), pero la agencia de prueba tenía 2 (un coordinador de prueba viejo sin usar + Roxana) — truena con "multiple rows returned". Corregido tomando el primero por fecha de creación (`order by created_at, limit 1`); el coordinador de prueba viejo se suspendió (`status = 'suspendido'`) para evitar ambigüedad en pruebas futuras.
  - **Bug de RLS corregido (mismo patrón de toda la sesión):** `coordinadores` y `reclutador_agencia` no tenían ninguna política de `SELECT` para el rol `anon` (el reclutador no usa Supabase Auth, opera como `anon`) — solo tenían políticas pensadas para coordinador vía `auth.email()`. Se agregaron `coordinadores_lectura_reclutador` y `reclutador_agencia_lectura_reclutador`, ambas `to anon`.
  - **Bug de UI corregido — `leido_coordinador` nunca se actualizaba pese a que el `update` "funcionaba":** faltaba `key={chatActivo.id}` en `<ChatCoordinadorReclutador>` — sin él, React no remontaba el componente al cambiar de chat seleccionado, así que el `useEffect` que marca como leído nunca volvía a dispararse para el chat nuevo.
  - Scroll corregido en el layout de una sola columna del reclutador (`flex-1 min-h-0` en el contenedor del chat, en vez de que el input de escritura quedara empujado fuera de vista)
  - **Pendiente, explícitamente descartado por ahora:** sonido de notificación — se decidió priorizar el contador numérico en el nav en su lugar (más simple, sin las limitaciones de autoplay de los navegadores); se puede retomar después si hace falta.
- [X] 5.14 Trigger de alerta proactiva granular: al cambiar `status`, `comision_base_mxn`, `dias_garantia`, `tiene_promocion`, `promocion_monto_mxn`, `promocion_fin`, `tiene_ruta`, `zonas_ruta` de una vacante — notificar a todos los reclutadores de la agencia con mensaje específico de qué cambió (ver spec.md CA-07.6, CA-07.7, CA-07.8). Verificado en vivo 2026-08-16: implementado como trigger de Postgres (`fn_alerta_cambios_vacante` / `trg_alerta_cambios_vacante`, AFTER UPDATE ON vacantes) en vez de lógica en frontend, para cubrir tanto edición manual en `VacanteModal` como importación masiva de Excel sin duplicar lógica. Corrección importante durante la verificación: el `tipo` correcto es `vacante_actualizada` (el que ya reconoce `app/reclutador/alertas/page.tsx`), no `vacante_status_cambio` como decía el comentario viejo en spec.md — corregido en ambos lados. CA-07.7 (bono nuevo) usa `tipo = 'promocion_nueva'`, nuevo, con tarjeta destacada (fondo ámbar, badge "BONO ESPECIAL") en `page.tsx`. CA-07.8 (pausa con candidatos activos) confirmado dirigido solo al/los reclutador(es) con postulación activa en esa vacante, no a toda la agencia. 3 casos probados en vivo vía SQL Editor + revisión visual en Local: cambio de comisión (3 alertas, una por reclutador activo de la agencia), promoción nueva (tarjeta destacada), pausa con candidato activo (alerta 🛑 solo al reclutador correspondiente). De paso se agregó un selector "Ordenar por" en `page.tsx` (Más reciente / Más antigua / No leídas primero / Leídas primero / Todas) — reordena únicamente, ninguna alerta se oculta (mismo principio que CA-22.4).
- [X] 5.15 Sección "Qué decirle al candidato" en el VacanteModal — texto editable por el coordinador que aparece en la ficha operativa del reclutador (ver spec.md CA-09.2). Verificado en vivo 2026-08-17: nueva columna `vacantes.guion_candidato`, campo en Sección 8 de `VacanteModal.tsx`, ficha operativa del reclutador (`app/reclutador/detalle/[id]/page.tsx`) usa `guion_candidato` en vez de `descripcion` como relleno de ese bloque. Confirmado guardado correcto en Supabase con vacante real "PASTELERIA LETY / Ayudante General".
- [X] 5.16 Indicador de completitud de vacante — badge de advertencia si faltan campos críticos antes de publicar (ver spec.md CA-09.3). Verificado en vivo 2026-08-17. Construcción en dos rondas:
  - Ronda 1 (descartada): se implementó como aviso separado y no-bloqueante para contacto RRHH/punto de reunión — José la corrigió al probar: esos campos son opcionales (ya documentado desde antes en el tooltip del campo), no deberían marcarse como falta.
  - Ronda 2 (versión final): un solo mecanismo, fusionado con el bloqueo de guardar que ya existía desde 5.6. Se amplió la lista de obligatorios para que coincida con la tabla real de José (antes 5.6 solo cubría título/ciudad/estado/jornada/garantía/comisión — ahora también bloquea si falta horario detallado, salario, requisitos, beneficios o documentos tronco común). Mensaje explícito de qué falta en el encabezado del modal (no solo el punto rojo por sección, que se conserva). Mismo criterio replicado en el listado del coordinador (`esVacanteCompleta()` en `app/coordinador/vacantes/page.tsx`) para detectar vacantes previas que no cumplen la lista nueva.
  - De paso se detectó y corrigió: `punto_reunion` existía en la ficha operativa del reclutador pero nunca en el formulario del coordinador — se agregó a `VacanteModal.tsx` (queda opcional, no bloqueante).
- [X] 5.16b Campos de inducción en formulario de vacante: `dias_induccion` (número) y checkbox `induccion_dentro_garantia` con leyenda "La inducción va dentro de los días de garantía". Si `induccion_dentro_garantia = false`, el cálculo de `fecha_garantia_fin` suma `dias_induccion + dias_garantia`. Verificado en vivo 2026-08-17 con números reales, los 2 escenarios: `dias_garantia=5`, `dias_induccion=2`, `dias_descanso=[0]` (solo domingo en FEMSA prueba), candidato inicia inducción lunes 17/08 →
  - Checkbox **desmarcado** (inducción aparte): 7 días hábiles (5+2) → `fecha_garantia_fin = 25/08/2026`. Correcto.
  - Checkbox **marcado** (inducción incluida): 5 días hábiles → `fecha_garantia_fin = 22/08/2026` (cae en sábado porque esa empresa solo excluye domingo, no sábado — confirma también que `dias_descanso` se está aplicando bien en el mismo cálculo). Correcto.
  - `calcularGarantiaFinHabil()` en `lib/utils.ts` extendida con 2 parámetros opcionales (`diasInduccion`, `induccionDentroGarantia`), con default que preserva el comportamiento anterior si no se mandan — sin romper llamadas existentes.
  - **Nota de proceso:** esta tarea pasó por una ronda de ida y vuelta — se implementó, luego se cuestionó si tenía sentido real (parecía redundante con `dias_descanso`), se revirtió temporalmente, y al aclarar la lógica real de negocio (la garantía no empieza a contar hasta que termina la inducción, cuando el checkbox está desmarcado) se confirmó que la implementación original sí era correcta y se restauró. Los 3 archivos afectados (`lib/utils.ts`, `KanbanCard.tsx`, `KanbanBoard.tsx`) quedaron en el estado final correcto.
  - De paso se construyó la Fase 2 pendiente de `dias_descanso` (ver nota en tarea `5.1c`, Parte 1) — selector de días de descanso por empresa en el mismo `VacanteModal`.
- [X] 5.17 `app/coordinador/corte-semanal/page.tsx`: resumen automático por reclutador (efectivos, no efectivos, total a pagar). Verificado en vivo 2026-08-18 (ver spec.md CA-04.1/CA-04.2/CA-04.4 corregidas):
  - **Hallazgo antes de construir:** `garantia_cumplida` y `semana_corte` no sirven para filtrar el corte — `garantia_cumplida` nunca se actualiza en ningún lado (mismo hueco ya documentado en 5.1c), y `semana_corte` se graba con la semana en que el candidato *entra* a Inducción, no cuando la garantía se *cumple*. Se descartó usarlos y en su lugar se calcula "efectivo" al vuelo comparando `fecha_garantia_fin` contra el rango del periodo — mismo patrón ya usado en CA-19.3c.
  - Nuevo helper `obtenerPeriodoCorte()` en `lib/utils.ts`: periodo = semana calendario completa (lunes a domingo). `dia_corte`/`dia_pago` de la agencia (ya existían en DB, faltaban en el modelo de datos de spec.md — corregido) indican cuándo dentro de la semana se procesa el pago, no cambian qué semana se cuenta — primera versión sí los usaba para definir el rango y salía un periodo de 4 días en vez de 7, corregido tras prueba en vivo.
  - "No efectivo" = descartado con `fecha_contratacion` no nulo (sí llegó a Inducción) — no una lista fija de motivos. Un descarte temprano (nunca llegó a Inducción, `fecha_contratacion` nulo) no aparece en el corte en absoluto, ni efectivo ni no efectivo — detectado en la misma verificación, la primera versión solo filtraba por un motivo específico.
  - Confirmado que NO hace falta homologar con `dias_descanso` (por empresa) — operan en niveles distintos: `dias_descanso` ya afectó el cálculo de `fecha_garantia_fin` desde antes (5.1c), el corte solo agrupa esa fecha ya calculada en semanas de pago, sin volver a contar días hábiles.
  - 4 casos probados en vivo: candidato efectivo con comisión correcta, candidato no efectivo distinguido de un rechazo temprano irrelevante, navegación bidireccional entre periodos con tope correcto en el periodo actual, periodo semanal completo consistente en toda la navegación.
  - Ajuste de UX: "Corte: día 4 · Pago: día 5" cambiado a "Corte: Jueves · Pago: Viernes" (idea de José) — mapa `NOMBRES_DIA` nuevo en el propio archivo.
  - **Bug encontrado de paso en `app/reclutador/comisiones/page.tsx` (mismo hueco de `garantia_cumplida`/`semana_corte`, no se había notado hasta ahora):** esa pantalla ya existía de una sesión anterior y dependía de los mismos 2 campos rotos — en la práctica, el reclutador nunca veía nada como "Por cobrar" (todo se quedaba permanentemente en "En garantía", aunque la fecha ya hubiera pasado hace semanas), y el badge "✅ Se paga este viernes" nunca aparecía. Corregido con el mismo patrón: `garantiaYaCumplida()` compara `fecha_garantia_fin` contra hoy en vivo, y "esta semana" se calcula con `getSemanaISO(fecha_garantia_fin)` en vez de comparar contra el `semana_corte` guardado. 3 casos verificados en vivo: total "Por cobrar" sube y "En garantía" baja al pasar la fecha, badge de tarjeta cambia de ámbar a verde, "Se paga este viernes" aparece solo cuando la fecha cae en la semana actual.
- [X] 5.18 Botón "Marcar semana como pagada": actualiza `cortes_semana.pagado` y `postulaciones.pagado`, genera resumen descargable. Verificado en vivo 2026-08-18 (ver spec.md CA-04.3):
  - **Bug de RLS encontrado y corregido en el camino:** `cortes_semana` tenía políticas de `SELECT`/`UPDATE` pero ninguna de `INSERT` — el `upsert()` fallaba en silencio (Postgres necesita permiso de `INSERT` para intentar la ruta de creación de un upsert, aunque termine en `UPDATE`). Efecto real: el primer pago marcado en pantalla sí actualizó `postulaciones.pagado`, pero nunca se guardó el registro en `cortes_semana` — se detectó porque el indicador "✅ Periodo pagado" nunca aparecía. Política nueva agregada con el mismo criterio ya usado en `cortes_update_coordinador`.
  - **Mejora sobre el diseño original (pedido de José tras ver la primera versión):** el Excel descargable se amplió de un detalle básico a 3 hojas — "Resumen" (totales por reclutador, pensado como base para indicadores de Sprint 6), "Pagados" (agrega empresa, y la fecha en que el candidato entró a Inducción — renombrada de "Fecha de contratación" a "Fecha de inducción" para ser honesta con lo que el dato representa realmente, sin cambiar el campo de la base de datos), y "No efectivos".
  - **Mejora adicional:** indicador visual "✅ Periodo pagado" (verde, monto en gris) cuando el periodo ya se marcó, distinto de "Total a pagar" (cuando aún hay pendientes) — antes ambos casos se veían igual ($0 MXN sin contexto).
- [X] 5.22 **Lista de contratados/histórico completo** (idea de José, 2026-08-18, detectada al probar 5.17; corregida 2026-08-19 — ver spec.md CA-19.6): pantalla dedicada, tabla plana filtrable por reclutador y rango de fechas, con TODOS los candidatos "Contratado" de la agencia sin tener que entrar reclutador por reclutador. **Corrección de mi propia suposición al anotar esta tarea:** el Kanban global (5.11) NO oculta nada — su consulta no filtra por fecha, siempre muestra el historial completo; el "ocultar 3 días" de CA-19.3c solo aplica al Kanban del reclutador, nunca al del coordinador. El valor real de esta tarea es la vista dedicada y filtrable, no "desbloquear" datos que ya estaban visibles. Verificado en vivo 2026-08-19: nuevo `app/coordinador/contratados/page.tsx`, link "Histórico" en `CoordinadorNav.tsx`. Se distingue a propósito del Excel de la 5.18 (comprobante puntual de un pago semanal específico) — esta pantalla es la consulta histórica libre, sin límite de periodo, con su propio botón "Exportar" independiente. Nota: durante la prueba se detectaron 3 postulaciones duplicadas de "Candidato Corte Prueba 2" (dato de prueba corrido más de una vez sin `on conflict`, no bug de la pantalla) — limpiadas manualmente.
- [X] 5.23 **Ficha del candidato + resumen automático al coordinador** (ver spec.md HU-23, idea de José 2026-08-18 basada en el formato real que los reclutadores le mandan a Roxana por WhatsApp): 3 campos nuevos en `candidatos` (edad, escolaridad, residencia) capturados en el modal de "Agendar entrevista" ya existente en `KanbanCard.tsx`. Al guardar, envío automático de resumen como mensaje de sistema al chat reclutador↔coordinador (HU-22), con la mayoría de los campos autocompletados (empresa, vacante, horario, ruta/punto de reunión, reclutador, coordinador) sin pedirle nada extra al reclutador. Verificado en vivo 2026-08-18:
  - **2 bugs de RLS encontrados y corregidos en el camino:** faltaba política de `UPDATE` en `candidatos` (solo existían `SELECT`/`INSERT` — nunca antes hacía falta editar un candidato ya creado desde la UI); y `coordinadores.activo` no existe en el schema real (es `status text`, no `activo bool` — corregido también en el modelo de datos de spec.md, que tenía este mismo error documentado).
  - El Kanban global de solo lectura del coordinador (`KanbanCardSoloLectura.tsx`, 5.11) se amplió más allá del plan original: ya no solo muestra edad/escolaridad/residencia — también empresa, fecha/hora de entrevista y ruta o punto de reunión, y en **cualquier** etapa donde el dato exista (no solo Entrevista/Inducción/Contratado como se planeó al inicio) — pedido explícito de José tras ver la primera versión.
  - Confirmado que "Ruta o Punto de Reclutamiento" ya tenía de dónde salir sin construir nada nuevo: el checkbox "La ruta también está disponible para ir a la entrevista" (Sección 5 de `VacanteModal`, `ruta_para_entrevista`) + "Punto de reunión" (Sección 8, `punto_reunion`) ya existían desde antes de esta sesión — la 5.23 solo los empezó a aprovechar en la tarjeta del coordinador y en el resumen automático, no los creó.
- [X] 5.24 **Chat visible al coordinador (solo lectura) + confirmación de asistencia registrada** (idea de José, 2026-08-19, mientras probaba 6.8 — ver spec.md CA-21.4, CA-15.5). Verificado en vivo:
  - Botón "💬 Ver chat" en `KanbanCardSoloLectura.tsx` (Kanban global del coordinador) — modal de solo lectura con la conversación completa candidato↔reclutador, sin caja de texto. `ChatWindow.tsx` gana prop `soloLectura`. Sin necesidad de política RLS nueva — `chats`/`mensajes` ya tenían lectura abierta (`qual = true`); anotado aparte como hallazgo para la auditoría de seguridad de Sprint 7 (lectura sin ninguna restricción es más abierto de lo que parece necesario).
  - Nueva columna `postulaciones.asistio_entrevista` (boolean, nullable) + `motivo_no_asistencia` (text). En `KanbanCard.tsx` (reclutador), cuando la entrevista ya pasó (fecha+hora exacta) y sigue sin contestar, aparecen 2 botones "✅ Sí" / "❌ No" — independiente de mover a Inducción, es solo dato de seguimiento, **no** es lo mismo que "Descartar" (aclaración importante de José: el botón "No" nunca mueve al candidato de columna — le da una segunda oportunidad para el caso de que algo fuera de su control le impidió llegar; "Descartar" sigue siendo la decisión final e independiente de que el reclutador ya no le interesa seguir con ese candidato). Al contestar "No" se puede anotar una razón opcional. Reagendar la entrevista resetea `asistio_entrevista`/`motivo_no_asistencia` a `null` para que se pueda volver a preguntar en la nueva fecha. Mismo badge visible en el Kanban global del coordinador.
  - **Nota para Sprint 8:** este dato (`asistio_entrevista = false`, posiblemente repetido) es candidato natural para alimentar el futuro sistema de "strikes"/veto automático — anotado para no perder la conexión, sin construirlo ahora.
  - 2 bugs de refresco de UI encontrados y corregidos durante la verificación en vivo: la tarjeta no se actualizaba sola al reagendar (mismo patrón "actualizar el objeto en memoria + `onActualizarEtapa` con la misma etapa" que ya usamos para el badge de asistencia, faltaba aplicarlo también aquí).
- [ ] 5.19 Configuración de día de corte por agencia: el coordinador puede definir `dia_corte` y `dia_pago` desde su perfil de agencia (campos ya existentes en DB desde Sprint 4).
- [X] 5.20 `app/reclutador/vacantes/page.tsx`: listado de vacantes de la agencia del reclutador, para consulta libre sin necesitar un candidato ya postulado (ver spec.md CA-03.5, detectado por José 2026-08-17 al probar 5.15). Link "Vacantes" nuevo en `ReclutadorNav.tsx`. Cada vacante de la lista abre `/reclutador/detalle/[id]` (ya existente). Verificado en vivo 2026-08-17: buscador por puesto/empresa/ciudad, vigentes primero sin ocultar pausadas.
- [ ] 5.21 **Aclarar "vacante urgente" vs. `prioridad` existente** (idea de José, 2026-08-09 — reubicada aquí 2026-08-18 por encajar directo con `VacanteModal`, que ya está en construcción activa en este sprint). El campo `prioridad` (normal/alta/urgente) ya existe y ya se usa como filtro en el listado del coordinador — falta decidir si "¿Es vacante urgente?" es exactamente ese mismo campo (y entonces no hace falta nada nuevo, solo quizás hacerlo más visible en el modal/badge), o si es un concepto distinto que amerita su propio campo. Presentar opciones a José antes de tocar código.
  - **Fix — botón "atrás" contextual:** la ficha operativa (`app/reclutador/detalle/[id]/page.tsx`) tenía el link "← Pipeline" fijo, sin importar de dónde llegara el reclutador. Se agregó `?from=vacantes` / `?from=pipeline` en los links de origen (`vacantes/page.tsx` y `KanbanCard.tsx`) y la ficha ahora usa `searchParams.from` para mostrar "← Vacantes" o "← Pipeline" según corresponda. Sin `?from`, mantiene el comportamiento anterior (Pipeline).
  - **Fix — turno y salario faltantes en la ficha operativa:** detectado en la misma verificación. `turno` nunca se pedía en el `select()` de Supabase — el coordinador lo capturaba en `VacanteModal` pero nunca llegaba al reclutador. Agregado a la consulta y mostrado como "🔄 Turno {Rotativo/Matutino/...}". Además, el salario usaba `salario_visible` para decidir si mostrarlo — ese campo es para el portal público de candidatos, no debería ocultarle el salario real al reclutador (que lo necesita para poder comunicárselo al candidato). Corregido para que el reclutador vea siempre el salario real, independiente de `salario_visible`.
  - **Ronda de ajustes 2026-08-18 (detectados por José):**
    - Documentos requeridos nunca se mostraban en la ficha operativa del reclutador — agregado bloque "📄 Documentos que debe llevar" (ya venían en el `select()` desde antes, solo faltaba renderizarlos).
    - Nuevo documento de "tronco común" en `VacanteModal`: "Hoja de retención Infonavit (de contar con crédito)".
    - El cuadrito "esta sección es info del reclutador" en Sección 8 se había movido en la ronda anterior (5.16b) a justo arriba del toggle Vigente, con mensaje distinto para arriba/abajo del corte. José confirmó que en la práctica documentos/examen médico/antidoping tampoco llegan al candidato desde ningún otro lado (portal de vacantes no los muestra) — se regresó el cuadrito a su posición original, arriba de toda la Sección 8, con el mensaje genérico simple.
    - Nueva columna `vacantes.comentarios_salario` (texto, solo para el reclutador — ej. "sube conforme a experiencia y antigüedad"). Campo nuevo en `VacanteModal` (Sección 3) y en la ficha operativa.
    - La tarjeta "Salario del candidato" de la ficha operativa se separó en 2: una de Salario (+ comentarios), otra de Horario/Turno/Jornada — pedido explícito de José para más claridad visual.

**✓ Criterio de avance:** Coordinador crea una vacante completa (8 bloques), la IA ayuda a redactar la descripción, el sitemap se sincroniza, el reclutador la ve en su ficha, y el FAQ resuelve dudas en cascada.

---

## SPRINT 6 — DASHBOARD POWER BI + AGENTES RESTANTES
> **Objetivo:** Coordinador tiene visibilidad completa de su agencia. Los 5 agentes están activos.

- [X] 6.0 **Verificación previa antes de construir las 6 gráficas** (2026-08-19, siguiendo el patrón de Sprint 5 de confirmar contra la base real antes de programar): columnas de `historial_etapas` y `trafico_referidos` coinciden con lo documentado en spec.md, sin sorpresas. Datos de prueba suficientes en las 4 tablas fuente (5 vacantes, 6 postulaciones, 8 historial_etapas, 6 trafico_referidos). **Bug encontrado y corregido:** ninguna de las 2 tablas tenía política RLS de `SELECT` (solo `INSERT`) — 2 políticas nuevas agregadas, mismo criterio ya usado en el resto del proyecto (`coordinadores.email = auth.email()`, vía `agencia_id` directo en `trafico_referidos`, vía join a `postulaciones` en `historial_etapas` que no tiene `agencia_id` propio).
- [X] 6.1 `app/coordinador/dashboard/page.tsx` — Gráfica 1: Vacantes por status (dona). Verificado en vivo 2026-08-19.
- [X] 6.2 Gráfica 2: Embudo de conversión (candidatos por etapa acumulado). Usa `historial_etapas` para contar candidatos que LLEGARON a cada etapa alguna vez (no solo dónde están hoy) — así cada barra es igual o menor que la anterior, comportamiento real de embudo. Verificado en vivo: candidatos de prueba insertados directo por SQL (sin pasar por el Kanban) no generan historial y no cuentan en el embudo — comportamiento correcto, no bug (en producción todo candidato real pasa por el Kanban).
- [X] 6.3 Gráfica 3: Efectividad por reclutador (colocados vs no efectivos). Mismo criterio de "no efectivo" ya establecido en 5.17/5.22 (descartado después de haber entrado a Inducción, no un rechazo temprano). Verificado en vivo.
- [X] 6.4 Gráfica 4: Comisiones pagadas vs pendientes vs perdidas (barras apiladas). Verificado en vivo.
- [X] 6.5 Gráfica 5: Fuentes de tráfico (dona, desde `trafico_referidos`). **Bug real encontrado y corregido en el camino** (no era ambigüedad de diseño, era un bug de Sprint 3 nunca detectado hasta ahora): `app/api/trafico/route.ts` pedía el `agencia_id` del reclutador vía `reclutador_agencia`, pero nunca lo usaba — la línea de `insert` tenía `agencia_id: null` escrito directo, sin condición. Efecto real: **ninguna** fila de `trafico_referidos` tenía agencia asignada, ni siquiera el tráfico que llegaba con código de un reclutador específico — la gráfica 5 habría estado vacía siempre, sin importar cuántas visitas reales llegaran. Corregido: usa el `agencia_id` del reclutador si viene por referido, y si no, intenta derivarlo de la vacante visitada; solo queda `null` el tráfico genuinamente anónimo al portal general (correcto, no hay agencia a la cual atribuirlo). Verificado en vivo generando tráfico real con `?ref=LAURA01`.
- [X] 6.6 Gráfica 6: Tiempo promedio de colocación por vacante (calculado desde `historial_etapas`: días entre creación de la postulación y el momento en que llegó a "Contratado"). Verificado en vivo pasando un candidato real por el Kanban completo (Entrevista → Inducción → Contratado) y confirmando el cálculo exacto contra SQL.
- [X] 6.7 Filtros de rango de fechas para todas las gráficas. Verificado en vivo.
- [X] 6.0b **Bug de RLS encontrado y corregido antes de construir** (2026-08-19, ver 6.0): `historial_etapas` y `trafico_referidos` solo tenían política de `INSERT`, ninguna de `SELECT` — las 6 gráficas habrían salido vacías sin error visible. 2 políticas nuevas agregadas.
- [X] 6.8 Edge Function `agente-matching` — pre-calificación automática de candidatos (ver spec.md HU-17). **Nota de arquitectura importante:** al diseñar esto se decidió NO usar IA en tiempo real para cada candidato — las preguntas son de sí/no u opción múltiple con respuesta fija (CA-17.4), así que el filtro es 100% determinístico (comparación directa), sin depender de que un modelo interprete nada. Split de la tarea en 2 partes:
  - **Parte A (completa, verificada en vivo 2026-08-19):** preguntas guardadas en `vacantes.preguntas_precalificacion` (jsonb), escritas/editadas a mano por el coordinador en `VacanteModal` (Sección 4, junto a Requisitos/Beneficios) — hasta 5, 3 tipos: Sí/No, Opción múltiple (con checkbox "¿Tiene respuesta correcta?" — si no, es solo informativa, agregado a petición de José tras ver el flujo en vivo), y Texto libre (siempre informativo, nunca filtra). El candidato las responde en `ChatModal.tsx` antes de llegar al formulario de nombre/teléfono — si falla una que sí filtra, nunca se crea `candidatos`/`postulaciones`/chat con el reclutador (CA-17.2), solo un registro ligero en la tabla nueva `precalificaciones_fallidas` (CA-17.5, sin pantalla de análisis todavía — queda como mejora futura). Si pasa, seguía el flujo normal, y ahora además queda marcado `postulaciones.precalificado = true`, con badge "✅ Pre-calificado" visible en el Kanban del reclutador y en el del coordinador (CA-17.3 — se detectó a medio camino que faltaba esta pieza, se cerró en la misma pasada). Respuestas de preguntas informativas se guardan en `postulaciones.respuestas_precalificacion` (jsonb) para que el reclutador/coordinador las vea después.
  - **Parte B (pendiente, backlog):** generación automática de las preguntas a partir de `requisitos` usando Claude (mitad de CA-17.4) — requiere configurar por primera vez en este proyecto una Edge Function de Supabase con la API de Anthropic. No bloquea nada de la Parte A; el coordinador ya puede escribirlas a mano mientras tanto.
- [X] 6.8b Control de cupo por vacante (ver spec.md HU-16, rediseñada 2026-08-19). Verificado en vivo con varios escenarios de prueba:
  - Migración: `vacantes.cupo_desde` (timestamptz) — marca el inicio de la "ronda" de cupo actual.
  - `VacanteModal.tsx`: campo `cupo_requerido` nuevo (Sección 7, no existía en el formulario), `cupo_desde` se resetea solo al pasar de "No vigente" a "Vigente" — editar el número sin tocar el switch no reinicia nada.
  - Indicador en tiempo real (Sección 7) y columna "Cupo" en el listado (`app/coordinador/vacantes/page.tsx`) — ambos calculados en vivo, sin depender de `cupo_cubierto` (columna que nunca se actualizaba, mismo patrón de siempre en este proyecto).
  - `KanbanCard.tsx`: pausa automática (`verificarYPausarCupo()`, función compartida) al entrar a Inducción **y** al confirmar Contratado — se disparaba solo al final antes de la corrección, dejando pasar candidatos en Inducción sin contar (sesgo detectado por José antes de que se volviera un problema real en producción).
  - **3 rondas de clarificación en vivo sobre el diseño, documentadas en spec.md CA-16.5** — quedó en: cada reactivación es "ronda nueva" (vuelve a 0), sin importar si el motivo es un candidato que se cayó o que la empresa pide más personal genuinamente. Se descartaron 2 alternativas más complejas antes de llegar a esta.
  - **Recortado de esta pasada:** CA-16.4 (alerta amarilla antes de llenarse) y el panel de alertas del coordinador donde se vería la notificación de CA-16.3 — ambos quedan pendientes, no bloquean el resto (la vacante sí se pausa correctamente, solo la notificación queda "guardada pero invisible" por ahora).
  - **De paso, detectado al probar (no relacionado al cupo en sí):** el Pipeline del reclutador no mostraba el nombre de la empresa (solo el de la vacante) — agregado. Botón de WhatsApp solo aparecía en etapa "Entrevista" — ampliado a "Contactado" e "Inducción" también, con mensaje distinto según la etapa. El reclutador capturaba edad/escolaridad/residencia (5.23) pero nunca los volvía a ver — agregado modal de consulta (clic en el nombre del candidato) con toda la ficha consolidada, mismo contenido que ya veía el coordinador.
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
- [ ] 7.3b **Rediseño del portal candidato — pasada completa** (ideas de José, 2026-08-09, reubicadas aquí 2026-08-18 por encajar con la auditoría SEO/QA ya planeada sobre este mismo portal — mejor una sola pasada de rediseño que ir en pedazos sueltos):
  - Página de inicio con resumen de cuántas vacantes hay disponibles, estilo OCC.
  - Rediseño del listado de vacantes: tarjetas individuales separadas en cuadros, estilo Indeed, en vez de la lista actual tipo chat.
  - Botón "Postularme" repetido arriba y abajo de la ficha de vacante, para no tener que hacer scroll de regreso.
  - Links externos útiles — IMSS, SAT (para sacar RFC/CURP), etc.
  - **Verificar bug reportado 2026-08-18:** confirmar si `VacantesPortal.tsx` refresca la LISTA cuando se agrega una vacante NUEVA (evento INSERT), no solo cuando se actualiza una ya existente — el Realtime de esa tabla sí está activo desde 5.5b, pero no quedó explícitamente probado el caso de alta nueva, solo edición/actualización.
- [ ] 7.3c **Aviso de privacidad al inicio de cada chat** (detectado 2026-08-18, requisito de cumplimiento legal — no depende de nada técnico, se agrupa aquí por ser la pasada final de QA antes de considerar el sistema listo). Mensaje exacto a mostrar al inicio de cualquier chat (candidato, reclutador, coordinador):
  > "Consulte nuestro aviso de privacidad en https://www.ssdrsimi.com.mx/aviso-de-privacidad. Al continuar con el uso de nuestro chat, usted acepta nuestro aviso de privacidad, así como las finalidades contenidas dentro del mismo."
- [ ] 7.4 Auditoría SEO: título, meta description, JSON-LD en 3 vacantes distintas con DevTools.
- [ ] 7.5 Verificar canonical sin `?ref=` en 3 escenarios: directo, con referido, compartido en redes.
- [ ] 7.6 Probar sitemap.xml en Google Search Console (submit manual).
- [ ] 7.7 Prueba de estrés Chat: 2 dispositivos simultáneos, verificar tiempo real sin duplicados.
- [ ] 7.8 Prueba de estrés Kanban: mismo candidato movido en 2 tabs simultáneos, verificar resolución de conflicto.
- [ ] 7.9 Prueba de referido: `?ref=CODIGO`, cerrar navegador, reabrir — verificar persistencia en localStorage.
- [ ] 7.10 Prueba PWA: instalar portal reclutador en Android, verificar funcionamiento sin Chrome abierto.
- [ ] 7.11 Lighthouse audit portal candidato: meta >80 Performance, >90 SEO, >90 Accessibility.
- [ ] 7.12 **Auditoría de "ligereza"** (ver spec.md, Principio de Diseño #4, marca de corte 2026-08-09): revisar todo el código construido antes de esa fecha contra el principio de "cada byte cuenta". Casos ya identificados y pendientes de corregir: `VacantesPortal.tsx` pagina solo en la vista (trae todas las vacantes vigentes de golpe desde Supabase, sin `.range()` ni `.limit()` en la consulta); el `select()` del listado general de vacantes (`app/page.tsx`, `app/coordinador/vacantes/page.tsx`) incluye `documentos_negocio` completo en vez de solo en el detalle. Revisar también otros queries construidos antes de la marca de corte por si tienen el mismo patrón.
- [ ] 7.13 **Limpieza menor de fin de sprint** (José prefirió posponer, son archivos/dependencias raíz que afectan toda la compilación — hacer con calma, con commit de respaldo antes):
  - `tsconfig.json` (detectado 2026-08-10): `"moduleResolution": "node"` marcado obsoleto por TypeScript moderno — cambiar a `"bundler"`. Solo advertencia, no error — la app compila y funciona bien tal como está hoy.
  - `npm audit` (detectado 2026-08-10, tras instalar `xlsx` para `5.9`): quedan 4 vulnerabilidades sin arreglo automático seguro tras correr `npm audit fix`. `glob`/`minimatch` son dependencias de ESLint (solo desarrollo, nunca corren en producción — riesgo nulo). `next`/`postcss` (severidad crítica/alta) requieren actualizar a `next@14.2.35` ("fuera del rango declarado" según npm) — evaluar y probar con calma que nada se rompa antes de aplicar. `xlsx` (Prototype Pollution + ReDoS, sin fix del mantenedor) — riesgo aceptado conscientemente: solo coordinadores ya autenticados pueden subir archivos a esta librería, nunca usuarios públicos anónimos; revisar si sigue sin fix disponible al momento de esta limpieza.
  - **RLS de `postulaciones` completamente abierta** (detectado 2026-08-10, al construir `5.11`): la política `postulaciones_select_publico` tiene `qual = true` — sin ninguna restricción, cualquiera con el cliente normal de Supabase (`anon` key) puede leer todas las postulaciones de todas las agencias, no solo la propia. Revisar si esto es intencional (dato ya semi-público de todos modos) o si debe restringirse por agencia/reclutador — mismo patrón a auditar en otras tablas con políticas `_publico` genéricas.
- [ ] 7.12 Verificar que ningún coordinador, en ningún status, puede editar/eliminar su propia agencia (prueba manual de RLS).

**✓ Criterio de avance:** Todos los portales funcionan, SEO auditado, chat verificado, PWA instalable, Lighthouse >80, RLS de agencias confirmado infranqueable desde el lado coordinador.

---

## SPRINT 8 — LIMPIEZA Y RETENCIÓN DE DATOS (backlog, ver spec.md HU-19)
> **Objetivo:** Base de datos ligera sin perder trazabilidad de comisiones ni memoria del auto-veto.
> Creado 2026-08-02 a partir de una necesidad real detectada por José durante Sprint 4 — se documenta
> aquí para no interrumpir el orden activo de sprints, y se retoma cuando le toque su turno.

- [ ] 8.1 Migración: crear tabla `strikes_inasistencia` (ver spec.md, sección Modelo de Datos).
- [ ] 8.2 Modificar `confirmarDescarte()` (`KanbanCard.tsx`): al descartar con `motivo_descarte = 'no_se_presento'`, hacer `upsert` sobre `strikes_inasistencia` por `(telefono, agencia_id)` (CA-19.1).
- [ ] 8.3 Actualizar la lógica de auto-veto (CA-14.4) para leer el contador desde `strikes_inasistencia` en vez de contar directo sobre `postulaciones`, y guardar `vetado_desde` al llegar a 3 (CA-19.2).
- [ ] 8.4 Filtrar candidatos vetados fuera de `/reclutador/pipeline`, `/reclutador/chats` y el Kanban global del coordinador (CA-19.3).
- [ ] 8.5 Panel "Candidatos vetados" en el dashboard del coordinador: lista de vetados con detalle (nombre, teléfono, motivo, fecha) y botón para revertir el veto manualmente (CA-19.3, reutiliza CA-14.3).
- [ ] 8.6 Botón "Eliminar descartados vencidos (+15 días)" en dashboard del coordinador, con conteo previo y confirmación (CA-19.4).
- [ ] 8.7 Botón "Eliminar contratados vencidos (+30 días)" en dashboard del coordinador, con conteo previo y confirmación (CA-19.5).
- [ ] 8.8 Botón "Eliminar huellas de veto vencidas (+1 año)" en dashboard del coordinador, con conteo previo, confirmación, y reversión automática de `candidatos.vetado` al borrar (CA-19.6).
- [ ] 8.9 Prueba manual end-to-end: candidato con 3 inasistencias en fechas separadas por más de 15 días entre sí — confirmar que el auto-veto sigue disparando correctamente aunque el expediente completo ya se haya limpiado entre strikes.

**✓ Criterio de avance:** Los 3 botones funcionan con confirmación previa, los vetados están invisibles en los dashboards operativos pero visibles y reversibles desde el panel del coordinador, y el auto-veto sigue funcionando correctamente incluso cuando el expediente completo del candidato ya fue limpiado por la retención de 15 días.

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
- [ ] Rutas de transporte con documento PDF por empresa (idea de José, 2026-08-06) — **✅ en construcción, ver 5.5 Sección 5 y spec.md CA-20.3/CA-20.4** (avance detallado ahí, esta línea se conserva solo como referencia histórica de origen).
- [ ] Documentos "tronco común" — checkbox simple para marcar documentos que aplican a cualquier vacante (idea de José, 2026-08-09), sin repetir la lista completa cada vez. — ✅ construido, ver 5.5/5.16 y spec.md CA-20.5 (esta línea se conserva solo como referencia histórica de origen).
- [ ] **Homologar 2 bitácoras reales de Roxana García al sistema de coordinador** (detectado 2026-08-17, fotos compartidas por José). Pendiente de definir formalmente como HU/CA — falta la foto completa de la Bitácora 2 (Roxana se la va a pedir), y confirmar el hallazgo de agencia_id único en `coordinadores` (ver ítem aparte abajo). Lo que sí se sabe hasta ahora:
  - **Bitácora 1 ("Inducción [Empresa]", Excel):** por candidato en inducción — Nombre, **Talla** (uniforme), Teléfono, **Agencia** (Roxana coordina 2 agencias distintas — HR y RECOM — esta bitácora junta candidatos de ambas), Comentarios (texto libre, ej. "PASAR RUTAS", "HORNEROS"). Ninguno de estos campos existe hoy en el sistema (ni `talla`, ni comentarios libres por postulación en etapa de inducción).
  - **Bitácora 2 ("Lista de Asistencia", papel):** No., Nombre completo, **Reingreso SI/NO**, Teléfono, Municipio, + columnas cortadas en la foto (pendiente). José confirmó que "Reingreso" **no es lo mismo** que "Historial previo" (CA-14.2, ya construido) — Historial previo detecta candidatos que ya aplicaron antes DENTRO de TuChamba; Reingreso es retroalimentación que **la empresa le da a Roxana en la entrevista**, indicando que ese candidato ya trabajó ahí antes (dato externo, el sistema no tiene forma de saberlo por sí solo). Es información nueva que hay que capturar manualmente, no derivarla.
  - Estas 2 bitácoras parecen ser, en palabras de José, "retroalimentación del reclutador y a la vez seguimiento de los candidatos" — no confirmado aún si son una sola pantalla/tabla o dos conceptos separados.
- [ ] **Decisión vigente hoy: coordinador con 2 agencias = 2 cuentas separadas** (José, 2026-08-17, reconfirmado 2026-08-18). Un coordinador sigue perteneciendo a exactamente una agencia (`coordinadores.agencia_id`, sin cambios de modelo de datos) — casos como Roxana (coordina HR y RECOM) se resuelven con 2 registros de coordinador distintos, uno por agencia, aunque sea la misma persona iniciando sesión dos veces. No requiere ningún cambio de código.
- [ ] **Feature futuro (backlog, evaluar cuando sea rentable): Coordinador multi-agencia real.** Reemplazaría el punto de arriba cuando se justifique el esfuerzo. Evaluación de viabilidad hecha 2026-08-18:
  - **Sí es viable** — ya existe el mismo patrón funcionando para reclutadores (`reclutador_agencia`, tabla intermedia many-to-many, ya en producción; la 5.20 ya combina vacantes de varias agencias del reclutador en una sola pantalla).
  - **Alcance del cambio:** tabla nueva `coordinador_agencia` (calcada de `reclutador_agencia`) + migración de datos existentes; selector de agencia al dar de alta un reclutador (si el coordinador tiene más de una); **reescribir 15+ políticas RLS** en `vacantes`, `reclutadores`, `reclutador_agencia`, `postulaciones`, `chats`, `negocios`, etc. (todas asumen hoy la relación 1-a-1 vieja); revisar cada pantalla que ya asume una sola `agencia_id` en sesión (listado de vacantes, Kanban global 5.11, CRUD reclutadores 5.10, corte semanal 5.17).
  - **Por qué no se hizo ahora:** riesgo de seguridad — en esta sola sesión ya aparecieron 3 veces políticas RLS rotas o faltantes al tocar código relacionado (`negocios` sin `UPDATE`, `reclutador_agencia` sin ninguna política, una política vieja con condición incorrecta). Tocar 15+ de golpe, a mitad de sprint, es alto riesgo de dejar un hueco sin notar. Cuando se retome, debe ser tarea dedicada con auditoría completa de RLS, no mezclada con otra tarea activa (regla SPECBOOT).

## 🗂️ BACKLOG — FASE 3 (visión a 12+ meses)

- [ ] Agente de Marketing (ver spec.md §9 — requiere 2-3 meses de datos reales)
- [ ] Agente Competitivo (rastreo de OCC/Indeed/Computrabajo)
- [ ] OpenClaw o agente orquestador propio sobre la API ya documentada
- [ ] Integración estilo Leadsales
- [ ] API pública para terceros (monetización como infraestructura)
- [ ] Agente de IA para responder chats de candidatos, ofrecido como servicio de pago adicional al reclutador (idea de José, 2026-08-10, surgida al descartar `5.7`) — modelo de negocio potencial, no solo feature técnica: TuChamba cobraría a los reclutadores por automatizar respuestas en sus chats. Requiere definir alcance (¿responde preguntas de FAQ únicamente, o conversación más abierta?), pricing, y cómo se diferencia del Agente FAQ ya planeado en Sprint 6 (que es gratuito/interno, no un servicio de cobro aparte).

---

## 📋 REGISTRO DE SPRINTS COMPLETADOS

| Sprint | Fecha inicio | Fecha cierre | Status |
|--------|-------------|-------------|--------|
| Sprint 0 — Diseño de API | 2026-06-29 | 2026-06-29 | Completo |
| Sprint 1 — Supabase | 2026-06-29 | 2026-06-29 | Completo |
| Sprint 2 — Next.js + Deploy | 2026-07-17 | 2026-07-27 | Completo |
| Sprint 3 — Candidato + Invitación | 2026-07-28 | 2026-07-30 | Completo |
| Sprint 4 — Reclutador + ATS | 2026-07-30 | — | En progreso (retomado para cerrar cabos sueltos) |
| Sprint 5 — Coordinador + Alta vacante | 2026-08-01 | — | Pausado (se retoma al cerrar Sprint 4) |
| Sprint 6 — Power BI + Agentes | — | — | Pendiente |
| Sprint 7 — Admin + QA | — | — | Pendiente |
| Sprint 8 — Limpieza y retención de datos | — | — | Pendiente (agregado 2026-08-02) |

> **Nota Sprint 4:** Se decidió cerrar por completo antes de retomar Sprint 5, en vez de dejar deuda técnica repartida. Pendientes reales a cerrar en orden:
> - `4.8` — verificar que la retroalimentación al descartar sí llega al chat como `es_sistema = true`
> - `4.8e` — badge "⚠️ Historial previo" en `KanbanCard.tsx` para candidatos reactivados
> - `4.14` y `4.15` — agente FAQ nivel 1/2/3 (consulta local → Edge Function `agente-faq`)
> - `4.15d` — alertas automáticas pre-entrevista (24h antes / 48h después) en `useAlertas.ts`
> - `4.19` — subida de `documentos_candidato` a Supabase Storage
> Sprint 5 avanzó 5.1 y 5.1b antes de este corte — quedan intactas, se retoma en 5.2 al reabrir el sprint.

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
