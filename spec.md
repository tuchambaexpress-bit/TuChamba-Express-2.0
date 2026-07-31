# 📄 ESPECIFICACIÓN FUNCIONAL: TUCHAMBA EXPRESS 2.0
> **Versión:** 1.0 | **Fecha de cierre:** 2026-05-31
> **Autor:** José (BitX) + Claude (Arquitecto IA)
> **Estado:** FIRMADO — Cualquier desarrollo que no esté registrado aquí se considera Muda y está bloqueado.

---

## POLÍTICA SDD INMUTABLE

> Ninguna función, pantalla, tabla o automatización puede programarse si no está documentada en este archivo con sus Criterios de Aceptación aprobados. Si una idea surge durante el desarrollo, se anota en `tasks.md` como backlog del siguiente sprint — nunca se implementa en el sprint activo.

---

## PRINCIPIOS DE DISEÑO UX — NO NEGOCIABLES

> Estos principios aplican a TODAS las pantallas, flows y decisiones de UI del sistema. Cualquier feature nueva que se proponga debe evaluarse contra estos tres ejes antes de construirse.

### 1. Intuitivo
El usuario nunca debe preguntarse "¿qué hago aquí?" — la acción correcta debe ser obvia sin necesidad de instrucciones. Si algo requiere un tutorial para entenderse, hay que rediseñarlo.

### 2. Sin fricción (Cero fricción)
Ningún proceso debe pedir más información de la estrictamente necesaria. El candidato se postula con nombre y teléfono — nada más. El reclutador gestiona sin burocracia. Cada campo de formulario que se elimina es una fricción menos que puede costar una colocación.

### 3. Generador de confianza
Cada elemento de la UI debe comunicar profesionalismo y transparencia:
- El candidato siempre sabe con quién habla (nombre del reclutador visible)
- Las letras chiquitas están a la vista, no escondidas
- El estado de la postulación es visible en todo momento
- Las notificaciones son oportunas — el silencio genera desconfianza
- El chat interno reemplaza al WhatsApp personal — la conversación es profesional y trazable

### Regla de decisión
Cuando haya que elegir entre dos implementaciones, siempre gana la que sea más intuitiva, genere menos fricción y comunique más confianza — aunque sea técnicamente más compleja de construir.

### Responsive Design — breakpoints y comportamiento por portal

**Breakpoints estándar:**
- Móvil: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Portal Candidato:**
- Móvil → lista de vacantes a pantalla completa, detalle abre en modal bottom-sheet
- Desktop → lista izquierda 40%, detalle derecha 60%

**Portal Reclutador:**
- Móvil → Kanban muestra lista filtrable por etapa (no columnas horizontales)
- Desktop → Kanban con columnas horizontales con scroll
- Todas las pantallas del reclutador deben ser 100% funcionales en móvil — los reclutadores operan principalmente desde su celular

**Portal Coordinador:**
- Tablet/Desktop prioritario para gestión de vacantes (formulario complejo)
- Móvil debe permitir al menos: ver solicitudes, aprobar/rechazar, cambiar status de vacantes
- El dashboard Power BI colapsa a gráficas apiladas verticalmente en móvil

**Portal Admin:**
- Desktop prioritario
- Móvil debe permitir generar invitaciones y aprobar solicitudes

**APK Android (Fase 2):**
- Reclutador: pipeline, chats, comisiones
- Coordinador: gestión básica de vacantes, solicitudes, aprobar candidatos contratados
- Construida con React Native + Expo reutilizando lógica de negocio del MVP web

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

### Matriz de permisos detallada — campos de `vacantes`

> Basada en el análisis real del proceso de TuChamba V1 (129 vacantes operadas a través de la agencia RH CONNECT). Confirma que una "agencia externa fuente de vacantes" (ej. RH CONNECT) **no es un concepto nuevo** — es una fila más en la tabla `agencias`, con su propio coordinador y sus propias vacantes vinculadas por `agencia_id`. No existe un campo separado de "fuente externa"; el modelo multi-agencia ya cubre este caso de uso desde el diseño original.

| Campo / Bloque | Candidato (público) | Reclutador | Coordinador | Admin |
|---|---|---|---|---|
| **Alta de vacante (crear)** | ❌ | ❌ | ✅ | ✅ |
| Título, descripción, requisitos, beneficios | 👁️ Ver | 👁️ Ver | ✏️ Editar | ✏️ Editar |
| Salario | 👁️ Ver (si `salario_visible=true`) | 👁️ Ver siempre | ✏️ Editar | ✏️ Editar |
| Empresa (nombre) | 👁️ Ver (si `empresa_visible=true`) | 👁️ Ver siempre | ✏️ Editar | ✏️ Editar |
| Rutas de transporte | 👁️ Ver (si existen) | 👁️ Ver | ✏️ Editar | ✏️ Editar |
| Letras chiquitas | 👁️ Ver | 👁️ Ver | ✏️ Editar | ✏️ Editar |
| Contacto RRHH (tel/nombre interno) | ❌ Nunca | 👁️ Ver | ✏️ Editar | ✏️ Editar |
| Comisión / garantía / promociones | ❌ Nunca | 👁️ Ver | ✏️ Editar | ✏️ Editar |
| Status (vigente/pausada/cerrada) | 👁️ Ve solo vigentes | 👁️ Ve todas las de su agencia | ✏️ Cambia | ✏️ Cambia |
| Pausar / dar de baja vacante | ❌ | ❌ | ✅ | ✅ |
| Eliminar vacante (borrado físico) | ❌ | ❌ | ❌ | ✅ Solo Admin |
| Impulsar / destacar (`destacada`) | 👁️ Ve el resultado | 👁️ Ve cuál está impulsada | ✏️ Activa/desactiva | ✏️ Activa/desactiva |
| Importar vacantes (Excel masivo) | ❌ | ❌ | ✅ | ✅ |
| FAQ de la vacante | ❌ Nunca | 👁️ Ve, 📝 Pregunta | ✏️ Responde | ✏️ Responde |

**Regla de oro:** el coordinador tiene control operativo total de SU agencia. El reclutador nunca edita una vacante — solo la trabaja. El candidato nunca ve nada comercial ni interno.

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
lada text DEFAULT '+52'      -- prefijo internacional: +52 México, +1 USA/CAN, +54 Argentina, etc.
telefono text
pais text DEFAULT 'México'   -- país de operación del reclutador
activo bool DEFAULT true
created_at timestamptz DEFAULT now()
```
> **Nota:** El campo `lada` es obligatorio para reclutadores internacionales.
> Confirmado por caso real: hay reclutadores argentinos (+54) operando
> en el sistema. El formato de teléfono mostrado en UI es `{lada} {telefono}`.
> Ej: "+54 11 1234 5678"

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
lada text DEFAULT '+52'      -- prefijo internacional para el teléfono
telefono text NOT NULL
email text
cv_url text
vetado boolean DEFAULT false        -- candidato vetado por comportamiento reincidente
motivo_veto text                    -- razón del veto
vetado_at timestamptz               -- cuándo fue vetado
vetado_por uuid                     -- coordinador o admin que lo vetó
created_at timestamptz DEFAULT now()
```
> **Lógica de veto:** Un candidato vetado no puede postularse a ninguna vacante de la agencia que lo vetó. Si intenta abrir el chat, el sistema le muestra un mensaje genérico sin exponer el motivo. El veto puede ser revertido por el coordinador o admin.

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

-- DESCARTE EN PIPELINE
motivo_descarte text                -- no_cumple_perfil/no_se_presento/rechazo_candidato/
                                    --   rechazo_empresa/no_contesta/otro
descartado_por text                 -- reclutador/empresa/candidato
motivo_descarte_detalle text        -- texto libre adicional

-- ENTREVISTA
fecha_entrevista timestamptz        -- cuándo es la entrevista agendada
lugar_entrevista text               -- dirección o link de videollamada

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

**CA-01.5 — Cero fricción: persistencia del chat sin registro:**
Dado que un candidato ya se postuló a una vacante en una visita anterior, cuando regresa a esa misma vacante en una visita nueva, entonces el sistema detecta automáticamente su sesión guardada en `localStorage` y le muestra directamente el historial del chat — sin pedirle nombre ni teléfono de nuevo.

Implementación:
- Al crear la postulación exitosamente, guardar en `localStorage`:
  `{ telefono, nombre, chatId, vacanteId }` bajo la clave `chat_sesion_{vacanteId}`
- Al abrir el modal de una vacante, revisar si existe `chat_sesion_{vacanteId}` en localStorage
- Si existe → saltar el formulario de nombre/teléfono y mostrar el chat directamente
- Si no existe → mostrar el formulario normal (primera vez)

Este patrón garantiza que un candidato nunca tenga que volver a llenar sus datos para una vacante en la que ya aplicó, mientras mantiene sesiones independientes por vacante (el candidato puede aplicar a múltiples vacantes simultáneamente con chats separados).

**CA-01.6 — Un chat por vacante, visibilidad cruzada para el reclutador:**
Cada postulación genera exactamente un chat independiente entre ese candidato y esa vacante específica. Un candidato puede tener múltiples chats activos simultáneamente (uno por cada vacante a la que aplicó).

En el portal del reclutador (Sprint 4), cuando un candidato aparece en múltiples vacantes de la misma agencia, el sistema muestra un indicador: *"Este candidato también aplicó a [otra vacante]"* — dándole contexto al reclutador sin violar la privacidad entre agencias.

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

**CA-07.6 — Alerta proactiva de cambios críticos en vacante (elimina la pregunta antes de que nazca):**

Basado en análisis real del grupo de WhatsApp de reclutadores HR CONNECT: las preguntas más frecuentes son "¿cuánto es la comisión?", "¿sigue vigente?", "¿cuántos días de garantía?" — todas respondibles con datos ya existentes en el sistema.

Dado que el coordinador modifica cualquiera de estos campos en una vacante:
- `status` (vigente → pausada → cerrada)
- `comision_base_mxn`
- `dias_garantia`
- `tiene_promocion` / `promocion_monto_mxn` / `promocion_fin`
- `tiene_ruta` / `zonas_ruta`

Cuando confirma el cambio, entonces el sistema genera automáticamente una alerta para TODOS los reclutadores de la agencia con un mensaje que especifica exactamente qué cambió y el valor nuevo. Ejemplos reales:

- *"⚠️ FEMSA actualizada: Comisión cambió de $2,500 → $3,000. Garantía: sigue en 30 días."*
- *"⚠️ Hyundai Glovis: Vacante PAUSADA. No envíes más candidatos hasta nuevo aviso."*
- *"⚠️ Indalum: Garantía modificada de 30 → 1 día. Bono especial activo hasta el viernes."*

**Esto reemplaza completamente el uso del grupo de WhatsApp para comunicar cambios operativos.**

**CA-07.7 — Notificación de bono/promoción nueva:**
Dado que el coordinador activa `tiene_promocion = true` en una vacante, cuando guarda los cambios, entonces el sistema envía una alerta destacada (distinta visualmente de las alertas normales) a todos los reclutadores de la agencia: *"🔥 ¡Bono especial en [empresa]! $[monto] por ingreso. Válido hasta [fecha]. ¡Dale con todo!"*

**CA-07.8 — Alerta de vacante sin citas disponibles:**
Dado que el coordinador marca una vacante como `status = 'pausada'` con nota "sin citas hasta nuevo aviso", cuando lo confirma, entonces los reclutadores que tenían candidatos en proceso para esa vacante reciben una alerta específica indicando que deben pausar el envío — no solo que la vacante cambió de status.

---

### HU-08: Importación masiva de vacantes vía Excel
**Como** coordinador, **quiero** subir un archivo Excel con múltiples vacantes a la vez, **para** no tener que dar de alta una por una cuando manejo decenas de vacantes simultáneas (patrón confirmado en TuChamba V1: 129 vacantes operadas en conjunto a través de una sola agencia).

**CA-08.1 (numeración independiente de §8 — Sistema de Invitación):** El sistema provee una plantilla `.xlsx` descargable con las columnas: `TÍTULO`, `EMPRESA`, `MOSTRAR EMPRESA`, `ESTADO`, `MUNICIPIO`, `ZONA`, `SALARIO`, `DESCRIPCIÓN`, `JORNADA`, `REQUISITOS`, `BENEFICIOS`, `CONTACTO`, `ESTATUS`, `DÍAS DE GARANTÍA`, `COMISIÓN`, `IMPULSAR`.

**CA-08.2:** Dado que el coordinador sube un archivo con la plantilla correcta, cuando el sistema lo procesa, entonces separa `REQUISITOS` y `BENEFICIOS` usando el delimitador `|` en arrays jsonb — el mismo formato que ya usa José en su proceso actual, sin requerir que cambie su forma de trabajar.

**CA-08.3:** El campo `SALARIO` en texto libre (ej. *"De $3,360 a $5,600 Semanales"*) se interpreta automáticamente para poblar `salario_min`, `salario_max` y `salario_tipo`. Si el formato no se puede interpretar con confianza, la fila se marca para revisión manual en el reporte post-importación, sin bloquear el resto de la carga.

**CA-08.4:** Toda vacante importada se vincula automáticamente a la `agencia_id` del coordinador que realiza la importación — nunca queda huérfana ni sin agencia asignada.

**CA-08.5:** Dado que el título y la empresa de una fila ya existen como vacante activa de esa misma agencia, cuando se importa de nuevo, entonces el sistema actualiza el registro existente en lugar de crear un duplicado.

**CA-08.6:** Al finalizar la importación, el coordinador recibe un reporte con: número de vacantes creadas, número de vacantes actualizadas, y el detalle de cualquier fila que falló (número de fila + motivo del error) — nunca un fallo silencioso.

---

### HU-09: Onboarding de reclutador nuevo
**Como** reclutador nuevo, **quiero** entender cómo funciona el sistema y qué vacantes puedo trabajar desde el primer día, **para** no depender de que el coordinador me explique todo por WhatsApp.

> *Origen: Irene Romero en el chat de HR CONNECT: "Tu dame una pauta, yo por primera vez me voy por tus indicaciones". Yuli: "más o menos si ya la ubique pero en si no sé cuál es la que se debe copiar y enviar". Maribel: "me llegan candidatos pero justo cuando brindo información ya no les agrada o no sé qué pasa".*

**CA-09.1:** Dado que un reclutador accede por primera vez a su portal (después de ser aprobado por el coordinador), cuando carga su dashboard, entonces ve una guía de inicio rápido con 4 pasos: (1) Cómo ver las vacantes activas, (2) Cómo compartir una vacante con candidatos, (3) Cómo registrar un candidato, (4) Cómo dar seguimiento y cobrar tu comisión.

**CA-09.2:** La ficha operativa de cada vacante incluye una sección **"Qué decirle al candidato"** — un texto pregenerado por el coordinador (o sugerido por IA) con la información mínima que el reclutador necesita comunicar: salario, horario, punto de reunión, qué llevar, con quién preguntar. Esto resuelve directamente el dolor de reclutadores que no saben qué información dar y pierden al candidato en el proceso.

**CA-09.3:** El sistema incluye un indicador de "Nivel de completitud" de la ficha de vacante — si faltan campos críticos (contacto RRHH, punto de reunión, documentos requeridos), el coordinador ve un badge de advertencia antes de publicarla.

---

### HU-10: Retroalimentación al candidato descartado
**Como** reclutador, **quiero** poder enviarle un mensaje de retroalimentación al candidato cuando lo descarto, **para** que entienda por qué no continuó en el proceso y no quede en incertidumbre.

> *Origen: Pain point documentado por HR CONNECT. Los candidatos quedan sin respuesta después de aplicar — eso genera desconfianza y candidatos que no regresan a la plataforma.*

**CA-10.1:** Dado que el reclutador mueve un candidato a "Descartado", cuando confirma el motivo en el modal, entonces el sistema le ofrece la opción de enviar un mensaje de retroalimentación al candidato — con plantillas predefinidas según el motivo o texto libre.

**CA-10.2:** Plantillas predefinidas de retroalimentación:
- *Renuncia:* "Gracias por tu interés. Si en el futuro cambias de opinión, con gusto podemos reactivar tu postulación."
- *No cumple perfil:* "Revisamos tu perfil y en este momento no es el match ideal para esta posición. Te invitamos a revisar otras vacantes en TuChamba."
- *No se presentó:* "Notamos que no pudiste asistir a tu cita. Si deseas reagendar, escríbenos."
- *Empresa no lo aceptó:* "La empresa tomó otra decisión en esta ocasión. Seguimos trabajando para encontrarte una oportunidad."

**CA-10.3:** El mensaje de retroalimentación se envía como mensaje de sistema en el chat del candidato (tipo `es_sistema = true`) — no aparece como mensaje personal del reclutador, sino como notificación oficial de la plataforma. Esto protege al reclutador de confrontaciones directas.

**CA-10.4:** El candidato descartado puede seguir viendo su historial de chat pero no puede enviar nuevos mensajes en esa conversación — el chat queda en modo "solo lectura" con un mensaje que dice "Esta postulación ha sido cerrada. Puedes aplicar a otras vacantes en TuChamba."

---

### HU-11: Soporte de LADA internacional para candidatos y reclutadores
**Como** candidato o reclutador desde fuera de México, **quiero** poder registrar mi número telefónico con el prefijo de mi país, **para** que el sistema pueda contactarme correctamente.

> *Origen: Caso real confirmado — hay reclutadores argentinos (+54) operando
> activamente en el sistema junto con reclutadores mexicanos (+52).*

**CA-11.1:** El modal de postulación del candidato incluye un selector de LADA antes del campo de teléfono. Opciones predefinidas: +52 (México 🇲🇽), +1 (USA/Canadá 🇺🇸), +54 (Argentina 🇦🇷), +34 (España 🇪🇸). El candidato puede escribir cualquier otro prefijo manualmente.

**CA-11.2:** El formulario de alta de reclutador (portal coordinador y admin) incluye el mismo selector de LADA. El campo `lada` se guarda en la tabla `reclutadores` con el valor seleccionado.

**CA-11.3:** En toda la UI donde se muestra un número de teléfono de reclutador o candidato, se muestra el formato completo: `{lada} {telefono}`. Ejemplo: "+54 11 1234 5678".

**CA-11.4:** El campo `telefono` sigue siendo la clave única de búsqueda para candidatos — si el mismo número existe con diferente LADA, se considera candidato diferente. Esto previene duplicados entre candidatos internacionales y nacionales.

---

### HU-12: Gestión de reclutadores multiplataforma (PC y Android)
**Como** coordinador, **quiero** poder gestionar mis reclutadores tanto desde mi computadora como desde mi celular, **para** dar de alta, editar o desactivar reclutadores sin depender de estar en la oficina.

**CA-12.1:** El portal del coordinador es completamente responsivo — todas las funciones de gestión de reclutadores (alta, edición, activar/desactivar) funcionan correctamente en pantallas de 360px (móvil) hasta 1920px (desktop).

**CA-12.2:** El alta de un reclutador desde el portal coordinador requiere: nombre, código único (el sistema sugiere uno automáticamente basado en el nombre), LADA, teléfono, email (opcional) y agencia. El coordinador puede editarlo después.

**CA-12.3:** Un reclutador desactivado (`activo = false`) no puede iniciar sesión en su portal, pero su historial de postulaciones, chats y comisiones se conserva íntegro — nunca se borra, solo se suspende el acceso.

**CA-12.4:** El coordinador puede ver en su panel la lista de reclutadores con: nombre, código, país/LADA, vacantes activas que trabajan, candidatos en proceso, y fecha de último acceso al sistema.

---

### HU-13: Descarte mejorado con motivo y opciones
**Como** reclutador, **quiero** poder descartar a un candidato con un motivo específico y decidir si puede postularse a otras vacantes, **para** que el sistema tenga trazabilidad real del proceso.

**CA-13.1:** Al mover un candidato a "Descartado", el modal muestra:
- Razón del descarte (opciones): No cumple el perfil / No se presentó a la entrevista / El candidato declinó / La empresa no lo aceptó / No contesta / Otro (campo libre)
- ¿Descartar para?: Solo esta vacante (puede postularse a otras) / Todas las vacantes de la agencia
- Mensaje de retroalimentación al candidato (opcional, usa plantillas de HU-10)

**CA-13.2:** Al descartar, el sistema pregunta: *"¿Quieres buscarle otra vacante a [nombre]?"* — si el reclutador dice sí, muestra las vacantes activas de la agencia donde el candidato podría encajar.

**CA-13.3:** Los candidatos descartados aparecen en una columna separada "Descartados" al final del Kanban — nunca se borran del historial.

---

### HU-14: Revivir candidato descartado
**Como** reclutador, **quiero** poder reactivar a un candidato previamente descartado para una nueva vacante, **para** darle una segunda oportunidad sin perder el historial anterior.

**CA-14.1:** Dado que un candidato descartado regresa a postularse a una vacante, cuando abre el chat, entonces el sistema crea una nueva postulación independiente sin borrar la anterior. El historial de la postulación anterior queda visible para el reclutador como referencia.

**CA-14.2:** El reclutador ve en la card del candidato reactivado un badge: *"⚠️ Candidato con historial previo"* — con link para ver sus postulaciones anteriores.

**CA-14.3 — Veto de candidato:**
Si un candidato es reincidente en conductas problemáticas (no se presenta repetidamente, comportamiento inapropiado, etc.), el coordinador puede vetarlo. Un candidato vetado:
- No puede abrir chats en ninguna vacante de esa agencia
- Ve un mensaje genérico: *"En este momento no podemos procesar tu postulación"*
- El veto puede ser revertido en cualquier momento por el coordinador o admin
- El motivo del veto es interno — nunca se muestra al candidato

---

### HU-15: Seguimiento pre-entrevista con contacto directo
**Como** reclutador, **quiero** poder contactar rápidamente a un candidato citado para confirmar su asistencia, **para** reducir las ausencias a entrevistas sin depender de recordarlo manualmente.

> *Origen: Dolor real documentado en grupo de WhatsApp de HR CONNECT — Roxana García envía mensajes de seguimiento manualmente a todos los candidatos citados antes de cada jornada de entrevistas.*

**CA-15.1:** Cuando un candidato está en etapa "Entrevista" y tiene `fecha_entrevista` registrada, su card en el Kanban muestra:
- La fecha y hora de la entrevista
- Un botón **"📱 Contactar por WhatsApp"** que genera el link: `https://wa.me/52{telefono}?text=Hola {nombre}, te recordamos que tienes entrevista para {vacante} el {fecha} a las {hora} en {lugar}. ¿Confirmas tu asistencia?`
- El reclutador solo toca el botón, WhatsApp se abre con el mensaje pre-escrito — no hay integración con Meta, no hay permisos especiales

**CA-15.2:** El reclutador puede registrar la `fecha_entrevista` y `lugar_entrevista` directamente desde la card del candidato en el Kanban, sin tener que abrir un formulario separado.

**CA-15.3 — Alertas automáticas de seguimiento:**
- **24 horas antes de la entrevista** → alerta al reclutador: *"Mañana tiene entrevista [nombre] para [vacante]. ¿Ya confirmaste su asistencia?"*
- **Al día siguiente si el candidato no avanzó de etapa** → alerta: *"¿Se presentó [nombre] a su entrevista? Actualiza su estado en el pipeline."*

**CA-15.4:** El sistema detecta automáticamente si un candidato que tenía entrevista no avanzó de etapa "Entrevista" en 48 horas — genera la alerta CA-15.3 automáticamente sin que el reclutador tenga que recordarlo.

---
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

**Día de corte configurable por agencia:**
- El coordinador define el día de corte y día de pago para su agencia
- Por defecto: corte jueves (dia_corte=4), pago viernes (dia_pago=5)
- Campos ya existentes en tabla `agencias`: `dia_corte` (int, 1=Lun...7=Dom), `dia_pago` (int)
- El sistema calcula automáticamente las fechas de corte basándose en estos campos

**Reglas del corte:**
- Solo entran candidatos con `garantia_cumplida = true` en esa semana
- El coordinador marca el corte como pagado manualmente después de transferir
- El campo `semana_corte` en `postulaciones` usa formato ISO (ej. "2026-W22")

**Vista del reclutador — Comisión estimada:**
- El reclutador puede seleccionar "semana en curso" o semanas anteriores
- La semana en curso se calcula considerando el `dia_corte` de su agencia
- Se muestra: candidatos en garantía activa, candidatos efectivos pendientes de pago, y total estimado a cobrar en el próximo corte
- Solo se suman candidatos con `garantia_cumplida = true` y `pagado = false`

**Vista del coordinador — Panel de corte:**
- Resumen semanal por reclutador: colocados, efectivos, no efectivos, total a pagar
- Botón "Marcar semana como pagado" actualiza `postulaciones.pagado = true` para todos los registros de esa semana
- Genera resumen descargable por reclutador para comprobante de pago

**Comisiones variables por vacante/empresa:**
- Cada vacante tiene su propia `comision_base_mxn` definida por el coordinador
- Las promociones (`tiene_promocion`, `promocion_monto_mxn`, `promocion_fin`) permiten subir la comisión temporalmente
- El sistema aplica automáticamente la comisión correcta al momento de marcar "Contratado"
- El coordinador puede modificar comisiones en cualquier momento — los cambios aplican solo a nuevas colocaciones, nunca retroactivamente

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
