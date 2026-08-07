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
- [X] 4.4 Cards de candidato: nombre, vacante, días en etapa actual (calculado desde `historial_etapas`), badge mensaje nuevo.
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
- [ ] 4.15 Si Nivel 1 no resuelve, invoca Edge Function `agente-faq` (que internamente revisa Nivel 2 FAQ, y si no hay match, escala a Nivel 3 coordinador).
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

- [X] 5.1 `app/coordinador/login/page.tsx`: email + password con Supabase Auth.
- [X] 5.1b `app/coordinador/dashboard/page.tsx`: dashboard base con accesos rápidos a vacantes, reclutadores, pipeline y corte semanal.
- [ ] 5.1c **CORRECCIÓN — Rediseño del disparo de garantía/comisión + ciclo de vida completo del candidato en el pipeline** (ver spec.md CA-02.2 corregida, CA-02.8 a CA-02.11, CA-19.3b/c — detectado y ampliado 2026-08-06 por José, confirmado con Roxana García):

  **Parte 1 — Disparo de garantía/comisión — ✅ COMPLETA, verificada en vivo:**
  - Renombrar etapa "Oferta" → "Inducción" en `etapas_personalizadas` y `KanbanColumn.tsx` (`COLORES_ETAPA`) — ✅
  - Al mover a "Inducción": selector de fecha de inicio (sin restricción de pasado) — ✅
  - Cálculo de garantía/comisión movido de "Contratado" a "Inducción"; "Contratado" solo guarda `fecha_firma_contrato` informativo — ✅
  - `negocios.dias_descanso` (jsonb, default `[0]`) + `calcularGarantiaFinHabil()` en `lib/utils.ts` — ✅ probado en vivo (Pedro Plata, 2026-08-06: 30 días hábiles = 35 días corridos con 5 domingos saltados, correcto)
  - Migraciones SQL `postulaciones.fecha_firma_contrato` y `negocios.dias_descanso` — ✅
  - **Pendiente (Fase 2, cuando se construya `5.5` gestión de negocios):** UI en el coordinador para configurar `dias_descanso` por empresa; hoy solo editable por SQL directo
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
  - Depende de que exista el panel del coordinador (construir junto con Parte 5 o en Sprint 8)

  **Parte 5 — Archivo automático (extensión de HU-19, ver CA-19.3b/CA-19.3c) — ⏳ PENDIENTE, siguiente en la fila:**
  - "No efectivo": ocultar del Kanban del reclutador 2 días después de marcarse (mitad del reclutador — se puede hacer ya, ajustando el query de `KanbanBoard.tsx`)
  - "Contratado" con garantía cumplida: ocultar del Kanban 3 días después de `garantia_cumplida = true` (mitad del reclutador — también se puede hacer ya)
  - Panel del coordinador para ver lo archivado — depende de Sprint 8/portal coordinador, no bloquea la mitad del reclutador

  **Parte 6 — Badge de inactividad (CA-02.11) — ✅ COMPLETA, verificada en vivo:**
  - Badge "🚨 Sin actividad" en la card, etapas activas con más de 72h sin `updated_at` — verificado con Lex Luthor (screenshot 2026-08-06)

  **Nota general:** no aplica retroactivo — José confirmó que todos los candidatos actuales son de prueba, sin comisiones reales en juego. Partes 1, 2, 3 y 6 completas y probadas en vivo hoy (2026-08-06). Partes 4 y 5 quedan pendientes — la mitad de la Parte 5 que le toca al reclutador (ocultar del Kanban) puede resolverse sin esperar al portal coordinador.
- [X] 5.2 Middleware de ruta: redirige a login si no hay sesión, y a "en revisión" si `status != 'activo'`. Verificado en vivo 2026-08-06: nuevo `middleware.ts` (raíz del proyecto) protege `/coordinador/*` por si una sesión ya abierta pierde status activo a mitad de uso (el login en sí ya bloqueaba el caso de entrar con cuenta inactiva desde cero — el middleware cubre el caso complementario). Nueva página `app/coordinador/en-revision/page.tsx` (CA-08.3). Vínculo confirmado: `coordinadores.email` = `auth.users.email` (los IDs no coinciden).
- [ ] 5.3 `app/coordinador/vacantes/page.tsx`: listado de vacantes de la agencia, filtros de status y prioridad.
- [ ] 5.4 Construir `components/forms/EditableList.tsx` — componente reutilizable de lista editable (agregar, editar in-line, borrar, reordenar con `@dnd-kit`). Ver código de referencia en plan.md §11. Este componente se construye UNA vez y se reutiliza en requisitos, beneficios, documentos_requeridos, zonas_ruta y tags.
- [ ] 5.5 `VacanteModal` — un solo modal completo con secciones colapsables (accordion), no wizard de pasos. Usa `EditableList` para requisitos, beneficios, documentos requeridos y zonas de ruta. Estructura interna:
  - Sección 1: Identidad (título, negocio/agencia externa, visibilidad empresa)
  - Sección 2: Ubicación y modalidad
  - Sección 3: Condiciones laborales (salario, jornada, horario)
  - Sección 4: Descripción operativa (requisitos, beneficios como listas)
  - Sección 5: Logística especial (rutas, zonas, ruta para entrevista, estacionamiento, comedor, uniforme)
  - Sección 6: Letras chiquitas (texto libre, visible al candidato)
  - Sección 7: Parámetros de reclutamiento (posiciones, reclutadores asignados, garantía, comisión base, promoción, deadline, prioridad)
  - Sección 8: Proceso de selección (etapas personalizadas drag-to-reorder, documentos, examen médico, estudio socioeconómico, contacto RRHH)
- [ ] 5.6 Validación de campos obligatorios por sección antes de permitir guardar (título, ciudad, estado, jornada, dias_garantia, comision_base_mxn son siempre requeridos).
- [ ] 5.7 Botón "Generar con IA ✨" que invoca `agente-descripcion-vacante` para autocompletar descripción/beneficios/letras chiquitas desde los datos básicos.
- [ ] 5.8 Al guardar vacante: trigger de sincronización de sitemap (`sync-sitemap` Edge Function).
- [ ] 5.9 **Importación masiva de vacantes vía Excel** (prioridad MVP):
  - Botón "Importar desde Excel" en `app/coordinador/vacantes/page.tsx`
  - Plantilla descargable con las columnas: TÍTULO, EMPRESA, MOSTRAR EMPRESA, ESTADO, MUNICIPIO, ZONA, SALARIO, DESCRIPCIÓN, JORNADA, REQUISITOS, BENEFICIOS, CONTACTO, ESTATUS, DÍAS DE GARANTÍA, COMISIÓN, IMPULSAR
  - Parser que separa REQUISITOS y BENEFICIOS por el delimitador `|` en arrays jsonb (solo para importación masiva — el alta manual usa `EditableList`, ítem por ítem)
  - Parser de SALARIO en texto libre ("De $3,360 a $5,600 Semanales") → `salario_min`, `salario_max`, `salario_tipo`
  - Cada fila se vincula automáticamente a la `agencia_id` del coordinador que importa
  - Reporte post-importación: cuántas vacantes se crearon, cuántas fallaron y por qué (fila + motivo)
  - Modo "actualizar existentes": si el título+empresa ya existe para esa agencia, actualiza en vez de duplicar
- [ ] 5.10 `app/coordinador/reclutadores/page.tsx`: CRUD de reclutadores de la agencia.
- [ ] 5.11 `app/coordinador/pipeline/page.tsx`: Kanban global de la agencia (filtrable por vacante/reclutador).
- [ ] 5.12 `app/coordinador/faq/page.tsx`: preguntas escaladas (Nivel 3) sin responder con alerta visual, formulario de respuesta, toggle "Publicar en FAQ".
- [ ] 5.13 Chat coordinador↔reclutador (tipo `reclutador_coordinador`): lista de conversaciones, contextuales por vacante o generales.
- [ ] 5.14 Trigger de alerta proactiva granular: al cambiar `status`, `comision_base_mxn`, `dias_garantia`, `tiene_promocion`, `promocion_monto_mxn`, `tiene_ruta` de una vacante — notificar a todos los reclutadores de la agencia con mensaje específico de qué cambió (ver spec.md CA-07.6, CA-07.7, CA-07.8).
- [ ] 5.15 Sección "Qué decirle al candidato" en el VacanteModal — texto editable por el coordinador que aparece en la ficha operativa del reclutador (ver spec.md CA-09.2).
- [ ] 5.16 Indicador de completitud de vacante — badge de advertencia si faltan campos críticos antes de publicar (ver spec.md CA-09.3).
- [ ] 5.16b Campos de inducción en formulario de vacante: `dias_induccion` (número) y checkbox `induccion_dentro_garantia` con leyenda "La inducción va dentro de los días de garantía". Si `induccion_dentro_garantia = false`, el cálculo de `fecha_garantia_fin` suma `dias_induccion + dias_garantia`.
- [ ] 5.17 `app/coordinador/corte-semanal/page.tsx`: resumen automático por reclutador (efectivos, no efectivos, total a pagar).
- [ ] 5.18 Botón "Marcar semana como pagada": actualiza `cortes_semana.pagado` y `postulaciones.pagado`, genera resumen descargable.
- [ ] 5.19 Configuración de día de corte por agencia: el coordinador puede definir `dia_corte` y `dia_pago` desde su perfil de agencia (campos ya existentes en DB desde Sprint 4).

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
- [ ] 6.8 Edge Function `agente-matching` — pre-calificación automática de candidatos (ver spec.md HU-17):
  - Hace 2-3 preguntas clave al candidato basadas en los requisitos de la vacante
  - Si no cumple → muestra vacantes alternativas, no conecta con el reclutador
  - Si cumple → conecta con el reclutador con badge "✅ Pre-calificado" en la card del Kanban
  - El coordinador puede editar las preguntas de pre-calificación por vacante (máximo 5)
- [ ] 6.8b Control de cupo por vacante (ver spec.md HU-16):
  - Campo `cupo_requerido` editable por el coordinador en la ficha de vacante
  - Indicador en tiempo real: contratados activos / en proceso / lugares disponibles
  - Pausa automática cuando `cupo_cubierto >= cupo_requerido` + notificación al coordinador
  - Alerta amarilla cuando candidatos en Entrevista+Oferta igualan el cupo restante
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
- [ ] Rutas de transporte con documento PDF por empresa (idea de José, 2026-08-06): al dar de alta una vacante, el coordinador indica si la empresa cuenta con rutas y puede subir el PDF con el detalle — visible en la ficha de la vacante en el portal candidato desde el inicio, para que el candidato consulte por su cuenta y solo pregunte dudas puntuales. **Nota de diseño pendiente de resolver cuando se construya:** José confirmó que beneficios y transporte suelen ser iguales para todas las vacantes de una misma empresa (lo que varía es requisitos/horarios por vacante) — esto sugiere que `tiene_ruta` y `zonas_ruta`, hoy campos de `vacantes`, probablemente deberían vivir en `negocios` en vez de repetirse por vacante. Evaluar migración al construir esta feature.

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
