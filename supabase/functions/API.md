# API.md — TuChamba Express 2.0
> Documentación de endpoints internos (Edge Functions de Supabase).
> Diseñados desde el día 1 para que un humano (vía Next.js) o un
> agente externo futuro (OpenClaw, orquestador propio) puedan
> invocarlos exactamente igual. La función no sabe ni le importa
> quién la llama — solo valida la autenticación.
>
> Ningún endpoint de esta lista existe en código todavía. Este
> archivo es el contrato que se construye sprint por sprint —
> cada vez que se construya una Edge Function real, se actualiza
> aquí su estado de "Planeado" a "Implementado (Sprint X)".

---

## Esquema de autenticación

Todos los endpoints internos (los que NO son simplemente queries
directas de Supabase desde el frontend con RLS) requieren:

```
Header: Authorization: Bearer <API_KEY>
```

La `API_KEY` se almacena como variable de entorno en el lado que
llama (nunca en el cliente/navegador). Para llamadas desde Next.js
Server Components o Server Actions, se usa la `SUPABASE_SERVICE_ROLE_KEY`
ya documentada en plan.md §3. Para futuros agentes externos (Fase 3),
se generará una API key independiente y revocable por endpoint —
diseño pendiente hasta llegar a esa fase, pero el header ya queda
estandarizado desde hoy para no romper compatibilidad después.

**Regla inquebrantable:** ningún endpoint de esta lista se invoca
jamás directamente desde código que corre en el navegador del
candidato, reclutador o coordinador. Siempre pasan por el servidor
(Server Component, Server Action, o llamada server-to-server a la
Edge Function).

---

## GESTIÓN DE VACANTES

### `POST /vacantes/crear`
**Estado:** Planeado — Sprint 5
**Input:**
```json
{
  "agencia_id": "uuid",
  "negocio_id": "uuid",
  "titulo": "string",
  "descripcion": "string",
  "requisitos": ["string"],
  "beneficios": ["string"],
  "...": "resto de campos según spec.md §3 tabla vacantes"
}
```
**Output:** `{ "id": "uuid", "status": "vigente" }`
**Quién lo llama hoy:** Server Action desde `VacanteModal` (coordinador)

### `PATCH /vacantes/:id/status`
**Estado:** Planeado — Sprint 5
**Input:** `{ "status": "vigente" | "pausada" | "cerrada" }`
**Output:** `{ "id": "uuid", "status": "string", "alertas_generadas": 0 }`
**Efecto secundario:** dispara CA-07.6 (notifica a reclutadores con
postulaciones activas en esa vacante — ver spec.md)

### `PATCH /vacantes/:id`
**Estado:** Planeado — Sprint 5
**Input:** cualquier subconjunto de campos editables de `vacantes`
**Output:** `{ "id": "uuid", "updated_at": "timestamp" }`

---

## GESTIÓN DE CANDIDATOS

### `GET /postulaciones/activas`
**Estado:** Planeado — Sprint 4
**Input (query params):** `?reclutador_id=uuid` o `?agencia_id=uuid`
**Output:** array de postulaciones con candidato y vacante anidados

### `PATCH /postulaciones/:id/etapa`
**Estado:** Planeado — Sprint 4
**Input:** `{ "etapa_nueva": "string", "nota": "string opcional" }`
**Output:** `{ "id": "uuid", "etapa_actual": "string" }`
**Efecto secundario:** inserta fila en `historial_etapas` automáticamente

### `POST /postulaciones/manual`
**Estado:** Planeado — Sprint 4
**Input:**
```json
{
  "reclutador_id": "uuid",
  "vacante_id": "uuid",
  "candidato": { "nombre": "string", "telefono": "string" }
}
```
**Output:** `{ "id": "uuid", "es_manual": true }`

---

## COMUNICACIÓN

### `POST /mensajes/enviar`
**Estado:** Planeado — Sprint 3 (versión candidato), Sprint 4-5 (reclutador/coordinador)
**Input:**
```json
{
  "chat_id": "uuid",
  "sender_tipo": "candidato | reclutador | coordinador | admin | agente",
  "sender_id": "uuid",
  "texto": "string"
}
```
**Output:** `{ "id": "uuid", "timestamp": "string" }`

### `GET /chats/:id/historial`
**Estado:** Planeado — Sprint 3-4
**Output:** array de mensajes ordenados por `timestamp`

---

## REPORTES

### `GET /reportes/corte-semanal`
**Estado:** Planeado — Sprint 5
**Input (query params):** `?agencia_id=uuid&semana=2026-W22`
**Output:** resumen por reclutador (efectivos, no efectivos, total a pagar)

### `GET /reportes/salud-sistema`
**Estado:** Planeado — Fase 2 (Agente Monitor)
**Output:** métricas de errores recientes, uso de tokens de Claude, etc.

### `GET /reportes/pipeline`
**Estado:** Planeado — Sprint 5-6
**Input (query params):** `?agencia_id=uuid`
**Output:** conteo de postulaciones por etapa (para el embudo del dashboard)

---

## AGENTES (Edge Functions con Claude API)

### `POST /agentes/descripcion`
**Estado:** Planeado — Sprint 5
**Input:** `{ "titulo", "requisitos", "salario", "ciudad", "jornada" }`
**Output:** `{ "descripcion", "beneficios", "letras_chiquitas" }`
**Ver implementación de referencia:** plan.md §10

### `POST /agentes/faq`
**Estado:** Planeado — Sprint 4
**Input:** `{ "vacante_id", "pregunta", "reclutador_id" }`
**Output:** `{ "respuesta": "string | null", "fuente": "estructurado | faq | escalado_coordinador" }`
**Ver implementación de referencia:** plan.md §10 (cascada de 3 niveles)

### `POST /agentes/matching`
**Estado:** Planeado — Sprint 6
**Input:** `{ "vacante_id", "mensaje_candidato" }`
**Output:** `{ "cumple_requisitos": ["string"], "no_cumple": ["string"], "sugerencia": "string" }`

### `POST /agentes/seguimiento`
**Estado:** Planeado — Sprint 6
**Input:** `{ "postulacion_id" }`
**Output:** `{ "mensaje_sugerido": "string" }`

### `POST /agentes/resumen`
**Estado:** Planeado — Sprint 6
**Input:** `{ "agencia_id", "semana" }`
**Output:** `{ "resumen_narrativo": "string" }`

---

## Notas de diseño para Fase 3 (no construir todavía)

Cuando llegue el momento de conectar un orquestador externo
(OpenClaw o propio), este mismo archivo es el punto de partida:
cada endpoint ya tiene su contrato de input/output definido, así
que el orquestador solo necesita una API key con permisos
específicos por endpoint — no hay que rediseñar nada de la
arquitectura interna para habilitar esa conexión.
