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

### 4. Ligero — cada byte cuenta (agregado 2026-08-09, ver marca de corte abajo)

> *Origen: José — la mayoría de los candidatos reales (operadores, ayudantes generales) navegan desde datos móviles limitados, no wifi de oficina. Cada consulta o archivo cargado de más antes de que lo pidan explícitamente les cuesta dinero real, no solo tiempo.*

- **Nunca cargar el contenido de un archivo** (PDF, imagen) hasta que el usuario pida verlo explícitamente — solo se transmite su referencia (nombre, link), nunca el archivo en sí, en ninguna lista o vista general.
- **Las consultas a listas deben paginar en la base de datos**, no solo en la vista — nunca traer de Supabase más registros de los que se van a mostrar en pantalla en ese momento.
- **No incluir relaciones "pesadas" o poco usadas en queries de listado general** — solo en el detalle específico que el usuario ya abrió. Ejemplo: los documentos de rutas de una empresa no deben venir en el `select()` del listado completo de vacantes, solo en el de la ficha de una vacante individual.
- Imágenes con lazy loading y tamaño optimizado antes de subir.
- Advertir o limitar el tamaño de archivos que se suben, especialmente los que terminan visibles en el portal público sin sesión.

> **⚠️ MARCA DE CORTE — Auditoría pendiente de "ligereza":** este principio se agregó el **2026-08-09**, después de construir `5.5` Secciones 4 y 5 (incluyendo `documentos_negocio`). Todo lo construido **antes** de esta fecha no fue diseñado con esta disciplina en mente y puede tener oportunidades de mejora sin auditar — en particular, se identificaron 2 casos concretos ya conocidos: (1) `VacantesPortal.tsx` pagina solo en la vista, no en la consulta a Supabase — trae todas las vacantes vigentes de golpe; (2) el `select()` del listado general de vacantes incluye `documentos_negocio` completo, cuando debería limitarse solo a la vista de detalle. Todo lo construido **después** de esta fecha debe seguir el principio desde el diseño, sin necesitar corrección posterior. Se hará una auditoría completa de "ligereza" al final del proyecto (candidato a agregarse como tarea explícita en Sprint 7, QA) revisando todo el código anterior a esta marca.

### Regla de decisión
Cuando haya que elegir entre dos implementaciones, siempre gana la que sea más intuitiva, genere menos fricción, comunique más confianza, y sea más ligera para el usuario — aunque sea técnicamente más compleja de construir.

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
status text DEFAULT 'pendiente_aprobacion'
invitacion_id uuid
aprobado_por uuid
aprobado_at timestamptz
dia_corte integer DEFAULT 4          -- 1=Lunes...7=Domingo — SOLO recordatorio
                                      -- visual desde 5.26 (2026-08-20), ya no
                                      -- calcula ningún periodo automáticamente
dia_pago integer DEFAULT 5           -- ídem, solo recordatorio visual
hora_corte time DEFAULT '12:00:00'   -- nueva (5.26) — también solo informativa,
                                      -- fecha_garantia_fin no tiene hora, no hay
                                      -- forma de comparar contra una hora exacta
ultimo_corte_at timestamptz          -- nueva (5.26) — el ANCLA real del corte
                                      -- manual: se actualiza solo al generar un
                                      -- corte con el botón "Generar Corte"
created_at timestamptz DEFAULT now()
```

### coordinadores
```sql
id uuid PK
agencia_id uuid FK → agencias.id
nombre text NOT NULL
email text UNIQUE NOT NULL
telefono text
status text                          -- corregido 2026-08-18: NO es 'activo bool' como decía antes, es texto (ej. 'activo')
auth_user_id uuid                    -- nueva (2026-08-22): id de la cuenta de
                                      -- Supabase Auth de este coordinador, para
                                      -- poder borrarla limpiamente (rechazar,
                                      -- eliminar futuro) sin buscar por email
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
dias_descanso jsonb DEFAULT '[0]'   -- días de la semana que NO cuentan para
                                     -- el cálculo de días de garantía, por
                                     -- empresa (0=Domingo...6=Sábado, formato
                                     -- JS Date.getDay()). Default: solo domingo.
                                     -- Configurable por el coordinador, aplica
                                     -- a TODAS las vacantes de esa empresa
                                     -- (ver CA-02.8). No cubre descansos
                                     -- rolados post-inducción — ver limitación
                                     -- documentada en CA-02.8.
dias_entrevista jsonb DEFAULT '[]'  -- nueva (5.25, 2026-08-20) — días en que la
                                     -- empresa RECIBE candidatos a entrevista.
                                     -- Distinto de dias_descanso (ese afecta
                                     -- garantía, este bloquea agendar). Mismo
                                     -- formato (array de días 0-6), pero campo
                                     -- separado. Editable en VacanteModal
                                     -- Sección 8, no Sección 1 (deliberado).
                                     -- Array vacío = sin restricción configurada.
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
etapas_personalizadas jsonb DEFAULT '["Aplicado","Contactado","Entrevista","Inducción","Contratado"]'  -- renombrado de "Oferta" el 2026-08-06, ver CA-02.8
                                     -- decisión 2026-08-09: NO se expone como editable en
                                     -- VacanteModal — José confirmó que el proceso del
                                     -- RECLUTADOR (filtrar y mandar a entrevista) es igual
                                     -- para todas las vacantes/empresas; lo que varía entre
                                     -- empresas es su propio proceso de CONTRATACIÓN interno,
                                     -- ya cubierto por otros campos (examen médico, estudio
                                     -- socioeconómico, documentos requeridos, contacto RRHH).
                                     -- El campo sigue existiendo en el esquema por si algún
                                     -- caso real futuro lo justifica, pero el flujo de 5
                                     -- etapas es fijo para todo el sistema por ahora.
requiere_examen_medico bool DEFAULT false
requiere_estudio_socioeconomico bool DEFAULT false
documentos_requeridos jsonb DEFAULT '[]'

-- COMERCIAL
dias_garantia int NOT NULL
dias_induccion int DEFAULT 0           -- días de inducción de la empresa (0 = sin inducción formal)
induccion_dentro_garantia bool DEFAULT true  -- true: garantía empieza desde día 1 de inducción
                                             -- false: garantía empieza DESPUÉS de los días de inducción
                                             -- Ejemplo false: 5 días inducción + 30 días garantía = 35 días totales
                                             -- Caso especial: candidato queda el mismo día de entrevista →
                                             --   fecha_contratacion = fecha_entrevista = día 1 de garantía
comision_base_mxn numeric NOT NULL
tiene_promocion bool DEFAULT false
promocion_descripcion text
promocion_monto_mxn numeric
promocion_fin date

-- SISTEMA
status text DEFAULT 'vigente'       -- vigente/pausada/cerrada
empresa_visible bool DEFAULT true
destacada bool DEFAULT false
cupo_requerido int DEFAULT 1        -- personas que necesita la empresa — "por
                                    -- rondas" desde 6.8b (2026-08-19): NO es un
                                    -- total acumulado histórico, cada reactivación
                                    -- reinicia el conteo a 0 (ver cupo_desde)
cupo_cubierto int DEFAULT 0         -- ⚠️ CAMPO MUERTO desde 6.8b — nunca se
                                    -- actualiza, el cupo ocupado se calcula
                                    -- SIEMPRE en vivo (comision_aplicable=true,
                                    -- filtrado por cupo_desde), nunca leyendo
                                    -- esta columna. Se deja en el esquema por
                                    -- compatibilidad, no usar en código nuevo.
cupo_desde timestamptz              -- nueva (6.8b) — el ANCLA de la ronda actual
                                    -- de cupo. Se resetea a now() solo cuando la
                                    -- vacante pasa de "no vigente" a "vigente"
                                    -- (reactivación). El conteo de ocupados
                                    -- filtra fecha_contratacion >= cupo_desde.
preguntas_precalificacion jsonb DEFAULT '[]'  -- nueva (HU-17/6.8) — hasta 5
                                    -- preguntas de pre-calificación del portal
                                    -- candidato. Cada una: {id, pregunta, tipo
                                    -- ('si_no'|'opcion_multiple'|'texto_libre'),
                                    -- opciones?, respuesta_correcta, filtra?}.
                                    -- filtra=false (o respuesta_correcta vacía en
                                    -- opcion_multiple) = pregunta informativa,
                                    -- nunca bloquea al candidato.
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
fecha_contratacion date             -- desde CA-02.8 (2026-08-06): representa el
                                     -- INICIO DE INDUCCIÓN, capturado al mover a
                                     -- etapa "Inducción" — ya no el día de firma
fecha_firma_contrato date           -- informativo, capturado al mover a "Contratado"
                                     -- (no dispara ningún cálculo, ver CA-02.2)
fecha_garantia_fin date             -- calculado: fecha_contratacion + dias_garantia
                                     -- días HÁBILES según negocios.dias_descanso
                                     -- de la empresa (ver CA-02.8), no días corridos
garantia_cumplida bool DEFAULT false  -- ⚠️ CAMPO MUERTO — nunca se actualiza
                                     -- automáticamente en ningún lugar del sistema.
                                     -- Todo cálculo real usa fecha_garantia_fin
                                     -- comparado en vivo. No usar en código nuevo.
motivo_no_efectivo text             -- renuncia/despido_empresa/despido_causa/otro
comision_aplicable bool DEFAULT false

-- 5.24 (asistencia a entrevista)
asistio_entrevista bool             -- null=sin confirmar, true/false=confirmado.
                                     -- NUNCA mueve de etapa — es dato de
                                     -- seguimiento, distinto de "Descartar"
motivo_no_asistencia text           -- razón opcional cuando asistio_entrevista=false

-- HU-17 (pre-calificación del candidato)
precalificado bool DEFAULT false    -- true si pasó el filtro de preguntas al postularse
respuestas_precalificacion jsonb DEFAULT '{}'  -- respuestas a preguntas informativas
                                     -- (texto libre, opción múltiple sin filtro)

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
semana_corte text                   -- ⚠️ CAMPO MUERTO desde 5.26 (2026-08-20) —
                                     -- el corte manual ya no agrupa por semana
                                     -- ISO, usa corte_id. No usar en código nuevo.
pagado bool DEFAULT false
fecha_pago date
corte_id uuid FK → cortes_semana.id -- nueva (5.26) — liga cada postulación al
                                     -- corte específico donde se pagó, permite
                                     -- reconstruir el detalle de cualquier corte
                                     -- histórico después

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
tipo text                           -- cv/identificacion/comprobante_domicilio/
                                     -- comprobante_estudios/rfc/nss/curp/otro
archivo_url text NOT NULL           -- Supabase Storage
created_at timestamptz DEFAULT now()
```

### documentos_negocio (PDFs de rutas de transporte, compartidos por empresa — ver CA-20.3)
```sql
id uuid PK
negocio_id uuid FK → negocios.id
nombre_archivo text NOT NULL
archivo_url text NOT NULL           -- Supabase Storage, bucket PÚBLICO (documentos-negocio)
created_at timestamptz DEFAULT now()
```
> A diferencia de `documentos_candidato` (bucket privado, links firmados), este bucket
> es público — los PDFs de rutas no contienen información sensible y deben ser
> visibles sin sesión (candidato en el portal público). Un documento se sube una
> vez por empresa y aparece automáticamente en todas sus vacantes.

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
> Solo guarda FAQs **ya contestados y confirmados** (`respuesta` es `NOT NULL`)
> — nunca preguntas pendientes. Es el Nivel 2 de la cascada del agente FAQ
> (ver HU-03). Se llena solo cuando el coordinador activa el toggle "Agregar
> al FAQ" al responder una pregunta escalada en `faq_escalaciones`.

### faq_escalaciones (nueva, 4.14/4.15/6.11, 2026-08-20)
```sql
id uuid PK
vacante_id uuid FK → vacantes.id
agencia_id uuid FK → agencias.id
pregunta text NOT NULL
preguntado_por uuid FK → reclutadores.id
respuesta text                      -- null = pendiente sin contestar
respondido_por uuid FK → coordinadores.id
respondido_at timestamptz
guardado_en_faq bool DEFAULT false  -- si se activó el toggle al contestar
created_at timestamptz DEFAULT now()
```
> Es la "cola" de preguntas del Nivel 3 (escalación al coordinador) — distinta
> de `faqs_vacante`, que no soporta el estado "pendiente" (su `respuesta` es
> `NOT NULL`). Preguntas pendientes se borran automáticamente cuando la
> vacante deja de estar vigente (se pausa/cierra) — ya no tiene sentido
> contestarlas. Las contestadas se borran solo manualmente (botón individual
> o "Borrar todo", tanto reclutador como coordinador).

### invitaciones (alta controlada de agencias — ver §8)
```sql
id uuid PK
token text UNIQUE NOT NULL
tipo text DEFAULT 'nueva_agencia'
creado_por uuid                     -- admin que generó el link
usado bool DEFAULT false
expira_at timestamptz NOT NULL
agencia_id uuid                     -- se llena cuando se usa
telefono_esperado text              -- nueva (2026-08-22), opcional — si se
                                     -- especifica al generar el link, el
                                     -- registro público solo se completa si
                                     -- el teléfono capturado coincide exacto
created_at timestamptz DEFAULT now()
```

### alertas
```sql
id uuid PK
tipo text NOT NULL
-- tipos: garantia_venciendo/candidato_sin_movimiento/
--        entrevista_vencida/vacante_sin_candidatos/
--        mensaje_nuevo/pregunta_sin_responder/
--        vacante_actualizada/candidato_auto_vetado/confirmar_asistencia/
--        promocion_nueva/cupo_cubierto/pregunta_faq
-- (corregido 2026-08-16: el frontend real usa 'vacante_actualizada', no
--  'vacante_status_cambio' como decía esta lista antes — ver ICONOS en
--  app/reclutador/alertas/page.tsx. 'promocion_nueva' es de la tarea 5.14.
--  'cupo_cubierto' (6.8b) y 'pregunta_faq' (6.11) agregados 2026-08-20 —
--  ambas van a destinatario_rol='coordinador', no reclutador.)
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
semana text NOT NULL                -- desde 5.26 (2026-08-20): texto libre con el
                                     -- rango de fechas (ej. "20 ago 2026 — 27 ago
                                     -- 2026"), YA NO formato ISO fijo — el corte es
                                     -- manual, el rango depende de cuándo se generó.
                                     -- Registros de antes de 5.26 conservan su
                                     -- formato viejo (ej. "2026-W34"), sin migrar.
fecha_corte date NOT NULL           -- fecha real en que se generó ese corte
                                     -- (ya NO siempre jueves — desde 5.26 es el
                                     -- día en que el coordinador dio clic al botón)
fecha_pago date NOT NULL            -- estimada, calculada según dia_pago
                                     -- configurado (ya NO siempre viernes)
total_mxn numeric NOT NULL
pagado bool DEFAULT false
generado_por uuid FK → coordinadores.id
periodo_inicio timestamptz          -- nueva (5.26) — timestamp exacto (con hora)
                                     -- de inicio del periodo cubierto por este
                                     -- corte. Null en registros de antes de 5.26.
periodo_fin timestamptz             -- nueva (5.26) — timestamp exacto de fin
                                     -- (el momento en que se generó el corte)
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

### strikes_inasistencia (huella permanente para el auto-veto — ver HU-19)
```sql
id uuid PK
telefono text NOT NULL
agencia_id uuid FK → agencias.id
contador int DEFAULT 1
primera_fecha timestamptz DEFAULT now()
ultima_fecha timestamptz DEFAULT now()
vetado_desde timestamptz              -- se llena cuando contador llega a 3
UNIQUE(telefono, agencia_id)
```
> Tabla intencionalmente independiente del ciclo de vida de `candidatos`. Se
> actualiza en el momento exacto de cada descarte con `motivo_descarte =
> 'no_se_presento'`, por lo que el conteo sobrevive aunque el expediente
> completo del candidato (chats, mensajes, postulaciones) se limpie a los 15
> días por la política de retención (HU-19).

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

**CA-02.2 (corregida 2026-08-06 — ver CA-02.8 para el detalle completo):** Dado que el reclutador mueve un candidato a la etapa "Contratado", cuando confirma la acción en el modal, entonces el sistema registra `fecha_firma_contrato = hoy` como referencia informativa — **pero la garantía y la comisión ya quedaron fijadas antes**, al momento de mover al candidato a "Inducción" (ver CA-02.8). "Contratado" es solo el cierre administrativo del ciclo, no dispara ningún cálculo nuevo.

**CA-02.3:** Dado que una postulación lleva más de 48 horas en la misma etapa sin actividad, entonces el sistema genera una alerta visible en el panel del reclutador: *"[Nombre candidato] lleva X días sin movimiento en [vacante]."*

**CA-02.8 — Etapa "Inducción" (antes "Oferta") dispara garantía y comisión, con días de descanso configurables por empresa:**

> *Origen: José detectó que el sistema calculaba `fecha_garantia_fin` sumando días corridos sin respetar descansos, y que el disparo ocurría en "Contratado" (día de firma de contrato) en vez de en el día real de inicio de inducción — ambos desalineados con cómo opera HR CONNECT en la práctica. Confirmado con Roxana García: sí ocurre que un candidato inicia inducción jueves/viernes y el descanso (domingo) mueve la fecha real de cumplimiento de garantía.*

La etapa que antes se llamaba **"Oferta"** se renombra a **"Inducción"** en `etapas_personalizadas`. Al mover un candidato a esta etapa:
- El reclutador captura la **fecha de inicio de inducción** en un selector de fecha — sin restricción de fechas pasadas (el candidato puede avisar tarde).
- En ese momento, y no antes ni después, el sistema:
  - Guarda `fecha_contratacion = fecha_inicio_induccion` (se reutiliza este campo existente; conceptualmente ahora representa "inicio de garantía", no "firma de contrato")
  - Calcula `fecha_garantia_fin` contando `vacantes.dias_garantia` días **hábiles según la configuración de descanso de la empresa** (`negocios.dias_descanso`), no días corridos — saltándose los días marcados como descanso en el conteo.
  - Marca `comision_aplicable = true` y asigna `comision_aplicada_mxn` (revisando promoción activa, igual que antes)

**Configuración de días de descanso (`negocios.dias_descanso`):** el coordinador la define **una sola vez por empresa** (no por vacante) desde el alta o edición del negocio cliente — aplica automáticamente a todas las vacantes activas de esa empresa. Por defecto viene configurado solo domingo, ya que José confirmó que ese es el patrón más común durante el periodo de inducción/capacitación, pero el coordinador puede ajustarlo si una empresa específica opera distinto.

**Limitación conocida, documentada a propósito (no se resuelve en este alcance):** este mecanismo cubre un patrón de descanso semanal fijo (ej. "siempre domingo") para el cálculo de garantía. **No** cubre descansos rolados por empleado que suelen aplicar *después* de que termina la inducción (turnos rotativos individuales) — eso requeriría un calendario por candidato, no por empresa, y queda fuera de este ajuste. Si en el futuro se necesita esa precisión, sería una historia de usuario nueva.

**CA-02.9 — Flujo secuencial obligatorio, sin saltos de etapa:**

> *Origen: José, 2026-08-06 — evitar problemas de proceso si el reclutador se salta pasos.*

El pipeline solo permite avanzar en orden estricto: `Aplicado → Contactado → Entrevista → Inducción → Contratado`. El menú "Mover" únicamente ofrece la siguiente etapa inmediata (no todas las etapas futuras). La única excepción es **"Descartado"**, disponible como salida desde cualquier etapa activa (Aplicado, Contactado, Entrevista, Inducción) en cualquier momento. Desde "Entrevista", el reclutador puede reagendar la fecha las veces que sea necesario (ya existente) sin que eso cuente como saltarse el flujo — sigue siendo la misma etapa hasta que el candidato confirma que se presenta a inducción.

**CA-02.10 — "No efectivo": candidato no concluye inducción:**

> *Origen: José, 2026-08-06 — reutiliza el flujo de Descartar existente en vez de crear un mecanismo nuevo, con una fecha retroactiva para que el sistema calcule la falta correctamente.*

Disponible **únicamente desde la etapa "Inducción"** (no desde "Contratado" — una vez firmado el contrato, ese caso se maneja distinto, fuera de este alcance). Se dispara desde el mismo modal de "Descartar" ya existente, con un motivo nuevo: **`no_concluyo_induccion`**.

A diferencia de los demás motivos de descarte (donde la fecha siempre es "hoy"), aquí el campo de fecha es **editable** — el reclutador ingresa el último día real que el candidato se presentó, para que el sistema cuente la falta a partir del día siguiente y pueda determinar si alcanzó a completar los días de garantía antes de desertar.

Al confirmar:
- `etapa_actual = 'Descartado'`, `motivo_descarte = 'no_concluyo_induccion'`
- `comision_aplicable = false`, `motivo_no_efectivo = 'renuncia'` u otro valor según lo que indique el reclutador (reutiliza el campo ya existente, CA-04.4 ya cubre que esto lo excluye del corte semanal)
- Se envía una notificación breve al candidato (por el chat interno, igual que la retroalimentación de CA-10.3) avisando el cierre — sin necesidad de reactivar contacto por WhatsApp aparte, ya que el chat interno ya cumple esa función.
- **No cuenta automáticamente para el auto-veto de 3 strikes (CA-14.4).** Son señales de comportamiento distintas: `no_se_presento` (nunca llegó a la entrevista) vs. `no_concluyo_induccion` (sí llegó, pero no terminó). Quedan separadas a propósito; si más adelante se decide que ambas deban sumar al mismo contador, será una decisión explícita futura, no automática.

**Presentación visual:** la card de un candidato marcado "No efectivo" se tiñe de rojo tenue y se ordena al final de la columna "Descartado" — visible unos días antes de pasar al archivo (ver CA-19.3 actualizada).

**Reactivación manual (control exclusivo del coordinador):** si el candidato se pone en contacto de nuevo pidiendo otra oportunidad, el coordinador (nunca automático) puede usar un botón **"🔄 Reactivar candidato"** desde su panel de candidatos vetados/no-efectivos. Esto limpia `candidatos.vetado`, `motivo_veto`, y reinicia el contador en `strikes_inasistencia` — dejando registro en el historial de quién autorizó la reactivación y cuándo, para trazabilidad. Aplica tanto a vetados por CA-14.4 como a candidatos marcados "No efectivo" que el coordinador decide darles otra oportunidad.

**CA-02.11 — Badge visual de inactividad prolongada (72h):**

> *Origen: José, 2026-08-06. Distinto de la alerta de 48h (CA-02.3, que es una notificación aparte para seguimiento normal) — este es un badge visual directo en la card, para candidatos "atorados" en cualquier etapa activa sin que el reclutador les dé ningún destino (ni avance, ni Descartado).*

Una postulación en cualquier etapa activa (Aplicado, Contactado, Entrevista, Inducción) que lleve **más de 72 horas** sin ningún cambio (`updated_at`) muestra un badge **"🚨 Sin actividad"** directamente en su card del Kanban, junto al nombre del candidato — visible sin necesidad de abrir alertas ni notificaciones, para empujar al reclutador a tomar una decisión (avanzarlo o descartarlo). No dispara ningún archivo automático — la resolución sigue siendo manual, vía el flujo normal de mover o descartar.

---

**CA-02.4:** El reclutador puede mover cualquier tarjeta a "Descartado" desde cualquier etapa, pero el sistema le pide confirmar y registrar el motivo.

**CA-02.5 — Dashboard con métricas reales:**
El dashboard del reclutador muestra 4 métricas en tiempo real:
- **Candidatos activos** — postulaciones no descartadas ni contratadas (total acumulado)
- **Colocados este mes** — contratados en el mes natural en curso
- **Comisión estimada** — suma de `comision_aplicada_mxn` de candidatos contratados con garantía activa (`garantia_cumplida = false`)
- **Chats sin leer** — chats con `leido_reclutador = false`

**CA-02.6 — Filtro de fechas en métricas:**
El reclutador puede filtrar las métricas por período:
- Esta semana (lunes a domingo)
- Este mes (mes natural)
- Rango personalizado (date picker desde/hasta)

Al cambiar el filtro, todas las métricas se recalculan automáticamente sin recargar la página. Esto permite al reclutador hacer sus propias cuentas y revisar su historial de rendimiento.

**CA-02.7 — Subida de documentos del candidato (`documentos_candidato`):**
El reclutador puede subir documentos del candidato desde un botón **"📎 Documentos"** en la card del Kanban — no el candidato, ya que en la práctica actual (HR CONNECT) el candidato manda su CV por WhatsApp y el reclutador lo tiene a la mano para subirlo. Esto evita exponer un formulario de subida de archivos sin autenticación en el chat público.

Tipos de documento soportados: `cv`, `identificacion`, `comprobante_domicilio`, `comprobante_estudios`, `rfc`, `nss`, `curp`, `otro`.

Al hacer clic, se abre un modal con:
- La lista de documentos ya subidos para ese candidato (nombre del tipo, fecha, link para ver/descargar, opción de eliminar)
- Un selector de tipo + botón para subir un archivo nuevo (sin restricción de formato ni límite de un solo documento por tipo — versionado natural)

Cada archivo se guarda en Supabase Storage y genera una fila en `documentos_candidato` vinculada al `candidato_id` y `postulacion_id` de subida — pero es **visible desde cualquier postulación de ese mismo candidato** (el filtro es por `candidato_id`, no por vacante específica), ya que el documento pertenece a la persona, no a un proceso en particular.

**Eliminación:** cualquier reclutador con acceso a la card puede eliminar un documento (borra tanto el archivo en Storage como el registro en base de datos). No se distingue quién lo subió — mismo nivel de control que ya tienen sobre etapa, score, etc. de sus candidatos. "Reemplazar" un documento es simplemente eliminar el anterior y subir uno nuevo del mismo tipo.

**Manejo de estado en el modal (corrección 2026-08-06):** al cerrar el modal (botón X o tecla Escape), cualquier archivo seleccionado pero no subido se descarta — el modal siempre abre limpio, sin arrastrar selecciones de aperturas anteriores.

---

### HU-03: Reclutador consulta la ficha operativa de una vacante
**Como** reclutador, **quiero** ver todos los detalles operativos de una vacante en un solo lugar, **para** no tener que preguntarle al coordinador información básica.

**CA-03.1:** La ficha operativa visible para el reclutador incluye: contacto RRHH, teléfono, mejor horario de contacto, etapas del proceso, documentos requeridos, rutas disponibles, días de garantía, comisión base y promoción activa (si existe), y todas las preguntas del FAQ respondidas. El salario real y el turno se muestran siempre al reclutador — `salario_visible` solo controla si el salario aparece en el portal público de candidatos, nunca oculta esa información al reclutador (corregido 2026-08-17, bug detectado al probar 5.20).

**CA-03.7 — Listado de vacantes para consulta libre (agregado 2026-08-17, detectado por José durante prueba de 5.15):** El reclutador tiene una pantalla `/reclutador/vacantes` con el listado de todas las vacantes de su agencia (vigentes y pausadas, con badge de status), independiente de si ya tiene un candidato postulado ahí o no. Cada vacante de la lista lleva a su ficha operativa completa (`/reclutador/detalle/[id]`, ver CA-03.1). Antes de esto, la única forma de llegar a la ficha operativa era desde una tarjeta del Kanban — es decir, solo después de que un candidato ya estaba postulado, sin poder "consultar antes" una vacante.

#### CA-03.4 — Priorización del Agente FAQ (evita cuello de botella del coordinador)

El dolor real: reclutadores nuevos preguntan mucho, coordinadores tardan en contestar. La solución no es un solo canal — es una cascada de tres niveles, donde la mayoría de preguntas se resuelven SIN que el coordinador intervenga nunca:

```
Reclutador pregunta (texto libre desde la ficha de vacante)
  ↓
NIVEL 1 — Campo estructurado de la vacante
  ¿La pregunta coincide con un campo que ya existe?
  (status, tiene_ruta, ruta_para_entrevista, dias_entrevista,
   estacionamiento, comedor, uniforme, horario, turno,
   dias_garantia, comision_base_mxn, punto_reunion)
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
  Se crea una fila en faq_escalaciones + alerta al coordinador
  Al responder, el coordinador decide con un toggle
  si esa respuesta se guarda en faqs_vacante
  (así la siguiente vez que alguien pregunte algo similar,
   se resuelve en el Nivel 2 sin esperar a nadie)
```

**CA-03.5:** Dado que la pregunta del reclutador coincide con un campo estructurado de la vacante (ej. "¿sigue vigente?", "¿tiene ruta?"), cuando el sistema la procesa, entonces responde de inmediato consultando ese campo directamente — sin invocar ninguna API externa y sin generar alerta al coordinador.

**CA-03.6 (rediseñada 2026-08-20 — construida por completo, ver tasks.md 6.11):** El diseño original preveía invocar una Edge Function `agente-faq` con Claude API en el Nivel 3. **Decisión de alcance explícita:** se construyó sin IA en tiempo real, mismo criterio ya aplicado en 6.9/6.10 — Nivel 3 escala directo al coordinador vía la tabla `faq_escalaciones`, sin que Claude intente responder primero. Queda anotado en el mismo backlog de "agentes de IA reales" (~4-5 meses) para cuando se retome.

**CA-03.2 (corregida 2026-08-20):** El diseño original mencionaba una tabla `mensaje_interno` que nunca se construyó como tal — la escalación al Nivel 3 usa una tabla nueva y dedicada, `faq_escalaciones` (distinta de `faqs_vacante`, que ya existía desde Sprint 1 y solo guarda FAQs *ya contestados* — su columna `respuesta` es `NOT NULL`, nunca fue pensada para preguntas pendientes). `faq_escalaciones` sí soporta el estado "pendiente" (`respuesta` nullable). Genera una alerta (`tipo = 'pregunta_faq'`) al coordinador activo de la agencia.

**CA-03.3 (verificada 2026-08-20):** Al responder desde `/coordinador/faq` (5.12), el coordinador activa el toggle "Agregar al FAQ" — si lo activa, se inserta una fila en `faqs_vacante` (`visible_reclutadores = true`), lo que hace que el Nivel 2 la encuentre automáticamente la próxima vez que alguien pregunte algo parecido para esa misma vacante. Si no lo activa, la respuesta solo la ve el reclutador que preguntó (vía Realtime en su propia ficha), sin quedar disponible para nadie más.

**CA-03.8 (nueva, 2026-08-20) — Limpieza:** las preguntas ya contestadas se pueden borrar manualmente (botón individual + "Borrar todo") tanto por el reclutador como por el coordinador — decisión explícita de no auto-borrar por tiempo, para no perder algo que el usuario quería conservar. Las preguntas **pendientes** (sin contestar) de una vacante se borran automáticamente cuando esa vacante deja de estar "vigente" (se pausa o se cierra) — ya no tiene sentido que el coordinador conteste algo de una posición que ya no está activa.

---

---

### HU-04: Coordinador gestiona comisiones y corte semanal (rediseñada 2026-08-20)
**Como** coordinador, **quiero** generar el corte de comisiones cuando yo decida, con un botón, **para** no depender de que el sistema adivine bien un periodo automático que se rompe cada vez que cambio mi día de corte.

> *Origen: el diseño original (CA-04.2, ver historial abajo) calculaba un periodo automático semana a semana. José detectó en vivo (2026-08-19) que cambiar `dia_corte` a medio periodo podía dejar comisiones sin poder pagarse nunca ("se pierden pagos de comisiones"). Se diseñó primero un sistema híbrido con "ancla" de periodo, pero José propuso algo más simple y mejor: corte 100% manual, con un botón — resuelto en sesión siguiente (2026-08-20).*

**CA-04.1 (vigente):** El panel de corte muestra, por reclutador, todo lo pendiente de pago (comisión aplicable, garantía cumplida, sin pagar todavía) y el total.

**CA-04.2 (reemplazada 2026-08-20 — la versión de periodo automático semanal queda obsoleta):** El corte **no** se calcula automáticamente por semana. `dia_corte`/`dia_pago` (configurables en `/coordinador/perfil-agencia`) son **solo un recordatorio visual** — no determinan qué se paga ni cuándo. El coordinador da clic en el botón **"✅ Generar Corte"** cuando decide hacerlo. El sistema calcula "pendiente de generar" como: todo con `comision_aplicable = true`, `pagado = false`, y `fecha_garantia_fin` **antes de hoy** (nunca el mismo día — el candidato debe terminar su jornada laboral de ese día antes de contar para el corte, regla de negocio explícita de José). No usa `garantia_cumplida` ni `semana_corte` (ambos rotos, nunca se actualizan — mismo hueco documentado desde 5.1c).

**CA-04.2b (nueva, 2026-08-20) — Ancla persistida y aviso:** `agencias.ultimo_corte_at` guarda cuándo se generó el último corte — se actualiza únicamente al generar uno nuevo, nunca al cambiar `dia_corte`/`dia_pago`/`hora_corte` (por eso ya no hay riesgo de comisiones huérfanas: lo pendiente siempre se muestra hasta que se pague, sin importar cuántas veces cambie la configuración informativa). Cuando el día de hoy coincide con `dia_corte` configurado y hay algo pendiente, aparece un badge rojo junto a "Corte semanal" en el menú (mismo estilo que chats sin leer), con Realtime — desaparece solo al generar el corte, sin recargar.

**CA-04.3 (corregida 2026-08-20):** Al confirmar "Generar Corte" (con ventana de confirmación mostrando cuántas comisiones y el total), el sistema vuelve a consultar lo pendiente en ese momento (evita usar datos obsoletos en pantalla), marca `postulaciones.pagado = true` y las liga a un `cortes_semana.id` nuevo vía `postulaciones.corte_id` (para poder reconstruir el detalle de cualquier corte pasado después), actualiza `agencias.ultimo_corte_at`, y descarga un Excel de comprobante. El historial de cortes ya generados muestra cada uno con sus horas exactas de inicio/fin (`cortes_semana.periodo_inicio`/`periodo_fin`) y un botón de descarga individual — más un botón "Descargar todo" que arma un Excel con el histórico completo.

**CA-04.4 (vigente):** Un candidato descartado **después de haber entrado a Inducción** (`fecha_contratacion` no nulo) cuenta como "no efectivo" en el corte, con el motivo que corresponda (renuncia, despido por la empresa, no concluyó inducción, etc. — cualquier motivo vale, no una lista fija). Un candidato descartado **antes** de llegar a Inducción (`fecha_contratacion` nulo — ej. "No cumple perfil", "No contesta") nunca estuvo en la ruta de cobrar comisión y no aparece en el corte en absoluto, ni como efectivo ni como no efectivo.

---

### HU-05: SEO dinámico por vacante
**Como** candidato que busca empleo en Google, **quiero** encontrar vacantes específicas de TuChamba en los resultados de búsqueda, **para** llegar directo a la oportunidad que me interesa.

**CA-05.1:** Dado que el candidato entra a una vacante específica, cuando la página carga, entonces `document.title`, `meta[name="description"]` y el script JSON-LD `JobPosting` se actualizan con los datos reales de esa vacante.

**CA-05.2:** El canonical URL de cada vacante nunca incluye el parámetro `?ref=CODIGO` — siempre apunta a la URL limpia para evitar contenido duplicado en Google.

**CA-05.3 (corregida 2026-08-10):** El sitemap.xml se genera **dinámicamente** vía `app/sitemap.ts` (función nativa de Next.js 14), consultando Supabase en vivo cada vez que se solicita `/sitemap.xml` — solo incluye vacantes con `status = 'vigente'`. No requiere sincronización manual ni automática a ningún repositorio: siempre refleja el estado real de la base de datos en el momento exacto de la consulta, sin necesitar un GitHub token ni disparar despliegues extra. Reemplaza el mecanismo de V1 (archivo estático commiteado a GitHub en cada cambio) por ser más simple, más seguro (sin token que administrar), y consistente con el Principio de Diseño #4 ("Ligero").

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

### HU-08: Importación y exportación masiva de vacantes vía Excel (rediseñada 2026-08-10)
**Como** coordinador, **quiero** subir o descargar un archivo Excel con múltiples vacantes a la vez, **para** no tener que dar de alta una por una cuando manejo decenas de vacantes simultáneas (patrón confirmado en TuChamba V1: 129 vacantes operadas en conjunto a través de una sola agencia).

> *Origen del rediseño: José confirmó que la guía real de HR CONNECT usa columnas más simples con delimitador `|`, pero al construir esta historia decidió homologar Importar/Exportar contra las 8 secciones completas de `VacanteModal`, y reemplazar el delimitador por columnas individuales dinámicas — "si al coordinador se le pasa poner un `|`, eso va a hacer que no aparezca bien la lista". Esta versión reemplaza el diseño original documentado en las CA de abajo.*

**CA-08.1 (corregida):** El sistema no distingue entre "plantilla" e "importar/exportar" — el mismo botón "Exportar" genera un archivo `.xlsx` con **2 hojas**: "Vacantes" (los datos, o solo encabezados si el coordinador no tiene vacantes aún) e "Instrucciones" (tabla completa: cada columna, a qué sección/campo del modal corresponde, qué poner, y un ejemplo). Ese mismo archivo, editado o no, es el que se vuelve a subir con "Importar".

Columnas fijas (38+, ampliadas 2026-08-18): `ID`, `FECHA`, `TÍTULO`, `EMPRESA`, `MOSTRAR EMPRESA`, `DESTACADA`, `ESTADO`, `MUNICIPIO`, `ZONA`, `MODALIDAD`, `SALARIO MÍNIMO`, `SALARIO MÁXIMO`, `TIPO SALARIO`, `PERIODO SALARIO`, `MOSTRAR SALARIO`, `COMENTARIOS SALARIO` (nueva — texto libre solo para el reclutador, ej. "sube conforme a experiencia y antigüedad"), `JORNADA`, `TURNO`, `HORARIO`, `DESCRIPCIÓN`, `ETIQUETAS`, `RUTA`, `ZONAS DE RUTA`, `RUTA PARA ENTREVISTA`, `ESTACIONAMIENTO`, `COMEDOR`, `UNIFORME`, `LETRAS CHIQUITAS`, `DÍAS DE GARANTÍA`, `DÍAS DE INDUCCIÓN` (nueva), `INDUCCIÓN DENTRO DE GARANTÍA` (nueva — SI/NO), `COMISIÓN`, `TIENE PROMOCIÓN`, `DESCRIPCIÓN PROMOCIÓN`, `MONTO PROMOCIÓN`, `VENCE PROMOCIÓN`, `EXAMEN MÉDICO`, `ANTIDOPING`, `ESTUDIO SOCIOECONÓMICO`, `CONTACTO RRHH NOMBRE`, `CONTACTO RRHH TELÉFONO`, `MEJOR HORARIO CONTACTO`, `PUNTO DE REUNIÓN` (nueva), `QUÉ DECIRLE AL CANDIDATO` (nueva — mapea a `guion_candidato`), `DÍAS DE DESCANSO EMPRESA` (nueva — ver CA-08.8, campo de `negocios` no de `vacantes`), `ESTATUS` — más las columnas dinámicas `REQUISITO_N`, `BENEFICIO_N`, `DOCUMENTO_N`.

No se incluye el PDF de rutas de transporte (`documentos_negocio`) — es un archivo binario, se sigue subiendo únicamente desde `VacanteModal`.

**CA-08.2 (corregida):** Los `REQUISITO_N`, `BENEFICIO_N` y `DOCUMENTO_N` **no usan delimitador** — cada uno vive en su propia columna. El sistema los detecta dinámicamente al importar (busca `REQUISITO_1`, `REQUISITO_2`... hasta que deje de encontrar la siguiente), sin importar cuántas existan ni en qué posición del archivo estén — la lectura es por **nombre de encabezado**, no por posición de columna, por lo que el coordinador puede reordenar o insertar columnas libremente sin romper el sistema.

**CA-08.3:** Los campos `SALARIO MÍNIMO`/`SALARIO MÁXIMO`/`TIPO SALARIO`/`PERIODO SALARIO` van en columnas separadas (no en texto libre a interpretar) — más confiable que un parser de lenguaje natural. `TIPO SALARIO` acepta "Neto"/"Bruto"/"A convenir"; `PERIODO SALARIO` acepta "Semanales"/"Quincenales"/"Mensuales"/"Por hora" (se traducen a los códigos internos vía mapas bidireccionales en `lib/excel-vacantes.ts`).

**CA-08.4:** Toda vacante importada se vincula automáticamente a la `agencia_id` del coordinador que realiza la importación — nunca queda huérfana ni sin agencia asignada.

**CA-08.5:** Dado que el `ID` de una fila coincide con una vacante existente de esa agencia, o el `TÍTULO`+`EMPRESA` ya existen como vacante de esa agencia, cuando se importa de nuevo, entonces el sistema actualiza el registro existente en lugar de crear un duplicado. La `EMPRESA` se busca o crea automáticamente, reutilizando el mismo filtro anti-duplicados de nombre (normalización de acentos/mayúsculas) que ya usa `VacanteModal` (CA-20.4).

**CA-08.6:** Al finalizar la importación, el coordinador recibe un reporte con: número de vacantes creadas, número de vacantes actualizadas, y el detalle de cualquier fila que falló (número de fila + motivo del error) — nunca un fallo silencioso. Una fila con error no detiene el procesamiento de las demás.

**CA-08.7 (nueva) — Toggle Vigente/No vigente:** `VacanteModal`, Sección 8, incluye un interruptor simple Vigente/No vigente (mapea a `status = 'vigente'`/`'pausada'` — se usa `'pausada'` como valor de "apagado" por reutilizar el esquema existente de 3 estados, aunque de cara al coordinador solo se presentan 2 opciones). Solo las vacantes "Vigente" son visibles en el portal público y aparecen en el sitemap. Reemplaza el hueco detectado donde `status` se guardaba en el modal pero nunca existía un control visual para cambiarlo.

**CA-08.8 (nueva, 2026-08-18) — `DÍAS DE DESCANSO EMPRESA` es un campo de `negocios`, no de `vacantes`:** a diferencia de las demás columnas, este valor aplica a TODAS las vacantes de esa empresa (compartido), no solo a la fila donde se escribió. Formato de celda: abreviaturas de 3 letras separadas por coma — `LUN, MAR, MIE, JUE, VIE, SAB, DOM` (ej. "SAB, DOM" = sábado y domingo). Se usan 3 letras y no 1 sola porque una sola letra es ambigua entre Martes y Miércoles (ambas empiezan con "M"). Regla de conflicto: si el mismo `EMPRESA` aparece en varias filas del archivo con valores distintos en esta columna, **gana el valor de la última fila de esa empresa procesada** (decisión explícita de José, 2026-08-18) — no se promedia ni se marca como error. Si la columna viene vacía en todas las filas de una empresa nueva, se usa el default de `negocios.dias_descanso` (`[0]`, solo domingo).

---

### HU-09: Onboarding de reclutador nuevo
**Como** reclutador nuevo, **quiero** entender cómo funciona el sistema y qué vacantes puedo trabajar desde el primer día, **para** no depender de que el coordinador me explique todo por WhatsApp.

> *Origen: Irene Romero en el chat de HR CONNECT: "Tu dame una pauta, yo por primera vez me voy por tus indicaciones". Yuli: "más o menos si ya la ubique pero en si no sé cuál es la que se debe copiar y enviar". Maribel: "me llegan candidatos pero justo cuando brindo información ya no les agrada o no sé qué pasa".*

**CA-09.1:** Dado que un reclutador accede por primera vez a su portal (después de ser aprobado por el coordinador), cuando carga su dashboard, entonces ve una guía de inicio rápido con 4 pasos: (1) Cómo ver las vacantes activas, (2) Cómo compartir una vacante con candidatos, (3) Cómo registrar un candidato, (4) Cómo dar seguimiento y cobrar tu comisión.

**CA-09.2:** La ficha operativa de cada vacante incluye una sección **"Qué decirle al candidato"** — un texto pregenerado por el coordinador (o sugerido por IA) con la información mínima que el reclutador necesita comunicar: salario, horario, punto de reunión, qué llevar, con quién preguntar. Esto resuelve directamente el dolor de reclutadores que no saben qué información dar y pierden al candidato en el proceso.

**CA-09.3 (rediseñada 2026-08-17):** El sistema bloquea el guardado de una vacante si faltan campos obligatorios, y muestra un mensaje explícito de qué falta (no solo un punto rojo por sección). Lista completa de obligatorios: título, empresa, ciudad/estado, horario detallado, salario, requisitos (mínimo 1), beneficios (mínimo 1), días de garantía, comisión base, y documentos tronco común (mínimo 1). **Contacto RRHH y punto de reunión son opcionales** — decisión explícita de José, ya documentada desde antes en el tooltip del campo ("llenar solo si el reclutador tendrá contacto directo con la empresa"); no deben marcarse como incompletos. El mismo criterio de completitud se usa en dos lugares: dentro del `VacanteModal` (mensaje + punto rojo por sección) y en el listado del coordinador (`app/coordinador/vacantes/page.tsx`, punto verde/ámbar junto al título — útil para detectar vacantes ya guardadas antes de este cambio que no cumplen la lista completa).

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

**CA-13.3:** Los candidatos descartados aparecen en una columna separada "Descartados" al final del Kanban — nunca se borran del historial. Implementada 2026-08-07: la columna filtra candidatos "No efectivo" (`motivo_descarte = 'no_concluyo_induccion'`) fuera de vista 2 días después de marcarse (CA-19.3b), y a los "Contratado" con garantía ya cumplida 3 días después (CA-19.3c, calculado al vuelo comparando `fecha_garantia_fin` contra la fecha actual, sin depender de un proceso programado). Las cards "No efectivo" se muestran con fondo rojo tenue, distinguibles del resto de descartados.

**CA-13.4 — Consulta del detalle de descarte (idea de José, 2026-08-07):** desde la columna "Descartados", cada card tiene un botón para abrir un modal de solo lectura mostrando: motivo de descarte seleccionado, el detalle/comentario escrito por el reclutador, **fecha y hora exactas** del descarte, quién lo descartó, y el mensaje de retroalimentación enviado al candidato (si hubo uno). Sin edición — es puramente de consulta, para que el reclutador o el coordinador puedan revisar el historial sin tener que rastrear la información en Supabase directamente.

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

**CA-14.4 — Auto-veto por inasistencia repetida:**
Cuando `confirmarDescarte()` registra un descarte con `motivo_descarte = 'no_se_presento'`,
el sistema cuenta cuántas veces ese mismo `candidato_id` acumula ese motivo específico
dentro de la misma `agencia_id` (histórico completo del candidato en esa agencia,
sin importar la vacante). El motivo `no_contesta` NO suma a este contador — se
mantiene solo como estatus informativo, no como señal de inasistencia.

Al llegar a **3 inasistencias** (`no_se_presento`) en la misma agencia:
- El sistema marca automáticamente `candidatos.vetado = true`
- `candidatos.motivo_veto = 'Auto-veto: 3 inasistencias a entrevista sin previo aviso en esta agencia'`
- `candidatos.vetado_por = NULL` (queda registrado como acción del sistema, no de una persona)
- `candidatos.vetado_at = now()`
- Se genera una `alerta` tipo `candidato_auto_vetado` dirigida al coordinador de
  esa agencia, con el detalle: nombre, teléfono y las 3 fechas de inasistencia.

El coordinador conserva control total: desde su panel puede ver el detalle completo
del auto-veto y revertirlo en cualquier momento (reutiliza el mecanismo de reversión
ya definido en CA-14.3) — el sistema propone, el coordinador decide.

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

**CA-15.4:** El sistema detecta automáticamente si un candidato que tenía entrevista no avanzó de etapa "Entrevista" en 48 horas → genera la alerta CA-15.3 automáticamente sin que el reclutador tenga que recordarlo.

**CA-15.5 (nueva, 2026-08-19) — Confirmación de asistencia registrada:** a diferencia de la alerta CA-15.3/15.4 (que es solo un recordatorio pasivo que desaparece), esta es un dato permanente de seguimiento. Cuando un candidato en etapa "Entrevista" ya tiene `fecha_entrevista` pasada y `asistio_entrevista` sin contestar (`null`), su card en el Kanban del reclutador muestra 2 botones: "✅ Sí se presentó" / "❌ No se presentó", que guardan `postulaciones.asistio_entrevista` (boolean). Una vez contestada, se reemplaza por un badge fijo con el resultado. Es independiente de mover al candidato a "Inducción" — confirmar asistencia no avanza la etapa automáticamente, son 2 acciones separadas (el reclutador sigue moviéndolo manualmente con su fecha de inicio, CA-15.2). El coordinador ve el mismo badge en su Kanban global (`KanbanCardSoloLectura.tsx`) — le sirve para confirmar que el reclutador está dando seguimiento real a sus candidatos, no solo agendando y olvidando.

**Distinción importante con "Descartar" (aclarada por José tras ver la primera versión en vivo):** el botón "❌ No" **nunca mueve al candidato de columna** — se queda en "Entrevista". Es deliberadamente distinto de "Descartar" (que sí mueve a la columna final): "No se presentó" da al candidato una segunda oportunidad para el caso de que algo fuera de su control le haya impedido llegar; "Descartar" sigue siendo la decisión final e independiente de que el reclutador ya no tiene interés en ese candidato (ej. deja de contestar). Al contestar "No" se puede anotar una razón opcional (`postulaciones.motivo_no_asistencia`). Reagendar la entrevista (nueva `fecha_entrevista`) resetea `asistio_entrevista` y `motivo_no_asistencia` a `null`, para que se pueda volver a preguntar en la nueva fecha.

**CA-15.6 (nueva, 2026-08-19) — Candado de datos completos antes de "Inducción":** el reclutador no puede mover a un candidato de "Entrevista" a "Inducción" si falta cualquiera de: fecha de entrevista agendada, edad, escolaridad, residencia (ficha del candidato, HU-23), o confirmación explícita de que sí se presentó (`asistio_entrevista = true`, CA-15.5). Si falta algo, se bloquea con un mensaje listando exactamente qué falta. La tarjeta de consulta del candidato (clic en su nombre) muestra los 5 datos siempre — en rojo los que falten, en gris los que ya estén — para poder diagnosticar visualmente qué falta sin tener que intentar mover al candidato primero.

**CA-15.7 (nueva, 2026-08-20) — Días de entrevista por empresa:** cada empresa tiene días fijos de la semana en los que recibe candidatos a entrevista (`negocios.dias_entrevista`, dato compartido por empresa — igual que `dias_descanso`, cambia en una vacante afecta a todas las de esa misma empresa). El coordinador lo configura en `VacanteModal`, Sección 8 (Proceso de selección) — deliberadamente distinto de dónde vive `dias_descanso` (Sección 1), ya que son conceptos distintos: uno afecta el cálculo de garantía, el otro cuándo se puede agendar. El reclutador lo ve (solo lectura) en el listado de "Vacantes" y en la ficha operativa de cada vacante (dentro de "Qué decirle al candidato"). **Es un candado real, no solo informativo:** al agendar una entrevista (CA-15.2), si la fecha elegida cae en un día fuera de los configurados, el sistema bloquea el guardado con el mensaje "Fecha fuera de días de entrevista de la empresa." Si la empresa no tiene el campo configurado (array vacío), no aplica ninguna restricción — no rompe vacantes de empresas que no lo hayan definido.

---

### HU-16: Control de cupo máximo por vacante (rediseñada 2026-08-19)
**Como** coordinador, **quiero** definir cuántas personas necesita cada empresa y que el sistema pause la vacante automáticamente al cubrirlo, **para** no seguir recibiendo candidatos cuando ya está completo el requerimiento.

> *Origen: Documento "Requerimiento Semanal" de HR CONNECT — Roxana define manualmente cuántas personas necesita cada empresa por semana. TuChamba automatiza este control. Rediseñada al construirla (2026-08-19) tras varias rondas de clarificación con José sobre cómo debe comportarse el conteo — ver "por rondas" en CA-16.5.*

**CA-16.1:** El coordinador define `cupo_requerido` en cada vacante (ej. "FEMSA necesita 5 operadores"). Campo nuevo en `VacanteModal` (Sección 7, no existía en el formulario hasta esta tarea aunque la columna en base de datos sí). Puede modificarlo en cualquier momento — si la vacante ya está "Vigente" y solo cambia el número (sin tocar el switch de status), no reinicia nada, solo cambia la meta de la ronda que ya está corriendo. **Candado (agregado 2026-08-19):** no se puede guardar un `cupo_requerido` menor a los que ya están ocupando lugar en la ronda actual — el mínimo posible es igual al número ya ocupado (para pausarla exactamente ahí), nunca menos.

**CA-16.2:** El sistema muestra en tiempo real el estado del cupo en la ficha de vacante del coordinador (`VacanteModal`, Sección 7) y en el listado de vacantes (`app/coordinador/vacantes/page.tsx`, columna "Cupo"):
```
✅ Ocupando cupo: 3   🔄 En entrevista: 2   🟢 2 disponibles
```
"Ocupando cupo" cuenta desde que el candidato entra a Inducción (`comision_aplicable = true`), no hasta que llega a "Contratado" — ese lugar ya está de facto tomado desde Inducción, esperar hasta "Contratado" (que puede tardar semanas, todo el periodo de garantía) generaría el mismo sesgo que ya se corrigió: pedir de más porque en pantalla el cupo se ve libre cuando en realidad ya no lo está.

**CA-16.3:** Cuando los "ocupando cupo" de la ronda actual llegan a `cupo_requerido`, el sistema pausa automáticamente la vacante (`status = 'pausada'`) y guarda una alerta para el coordinador (`destinatario_rol = 'coordinador'`) — aunque hoy no existe todavía ningún panel donde el coordinador la vea (hueco anotado en tasks.md 6.8b, pendiente un panel de alertas para coordinador). El chequeo se dispara en 2 momentos: al entrar a Inducción y al confirmar "Contratado" (mismo motivo que arriba — el lugar se ocupa desde Inducción).

**CA-16.4 (pendiente, no construida en esta pasada):** Alerta amarilla cuando los candidatos en Entrevista igualan o superan el cupo restante — avisa al coordinador antes de que se llene, no después. Depende del mismo panel de alertas de coordinador que CA-16.3 — se recorta por ahora junto con esa dependencia.

**CA-16.5 (corregida 2026-08-19) — Cupo "por rondas", no histórico acumulado:** `cupo_requerido` **no** es un total fijo que se acumula para siempre — cada vez que el coordinador reactiva la vacante (pasa el switch de "No vigente" a "Vigente"), empieza una **ronda nueva**: el conteo se reinicia a 0, sin importar cuántos ya se habían colocado en rondas anteriores. Técnicamente: nueva columna `vacantes.cupo_desde` (timestamptz) se actualiza a `now()` solo en esa transición (no vigente → vigente); el conteo de "ocupados" filtra `postulaciones.fecha_contratacion >= cupo_desde`, ignorando todo lo anterior a esa marca.
  - Aplica igual sin importar el motivo de la reactivación — ya sea porque un candidato se cayó a medias (renuncia/no concluyó inducción) o porque la empresa simplemente pide más personal — siempre es "ronda nueva, empieza en 0", nunca se suma al histórico. Decisión explícita de José tras descartar 2 alternativas más complejas (acumular sin resetear; sumar solo cuando es "más personal" pero resetear cuando es "reemplazo") — se quedó con la más simple de las 3.
  - Ya NO depende de `garantia_cumplida` (campo roto, nunca se actualiza — mismo hueco ya corregido en 5.17/5.22/Dashboard) ni exige que el candidato llegue hasta "Contratado" — cuenta desde `comision_aplicable = true`, que ya se marca desde Inducción.
  - **Limitación de calidad conocida y aceptada:** `fecha_contratacion` es una fecha (sin hora) y `cupo_desde` sí tiene hora exacta — la comparación se hace solo por día. Si el mismo día en que se reactiva una vacante alguien entra a Inducción, cuenta como parte de la ronda nueva aunque técnicamente haya sido antes de la hora exacta de reactivación. Caso extremo, poco probable en la práctica, aceptado sin resolver por ahora.

---

### HU-17: Agente de pre-calificación (Matching automático)
**Como** reclutador, **quiero** que el sistema filtre candidatos antes de que lleguen a mí, **para** solo recibir candidatos que realmente cumplen el perfil de la vacante.

> *Origen: Dolor real de HR CONNECT — reclutadores mandan candidatos que claramente no cumplen el perfil porque no tienen herramienta de filtro. Cada vacante tiene requisitos específicos que el candidato debe cumplir antes de ser enviado al reclutador.*

**CA-17.1:** Cuando un candidato abre el chat de una vacante, antes de conectarlo con el reclutador, el Agente de Matching le hace 2-3 preguntas clave basadas en los requisitos de esa vacante. Ejemplo para Operador de Producción:
- *"¿Tienes secundaria terminada?"*
- *"¿Puedes trabajar en turnos rotativos (6am-2pm / 2pm-10pm)?"*
- *"¿Tienes cómo llegar a Apodaca?"*

**CA-17.2:** Si el candidato no cumple algún requisito crítico, el sistema le responde honestamente: *"Para esta vacante necesitas [requisito]. En este momento no cumples el perfil, pero tenemos otras vacantes donde podrías encajar:"* → muestra vacantes alternativas.

**CA-17.3:** Si el candidato cumple todos los requisitos, pasa al reclutador con un badge visible en su card del Kanban: **"✅ Pre-calificado"** — el reclutador sabe que ese candidato ya pasó el filtro inicial.

**CA-17.4:** El coordinador define las preguntas de pre-calificación por vacante (máximo 5). Ampliada 2026-08-19 con lo aprendido al construirla: 3 tipos disponibles — Sí/No, Opción múltiple (mínimo 2 opciones; con checkbox "¿Tiene respuesta correcta?" — si no se marca, la pregunta es solo informativa, no filtra, ej. "¿Te queda alguna ruta?"), y Texto libre (siempre informativa, nunca filtra, ej. "¿Ya has trabajado antes para esta empresa?" — sirve para capturar datos como el "Reingreso" que Roxana ya registraba por WhatsApp, ver backlog Fase 2). Las respuestas de preguntas informativas se guardan en `postulaciones.respuestas_precalificacion` para que el reclutador/coordinador las consulten. **Pendiente (Fase 2):** el sistema generándolas automáticamente a partir de `requisitos` vía Claude — hoy el coordinador las escribe a mano.

**CA-17.5:** Los candidatos que no pasan el filtro quedan registrados en el sistema como "No calificado" — el coordinador puede ver qué requisito falló más frecuentemente para ajustar el perfil de la vacante si es necesario.

---

### HU-24: Mensaje de seguimiento sugerido para candidatos sin movimiento
**Como** reclutador, **quiero** un mensaje ya redactado para reactivar a un candidato cuando la alerta de "sin movimiento 48h" se dispara, **para** no tener que pensar qué escribirle cada vez ni dejarlo enfriar por no saber cómo retomar el contacto.

> *Origen: José, 2026-08-19. Decisión explícita de alcance: por ahora mensajes prefabricados por reglas (mismo patrón ya usado en `generarLinkWhatsApp()`, 6.8b), sin IA en tiempo real — la visión a mediano plazo (~4-5 meses) es que todo el filtro y seguimiento de candidatos lo hagan agentes de IA, dejando al reclutador enfocado solo en ampliar su red y compartir su link de TuChamba Express. Esta tarea es la versión "regla simple" que sienta la base; se reemplazará por IA real cuando llegue ese momento — no antes.*

**CA-24.1:** Cuando un candidato en cualquier etapa activa (Aplicado, Contactado, Entrevista, Inducción — mismo criterio que la alerta `sin_movimiento` ya existente, CA-07.2) lleva 48h sin `updated_at`, su tarjeta en el Kanban del reclutador muestra un botón "🔔 Enviar seguimiento" — distinto del botón general de WhatsApp por etapa (6.8b), porque este es específicamente para reactivar, no para contacto normal.

**CA-24.2:** El mensaje varía según la etapa actual del candidato (plantillas fijas, sin IA):
- Aplicado: recordatorio de que sigue en el proceso, invitación a continuar.
- Contactado: pregunta si vio el mensaje anterior.
- Entrevista (sin fecha agendada aún): invitación a agendar.
- Inducción: pregunta de seguimiento sobre cómo va el proceso.

---


**Como** candidato, **quiero** poder ver todas las vacantes a las que me he postulado y el estado de cada una, **para** no perderme entre conversaciones cuando hay muchas vacantes disponibles.

> *Origen: Pain point identificado en sesión de desarrollo — con 100+ vacantes un candidato no tiene forma de saber a cuáles ya aplicó ni en qué etapa está cada proceso.*

**CA-18.1:** El candidato accede a "Mis postulaciones" desde el header del portal candidato con solo ingresar su número de teléfono — sin contraseña, sin registro adicional. El teléfono es su identificador único.

**CA-18.2:** La página `app/mis-postulaciones/page.tsx` muestra todas las postulaciones del candidato con:
- Nombre de la vacante y empresa
- Etapa actual (badge de color)
- Fecha de postulación
- Botón "Ver chat" que abre directamente la conversación

**CA-18.3:** Si el candidato tiene postulaciones en etapa "Descartado", las muestra al final de la lista en gris — con el mensaje de retroalimentación si fue enviado.

**CA-18.4:** Si el candidato no tiene postulaciones registradas con ese teléfono, el sistema le muestra las vacantes activas disponibles para que pueda postularse.

**CA-18.5:** El teléfono ingresado se guarda en localStorage bajo la clave `candidato_telefono` — en visitas futuras el sistema lo recuerda y no vuelve a pedirlo.

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

### 5.3 Corte semanal (rediseñado 2026-08-20 — ver HU-04)

**Día/hora de corte configurables por agencia — solo informativos:**
- El coordinador define día de corte, día de pago, y hora de corte para su agencia (`/coordinador/perfil-agencia`)
- Por defecto: corte jueves 12:00 (dia_corte=4, hora_corte=12:00), pago viernes (dia_pago=5)
- Campos en tabla `agencias`: `dia_corte` (int, 1=Lun...7=Dom), `dia_pago` (int), `hora_corte` (time)
- **Ya no calculan nada automáticamente** — son solo un recordatorio visual, y disparan el badge de aviso en el menú del coordinador cuando coincide el día y hay algo pendiente

**El corte es 100% manual:**
- El coordinador da clic en "✅ Generar Corte" cuando decide procesarlo — no hay periodo ni fecha programada
- `agencias.ultimo_corte_at` (timestamptz) guarda cuándo fue el último corte generado — se actualiza solo al generar uno nuevo
- "Pendiente de generar" = todo con `comision_aplicable = true`, `pagado = false`, `fecha_garantia_fin` **antes de hoy** (nunca el mismo día — el candidato debe terminar su jornada laboral de ese día)
- Al generar: marca como pagado, liga cada postulación al corte vía `postulaciones.corte_id`, guarda `cortes_semana.periodo_inicio`/`periodo_fin` (timestamps exactos, para mostrar hora en el historial)
- `semana_corte` (campo viejo en `postulaciones`, formato ISO) ya no se usa para nada — queda como campo muerto

**Vista del reclutador — Comisión estimada:**
- Se muestra: candidatos en garantía activa, candidatos efectivos pendientes de pago, y total estimado a cobrar en el próximo corte
- Se calcula en vivo comparando `fecha_garantia_fin` contra hoy — no depende de `garantia_cumplida` (roto)

**Vista del coordinador — Panel de corte:**
- "Pendiente de generar" (en vivo, sin navegación por periodos) + detalle por reclutador
- Botón "✅ Generar Corte" — confirma antes de ejecutar, descarga Excel de comprobante automáticamente
- Historial de cortes ya generados, con hora exacta de inicio/fin de cada uno, botón de descarga individual (reconstruye el detalle vía `corte_id`) y botón "Descargar todo" (histórico completo en un solo Excel)

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

### Portal Admin (web — tú y, eventualmente, 1-2 administradores más)
- **Acceso:** login real vía Supabase Auth (no llave compartida), 2 roles — **Maestro** (control total, único que gestiona otros administradores) y **Limitado** (gestión operativa del día a día, sin poder tocar la tabla de administradores). Sesión con cierre automático a los 20 min de inactividad (aviso de 4 seg, sin opción de cancelar).
- **Recuperación de contraseña (2026-08-22):** self-service vía "¿Olvidaste tu contraseña?" en el login, para Maestro y Limitado igual. Contraseña: 8-12 caracteres, debe incluir letra + número + símbolo. Mismo mecanismo reutilizado por `/coordinador/login`. **Sigue dependiendo del correo de Supabase, sin resolver** — ver `plan.md` para el límite conocido.
- **Home** (renombrado por José 2026-08-22 de "Torre de Control" a **"Panel de Control"**): telemetría en vivo (agencias activas, coordinadores activos, reclutadores activos, vacantes vigentes) + accesos a los módulos.
- Todo lo del coordinador pero sin filtro de agencia
- **CRUD de agencias — construido y probado 2026-08-22** (`/admin/agencias`): listado con coordinador anidado, alta manual de agencia + coordinador (con contraseña propia, sin correo — ver `plan.md`), editar (email del coordinador fijo, no editable), activar/desactivar ambos juntos, resetear contraseña del coordinador.
- **Plantilla (`/admin/plantilla`, construido y probado 2026-08-22)** — antes era el placeholder "Reclutadores" del home; renombrado porque cubre tanto coordinadores como reclutadores en una sola pantalla con pestañas (idea de José: son "la gente que trabaja en las agencias", no 2 conceptos separados). Pestaña **Coordinadores**: listado global (nombre, email, teléfono, agencia, status), búsqueda y orden por columna — cierra el listado global pendiente de `7.15`. Pestaña **Reclutadores**: listado global (nombre, código, teléfono con lada, país), con sus agencias mostradas como etiquetas individuales — clic en una etiqueta activa/desactiva al reclutador específicamente en esa agencia (cierra `7.16`, la escalación para cuando el coordinador no puede/debe hacerlo desde su propio panel). Ninguna pestaña tiene botón de eliminar (ver Sprint 8, política de fin de año fiscal). Crear coordinador nuevo para agencia existente sigue pausado — ver Feature futuro abajo.
- **Nota de arquitectura importante (aclarada 2026-08-22, José preguntó directo):** reclutador↔agencia ya es muchos-a-muchos desde antes de esta sesión (`reclutador_agencia`, por eso las etiquetas de arriba). Coordinador↔agencia sigue siendo uno-a-uno — ver Feature futuro abajo para por qué no es un cambio trivial.
- Vista global de todas las postulaciones
- Métricas globales de la plataforma
- **Invitaciones (generar link de alta de agencia):** restyled 2026-08-21, y ampliado 2026-08-22 con: teléfono esperado opcional por link (el registro solo se completa si coincide), numeración de links activos (`#1` = más reciente), y ya no desaparecen de la lista hasta que expiran o se usan (antes solo vivían en memoria del navegador).
- **Solicitudes (aprobar/rechazar agencias pendientes):** restyled 2026-08-21. "Rechazar" rediseñado 2026-08-22 — antes solo marcaba `status = 'rechazada'` y acumulaba filas para siempre (se detectaron 11 agencias de prueba así); ahora borra de verdad la agencia, el coordinador, y su cuenta de Supabase Auth.
- **Feature futuro, sin fecha (2026-08-22):** coordinador con 2 agencias simultáneas / fusión de agencias. Pausado a propósito — mismo patrón que ya funciona para reclutador (`reclutador_agencia`), pero requeriría reescribir 15+ políticas RLS que hoy asumen "1 coordinador = 1 agencia fija" (ver evaluación completa en `tasks.md`, hecha 2026-08-18). El CRUD de arriba asume 1 coordinador por agencia, como hoy.
- Visión de José sobre soporte/reparación (2026-08-21): confirmado 2026-08-22 que no aplica como pantalla del admin — los bugs de código se corrigen directo en el código, como siempre. La idea real a futuro es un agente de IA con acceso al repositorio para localizar y corregir código — proyecto aparte, se agrupa con la nota existente de "agentes de IA reales" (~4-5 meses, ver CA-03.6, CA-25.4 y tasks.md).

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

---

### HU-23: Ficha del candidato al agendar entrevista + seguimiento automático al coordinador
**Como** reclutador, **quiero** capturar los datos básicos del candidato (edad, escolaridad, residencia) en el mismo momento en que agendo su entrevista, **para** no tener que reportárselos al coordinador por WhatsApp aparte. **Como** coordinador, **quiero** ver esos datos reflejados automáticamente en mi seguimiento por etapas, **para** no depender de mensajes sueltos de WhatsApp para dar seguimiento a los candidatos que sí llegaron a entrevista.

> *Origen: José compartió el formato real que los reclutadores le mandan a Roxana por WhatsApp al agendar una entrevista (2026-08-18). La mayoría de los campos ya existen o se derivan solos (empresa, vacante, horario, ruta, reclutador, coordinador) — solo edad, escolaridad y residencia son datos nuevos que no existen en ningún lado del sistema.*

**CA-23.1:** El modal "Agendar entrevista" (ya existente en `KanbanCard.tsx`, CA-15.2) agrega una sección "Ficha del candidato": edad (número), escolaridad (Primaria/Secundaria/Preparatoria/Universidad/Otro), residencia (texto libre — ciudad o colonia). Campos opcionales, capturados por el reclutador mientras habla con el candidato para agendar. Se guardan en `candidatos`, no en `postulaciones` (son datos de la persona, no de esa postulación específica).

**CA-23.2:** Al guardar la entrevista, el sistema arma automáticamente un resumen (mismo formato que ya usan los reclutadores por WhatsApp) y lo envía como mensaje de sistema (`es_sistema = true`) al chat reclutador↔coordinador que ya existe (HU-22) — sin abrir WhatsApp. Campos autocompletados sin pedirle nada al reclutador: Empresa, Vacante, Horario laboral, Ruta o Punto de Reclutamiento (derivado de `vacantes.ruta_para_entrevista`/`punto_reunion` — "Directo a Empresa" si no aplica ruta), Reclutador, Coordinador. Campos capturados en el modal: Fecha y hora de entrevista, Nombre, Edad, Escolaridad, Residencia.

**CA-23.3:** El Kanban global de solo lectura del coordinador (`KanbanCardSoloLectura.tsx`, ver HU-11 sección 6/5.11) muestra edad, escolaridad y residencia en la tarjeta cuando el candidato está en etapa "Entrevista" o posterior y esos datos existen — para que el seguimiento por etapas del coordinador tenga la información completa sin tener que buscarla en el chat.

---

### HU-25: Alta manual de candidato + resumen semanal del dashboard (2026-08-19)
**Como** reclutador, **quiero** poder dar de alta a un candidato que me llegó por otro medio (redes sociales, WhatsApp personal, presencial), **para** no perder candidatos reales solo porque no entraron por el portal público.

> *Origen: tarea 4.12 (Sprint 4) estaba documentada como completa desde hace semanas, pero José confirmó al buscarla que no existe ningún botón ni pantalla para esto en la app real — se reabre y se construye de verdad. Detectado mientras probaba 6.10.*

**CA-25.1:** Botón "+ Candidato" en `/reclutador/pipeline`, alineado junto al título de la pantalla. Abre un formulario: nombre, teléfono, vacante (solo vigentes de las agencias del reclutador), y "¿Por dónde llegó?" (Facebook, Instagram, TikTok, WhatsApp personal, Presencial/volanteo, Otro medio).

**CA-25.2:** Al guardar, crea (o reutiliza, si el teléfono ya existe) el candidato, la postulación (`etapa_actual = 'Aplicado'`, `es_manual = true`), el chat con el reclutador, y un registro en `trafico_referidos` con la fuente seleccionada — para que el Dashboard (gráfica "Fuentes de tráfico", 6.5) refleje de dónde llegan los candidatos reales, no solo los que pasaron por el portal. Valida que no se duplique la postulación si ese candidato ya estaba aplicado a esa misma vacante.

**CA-25.3:** El chat interno (`💬 Chat`) que normalmente aparece en cada tarjeta del Kanban **no se muestra** cuando `es_manual = true` — ese candidato nunca entró por el portal, nunca tuvo sesión para acceder a esa conversación, así que cualquier mensaje ahí se perdería sin que nadie lo leyera. Solo se le puede contactar por WhatsApp (botón ya existente, 6.8b/6.9).

**CA-25.4 (resumen semanal, 6.10):** El coordinador tiene un botón "📝 Ver resumen" en su Dashboard que arma un resumen en texto a partir de los mismos datos ya cargados en las 6 gráficas (vacantes por status, candidatos nuevos/contratados, mejor reclutador, comisiones pagadas/pendientes/perdidas, fuente de tráfico principal) — respeta el filtro de fechas activo en ese momento. **Decisión de alcance explícita (José, 2026-08-19):** sin Supabase Cron ni narrativa generada por IA todavía — resumen bajo demanda, con reglas simples, mismo criterio que 6.8/6.9. La versión automática (cada jueves, con IA real) queda en el backlog de "agentes de IA reales" (~4-5 meses, ver nota en tasks.md) — también depende de que exista un panel de alertas para coordinador, que tampoco existe hoy (hueco ya anotado en 6.8b).

---


### HU-19: Política de retención y limpieza de datos (Sprint 8 — backlog, no MVP inmediato)
**Como** coordinador, **quiero** poder limpiar manualmente los registros de candidatos que ya cumplieron su ciclo (descartados, contratados, vetados), **para** mantener la base de datos ligera sin perder información mientras es útil ni comprometer la trazabilidad de comisiones ya pagadas.

> *Origen: José identificó que sin una política de limpieza, la base de datos acumula indefinidamente chats, mensajes y postulaciones de candidatos que ya no tienen ningún valor operativo — descartados que nunca volverán, contratados cuya comisión ya se pagó hace meses.*

**Reglas de vencimiento (3 categorías independientes):**

| Categoría | Qué se borra | Vence a los | Se cuenta desde |
|---|---|---|---|
| Descartado con motivo ≠ `no_se_presento` | Expediente completo (candidato, chats, mensajes, historial de etapas) | 15 días | Fecha del descarte |
| Contratado (garantía cumplida y comisión ya cobrada) | Expediente completo | 30 días | Fecha de contratación |
| Huella de veto (`strikes_inasistencia` con `contador >= 3`) | Solo el registro de la huella (teléfono + agencia + contador) | 1 año | `vetado_desde` (fecha del 3er strike) |

**CA-19.1 — Registro del strike, independiente del expediente:**
Cada vez que `confirmarDescarte()` guarda un descarte con `motivo_descarte = 'no_se_presento'` (ver CA-14.4), el sistema hace `upsert` sobre `strikes_inasistencia` por `(telefono, agencia_id)`: si no existe, la crea con `contador = 1`; si existe, incrementa `contador` y actualiza `ultima_fecha`. Este registro es independiente del expediente completo del candidato y no se ve afectado por la limpieza de los 15 días.

**CA-19.2 — Auto-veto y archivo automático:**
Cuando `strikes_inasistencia.contador` llega a 3, además de lo ya definido en CA-14.4 (marcar `candidatos.vetado = true`, alerta al coordinador), el sistema:
- Guarda `strikes_inasistencia.vetado_desde = now()`
- Archiva automáticamente todas las postulaciones activas de ese candidato en esa agencia (`etapa_actual` no cambia, pero se oculta de los dashboards — ver CA-19.3)

**CA-19.3 — Los vetados desaparecen de los dashboards operativos:**
Mientras un candidato esté vetado (`candidatos.vetado = true`), sus chats y postulaciones **no aparecen** en `/reclutador/pipeline`, `/reclutador/chats`, ni en el Kanban global del coordinador — quedan en un estado de archivo invisible para el uso diario. Solo son visibles desde un panel específico de "Candidatos vetados" en el dashboard del coordinador (ver CA-19.6), donde puede revisarlos y revertir el veto manualmente en cualquier momento (reutiliza el mecanismo ya definido en CA-14.3).

**CA-19.3b — Archivo de "No efectivo" (agregada 2026-08-06, ver CA-02.10):** una postulación marcada `motivo_descarte = 'no_concluyo_induccion'` se muestra con la card en rojo tenue al final de la columna "Descartado" durante 2 días. Pasado ese margen, se oculta del Kanban del reclutador igual que un vetado — visible solo en el panel del coordinador ("No efectivos" / vetados), reactivable manualmente vía el botón "🔄 Reactivar candidato" descrito en CA-02.10.

**CA-19.3c — Archivo de "Contratado" con garantía cumplida (agregada 2026-08-06):** cuando `garantia_cumplida` pasa a `true` automáticamente (el sistema detecta que ya pasó `fecha_garantia_fin`), la card permanece visible 3 días más como margen de seguridad, y después se oculta del Kanban del **reclutador**. Esto NO aplica al Kanban global del coordinador (`app/coordinador/pipeline/page.tsx`, HU-11) — esa vista siempre muestra el historial completo sin filtrar por fecha, ya que es de solo consulta. Este archivo es independiente del borrado permanente de CA-19.5 (que sigue ocurriendo a los 30 días desde `fecha_contratacion`/inicio de inducción); es solo una capa de "oculto pero no borrado" antes del borrado real, y solo del lado del reclutador.

**CA-19.6 (nueva, 2026-08-19) — Lista de contratados/histórico (5.22):** el coordinador tiene una pantalla dedicada, separada del Kanban visual, con TODOS los candidatos que llegaron a "Contratado" en su agencia (de cualquier reclutador, sin tener que seleccionar uno por uno), filtrable por reclutador y por rango de fechas. A diferencia del Kanban global (que agrupa por etapa y por reclutador seleccionado), esta es una tabla plana pensada para revisión/exportación — mismo dato de fondo que ya trae `app/coordinador/pipeline/page.tsx`, presentado de forma distinta para un caso de uso distinto (auditoría/consulta histórica, no seguimiento operativo del día a día).

**CA-19.4 — Botón "Eliminar descartados vencidos (+15 días)":**
Visible solo en el dashboard del coordinador. Al presionarlo, el sistema primero muestra cuántos registros serán afectados (ej. "Esto eliminará 12 candidatos descartados") y pide confirmación explícita. Al confirmar, borra el expediente completo (candidato, chats, mensajes, historial de etapas y documentos) de todas las postulaciones con `etapa_actual = 'Descartado'`, `motivo_descarte ≠ 'no_se_presento'`, y `updated_at` con más de 15 días. Los candidatos vetados (`vetado = true`) quedan excluidos de este botón sin importar su motivo original — solo se eliminan vía CA-19.6.

**CA-19.5 — Botón "Eliminar contratados vencidos (+30 días)":**
Mismo patrón de confirmación previa. Borra el expediente completo de postulaciones con `etapa_actual = 'Contratado'`, `garantia_cumplida = true`, `pagado = true`, y `fecha_contratacion` con más de 30 días.

**CA-19.6 — Botón "Eliminar huellas de veto vencidas (+1 año)":**
Mismo patrón de confirmación previa. Borra únicamente las filas de `strikes_inasistencia` donde `vetado_desde` tiene más de 1 año. Al borrar la huella de un candidato, el sistema también revierte `candidatos.vetado = false` (si el candidato aún existe en la base) para que ese número pueda volver a postularse con normalidad — "empieza de cero".

**Nota de diseño — por qué la huella es independiente del candidato:** si el candidato reaplica después de que su expediente anterior ya se limpió (15 días), el sistema crea un registro nuevo en `candidatos` (mismo `telefono`, fila distinta), pero `strikes_inasistencia` sigue reconociendo el número y acumulando correctamente hacia el auto-veto — sin este desacople, un candidato problemático podría "resetear" su historial de inasistencias con solo esperar 16 días entre cada intento.

---

### HU-20: Alta y gestión de vacantes desde `VacanteModal` (coordinador)
**Como** coordinador, **quiero** dar de alta o duplicar vacantes de forma rápida, **para** no repetir información innecesariamente cuando varias vacantes comparten empresa o datos base.

> *Origen: José, 2026-08-07 — dos decisiones de diseño para VacanteModal (tarea 5.5), confirmadas antes de programar.*

**CA-20.1 — Selector de negocio con creación inline:**
En la Sección 1 (Identidad) de `VacanteModal`, el campo de empresa es un dropdown con los negocios ya existentes de la agencia del coordinador. Al final de la lista aparece la opción **"+ Nuevo negocio"** — al seleccionarla, se despliegan los 3 campos básicos (`nombre`, `industria`, `contacto_nombre`/`contacto_telefono`/`contacto_email`) directamente dentro del mismo modal, sin salir del flujo de alta de vacante. Al guardar la vacante, si se usó esta opción, primero se crea el registro en `negocios` y luego la vacante se vincula a su `id` recién creado.

**CA-20.2 — Duplicar vacante:**
Cada fila del listado de vacantes (`5.3`) tiene un botón **"📋 Duplicar"**. Al usarlo, se abre `VacanteModal` en modo "crear nueva" pero **precargado** con todos los campos de la vacante origen, con 2 excepciones que siempre reinician a su valor por defecto:
- `cupo_cubierto` → siempre arranca en `0` (es una vacante nueva e independiente, no hereda candidatos ya colocados)
- `status` → siempre arranca en `'vigente'`, sin importar el status de la vacante origen (ej. si la original estaba `'pausada'`, la copia nace activa)

El coordinador ajusta lo que necesite cambiar (horario, salario, etc.) antes de guardar como una vacante completamente nueva e independiente — sin ningún vínculo posterior con la original.

**CA-20.3 — Documentos de rutas de transporte por empresa (idea de José, 2026-08-09):**

> *Origen: José compartió ejemplos reales de HR CONNECT — una sola empresa (ej. TOPBAND) puede tener más de 15 rutas de transporte distintas, normalmente consolidadas en 1-2 PDFs. El documento pertenece a la empresa, no a una vacante específica — si vive en `vacantes`, se repetiría (o desincronizaría) en cada vacante nueva de la misma empresa.*

En la Sección 5 (Logística especial) de `VacanteModal`, el checkbox **"¿La empresa ofrece ruta de transporte?"** cumple una doble función:
- **A nivel vacante** (sin cambios respecto al diseño original): controla si `tiene_ruta`/`zonas_ruta`/`ruta_para_entrevista` aplican a *esta* vacante específica — puede que una empresa tenga ruta en general pero una vacante puntual (ej. turno nocturno) no la use.
- **A nivel empresa** (nuevo): al activarse, muestra el bloque de gestión de PDFs de `documentos_negocio` para la empresa seleccionada en la Sección 1 — subir, ver, eliminar. Estos documentos son **compartidos entre todas las vacantes de esa empresa**: si se sube o borra desde la vacante A, se refleja automáticamente en la vacante B de la misma empresa, sin duplicar el archivo.

Los documentos son visibles en 3 lugares, sin restricción de sesión (bucket público):
- **Coordinador** — dentro de `VacanteModal`, Sección 5
- **Reclutador** — en la ficha operativa de la vacante (`/reclutador/detalle/[id]`), dentro del bloque de Logística
- **Candidato** — en el portal público, dentro de la ficha completa de la vacante (`VacanteDetalle.tsx`)

**CA-20.4 — Filtro inteligente contra duplicados de empresa (idea de José, 2026-08-09):**

> *Origen: se detectaron 4 registros duplicados de "PASTELERIA LETY" en `negocios`, creados por pruebas repetidas de "+ Nueva empresa" sin ninguna validación previa — confirmando la necesidad real de este filtro, no solo preventiva.*

Antes de crear un negocio nuevo desde el selector inline de la Sección 1 (CA-20.1), el sistema normaliza el nombre ingresado (quita acentos, colapsa espacios dobles, ignora mayúsculas/minúsculas) y lo compara contra los negocios ya existentes de la base completa. Si encuentra una coincidencia — ej. "Pastelería Lety", "pasteleria  lety" y "PASTELERIA LETY" se consideran la misma empresa — bloquea la creación y le indica al coordinador el nombre exacto ya registrado, para que lo seleccione de la lista en vez de crear un duplicado.

**CA-20.5 — Documentos "tronco común" + Antidoping (idea de José, 2026-08-10):**

> *Origen: José identificó los 6 documentos que casi siempre se piden en HR CONNECT (RFC, INE, comprobante de domicilio, CURP, NSS, acta de nacimiento) — repetirlos a mano en cada vacante nueva era fricción innecesaria. También detectó que "Examen médico" (ya existente) necesita un hermano "Antidoping", y que ambos deben ser visibles al candidato, no solo al reclutador como hoy.*

En la Sección 8 de `VacanteModal`, arriba del campo de texto libre "Documentos requeridos" (`EditableList`), aparecen 6 checkboxes fijos correspondientes a los documentos más comunes: RFC, INE, Comprobante de domicilio, CURP, NSS, Acta de nacimiento. Al marcar/desmarcar cualquiera, el sistema agrega o quita automáticamente ese texto de la misma lista `documentos_requeridos` — el reclutador sigue viendo **una sola lista unificada**, sin duplicar la fuente de datos. El campo de texto libre sigue disponible para cualquier documento adicional específico de esa vacante/empresa que no esté en los 6 fijos.

**Nuevo campo:** `vacantes.requiere_antidoping` (boolean, mismo patrón que `requiere_examen_medico` ya existente).

**Cambio de visibilidad:** a diferencia de `requiere_estudio_socioeconomico` (que se queda exclusivo del reclutador, ya que normalmente lo hace la empresa directamente, sin involucrar al candidato antes), `requiere_examen_medico` y `requiere_antidoping` ahora **también son visibles al candidato** — se muestran como avisos adicionales dentro del bloque "⚠️ Información importante" del portal público (junto a las letras chiquitas), ej. "Se realizará examen médico" / "Se realizará prueba antidoping".

---

### HU-21: Kanban global del coordinador con panel de reclutadores
**Como** coordinador, **quiero** ver el pipeline completo de cualquiera de mis reclutadores sin poder alterarlo por accidente, **para** supervisar el avance de toda la agencia desde un solo lugar sin arriesgar el trabajo operativo del reclutador.

> *Origen: idea de José, 2026-08-07 — implementada y verificada en vivo 2026-08-10 en `app/coordinador/pipeline/page.tsx`.*

**CA-21.1 — Panel de reclutadores:** La pantalla muestra primero una lista de los reclutadores de la agencia. Al seleccionar uno, se despliega su pipeline (Kanban) completo, filtrado únicamente a las postulaciones que ese reclutador gestiona.

**CA-21.2 — Modo solo lectura, sin excepción:** El Kanban global usa un componente dedicado, `KanbanCardSoloLectura.tsx`, sin ningún botón de acción (mover etapa, descartar, contactar, etc.) — decisión explícita para que el coordinador nunca pueda alterar por accidente el pipeline operativo de un reclutador. Reutiliza los mismos badges ya definidos para el Kanban del reclutador: "Sin actividad 72h", "Historial previo" y "No efectivo".

**CA-21.4 (nueva, 2026-08-19) — Chat visible al coordinador (solo lectura):** cada tarjeta del Kanban global tiene un botón "💬 Ver chat" que abre, en modal, la conversación completa entre el reclutador y ese candidato — sin caja de texto para escribir, sin marcar mensajes como leídos. No contradice CA-21.2: esa regla prohíbe botones que **alteren** el pipeline (mover etapa, descartar, contactar); ver una conversación ya existente es consulta pura, mismo criterio que ya se usó en CA-13.4. `ChatWindow.tsx` gana un prop nuevo `soloLectura` para este caso — reutiliza el mismo componente en vez de duplicar la lógica de mensajería.

**CA-21.3 — Layout de pantalla completa:** A diferencia del resto del portal coordinador, esta vista específica no usa el contenedor `max-w-7xl` — el Kanban ocupa el ancho completo de la pantalla, con altura ajustada al viewport (`calc(100vh - 180px)`), para dar espacio real a las columnas horizontales. Este ajuste aplica solo a la vista del Kanban seleccionado, no a la lista de reclutadores.

**CA-21.4 — Candidatos vetados excluidos:** Igual que en `/reclutador/pipeline`, los candidatos con `vetado = true` no aparecen en este Kanban (ver CA-19.3) — quedan visibles únicamente desde el panel de "Candidatos vetados" (CA-19.6).

> **Nota de seguridad pendiente:** al construir esta tarea se confirmó que la política RLS `postulaciones_select_publico` tiene `qual = true` (sin restricción alguna) — cualquier cliente con la key `anon` puede leer todas las postulaciones de todas las agencias, no solo la propia. Se documenta aquí como hallazgo para la auditoría general de RLS (Sprint 7/QA); no se corrigió al construir esta tarea para no desviar su alcance.

---

### HU-22: Chat interno coordinador↔reclutador
**Como** coordinador o reclutador, **quiero** un canal de chat directo entre nosotros dentro de la plataforma, **para** resolver dudas operativas sin depender de WhatsApp personal, consistente con el principio de "generador de confianza" (chat interno trazable en vez de WhatsApp personal).

> *Origen: alcance definido desde plan MVP (portal coordinador, sección 6). Implementado y verificado en vivo 2026-08-10 a 2026-08-16 en `app/coordinador/chat-reclutadores/page.tsx` y `app/reclutador/chat-coordinador/page.tsx`.*

**CA-22.1 — Un solo chat general por par (simplificado, decisión de José 2026-08-16):** El chat es de tipo `reclutador_coordinador`, con **un solo chat general por cada par** reclutador–coordinador — no hay un chat distinto por vacante. El campo `vacante_id` del esquema queda disponible sin usar, como mejora futura si se decide dar contexto por vacante más adelante; no requiere cambios de estructura para activarse.

**CA-22.2 — Mensajería en tiempo real bidireccional:** Ambos lados envían y reciben mensajes en tiempo real vía Supabase Realtime, con componente dedicado `ChatCoordinadorReclutador.tsx` (no reutiliza `ChatWindow.tsx`, que tiene lógica específica del chat con candidato).

**CA-22.3 — Indicador de no leído:** Columna `leido_coordinador` controla el estado de lectura. El coordinador ve un punto rojo en `CoordinadorNav.tsx` (mismo patrón que `ReclutadorNav.tsx` ya usa), y en su lista de conversaciones los chats con mensajes sin leer se muestran con fondo verde, texto en negrita y un puntito indicador.

**CA-22.4 — Ordenar sin ocultar:** La lista de conversaciones del coordinador tiene un selector "Ordenar por": Más reciente / Nombre / Sin leer. Los chats sin leer suben al principio de la lista cuando se elige esa opción, pero nunca se ocultan ni se filtran — el coordinador siempre ve la lista completa (aclaración explícita de José: quería orden, no filtro).

**CA-22.5 — Un único chat garantizado por par (integridad de datos):** La creación del chat general está protegida por un índice único a nivel de base de datos (`tipo`, `reclutador_id`, `coordinador_id`, solo cuando `vacante_id is null`), para que nunca se generen chats duplicados aunque ambos lados intenten "buscar o crear" el chat casi al mismo tiempo al cargar sus páginas. Si la creación falla por el índice, el sistema vuelve a buscar el chat ya existente en vez de fallar.

**CA-22.6 — Sonido de notificación descartado por ahora:** Se decidió priorizar el contador numérico visible en el nav en vez de un sonido de notificación, evitando además las limitaciones de autoplay de audio en navegadores. Queda como posible mejora futura, no como pendiente bloqueante.
