# 📄 ESPECIFICACIÓN FUNCIONAL: TUCHAMBA EXPRESS 2.0
> **Versión:** 1.0 | **Fecha de cierre:** 2026-05-31
> **Autor:** José (BitX) + Claude (Arquitecto IA)
> **Estado:** FIRMADO — Cualquier desarrollo que no esté registrado aquí se considera Muda y está bloqueado.

---

## POLÍTICA SDD INMUTABLE

> Ninguna función, pantalla, tabla o automatización puede programarse si no está documentada en este archivo con sus Criterios de Aceptación aprobados. Si una idea surge durante el desarrollo, se anota en `tasks.md` como backlog del siguiente sprint — nunca se implementa en el sprint activo.

---

## 1. INGENIERÍA DEL DOLOR

### 1.1 Síntoma Central
Los reclutadores freelance de Nuevo León gestionan candidatos simultáneamente por WhatsApp personal, Excel y OCC. Pierden candidatos entre conversaciones, no tienen visibilidad del pipeline, no saben en qué etapa está cada quien, y no pueden demostrarle a la empresa ni al coordinador que cumplieron los días de garantía porque no existe registro estructurado.

Los candidatos aplican a vacantes y nunca reciben retroalimentación. Esa experiencia de silencio genera desconfianza en el portal y no regresan.

Los coordinadores trianglan información manualmente: reciben datos de la empresa, los procesan, los suben, y mientras tanto el reclutador espera sin poder operar. Cada flecha en ese flujo es tiempo muerto que mata colocaciones.

### 1.2 El Flujo Roto (V1)
```
Empresa da info → Coordinador la procesa →
Coordinador la sube → Reclutador la lee →
Reclutador tiene dudas → Espera respuesta →
Candidato espera → Se pierde
```

### 1.3 El Flujo Objetivo (V2)
```
Empresa da info → Coordinador captura UNA VEZ →
Sistema distribuye simultáneamente a:
  ├── Portal candidato (vacante pública con SEO)
  ├── Panel reclutador (ficha técnica completa)
  ├── FAQ inteligente (dudas resueltas para todos)
  └── Dashboard coordinador (métricas en tiempo real)
```

### 1.4 El Problema Huevo-Gallina (por qué falló V1)
Sin candidatos, los reclutadores no publican vacantes. Sin vacantes, los candidatos no regresan. Sin tráfico, los reclutadores no comparten.

**La solución de diseño:** El ATS del reclutador tiene valor aunque no haya candidatos en la plataforma. El reclutador puede importar candidatos manualmente, gestionar su pipeline, registrar garantías. Eso engancha al reclutador primero. Los candidatos llegan después porque los reclutadores ya están activos.

### 1.5 Impacto Financiero del Problema
Un reclutador que pierde 3 candidatos al mes por falta de seguimiento, a comisión promedio de $2,500 MXN = **$7,500 MXN mensuales perdidos por reclutador**. TuChamba le evita esa pérdida. Ese es el argumento de venta.

---

## 2. JERARQUÍA Y ROLES

```
Admin (dueño de la plataforma)
  └── Agencias (múltiples)
        └── Coordinadores (uno o más por agencia)
              └── Reclutadores (pertenecen a una agencia)
                    └── Postulaciones → Candidatos
```

### Regla de reclutador multi-agencia
Un reclutador puede pertenecer a más de una agencia. La clave única es `reclutador_id + agencia_id` — nunca se duplica el perfil del reclutador, solo su membresía.

### Permisos por rol

| Acción | Admin | Coordinador | Reclutador | Candidato |
|--------|-------|-------------|------------|-----------|
| Ver todas las agencias | ✓ | ✗ | ✗ | ✗ |
| CRUD vacantes | ✓ | Solo su agencia | ✗ | ✗ |
| Ver ficha operativa de vacante | ✓ | ✓ | ✓ | ✗ |
| Ver letras chiquitas | ✓ | ✓ | ✓ | ✓ |
| Ver contacto RRHH empresa | ✓ | ✓ | ✓ | ✗ |
| Gestionar pipeline candidatos | ✓ | ✓ | Solo los suyos | ✗ |
| Ver comisiones de otros | ✓ | Solo su agencia | ✗ | ✗ |
| Marcar corte semanal como pagado | ✓ | ✓ | ✗ | ✗ |
| Publicar/pausar vacante | ✓ | ✓ | ✗ | ✗ |
| Responder FAQ | ✓ | ✓ | ✗ | ✗ |
| Iniciar chat con candidato | — | — | ✓ | ✓ |
| Chat coordinador↔reclutador | ✓ | ✓ | ✓ | ✗ |

---

## 3. MODELO DE DATOS

### agencias
```sql
id uuid PK
nombre text NOT NULL
logo_url text
created_at timestamptz DEFAULT now()
```

### coordinadores
```sql
id uuid PK
agencia_id uuid FK → agencias.id
nombre text NOT NULL
email text UNIQUE NOT NULL
telefono text
activo bool DEFAULT true
created_at timestamptz DEFAULT now()
```

### reclutadores
```sql
id uuid PK
nombre text NOT NULL
codigo text UNIQUE NOT NULL  -- para login y sistema de referidos
email text
telefono text
activo bool DEFAULT true
created_at timestamptz DEFAULT now()
```

### reclutador_agencia (membresía — soporta multi-agencia)
```sql
id uuid PK
reclutador_id uuid FK → reclutadores.id
agencia_id uuid FK → agencias.id
activo bool DEFAULT true
created_at timestamptz DEFAULT now()
UNIQUE(reclutador_id, agencia_id)
```

### negocios (empresas cliente)
```sql
id uuid PK
nombre text NOT NULL
industria text
contacto_nombre text
contacto_telefono text
contacto_email text
created_at timestamptz DEFAULT now()
```

### vacantes
```sql
id uuid PK
negocio_id uuid FK → negocios.id
agencia_id uuid FK → agencias.id
creado_por uuid FK → coordinadores.id

-- CAPA PÚBLICA (visible al candidato)
titulo text NOT NULL
descripcion text NOT NULL
requisitos jsonb DEFAULT '[]'       -- [{texto, obligatorio}]
beneficios jsonb DEFAULT '[]'       -- [{texto}]
letras_chiquitas text               -- lo que el candidato no sabe hasta que llega
salario_min numeric
salario_max numeric
salario_tipo text                   -- neto/bruto/hora/convenir
salario_visible bool DEFAULT true
ciudad text NOT NULL
estado text NOT NULL
colonia_zona text                   -- orientación geográfica
modalidad text NOT NULL             -- presencial/hibrido/remoto
jornada text NOT NULL               -- completo/medio/proyecto/fines
horario text
tipo_contrato text
fecha_inicio_estimada date

-- LOGÍSTICA (visible candidato y reclutador)
tiene_ruta bool DEFAULT false
zonas_ruta jsonb DEFAULT '[]'
ruta_para_entrevista bool DEFAULT false
horario_ruta text
estacionamiento bool DEFAULT false
comedor bool DEFAULT false
uniforme bool DEFAULT false

-- OPERATIVO (solo coordinador y reclutador — NUNCA al candidato)
contacto_rrhh_nombre text
contacto_rrhh_telefono text
mejor_horario_contacto text
notas_coordinador text
num_posiciones int DEFAULT 1
deadline date
prioridad text DEFAULT 'normal'     -- normal/alta/urgente

-- ATS
etapas_personalizadas jsonb DEFAULT '["Aplicado","Contactado","Entrevista","Oferta","Contratado"]'
requiere_examen_medico bool DEFAULT false
requiere_estudio_socioeconomico bool DEFAULT false
documentos_requeridos jsonb DEFAULT '[]'

-- COMERCIAL
dias_garantia int NOT NULL
comision_base_mxn numeric NOT NULL
tiene_promocion bool DEFAULT false
promocion_descripcion text
promocion_monto_mxn numeric
promocion_fin date

-- SISTEMA
status text DEFAULT 'vigente'       -- vigente/pausada/cerrada
empresa_visible bool DEFAULT true
destacada bool DEFAULT false
tags jsonb DEFAULT '[]'
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

### candidatos
```sql
id uuid PK
nombre text NOT NULL
telefono text NOT NULL
email text
cv_url text
created_at timestamptz DEFAULT now()
```

### postulaciones
```sql
id uuid PK
vacante_id uuid FK → vacantes.id
candidato_id uuid FK → candidatos.id
reclutador_id uuid FK → reclutadores.id
agencia_id uuid FK → agencias.id
etapa_actual text NOT NULL          -- coincide con etapas_personalizadas de la vacante
es_manual bool DEFAULT false        -- candidato importado por el reclutador
score int                           -- calificación 1-5 del reclutador (opcional)

-- CONTRATACIÓN
fecha_contratacion date
fecha_garantia_fin date             -- calculado: fecha_contratacion + dias_garantia
garantia_cumplida bool DEFAULT false
motivo_no_efectivo text             -- renuncia/despido_empresa/despido_causa/otro
comision_aplicable bool DEFAULT false

-- COMISIÓN APLICADA (calculada al momento del cierre)
comision_aplicada_mxn numeric       -- base o promoción según fecha de contratación
habia_promocion_al_cierre bool DEFAULT false

-- CORTE SEMANAL
semana_corte text                   -- ej. "2026-W22" (semana ISO)
pagado bool DEFAULT false
fecha_pago date

created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

### historial_etapas (trazabilidad del ATS)
```sql
id uuid PK
postulacion_id uuid FK → postulaciones.id
etapa_anterior text
etapa_nueva text
cambiado_por uuid                   -- reclutador_id o coordinador_id
nota text                           -- comentario opcional del cambio
created_at timestamptz DEFAULT now()
```
> Cada movimiento en el Kanban genera una fila aquí automáticamente.
> Permite calcular tiempo real por etapa y auditar el proceso completo
> de cada candidato sin depender de la memoria del reclutador.

### documentos_candidato (ATS — versionado de documentos)
```sql
id uuid PK
candidato_id uuid FK → candidatos.id
postulacion_id uuid FK → postulaciones.id
tipo text                           -- cv/identificacion/comprobante/otro
archivo_url text NOT NULL           -- Supabase Storage
created_at timestamptz DEFAULT now()
```

### chats (sistema de mensajería unificado)
```sql
id uuid PK
tipo text NOT NULL
-- candidato_reclutador / reclutador_coordinador /
-- admin_sistema / agente_reclutador

-- Participantes (nullable según tipo)
candidato_id uuid FK → candidatos.id
reclutador_id uuid FK → reclutadores.id
coordinador_id uuid FK → coordinadores.id
agencia_id uuid FK → agencias.id
vacante_id uuid FK → vacantes.id    -- contexto opcional
postulacion_id uuid FK → postulaciones.id  -- nullable, solo si aplica

-- Estado
ultimo_mensaje text
ultimo_mensaje_at timestamptz
ultimo_sender_tipo text             -- candidato/reclutador/coordinador/admin/agente
archivado bool DEFAULT false
created_at timestamptz DEFAULT now()
```

### mensajes (sistema de mensajería unificado)
```sql
id uuid PK
chat_id uuid FK → chats.id
sender_tipo text NOT NULL           -- candidato/reclutador/coordinador/admin/agente
sender_id uuid                      -- id del sender según su tipo
sender_nombre text NOT NULL
texto text NOT NULL
es_sistema bool DEFAULT false       -- mensajes automáticos de agentes
es_faq bool DEFAULT false           -- si el coordinador lo marcó para FAQ
metadata jsonb                      -- datos extra para mensajes de agentes
timestamp timestamptz DEFAULT now()
```
> Un solo par de tablas sirve para los 4 tipos de conversación del sistema.
> Mismo componente `<ChatWindow />` en frontend, mismo canal Realtime,
> solo cambian permisos RLS y el `tipo` de chat.

### faqs_vacante
```sql
id uuid PK
vacante_id uuid FK → vacantes.id
pregunta text NOT NULL
respuesta text NOT NULL
preguntado_por uuid FK → reclutadores.id
respondido_por uuid FK → coordinadores.id
visible_reclutadores bool DEFAULT true
created_at timestamptz DEFAULT now()
```

### invitaciones (alta controlada de agencias — ver §8)
```sql
id uuid PK
token text UNIQUE NOT NULL
tipo text DEFAULT 'nueva_agencia'
creado_por uuid                     -- admin que generó el link
usado bool DEFAULT false
expira_at timestamptz NOT NULL
agencia_id uuid                     -- se llena cuando se usa
created_at timestamptz DEFAULT now()
```

### alertas
```sql
id uuid PK
tipo text NOT NULL
-- tipos: garantia_venciendo/candidato_sin_movimiento/
--        entrevista_vencida/vacante_sin_candidatos/
--        mensaje_nuevo/pregunta_sin_responder/
--        vacante_status_cambio
destinatario_id uuid NOT NULL
destinatario_rol text NOT NULL      -- reclutador/coordinador/admin
vacante_id uuid
postulacion_id uuid
candidato_id uuid
mensaje text NOT NULL
leida bool DEFAULT false
created_at timestamptz DEFAULT now()
```

### cortes_semana
```sql
id uuid PK
agencia_id uuid FK → agencias.id
semana text NOT NULL                -- ej. "2026-W22"
fecha_corte date NOT NULL           -- siempre jueves
fecha_pago date NOT NULL            -- siempre viernes
total_mxn numeric NOT NULL
pagado bool DEFAULT false
generado_por uuid FK → coordinadores.id
created_at timestamptz DEFAULT now()
UNIQUE(agencia_id, semana)
```

### trafico_referidos
```sql
id uuid PK
reclutador_id uuid FK → reclutadores.id
agencia_id uuid FK → agencias.id
vacante_id uuid FK → vacantes.id
fuente text                         -- google_organico/facebook/instagram/
                                    -- whatsapp_referido/directo/otro
created_at timestamptz DEFAULT now()
```

---

## 4. HISTORIAS DE USUARIO Y CRITERIOS DE ACEPTACIÓN

### HU-01: Candidato se postula a una vacante
**Como** candidato, **quiero** iniciar un chat con el reclutador desde la página de una vacante, **para** postularme sin necesidad de crear una cuenta completa.

**CA-01.1:** Dado que el candidato hace clic en "Postularme", cuando ingresa nombre y teléfono en el modal, entonces el sistema crea automáticamente un registro en `candidatos`, una `postulacion` con `etapa_actual = "Aplicado"`, y un `chat_candidato` vinculado.

**CA-01.2:** Dado que ya existe un chat previo del mismo teléfono para esa vacante y reclutador, cuando el candidato intenta abrir el chat, entonces el sistema retoma la conversación existente sin crear duplicados.

**CA-01.3:** Dado que el candidato llega por URL con `?ref=CODIGO`, cuando se crea la postulación, entonces `reclutador_id` se asigna al reclutador con ese código aunque el candidato no lo sepa explícitamente.

**CA-01.4:** El sistema nunca crea una postulación si el campo `telefono` está vacío o tiene menos de 10 dígitos.

---

### HU-02: Reclutador gestiona su pipeline
**Como** reclutador, **quiero** ver todos mis candidatos en un tablero Kanban por vacante, **para** saber en qué etapa está cada uno sin tener que recordarlo.

**CA-02.1:** Dado que el reclutador arrastra una tarjeta a una nueva columna, cuando suelta la tarjeta, entonces `postulaciones.etapa_actual` se actualiza en tiempo real y todos los dispositivos conectados reflejan el cambio.

**CA-02.2:** Dado que el reclutador mueve un candidato a la etapa "Contratado", cuando confirma la acción en el modal de confirmación, entonces el sistema registra `fecha_contratacion = hoy`, calcula `fecha_garantia_fin = fecha_contratacion + vacantes.dias_garantia`, y revisa si hay promoción activa para asignar `comision_aplicada_mxn`.

**CA-02.3:** Dado que una postulación lleva más de 48 horas en la misma etapa sin actividad, entonces el sistema genera una alerta visible en el panel del reclutador: *"[Nombre candidato] lleva X días sin movimiento en [vacante]."*

**CA-02.4:** El reclutador puede mover cualquier tarjeta a "Descartado" desde cualquier etapa, pero el sistema le pide confirmar y registrar el motivo.

---

### HU-03: Reclutador consulta la ficha operativa de una vacante
**Como** reclutador, **quiero** ver todos los detalles operativos de una vacante en un solo lugar, **para** no tener que preguntarle al coordinador información básica.

**CA-03.1:** La ficha operativa visible para el reclutador incluye: contacto RRHH, teléfono, mejor horario de contacto, etapas del proceso, documentos requeridos, rutas disponibles, días de garantía, comisión base y promoción activa (si existe), y todas las preguntas del FAQ respondidas.

**CA-03.2:** Dado que el reclutador tiene una duda no resuelta en el FAQ, cuando envía una pregunta al coordinador desde la ficha, entonces el sistema crea un `mensaje_interno` vinculado a esa vacante y genera una alerta al coordinador.

**CA-03.3:** Dado que el coordinador responde una pregunta y activa el toggle "Agregar al FAQ", entonces la respuesta queda visible en la ficha de esa vacante para todos los reclutadores de la agencia automáticamente.

#### CA-03.4 — Priorización del Agente FAQ (evita cuello de botella del coordinador)

El dolor real: reclutadores nuevos preguntan mucho, coordinadores tardan en contestar. La solución no es un solo canal — es una cascada de tres niveles, donde la mayoría de preguntas se resuelven SIN que el coordinador intervenga nunca:

```
Reclutador pregunta (texto libre desde la ficha de vacante)
  ↓
NIVEL 1 — Campo estructurado de la vacante
  ¿La pregunta coincide con un campo que ya existe?
  (status, tiene_ruta, ruta_para_entrevista, salario_visible,
   estacionamiento, comedor, uniforme, horario, dias_garantia)
  → SÍ: respuesta instantánea desde la base de datos.
        Cero IA, cero costo, cero espera.
  → NO: continúa al Nivel 2
  ↓
NIVEL 2 — Búsqueda en faqs_vacante de esa vacante
  ¿Ya existe una pregunta similar respondida antes?
  → SÍ: se muestra la respuesta guardada al instante
  → NO: continúa al Nivel 3
  ↓
NIVEL 3 — Escalación al coordinador
  Se crea mensaje_interno + alerta al coordinador
  Al responder, el coordinador decide con un toggle
  si esa respuesta se guarda en faqs_vacante
  (así la siguiente vez que alguien pregunte algo similar,
   se resuelve en el Nivel 2 sin esperar a nadie)
```

**CA-03.5:** Dado que la pregunta del reclutador coincide con un campo estructurado de la vacante (ej. "¿sigue vigente?", "¿tiene ruta?"), cuando el sistema la procesa, entonces responde de inmediato consultando ese campo directamente — sin invocar la API de Claude y sin generar alerta al coordinador.

**CA-03.6:** Solo cuando una pregunta no se resuelve en Nivel 1 ni Nivel 2 se invoca la Edge Function `agente-faq` con Claude API. La mayoría de preguntas repetidas (vigencia, horario, ruta, salario) nunca llegan a consumir tokens de IA.

---

### HU-04: Coordinador gestiona comisiones y corte semanal
**Como** coordinador, **quiero** ver un resumen semanal de candidatos colocados por reclutador con su estado de garantía, **para** procesar el pago del viernes con un solo clic.

**CA-04.1:** El panel de corte muestra por reclutador: candidatos colocados en la semana, cuántos cumplieron garantía, cuántos no fueron efectivos (con motivo), y el total a pagar.

**CA-04.2:** Dado que la fecha actual es jueves, cuando el coordinador abre el panel de corte, entonces el sistema muestra automáticamente el resumen de la semana actual (lunes a jueves) calculado desde `postulaciones` donde `garantia_cumplida = true` y `semana_corte` coincide con la semana ISO actual.

**CA-04.3:** Dado que el coordinador hace clic en "Marcar semana como pagada", cuando confirma la acción, entonces `cortes_semana.pagado = true`, `postulaciones.pagado = true` para todos los registros de esa semana, y el sistema genera un resumen descargable por reclutador.

**CA-04.4:** Un candidato cuyo motivo de baja es `despido_empresa` o `renuncia` antes de cumplir garantía tiene `comision_aplicable = false` y no aparece en el total a pagar, independientemente de la causa.

---

### HU-05: SEO dinámico por vacante
**Como** candidato que busca empleo en Google, **quiero** encontrar vacantes específicas de TuChamba en los resultados de búsqueda, **para** llegar directo a la oportunidad que me interesa.

**CA-05.1:** Dado que el candidato entra a una vacante específica, cuando la página carga, entonces `document.title`, `meta[name="description"]` y el script JSON-LD `JobPosting` se actualizan con los datos reales de esa vacante.

**CA-05.2:** El canonical URL de cada vacante nunca incluye el parámetro `?ref=CODIGO` — siempre apunta a la URL limpia para evitar contenido duplicado en Google.

**CA-05.3:** Dado que se publica, edita o cierra una vacante, entonces el sitemap.xml se regenera y sincroniza automáticamente al repositorio de GitHub sin intervención manual.

---

### HU-06: Sistema de referidos
**Como** reclutador, **quiero** compartir un link con mi código a candidatos potenciales, **para** que cuando se postulen queden vinculados a mí automáticamente aunque no hayan llegado por la app.

**CA-06.1:** El parámetro `?ref=CODIGO` se guarda en `localStorage` al primer contacto y persiste aunque el candidato cierre y reabra el navegador.

**CA-06.2:** El canonical URL y las meta tags nunca incluyen el `?ref=` para proteger el SEO.

**CA-06.3:** El botón de login admin se oculta automáticamente cuando la URL contiene `?ref=` para no distraer al candidato referido.

---

### HU-07: Alertas automáticas de seguimiento
**Como** reclutador, **quiero** recibir alertas automáticas cuando un candidato requiere atención, **para** no perder colocaciones por olvido.

**CA-07.1:** Garantía venciendo en 3 días o menos → alerta roja en la tarjeta del candidato.

**CA-07.2:** Candidato en cualquier etapa sin movimiento por 48 horas → alerta amarilla al reclutador.

**CA-07.3:** Fecha de entrevista registrada que ya pasó y el candidato sigue en etapa "Entrevista" → alerta al reclutador: *"¿Se presentó [nombre] a la entrevista?"*

**CA-07.4:** Vacante sin candidatos nuevos por 5 días → alerta al coordinador.

**CA-07.5:** Pregunta de reclutador sin respuesta por más de 24 horas → alerta al coordinador.

**CA-07.6 — Alerta proactiva de cambio de status (elimina la pregunta antes de que nazca):** Dado que el coordinador cambia el `status` de una vacante (vigente → pausada → cerrada), cuando confirma el cambio, entonces el sistema notifica automáticamente a todos los reclutadores con postulaciones activas en esa vacante, sin que tengan que preguntar. Esto cubre exactamente la duda más común de reclutadores nuevos: *"¿esta vacante todavía está disponible?"*

---

## 5. REGLAS DE NEGOCIO DE COMISIONES

### 5.1 Cálculo de comisión al cierre
Al mover candidato a "Contratado":
```
SI vacantes.tiene_promocion = true
   Y fecha_contratacion <= vacantes.promocion_fin
ENTONCES
   comision_aplicada_mxn = vacantes.promocion_monto_mxn
   habia_promocion_al_cierre = true
DE LO CONTRARIO
   comision_aplicada_mxn = vacantes.comision_base_mxn
   habia_promocion_al_cierre = false
```

### 5.2 Efectividad de candidatos
| Situación | ¿Efectivo? | ¿Cobra comisión? |
|-----------|-----------|-----------------|
| Cumple días de garantía | ✓ Sí | ✓ Sí |
| Renuncia antes de garantía | ✗ No | ✗ No |
| Empresa lo despide antes de garantía | ✗ No | ✗ No |
| Empresa lo despide por causa del candidato | ✗ No | ✗ No |

> **Nota:** No existe comisión parcial en ningún caso. Es todo o nada al cumplir la garantía.

### 5.3 Corte semanal
- El corte aplica de **lunes a jueves**
- El pago se procesa el **viernes**
- Solo entran candidatos con `garantia_cumplida = true` en esa semana
- El coordinador marca el corte como pagado manualmente después de transferir

---

## 6. PORTALES — ALCANCE MVP (FASE 1)

### Portal Candidato (web pública)
- Home con vacantes, paginación, búsqueda y filtros estado/ciudad
- Detalle de vacante con SEO dinámico + JSON-LD JobPosting
- Sección visible: letras chiquitas, rutas, beneficios completos
- Chat interno para postularse (nombre + teléfono al abrir)
- Estado visible de su postulación en la misma pantalla del chat
- Sistema de referidos `?ref=CODIGO`
- Detección y registro de fuente de tráfico

### Portal Reclutador (web PWA instalable)
- Login por código de reclutador
- Dashboard: candidatos activos, colocados este mes, comisión estimada
- Kanban pipeline por vacante con etapas personalizadas
- Chat en tiempo real con candidatos (con badge de mensajes nuevos)
- Registro manual de candidato externo
- Ficha operativa completa de cada vacante
- FAQ por vacante con sistema de preguntas al coordinador
- Chat interno con coordinador (contextual por vacante o general)
- Panel de comisiones semanal (lo que va a cobrar el viernes)
- Alertas de seguimiento automáticas
- Contador de garantía con alerta roja ≤ 3 días

### Portal Coordinador (web)
- Login con email + contraseña (Supabase Auth)
- CRUD completo de vacantes (todos los bloques del alta)
- CRUD reclutadores de su agencia
- Gestión de negocios (empresas cliente)
- Kanban global de postulaciones de su agencia
- FAQ management: responder preguntas y publicarlas
- Chat interno con reclutadores
- Dashboard Power BI:
  - Vacantes por status y prioridad
  - Candidatos por etapa (embudo de conversión)
  - Efectividad por reclutador (colocados vs no efectivos)
  - Comisiones pagadas vs pendientes vs perdidas
  - Fuentes de tráfico (de dónde llegan los candidatos)
  - Tiempo promedio de colocación por vacante
- Panel de corte semanal con generación de resumen por reclutador
- Generador y sync de sitemap.xml a GitHub

### Portal Admin (web — solo tú)
- Todo lo del coordinador pero sin filtro de agencia
- CRUD de agencias
- CRUD de coordinadores
- Vista global de todas las postulaciones
- Métricas globales de la plataforma

---

## 7. FASE 2 (Post-lanzamiento — no entra al MVP)
- Notificaciones push en PWA
- Integración WhatsApp Business API oficial
- Sistema de pagos de comisión integrado (transferencia desde la plataforma)
- Exportación de reportes a Excel/PDF
- Portal empresa (la empresa ve solo sus vacantes y candidatos)
- App nativa Android (si la PWA no es suficiente para los reclutadores)
- Módulo de ofertas de trabajo (empresa hace oferta formal desde la plataforma)
- Sistema de invitación con aprobación admin para nuevas agencias (ver §8)

## 8. SISTEMA DE INVITACIÓN Y APROBACIÓN DE AGENCIAS

### 8.1 El flujo
```
1. Admin genera link de invitación (token único, expira en X días)
2. Admin envía el link a su contacto (futuro coordinador)
3. Coordinador abre el link público /invitacion/[token]
4. Paso 1: registra datos de la agencia → status "pendiente_aprobacion"
5. Paso 2 (mismo flujo): registra su propio perfil de coordinador
   → status "pendiente_aprobacion", vinculado a esa agencia
6. Admin revisa en su panel "Solicitudes pendientes"
7. Admin aprueba → agencia.status = "activa",
                     coordinador.status = "activo"
   Admin rechaza → ambos quedan en "rechazada"/"rechazado"
8. Al aprobar, el coordinador obtiene permisos de
   creación/edición/eliminación de vacantes y reclutadores
   DENTRO de su agencia únicamente
```

### 8.2 Regla inquebrantable
Solo el Admin puede editar o eliminar una agencia, o remover a un
coordinador, sin importar el status. El coordinador nunca tiene ese
permiso sobre su propia agencia — solo sobre las vacantes y
reclutadores que gestiona dentro de ella.

### 8.3 Tablas nuevas
```sql
invitaciones
  id uuid PK
  token text UNIQUE NOT NULL
  tipo text DEFAULT 'nueva_agencia'
  creado_por uuid                     -- admin que generó el link
  usado bool DEFAULT false
  expira_at timestamptz NOT NULL
  agencia_id uuid                     -- se llena cuando se usa
  created_at timestamptz DEFAULT now()
```

### 8.4 Campos nuevos en tablas existentes
```sql
agencias
  + status text DEFAULT 'pendiente_aprobacion'
    -- pendiente_aprobacion / activa / rechazada / suspendida
  + invitacion_id uuid FK → invitaciones.id
  + aprobado_por uuid
  + aprobado_at timestamptz

coordinadores
  + status text DEFAULT 'pendiente_aprobacion'
    -- pendiente_aprobacion / activo / rechazado / suspendido
```

### 8.5 Criterios de aceptación

**CA-08.1:** Dado que el Admin genera una invitación, cuando hace clic en "Generar link", entonces el sistema crea un token único con expiración de 7 días y genera la URL `/invitacion/[token]` lista para copiar.

**CA-08.2:** Dado que un coordinador abre un link de invitación expirado o ya usado, cuando carga la página, entonces ve un mensaje claro de error sin acceso al formulario.

**CA-08.3:** Dado que el coordinador completa ambos pasos del registro (agencia + perfil propio), cuando envía el formulario, entonces ambos registros quedan en `pendiente_aprobacion` y el coordinador ve una pantalla de "Tu cuenta está en revisión" sin acceso al dashboard.

**CA-08.4:** Dado que el Admin aprueba una solicitud desde su panel, cuando confirma la acción, entonces `agencia.status` y `coordinador.status` cambian a activo/activa simultáneamente, y el coordinador puede loguearse con acceso completo a su agencia.

**CA-08.5:** Ningún coordinador, en ningún status, puede editar el nombre, RFC o status de su propia agencia, ni eliminarla. Esa acción está reservada exclusivamente al rol Admin.

## 9. AGENTE DE MARKETING (diseño futuro — Fase 2/3, no se implementa en MVP)

### 9.1 Propósito
Analizar el comportamiento real de tráfico y conversión para sugerir
acciones de marketing — no reemplaza decisiones humanas, las informa.

### 9.2 Datos que ya capturamos desde el MVP (su materia prima futura)
```
trafico_referidos    → de dónde llegan los candidatos
                        (google_organico/facebook/instagram/
                         whatsapp_referido/directo)
postulaciones         → qué vacantes convierten mejor
vacantes.destacada    → qué se promociona y qué resultado da
chats                 → volumen de interés real por vacante
cortes_semana         → qué reclutadores/agencias generan
                         más colocaciones efectivas
```

### 9.3 Posibles funciones futuras (a diseñar con datos reales en mano)
- Identificar qué vacantes necesitan más promoción
  (alto tráfico, baja conversión a postulación)
- Sugerir en qué fuente de tráfico invertir más
  (la fuente con mejor tasa candidato → contratado, no solo más clicks)
- Generar borradores de posts para redes sociales
  basados en vacantes destacadas de la semana
- Reporte mensual de qué contenido o canal trajo más
  colocaciones efectivas (no solo más tráfico)

### 9.4 Por qué no entra al MVP
Sin al menos 2-3 meses de datos reales de tráfico y conversión,
cualquier sugerencia del agente sería especulación sin base.
Se diseña su Edge Function específica cuando exista ese histórico.
