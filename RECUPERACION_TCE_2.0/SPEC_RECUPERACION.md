SPEC_RECUPERACION — TuChambaExpress 2.0

> Lectura vigente — PO-REC-FASES-01 (2026-11-08): consultar al final «PO-REC-FASES-01 — fases vigentes y estados de evidencia». Conserva las cuatro fases existentes y precisa F2; Validación es actividad/puerta obligatoria, no fase general independiente. Cabecera 0.1 y estados históricos se conservan sin ratificación integral; estado consolidado F2 en TASKS/PLAN, bloques PO-REC-FASES-01.
Versión: 0.1 | Estado: Propuesta pendiente de aprobación del PO | Alcance: recuperación, estabilización, mejoras y agentes IA.
1. Objeto
Establecer criterios verificables para recuperar y evolucionar la implementación existente, sin confundir documentación histórica con comportamiento real ni alterar producción sin autorización.
2. Fases obligatorias y puertas de salida
•	F1 Auditoría integral: código, arquitectura, autorización, Supabase/RLS, funcionalidad por rol, integridad, rendimiento, dependencias y documentos. Salida: inventario, hallazgos únicos, evidencia, severidad, certeza, limitaciones y plan de validación aprobados.
•	F2 Reparación y estabilización: corregir causas raíz, probar regresiones, integridad, seguridad y operación. Salida: hallazgos cerrados con evidencia, excepciones explícitas y aceptación del PO.
•	F3 Mejoras: registrar y priorizar solicitudes nuevas, criterios de aceptación, diseño, pruebas y despliegue controlado. Salida: mejoras aceptadas individualmente.
•	F4 Agentes IA: contratos de agente, permisos, privacidad, pruebas adversariales, supervisión y activación gradual. Salida: pilotos y controles aprobados.
Ninguna fase se declara cerrada por porcentaje estimado o afirmación de una IA.

### Registro específico TCE-007 — 2026-11-06

Confirmado estáticamente: el login por código guarda la identidad en localStorage y no establece una sesión verificable de reclutador. Se requiere reestructurar el ciclo de identidad; su reparación pertenece a F2 (estabilización), no a F3 (mejoras), y no está iniciada ni autorizada para implementación.

Experiencia aprobada por el PO: código individual + contraseña; alta y recuperación gestionadas por coordinador con autoridad vigente. Autorización por identidad, recurso y agencia obligatoria. Contraseña temporal y cambio inicial obligatorio se conservan como diseño propuesto para esta intervención.

Primera alternativa técnica: Supabase Auth, pendiente de validar la compatibilidad con código personalizado y ausencia de correo obligatorio. No se aprueba definitivamente resolver el código mediante teléfono, otra identidad interna ni el detalle de sesiones o recuperación. Turnstile y límites de intentos son controles complementarios propuestos, no implementados. Dependencia con TCE-005; posibles dependencias con TCE-008/TCE-009 sujetas a diagnóstico. Sin autorización para modificar esquema, RLS o producción. Las versiones 0.1 mantienen su condición de propuesta.

### Diagnóstico TCE-009 y requisitos propuestos para F2 — 2026-11-06

Confirmado en código el uso de reclutadorId y precalificación suministrados por navegador sin autorización/evaluación de servidor; escritura efectiva condicionada por RLS y restricciones pendientes. No se acepta agenciaId del cuerpo: la agencia procede de la vacante. Se propone para F2 atribución validada por relación activa reclutador-vacante-agencia, identidad verificable en alta manual, vínculo legítimo con candidato y precalificación calculada en servidor. Política de referido/fallback y criterios específicos requieren aprobación del PO; no se convierten en nuevas decisiones aprobadas. Dependencias TCE-007/TCE-008; evidencia detallada en ficha TCE-009. Sin implementación, esquema ni producción autorizados. Se preserva F1 exclusivamente diagnóstica.

### Diagnóstico TCE-010 y garantías propuestas para F2 — 2026-11-06

Confirmadas estáticamente las llamadas independientes de creación de corte, marcado de postulaciones y actualización de agencia, sin manejo completo de errores ni idempotencia visible. Corrupción efectiva, duplicados y permisos dependen de BD/RLS pendientes de validación. Se propone como requisito F2 atomicidad por comando de negocio, autorización por actor/agencia, total consistente con filas asociadas, idempotencia durable y tratamiento explícito de ajustes posteriores a liquidación. Los criterios técnicos y de negocio requieren aceptación del PO; no se autoriza implementación ni cambio de esquema. Evidencias, escenarios y dependencias TCE-007/TCE-009/TCE-011 en ficha TCE-010. F1 continúa diagnóstica y versiones 0.1 como propuesta.

### Diagnóstico TCE-011 y consistencia propuesta para F2 — 2026-11-06

Confirmado estáticamente: transiciones e historial/efectos relacionados se ejecutan mediante llamadas independientes; reglas de etapas y requisitos residen en interfaz, con comprobación incompleta de checklist; descarte masivo solo archiva explícitamente el chat principal. Los estados efectivos dependen de BD/RLS/triggers no verificados. Se propone para F2 una transición autorizada y atómica del estado nuclear e historial, validación servidor de requisitos, concurrencia/idempotencia y entrega consistente de efectos/notificaciones, compartida con TCE-010. Política de descarte masivo, requisitos documentales y criterios de cierre requieren PO. Sin implementación o cambio de esquema autorizado; evidencia y límites en ficha TCE-011. F1 sigue diagnóstica, borradores sin ratificación integral.

### Diagnóstico TCE-012 y delimitación multiagencia propuesta para F2 — 2026-11-06

Confirmado estáticamente el alcance global de toggle, edición y DELETE de reclutadores desde el coordinador, pese a listado filtrado por agencia; las escrituras directas dependen de RLS y restricciones no verificadas. Propuesta F2: separar identidad/estado global de relación por agencia; autorizar cada comando y preservar postulaciones/chats/comisiones/historial. Autoridad para bloqueo/eliminación global y edición compartida requiere decisión del PO, no se presume del acceso al listado. La descripción reconstruida antigua menciona coordinadores y se conserva para conciliación; este diagnóstico corresponde a reclutadores según mandato actual. Evidencia y límites en TCE-012. Sin implementación o esquema autorizado; F1 diagnóstica.

### Diagnóstico TCE-013 y aislamiento propuesto para F2 — 2026-11-06

Confirmado estáticamente: pipeline principal del coordinador consulta postulaciones por reclutador sin agencia, pese al listado de relaciones filtrado; mezcla efectiva condicionada por RLS. Se propone F2: agencia derivada de identidad verificada, filtro conjunto agencia/reclutador, autorización por recurso y rechazo sin alcance válido. Distinguir tablero de consulta de pestaña Detalles candidato, que sí tiene escritura de checklist por ID sujeta a RLS. Realtime y relaciones embebidas deben respetar el mismo aislamiento. Evidencia/validaciones en ficha TCE-013; dependencias TCE-012/TCE-007 y documentos TCE-001. No se cambia el antecedente de TCE-012 ni se autoriza implementación, esquema o producción.

### Diagnóstico TCE-014 y consumo de invitaciones propuesto para F2 — 2026-11-06

Confirmado estáticamente: se valida token pero se usa invitacionId del cliente para vincular agencia y consumir invitación; alta/consumo independientes y error final no verificado. Formato UUID/cadena compatible, sin discrepancia reproducida. Caducidad/usado y emisión por administrador activo existen; uso único concurrente, revocación y garantías BD pendientes. Propuesta F2: ID derivado de token, reserva/consumo condicional e idempotente, finalización transaccional de relaciones y consumo con recuperación de fallos de Auth externo. Política de destinatario, hash/recopia de tokens y revocación requiere PO. Evidencia en TCE-014, sin cambio de TCE-004, esquema o producción autorizado.

### Diagnóstico TCE-015 y publicación de vacantes propuesta para F2 — 2026-11-06

Confirmado estáticamente que salario y empresa ocultos permanecen en consultas/props/estado públicos; renderizado condicional no constituye redacción de datos. SEO explícito sí respeta banderas. Propuesta F2: proyección pública mínima con omisión/anulación según banderas, búsqueda y recargas coherentes y restricción de acceso directo a columnas base; proyección privada y exportación solo para roles autorizados, conservando permisos funcionales documentados. RLS/valores reales y contenido de textos/archivos pendientes de validación, sin filtración efectiva afirmada. Ficha TCE-015 contiene evidencia, pruebas propuestas y dependencias; ninguna implementación, cambio de esquema o producción autorizado.

### Diagnóstico TCE-016 y completitud de listados propuesta para F2 — 2026-11-06

Confirmado estáticamente: páginas públicas de 15 filas en memoria, listados sin recorrido de páginas y filtros/conteos locales de lotes; existen top-N explícitos como histórico administrativo de 500, sin equivaler a colección completa. Máximo API y truncamiento/rendimiento reales pendientes. Propuesta F2: consultas autorizadas acotadas, filtros/orden/búsqueda en BD con desempate estable, count/has_more y continuidad explícita; resúmenes agregados y detalles diferidos donde corresponda. Conservar proyección TCE-015 y aislamiento TCE-013. Evidencia/validaciones en TCE-016; no se autoriza código, índices o esquema ni se realizan pruebas de carga en F1.

### Diagnóstico TCE-017 y dependencias propuestas para F2 — 2026-11-06

Inventario y coherencia manifiesto/lock confirmados; metadatos locales avisan seguridad/deprecación de Next 14.1.4 y fin de soporte de ESLint/transitivas. Utilidades Tailwind 4 instaladas con Tailwind 3 presentan desalineación documentada; impacto real pendiente. No se declara CVE o abandono de xlsx sin fuente específica verificable. Propuesta F2: contrastar avisos/soporte externos con autorización, fijar runtime/gestor, actualizar grupos compatibles mediante lock reproducible y probar Auth/SSR, TCE-004, UI y Excel en aislamiento. No instalar ni actualizar durante F1. Evidencia/pendientes en TCE-017; la revisión de 17 IDs no cierra F1: requiere consolidación, conciliación y aceptación posterior del PO.

3. Invariantes de trazabilidad — obligatorios
R-DOC-001: Todo trabajo lleva ID permanente REC-<FASE>-<NNN> y relación a requisito SPEC, procedimiento PLAN, tarea TASKS, hallazgos y evidencias.
R-DOC-002: Antes de tocar código: registrar alcance, estado anterior, riesgo, archivos, criterios de aceptación, pruebas, autorización y reversión. Si no está documentado, no se implementa.
R-DOC-003: Durante la ejecución: registrar decisiones, desviaciones, nuevos hallazgos y resultados al ocurrir. No dejar actualizaciones para el cierre del sprint.
R-DOC-004: Al terminar cada tarea: actualizar TASKS_RECUPERACION.md con estado real, evidencia verificable, archivos afectados, pruebas ejecutadas/no ejecutadas, bloqueos, decisión de aceptación y siguiente paso. Una casilla marcada sin evidencia no es cierre.
R-DOC-005: Cada commit debe vincularse a una tarea y documentar objetivo, alcance, archivos, pruebas, riesgos, hash y relación con otros commits. Antes del commit, preparar documentación y mensaje; después, registrar el hash definitivo en la bitácora documental y asociarlo a la tarea. Si requiere un commit documental posterior, registrar también ese hash; el cierre administrativo ocurre tras reconciliar la trazabilidad.
R-DOC-006: Todo cambio que afecte requisitos actualiza SPEC; el que afecte diseño o ejecución actualiza PLAN; todo avance actualiza TASKS. Los documentos históricos se modifican solo mediante decisión explícita y referencia cruzada, nunca silenciosamente.
R-DOC-007: Si documentos, código y evidencia discrepan, suspender la aceptación, registrar conflicto y solicitar resolución. No falsificar sincronización.
R-DOC-008: Los informes deben distinguir CONFIRMADO_ESTÁTICAMENTE, CONFIRMADO_POR_PRUEBA, PROBABLE, PENDIENTE y DESCARTADO_CON_EVIDENCIA.
R-DOC-009: No modificar producción, datos reales, Supabase, despliegues, ramas protegidas ni permisos sin autorización específica. Si se confirma riesgo activo, elevar contención urgente al PO; la prohibición de corregir durante auditoría no impide proponer contención.
R-DOC-010: Toda tarea terminada exige verificación de estado Git y conciliación de documentos. La ausencia de cambios inesperados también se documenta.
4. Criterios de aceptación por tarea
Una tarea solo puede cerrarse cuando:
(a) cumple criterio verificable;
(b) registra evidencia reproducible;
(c) informa pruebas no ejecutadas;
(d) identifica efectos colaterales y rollback;
(e) mantiene SPEC/PLAN/TASKS sincronizados;
(f) relaciona commits o indica SIN_COMMIT con motivo;
(g) recibe aprobación correspondiente.
5. Hallazgos existentes
La primera auditoría estática local identificó TCE-001 a TCE-017. Son hallazgos preliminares con impacto real pendiente de validación según el informe original; conservar IDs y referencias sin convertir automáticamente sus conclusiones en hechos de producción.
El informe completo debe incorporarse como evidencia controlada antes de su cierre.
6. Alcance excluido por ahora
No se autorizan reparaciones, pruebas contra producción, despliegues, mejoras ni agentes operativos durante F1, salvo aprobación expresa de medidas de contención urgente.
7. Pendientes para ratificación
Confirmar responsables, política de ramas/commits, ubicación de evidencias, reglas de despliegue, alcance de auditoría de Supabase y criterios de aceptación de fase.

## Consolidación F1 y requisitos de aceptación propuestos — 2026-11-06

Cambio propuesto por el agente bajo el mandato del PO «Consolidación final de F1», limitado a preparación documental; versión 0.1 pendiente de aprobación, SIN_COMMIT. No sustituye decisiones funcionales históricas ni DEC-REC-005 y no inicia F2.

Fuente consolidada: HALLAZGOS_RECUPERACION.md, «Consolidación documental de F1», contiene las 17 filas, certeza/límites, impactos, prioridades propuestas, dependencias, correcciones, pruebas y pendientes. PLAN define agrupación y secuencia; TASKS registra continuidad. Las descripciones originales y severidades no recuperadas no se convierten en requisitos aprobados.

Requisitos propuestos para los grupos futuros:
- Identidad y recursos (TCE-001/002/003/005/006/007/008/009/012/013): identidad verificable, pertenencia vigente, permiso por recurso y separación de altas públicas de operaciones privadas; proteger consultas directas mediante controles BD, no solo interfaz. Los diagnósticos individuales no conservados requieren recuperar evidencia antes de concretar cambios.
- Administración (TCE-004): conservar la corrección local existente; validar integración aislada de sesión, cookies, permisos documentados y origen. El commit a26775d54c1374666ed2890ddd032e5c9f563e81 es antecedente local, no evidencia de despliegue ni autorización actual de reparación.
- Integridad (TCE-010/011/014, relacionado TCE-009/012): comandos autorizados con transacción BD cuando corresponda, idempotencia, estados válidos e historial consistente; compensación explícita para Auth y efectos externos que no comparten transacción.
- Publicación y consultas (TCE-015/016, relacionado TCE-002/003/013): excluir campos ocultos antes de entregar respuestas públicas; consultas acotadas y completas conforme al contrato de cada listado, filtros/orden/conteos de servidor.
- Plataforma (TCE-017): resolver seguridad y compatibilidad con evidencia de versiones aplicables; runtime/instalación reproducibles y validación incremental, sin prescribir versiones actuales sin consulta autorizada.

Pendiente de decisión: TCE-012 corresponde a opción C; no hay evidencia para decidir si «coordinadores» y «reclutadores» son el mismo problema o problemas distintos. Conservar ambos antecedentes y delimitar el objeto con el PO/informe original; no renumerar ni retirar requisitos históricos.

Puerta de salida F1 todavía no satisfecha: faltan soportes individuales TCE-001/002/003/005/006; control de originales o aprobación explícita de sustitución; conciliación TCE-012; severidades/prioridades propuestas y plan de validación aprobados; cobertura o excepciones expresas sobre BD/RLS/Storage, funcionalidad por rol, integridad/concurrencia, rendimiento/UX/accesibilidad y seguridad de dependencias. R-DOC-007 mantiene suspendida la aceptación en los conflictos. No se exige reparar los hallazgos para aceptar el diagnóstico, pero sí documentar alcance, evidencia, riesgos y pendientes sin declarar implementadas las propuestas. Aceptación parcial del entregable estático y cierre de fase son decisiones diferentes, ambas reservadas al PO.

## Soportes estáticos actuales TCE-001/002/003/005/006 — 2026-11-06

Fuente: revisión focalizada autorizada por el PO «Recuperación de soportes faltantes de F1», HEAD 8bcea01e52449ca600e360b87b04eeefe7d63e4f. VERIFICACIÓN POSTERIOR / RECONSTRUCCIÓN ESTÁTICA ACTUAL, no recuperación literal de informes. Esta sección actualiza la condición de los cinco soportes faltantes señalada en la consolidación anterior; no sustituye los demás diagnósticos ni modifica requisitos históricos silenciosamente. Versión 0.1 y propuestas técnicas pendientes de aprobación.

| Hallazgo | Soporte actual y requisito de corrección propuesto para F2 |
|---|---|
| TCE-001 | Falta de autorización confirmada en API de documentos; verificar actor y permiso por candidato/postulación/documento/agencia antes de listar, firmar, subir o borrar. Mantener controles de archivo y consistencia Storage/registro. |
| TCE-002 | Importación/exportación privilegiadas sin sesión/autoridad de agencia; resolver o verificar alcance contra pertenencia del servidor y autorizar empresas/catálogos y vacantes del archivo. |
| TCE-003 | Parcial respecto al título histórico: la ruta es ficha de vacante; ausencia de autorización confirmada allí. Definir audiencia y campos, validar sesión/pertenencia a agencia antes de consultar y separar publicación mínima. No se acredita exposición personal de reclutadores. |
| TCE-005 | Ambos POST de perfil actualizan enlaces por ID sin propietario autenticado; identidad desde sesión y autorización de escritura, conservando GET público y validación de campos de CA-26.6/26.7. |
| TCE-006 | Documentos/pases de negocio sin identidad/permiso; autorización por negocio/recurso/agencia, política explícita de negocios compartidos y privacidad de Storage conforme a uso aprobado. |

Evidencia completa, condiciones, limitaciones y pruebas de aceptación propuestas en HALLAZGOS, subsecciones «Reconstrucción estática actual» de cada ficha y cinco referencias actualizadas de la matriz; secuencia en PLAN y continuidad en TASKS. TCE-007/008 son dependencias de identidad, no soluciones ya implementadas. Usar realmente service_role requiere controles de servidor y no permite presumir protección por RLS ordinaria. El impacto efectivo depende de configuración, restricciones e infraestructura no consultadas.

Cinco soportes actuales cubiertos; originales/severidades históricas y precisión de TCE-003 siguen pendientes. TCE-012 permanece discrepancia C. No se recomienda aún cierre íntegro de F1: aplicar los demás bloqueos/puerta de salida de la consolidación, sin seguir exigiendo como faltantes estas cinco comprobaciones actuales. No se inicia F2 ni se autoriza código, esquema o producción. SIN_COMMIT.

## Propuesta de aceptación documental condicionada F1 y transición — 2026-11-06

Estado: PROPUESTA PENDIENTE DE APROBACIÓN EXPRESA DEL PO. Versión 0.1 conservada. Fuente: mandato «Cierre documental condicionado de F1»; línea base b94d24d12c5684eafe57959459036c6fe0b0a021. Autoría de propuesta: agente bajo ese mandato; no decisión aprobada ni ratificación de gobernanzas.

Se propone distinguir el cierre documental del diagnóstico estático de la aceptación técnica de las correcciones. Las puertas de salida originales de las secciones 2 y 4 no se declaran cumplidas por esta propuesta. Para aceptar un cierre documental condicionado, el PO deberá aprobar explícitamente la delimitación/excepción del alcance integral aún no verificado, con sus riesgos y tareas sucesoras; no se reinterpreta silenciosamente F1 como auditoría integral ya completada.

Condiciones propuestas, todas verificables y pendientes de aceptación:
1. Identificar la versión aceptada mediante commit o instantánea reproducible y alcance exacto; conservar 17 fichas únicas, matriz de 17 filas, evidencia, certeza y límites. El checkpoint b94d24d es la base anterior; los añadidos de esta propuesta están SIN_COMMIT y no se atribuyen a ese hash.
2. Mantener TCE-001 a TCE-017 abiertos hasta corrección autorizada, pruebas pertinentes, revisión y aceptación. TCE-004 sigue EN_VALIDACION local, con pruebas históricas comunicadas y validación integral pendiente.
3. Aceptar expresamente las reconstrucciones estáticas actuales como soporte del código revisado, sin llamarlas originales históricos. Recuperar originales o registrar la sustitución documental aceptada y sus limitaciones; severidades históricas desconocidas no se inventan. Aprobar evaluación actual de riesgo/prioridad y los criterios de validación.
4. Conservar TCE-003 y TCE-012 como discrepancias históricas pendientes, con responsable, tratamiento y momento de revisión definidos por el PO; no eliminar ni renumerar por aceptación del diagnóstico.
5. Aprobar la transferencia de cobertura pendiente a REC-F2-001 a REC-F2-007 de TASKS, vinculadas al mapa de HALLAZGOS y a la secuencia de PLAN. Cada tarea necesita responsable, criterio, evidencia de salida y permiso de entorno específico antes de ejecutarse. Trasladar no equivale a verificar.
6. Preservar Vercel Authentication / All Deployments según información del PO y la corrección local TCE-004. Su efectividad/despliegue no se han comprobado en esta actividad. Retirar protección o publicar exige una decisión distinta y resultados técnicos aceptados.
7. Registrar aprobación de cierre documental y, separadamente, autorización del primer bloque F2: alcance, responsables, entorno aislado, datos sintéticos, operaciones permitidas y límites. Aprobar el documento o el cierre no autoriza por sí solo código, pruebas, migraciones, servicios externos, commits o producción.

Requisitos del primer bloque F2 propuesto: contrato único de identidad y sesiones verificadas en servidor; reclutador con código individual + contraseña conforme a experiencia funcional aprobada, con compatibilidad Auth aún por validar; alta/recuperación por coordinador con autoridad vigente; ciclo de credenciales y revocación; permisos por operación/recurso y pertenencia activa; distinción identidad global/relación de agencia; cobertura de API, SSR, consultas directas, Realtime y Storage. No confiar en IDs/roles/localStorage del navegador como prueba de identidad; documentar controles CSRF y privilegio mínimo. Turnstile/límites siguen controles propuestos, sin proveedor ni configuración activados por este documento.

Criterio de aceptación de arquitectura: matriz actor-operación-recurso-agencia y contrato de sesión completos, rutas/consultas y vínculos Auth identificados, decisiones pendientes resueltas o bloqueadas expresamente, esquema/RLS propuestos contrastados con evidencia autorizada, plan de prueba y reversión revisados y aprobación del PO. Ninguna implementación queda autorizada ahora.

Estado vigente: F1 abierta; F2 no iniciada. Continúan pendientes responsables, aceptación de riesgos/excepciones y autorizaciones específicas. SIN_COMMIT. Enlaces de trazabilidad por ID: tareas en TASKS, procedimiento «Transición condicionada y primer bloque» de PLAN, herencia de hallazgos en HALLAZGOS.

## Formalización del VoBo del PO — cierre documental condicionado F1, 2026-11-06

Autoridad y fuente: propietario del proyecto, instrucción expresa «Formalización del cierre documental F1» de fecha 2026-11-06. El PO declara otorgado su VoBo para el cierre documental condicionado bajo los seis criterios de su mandato anterior. Esta autorización aprueba ese cierre delimitado y un único checkpoint local de HALLAZGOS, SPEC, PLAN y TASKS; no ratifica integralmente las versiones 0.1 ni las gobernanzas.

**Estado vigente de F1: CERRADA DOCUMENTALMENTE CON CONDICIONES.**
**F2: NO INICIADA.**
Los estados previos «F1 abierta» y «propuesta pendiente de aprobación del cierre» se conservan como instantáneas históricas y quedan sucedidos exclusivamente por esta autorización de cierre documental. La propuesta de transición permanece íntegra; sus permisos de ejecución, responsables y validaciones no se consideran concedidos ni realizados por el VoBo.

Alcance de los seis criterios aceptados, sin convertirlos en resultados técnicos:
1. Conservar TCE-001 a TCE-017 ABIERTOS hasta corrección autorizada y validación/aceptación pertinentes. Se mantienen los estados individuales de seguimiento: TCE-004 EN_VALIDACION, los demás según ficha/registro vigente; no se cierra ningún hallazgo ni tarea por el cierre de fase documental.
2. Reconocer las reconstrucciones estáticas actuales como soporte documental del código y versión revisados; no son informes históricos recuperados ni certificados de producción. Informes originales y severidades históricas no recuperadas siguen identificados como tales. El VoBo acepta el soporte actual con esta limitación, no inventa los originales.
3. Mantener pendientes las discrepancias históricas TCE-003 (título sobre reclutadores frente a ficha de vacante revisada) y TCE-012 (coordinadores frente a reclutadores, opción C); no resolverlas ni renumerarlas por inferencia.
4. Transferir expresamente las verificaciones de BD/RLS/Storage/infraestructura/seguridad/integración y cobertura pendiente a REC-F2-001 a REC-F2-007, con sus criterios de aceptación y dependencias ya registrados. Todas permanecen PENDIENTES, sin pruebas ni consultas ejecutadas; responsables y permisos de entorno por definir antes de iniciar. La cobertura no realizada es reserva del cierre documental, no auditoría integral aprobada como probada.
5. Conservar protección temporal de Vercel Authentication / All Deployments según información del PO y corrección local TCE-004 del commit a26775d54c1374666ed2890ddd032e5c9f563e81, pendiente de validación integral. No se accede a Vercel, no se verifica la protección ni se acredita despliegue de la corrección; no retirar/debilitar protección ni publicar sin autorización específica.
6. Registrar REC-F2-001, arquitectura de identidad, sesiones, autorización y aislamiento multiagencia, como siguiente bloque de diseño. Registrarlo no inicia la tarea, la fase ni la implementación; requiere autorización delimitada posterior.

Límites expresos: el cierre es documental y condicionado, no cierre técnico de defectos, aprobación de seguridad global, validación integral de BD/infraestructura ni autorización comercial o productiva. No nuevas pruebas de producto, cambios de código/configuración/dependencias, migraciones, datos reales, servicios externos ni despliegues. La falta de evidencia técnica continúa bloqueando aceptación/habilitación de la operación correspondiente. Los siete puntos operativos de la propuesta SPEC y los criterios técnicos de TASKS se conservan como planificación/condiciones; este registro no afirma que todos estén cumplidos.

Trazabilidad: propuesta precedente y matriz de 17 hallazgos en HALLAZGOS; condiciones/alcance en SPEC; transferencia y secuencia en PLAN; siete tareas y continuidad en TASKS. Línea base anterior: b94d24d12c5684eafe57959459036c6fe0b0a021. El checkpoint nuevo comprenderá la propuesta preservada y esta formalización; su hash no se anticipa y se entregará después del único commit autorizado. Este registro no se atribuye al hash anterior.

Aplicación a requisitos: el PO acepta la delimitación del cierre documental y la transferencia de verificaciones pendientes bajo los seis criterios, sin afirmar cumplimiento técnico integral de la puerta de salida original. Los requisitos vigentes y criterios de aceptación de tareas/correcciones conservan su exigibilidad. Cualquier condición incumplida se registra y se somete al PO; no se borra evidencia ni se amplía esta excepción a publicación o ejecución F2.

## REC-F2-001 — criterios funcionales aprobados por el PO, 2026-11-06

Autoridad/fuente: propietario del proyecto, VoBo otorgado el 2026-11-06 y comunicado expresamente mediante «REC-F2-001: registro de decisiones aprobadas». Se aprueban los cuatro criterios funcionales siguientes. No se aprueba definitivamente una alternativa de implementación, esquema, sesión o proveedor adicional ni se declara aceptada REC-F2-001.

1. Reclutadores: acceso mediante código individual y contraseña. No exigir correo ni SMS en cada inicio de sesión.
2. Multiagencia: identidad global única, con membresías, estados y permisos independientes por agencia. Un coordinador no puede suspender globalmente a un reclutador por tener autoridad sobre una sola agencia.
3. Recuperación: coordinadores autorizados pueden gestionar solicitudes de recuperación bajo un procedimiento verificable. No adquieren automáticamente control sobre la identidad global de reclutadores compartidos.
4. Candidatos: mantener postulación pública sencilla, sin registro obligatorio. El acceso a expedientes, conversaciones y documentos privados requiere credencial o mecanismo verificable limitado al recurso.

Estos acuerdos vinculan el diseño posterior y precisan las ambigüedades funcionales anteriores, conservadas como historial. No se presenta como resuelta la compatibilidad técnica con Supabase Auth: el código de reclutador no se presume identificador nativo de contraseña. Supabase Auth sigue como primera alternativa a evaluar; no se permite sustituirlo silenciosamente por contraseñas propias.

Pendientes técnicos y alternativas NO APROBADAS:
- Mapeo código-identidad Auth: teléfono real normalizado y verificado, sujeto a unicidad/teléfonos compartidos/cambio de número/configuración; correo real como alternativa solo si compatible con el requisito sin correo obligatorio; proveedor adicional o autenticación propia implican otro alcance y aprobación. No usar correos ficticios inseguros ni asumir soporte de username arbitrario. No se requiere ni aprueba SMS/correo en cada login.
- Transporte de sesión: SSR con cookies y SDK de navegador, o mayor intermediación del servidor; elección pendiente. No afirmar HttpOnly si el SDK necesita acceso de navegador. Definir renovación, logout efectivo, expiración y revocación de accesos emitidos, no solo refresh tokens.
- Alta y recuperación: entrega, caducidad/uso único de credencial temporal, cambio inicial obligatorio como diseño propuesto, verificación de identidad, autoridad multiagencia y compensación ante fallos Auth/BD. Solicitar recuperación no equivale a permiso de sustituir credenciales globales.
- Candidato: sesión/capacidad limitada al recurso u otra prueba verificable; teléfono, chatId, nombre y localStorage no constituyen por sí solos identidad. Elegir recuperación entre dispositivos y tratamiento de postulaciones existentes sin devolver datos privados por teléfono.
- Estado/roles: vínculo estable con Auth, separación de perfiles y membresías, permisos por operación y recurso, coexistencia de roles y fuente de estado confiable; garantizar denegación ante agencia o identidad inactiva según contrato. No otorgar rol administrativo por es_maestro del reclutador.
- RLS/Storage, CSRF, antiabuso/Turnstile y límites, compatibilidad de versiones/configuración e integración real permanecen por validar. No se modifican ni prueban aquí.

Criterios de aceptación propuestos para el diseño/validación técnica, no resultados:
- Demostrar viabilidad código + contraseña sin correo/SMS habitual sobre identificador Auth legítimo y documentar casos no cubiertos; contrastar contrato del SDK con configuración de entorno de prueba autorizado.
- Con dos agencias y un reclutador compartido, demostrar aislamiento de membresías, permisos y recursos; una acción autorizada en A no suspende identidad global ni habilita acceso a B.
- Recuperación exige solicitante autorizado, alcance vigente, evidencia mínima de verificación, caducidad/uso único/revocación definidos y decisión sobre autoridad global; un coordinador ajeno no obtiene control ni información privada.
- Postulación pública funciona sin registro; expediente/chat/documento privado se rechaza sin mecanismo válido o con recurso diferente, expirado o revocado. No recuperar historial solo por teléfono.
- Completar matriz actor-operación-recurso-agencia, contrato de sesión y plan de regresión/reversión; distinguir observado, propuesto y probado, con límites y revisión del PO antes de aceptar REC-F2-001. Fallos de autenticación/autorización impiden efectos privilegiados.

Dependencias: REC-F2-002 (BD/RLS), 003 (Storage), 004 (aislamiento/infraestructura), 005 (seguridad), 006 (integración); TCE-005/007/008/009/012/013 y recursos TCE-001/002/003/006. TCE-003 y TCE-012 mantienen sus discrepancias históricas; resolver un criterio futuro no recupera sus informes originales.

Siguiente actividad propuesta: viabilidad técnica de autenticación y sesiones, con comparación y plan de validación aislada; no se ejecuta por este registro. REC-F2-001 permanece EN_CURSO en análisis/diseño, sin aceptación final ni implementación. F1 continúa CERRADA DOCUMENTALMENTE CON CONDICIONES, los 17 hallazgos ABIERTOS y REC-F2-002 a REC-F2-007 PENDIENTES. Protección temporal de producción y corrección local TCE-004 conservadas, sin comprobación remota.

## REC-F2-001 — viabilidad local y requisitos de laboratorio, 2026-11-06

Fuente/autorización: PO «REC-F2-001: documentación de viabilidad y preparación de laboratorio»; exclusivamente registro en cuatro documentos. Base Git: a3b536d6967d54ac83048192127514fd16b73e2b. Estudio previo de lectura registrado en conversación; versiones y referencias del SDK reconsultadas localmente al documentar. No pruebas de Auth ni servidor externo. Este bloque no modifica los cuatro criterios funcionales aprobados ni aprueba una alternativa técnica.

### Evidencia local comprobada y límites

| Componente instalado | Versión | Evidencia local / alcance |
|---|---|---|
| Next.js | 14.1.4 | node_modules/next/package.json:3,320; exige Node >=18.17.0 |
| supabase-js | 2.110.0 | node_modules/@supabase/supabase-js/package.json:3,113; exige Node >=22.0.0 |
| auth-js | 2.110.0 | node_modules/@supabase/auth-js/package.json:3,48; exige Node >=22.0.0 |
| ssr | 0.12.0 | node_modules/@supabase/ssr/package.json:3,46–47; peer supabase-js ^2.108.0, satisfecho por versión instalada |

Contratos disponibles: node_modules/@supabase/auth-js/src/lib/types.ts:637–644 admite email/password o phone/password; GoTrueClient.ts:1173–1203 implementa esas dos ramas, no código arbitrario/username. El código del reclutador requiere resolver una identidad Auth admitida; no basta enviarlo a signInWithPassword. GoTrueClient.ts contiene OAuth:1312, intercambio PKCE:1491, OTP:2181, verificación OTP:2372, SSO:2472, getUser:3115, updateUser:3297, refreshSession:3692 y signOut:3949. Su existencia no prueba habilitación/configuración del servidor ni compatibilidad con un proveedor concreto.

GoTrueAdminApi.ts:485–505,789–805 expone creación/actualización por ID delegadas a servidor; no aporta transacción con tablas de aplicación. Sus comentarios:413–415 exigen legitimidad/verificación antes de marcar email/phone confirmado. No se considera comprobada la propiedad de un teléfono o correo por asignarle un booleano.

Limitaciones de sesión comprobadas en el SDK: GoTrueClient.ts:3908–3949 documenta scopes local/global/others, global por defecto, y JWT emitido válido hasta expiración pese a logout. No se confunde revocación de renovación con invalidación inmediata de acceso. lib/types.ts:1945–1959 incluye session_id en el contrato de claims, no evidencia de un token productivo.

SSR: node_modules/@supabase/ssr/src/utils/constants.ts:3–9 configura sameSite=lax, httpOnly=false y maxAge de cookie de 400 días; esto no demuestra duración real de sesión/JWT. createServerClient.ts:44–84 requiere propagación getAll/setAll y:153–156 usa PKCE, autoRefreshToken=false y persistencia; las actualizaciones pueden ocurrir al cargar/verificar sesión. No asumir renovación automática continua en servidor ni cookies HttpOnly compatibles con un navegador que necesita leer tokens.

### Alternativas aún NO APROBADAS

| Alternativa | Seguridad / cobertura | Complejidad, mantenimiento y experiencia | Evidencia faltante |
|---|---|---|---|
| Código a teléfono real y Auth | Requiere número legítimo, normalizado y vínculo seguro; ausente/compartido/reciclado impide tratarlo como solución universal | Cambio moderado; mantiene código/contraseña sin SMS habitual, pero recuperación/cambio de número delicados | Reglas del servidor, unicidad, confirmación y política de números compartidos/ausentes |
| Código a identidad técnica administrada y Auth | Podría no depender de teléfono/correo personal; exige namespace/dominio bajo control, ciclo de propiedad y recuperación, sin identidades personales falsas | Mayor operación de identidades; login puede mantener código/contraseña sin buzón personal | Aprobación PO, documentación oficial vigente y pruebas Auth/configuración; aceptación por SDK no acredita seguridad del sistema |
| Correo personal real opcional, proveedor adicional o autenticación propia | Opciones de comparación, no sustitución silenciosa de requisitos; correo obligatorio no cubre a todos, sistema propio añade custodia de contraseñas | Proveedor/sistema adicional amplía alcance y mantenimiento; no recomendado como atajo | Nueva decisión de alcance y compatibilidad; contraseñas propias/correos ficticios inseguros no autorizados |

Recomendación provisional: conservar Supabase Auth como verificador y comparar primero teléfono real e identidad técnica administrada en laboratorio autorizado. Ninguna seleccionada; no prometer cobertura universal del teléfono ni viabilidad definitiva del alias técnico. El código no es secreto; conocer el identificador nativo tampoco debe conceder permiso.

### Requisitos propuestos de validación

Identidad global y perfil vinculados por ID estable; código único como identificador operativo, membresías/estados/permisos por agencia independientes. No fusionar por teléfono/nombre ni permitir que una recuperación desde una agencia domine una cuenta global. Falta aprobar autoridad final, verificación de solicitante/destinatario, entrega, caducidad, consumo y revocación.

Contraseña temporal Auth no garantiza uso único/caducidad específica/cambio inicial: comparar credencial de activación limitada con controles de servidor/BD y contraseña inicial Auth con bloqueo de negocio. No almacenar contraseñas permanentes propias. Hash de un token de activación es un mecanismo diferente de almacenar contraseñas; su uso sigue propuesto. Fallos Auth/BD y concurrencia requieren recuperación consistente, no presunción de transacción entre servicios.

Consultas directas/Realtime/Storage deben aplicar identidad y pertenencia actuales; API con privilegios de servicio exige autorización explícita. Decidir SSR/browser frente a intermediación servidor; cookies HttpOnly no pueden imponerse aisladamente si el SDK necesita leerlas. Privados de candidato requieren credencial limitada al recurso, no teléfono/chatId; revocar una capacidad no invalida necesariamente URL firmada ya emitida. Definir vida acotada o descarga intermediada según revocación requerida.

Laboratorio: entorno independiente con datos sintéticos, endpoints exclusivamente locales y salida de red denegada por defecto; sin credenciales, datos, copias de configuración o recursos productivos. Auth/BD/Storage locales o dobles identificados como tales; dobles no acreditan comportamiento del backend real. Runtime satisface Node >=22 y versiones fijadas. No se declara disponible ni se instala/inicia ahora. Aislamiento aprobado antes de crear identidades o ejecutar experimentos. Protocolo/matriz única de experimentos en PLAN; seguimiento y vínculos REC-F2-002/003/004/005/006 en TASKS.

Aceptación futura: resultados reproducibles por versión/entorno, entradas sintéticas y criterios de rechazo de PLAN; fallos/no ejecutados explícitos, sin secretos en evidencia. La documentación externa necesaria (Auth/configuración, cambios de identidad, restricciones de sesiones y proveedor antiabuso) no fue consultada; exige autorización posterior. REC-F2-001 EN_CURSO solo diseño, sin aceptación final ni viabilidad definitiva. F1 cierre documental condicionado; 17 hallazgos abiertos, TCE-003/012 pendientes, TCE-004 y protección Vercel preservados. SIN_COMMIT.

## REC-F2-004 — aislamiento mínimo local implementado, 2026-11-06

Fuente/autorización: PO «REC-F2-004: implementar aislamiento mínimo», sobre master y HEAD 40dab9b14b2779386bec0a36ce9a268f07ed3ecb. Alcance: lanzador de configuración/copia y telemetría, pruebas locales de rechazo con valores ficticios y actualización de cuatro documentos; no conexión, migraciones, servicios, credenciales reales ni commits.

Laboratorio confirmado por el PO, sin verificación remota: TCE-2-LAB, ref ieioysefckvafdbasqxl, organización Free, región East US (North Virginia), Compute Nano. TuChamba-V2-Oficial permanece producción y fuera de alcance. Este dato sucede a las instantáneas anteriores que decían «no provisionado» solo respecto del proyecto externo informado; aislamiento efectivo, esquema y viabilidad integral siguen sin acreditarse.

Implementado localmente:
- scripts/lab-launcher.cjs y comandos lab:check/lab:prepare: verificación offline y preparación de copia, sin arrancar Next ni Supabase. No se lee .env ni se importa un cargador de entorno. Archivo previsto, NO creado: .lab-private/lab.config.json, ignorado por Git.
- Configuración estricta con cuatro nombres: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY y NEXT_PUBLIC_APP_URL. URL exacta https://ieioysefckvafdbasqxl.supabase.co y único origen permitido https://localhost:3443. No se configura ni acredita TLS ahora.
- Rechazo por nombres de variables Supabase heredadas, origen/modo heredados; entorno previsto para ejecución construido por allowlist sin NODE_OPTIONS, NODE_PATH, proxies o variables públicas ajenas. No se leen ni imprimen valores Supabase del padre al rechazarlos.
- Claves legacy: comprobación offline de claims ref/rol para detectar errores accidentales de proyecto y evitar service_role en la ranura pública. NO verifica firma, validez criptográfica, permisos ni correspondencia real con el backend. Claves opacas sin ref comprobable se rechazan; compatibilidad con esas claves BLOQUEADA hasta procedimiento autorizado. Nunca llamar a esta validación una autenticación del proyecto.
- Copia nueva en directorio temporal fuera del repositorio: manifiesto Git y allowlist de fuentes/activos; sin .git, .env*, privados convencionales, dependencias, documentos, cachés, enlaces simbólicos/junctions ni artefactos previos. No se copian valores de configuración. No se sobrescriben directorios existentes.
- Modo NEXT_PUBLIC_TCE_LAB_MODE=true: omitir scripts y noscript GTM/Meta Pixel y llamada Lead; origen de metadatos local. Flags ausentes conservan las ramas previas no laboratorio. Telemetría interna del CRM no se convierte en un sistema distinto por este cambio.
- next.config.js bloquea arranque/compilación completa en modo o copia de laboratorio: primero valida configuración, luego LAB_SERVICES_NOT_AUTHORIZED. También falla si se intenta usar la copia sin modo de laboratorio. No hay permiso implícito para eliminar el bloqueo.

Aceptación comprobada solo en aislamiento local: suite tests/lab-isolation.test.cjs, 18 PASS, 0 FAIL, 0 SKIP; casos sin configuración, URL incorrecta/manipulada, variables heredadas, HTTP/origen distinto, claves ajenas/opacas/rol incorrecto, exclusión de privados/enlaces/traversal y arranque bloqueado. TypeScript transpile + minificación offline de dos componentes elimina destinos/eventos de telemetría en las salidas probadas; no es build Next completo ni inspección de bundles desplegados. No se ejecutó TypeScript global, build, suite TCE-004, integración ni nueve experimentos Auth/BD/Storage.

Límites/bloqueos: falta HTTPS confiable, control de salida de red y revisión de permisos del archivo privado antes de introducir claves; copia sin dependencias ni enlaces a node_modules principal, pendiente de provisión autorizada. La allowlist no certifica ausencia de secretos arbitrarios insertados en archivos de código permitidos: no es un escáner de secretos ni sandbox. No se usaron claves reales. No acreditar compatibilidad Auth, RLS, Storage ni esquema por estas pruebas. Mantener TCE-004 intacto, Vercel Authentication sin cambios y TCE-003/012 pendientes; 17 hallazgos ABIERTOS.

REC-F2-004 EN_CURSO solo preparación/aislamiento local, sin aceptación final del laboratorio. REC-F2-001 continúa en diseño; no viabilidad definitiva. Prueba y procedimiento en PLAN, resultado en TASKS y dependencias HALLAZGOS. SIN_COMMIT.

## REC-F2-004 — sonda mínima offline y contrato de endpoint bloqueado, 2026-11-06

Autorización: PO «implementar sonda mínima», exclusivamente código de sonda/validaciones, pruebas simuladas y cuatro documentos; ninguna conexión real. Base master, HEAD 9ecb4dd6c0686228da15f73600d309383c5ba31e. Estado: EN_CURSO en preparación, sin aceptación integral ni viabilidad definitiva; SIN_COMMIT.

lab:probe se añade al lanzador existente sin retirar guardas check/prepare. La CLI termina LAB_PROBE_BLOCKED_ENDPOINT_CONTRACT_AND_NETWORK_AUTHORIZATION antes de abrir archivo privado o red. No hay implementación HTTP/TLS real en scripts/lab-probe.cjs ni argumento para habilitarla. next.config.js y LAB_SERVICES_NOT_AUTHORIZED siguen intactos.

BLOQUEO DE CONTRATO: el SDK instalado documenta construcción de /rest/v1/ (supabase-js/src/SupabaseClient.ts:380) y envío de apikey/Authorization (supabase-js/src/lib/fetch.ts:46–51), pero no garantiza que GET de la raíz sea un endpoint que discrimine claves. auth.getUser exige identidad de usuario y no equivale a validar solo una clave pública. No se ha acreditado un endpoint mínimo apropiado con las fuentes locales disponibles, ni se consultó documentación externa. /rest/v1/ es únicamente candidato para simulaciones, NO endpoint elegido/autorizado para conexión. No concluir que no exista globalmente una opción adecuada.

Perfil privado propuesto: .lab-private/probe.config.json, NO creado. Admite solo NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY; no lee lab.config.json ni admite credencial privilegiada. Rechaza variables Supabase heredadas antes de acceder a valores; URL exacta del laboratorio, claims ref/rol anon legacy y claves opacas no comprobables rechazadas. Claims no verifican firma ni autenticidad.

Validación implementada para lectura futura: archivo regular, tamaño <=16 KiB, no symlink/junction/hardlink, ubicación bajo raíz y exclusión Git; inspección de ACL Windows mediante Get-Acl antes del contenido, tanto directorio privado como archivo. Propietario debe ser usuario actual, herencia deshabilitada y reglas explícitas de acceso solo para ese SID y SYSTEM; SID actual necesita permiso de lectura. Incertidumbre/ACL insegura falla cerrada. No se establece ni modifica una ACL real; el puente Get-Acl y decisiones de política se probaron con respuestas simuladas, no con credenciales existentes.

Control offline: únicamente GET https://ieioysefckvafdbasqxl.supabase.co:443/rest/v1/ (443 implícito en URL canónica); sin query, credenciales URL, fragmento, host/puerto/ruta arbitrarios; descriptor sin proxy, reintentos o redirecciones, exige TLS autorizado y peer esperado. Timeout total máximo 10 s y respuesta máxima 64 KiB por respuesta; descarta cuerpos y sanitiza errores. Estos controles se prueban contra un transporte inyectado de simulación, no son un firewall ni un transporte real acreditado.

La evaluación de pares simula clave ficticia inválida y clave anon ficticia; incluso 401/200 o dos 200 devuelven authenticationValidated=false por contrato no confirmado, httpsReachable=null y mode=OFFLINE_SIMULATION. simulatedHttpsReachable=true describe solo el doble. No se registra aceptación real de clave ni conectividad real; nunca devolver ni imprimir claves/cuerpos.

Pruebas ejecutadas: node --test tests/lab-isolation.test.cjs tests/lab-probe.test.cjs: 36 PASS, 0 FAIL, 0 SKIP (18 previas + 18 de sonda). Configuración ausente/incorrecta, ACL insegura/enlaces, destino/método/TLS ajenos, redirección, timeout, límite de respuesta, errores sanitizados, ausencia de transporte por defecto y CLI/flags bloqueados. Credenciales deliberadamente ficticias; no Supabase/Vercel, SQL, usuarios, datos remotos o servicios.

Pendientes antes de conexión: contrato técnico oficial verificable del endpoint y control negativo, autorización concreta de peticiones, identidad de clave pública y procedencia PO, ACL real sin exponer contenidos y revisión del futuro transporte DNS/TLS/egress. No resolver claves opacas desactivando guardas. HTTPS local y arranque app siguen bloqueados y no son necesarios para una futura sonda HTTPS saliente independiente. TCE-004 y telemetría permanecen intactos.

## REC-F2-004 — cierre offline y contrato pendiente, 2026-11-06

Mandato vigente PO: cerrar sonda, consultar documentación oficial y crear un único commit local con los nueve archivos pendientes si revisión/pruebas pasan. Sustituye las restricciones anteriores de SIN_COMMIT y documentación externa pendiente solo para este alcance; no autoriza red contra proyectos ni arranque. Implementación offline cerrada; REC-F2-004 sigue EN_CURSO, laboratorio sin aceptación integral.

Fuentes oficiales consultadas sin acceder al proyecto: [API keys](https://supabase.com/docs/guides/getting-started/api-keys), [migración](https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys) y [health de Auth](https://supabase.com/kb/troubleshooting/how-do-i-check-gotrueapi-version-of-a-supabase-project-lQAnOR). anon legacy es JWT; publishable es opaca y no permite inferir ref por claims. Ambas son públicas y distintas de la sesión de usuario. La implementación actual admite únicamente el perfil legacy; publishable requiere cambio revisado de configuración/validación y cabeceras, sin convertirla en JWT ni enviarla como Bearer.

Endpoint propuesto solo para evaluación futura: GET https://ieioysefckvafdbasqxl.supabase.co/auth/v1/health con cabecera apikey, sin Authorization, cookies, sesión o parámetros. La fuente oficial lo documenta para versión/salud, sin datos de usuarios; no demuestra el rechazo de claves inválidas. Por tanto el contrato de autenticación sigue BLOQUEADO. GET /rest/v1/ permanece exclusivamente en simulaciones, nunca prueba concluyente.

Criterio propuesto, todavía no acreditado: mismo endpoint/host/método y únicamente apikey diferente; control inválido del mismo formato rechazado explícitamente por clave (401 atribuible al gateway, no a sesión), clave LAB aceptada con 200 y respuesta de health esperada. Dos 200, un 401 genérico, redirect, timeout o error TLS son inconclusos. Requiere evidencia oficial del control negativo aplicable al servicio alojado antes de habilitar transporte; los códigos por sí solos no prueban este contrato.

## REC-F2-001/002 — diseño mínimo de identidad y aislamiento multiagencia, 2026-11-06

Fuente: mandato PO «Continuidad F2 y diseño mínimo multiagencia», base master/65fa41829a1beb0e5c17d467ed6b057ab5120d88. Solo diseño y cuatro documentos, sin código, SQL, migraciones, ejecución, servicios, datos/credenciales reales ni commit. Continúa F2 original; no nueva fase ni auditoría. Autor material: agente bajo mandato; aceptación del diseño: PO, pendiente. REC-F2-001 EN_CURSO en diseño; REC-F2-002 EN_CURSO únicamente en diseño conceptual desde este mandato, sin inventario de BD efectiva ni aceptación. REC-F2-004 conserva cierre offline y bloqueos de conexión/arranque.

### Autoridad y requisitos recuperados

Se consultaron primero GOBERNANZA_MAESTRA/GOBERNANZA_IA, después SPEC, TASKS, PLAN y HALLAZGOS; finalmente código solo para compatibilidad. DEC-REC-005 ratifica estructura documental, no integralmente gobernanzas 0.1. Vinculantes: los cuatro acuerdos de «REC-F2-001 — criterios funcionales aprobados por el PO»: código individual + contraseña sin correo/SMS en cada login; identidad global única y estados/permisos por agencia; recuperación verificable gestionada por coordinador sin control global automático; postulación pública sin registro y privados con prueba limitada al recurso. Alta por coordinador autorizado se conserva del registro TCE-007, sin autorizar alta remota ahora.

Línea funcional histórica preservada por remisión de gobernanza: spec.md §2 y §3, reclutador multiagencia sin duplicar perfil y unicidad reclutador/agencia; coordinador opera su agencia, reclutador trabaja vacantes y pipeline propio sin editar vacantes. HU-18 distingue administrador Maestro (gestiona administradores) y Limitado (operación sin gestión de administradores); no se cambia su contrato de sesión/inactividad ni TCE-004. es_maestro del reclutador es una condición de distribución/inscripción, nunca rol administrativo. Fallback, inscripción automática y visibilidad histórica se conservan como contratos a compatibilizar: no habilitan acceso sin membresía vigente ni se rediseñan aquí. La aprobación funcional no ratifica el esquema histórico como desplegado o seguro.

### Modelo lógico mínimo PROPUESTO, no DDL aprobado

| Entidad | Identidad y campos mínimos propuestos | Relaciones y límites |
|---|---|---|
| agencias (existente) | id estable, nombre, estado operativo, versión | Una agencia tiene muchas membresías y recursos; conservar valores/flujo de aprobación actuales mediante mapeo revisado, sin convertir pendiente/rechazada en activa |
| usuarios (conceptual, nueva) | id estable, auth_user_id único cuando esté vinculado, estado global, versión | Una identidad de aplicación por sujeto Auth; vínculo obligatorio para operar, nulidad solo durante alta pendiente sin privilegios. Sin contraseña, hash de contraseña propia ni rol global editable por cliente. No fusionar por email/teléfono/nombre |
| reclutadores (existente) | id existente, usuario_id único, código individual único normalizado, estado de perfil y campos de contacto/referido existentes | Un usuario con perfil reclutador, múltiples agencias; código es identificador, token_referido es atribución, ninguno es credencial de acceso privado. Conservar IDs, contactos opcionales y es_maestro sin elevar privilegios |
| membresías por agencia (conceptual) | id estable, usuario_id, agencia_id, rol operativo, estado local, versión | Unicidad (usuario, agencia, rol); rol limitado a reclutador/coordinador en este bloque. Si coexisten, verificar rol explícito del comando sin mezclar agencias. Membresía reclutador exige su perfil; no duplicar (reclutador_id, agencia_id) |

La membresía lógica de reclutador corresponde a reclutador_agencia existente; la de coordinador al vínculo coordinadores.agencia_id y estado vigente. Propuesta física preferida para revisión: unificar autorización de membresías manteniendo perfiles/IDs existentes y una transición compatible; tabla nueva frente a extensión/adaptadores de las relaciones existentes sigue decisión de diseño del PO, no dos fuentes de permisos simultáneas. No conceder múltiples agencias a un coordinador por generalizar el modelo: conservar el alcance actual hasta aprobación específica. Ningún ALTER/CREATE ni migración se prepara ahora.

Administradores conservan su entidad/roles/estado y verificación TCE-004; no se convierten en membresías locales ni se aplica a ellos la restricción de una sola agencia. La extensión del vínculo estable usuario–Auth a administradores requiere incremento separado revisado, sin cambiar hoy su comprobación por correo. Candidato sigue entidad funcional independiente sin cuenta Auth obligatoria; postulaciones/chats/documentos se vinculan al recurso y agencia, sin hacer del teléfono una identidad global de acceso. Mecanismo privado pendiente.

### Contrato propuesto de pertenencia y autorización

Para cada operación privada: verificar sesión en servidor → resolver sujeto Auth a usuario estable habilitado → rol del comando → agencia vigente → membresía vigente en esa misma agencia → relación y permiso sobre recurso. Un ID/agencia seleccionado por navegador es solicitud de contexto, nunca prueba; comprobarlo contra relaciones de servidor/BD. Un usuario compartido puede elegir A o B si ambas membresías están habilitadas, sin seleccionar silenciosamente la primera. Si no hay contexto verificable, denegar.

La agencia de postulación procede de su vacante; documento/chat/historial/corte hereda alcance por su cadena real de relaciones. Un candidato compartido no permite exponer todas sus postulaciones en otras agencias. Atribución reclutador–vacante requiere membresía y reglas vigentes; política específica de referido/fallback sigue pendiente. Negocios compartidos no reciben dueño único inventado: bloquear habilitación de acciones ambiguas hasta aprobar política, manteniendo lectura pública expresamente permitida.

| Actor/contexto | Permitido según contrato conservado, sujeto a prueba | Prohibido o pendiente |
|---|---|---|
| Público/candidato sin cuenta | Proyección pública mínima y postulación simple por flujo acotado | Lectura base de privados, búsqueda de historial por teléfono/código/chatId; anon no recibe CRUD general |
| Candidato con mecanismo verificable | Solo recurso/acciones/vida de la credencial aprobada | Enumerar otros recursos, cruzar agencias, elevar credencial a sesión administrativa; mecanismo pendiente |
| Reclutador activo en A | Perfil propio con columnas permitidas; vacantes autorizadas de A; sus postulaciones/chats/comisiones en A | Editar vacantes, ver pipeline de otro, asignarse rol/agencia, acceder B con contexto A; proyección pública de otra agencia conserva su audiencia pública |
| Coordinador activo de A | Operación existente de A y solicitudes de alta/recuperación en ámbito verificable | Operar B, suspender identidad global compartida, cambiar credencial global por mera autoridad local, modificar perfil compartido sin política aprobada |
| Administrador activo Maestro/Limitado | Facultades transversales ya contratadas; Maestro gestiona administradores | Limitado gestiona administradores; es_maestro reclutador se interpreta como admin; no crear nuevos poderes globales de recuperación por inferencia |

### Invariantes propuestos para aceptación

1. Identidad estable: unicidad de vínculo Auth/usuario/perfil y del código normalizado; normalización/reutilización del código por aprobar. Cambiar contacto no transfiere cuenta ni altera dueño. Código y referido nunca autentican por sí solos.
2. Autorización actual: usuario/perfil, agencia y membresía deben habilitar la operación. Estado local de A no cambia B ni global; autoridad global separada y por aprobar para suspensión/recuperación. Claims, localStorage, metadata editable y roles enviados por cliente no sustituyen consulta de autoridad vigente.
3. Integridad de ámbito: FK y, donde se replique agencia, restricciones compuestas o derivación verificable impiden mezclar recursos A/B. Identidad/agencia/autoría no se cambian con UPDATE genérico. Preservar IDs e historial; no cascadas destructivas ni borrado global desde autoridad local. Política de eliminación histórica requiere revisión explícita.
4. RLS: denegación por defecto, grants mínimos, SELECT/DELETE sobre filas autorizadas y INSERT/UPDATE sobre estado resultante autorizado (incluidos USING/WITH CHECK propuestos). Cubrir tablas base, joins, conteos, vistas/RPC y Realtime; no conceder acceso a contactos/código por necesitar mostrar nombre público. Perfil público debe ser proyección deliberada. No aceptar seguridad por filtros UI/API.
5. Privilegio: service_role efectivo puede saltar RLS ordinaria; todo comando privilegiado verifica actor y alcance antes de usarlo. No exponer credencial ni hacer del servicio una identidad de prueba RLS. Funciones privilegiadas futuras requieren revisión de grants, propietario, ruta de resolución y ausencia de bypass/recursión de políticas.
6. Concurrencia: unicidad de membresía/código/vínculo impide duplicados bajo dos altas simultáneas; transiciones condicionadas por versión/estado evitan actualización perdida. Revocación y escritura autorizada en BD deben serializarse sobre el mismo estado autoritativo, con orden de bloqueo definido. Si revocación confirma primero, escritura posterior rechazada; si escritura confirma antes, registrar ese orden. No prometer cancelar lecturas/respuestas ya iniciadas ni JWT emitidos.
7. Alta/recuperación: idempotencia durable por comando; revalidar permiso al consumir, no solo al emitir; credencial de activación/recuperación limitada, vencimiento/uso único por aprobar, sin efectos de negocio mientras alta incompleta. Auth y BD no comparten transacción: estados pendientes, compensación/reconciliación revisada y reintentos sin segunda identidad ni membresía activa huérfana. No afirmar garantías ya implementadas.
8. Sesión/privados: política de renovación/logout/revocación y TTL por aprobar; denegar acceso con estado local/global revocado aunque JWT siga criptográficamente válido. Capacidad candidata no permite enumeración ni nuevos recursos. URLs ya emitidas, Realtime y cachés necesitan contrato de revocación medido, no garantías instantáneas inventadas.

### Decisiones abiertas reservadas al PO

- Mapeo código+contraseña con Supabase Auth: comparar teléfono real legítimo e identidad técnica administrada, sin seleccionar ni crear ahora. Casos sin teléfono/compartido/reciclado y legitimidad del namespace; no correo obligatorio, username supuesto, correo ficticio inseguro o contraseña propia. Normalización, cambio, unicidad/reutilización del código y vinculación inicial de identidades existentes.
- Autoridad global de alta/vinculación, bloqueo y recuperación; evidencia de solicitante/destinatario, entrega, caducidad/uso único/cambio inicial y efectos sobre otras sesiones/agencias. Coordinador gestiona solicitud, no adquiere poder global automático.
- Almacenamiento físico de usuarios/membresías, coexistencia de roles, edición de perfil compartido y bajas/borrado sin perder historial; resolver compatibilidad con ventana histórica de eliminación sin conservar una operación insegura por defecto.
- Sesiones SSR/browser o intermediación, renovación, TTL/revocación, alcance de logout; conservar contrato administrativo actual (incluida inactividad) sin inventar nuevos tiempos para reclutador.
- Mecanismo privado/recuperación entre dispositivos del candidato; permisos concretos de referidos/fallback/asignación y negocios compartidos. Conservar contratos existentes hasta decisión expresa sobre la parte conflictiva, no suponer acceso cruzado.
- Ejecutores/revisor, criterios de riesgo, lista exacta de archivos, permisos de laboratorio y evidencia/retención. Discrepancias históricas TCE-003/012 siguen abiertas; este diseño no las resuelve.

Pruebas negativas y secuencia en PLAN «validación mínima multiagencia»; avance/controles en TASKS; trazabilidad de los 17 hallazgos en HALLAZGOS. Propuesta sin aprobación final: no demuestra esquema desplegado, RLS efectiva ni viabilidad definitiva de Auth.

## REC-F2-001 — decisiones ratificadas PO-F2-001-A/B/C, 2026-11-06

Autoridad: Product Owner, ratificación expresa del 2026-11-06 mediante mandato «REC-F2-001: registro de decisiones ratificadas por el PO». Estado de las tres decisiones: APROBADAS POR EL PO. Alcance de esta intervención: registro y consolidación exclusivamente documental en los cuatro documentos existentes, sobre master/65fa41829a1beb0e5c17d467ed6b057ab5120d88 y sus cuatro cambios documentales pendientes, que se conservan. Sin código, SQL/migraciones, credenciales, servicios, pruebas ejecutables ni commit. Esta aprobación no ratifica íntegramente gobernanzas/borradores ni acepta o cierra REC-F2-001/002.

### PO-F2-001-A — AUTENTICACIÓN — APROBADA POR EL PO

El reclutador iniciará sesión mediante su código individual y contraseña.

La autenticación utilizará Supabase Auth mediante una identidad técnica vinculada de forma estable al reclutador.

No se exigirá correo electrónico personal ni SMS como requisito habitual de acceso.

La identidad técnica no deberá exponerse como credencial editable por el reclutador ni convertirse en un mecanismo para eludir Supabase Auth.

El diseño detallado del mapeo, almacenamiento, protección contra enumeración y ciclo de vida de credenciales permanece pendiente de validación técnica.

### PO-F2-001-B — RECUPERACIÓN — APROBADA POR EL PO

La recuperación de acceso deberá utilizar un procedimiento de verificación independiente.

Ningún coordinador podrá apropiarse unilateralmente de la credencial global de un reclutador, especialmente cuando tenga membresías en varias agencias.

La autoridad, los factores de verificación, la revocación de sesiones y el procedimiento de recuperación deberán especificarse antes de implementar.

No inventar ni dar por aprobado un mecanismo particular de recuperación.

### PO-F2-001-C — AUTORIZACIÓN MULTIAGENCIA — APROBADA POR EL PO

Cada operación protegida deberá comprobar:

- Identidad autenticada.
- Rol aplicable.
- Agencia correspondiente al recurso.
- Membresía activa y permisos vigentes.

Una sesión válida no concede acceso automático a todas las agencias.

La autorización deberá aplicarse en los límites correspondientes del servidor y de la base de datos, incluyendo RLS cuando proceda.

No confiar exclusivamente en filtros del cliente, identificadores enviados por el usuario ni afirmaciones de permisos no verificadas.

### Consolidación, compatibilidad y pendientes técnicos

A precisa los cuatro criterios funcionales anteriores y sucede exclusivamente a las expresiones «ninguna alternativa seleccionada», «Supabase Auth como primera alternativa» y a la comparación teléfono/identidad técnica aún abierta en las secciones históricas de viabilidad y diseño mínimo. La dirección aprobada es identidad técnica estable con Supabase Auth; no reabrir esa elección como siguiente decisión del PO. No se aprueban formato de identidad, dominio/namespace, algoritmo de resolución del código, tabla/columnas, exposición de identificador nativo, endpoints, almacenamiento ni implementación específica. No supone correo personal obligatorio, username nativo arbitrario, correo ficticio inseguro o contraseña propia. La contraseña sigue siendo verificada por Auth; la identidad técnica no lo elude.

B consolida la separación global/local y la gestión verificable de solicitudes por coordinador autorizado, sin atribuirle potestad unilateral de restablecer credenciales globales. «Verificación independiente» no selecciona proveedor, factor, aprobador, canal o plazo concreto. Autoridad/factores, entrega, caducidad/uso único, primer cambio y alcance de revocación permanecen pendientes de especificación/validación antes de implementar.

C ratifica los requisitos de autorización, pero no aprueba automáticamente las políticas ni el modelo físico del diseño mínimo. Mantener agencia de recurso derivada de relaciones confiables y membresías/estados/permisos independientes de reclutadores compartidos. Para administradores Maestro/Limitado se conserva su contrato transversal; el diseño detallado deberá explicitar cómo se verifican agencia/membresía y facultades vigentes en sus operaciones conforme a C, sin presumir ni una excepción general ni una conversión automática en membresías locales. Si aparece incompatibilidad concreta, bloquear la operación y elevarla al PO antes de implementar. No crear nuevos poderes ni reinterpretar es_maestro del reclutador como administrador.

Compatibilidad documental revisada: se conservan alta/gestión de solicitudes por coordinador dentro de autoridad vigente, identidad global única sin suspensión global desde A, distinción administrativa Maestro/Limitado y TCE-004, postulación pública sin registro y privados del candidato ligados al recurso. A/B/C no imponen cuenta de reclutador a candidatos ni acceso multiagencia por mera sesión. No se detecta contradicción funcional nueva entre estos contratos; las discrepancias históricas TCE-003/012 siguen pendientes y las expresiones de alternativas no seleccionadas quedan sucedidas en el alcance de A, sin borrar evidencia histórica.

Diseño técnico todavía pendiente: contrato completo de identidad técnica y vínculo estable/código, custodia y acceso al mapeo, enumeración/errores/intentos, ciclo de alta/cambio/baja y credenciales, recuperación independiente y revocación, transporte de sesión, diseño físico compatible, constraints/concurrencia, grants/RLS y autorización de todos los canales. Modelo conceptual, invariantes y matriz previos permanecen PROPUESTOS donde excedan A/B/C. Validar técnicamente no cambia unilateralmente la dirección ratificada; una inviabilidad se documenta y se eleva al PO.

REC-F2-001 y REC-F2-002 continúan EN_CURSO solo diseño, sin aceptación final; implementación NO INICIADA, pruebas de laboratorio NO EJECUTADAS. Próximo entregable: consolidar contrato técnico de identidad/autenticación bajo A/B/C y, después, traducirlo a diseño físico y de políticas en REC-F2-002. Secuencia controlada en PLAN; seguimiento en TASKS; riesgos/hallazgos en HALLAZGOS.

## REC-F2-001 — PO-F2-001-D, coordinador multiagencia y autorización híbrida, 2026-11-06

Estado vigente: APROBADA POR EL PO como requisitos funcionales, por ratificación formal del 2026-11-06, mandato «REC-F2-001: ratificación D, consolidación A/B/C/D y checkpoint». Antecedente: mandato «ampliación coordinador multiagencia» la registró como PROPUESTA FUNCIONAL PENDIENTE DE RATIFICACIÓN FORMAL FINAL; ese estado queda sucedido por la ratificación expresa, no por inferencia. Base master/65fa41829a1beb0e5c17d467ed6b057ab5120d88 con cambios documentales previos conservados. A/B/C siguen APROBADAS POR EL PO e íntegras. Se autoriza consolidación y un único checkpoint local de cuatro documentos; no implementación ni agentes.

### Contenido funcional aprobado de PO-F2-001-D

1. Un coordinador podrá pertenecer a varias agencias mediante una única identidad global.
2. Cada agencia tendrá una membresía independiente, con estado y permisos propios.
3. La asignación a una nueva agencia requerirá autorización central de TuChambaExpress y aceptación del coordinador invitado.
4. Inicialmente, las autorizaciones corresponderán al administrador Maestro de TCE o a administradores con facultades expresamente delegadas.
5. En una etapa posterior podrán habilitarse agentes de IA para ejecutar autorizaciones de bajo riesgo, dentro de delegaciones explícitas, limitadas, auditables y revocables.
6. Los agentes de IA no podrán modificar sus propias reglas, elevar sus privilegios ni concederse autorizaciones.
7. Las operaciones excepcionales o de alto riesgo requerirán autorización humana.
8. Revocar una membresía de agencia no revocará automáticamente las demás membresías legítimas.
9. Cada operación protegida verificará identidad, rol, agencia, membresía activa y permisos vigentes.
10. La condición de coordinador multiagencia no otorgará administración global de TCE ni facultades de recuperación unilateral de credenciales.

### Compatibilidad y alcance de la ampliación ratificada

D amplía el alcance funcional previo del coordinador de una agencia a varias mediante relaciones locales independientes; no equivale a seleccionar todas las agencias de una sesión ni a fusionar perfiles. La ratificación sustituye expresamente, solo como requisito funcional de diseño, el supuesto de una sola agencia de las frases anteriores «no conceder múltiples agencias a un coordinador» y «conservar el alcance actual hasta aprobación específica». Se conservan como antecedente histórico; ya no bloquean diseñar coordinador multiagencia. El bloqueo de implementación permanece por falta de diseño técnico validado y autorización específica, no por falta de ratificación funcional de D. No existe contradicción vigente entre dos decisiones aprobadas por esta sucesión delimitada.

Compatible con A: no cambia código+contraseña e identidad técnica estable con Supabase Auth del reclutador, ni prescribe ese identificador técnico al coordinador; su vínculo global y mecanismo de acceso requieren diseño compatible con su contrato existente. Compatible con B: autorización central de una membresía y aceptación del invitado no autorizan recuperar ni sustituir credenciales globales; la verificación independiente permanece obligatoria. Compatible con C: cada comando conserva comprobación de identidad/rol/agencia del recurso/membresía/permisos, sin unión automática de permisos de varias agencias.

Maestro/Limitado conservan su contrato administrativo y TCE-004. «Administrador con facultad expresa» no concede facultad a todos los Limitados ni permite gestionar administradores; su otorgamiento, alcance y revocación deben ser explícitos y compatibles con la autoridad vigente. Coordinador multiagencia y reclutador es_maestro no adquieren rol administrativo. Reclutadores compartidos mantienen estados/membresías independientes; candidatos mantienen postulación sin registro y privados por recurso. D no resuelve las discrepancias históricas TCE-003/012.

La delegación futura a IA está aprobada como posibilidad funcional condicionada, no como política autónoma concreta ni autorización de implementación. No inicia otra fase ni autoriza crear agentes, herramientas, credenciales o permisos. Mientras no se definan y aprueben delegaciones concretas, no existe facultad delegada que ejecutar. La autorización humana para excepciones/alto riesgo es obligatoria, sin inventar quién aprueba cada clase de operación.

### Diseño técnico y decisiones todavía pendientes

- Ratificación funcional de D RESUELTA por el PO el 2026-11-06; pendientes la especificación técnica y su validación, sin reabrir la decisión de coordinador multiagencia. Invitación, aceptación, autorización, auditoría, revocación y delegación futura no tienen mecanismo técnico aprobado por esta ratificación.
- Representación física compatible de identidad global/coordinadores/membresías: conservar IDs e historial, resolver coordinadores.agencia_id frente a relaciones múltiples sin duplicar identidad ni mantener dos fuentes permisivas de autoridad. Estados, unicidad y coexistencia de roles por definir en REC-F2-002; no esquema ni SQL aprobados.
- Asignación: definir evidencia de autorización central y aceptación ligada al sujeto autenticado invitado y agencia exacta; emisión, entrega, caducidad, revocación, rechazo, consumo único e idempotencia pendientes. Autorización sola o aceptación sola no deben activar la relación propuesta. Definir cambios de alcance entre invitación y aceptación, fallos intermedios y concurrencia; no inventar un mecanismo de invitación.
- Facultades expresas de administradores: quién puede concederlas, límites de agencia/operación/vigencia, verificación al decidir y al activar, revocación y auditoría. Ningún administrador o agente se autoasigna esa facultad por esta propuesta.
- Contexto de agencia: selección validada en servidor/BD; permisos, vistas/RPC/Realtime/cachés y revocación independientes por membresía; no agencia arbitraria de localStorage, ni primera agencia como autoridad implícita. Definir límites de sesiones/lecturas en curso sin prometer revocación retroactiva.
- Autorización híbrida futura: catálogo de decisiones delegables de bajo riesgo, clasificación de riesgo y excepciones, responsable humano, permisos mínimos/límites, evidencia/auditoría/retención, revocación y escalamiento. Falta de permiso o caso fuera de alcance debe impedir ejecución automática; reglas y privilegios no editables por el propio agente. No seleccionar tecnología ni implementar agentes.

Trazabilidad: REC-F2-001 contrato y ratificación; REC-F2-002 modelo físico/autorización/RLS; REC-F2-006 pruebas de integración/concurrencia; REC-F2-007 cobertura funcional de roles y selección de agencia. Secuencia/casos futuros en PLAN, seguimiento en TASKS y riesgos heredados en HALLAZGOS. Ninguna tarea/hallazgo se cierra: implementación NO INICIADA y pruebas NO EJECUTADAS.

### Consolidación vigente PO-F2-001-A/B/C/D y checkpoint

Las cuatro decisiones están APROBADAS POR EL PO: A, código individual+contraseña mediante identidad técnica estable con Supabase Auth; B, recuperación verificable e independiente sin control unilateral del coordinador sobre credenciales globales; C, autorización por identidad/rol/agencia/recurso/membresía activa/permisos vigentes; D, coordinador multiagencia y autorización híbrida bajo los diez puntos anteriores. El texto íntegro de A/B/C permanece sin cambios en sus secciones; este resumen no lo sustituye ni reinterpreta. D no extiende al coordinador el mecanismo de login del reclutador, no otorga poderes globales y no modifica Maestro/Limitado, TCE-004 ni el contrato público/privado del candidato.

REC-F2-001/002 continúan EN_CURSO solo diseño, sin aceptación final. REC-F2-006/007 mantienen pendientes sus trabajos técnicos. Los 17 hallazgos y nueve experimentos originales no se cierran ni se declaran probados. Este mandato autoriza un solo commit documental con las modificaciones pendientes de las cuatro rutas; sin omitir hooks, sin push y sin habilitar código, SQL, migraciones, servicios o agentes. Las notas SIN_COMMIT y de propuesta pendiente de intervenciones anteriores conservan su valor histórico, sucedidas solo en el alcance de este checkpoint y de la ratificación D.

## REC-F2-001 — contrato técnico propuesto de identidad y autorización, 2026-11-06

Fuente: PO, solicitud de contrato técnico y autorización «Implement the plan». Base 580ef81828e56cf2ac2f57074be9c4303bd61adc. A/B/C/D permanecen ratificadas; lo siguiente es DISEÑO TÉCNICO PROPUESTO, pendiente de validación/aceptación. Solo cuatro documentos, sin código, SQL, servicios ni commit.

Autenticación: proponer POST de login existente con código y contraseña por HTTPS. Normalizar código conforme a política por aprobar; no recortar ni transformar contraseña. Resolver en servidor mediante mapeo privado código→identidad técnica aleatoria/inmutable→sujeto Auth→perfil estable. Código, token_referido e identidad técnica no autentican solos. Usar Supabase Auth para verificar contraseña, sin almacenar contraseñas propias. Namespace legítimamente controlado, formato y provisión pendientes de validación; no inventar dominio operativo. Unicidad y vínculo estable obligatorios, sin fusionar por correo/teléfono ni sustituir IDs existentes.

Interfaz lógica propuesta: autenticar(codigo, contraseña) entrega sesión Auth y proyección mínima de perfil/membresías habilitadas; no devuelve el mapeo técnico en respuestas propias. No escoger primera agencia como autoridad implícita. Error genérico común ante código inexistente, contraseña inválida o cuenta no habilitada; errores internos sin detalles sensibles. Protección acumulada por origen/código, cuotas y retrasos controlados sin bloqueo permanente inducible; umbrales/retención y mecanismos distribuidos pendientes de aprobación. Evitar diferencias observables de error/tiempo que permitan enumerar, sin prometer tiempo constante de red.

Sesión propuesta y preferencia confirmada: SSR más cliente navegador, propagación getAll/setAll, verificación de identidad en servidor y autoridad vigente en BD/RLS. No prometer tokens HttpOnly ni identidad nativa invisible al navegador: sesión Auth accesible al cliente puede revelar identificadores; conocerlos no concede permisos. Identidad técnica no editable en perfil ni por metadata cliente; validar también rutas directas de cambio de identidad Auth antes de habilitar. LocalStorage solo preferencias, nunca identidad/rol/agencia autoritativos. Mutaciones con cookie requieren control de origen/CSRF; expiración, renovación y logout deben propagar cookies y fallar cerrados ante sesión no verificable. Duraciones, concurrencia de refresh y alcance de revocación por validar, sin cambiar contrato TCE-004.

Ciclo de vida: alta pendiente sin privilegios hasta vinculación y estados válidos; habilitación, suspensión y baja conservan IDs/historial y separan estado global/local. Cambiar código/contacto no cambia sujeto Auth. Reintentos idempotentes; Auth y BD no comparten transacción: reconciliación/compensación explícita, sin habilitar membresía huérfana. Activación/cambio inicial, entrega y uso único siguen por especificar/aprobar.

Recuperación: estados propuestos solicitada→verificación pendiente→decisión→restablecimiento limitado autorizado→consumida→cerrada; alternativas rechazada/caducada/revocada. Solicitud genérica no revela existencia ni entrega acceso. Coordinador solo gestiona solicitud autorizada, nunca adquiere credencial global. Política candidata solicitada para revisión, NO APROBADA: revisión humana central por Maestro o delegado expresamente facultado, independiente de mera solicitud del coordinador; evidencia de continuidad de titularidad más confirmación por canal previamente verificado. Si no existen evidencias/canal aceptables, escalar sin restablecer. Autoridad concreta, factores aceptables, canal de entrega, plazos y política de sesiones requieren decisión PO antes de habilitar. No considerar código/teléfono declarado/membresía como prueba suficiente.

Restablecimiento propuesto: autorización opaca limitada al sujeto/acción, caducidad y consumo único; revalidar autoridad y estado al consumir. Reintento no cambia contraseña dos veces ni reutiliza éxito con payload distinto. Suspender acceso de negocio durante recuperación cuando la política aprobada lo exija; invalidar renovaciones y comprobar estado autoritativo para nuevas operaciones. No afirmar cancelación instantánea de JWT/lecturas ya emitidas. Auditoría con actor/sujeto sintético o ID interno, alcance, decisión, versión y resultado; sin contraseñas/tokens ni evidencias personales en logs generales. Retención/acceso a evidencia sensible pendiente PO.

Coordinador: identidad global→membresías independientes. Incorporación propuesta solicitada→autorizada centralmente→invitada→aceptada por sujeto autenticado→activa; estados de rechazo/caducidad/revocación separados. Autorización central y aceptación ligadas a agencia, sujeto, permisos y versión exactos; ninguna condición sola activa. Cambio de alcance exige nueva aceptación. Revalidar facultad central al activar; revocación concurrente impide consumo posterior. Unicidad/idempotencia sin doble membresía; fallos mantienen pendiente sin acceso. Invitación/token/canales, plazos y almacenamiento todavía propuestos, no mecanismo aprobado. Revocar A conserva B; no administración global ni recuperación unilateral. A no prescribe nuevo login al coordinador. Maestro/Limitado y TCE-004 intactos.

Autorizar(identidad, rol, operación, recurso, contexto solicitado): verificar sesión/sujeto estable y estado→rol aplicable→agencia derivada de relaciones del recurso→membresía activa→permiso vigente→efecto permitido. Contexto navegador se contrasta; fallo deniega sin efectos ni exposición de privados. Comprobar en servidor y límites BD/RLS, incluidas relaciones/vistas/RPC/Realtime; guardas previas al servicio privilegiado, que no demuestra RLS. Agencia de postulación deriva de vacante; privados de candidato ligados al recurso sin registro obligatorio. Facultades transversales administrativas deben explicitarse sin excepción general inventada a C.

Invariantes: unicidad código/vínculo/membresía; IDs e historial preservados; identidad/agencia/rol no reasignables por UPDATE genérico; autorización y escritura serializadas frente a revocación; doble consumo máximo un efecto; sin unión automática de permisos entre agencias. RLS debe comprobar filas existentes y estado resultante, con grants mínimos. Sesión válida no basta, metadata/localStorage no son autoridad. Agentes IA siguen capacidad futura: no agente operativo ni delegación concreta diseñada/habilitada.

Pendientes PO/técnicos: namespace/provisión, normalización/reutilización del código, cuotas, sesiones/revocación, política candidata de recuperación y evidencias, invitación/aceptación/auditoría, representación física y políticas. No declarar contrato listo para producción ni mecanismos bloqueados implementables sin resolverlos. REC-F2-001/002 EN_CURSO solo diseño; implementación PENDIENTE y pruebas NO EJECUTADAS.


## Inventario funcional del PO — Pendientes TCE2_0.docx, 2026-11-06

Fuente original íntegra leída: C:/Users/jgonz/Desktop/Pendientes TCE2_0.docx; SHA-256 D287FAB2B50011B44775A9DE716FB703E1795399D0F2E93B1676D12EAB4A824F. Paquete DOCX: 24 párrafos no vacíos, 72 nodos de texto; sin imágenes, altChunk, notas, encabezados o comentarios adicionales. Se extrajo todo word/document.xml en orden; los párrafos concatenados se desglosan en 30 solicitudes. IDs MF-PO-001 a 030 son referencias de inventario, no nuevas tareas F2 ni hallazgos. P02 es encabezado sin solicitud independiente. No usar este inventario como aprobación de implementación ni nueva fase.

A/B/C/D ratificadas intactas; solicitudes del DOCX son REQUISITOS RECIBIDOS PENDIENTES DE VALIDACIÓN y priorización PO. Estados se refieren solo a superficie estática revisada: Parcial no acredita backend; No determinado no significa ausente. No se declara cobertura completa implementada sin pruebas. No se resuelve unilateralmente contradicción con requisitos históricos: privacidad de PDF público se propone actualizar expresamente antes de código.

### Transcripción original para control de integridad

P01: 1) agregar Sección 9 — Proceso de reclutamiento / Pendiente de construir (7.38) — catálogo de puntos de reclutamiento.  Al Vacante detalle del reclutador.

P02: En la Ficha operativa, varios cambios:

P03: 1) Agregarle botón (Copiar) a "📍 Ubicación de la empresa"

P04: 2) Agregarle botón (Copiar) a "📎 Documentos de la ruta"

P05: 3) En 🚐 Ruta dedicada agregar un espacio para cada parada y que cada parada tenga su propio link de Google Maps, con botón (Copiar).

P06: 4) Validar si Punto Fijo de reclutamiento requiere lo mismo.

P07: 5) Agregarle botón (Ver) a "🪪 Requiere pase de visita", pero que tenga un botón para Ver y otro solo para Descargar.Modificar el panel de Chats del reclutador para que le aparezcan mensajes pre-cargados editables, un mensaje de bienvenida automático, un mensaje diciendo que "pronto será contactado por un reclutador, que no cierre la ventana", otro para fuera de horarios, así tipo WhatsApp Business. Y compactar los chats para que al seleccionar un candidato del lado derecho aparezca la info del panel de Ficha operativa, con la información de la vacante a la que se está postulando ese candidato/chat.

P08: Agregar la opción de migrar conversación completa a WhatsApp

P09: Agregar en 📋 Trámites útiles con el gobierno el botón de Alta al IMSS

P10: agregar también el link de validación del RFC

P11: Aplicar una diferencia entre domicilio de la planta/empresa (donde se va a laborar), y domicilio de entrevista planta, porque pueden coincidir pero también pueden ser diferentes por que algunas empresas tienen varias plantas.

P12: Verificar que cuando el usuario entre a una vacante por link referido, y de ahí se salga a la página principal o a la de vacantes, se conserve el referido.

P13: Agregar también el link de consulta de RFCAgregarle a los Chats del reclutador la opción de borrar chat

P14: Agregarle al panel de vacantes del reclutador una columna con el estado y el municipio, y agregarle un número ID pequeño a cada vacante para diferenciarlas por número.

P15: en la página de redes sociales hay que crear contenido que sea de ayuda a las personas que buscan empleo, como cursos gratis de capacitación, escuelas baratas, contenido educativo, re recomendaciones etc.

P16: Y hay que empezar con un slogan que diga "Sin miedo, dale Clic".

P17: Agregarle al registro la frase de Teléfono/WhatsApp para contacto.

P18: Agregar dos espacios para guardar PASE_de visita. (para poder subir más de uno.

P19: Hay que revisar la carga de documentos de Rutas, porque cuando subo un archivo se aplica para todas las empresas.

P20: Hay que agregarle la opción al Pipeline de  cambiar de vacante en el chat y en el pipeline, para que si un candidato con el que ya tenemos contacto se interesa por otra vacante, poder moverlo sin descartarlo y volver a registrarlo

P21: Hay que agregarle al vacantemodal un checkbox si la ruta dedicada o el punto fijo están activos o suspendidos.

P22: Validar que si una vacante ya fue cargada, pero le cambio el título y la vuelvo a subir, si conserva el mismo ID

P23: Validar que cuando el CUPO sea 0, automáticamente se ponga en PAusada

P24: [21/9/2026] Hay que quitar de la página/portal de candidatos, que puedan ver/descargar el PDF de las rutas de la empresa.

### Inventario y aceptación propuesta

Descripción original: cada fila remite al párrafo literal anterior; el resumen/ necesidad funcional separa solicitudes concatenadas, sin sustituir su texto. La evidencia abreviada detalle/[id] corresponde a app/reclutador/detalle/[id]/page.tsx; VacanteModal a components/coordinador/VacanteModal.tsx; VacantesPortal a components/candidato/VacantesPortal.tsx; ChatWindow a components/candidato/ChatWindow.tsx. Grupos de impacto/dependencias se desarrollan en PLAN y aplican a cada fila.

| ID estable | Necesidad / resumen | Original | Roles | Estado estático | Evidencia concreta | Grupo | Prioridad sugerida | Aceptación propuesta |
|---|---|---|---|---|---|---|---|---|
| MF-PO-001 | Sección 9/catálogo en detalle | P01 | reclutador/coordinador | Parcial | app/reclutador/detalle/[id]/page.tsx:78–91,413–491; VacanteModal:220–238 | L | P2 | Mostrar catálogo asociado correcto, sin afirmar 7.38 ausente |
| MF-PO-002 | Copiar ubicación empresa | P03 | reclutador | No determinado | detalle/[id]/page.tsx:174 | U | P3 | Copiar valor exacto autorizado y confirmar resultado |
| MF-PO-003 | Copiar documentos ruta | P04 | reclutador | No determinado | detalle/[id]/page.tsx:274 | D | P3 | Definir si copia URL o contenido; no filtrar enlace privado |
| MF-PO-004 | Parada con Maps y Copiar | P05 | reclutador/coordinador | Parcial | detalle/[id]/page.tsx:422–429 representa paradas string[] | L | P2 | Cada parada conserva orden, ubicación y enlace propio |
| MF-PO-005 | Validar equivalencia en punto fijo | P06 | reclutador/coordinador | Parcial | detalle/[id]/page.tsx:87; puntos con direccion/ubicacion_maps | L | P2 | PO define campos/paradas aplicables; enlaces independientes |
| MF-PO-006 | Ver pase y Descargar separados | P07 | reclutador | Parcial | detalle/[id]/page.tsx:472–486 enlace download | D | P2 | Acciones separadas para archivo autorizado y descarga fiable |
| MF-PO-007 | Mensajes precargados editables | P07 | reclutador | Parcial | components/candidato/ChatWindow.tsx:31–35 alude a precargado 7.58 | C | P2 | Validar edición antes de enviar; no concluir cobertura total |
| MF-PO-008 | Bienvenida automática | P07 | candidato/reclutador | No determinado | app/reclutador/chats/page.tsx; ChatWindow | C | P2 | Una bienvenida por evento acordado, sin duplicados |
| MF-PO-009 | Mensaje pronto contacto/no cerrar | P07 | candidato/reclutador | No determinado | ChatWindow y panel chats, sin contrato de automatismo acreditado | C | P2 | Disparador y texto aprobados, sin prometer contacto inmediato |
| MF-PO-010 | Mensaje fuera de horario | P07 | candidato/reclutador | No determinado | ChatWindow; política horaria no acreditada | C | P2 | Zona horaria/calendario y frecuencia aprobados |
| MF-PO-011 | Chat compacto con ficha operativa lateral | P07 | reclutador | Parcial | app/reclutador/chats/page.tsx:96–98,191–192 muestra título/negocio | C | P2 | Ficha corresponde a postulación/chat y agencia actual |
| MF-PO-012 | Migrar conversación completa WhatsApp | P08 | candidato/reclutador | No determinado | app/reclutador/chats/page.tsx y ChatWindow, sin exportación acreditada | W | P2 | Definir exportar/continuar/sincronizar y consentimiento antes de integrar |
| MF-PO-013 | Alta IMSS | P09 | candidato | Parcial | VacantesPortal.tsx:309–315 ofrece Consultar NSS, no demuestra alta | U | P3 | PO precisa trámite; enlace oficial validado después, sin tramitar datos |
| MF-PO-014 | Validación RFC | P10 | candidato | Parcial | VacantesPortal.tsx:317–323 ofrece SAT ID | U | P3 | Distinguir validación de consulta; destino oficial por validar |
| MF-PO-015 | Planta versus entrevista | P11 | todos | No determinado | VacanteModal:ubicacion_maps; detalle consulta negocio/puntos | L | P1 | Domicilios coincidentes o distintos sin sobreescritura entre plantas |
| MF-PO-016 | Conservar referido al salir a inicio/lista | P12 | candidato/reclutador | Parcial | VacantesPortal.tsx:99,186–192; app/vacante/[id]/page.tsx:77 href=/ | R | P1 | Probar navegación/expiración/precedencia sin alterar atribución legítima |
| MF-PO-017 | Consulta RFC | P13 | candidato | Parcial | VacantesPortal.tsx:317–323 SAT ID | U | P3 | Aclarar posible duplicación con 014; conservar ambas solicitudes |
| MF-PO-018 | Borrar chat reclutador | P13 | reclutador/candidato | No determinado | ChatWindow estado archivado; no acredita borrado solicitado | C | P1 | PO define archivar/ocultar/eliminar y retención; no perder historial |
| MF-PO-019 | Columna estado/municipio | P14 | reclutador | Parcial | app/reclutador/vacantes/page.tsx:13–14,135 datos ciudad/estado | U | P3 | Definir municipio versus ciudad y verificar columna/filtros |
| MF-PO-020 | Número ID pequeño visible | P14 | reclutador | Parcial | app/reclutador/vacantes/page.tsx:135 consulta id | I | P2 | ID legible único, separado del título y sin colisiones |
| MF-PO-021 | Contenido útil en redes | P15 | candidato/editor | No determinado | lib/redes-sociales.ts; canal editorial externo no inspeccionado | E | P3 | PO delimita página/canal, curación y responsable |
| MF-PO-022 | Slogan Sin miedo, dale Clic | P16 | candidato/editor | No determinado | Canal de publicación no precisado por fuente | E | P3 | Texto y ubicación aprobados, sin publicación automática |
| MF-PO-023 | Teléfono/WhatsApp para contacto | P17 | candidato | Parcial | components/candidato/ChatModal.tsx:435 Teléfono (10 dígitos) | U | P3 | Ajustar etiqueta sin afirmar consentimiento de mensajería por sí sola |
| MF-PO-024 | Dos espacios de pase | P18 | coordinador/reclutador | Parcial | api/pase-visita:35–55 path pase y campo escalar | D | P1 | Dos archivos distintos con orden/tipo/ámbito acordados sin reemplazo accidental |
| MF-PO-025 | Ruta subida aparece en todas empresas | P19 | coordinador/reclutador | No determinado | api/documentos-negocio:28–47 path/registro por negocioId; VacanteModal:316–345 | D | P1 | Reproducir con empresas A/B sintéticas; A no afecta B; denuncia PO no defecto probado |
| MF-PO-026 | Cambiar vacante sin descartar/registrar de nuevo | P20 | candidato/reclutador/coordinador | No determinado | ChatModal:72,216 sesión por vacante; chats:96–98 relación vacante | M | P1 | Conservar candidato, conversación, historial y atribución; regla de postulación destino aprobada |
| MF-PO-027 | Activo/suspendido ruta o punto fijo | P21 | coordinador/reclutador | No determinado | VacanteModal:559–634 escritura catálogo/relaciones | L | P1 | Definir estado global/local y efecto sobre vacantes/chats existentes |
| MF-PO-028 | Mantener ID al renombrar/reimportar | P22 | coordinador | Parcial | api/importar-vacantes:305–335 por ID o título+negocio+agencia | I | P1 | Con ID explícito renombrar preserva identidad; sin ID/título nuevo decisión PO |
| MF-PO-029 | Pausar automáticamente CUPO=0 | P23 | coordinador/reclutador | Parcial | VacanteModal:484–487; KanbanCard:667–703,740,768 | Q | P1 | Precisar requerido/disponible/cubierto; concurrencia sin sobrecupo ni pausa tardía |
| MF-PO-030 | Quitar PDF rutas del portal candidato | P24 | candidato/reclutador | Parcial | components/candidato/VacanteDetalle.tsx:236–242 renderiza links | D | P1 | No PDF en respuesta pública ni acceso directo no autorizado; preservar acceso interno |

Prioridades P1 (decidir antes de diseño físico/habilitación afectada), P2 (definir interacción/modelo tras fundamentos), P3 (interfaz/editorial) son propuestas, no compromisos de ejecución. P1 no certifica severidad de defecto. RFC validación/consulta y mensajes se mantienen individualizados hasta que PO autorice consolidación.

Decisiones PO necesarias: mover o crear postulación adicional, historial/consentimiento/comisiones/atribución al cambiar vacante y entre agencias; alcance de borrar chat; significado de migrar WhatsApp y acceso de terceros; propiedad negocio/planta/agencia y archivos compartidos; dos pases exactos o varios; direcciones y estado de catálogo global/local; ID legible y reimportación sin ID; significado de cupo; reglas de referido; horarios/disparadores/plantillas; trámite IMSS/RFC y canal editorial. No tomar el documento como autorización de cambios de seguridad o datos. IA se contempla posteriormente, sin funciones ratificadas ni agente diseñado: evaluar futuras integraciones bajo autorización, auditoría y aislamiento multiagencia.

## Consolidación DF-PO-001…005, DA-PO-001 y recuperación de dos vías, 2026-11-06

Fuente/autoridad: PO, mandato «Consolidación documental de decisiones del PO». Registro funcional/arquitectónico RATIFICADO POR EL PO, no resultado técnico ni autorización de implementación. Base master/580ef81828e56cf2ac2f57074be9c4303bd61adc y cambios pendientes conservados íntegros. A/B/C/D no se modifican. Esta sección sucede solo a los pendientes funcionales que resuelve; inventario y textos anteriores permanecen como historia, no decisiones vigentes contradictorias. Detalles no ratificados continúan pendientes.

### DF-PO-001 — Cambio de vacante — RATIFICADA POR EL PO

El candidato conserva identidad y expediente. Interés en otra vacante crea NUEVA POSTULACIÓN, sin eliminar la anterior ni exigir nuevo registro. Se preservan postulaciones, estados, chats e historial. No trasladar automáticamente comisiones ni referidos entre postulaciones. Reglas de cierre, simultaneidad, atribución y comisiones pendientes de diseño/decisión posterior. Resuelve traslado frente a nueva postulación de MF-PO-026; no autoriza consultar expediente ajeno o cruzar agencias por identidad compartida.

### DF-PO-002 — Archivado de chats — RATIFICADA POR EL PO

El reclutador puede archivar u ocultar conversación sin eliminar mensajes. Historial protegido, trazabilidad y relaciones candidato/postulación/agencia se conservan. Archivar no elimina postulaciones ni modifica comisiones. Retención, consulta histórica y restauración pendientes de diseño. Precisa MF-PO-018: la petición de borrar queda resuelta como archivo/ocultamiento, sin borrado físico aprobado.

### DF-PO-003 — Propiedad jerárquica de documentos — RATIFICADA POR EL PO

Cada documento se vincula a la entidad correspondiente: agencia, empresa, planta/sede, ruta o vacante, dentro del ámbito autorizado. Reutilizar entre entidades exige relaciones explícitas y autorización. Propiedad no concede consulta/descarga universal; definir acceso por agencia, empresa, recurso, rol y tipo documental, preservando aislamiento multiagencia. Relación con MF-PO-003/006/015/024/025/030 y catálogo 001/004/005/027. No aprobar por esta decisión jerárquica herencia automática de permisos, cardinalidad de pases ni publicación de PDF.

### DF-PO-004 — Cupo agotado — RATIFICADA POR EL PO

Cupo DISPONIBLE cero pausa automáticamente recepción de nuevas postulaciones, conservando identidad de vacante, postulaciones, chats e historial. Usuario autorizado puede aumentar cupo y reactivar. Prevenir sobreasignación por concurrencia. Semántica de cupo, estados, reactivación, importaciones e idempotencia pendientes. No toda pausa se debe a cupo: aumento de cupo no autoriza ignorar otras causas de suspensión. Relaciona MF-PO-029 y 026/028, sin aprobar algoritmo de conteo ni asignar cada etapa a una reserva.

### DF-PO-005 — WhatsApp — INVESTIGACIÓN RATIFICADA, IMPLEMENTACIÓN NO APROBADA

Se aprueba investigar viabilidad de transferir conversaciones completas TCE hacia WhatsApp. Investigación FUTURA de APIs oficiales, limitaciones, privacidad, consentimiento, costos, conservación de historial y alternativas. Abrir WhatsApp no implica importar mensajes previos. Relación MF-PO-012 y etiqueta 023: etiqueta no otorga consentimiento. Este mandato registra alcance, no ejecuta investigación externa ni implementa transferencia.

### DA-PO-001 — Agente Reclutador IA — VISIÓN RATIFICADA POR EL PO

Modelo de GESTIÓN OPERATIVA SUPERVISADA: IA como primer punto de atención y principal operador de actividades rutinarias; reclutador humano conserva autoridad, supervisión e intervención. Cada agencia tiene contexto operativo IA aislado bajo políticas/capacidades administradas centralmente por TCE. No equivale a un usuario humano ni hereda automáticamente permisos.

Capacidades OBJETIVO, PENDIENTES DE IMPLEMENTACIÓN Y VALIDACIÓN, ninguna habilitada por este registro:
- Atención inicial 24/7 sujeta a disponibilidad técnica.
- Respuestas sobre vacantes, requisitos, ubicaciones y procedimientos usando fuentes autorizadas.
- Recopilación de información y entrevistas iniciales.
- Preselección asistida con criterios legítimos, verificables y auditables.
- Seguimiento y recordatorios permitidos.
- Actualización de etapas operativas autorizadas del Pipeline.
- Identificación y escalamiento de excepciones.
- Notificación al reclutador cuando se requiera intervención.
- Asistencia en coordinación de entrevistas sujeta a reglas y autorizaciones.

Control humano obligatorio: reclutador autorizado toma control del chat en cualquier momento; durante ese control IA NO envía respuestas automáticas. Puede devolver conversación a IA; transferencia conserva historial y contexto autorizado. Registrar controlador y ejecutor de cada acción. Diseñar exclusión de respuestas simultáneas y acciones duplicadas; mecanismo de estados/versionado/consumo todavía PROPUESTA TÉCNICA, no implementación aprobada.

Límites: IA no se otorga permisos, modifica políticas de seguridad, recupera credenciales por cuenta propia, accede a agencias ajenas, ejecuta administración privilegiada, decide definitivamente contratación/rechazo sin intervención humana, inventa condiciones laborales ni promete contrataciones. Acciones con efectos en postulaciones/cupos/estados/comunicaciones pasan por contratos y operaciones autorizadas de servidor con validación/auditoría. Credencial privilegiada Supabase no sustituye autorización de negocio.

Preselección responsable: criterios ligados a requisitos legítimos de vacante; no características sensibles ni inferencias discriminatorias para excluir. Ambigüedad o impacto significativo escalan a humano. Mantener explicaciones verificables y mecanismos de corrección.

Considerar en REC-F2-002: identidad/autorización de agentes, aislamiento por agencia, estados/responsables de conversación, transferencia IA/humano, historial/auditoría de acciones, tareas/notificaciones, operaciones autorizadas Pipeline, idempotencia/concurrencia, protección de datos, límites operativos/fallos/supervisión. No construir agente, seleccionar proveedor, contratar servicio ni ratificar tecnología concreta. Consideración arquitectónica no crea nueva fase ni habilita ejecución del backlog IA.

### Recuperación de cuentas — modelo de dos vías consolidado

Decisión PO registrada: vía ordinaria mediante factor previamente verificado y controlado por titular; vía excepcional por revisión central TCE y verificación independiente cuando factor ordinario no esté disponible. FACTORES CONCRETOS, AUTORIDADES, PLAZOS, CANALES Y PROCEDIMIENTOS TÉCNICOS PENDIENTES DE APROBACIÓN. Complementa B sin apropiación unilateral del coordinador; la política candidata previa no constituye aprobación de Maestro/delegado o evidencia particular. No activar recuperación hasta definir/validar esos detalles. Tampoco IA puede recuperar credenciales por cuenta propia.

### Sucesión documental, invariantes y aceptación futura

DF-PO-001/002/003/004 resuelven dirección funcional de MF-PO-026/018/documentos/029; detalles y prioridades restantes del inventario no quedan aprobados en bloque. DA-PO-001 sucede a «IA solo intención futura, sin funciones ratificadas» únicamente como visión/capacidades objetivo ratificadas: sigue sin agente habilitado ni permiso operativo. MF-PO-007…011 son consumidores del control conversacional futuro, no automatismos aprobados individualmente por inferencia. MF-PO-016/020/028 requieren conservar atribución e IDs sin transferencia comercial automática. MF-PO-002/013/014/017/019/021/022/023 y detalles no resueltos conservan estado previo; el inventario MF-PO-001…030 y prioridades permanecen íntegros.

Compatibilidad A/B/C/D: reclutador humano mantiene identidad técnica Auth; agente requiere identidad/capacidad propia futura, sin heredar sesión humana. B y recuperación dos vías preservan verificación independiente. C rige cada efecto por rol/agencia/recurso/membresía/permisos actuales; D conserva coordinador multiagencia sin administración global. La facultad futura limitada de autorizar membresías de D no se transfiere al Agente Reclutador de DA: este no ejecuta administración privilegiada. Maestro/Limitado, TCE-004, candidato sin registro y privados por recurso permanecen intactos.

Aceptación propuesta, NO EJECUTADA: nueva postulación conserva original/estados/chats y no mueve referido/comisión; archivar conserva mensajes/relaciones y admite consulta/restauración solo con reglas aprobadas; reutilización documental exige vínculo y acceso explícitos, propiedad sola no abre descarga; cupo concurrente no sobreasigna y no reanuda pausa de otra causa; humano toma control y bloquea envíos IA incluso en carreras/reintentos, con actor/versión auditables; agencia ajena, facultad revocada, sesión humana reutilizada por agente, fuente no autorizada y decisión discriminatoria no producen efectos; fallos escalan sin promesa de disponibilidad absoluta. Recuperación ordinaria/excepcional deben acreditar titularidad según política aprobada; WhatsApp exige evidencia de viabilidad, nunca presumir importación.

REC-F2-001/002 EN_CURSO diseño; implementación PENDIENTE, validación PENDIENTE, pruebas NO EJECUTADAS. No cierre técnico ni modificación de las 17 fichas/siete tareas/nueve experimentos. Requisitos ratificados no equivalen a diseño físico aprobado o autorización de agentes/servicios.

## REC-F2-001 — DC-PO-001…004: plazas, Pipeline y supervisión, 2026-11-06

Fuente: PO, mandato «Actualización documental REC-F2-001», base master/5584c79ec867ace57619eafe7e93b42a3d279437, inicio limpio y staging vacío. Actualización exclusivamente documental. Se conservan A/B/C/D, DF-PO-001…005, DA-PO-001, contrato técnico e inventario MF-PO-001…030. DC precisa pendientes anteriores sin borrar historia ni acreditar implementación.

### DC-PO-001 — Reserva y ocupación — REGLAS FUNCIONALES RATIFICADAS

Una vacante tiene capacidad total. Cuando candidato agenda y confirma una cita válida, se reserva una plaza y disminuye en una unidad la disponibilidad. Cuando reclutador confirma contratación, reserva pasa a ocupada SIN volver a descontar; se conserva trazabilidad de postulación. Cuando reclutador registra rechazo o descarte autorizado, se libera reserva activa y disponibilidad aumenta una unidad, con historial íntegro. Esto no aprueba liberar plazas ya ocupadas después de contratar: esos casos siguen abiertos.

Vencimiento de cita, inactividad, falta de respuesta o alerta no liberan reserva. Operación repetida no reserva, ocupa ni libera dos veces. Reagendar no justifica duplicar reserva. No asumir semántica de confirmación doble ni requisitos de cita válida distintos de los que el PO apruebe después.

### DC-PO-002 — Responsabilidad del Pipeline — REGLAS FUNCIONALES RATIFICADAS

Reclutador responsable de registrar oportunamente resultados reales. Distinguir cuatro dimensiones: estado de postulación, estado de cita, estado de reserva/ocupación y cumplimiento del seguimiento. Cita vencida no implica rechazo, descarte ni liberación. Cada transición registra actor, fecha, motivo cuando corresponda y evidencia auditable. Una alerta señala pendiente, no constituye resultado del candidato.

### DC-PO-003 — Supervisión IA — ALCANCE FUNCIONAL RATIFICADO, NO HABILITADO

Conforme DA-PO-001, IA podrá supervisar tiempos, detectar pendientes y generar alertas, recordatorios y solicitudes de actualización: cita vencida sin resultado, candidato sin seguimiento, postulación estancada o reserva pendiente de resolución. Puede facilitar rutinas explícitamente autorizadas; no inventa resultados, confirma contrataciones ni rechaza/descarta definitivamente de forma autónoma. Alertas no modifican cupo. Toma humana y autorizaciones vigentes se conservan, incluidos bloqueo de respuestas automáticas durante control humano y límites de agencia/recurso/permisos. No agente construido ni proveedor elegido.

### DC-PO-004 — Invariantes y mecanismos PROPUESTOS PARA VALIDACIÓN

La dirección funcional de DC-PO-001/002/003 está ratificada; los siguientes invariantes son criterios técnicos propuestos y verificables, no modelo físico/algoritmo aprobado:
- Disponibles = capacidad total - reservas activas - plazas ocupadas; nunca disponibilidad negativa.
- Una reserva activa por postulación y plaza según modelo físico que se apruebe; no exigir aquí fila individual por plaza ni elegir tabla/índice.
- Reserva activa y ocupación de esa misma plaza no se cuentan simultáneamente.
- Conversión a ocupada sin doble consumo; liberación autorizada exactamente una vez; reagendamiento sin reserva duplicada.
- Operaciones concurrentes controladas, historial conservado y aislamiento entre agencias.
- Postulación/cita/seguimiento por sí solos no alteran ocupación fuera de comando autorizado y transición válida.

Propuesta de mecanismo pendiente de diseño/aprobación: transacción que valide identidad/rol/agencia/recurso/membresía/permisos y estado esperado; cambie reserva/ocupación, disponibilidad e historial como unidad de negocio; use idempotencia durable y control de concurrencia. Auditoría conserva actor/fecha/motivo/evidencia mínima sin datos sensibles innecesarios. No SQL, RPC, tecnología, restricciones o política física aprobadas aquí. Diseño deberá distinguir resultado de negocio de entrega de notificación: fallo/reintento de alerta no consume ni libera plazas.

### Contraejemplos y aceptación futura — NO EJECUTADA

| Contraejemplo | Invariante / criterio esperado propuesto |
|---|---|
| Última plaza confirmada por dos candidatos concurrentes | Máximo una reserva válida; no disponible negativo; resultado rechazado sin reserva/historial de éxito falso |
| Confirmación/reintento repetido de cita o reagendamiento | Una reserva, mismo consumo; reagendar conserva trazabilidad y no reserva de nuevo |
| Contratación de postulación con reserva activa | Activa disminuye una, ocupada aumenta una; disponible no vuelve a bajar |
| Dos descartes/reintentos o descarte y contratación concurrentes | Una transición válida según orden autoritativo; no liberar y ocupar la misma reserva ni inventar reversión |
| Cita vencida, falta de respuesta, alerta duplicada o caída del supervisor | Reserva/disponibilidad permanecen; solo pendiente de seguimiento, sin rechazo/contratación implícitos |
| Actor ajeno, IA sin facultad o permisos revocados | Ningún efecto sobre estado/cupo; auditoría del rechazo sin exposición privada |
| Aumento de capacidad con pausa manual u otra causa | No reactivar por inferencia; aplicar política aún por aprobar y preservar DF-PO-004 |
| Reinicio/importación y reintento tras error | No borrar reservas/historial ni resetear consumo silenciosamente; semántica exacta pendiente |

### Pendientes PO, interacción DF-PO-004 y prioridad de recuperación

DF-PO-004 sigue identificada y vigente: disponible cero pausa automáticamente recepción de nuevas postulaciones, sin perder vacante/historia; no toda pausa es agotamiento. DC fija ahora que reserva nace en cita válida agendada y confirmada, no en alta de postulación ni por inferencia de comisión/etapa. Falta precisar interacción de admisión de postulaciones, confirmación de citas, agotamiento y eventual lista de espera: NO aprobar lista de espera ni citas sin reserva por silencio. Este punto bloquea habilitación del flujo afectado hasta decisión; no contradicción resuelta mediante regla inventada.

Siguen abiertos: lista de espera; plazos exactos de alertas/escalamiento; reaplicación/simultaneidad entre vacantes; excepciones de citas sin reserva; ajustes de capacidad, incluidas reducciones frente a compromisos existentes; política de reactivación tras agotamiento; otras liberaciones/reversiones posteriores a contratar. Definición operativa de cita válida/confirmación y relación con etapas/historial deberá concretarse sin cambiar estas reglas ratificadas. Comisiones/referidos no se trasladan automáticamente (DF-PO-001) ni se equiparan a reserva.

Orden expreso: (1) recuperar/corregir hallazgos de auditoría, (2) validar técnica y seguridad con evidencia, (3) implementar después mejoras según dependencias y autorización PO. Dependencias técnicas excepcionales requieren autorización expresa; documentación anticipada no la concede. DC y DA no adelantan construcción de funcionalidades/agentes. REC-F2-001/002 siguen EN_CURSO diseño, sin cierre; 17 hallazgos abiertos, nueve experimentos NO EJECUTADOS y 30 MF conservados.

## REC-F2-001 — cinco decisiones P0 ratificadas para CT-01/CT-02, 2026-11-06

Fuente/autoridad: Product Owner, mandato «Consolidación documental de cinco decisiones P0». Base master/8eb9ca9b4d0615cf887c683239b38162f5893925, inicio limpio y staging vacío. APROBACIÓN FUNCIONAL expresa de las cinco reglas siguientes; no cierre documental de CT-01/CT-02, no implementación ni validación técnica. Numeración 1–5 corresponde al mandato, sin nuevas tareas ni duplicación de A/B/C/D.

### P0 (1) — Recuperación ordinaria — RATIFICADA POR EL PO

Canal previamente verificado o códigos de recuperación de un solo uso, mediante enrolamiento seguro. No exigir correo personal por inferencia; conocer código/contacto no equivale a controlar factor verificado. La decisión admite esas alternativas, sin imponer simultáneamente ambas ni aprobar proveedor, canal específico o algoritmo. Diseño de enrolamiento, sustitución/invalidez de factores, entrega, custodia, caducidad e intentos pendiente de especificación/validación.

### P0 (2) — Recuperación excepcional proporcional al riesgo — RATIFICADA POR EL PO

Revisión central independiente para cuentas ordinarias; DOS APROBACIONES INDEPENDIENTES para cuentas privilegiadas o situaciones de alto riesgo. El coordinador no adquiere recuperación global unilateral. Dos acciones del mismo aprobador no son dos aprobaciones independientes. Clasificación de riesgo, personas/facultades concretas, evidencias aceptables, conflictos de interés, plazos y procedimiento todavía pendientes; no declarar aprobado un mecanismo particular o una designación automática de Maestro/delegado.

### P0 (3) — Revocación global tras recuperación — RATIFICADA POR EL PO

Toda recuperación de credenciales completada revoca las sesiones anteriores y exige nueva autenticación. La autorización de nuevas operaciones no depende exclusivamente de esperar expiración del JWT. No exceptuar sesiones antiguas por tratarse de vía ordinaria, agencia distinta o JWT todavía firmado/vigente.

Diseño técnico propuesto: separar invalidez de renovación, vigencia autoritativa de sesión/credenciales y autorización de negocio; comprobar revocación antes de nuevas operaciones en servidor/BD y canales directos pertinentes. La recuperación no debe declararse completada mientras una falla de revocación deje acceso previo habilitado. Tratamiento de fallos Auth–BD/reintentos, canales Realtime/Storage/cachés y operaciones en curso requiere diseño y pruebas; no prometer invalidación criptográfica instantánea del JWT ni retirada de información ya entregada. Mecanismo físico no aprobado.

### P0 (4) — Permisos administrativos — RATIFICADA POR EL PO

Matriz base por rol más delegaciones específicas, delimitadas por operación, ámbito y vigencia. Prohibidas autoconcesión y elevación de privilegios; delegaciones revocables y auditables. No convertir esta regla en facultad de conceder permisos a cualquier administrador ni en permiso de subdelegación implícito. Maestro/Limitado conservan su contrato: Limitado no gestiona administradores por recibir una delegación operativa. Reglas para concedentes, catálogo concreto, revocación de dependientes y revisión de conflictos pendientes de diseño/aprobación específica.

### P0 (5) — Cuentas heredadas ambiguas — RATIFICADA POR EL PO

Enrolamiento asistido por coordinador con verificación INDEPENDIENTE de titularidad antes de activar o vincular. Sin fusión automática ni apropiación por conocimiento de código/contacto; preservar identificadores e historial. Asistencia del coordinador no sustituye prueba independiente ni autoriza crear segunda identidad para eludir ambigüedad. Evidencias, responsable independiente, reconciliación y ciclo técnico de migración pendientes. No se inspeccionan registros reales ni se ejecuta enrolamiento ahora.

### Sucesión de pendientes, invariantes y aceptación futura

Esta sección precisa CT-01/CT-02 y sucede únicamente a los pendientes funcionales de elección de factor ordinario, número de aprobaciones excepcionales, revocación global al recuperar, estructura de permisos y tratamiento de cuentas ambiguas. Se conservan como antecedentes las secciones «contrato técnico propuesto», «recuperación de cuentas — modelo de dos vías» y notas de políticas aún no aprobadas; ya no implican que estas cinco direcciones funcionales sigan sin ratificar. Autoridades concretas/factores elegidos/plazos/mecanismos no definidos permanecen pendientes, sin ratificación en bloque del análisis conversacional.

Compatibilidad A/B/C/D: acceso humano código+contraseña mediante identidad técnica Auth intacto; recuperación independiente B se concreta sin control global del coordinador; C exige permisos vigentes incluso con sesión previa; D mantiene autorización central/aceptación/membresías independientes. Revocación global por recuperación no elimina membresías: se exige nueva autenticación para volver a usarlas si siguen vigentes. Suspender una membresía fuera de recuperación sigue sin suspender automáticamente otras. DA no autoriza agentes a recuperar credenciales o autodelegarse; DF y DC sobre postulaciones/documentos/cupos no se alteran.

Invariantes técnicos propuestos para revisión: vínculo estable y único; factor no verificado no restablece; consumo único concurrente; decisión excepcional de alto riesgo exige dos aprobadores distintos autorizados; permiso fuera de operación/ámbito/vigencia o revocado no autoriza; vínculo ambiguo no activo antes de verificación; revocación y escritura ordenadas sobre autoridad vigente; auditoría sin secretos/evidencia personal innecesaria. No seleccionar tabla, índice, RPC, hash o proveedor por esta ratificación.

| Contraejemplo futuro | Criterio propuesto de aceptación, NO EJECUTADO |
|---|---|
| Canal no enrolado/verificado, código de recuperación repetido o consumo simultáneo | Ningún acceso indebido; máximo un efecto; respuesta pública no enumera identidad |
| Cuenta privilegiada/alto riesgo con una aprobación, dos del mismo actor o facultad caducada | No restablecimiento; falta de independencia no se subsana contando eventos |
| Recuperación completada seguida de JWT/refresh anterior | Sesión anterior no autoriza nuevas operaciones; nueva autenticación requerida, sin conservar excepciones entre agencias |
| Caída entre cambio de credencial y revocación, reintento del comando | No éxito falso ni acceso previo habilitado como recuperación completada; reconciliación/idempotencia pendientes de diseño |
| Autodelegación, rol elevado, ámbito/operación ajenos, permiso vencido/revocado | Denegar sin efecto; registro auditable y permisos base Maestro/Limitado preservados |
| Coordinador conoce código/contacto de cuenta ambigua y pide vincular/activar | No activación sin verificación independiente; IDs/historial preservados, sin fusión automática |
| Agencia A suspendida frente a recuperación global | Distinguir los eventos: suspensión local preserva B; recuperación exige reautenticación global sin borrar A/B |

Pendientes de ingeniería: contrato de enrolamiento/recuperación/sesión, clasificación operativa de riesgo y autoridades/evidencias concretas, plazos/canales seleccionados, matriz detallada y concesión/revocación, migración/reconciliación, antiabuso y autorización servidor/BD/RLS. No trasladar decisiones de índices/bloqueos/almacenamiento al PO salvo impacto funcional/riesgo. Cierre documental de contratos necesita diseño completo, revisión y aceptación aparte; implementación/validación necesitan autorización y evidencia posteriores.

Prioridad: corregir hallazgos → validar con evidencia → implementar después mejoras autorizadas. CT-01, CT-02 y REC-F2-001 NO CERRADOS; REC-F2-001/002 EN_CURSO solo diseño. 17 hallazgos abiertos, siete tareas F2 y nueve experimentos NO EJECUTADOS; inventario 30 MF preservado. Ninguna capacidad habilitada por esta actualización.

## CT-01/CT-02 — seis políticas operativas ratificadas, 2026-11-06

Fuente: PO, mandato «Consolidación de seis políticas operativas ratificadas CT-01/CT-02», base master/419b6d2b1348dfa193e63093606b275a6c4a6f76, inicio limpio y staging vacío. Las seis políticas siguientes están RATIFICADAS POR EL PO. Precisiones operativas de las cinco P0, no mecanismos físicos aprobados ni cierre de contratos. A/B/C/D y DF/DA/DC se conservan íntegros.

### POL-CT01-01 — Verificación independiente de titularidad — RATIFICADA

TCE realiza verificación central independiente proporcional al riesgo, exige evidencia suficiente, minimiza datos personales y refuerza controles para cuentas privilegiadas o casos sensibles. Coordinador puede asistir, nunca acreditar unilateralmente titularidad. Evidencia insuficiente impide completar recuperación excepcional o vinculación ambigua. No fijar documentos personales específicos ni recolección excesiva por inferencia.

### POL-CT01-02 — Clasificación de alto riesgo — RATIFICADA

Recuperaciones excepcionales de cuentas privilegiadas o con indicios fundamentados de apropiación, conflicto de titularidad o fraude requieren DOS aprobaciones centrales independientes, de personas distintas y facultadas. También aplica a cuentas ordinarias con alto riesgo. No basta repetir una aprobación, cambiar etiqueta de cuenta ni ignorar indicios para eludir revisión reforzada.

### POL-CT02-01 — Delegación controlada por autoridad — RATIFICADA

Administración central determina expresamente quién puede conceder o revocar cada facultad. Delegación limitada por operación, ámbito, destinatario y vigencia; revocable y auditable. Prohibidas autoconcesión, subdelegación implícita y escalamiento. Permiso para ejecutar no implica permiso para conceder. No designar concedentes concretos ni ampliar facultades de Limitado/IA sin autoridad expresa; contrato Maestro/Limitado intacto.

### POL-CT01-03 — Recuperación gradual y controlada — RATIFICADA

Recuperación ordinaria usa factores previamente verificados; pérdida o compromiso conduce a vía excepcional central. Autorizaciones con vigencia limitada y consumo único; invalidar factores sustituidos o comprometidos. Recuperación completada revoca todas las sesiones anteriores y exige nueva autenticación. Controles reforzados según riesgo. No inventar plazo, canal, factor o procedimiento específico; las alternativas de canal verificado/códigos de un uso de P0 1 se mantienen.

### POL-CT01-04 — Sesiones diferenciadas por riesgo — RATIFICADA

Controles más estrictos para administración y límites operativos adecuados para coordinadores/reclutadores. Distinguir cierre de sesión actual de cierre global. Recuperación de credenciales revoca globalmente sesiones anteriores. Sesión revocada no autoriza nuevas operaciones protegidas aunque JWT sea criptográficamente válido. No aprobar tiempos concretos ni cambiar silenciosamente contrato administrativo histórico de inactividad; parámetros y compatibilidad por especificar.

### POL-CT02-02 — Conservación histórica con acceso controlado — RATIFICADA

Suspender membresía bloquea acceso del usuario a la agencia afectada. Preservar expedientes, conversaciones, documentos e historial conforme a retención aplicable. Consulta histórica únicamente por OTROS actores expresamente autorizados, con finalidad legítima, ámbito y recursos limitados y auditoría. No restablecer permisos al suspendido ni afectar implícitamente otras membresías independientes. Conservación no implica permiso de lectura ni retención indefinida.

### Trazabilidad, sucesión y límites

| Política | P0 / decisión previa que precisa |
|---|---|
| POL-CT01-01 | P0 2/5; B y recuperación excepcional/enrolamiento ambiguo |
| POL-CT01-02 | P0 2; independencia de aprobaciones y riesgo de cuentas ordinarias |
| POL-CT02-01 | P0 4; C/D, facultad de ejecutar distinta de conceder/revocar |
| POL-CT01-03 | P0 1/2/3; recuperación dos vías y factores |
| POL-CT01-04 | P0 3; A/C, sesión vigente frente a autorización actual |
| POL-CT02-02 | C/D, membresías independientes; DF-PO-002/003, conservación sin acceso universal |

Estas precisiones suceden solo a pendientes funcionales que resuelven: verificación central, disparadores de alto riesgo, autoridad central para definir concedentes, recuperación gradual, sesiones por riesgo y exclusión histórica del suspendido. Antecedentes conservados, sin reabrir cinco P0 ni ratificar íntegro el análisis conversacional de estados/matriz. Suspensión local no es revocación global por recuperación; nueva autenticación no devuelve una membresía suspendida. DA no otorga recuperación autónoma/administración al agente y DC no habilita resultados inventados; cupos/postulaciones no se alteran.

Mecanismos técnicos PROPUESTOS/PENDIENTES: registro autoritativo de vigencia de sesiones/credenciales y membresías, control concurrente/idempotente de consumo y aprobaciones, matriz por operación/recurso y auditoría minimizada. Servidor y BD/RLS deben rechazar nueva operación revocada, sin confiar solo en expiración JWT, UI, metadata o service-role. No aprobar tabla/RPC/tecnología ni prometer retirada de información ya entregada.

Criterios de aceptación futuros NO CUBIERTOS POR PRUEBAS: evidencia insuficiente no activa/vincula/restablece; cuenta ordinaria con indicios fundamentados exige dos aprobadores facultados distintos; una facultad de ejecución no permite conceder; destinatario/ámbito/operación/vigencia alterados o revocados deniegan efecto; autorización de recuperación vencida/reutilizada no consume; factor sustituido/comprometido no recupera; sesión anterior se rechaza tras recuperación en servidor y canales directos; cierre actual no se confunde con global; suspendido no consulta historia de A, otro actor sin permiso/finalidad tampoco, B independiente conserva su tratamiento; acceso histórico legítimo queda acotado y auditado. Incluir positivos equivalentes y carreras revocación/escritura/consumo, sin declarar resultados ahora.

Pendientes concretos: catálogo/evidencia suficiente y responsables facultados, evaluación/revisión de indicios, plazos/canales seleccionados/enrolamiento y sustitución, límites de sesiones por rol, matriz operativa/concedentes, retención/finalidades históricas y mecanismos de consistencia/Auth–BD/Realtime/Storage/caché, fallos y reconciliación. Son especificaciones por completar, no reaprobación de políticas resueltas. CT-01/CT-02 y REC-F2-001 siguen ABIERTOS; REC-F2-001/002 EN_CURSO diseño. Cierre documental exige revisión/aceptación separada; implementación y validación técnica aún pendientes. Prioridad: reparar hallazgos → validar con evidencia → mejoras autorizadas.

## REC-F2-001 — consolidación documental CT-01/CT-02 R1 e I-11 ratificada, 2026-11-07

### Fuente, alcance y sucesión delimitada

Fuente/autoridad de escritura: PO, mandato «AUTORIZACIÓN PO: Consolidación documental CT-01/CT-02 R1», limitado a SPEC, HALLAZGOS, PLAN y TASKS de recuperación. Base master/5e0cb789927d6b5ab8892b33cfce38f6cdfd75da, inicio con árbol y staging limpios. La escritura documental está autorizada; no constituye aceptación técnica final, implementación, validación, commit o despliegue.

Antecedente: TCE_CT01_CT02_PROPUESTA_ORIGINAL_PARA_CODEX.txt, SHA-256 `8F452D61272ABAE689B84BAAAB2DC9322EBE2719A84BD15C920037144238DC22`; revisión adversarial H01–H12; propuesta conversacional R1 y diff previo, con los ajustes de preservación íntegra y continuidad del mandato actual. Este bloque es autosuficiente: no necesita el archivo del escritorio ni conversaciones anteriores para interpretar los contratos. Conserva I-01–I-11, A-01–A-12, M-01 y P01–P40.

Estado: políticas expresamente ratificadas se identifican como tales; modelo, estados, mecanismos, parámetros no seleccionados y procedimientos técnicos son **PROPUESTOS PARA VALIDACIÓN**. Autorizar su incorporación no ratifica en bloque R1 ni acredita capacidades de Supabase Auth, BD o transportes.

Permanecen A/B/C/D, cinco P0 y seis políticas operativas ratificadas, Maestro/Limitado, TCE-004 y contratos público/privado del candidato. DF/DA/DC y sus pendientes no se alteran; no se habilitan agentes, motor de mensajes, comisiones, cupos o pipeline por este registro.

Sucesión exclusiva: (a) la separación central/agencia deja de ser una decisión conceptual pendiente; (b) I-11/H07/P35 dejan de depender de aprobación funcional; (c) los vacíos H01–H12 reciben las correcciones contractuales propuestas siguientes. Antecedentes se preservan como históricos, sin constituir fuentes alternativas permisivas. «Completar matriz/estados» en continuidades anteriores queda sucedido por R1 incorporada; catálogos, parámetros, revisión/aceptación y evidencia siguen pendientes.

### CT-02 — separación central/agencia — RATIFICADA POR EL PO

La autoridad administrativa central de TuChambaExpress es independiente de las membresías operativas de agencia. Las facultades centrales deben ser expresas, delimitadas por operación, recurso y ámbito, revocables y auditables.

Una facultad central no concede automáticamente membresía local ni acceso a candidatos, expedientes, conversaciones, documentos u otros recursos privados de las agencias. Las operaciones locales requieren membresía y permisos vigentes en la agencia correspondiente. Las centrales requieren autoridad central específica y vigente. Todo acceso transversal excepcional privado requiere autorización expresa, finalidad legítima, alcance limitado y auditoría. Denegar cualquier operación cuyo ámbito o autoridad no pueda demostrarse. Complementa C/D, sin sustituir sus restantes requisitos.

### CT-01 / I-11 — suspensión y restauración global — RATIFICADA POR EL PO

Fuente: ratificación expresa del PO anterior al mandato de consolidación y reiterada en este.

1. Suspender globalmente una identidad invalida todas sus sesiones anteriores.
2. Durante la suspensión se impiden nuevos inicios de sesión, renovaciones y operaciones protegidas.
3. Restaurar la identidad exige autenticación nueva.
4. Las sesiones anteriores nunca se rehabilitan.
5. No se reactivan automáticamente membresías, permisos o delegaciones revocados.
6. Suspender una membresía local no equivale a suspender la identidad global ni afecta otras membresías vigentes.

Generaciones, registros autoritativos, bloqueos y adaptadores son mecanismos propuestos. No se promete invalidación criptográfica instantánea de JWT ni retirada de información previamente entregada. I-11 no suspende por inferencia otras membresías ni cancela bloqueos técnicos de recuperación/migración al restaurar.

### Modelo lógico mínimo — PROPUESTO

No se elige esquema físico ni se exige una tabla por entidad.

| Entidad | Contenido y límite |
|---|---|
| Identidad global | ID estable, vínculo Auth único, estado y versión; correspondencia acreditada con persona o principal técnico |
| Perfil | IDs existentes reclutador/coordinador/administrador, atributos permitidos; sin autoridad editable por cliente |
| Credenciales | Estado, generación vigente y cambio en curso; nunca contraseña de aplicación persistida |
| Factor | Titular, tipo, verificación, estado, versión, generación y material de comprobación protegido |
| Sesión de negocio | Sujeto, sesión Auth verificable, procedencia de autenticación, generaciones, estado y límites temporales |
| Membresía | Sujeto, agencia, rol, estado, versión y permisos; independencia entre agencias |
| Facultad central | Operación, recurso, ámbito, destinatario, vigencia y autoridad de origen |
| Delegación | Concedente/beneficiario efectivos, límites, origen, dependencias y revocación |
| Invitación | Destinatario verificado, agencia, términos versionados, autorización central, aceptación, vigencia y consumo |
| Recuperación | Sujeto, vía, riesgo, evidencia referenciada, revisiones/aprobaciones y autorización limitada |
| Ejecución de recuperación | Identidad, autorización consumida, generación esperada, pasos externos y reconciliación |
| Efecto externo | Comando autorizado, destino, controlador/versiones, intento y resultado de despacho |
| Migración | Correspondencia privada verificada, estado, versión de corte y reconciliación |
| Auditoría | Actor efectivo, sujeto, operación, ámbito, versiones, autorización, decisión, resultado y correlación |

Una persona aprobadora puede tener varias cuentas: cuentan como una persona. La correspondencia se acredita previamente; no se deduce por nombre/correo/teléfono coincidentes. Independencia no demostrada no satisface dos aprobaciones.

### Autorización común y matriz de permisos

Operación protegida: identidad/capacidad verificada, estado habilitado, sesión o capacidad adecuada, generaciones actuales, autoridad y transición permitidas. Agencia del recurso se deriva de relaciones autoritativas, no del contexto cliente. Agencia habilitada para esa operación; las operaciones centrales sobre su estado se autorizan por su facultad específica, sin exigir que esté operativamente activa para administrarla.

| Ámbito | Autoridad necesaria | Límite |
|---|---|---|
| Local privado | Rol, membresía activa y permiso vigente en agencia del recurso | No unir permisos de distintas agencias |
| Central | Facultad específica vigente por operación/recurso/ámbito | No membresía ficticia ni acceso local automático |
| Transversal excepcional privado | Autorización expresa, finalidad legítima, recursos/acciones/vigencia limitados y auditoría | No excepción administrativa general ni acceso histórico al suspendido |
| Candidato | Capacidad verificable ligada al recurso, acciones y destinatario aprobados | No sesión administrativa o membresía de empleado |
| Público | Operación/proyección expresamente públicas | Sin expedientes ni historial por contacto |

Una operación compuesta acredita cada componente. Autorizar incorporación no autoriza consultar candidatos. Ámbito o autoridad indeterminados: denegar. Claims, metadata editable, localStorage y parámetros cliente no acreditan autoridad vigente.

En la matriz siguiente las facultades/límites ratificados se conservan; las comprobaciones técnicas son propuestas. «Designada» exige registro central vigente con facultad específica, no mero nombre de rol.

| Actor | Operación/recurso | Condiciones, concesión y límite |
|---|---|---|
| Público | Vacantes públicas | Proyección mínima publicable; sin columnas privadas |
| Candidato | Postulación pública | Flujo acotado y admisión DF/DC; no concede lectura anterior ni permiso general |
| Candidato con capacidad | Expediente/chat/documento propio | Recurso, acciones, destinatario y vigencia; mecanismo entre dispositivos pendiente, no habilitado aquí |
| Reclutador | Login | Código+contraseña Auth; sin agencia cliente como autoridad ni cambio de vínculo |
| Coordinador/administrador | Login | Contrato compatible vigente; sin conceder rol al entrar |
| Titular autenticado | Sesiones propias y cierre actual/global | Sujeto propio, sesión y alcance comprobados; no amplía facultades |
| Titular | Enrolar/sustituir factor | I-05, reautenticación y prueba; no verificación desde cliente |
| Solicitante | Iniciar recuperación | Respuesta genérica; sin acceso ni bloqueo por mera solicitud |
| Titular con prueba | Recuperación ordinaria | Factor previo vigente, autorización limitada y de un uso |
| Coordinador | Asistir recuperación/enrolamiento | Ámbito local; no acredita unilateralmente ni recibe secreto global |
| Verificador/aprobador central | Caso de recuperación | Facultad, independencia, riesgo/evidencia actuales; sin lectura general de expedientes |
| Reclutador | Perfil propio | Solo columnas permitidas; contacto no altera identidad/factor/rol |
| Reclutador | Recursos asignados de agencia | Membresía/permiso vigentes; no edita vacantes ni se apropia de recursos ajenos |
| Coordinador | Equipo/recursos locales | Membresía coordinador activa y comando catalogado; sin poder global |
| Coordinador | Solicitar incorporación | Agencia/destinatario exactos; solicitud pendiente sin acceso |
| Coordinador invitado | Aceptar incorporación | Sujeto y términos exactos; no concede autoridad central |
| Maestro/admin expresamente facultado | Autorizar incorporación | Facultad central conforme D; no subdelegación inferida ni lectura privada |
| Maestro | Gestionar administradores | Contrato y límites vigentes; no facultad universal inferida |
| Limitado | Operación administrativa permitida | Base/delegación compatible; nunca gestión de administradores por permiso operativo |
| Autoridad de membresía | Suspender/revocar/reactivar | Facultad por operación y agencia; no toca identidad u otras agencias |
| Autoridad central designada | Conceder/revocar delegación | Concesión/revocación separadas, beneficiario efectivo distinto, origen/techo/vigencia |
| Otro actor autorizado | Historia | Finalidad/recursos/proyección limitados y auditoría; suspendido excluido |
| Actor con excepción privada | Acceso transversal | Autorización expresa acotada, no rol central genérico |
| Auditor autorizado | Auditoría/evidencia | Facultad y propósito por dato; sin apertura general de expedientes |
| IA | Rutina delegada | Principal propio, ámbito/capacidad/límites/controlador; habilitación futura pendiente |
| Agente Reclutador IA | Recuperación/privilegios/decisión definitiva laboral | Denegado; posibilidad futura condicionada D requiere contrato/delegación separados |
| Servicio técnico | Paso privilegiado | Comando y efecto exactos previamente autorizados; service-role no es autoridad de negocio |
| Cualquier actor | Operación ausente/ámbito incierto/permiso vencido | Denegar sin privados ni efecto |

Cada permiso positivo requiere negativo equivalente variando actor, operación, recurso, agencia, membresía, vigencia, concedente o estado.

### Convenciones de comandos, errores y auditoría — PROPUESTAS

Entradas no confiables: cuerpo/ruta/query/cookies/JWT/cabeceras, actor/rol/agencia, estado esperado, finalidad e idempotencia. Fuentes confiables solo tras verificar: identidad Auth, vínculo privado, reloj servidor/BD, relaciones y autoridad de negocio. Cabecera interna solo si cliente no puede establecerla.

Mutaciones: resolver actor/recurso → derivar ámbito/relaciones → comprobar sesión/generaciones/autoridad → bloquear o comparar versiones de autoridad y recurso → revalidar dentro de unidad transaccional → confirmar efecto/estado/idempotencia/auditoría juntos. Si revocación confirma primero, escritura posterior no confirma con autoridad anterior. Orden de bloqueo definido y validado posteriormente; comprobación inicial fuera de transacción no basta.

Idempotencia ligada a actor/operación/ámbito/huella de contenido no secreto; misma clave/contenido consulta misma ejecución, distinto contenido conflicto. No almacenar contraseñas ni huellas reutilizables de estas. Reintento no consume de nuevo ni omite autorización actual; tampoco permite devolver privados tras revocación.

Lecturas autorizan proyección antes de entregarla. Historia/evidencia/auditoría registran acceso exigido antes de liberar datos; fallo del registro bloquea entrega. Registro de lectura no recursivo. Auditoría minimizada: IDs internos, actor efectivo, sujeto, operación, ámbito/agencia/recurso, versiones, facultad/decisión, resultado y correlación; historia además finalidad. Sin contraseñas/tokens/códigos/evidencia personal completa.

Efectos externos: confirmar intención no certifica entrega. Despacho tiene revalidación/concurrencia/resultados propios; no atomicidad Auth–BD/transporte asumida. Notificar después de confirmar comando, mediante entrega rastreada y reintentable solo cuando sea seguro.

#### Transporte de sesión y protección de mutaciones — PROPUESTA vinculante para R1

Remisión interna: sección «REC-F2-001 — contrato técnico propuesto de identidad y autorización, 2026-11-06», párrafo «Sesión propuesta y preferencia confirmada». R1 incorpora ese contrato de transporte y lo reproduce aquí para evitar dependencia de una lectura histórica separada. No reabre A/B/C/D ni cambia TCE-004. «Vinculante para R1» designa requisito de esta propuesta técnica, no ratificación de mecanismos ni evidencia de funcionamiento.

Preferencia de diseño conservada: SSR más cliente navegador, propagación getAll/setAll donde corresponda, verificación de identidad en servidor y autoridad actual en BD/RLS. No se promete que tokens sean HttpOnly ni que el identificador técnico sea invisible al navegador. Conocerlo no concede permisos. localStorage conserva como máximo preferencias, nunca autoridad.

Login, renovación, expiración y logout deben tratar coherentemente cookies y registro de negocio. Error de propagación no concede una sesión ni prolonga autoridad; el resultado incierto se identifica y revalida antes de continuar. No afirmar completitud del cierre externo por haber borrado una cookie.

Toda mutación autenticada mediante cookies requiere controles de origen/CSRF adecuados al flujo, incluidos cambios de factor, recuperación, incorporación, delegación y operaciones locales. Proteger también flujos de login y recuperación contra envío cruzado cuando corresponda; el rechazo público no debe revelar existencia de cuenta.

El origen esperado procede de configuración confiable. No confiar en valores cliente o cabeceras reenviadas sin frontera de confianza definida. SameSite, CORS o usar POST no constituyen por sí solos evidencia de protección CSRF. Origin ausente o no verificable no produce excepción permisiva: requiere mecanismo alternativo expresamente diseñado y validado; en su ausencia, denegar el flujo afectado.

Rutas con credenciales no ambientales, como token explícito de principal técnico, necesitan contrato de autenticación propio. No se convierten en bypass al aceptar silenciosamente cookies como alternativa. Origen/CSRF no sustituye sesión, generaciones, membresía, permisos o autoridad central.

Aplicar estas condiciones a I-01–I-11 y A-01–A-12 según transporte real; M-01 debe impedir que el camino heredado omita protecciones. Configuración efectiva, compatibilidad SDK y controles de todas las rutas permanecen pendientes de validación. Sin demostración, no habilitar flujo.

| Situación | Resultado contractual |
|---|---|
| Sintaxis inválida | 400 sin detalles internos |
| Login inválido/inexistente/inactivo | Error público homogéneo, sin enumerar |
| Sesión ausente/revocada | 401 sin rehabilitar autoridad |
| Recurso ajeno/inexistente sensible | Indistinguible de no disponible |
| Prohibición conocida sin filtración | 403 |
| Versión/idempotencia incompatible | 409 sin nuevo efecto parcial |
| Abuso | 429 no enumerador |
| Autoridad/configuración indisponible | 503, sin caché permisiva sustitutiva |
| Saga/efecto externo incierto | Estado pendiente reconciliable, nunca éxito/fallo definitivo ficticio |

### Máquinas de estados — PROPUESTAS

Toda transición compara estado/versión. Expiración, inactividad y generaciones obsoletas se comprueban autoritativamente aunque materialización sea diferida.

| Objeto | Transiciones | Restricción |
|---|---|---|
| Identidad | pendiente_vinculación→activa; activa↔suspendida; activa/suspendida→retirada | I-11 ratificada; facultad global; login no restaura; historia preservada |
| Credenciales | no_enroladas→activación_pendiente→utilizables→cambio_en_curso; cambio_en_curso→resultado_incierto/bloqueadas/utilizables con generación nueva; resultado_incierto→cambio_en_curso/bloqueadas; →invalidadas | Salida de incertidumbre solo por reconciliación acreditada; nueva generación utilizable solo al completar ejecución; fallida_bloqueada mantiene credenciales bloqueadas. No generación anterior ni acceso con efecto incompatible pendiente |
| Factor | pendiente_verificación→verificado→sustituido/comprometido/revocado; código de recuperación→consumido | Terminal no revive; código de login nunca es factor |
| Sesión | registro_pendiente→activa→revocada/cerrada | Terminal/expirada/generación obsoleta no opera |
| Membresía | pendiente→activa→suspendida/revocada; suspendida→activa autorizadamente | Revocada requiere nueva incorporación; A independiente de B |
| Invitación | borrador→autorizada→emitida→consumida; rechazada/revocada | Aceptación exacta registrada atómicamente con consumo/activación; no estado aceptada que autorice por sí solo |
| Recuperación ordinaria | solicitada→factor_comprobado→autorizada→ejecutando→completada/fallida_bloqueada; antes de ejecución rechazada/revocada/vencida | Prueba consumida no se restaura por fallo; resultado del caso refleja ejecución, no libera acceso |
| Recuperación excepcional | solicitada→evaluación→evidencia_suficiente→aprobaciones_pendientes→autorizada→ejecutando→completada/fallida_bloqueada | Cambio material vuelve a evaluación e invalida decisiones afectadas; resultado refleja ejecución sin habilitación implícita |
| Ejecución recuperación | preparada→efecto_pendiente→efecto_confirmado→reconciliando; preparada/efecto_pendiente/efecto_confirmado/reconciliando→resultado_incierto si un efecto pudo emitirse; resultado_incierto→resultado_incierto/reconciliando; reconciliando→efecto_pendiente/completada/fallida_bloqueada | Salidas solo bajo condiciones/evidencia de la tabla de reconciliación. Incierto retiene exclusión; fallida_bloqueada terminal no habilita identidad ni restaura generaciones |
| Delegación | propuesta→activa→revocada | Cambiar términos crea nueva concesión versionada; origen/dependencias vigentes |
| Efecto IA | pendiente→autorizado_para_despacho→en_despacho→aceptado_por_transporte; cancelado/resultado_incierto | Aceptado no es entregado/leído; incierto sin reenvío ciego |
| Migración | clasificada→preparada→corte_en_curso→verificada; bloqueada/reversión_segura | Autoridad única; no reapertura insegura |

Riesgo modificado recalcula aprobación; facultad se verifica al aprobar y consumir. Identidad activa sin membresías no es inexistente. Bloqueo técnico no es suspensión administrativa. Completar recuperación exige revocación/reconciliación; volver a operar exige autenticación nueva posterior, no requisito circular de completitud.

### CT-01 — contratos de identidad, sesiones y recuperación revisados

| Contrato | Precondiciones, invariantes y postcondiciones propuestas |
|---|---|
| I-01 Provisionar/vincular | Operador con facultad, sujeto/perfil identificados y titularidad acreditada. Reservar unicidad de sujeto/vínculo/perfil; no contacto coincidente. Provisionamiento durable reconciliable; confirmar correspondencia/versiones/auditoría al reconciliar. Fallo/ambigüedad pendiente sin privilegios; verificación central independiente cuando corresponde |
| I-02 Login | Reclutador: código resuelto privadamente y contraseña verificada por Auth sin transformar. Estado/generaciones antes y después; registrar solo procedencia verificable del intercambio iniciado por servidor. JWT/refresh/getUser no son autenticación nueva. Ordenar con revocación/corte/recuperación; respuesta tardía no registra generación anterior. Sin roles de metadata ni sesión cliente como prueba |
| I-03 Renovar/consultar | Solo sesión registrada no terminal, vínculo/generaciones actuales y continuidad verificable de rotación. Revalidar después de intercambio y antes de entregar contexto. Desconocida no se registra. Actividad según parámetro; refresh/polling no equivalen automáticamente a actividad humana |
| I-04 Cerrar actual/global | Actual termina registro propio; global aumenta generación e inutiliza anteriores. Login concurrente se ordena con cierre. Negación de negocio no depende de borrar cookie. Revocación Auth pendiente rastreada; si puede afectar sesiones posteriores, bloquear registro nuevo hasta resolver |
| I-05 Enrolar/sustituir factor | Sesión y reautenticación demostrable fresca ligada a acción; no fecha refresh. Primer factor requiere titularidad previa y prueba del nuevo; heredada ambigua pasa I-01/M-01. Sustitución exige anterior o excepcional. Confirmar sustitución/versionar e invalidar derivados antiguos atómicamente. Códigos protegidos y entrega controlada; pérdida de entrega no permite consulta ordinaria para reexponer |
| I-06 Solicitar recuperación | Respuesta homogénea/referencia opaca/cuotas; sin datos de factor/destino/existencia ni consulta de estado sin capacidad. Mera solicitud no invalida sesiones, consume factores o reserva exclusión |
| I-07 Autorizar ordinaria | Factor previo verificado; titular/generación/versiones/vigencia/intentos. Consumo/reserva única concurrente. Autorización opaca identidad/acción/factor/versiones/generación. Revocación/sustitución/compromiso invalida derivados; I-10 revalida |
| I-08 Evaluar excepcional | Facultad central específica, evidencia mínima suficiente y caso versionado. Coordinador asiste, no acredita. Privilegio/indicios fundamentados elevan riesgo. Evidencia privada exige autoridad limitada propia, no lectura general. Cambio material invalida decisiones afectadas |
| I-09 Aprobar excepcional | Sujeto/caso/evidencia/riesgo/versiones exactos. Ordinaria sin alto riesgo: revisión central independiente; privilegiada/alto riesgo: dos personas distintas facultadas independientes. Excluir titular/solicitante interesado/conflictos definidos; dos cuentas de una persona cuentan una. Independencia no acreditada bloquea. Revalidar facultad/riesgo/conflictos al ejecutar |
| I-10 Completar recuperación/cambiar credencial | Autorización vigente limitada/de un uso y generación. Exclusión por identidad entre vías y cualquier cambio de credencial interferente; procedimiento siguiente. No sesión de negocio emitida, exige I-02 posterior. Cambio autenticado ordinario solo con autorización propia y misma exclusión; no se crea aquí ruta adicional |
| I-11 Suspender/restaurar identidad global | Política RATIFICADA arriba. Facultad central específica/motivo/auditoría. Suspender invalida sesiones e impide login/refresh/operaciones; restaurar exige login nuevo sin rehabilitar sesiones o autoridad revocada. No cancela bloqueos técnicos ni reactiva membresías suspendidas por inferencia |

Resolución privada del código: alias estable, separado de contacto/código, namespace legítimamente controlado, no editable por cliente ni devuelto en respuestas propias de resolución. Servidor no persiste contraseña de aplicación. Normalización propuesta: recorte exterior/mayúsculas solo tras análisis autorizado de colisiones; contraseñas sin normalizar; sin reutilización automática de códigos. Colisión bloquea vínculo afectado.

Antiabuso: límites compartidos entre instancias por origen/código pseudonimizado, respuestas homogéneas, presupuesto de trabajo y reintentos; sin bloqueos permanentes inducibles por solicitudes anónimas. Parámetros se configuran y validan antes de habilitar.

Registro de sesiones: generaciones de credenciales y global de sesiones, procedencia verificable, estado terminal y sesión Auth verificable. Solo I-02 registra; no registrarSesion(jwt) accesible al cliente. I-02 lee generaciones y ausencia de recuperación, inicia Auth servidor, verifica resultado/sesión, compara nuevamente bajo concurrencia y registra solo sin cambio ni marca terminal. Si el proveedor no ofrece vinculación suficiente demostrable, alta de sesiones bloqueada hasta mecanismo equivalente validado.

### I-10 — exclusión, saga y resultado incierto Auth–BD

1. I-07 comprueba y reserva/consume la prueba de factor y emite su autorización derivada en una transacción de negocio propia: una prueba no produce dos autorizaciones. I-09 registra aprobaciones versionadas. Ninguna de esas operaciones cambia por sí sola credencial Auth, invalida sesiones o concede acceso.
2. I-10 ejecuta una única transacción de inicio bajo exclusión por identidad. Dentro revalida autorización/origen, generaciones, factor o aprobaciones, riesgo, facultades y ausencia de ejecución incompatible; consume autorización; crea ejecución durable e idempotencia; marca credenciales en cambio; invalida autorizaciones competidoras de generación anterior; aumenta generación de sesiones; impide registros nuevos; y registra auditoría. Todos esos cambios se confirman o revierten juntos. Una autorización por prueba no sustituye esta exclusión adicional por identidad.
3. Antes de confirmar esa transacción no se emite ningún efecto Auth. Si falla/revierte, ninguno de sus cambios queda confirmado. La prueba consumida previamente por I-07 no se restaura por ese fallo; la autorización solo conserva el estado anterior a la transacción fallida. No presumir que sigue utilizable: nuevo intento revalida todo.
4. Después del commit, trabajador autorizado registra durablemente cada intento externo antes de emitirlo. No mantiene transacción de negocio abierta durante llamada. Registro de intención no demuestra envío ni ausencia de trabajador todavía capaz de enviarla.
5. Cambio de credencial y revocación externa son pasos separados correlacionados con misma ejecución. Duplicación, pérdida de respuesta o posible envío requieren resultado_incierto, no repetición ciega. Exclusión no se libera por expiración del trabajador.
6. Con evidencia de resultados, transacción de finalización revalida ejecución/versiones; confirma generación nueva de credenciales; invalida factores comprometidos/sustituidos y sus derivados; registra resultado/idempotencia/auditoría. Ningún factor nuevo se activa implícitamente por completar recuperación.
7. Marcar completada solo con efectos necesarios reconciliados y ningún intento capaz de efecto tardío incompatible. Retirar únicamente bloqueo técnico de esta ejecución, no suspensión global, bloqueo de migración u otro impedimento. I-02 solo opera si cumple restantes precondiciones.
8. Titular vuelve mediante autenticación nueva con credencial resultante. Autorización/capacidad de recuperación nunca se convierte en sesión de negocio.

Timeout/desconexión/pérdida de trabajador no prueban cancelación o fallo. Lease vencido no libera exclusión si pudo enviarse efecto. Sustituto reconcilia, no repite automáticamente. Versión BD impide confirmación obsoleta de negocio, pero no detiene petición ya enviada a Auth.

Antes de otro cambio acreditar que el anterior terminó y no producirá efecto tardío incompatible. Sin prueba, mantener bloqueo técnico y escalar; tiempo arbitrario no lo resuelve. No restaurar generación anterior ni declarar éxito. No persistir contraseña en logs/colas/idempotencia; nueva aportación del titular requiere paso limitado autorizado después de resolver ejecución previa. Ventana de exclusión comienza con ejecución autorizada, nunca mera solicitud anónima. Reconciliación debe demostrarse antes de habilitar recuperación automatizada.

#### Salidas de resultado_incierto y autoridad de reconciliación — PROPUESTA

Resultado incierto aplica a cualquier paso externo cuyo envío/resultado no pueda determinarse, incluso caída entre registrar intención, enviar y persistir respuesta. Mantiene exclusión y bloqueo técnico de identidad; no es éxito, fallo confirmado ni permiso de reintento. La tabla principal de ejecución enumera las mismas transiciones que la siguiente; el caso ordinario/excepcional refleja el resultado de ejecución sin conceder acceso adicional.

Autoridad: reconciliador técnico/humano con facultad central específica para inspeccionar y registrar ejecución. No basta coordinador, administrador genérico, titular o service-role. No permite cambiar sujeto, saltar aprobaciones, elegir otra contraseña, conceder permisos o leer expedientes privados ajenos. Personas/capacidades concretas deben designarse antes de habilitar.

Evidencia mínima: identidad/ejecución correlacionadas; paso/intento; versiones/generaciones; resultado externo verificable; acreditación de que todos los intentos anteriores terminaron o no pueden producir efectos posteriores incompatibles. Evidencia de salud del servicio o temporal aislada, lease vencido, 2xx no correlacionado, JWT vigente o afirmación cliente no satisfacen la prueba. No guardar contraseñas para verificar resultados.

| Salida | Condiciones y evidencia | Consecuencia |
|---|---|---|
| Permanecer en resultado_incierto | Evidencia insuficiente/contradictoria o intento aún capaz de ejecutarse | Conservar exclusión/bloqueo, alertar/escalar; ningún nuevo efecto incompatible |
| resultado_incierto→reconciliando | Reconciliador facultado registra evidencia suficiente de resultado y cierre de intentos anteriores | Transición por versión y auditoría; todavía no habilitar acceso |
| reconciliando→efecto_pendiente | Paso restante necesario todavía no emitido; ausencia demostrada de intento anterior equivalente capaz de ejecutarse; autoridad limitada vigente o nuevamente obtenida | Continuar misma ejecución con nuevo intento rastreado; no reutilizar autorización consumida como nueva |
| reconciliando→completada | Efectos requeridos confirmados, sin efecto tardío incompatible posible y finalización de negocio confirmada | Terminar ejecución y retirar solo su bloqueo técnico; autenticación nueva y restantes controles obligatorios |
| reconciliando→fallida_bloqueada | Fallo definitivo acreditado e intentos cerrados, sin postcondiciones de recuperación cumplidas | Terminal de ejecución; credenciales de negocio bloqueadas, generaciones/pruebas consumidas no restauradas |

Requisito normativo de esta propuesta autorizado por PO: **fallida_bloqueada impide login, renovación y operaciones protegidas por todas las rutas relevantes**: servidor/SSR/navegador, SDK/rutas alternativas Auth, REST/BD/RLS/RPC, operaciones administrativas privilegiadas/service-role, Storage/Realtime/cachés/exportaciones/colas según datos y acciones protegidos. Ningún token válido, cookie residual, respuesta cacheada o restauración I-11 omite el bloqueo. No se impide por ello solicitar asistencia o iniciar un nuevo procedimiento limitado expresamente autorizado para resolverlo; ese procedimiento no concede acceso de negocio.

El requisito anterior no declara que Supabase Auth ya lo aplique. Generaciones, registro autoritativo, intermediación/restricción de rutas y adaptadores son mecanismos propuestos no implementados ni validados. Si una ruta relevante no puede demostrar el rechazo exigido, queda bloqueada su habilitación; no se sustituye el requisito por esperar expiración JWT. No se promete retirar información ya entregada.

fallida_bloqueada no equivale a suspensión administrativa ni se resuelve con I-11/restaurar. Termina procesamiento de esa ejecución, no habilita identidad. Una recuperación posterior exige autoridad nueva, evidencia de ausencia de efectos tardíos anteriores y traspaso transaccional a ejecución nueva sin ventana de acceso. No exige por sí sola nuevas aprobaciones sobre caso cuyo alcance no cambió: reutilizar evidencia solo si conserva vigencia/versión/independencia y reglas aplicables. Autorización de ejecución consumida nunca se reutiliza. Ninguna transición devuelve ejecución terminal a activa.

Sin garantía demostrada para determinar resultado o impedir efectos tardíos, no hay salida habilitante de resultado_incierto: mantener bloqueo. I-05 conserva transacción distinta para activar factor comprobado, sustituir anterior e invalidar derivados. Crear/verificar factor no forma parte implícita de I-10. Prueba externa precede confirmación; resultado incierto no se declara verificado. Ninguna transacción de negocio incluye atómicamente Auth, canal de entrega o Storage.

### CT-02 — contratos de autorización revisados

| Contrato | Precondiciones, invariantes y postcondiciones propuestas |
|---|---|
| A-01 Contexto/agencia | Enumerar membresías propias; contexto explícito por petición, pestañas independientes. Contexto central separado. Cambio limpia caché/suscripciones del contexto; cada operación revalida, no modifica roles |
| A-02 Recurso privado | Derivar pertenencia y exigir autoridad local actual; excepción transversal solo expresa. Filas/columnas/joins/conteos/exportaciones/metadatos cubiertos. Nunca recuperar amplio para filtrar cliente. Compartidos ambiguos bloqueados |
| A-03 Solicitar incorporación | Solicitante facultado, destinatario/agencia/rol/permisos exactos; pendiente sin acceso ni revelación privada del destino. Duplicado equivalente misma solicitud sin enumerar ajenos |
| A-04 Autorizar/emitir invitación | Facultad central de concesión conforme D, términos versionados y destinatario verificado; sin membresía ficticia ni privados implícitos. Secreto opaco protegido/vigencia/revocación; entregar después de registro confirmado y revalidar despacho |
| A-05 Aceptar/activar | Derivar invitación del secreto, no ID cliente. Sujeto vinculado/autenticado acepta términos exactos; nuevo completa I-01/enrolamiento antes de activar. Revalidar central/vigencia/términos; aceptación-consumo-activación atómicos y únicos; revocación comparte orden |
| A-06 Suspender/revocar membresía | Facultad específica y agencia derivada; versionar/auditar, bloquear accesos de esa agencia y cancelar tareas dependientes no despachadas. Preservar historia/identidad/otras agencias; sesiones identifican pero no autorizan allí |
| A-07 Reactivar/reincorporar | Suspendida: facultad/permisos actuales sin revivir terminales; cambio de términos requiere aceptación. Revocada: nueva incorporación trazada; coordinador exige autorización central y aceptación nuevas aunque coincidan términos. Relacionar historial sin restaurar concesiones antiguas |
| A-08 Conceder delegación | Facultad expresa de concesión, no ejecución. Beneficiario efectivo distinto, cuentas alternativas no eluden; operación/recursos/vigencia dentro del techo. Dependencias sin ciclos y origen vigente; sin subdelegación implícita ni membresía/excepción privada por sí sola |
| A-09 Revocar delegación | Facultad específica; terminar concesión e impedir dependientes incompletos al uso, sin propagación eventual permisiva. Restaurar concedente no revive terminales; requiere concesión nueva |
| A-10 Historia | Otro actor autorizado, finalidad legítima/recursos/proyección limitados; suspendido excluido de historia de su agencia. Central transversal requiere excepción concreta, finalidad catalogada no basta. Auditoría antes de liberar; sin modificar historia |
| A-11 Operación IA | Principal propio/capacidad/ámbito, membresía si local, recurso/límites/controlador/versiones. Confirmar intención, despacho con procedimiento siguiente. Sin sesión humana ni recuperación/administración de privilegios |
| A-12 Auditoría | Facultad/propósito por dato; metadatos centrales y evidencia privada separados. Filtrar filas/columnas; registro de lectura no recursivo, minimizado, antes de liberar. Fallo del registro exigido bloquea entrega |

Orden concurrente específico: A-05 con revocación sobre misma autorización; A-06 con escrituras sobre membresía vigente; A-08/A-09 y uso sobre origen/dependencias; A-11 con versión del controlador. No enviar mensajes antes de confirmar comando autorizante.

Delegación: identificar beneficiario humano/técnico estable, no inferir por contactos. Identidad alternativa no acreditada mantiene concesión sensible pendiente. Rechazar A→A y A→B→A y cadenas que creen facultad ausente en origen. Cambiar rol/términos/destinatario/vigencia aplica los mismos controles. Autoridad explícita para cadena no elimina prohibición de autoconcesión o escalamiento.

### A-11 — despacho externo IA y toma de control humano

1. Confirmar comando crea mensaje pendiente con principal/agencia/conversación/controlador/versión/destino.
2. Antes de despacho revalidar autoridad, versión y destino; la tarea pendiente no conserva permiso indefinido.
3. Despacho y toma humana comparten barrera por conversación.
4. Toma humana ordenada primero cancela pendientes IA anteriores.
5. Si despacho comenzó primero, toma bloquea nuevos despachos IA y rastrea intentos en curso; no declara cancelado lo que el transporte puede aceptar.
6. Resultado incierto se reconcilia sin reenvío ciego ni presunción de cancelación; duplicados deben controlarse según garantía demostrada del transporte.
7. Aceptado antes de traspaso puede llegar después; mostrar envío previo en curso, no atribuirlo al humano.
8. Exigir que tampoco llegue después requiere garantía externa; sin ella esa modalidad bloqueada. Habilitar despacho depende de demostrar ausencia de nuevos envíos tras traspaso; no se construye ahora.

### M-01 — migración, corte y reversión seguros

1. Futura inspección autorizada clasifica vínculo inequívoco/sin vínculo/colisión/conflicto.
2. Preservar IDs de perfiles/postulaciones/conversaciones/documentos/referencias/relaciones/historial.
3. Correspondencias privadas versionadas y titularidad acreditada; no enlazar por contacto/nombre/código ni sustituir masivamente claves históricas.
4. Ambigüedad: coordinador asiste, central verifica independientemente; insuficiencia pendiente sin acceso; no segunda identidad evasiva.
5. Si ya existe Auth, conservar sujeto acreditado; preparar autoridad destino sin activar.
6. Reservar corte por identidad, coordinado con login, recuperación, credenciales y vinculación; unicidades de sujeto/vínculo/membresía, conflictos a revisión.
7. Antes de corte demostrar que los caminos heredados quedan inservibles para esa cuenta; sin ello corte bloqueado.
8. Corte cambia origen autoritativo y versión/generación e invalida sesiones anteriores como unidad de negocio. Ningún estado admite OR permisivo entre autoridades vieja/nueva.
9. Verificar sujeto/membresías/permisos/todos los caminos antes de login nuevo. Adaptador por correo consume correspondencia verificada, no busca dueño por correo mutable.
10. Fallo/resultado externo incierto mantiene bloqueo y reconciliación; lotes pequeños con estado anterior/correspondencia/resultado auditados sin secretos.
11. Reversión detiene habilitación y conserva correspondencias/historia. Solo retorna a autoridad segura verificada; si no existe, cuenta bloqueada.
12. No restaurar login por código solo, credenciales/sesiones/permisos revocados. Contratos administrativos/coordinador preservados mediante transición explícita revisada, no compatibilidad insegura por defecto.

### Inventario obligatorio de superficies y garantías pendientes

El inventario concreto de endpoints/tablas/funciones se completa mediante inspección autorizada posterior. Esta lista no afirma su configuración real.

| Superficie | Riesgo a excluir / condición de habilitación |
|---|---|
| Login servidor/SDK Auth | Sin registro fuera I-02, procedencia/sesión verificables, sin cambio cliente de identidad técnica |
| Refresh | Sin crear/revivir autoridad; continuidad y revalidación antes/después |
| Cambio/reset contraseña | Ruta impedida/controlada o integrada con exclusión/revocación I-10 |
| Alias/email/teléfono/vinculación Auth | Sin transferir identidad ni convertir contacto editable en factor |
| Invitación/magic link/OTP/OAuth/SSO si existen | Inventariar lo habilitado y controlar/impedir cada vía; no asumir existencia |
| Administración Auth | Adaptador estrecho, actor/efecto exactos y conciliación auditada |
| REST/tablas/grants | Mínimos, RLS sobre existente/resultante, columnas de autoridad protegidas; sin cambio de dueño/agencia ilegítimo |
| Vistas/joins/agregados | Misma proyección/ámbito y propiedades efectivas verificadas |
| RPC/funciones | Grants/propietario/resolución de objetos/parámetros; actor no autoritativo desde cliente |
| Service-role/trabajadores | No CRUD genérico; comando catalogado y autorizado; ejecución privilegiada no acredita RLS |
| Storage | Relación objeto–recurso; permisos separados lectura/descarga/subida/sustitución/borrado; ruta no prueba dueño |
| Realtime | Autorización de suscripción y entrega; abiertos/nuevos; avisos opacos no revelan existencia |
| Caché servidor/CDN/navegador | Sin privados compartidos por ID solo ni permisos obsoletos; almacenamiento/identidad/ámbito comprobados |
| Exportaciones/colas | Autoridad al producir y entregar; resultado/descarga controlados tras revocación |

URL firmada emitida no se considera revocada al cambiar membresía. Acceso que exige autoridad actual propone intermediación sin URL autónoma duradera incompatible; si no se demuestra, no emitir. Si Realtime no prueba autoridad por entrega, alternativa aviso opaco y A-02 requiere validación propia. Mutaciones de orden estricto pasan por función controlada, sin grants directos equivalentes que la eludan.

No prometer retirada de datos entregados ni cancelación de lectura/transferencia ya autorizada e iniciada. Identificar punto de inicio; nuevas peticiones/entregas no usan comprobación anterior. Garantía no demostrada bloquea operación afectada.

### Parámetros verificables y responsables pendientes

Cada parámetro tendrá valor/unidad/alcance/responsable/versión/prueba de frontera. Sin valor válido, flujo afectado bloqueado. No se inventan cifras ratificadas.

| Parámetro/catálogo | Regla verificable | Definición pendiente |
|---|---|---|
| Sesiones por riesgo | Plazo absoluto e inactividad independientes; administración más estricta | Política operativa PO/delegado |
| Inactividad administrativa | Preservar requisito histórico 20 minutos y verificar servidor, no UI sola | Compatibilidad técnica/aceptación |
| Actividad válida | Polling/refresh no prolongan por defecto | Propuesta operativa por aceptar |
| Reautenticación reciente | Ventana y prueba fresca ligada a acción, no token renovado | Política operativa |
| Factores/canales | Control, entrega/custodia y sustitución verificables | Selección operativa |
| Autorizaciones/invitaciones | Vigencia limitada/consumo único/destinatario | Valores operativos |
| Cuotas antiabuso | Compartidas por origen/identificador protegido; sin bloqueo permanente anónimo | Ingeniería propone, revisar impacto |
| Independencia/conflictos | Personas/facultades verificadas y categorías/revisión | Catálogo central autorizado |
| Evidencia/finalidad | Suficiencia mínima y finalidad legítima limitada | Autoridad central competente |
| Delegación | Concedentes/revocadores/techos por operación | Designación expresa central |
| Reconciliación | Alertas/escalamiento; plazo no prueba cancelación | Ingeniería/operación |
| Idempotencia/auditoría | Retención suficiente contra repetición, minimizada y definida | Ingeniería/autoridad competente |
| Namespace/código | Legítimo/único sin colisiones; cambio/reutilización | Ingeniería valida; política pendiente |

No se requiere reaprobación A/B/C/D, P0, seis políticas, separación o I-11. Catálogos/valores requieren definición y autoridad competente; índices/hashes/bloqueos son ingeniería. Cualquier excepción funcional adicional requiere propuesta explícita, no se presume aquí.

### P01–P40 — matriz futura y criterios de aceptación, NO EJECUTADA

Familias de casos, no conteo de tests ejecutados. Incluir positivo/negativo equivalente, datos sintéticos, versión, actor/ámbito, orden temporal, esperado/observado, filas/estado/efectos antes/después y auditoría. HTTP denegado solo no prueba ausencia de efectos. Desarrollan nueve experimentos existentes sin sustituirlos ni crear fase.

| ID | Escenario / aceptación observable |
|---|---|
| P01 | Código+contraseña correctos: identidad/sesión registradas verificables y membresías propias; sin mapeo en resolución |
| P02 | Código conocido sin contraseña/inexistente/inactivo: sin sesión, respuesta/antiabuso no enumeradores |
| P03 | JWT antiguo no registra sesión nueva aun firmado/vigente |
| P04 | Login/recuperación, ambas intercalaciones: sin registro sobre generación invalidada |
| P05 | Refresh revocado no revive ni accede; legítimo conserva continuidad |
| P06 | Logout actual/global con login/refresh concurrentes y revocación Auth tardía: alcance correcto |
| P07 | Ordinaria válida: un cambio reconciliado, factores correctos, sesiones previas denegadas y login nuevo |
| P08 | Doble prueba/autorización: un consumo/efecto; reintento consulta misma ejecución |
| P09 | Factor no verificado/sustituido/comprometido deniega; vigente equivalente funciona |
| P10 | Evidencia insuficiente no vincula/restablece; suficiente sigue revisión requerida |
| P11 | Alto riesgo requiere dos personas, no dos acciones/cuentas de una; también cuenta ordinaria |
| P12 | Dos independientes facultados ejecutan solo sujeto/versión/alcance aprobados |
| P13 | Revocar aprobador antes de consumo invalida; orden concurrente comprobado |
| P14 | Fallos en cada frontera Auth–BD: sin éxito falso ni restaurar generaciones |
| P15 | Contexto A/recurso B: sin filas/conteos/archivos/eventos/efectos ajenos |
| P16 | Suspender A bloquea privados/historia; B independiente e historia intacta |
| P17 | Revocación primero impide escritura posterior con autoridad anterior; probar ambas intercalaciones |
| P18 | Invitación válida/destinatario correcto: una membresía, autorización+aceptación y consumo |
| P19 | Token/ID/destinatario/términos distintos, revocada/vencida: sin activación ni privados ajenos |
| P20 | Aceptación doble o aceptación/revocación: máximo activación legítima y estado consistente |
| P21 | Ejecutar no concede: cero delegaciones |
| P22 | Autoconcesión directa, Limitado gestiona administradores, ámbito/vigencia alterados: sin escalamiento/efecto parcial |
| P23 | Historia legítima/ajena: otro autorizado, finalidad/proyección/auditoría; suspendido denegado y fallo registro impide entrega |
| P24 | IA sin sesión humana ni versión obsoleta de controlador: ningún efecto nuevo autorizado |
| P25 | Cada ruta directa Auth/REST/RPC/Storage/Realtime conserva generaciones/autoridad; positivos equivalentes |
| P26 | Ambigüedad y doble vinculación: sin apropiación/duplicado/pérdida de IDs/historia |
| P27 | Autoridad/auditoría caídas: distinguir antes de efecto, incierto y fallo de entrega privada |
| P28 | Regresión TCE-004/administración: origen/sesión/rol/facultad/inactividad servidor y casos legítimos |
| P29 | Dos recuperaciones distintas, vías combinadas y trabajadores duplicados: una ejecución vigente por identidad |
| P30 | Auth acepta tarde tras timeout: sin cambio incompatible/login prematuro/sobrescritura tardía; estado reconciliado |
| P31 | Emitir autorización y revocar/sustituir factor: derivados inutilizables; carrera con consumo |
| P32 | Dos cuentas misma persona/conflicto/cambio riesgo/evidencia/privilegio: recalcular e invalidar insuficientes |
| P33 | Central sin membresía/local sin facultad/ambas/excepción privada: independencia y revocación por ámbito |
| P34 | Cuenta alternativa/ciclos/dependencias concurrentes/revocación origen: sin ampliación ni dependientes utilizables |
| P35 | I-11 RATIFICADA: suspensión bloquea login/refresh/operaciones; restaurar exige login nuevo; sesiones previas y autoridad revocada no reviven |
| P36 | Cola IA/toma humana/despacho/timeout: cancelar pendientes, rastrear en curso, sin nuevos envíos fuera barrera ni reenvío ciego |
| P37 | Rutas alternativas credenciales/vínculos/SDK/administración Auth: controladas o sin autoridad de negocio |
| P38 | Grants/vistas/RPC/columnas/service-role/Storage CRUD/URL previa/Realtime abierto/cachés/exportación: mismo ámbito/estado final |
| P39 | Corte/rollback concurrente con login/correo/revocación/recuperación: autoridad única, sin fallback/sesión antigua |
| P40 | Fronteras de vigencia/inactividad/reautenticación/cuotas/idempotencia/configuración: inválida bloquea; polling no prolonga; no enumeración |

P35 ya no depende de aprobación funcional; sí de validación técnica. P36 no promete retirar mensaje aceptado antes del traspaso; modalidad más fuerte necesita garantía externa demostrada.

#### Subcasos explícitos de aceptación — TODOS NO EJECUTADOS

Sufijos desglosan familias existentes, no crean P41, fase o tarea. Capturar estado anterior/posterior, generaciones, factores/autorizaciones, membresías, auditoría y efectos externos pertinentes; datos sintéticos.

| Subcaso | Positivo/negativo y aceptación |
|---|---|
| P09.a Enrolamiento inicial válido | Vínculo/titularidad acreditados, sesión/reautenticación y prueba nueva: un factor del titular utilizable, sin cambiar rol/vínculo/membresía |
| P09.b Enrolamiento indebido | Sesión robada sin prueba fresca, factor ajeno/no comprobado o heredada ambigua: ningún factor utilizable ni autorización nueva |
| P09.c Confirmación concurrente | Dos confirmaciones: único resultado; contenido distinto con misma idempotencia no cambia titular/destino |
| P09.d Entrega fallida/incierta | No declarar entrega completa ni activar material no confirmado según protocolo; no reexponer por consulta ordinaria |
| P09.e Sustitución con entrega fallida | Fallo de entrega nuevo no retira por sí solo anterior válido; anterior comprometido/revocado no revive |
| P31.a Derivados/reemisión | Sustituir/revocar material o abandonar emisión invalida derivados pertinentes; material obsoleto no cambia credencial |
| P14.a Antes del commit inicial | Ningún consumo I-10/ejecución/generación/bloqueo confirmado; cero llamadas Auth; no restaurar prueba previamente consumida I-07 |
| P14.b Tras commit/antes de envío | Sesiones anteriores inválidas y bloqueo persistente; intención sin envío no se presume segura hasta descartar trabajador capaz de emitir |
| P14.c Finalización fallida | Auth confirmado pero commit final falla: sin éxito/login; reintento reconcilia misma ejecución |
| P30.a Incertidumbre sin evidencia | Timeout/lease/plazo no liberan ni permiten repetir; cero efectos incompatibles nuevos |
| P30.b Reconciliación válida | Evidencia correlacionada/facultad específica solo permite transición documentada; probar éxito/fallo definitivo/pasos restantes. reconciliando→efecto_pendiente solo bajo todas sus condiciones; no desde terminal |
| P30.c Reconciliación indebida | Actor no facultado/evidencia de otro intento/versión obsoleta/intento ejecutable: sin transición habilitante ni efecto Auth nuevo |
| P30.d Terminal seguro | fallida_bloqueada deniega login/refresh/operaciones protegidas en todas las rutas relevantes, incluidas P25/P37/P38; probar tokens previos, cookies residuales y restauración I-11 sin eludir bloqueo. Sin generación revivida; ejecución nueva requiere autoridad nueva/cierre de intentos y traspaso sin acceso intermedio |
| P18.a Reactivar suspendida | A-07 autorizado y términos aplicables: solo relación autorizada; B independiente, delegaciones terminales no reviven |
| P18.b Reincorporar revocada | Coordinador con autorización central/aceptación nuevas aunque términos iguales; historia preservada, sin duplicación operativa |
| P19.a Reincorporación incompleta | Token/aceptación anteriores, falta nueva autorización, términos no aceptados o autoridad revocada: cero acceso/membresía activa nueva |
| P20.a Reactivación concurrente | Reincorporación/reactivación frente a revocación/términos: orden verificable, sin autoridad anterior |
| P23.a Auditoría central legítima | A-12 facultad/propósito: solo metadatos centrales, sin evidencia privada implícita; acceso registrado sin recursión |
| P23.b Evidencia privada legítima | A-12 autorización local/excepcional pertinente: proyección/recurso/finalidad limitados, registro previo; no otros expedientes |
| P23.c Auditoría indebida | Administrador genérico/ámbito ajeno/propósito no autorizado/excepción vencida: cero contenido protegido, sin mutación de privilegios |
| P27.a Fallo de registro lectura | Registro previo exigido indisponible: no liberar A-12 ni declarar éxito |
| P38.a Reutilización auditoría | Caché/exportación/idempotencia tras revocación: no reentregar privado; resultado existente no restaura permiso |
| P25.a SSR/navegador legítimos | Login/refresh/expiración/logout propagan cookies y conservan registro/generaciones; cliente manipulado no altera autoridad |
| P28.a Origen/CSRF administrativos | Regresión TCE-004 conserva legítimos; origen ajeno/CSRF inválido rechazan antes de mutación/llamada externa |
| P37.a Origen/CSRF fuera de administración | Mutaciones factores/recuperación/membresías/delegaciones/recursos: credenciales válidas no subsanan origen/CSRF inválidos |
| P37.b Cabeceras/transporte alternativo | Origin ausente, host reenviado falsificado o mezcla cookie/token: no excepción implícita; alternativo contratado/validado |
| P40.a Propagación/configuración | Fallo cookies/configuración confiable ausente no habilita/prolonga autoridad; distinguir cookie residual de sesión vigente |

Entrega de factores: definir antes de implementar evidencia de confirmación por tipo. Acuse de transporte no prueba control ni permite declarar verificado. Candidato nuevo no utilizable hasta cumplir I-05; sustitución/versionado/invalidez de derivados juntos. Entrega incierta no autoriza reexposición o reenvío ciego. Protocolo indefinido: enrolamiento afectado bloqueado.

Ausencia de efectos: no basta HTTP negativo; verificar ningún factor utilizable, activación, concesión, cambio de credencial, entrega privada o despacho indebido. Registros de rechazo/auditoría legítimos no son efectos indebidos.

Trazabilidad complementaria de segunda revisión:
- I-01/I-05/I-07, H03/H11/H12: P09.a–P09.e y P31.a.
- I-10, H01/H02/H03: P14.a–P14.c y P30.a–P30.d.
- A-03–A-07, H05/H06: P18.a/P18.b/P19.a/P20.a.
- A-02/A-10/A-12, H05/H10: P23.a–P23.c/P27.a/P38.a.
- I-02–I-04 y mutaciones I/A, H09/H10/H12: P25.a/P28.a/P37.a/P37.b/P40.a.
- I-11/H07/P35 ratificados sin cambio; reconciliación/reincorporación no elimina suspensión global ni rehabilita sesiones.
- A-11/H08/P24/P36 conserva barrera/garantías pendientes de transporte.
- M-01/H11/P26/P39 conserva corte único/reversión sin permisos anteriores.

Estas precisiones fueron autorizadas para incorporación por el PO tras la segunda revisión R1, incluidas correspondencia de transiciones y denegación transversal en fallida_bloqueada. No ratifican mecanismos ni declaran validación. CT-01/CT-02/REC-F2-001 y 17 hallazgos originales abiertos; P01–P40/subcasos/nueve experimentos NO EJECUTADOS; TCE-004 EN_VALIDACION; 30 mejoras MF-PO diferidas en implementación conforme a prioridad de recuperación, sin borrar sus decisiones funcionales ya ratificadas.

### Trazabilidad completa, dependencias y estado

| Contratos | Autoridad funcional | H / pruebas principales | Hallazgos y tareas relacionados |
|---|---|---|---|
| I-01, M-01 | A, P0-5, POL-CT01-01 | H09/H11; P26/P37/P39 | TCE-005/007/012; REC-F2-001/002/005/006 |
| I-02–I-04 | A/C, P0-3, POL-CT01-04 | H02/H09/H12; P01–P06/P28/P37/P40 | TCE-004/007/012/013; REC-F2-001/002/005/006 |
| I-05–I-07 | B, P0-1, POL-CT01-03 | H03/H12; P07–P09/P31/P40 | TCE-005/007/012; REC-F2-001/002/005/006 |
| I-08–I-09 | B, P0-2/5, POL-CT01-01/02 | H04/H05; P10–P13/P32/P33 | TCE-007/012; REC-F2-001/002/005/006 |
| I-10 | P0-3, POL-CT01-03/04 | H01/H02/H03/H09; P04/P07/P08/P14/P29–P31/P37 | TCE-004/005/007/012/013; REC-F2-001/002/005/006 |
| I-11 | Ratificación PO I-11, separación global/local | H07; P35 | TCE-004/007/012/013; REC-F2-001/002/005/006 |
| A-01–A-02 | C/D, separación central/agencia | H05/H10; P15–P17/P25/P33/P38 | TCE-001/002/003/005/006/008/009/012/013/015/016; REC-F2-001/002/003/006/007 |
| A-03–A-07 | D, POL-CT02-02 | H05/H10; P16/P18–P20/P33 | TCE-007/012/013/014; REC-F2-001/002/006/007 |
| A-08–A-09 | P0-4, POL-CT02-01 | H06; P21/P22/P34 | TCE-004/005/012/013; REC-F2-001/002/005/006 |
| A-10/A-12 | POL-CT02-02, separación central/agencia, DF-PO-002/003 | H05/H10; P23/P27/P33/P38 | TCE-001/003/006/008/012/013; REC-F2-001/002/003/005/006 |
| A-11 | C/D y límites DA/DC | H08; P24/P36 | TCE-007/011/013; REC-F2-001/002/005/006/007 |
| Parámetros/superficies | Cinco P0/seis políticas | H09/H10/H12; P25/P28/P37/P38/P40 | Adaptadores TCE-017; REC-F2-005/006 |
| Convenciones transaccionales | C y límites DF/DC | H01/H02/H06/H08/H11; concurrencia | TCE-009/010/011/014; REC-F2-002/006 |

Relación con TCE-010/011 es dependencia de autorización/integridad, no resolución de contratos completos de comisiones/pipeline. Discrepancias TCE-003/012 intactas. H01–H12 y riesgos en HALLAZGOS, puertas en PLAN y continuidad en TASKS; sin duplicar matrices contractuales allí.

Bloqueos reales: procedencia/continuidad Auth, control de rutas alternativas, reconciliación sin efectos tardíos incompatibles, exclusión/concurrencia, configuración efectiva RLS/RPC/grants/service-role, Storage/Realtime/cachés, corte/reversión, transporte IA y parámetros/catálogos sin valor autorizado. Garantía externa no demostrada mantiene bloqueada operación afectada. Candidatos entre dispositivos/recursos compartidos/atribución conservan pendientes propios. I-11 no tiene pendiente funcional nuevo; sus mecanismos/pruebas sí.

Riesgos residuales: indisponibilidad prolongada ante efecto incierto, información ya entregada no recuperable, mensajes aceptados antes del traspaso que lleguen después y configuración/privilegio técnico no acreditados. R1 puede someterse a revisión documental; no autoriza implementación sin reservas.

CT-01/CT-02/REC-F2-001 ABIERTOS; REC-F2-001/002 EN_CURSO solo diseño. Implementación/validación PENDIENTES; P01–P40 y nueve experimentos originales NO EJECUTADOS. 17 hallazgos abiertos, TCE-004 EN_VALIDACION, siete tareas F2 y 30 MF preservados. Ningún cierre por redacción documental. Orden: reparar hallazgos → validar con evidencia → mejoras autorizadas.

## CT-01/CT-02 — delimitación funcional ratificada por el PO y continuidad AN-80, 2026-11-07

Fuente normativa: decisión expresa del Product Owner, mandato «REC-F2-001 / CT-01–CT-02 — delimitación funcional». Estado de esta delimitación: RATIFICADA POR EL PO. Base documental: checkpoint local R1 `38d58105574ecf9b786c64ce1b4dad86b01a6e87`, rama master. AN-80 identifica el punto de análisis de delimitación del informe previo; no es una tarea, fase ni hallazgo nuevo.

Decisión ratificada:

1. CT-01 y CT-02 incluyen identidad, autenticación, recuperación, sesiones, suspensión, membresías, roles, facultades, delegaciones, autorización central/local/por recurso, protección de información privada y auditoría de acceso.
2. Candidatos, postulaciones, documentos, atribución, recursos compartidos e interacciones IA/humano quedan incluidos como fronteras de autorización y seguridad.
3. Se difiere el desarrollo funcional completo de mejoras MF-PO, WhatsApp, cupos, citas, pipeline y otras funcionalidades de negocio no indispensables para identidad y seguridad.
4. Toda superficie existente debe conservar controles de seguridad efectivos o permanecer bloqueada cuando no pueda acreditarse su autorización.
5. Las garantías técnicas de Supabase Auth, RLS, Storage, Realtime, migración y pruebas permanecen pendientes.

Esta decisión resuelve la delimitación funcional consultada en AN-80, sin aceptar ni cerrar CT-01, CT-02 o REC-F2-001. Las continuidades anteriores que pedían definir ese alcance quedan sucedidas únicamente en este punto. Incluir una frontera exige especificar su autorización y protección; no exige completar ahora su desarrollo funcional de negocio. Diferir ese desarrollo no exceptúa superficies existentes del control de seguridad ni acredita que ya estén protegidas o bloqueadas efectivamente.

Se conservan sin reapertura A/B/C/D, cinco P0, seis políticas operativas, separación central/agencia e I-11; también las decisiones DF/DA/DC y los pendientes no resueltos por esta delimitación. No se ratifican en bloque los mecanismos técnicos propuestos de R1 ni se selecciona proveedor, esquema físico o implementación. Catálogos, parámetros, autoridades, protocolos, revisión independiente y aceptación documental siguen pendientes donde no definidos. El bloqueo exigido es requisito, no una acción técnica ejecutada por esta actualización.

Trazabilidad: contratos I-01–I-11, A-01–A-12 y M-01; inventario de superficies y parámetros R1; H01–H12 y P01–P40/subcasos existentes. PLAN registra alcance/dependencias diferidas; TASKS registra ratificación y continuidad AN-80; HALLAZGOS conserva la relación con riesgos sin alterar estados. CT-01/CT-02/REC-F2-001 y hallazgos de seguridad permanecen abiertos; TCE-004 EN_VALIDACION. No inicia ni amplía REC-F2-002. Autorización actual exclusivamente documental: sin código, gobernanzas, pruebas, servicios externos, commit, push, merge o despliegue.

## Normativa ratificada y propuestas pendientes de la reconciliación, 2026-11-07

Fuente: decisiones expresas del PO identificadas en el informe de solo lectura del 2026-11-07 y mandato «Aplicación documental autorizada por el PO». Documento rector y matriz de reconciliación: HALLAZGOS, «Reconciliación sucesora del plan y decisiones recientes — 2026-11-07». Se añade normativa puntual sin sustituir R1 ni AN-80; PLAN aplica dependencias y TASKS registra continuidad. No constituye aceptación técnica ni cierre.

AN-01 — RATIFICADA POR EL PO: el código individual puede modificarse mediante procedimiento autorizado y nunca se reasigna a otra identidad. La identidad técnica vinculada a Supabase Auth permanece estable. Cambiar código no cambia sujeto Auth, perfil o membresías ni supone cambiar token público de referido o atribución. Esta decisión sucede únicamente al pendiente histórico de modificabilidad/reasignación; normalización, colisiones, custodia, auditoría y procedimiento concreto siguen por especificar/validar dentro de I-01/I-02/M-01. No reinterpretar «nunca reasignable» como mera ausencia de reutilización automática.

AN-02 — autoridad central sobre códigos, RATIFICADA POR EL PO: la autoridad de emisión y cambio de códigos corresponde a central. La participación operativa del coordinador en el alta requiere delimitar expresamente facultades; no concede control global de identidad, vinculación o recuperación por mera membresía local. No designa automáticamente un concedente/ejecutor concreto ni ratifica facultades específicas de alta por coordinador.

Desambiguación de procedencia: «AN-02 — namespace/provisión» es la referencia del inventario de análisis previo; «AN-02 — autoridad central sobre códigos» es la referencia ratificada comunicada por el PO en la reconciliación. Se conservan ambas menciones con asunto y fuente explícitos, sin reasignar el identificador histórico, crear un ID sustituto o tratarlas como la misma definición. AN son referencias conversacionales de análisis, no IDs permanentes nuevos de tarea/hallazgo. La legitimidad, formato, custodia y provisión del namespace técnico permanecen pendientes donde no definidos; autoridad sobre códigos no resuelve esos detalles ni reabre A.

Propuestas PENDIENTES DE RATIFICACIÓN, no requisitos nuevos aprobados: facultades específicas del coordinador para solicitar/capturar/provisionar/vincular/activar; campos obligatorios de registro y significado de «usuario»; credencial provisional y activación; selección de correo verificado como factor; interfaz/flujo de cambio de contraseña desde Perfil; escaparates y enlaces de reclutador por agencia con atribución. Antecedente CA-12.2 conserva email opcional: no convertirlo en correo personal obligatorio por esta propuesta. Seleccionar correo como factor exigiría prueba de control/enrolamiento y cobertura de pérdida/compromiso bajo recuperación ordinaria/excepcional vigente. Cambio autenticado y recuperación sin sesión son flujos distintos, sujetos a I-05–I-10 y transporte/CSRF de R1; no crear bypass Auth por interfaz.

Asignar reclutadores requiere facultad vigente en agencia destino y operación concreta, sin trasladar identidad, otras membresías o historia. La extensión específica propuesta queda pendiente; D sobre incorporación central/aceptación de coordinadores no se amplía ni elimina automáticamente para reclutadores. Identidad única con membresías simultáneas de reclutador YA RATIFICADA: estados y permisos independientes por agencia, sin duplicación de perfil ni suma de facultades.

Portal general conserva antecedente CA-05.3; escaparates/enlaces por agencia son mejora diferida pendiente, sin sustituirlo. Código de login, identidad técnica Auth y token_referido son distintos; persistencia/precedencia/fallback y elegibilidad de referido requieren definición sin otorgar acceso privado. Apoyo IA al desarrollo no equivale a facultad operativa; D/DA/A-11 permanecen sin agente implementado/habilitado. AN-80 mantiene esas superficies como fronteras de seguridad, sin exigir desarrollo funcional completo de mejoras para cerrar CT-01/CT-02. A/B/C/D, P0, POL, separación central/agencia e I-11 intactos; mecanismos, catálogos/parámetros, revisión independiente, aceptación y garantías técnicas pendientes. Ningún contrato/tarea/hallazgo cerrado ni implementación autorizada.

## D-01–D-04 — normativa ratificada de alta, códigos y membresías, 2026-11-07

Autoridad: Product Owner, decisiones expresas en esta conversación y mandato «REC-F2-001 / Integración D-01 a D-04». RATIFICADAS como reparto funcional; no implementación ni validación técnica. Documento rector y trazabilidad: HALLAZGOS, «Decisiones PO D-01–D-04 — reparto funcional de alta, códigos y membresías, 2026-11-07»; PLAN dependencias, TASKS continuidad.

**D-01. Alta operativa de reclutadores.** Un coordinador con facultad vigente puede registrar a un reclutador dentro de una agencia autorizada. El sistema tramitará automáticamente las operaciones centrales necesarias mediante servicios sujetos a las reglas de autoridad, identidad y seguridad aprobadas. Esta operación no concede al coordinador facultades globales sobre identidades, códigos o credenciales.

**D-02. Emisión automática de código individual.** El sistema generará y asignará automáticamente un código único conforme a las reglas de la administración central. La emisión se realizará mediante un servicio autorizado, con controles de unicidad, concurrencia, trazabilidad e idempotencia. Un código previamente asignado nunca podrá reasignarse a otra identidad. La identidad técnica permanecerá estable.

**D-03. Incorporación de reclutadores existentes.** Un coordinador con facultad vigente podrá solicitar la incorporación de un reclutador existente a una agencia bajo su autoridad. La incorporación requerirá aceptación autenticada del reclutador y las demás precondiciones de activación aplicables. Se conservará una única identidad global y membresías independientes por agencia, sin transferencia automática de permisos, información privada o historial.

**D-04. Administración local de membresías.** Un coordinador con permiso específico y vigente podrá activar o suspender membresías de reclutadores exclusivamente dentro de las agencias y operaciones para las que esté autorizado. Estas acciones no modificarán la identidad global, las credenciales ni las membresías de otras agencias. Toda operación deberá contar con autorización verificable, transición válida, auditoría y rechazo seguro.

**Límites.** La automatización no elimina controles de titularidad, autorización o seguridad. Activación de identidad y activación de membresía son operaciones independientes. Provisión técnica, titularidad, credencial inicial/entrega, recuperación, cambio de contraseña, suspensión global y resultados externos inciertos siguen sujetos a sus contratos/decisiones específicas y procedimientos pendientes. Revisión independiente, aceptación documental y garantías técnicas permanecen pendientes. D-04 no omite la aceptación/precondiciones de D-03 ni concede suspensión global. I-11 conserva su política ratificada; no se reabre por faltar mecanismos/procedimiento. Ninguna delegación o designación concreta adicional se presume.

Sucesión exclusiva: quedan resueltos los pendientes de reparto funcional central/coordinador para registro operativo, emisión automática, solicitud/incorporación aceptada y activación/suspensión local en el alcance D-01–D-04. Se conservan las formulaciones históricas y la matriz propuesta previa; no se ratifica su contenido completo. AN-01 permite cambio autorizado y prohíbe reasignar; D-02 fija emisión automática, sin conceder al coordinador cambio de códigos. AN-02 conserva autoridad central y su desambiguación namespace/provisión; AN-80 y la identidad única multiagencia permanecen. No se aprueban campos obligatorios/usuario, credencial provisional, correo como factor, interfaz Perfil o escaparates por agencia. Contratos I-01/I-02/I-05–I-11, A-03–A-07/A-12 y M-01 mantienen precondiciones y bloqueos. CT-01/CT-02/REC-F2-001 y hallazgos abiertos; sin nuevas tareas/fases, pruebas o autorización técnica.

## CT-01/CT-02 — activación por correo y matriz operativa reconciliada, 2026-11-07

Fuente normativa: decisiones expresas y autorización documental del PO «REC-F2-001 / Consolidación documental CT-01 y CT-02». Documento rector: HALLAZGOS, «Consolidación CT-01/CT-02 — activación inicial y matriz reconciliada, 2026-11-07»; continuidad en TASKS y dependencias en PLAN. Se preservan íntegros R1, AN-01/AN-02/AN-80, D-01–D-04 y antecedentes; esta sección sucede solo a los pendientes funcionales que resuelve. Incorporar la matriz no ratifica en bloque sus procedimientos o mecanismos técnicos.

### Activación inicial e inicio de sesión — decisiones RATIFICADAS POR EL PO

1. Activación inicial exclusivamente mediante invitación a correo electrónico. El reclutador recibe enlace seguro, acredita control del correo y establece personalmente su contraseña.
2. Inicio de sesión mediante código individual + contraseña. El correo verificado se utiliza para activación y como canal de recuperación, sujeto a los controles y procedimientos pendientes; no sustituye el código de login ni exige correo en cada inicio.
3. SMS y WhatsApp quedan excluidos del alcance de autenticación. No se seleccionan proveedor, costos, plazos, límites ni factores adicionales.
4. Se conservan identidad técnica estable, código único nunca reasignable a otra identidad y membresías independientes por agencia. Correo de contacto, factor verificado, código, token público de referido e identidad técnica son conceptos distintos; esta decisión no convierte el correo editable en identidad Auth ni modifica el vínculo estable por inferencia.
5. Verificar correo no concede por sí solo membresía ni acredita automáticamente todas las condiciones de titularidad. Activación de identidad y activación de membresía siguen separadas; D-03 conserva aceptación autenticada para incorporación existente y D-04 exige permiso/transición válidos.
6. No imponer aprobación humana central individual por cada alta: D-01/D-02 tramitan operaciones centrales mediante servicios autorizados sujetos a reglas centrales y controles vigentes, sin transferir autoridad global al coordinador.

Sucesión delimitada: las notas históricas de «canal/factor correo no seleccionado» y «activación inicial por elegir» quedan precisadas por estas decisiones; no se vuelve a pedir elección de correo frente a SMS/WhatsApp para autenticación. Los antecedentes de correo opcional/no obligatorio se conservan, sucedidos en cuanto a la necesidad de correo para activación y canal de recuperación, sin cambiar el login aprobado. Contraseña provisional entregada por coordinador no es el flujo inicial aprobado: el titular establece personalmente su contraseña por enlace seguro. El resto de campos/usuario, normalización, namespace/provisión, protocolo de enlace/control de correo, titularidad adicional cuando corresponda, sustitución del canal, recuperación excepcional, reautenticación/cambio desde Perfil y parámetros siguen pendientes donde no definidos. P0/POL y recuperación independiente se conservan en lo no sucedido; no se impone otro factor ni se habilita ruta alternativa por inferencia. Garantías Auth y demás superficies pendientes; no implementación ni cierre.

### Matriz única reconciliada de 27 operaciones — reglas R/P/T

Referencias 1–27 preservan las filas de la matriz conversacional anterior; no son nuevos IDs de tarea, fase o hallazgo. Esta es la única matriz detallada de esas 27 operaciones en los cuatro documentos. La matriz general de permisos R1 conserva su función distinta de catálogo base, sin ser otra versión de estas filas. R = dirección funcional ratificada; P = propuesta/procedimiento pendiente de decisión; T = mecanismo técnico por revisar/validar. «R; mecanismo T» no acredita funcionamiento ni designa automáticamente personas. Autoridad central específica no equivale a cualquier administrador; permiso local no otorga facultad global.

Auditoría base para cada fila: actor humano/técnico y autoridad efectivos, sujeto/recurso, ámbito/agencia, operación, versiones, decisión, resultado y correlación; motivo cuando corresponde. Sin contraseñas, tokens/enlaces, códigos de recuperación/login o evidencia personal completa en logs generales. Rechazo base: autoridad ausente/obsoleta/indeterminada deniega sin efecto indebido ni entrega privada; respuestas públicas no enumeran. Revalidar autoridad/estado al efecto, controlar concurrencia/idempotencia y distinguir rechazo de resultado externo incierto. Servicio privilegiado no acredita autoridad de negocio ni RLS. Las columnas de auditoría/rechazo siguientes complementan estas bases, no las sustituyen.

| Fila / marca | Actor → operación | Sujeto/recurso | Ámbito | Facultad | Precondiciones | Efecto | Auditoría específica | Rechazo seguro |
|---|---|---|---|---|---|---|---|---|
| 1 — R D-01; T | Coordinador → registrar alta nueva | Registro y flujo de alta | Agencia autorizada | Registro operativo vigente | Actor/agencia/permiso válidos; datos admisibles; correspondencia por resolver | Registro y tramitación central automática; sin activación implícita | Origen local y correlación | Identidad existente pasa a incorporación; no duplicar ni alta ajena |
| 2 — T | Servicio autorizado/verificador cuando corresponde → clasificar identidad | Correspondencia identidad/perfil/Auth | Central, acceso mínimo | Resolver correspondencia | Evidencia/finalidad suficientes; contacto no acredita titularidad solo | Clasificar nueva/existente/ambigua/conflicto | Fundamento y evidencia referenciada | Ambigua sin privilegios; no segunda identidad evasiva. Véase «Resolución central y verificación escalonada — RATIFICADAS»: clasificación técnica automática distinta de resolución de disputas, exclusiva de autoridad central autorizada, ordinaria o reforzada según corresponda |
| 3 — R D-02; T | Servicio autorizado → generar/asignar código | Asignación a identidad | Central | Emisión automática bajo reglas centrales | Flujo legítimo, sujeto definido, unicidad histórica/concurrencia/idempotencia | Código único nunca reasignable; identidad técnica estable | Referencia protegida de asignación/comando | Colisión o sujeto incierto: sin asignación indebida ni éxito falso |
| 4 — P | Titular/coordinador → solicitar cambio de código | Solicitud sobre identidad | Propio/asistencia local acotada | Elegibilidad pendiente | Prueba/ámbito admisibles; conocer código no acredita titular | Solicitud; todavía no cambia código | Solicitante/motivo/sujeto | Sin prueba/ámbito, sin cambio ni enumeración |
| 5 — R AN-01/02; procedimiento P | Autoridad central designada → autorizar cambio | Código de identidad | Central/global | Cambio bajo autoridad central | Procedimiento/ejecutor/sujeto/código admisibles | Autorizar cambio de la misma identidad | Autoridad/versiones/asignación | D-01/02 no permiten al coordinador decidir cambio global |
| 6 — R emisión D-02; ejecución T | Servicio autorizado → ejecutar comando de código | Mapeo código–identidad | Comando central exacto | Ejecución acotada, no concesión | Emisión D-02 o cambio autorizado AN-01/02; estado vigente | Aplicar asignación; no alterar Auth/perfil/membresías/referido | Origen/idempotencia/resultado | Sin CRUD global ni sustitución autónoma de sujeto/código |
| 7 — T bajo D-01 | Servicio autorizado → provisionar/vincular | Identidad/perfil/Auth | Central | Provisión/vinculación acotadas | Titularidad/correspondencia únicas; namespace legítimo; I-01 | Provisión/vínculo reconciliables; incompleto sin negocio | Pasos/intentos externos | Fallo Auth–BD pendiente/bloqueado; sin cuenta huérfana habilitada |
| 8 — R activación por correo; protocolo T/P | Reclutador y servicio → completar activación global | Invitación, identidad y credencial | Global | Activación limitada aprobada | Invitación a correo/enlace seguro; control acreditado; contraseña establecida personalmente; titularidad/restantes estados válidos | Completar activación de identidad/credencial; no membresía por correo solo | Emisión/confirmación/consumo referenciados, sin enlace ni contraseña | Correo no controlado, entrega incierta o titularidad insuficiente: sin habilitación indebida |
| 9 — R D-04; T | Coordinador con permiso específico/servicio → activar membresía | Relación local reclutador | Agencia/operación autorizadas | Activación local | Identidad habilitada, incorporación/aceptación aplicables, transición válida | Solo relación/permisos aprobados | Humano/servicio/agencia/rol/estado | No activar globalmente ni omitir D-03/bloqueos |
| 10 — R D-03; T | Coordinador → solicitar incorporación | Identidad existente/relación destino | Agencia bajo su autoridad | Solicitar incorporación vigente | Referencia verificable; autoridad actual; proyección mínima | Solicitud reutilizando identidad | Sujeto/agencia/términos | Sin duplicar perfil ni revelar recursos de otras agencias |
| 11 — T; facultades adicionales P | Servicio autorizado → verificar habilitación | Solicitud/facultades/términos | Destino y controles centrales pertinentes | Comprobar precondiciones | Solicitud legítima, rol/permisos/términos admisibles | Elegible, pendiente de aceptación/activación | Fuente de autoridad/términos/versiones | No activar sin aceptación ni inventar aprobación humana central individual |
| 12 — R D-03; T | Reclutador autenticado → aceptar incorporación | Membresía nueva/términos exactos | Agencia destino | Aceptación propia autenticada | Sesión/vínculo válidos, destinatario correcto, solicitud/términos vigentes | Registrar aceptación; no sustituye activación autorizada | Sujeto/términos/vigencia/consumo | Otra cuenta, cambio de términos o solicitud revocada/vencida: sin incorporación activa |
| 13 — R PO-F2-001-D; T | Central facultada y coordinador invitado → incorporar coordinador | Membresía coordinador | Central/destino | Concesión conforme D y aceptación propia | Sujeto/términos exactos; ambas condiciones vigentes | Relación independiente de coordinador | Autorización y aceptación correlacionadas | Una condición sola no activa; D-03 de reclutadores no sustituye D |
| 14 — R D-04; T | Coordinador con permiso específico → suspender membresía | Relación reclutador | Solo agencia/operación autorizadas | Suspensión local | Autoridad/versión/transición válidas | Bloquear local; conservar identidad/credenciales/historia/otras agencias | Motivo/transición/dependencias | Nunca suspensión global ni borrado histórico por esta operación |
| 15 — R D-04/A-07; T | Coordinador con permiso específico → activar suspendida | Relación suspendida | Agencia autorizada | Activación local vigente | Identidad global habilitada; términos/permisos actuales; sin impedimentos; aceptación aplicable | Solo relación; no revive terminales | Motivo/términos/permisos | Restauración global no activa local; revocada exige nueva incorporación |
| 16 — P ejecutor; T R1 | Autoridad expresamente facultada → revocar membresía | Relación local | Agencia correspondiente | Revocación específica | Facultad/estado/versiones válidos | Terminar relación/dependencias; conservar historia/otras agencias | Revocación/dependencias | Suspender D-04 no concede revocar; sin facultad cero efecto |
| 17 — R I-11; procedimiento/designación P/T | Central específicamente facultada → suspender identidad | Identidad/sesiones | Global | Suspensión global | Sujeto/motivo/autoridad/orden comprobados | Invalidar sesiones e impedir login/refresh/operaciones | Motivo/generación/resultado transversal | Rol genérico o autoridad local insuficientes |
| 18 — R I-11; procedimiento/designación P/T | Central específicamente facultada → restaurar identidad | Identidad global | Global | Restauración global | Estado/procedimiento/caso válidos | Retirar suspensión; exige login nuevo | Motivo/transición/impedimentos restantes | No revivir sesiones/autoridad revocada ni retirar otros bloqueos técnicos |
| 19 — T I-06 | Solicitante → iniciar recuperación | Solicitud opaca | Público limitado | Acceso al flujo, no reset | Formato/cuotas según parámetros pendientes | Solicitud/referencia segura | Correlación/antiabuso minimizados | No revela existencia/destino; mera solicitud no revoca ni toma exclusión |
| 20 — R asistencia; procedimiento T/P | Coordinador autorizado → asistir recuperación | Caso/evidencia permitida | Local acreditado | Asistencia, no decisión global | Autoridad vigente/acceso mínimo | Aportar solicitud/evidencia | Asistente/ámbito/referencias | No titularidad unilateral ni secreto global al coordinador |
| 21 — R correo verificado como canal; protocolo T/P | Titular/servicio → autorizar recuperación ordinaria | Canal correo y autorización limitada | Identidad global | Prueba de control vigente conforme procedimiento | Correo previamente verificado; titular/origen/generación/vigencia/intentos; consumo único según R1 | Autorización limitada I-10; todavía no sesión/cambio | Canal/versiones/consumo referenciados | Correo declarado/sustituido/comprometido o prueba repetida no autorizan; sin SMS/WhatsApp ni factor añadido |
| 22 — R independencia/riesgo; operativo T/P | Verificador central → evaluar excepcional | Caso/evidencia/riesgo | Central por caso | Evaluación independiente y acceso a evidencia | Facultad/finalidad/suficiencia/riesgo actual | Evaluación versionada | Fundamento/referencias | Insuficiencia no habilita; coordinador no sustituye verificación |
| 23 — R P0/POL; designación/protocolo P/T | Aprobadores centrales → aprobar excepcional | Caso/autorización | Sujeto/acción/versiones | Aprobación independiente vigente | Ordinaria sin alto riesgo: revisión independiente; privilegiada/alto riesgo: dos personas facultadas distintas; conflictos excluidos | Autorización limitada | Persona efectiva/riesgo/facultad | Dos cuentas de una persona no cuentan doble; cambio material invalida lo afectado |
| 24 — R resultado recuperación; saga T | Servicio autorizado → completar recuperación | Credencial/ejecución I-10 | Global | Ejecutar autorización limitada vigente | Revalidación/exclusión/idempotencia/revocación/reconciliación | Cambio autorizado; sesiones previas inválidas; login nuevo; membresías preservadas | Ejecución/generaciones/intentos/finalización | Sin éxito falso; incertidumbre mantiene bloqueo y no reenvío ciego |
| 25 — P flujo/Perfil; T I-10 | Titular autenticado/servicio → cambiar contraseña | Credencial propia | Global | Autorización propia, procedimiento pendiente | Sesión/reautenticación fresca/política sesiones/exclusión válidas | Cambio autorizado; sin alterar código/identidad/membresías | Prueba/ejecución sin contraseña | Cookie/refresh o ruta Auth alternativa no eluden controles |
| 26 — T; designación P | Reconciliador específico → resolver incertidumbre | Ejecución/intentos externos | Central técnica, caso exacto | Reconciliación limitada | Evidencia correlacionada de resultado/cierre de intentos/versiones | Solo transición R1 admitida; retirar únicamente su bloqueo cuando corresponde | Evidencia/intentos/autoridad/transición | Lease/timeout no liberan; no elegir contraseña, saltar aprobaciones o revivir terminal |
| 27 — R prohibición; T | Coordinador/admin sin facultad → intentar reset ajeno | Credencial global ajena | Cualquier agencia | Ninguna por rol/visibilidad local | Autoridad exigida no satisfecha | Ningún cambio | Rechazo minimizado | Sin secretos, cambio de factor o entrega privada adicional |

Login transversal por remisión a I-02, sin crear operación 28: código individual + contraseña verificada por Auth, procedencia comprobable y autoridad actual; el correo de activación no se convierte en login alternativo ni sesión de negocio por sí mismo. En filas 8/12 distinguir invitación inicial por correo y aceptación autenticada de incorporación existente. No se inventa obligatoriedad de repetir activación inicial para una identidad ya legítimamente activada ni se omiten precondiciones de membresía.

Trazabilidad futura de validación, NO EJECUTADA: filas 1–8 con P01/P02/P09/P26/P37/P39/P40 y subcasos pertinentes; 9–16 con P15–P20/P33/P38 y subcasos; 17–18 con P35/P25/P37/P38; 19–27 con P07–P14/P29–P32 y subcasos P14/P30/P31, además de transporte P25.a/P28.a/P37.a/P37.b/P40.a. Correo/enlace inicial y recuperación desarrollan familias/experimentos existentes; envío, confirmación y selección tecnológica necesitan autorización posterior. Sin pruebas nuevas ejecutadas ni P41.

Pendientes para revisión PO/ingeniería: protocolo de enlace, entrega/confirmación y sustitución de correo; evidencias adicionales de titularidad cuando corresponda; campos restantes/usuario; concedentes/ejecutores y catálogo de facultades; plazos/límites/retención sin valores inventados; provisión/mapeo/namespace, concurrencia/fallos/reconciliación; cambio de código y contraseña/Perfil; suspensión global en sus mecanismos; revisión independiente y aceptación documental. R/P/T no cierra contratos ni acredita Auth/RLS/Storage/Realtime/cachés/migración. Estados e inventarios preservados; mejoras AN-80 diferidas no se convierten en bloqueos automáticos. No código/SQL/configuración/servicios, pruebas, commit o despliegue.

## Protocolo de activación por correo — decisiones PO y diseño propuesto, 2026-11-07

Fuente: mandato PO «CONSOLIDACIÓN DOCUMENTAL DEL PROTOCOLO DE ACTIVACIÓN POR CORREO» y protocolo de solo lectura anterior. Rector: HALLAZGOS, «Protocolo de activación por correo — ratificaciones, riesgos y trazabilidad, 2026-11-07»; TASKS continuidad y PLAN puertas. Fuente única del protocolo detallado: esta sección. Referencia la «Matriz única reconciliada de 27 operaciones — reglas R/P/T» existente sin copiarla, agregar operación 28 ni cambiar IDs. R = obligación ratificada; P = procedimiento/política pendiente; T = mecanismo propuesto por validar. Escritura autorizada no ratifica todos los detalles P/T ni acredita implementación.

### Obligaciones ratificadas y sucesión delimitada

- R: cualquier dirección válida y utilizable, personal o institucional, independientemente del proveedor, es admisible. No imponer proveedor/dominio obligatorio. Admisibilidad no prueba control, entrega ni titularidad.
- R: el correo registrado recibe invitación segura; el reclutador acredita control y establece personalmente su contraseña. Activación inicial exclusivamente por correo; no contraseña provisional elegida/entregada por coordinador.
- R: enlace de activación de un solo uso y vigencia de 24 horas desde su emisión. No se fija con ello vigencia de sesión, recuperación, aceptación local u otra autorización distinta.
- R: login mediante código individual + contraseña. Correo verificado como canal de recuperación sujeto a sus controles/procedimientos; no login alternativo por email.
- R: reenvío por autoservicio del reclutador y por gestión de coordinador autorizado. Autoservicio no revela existencia de cuentas ni permite invalidación abusiva de invitaciones legítimas.
- R: reenvío no cambia correo, código individual, contraseña, identidad ni membresías. Establecer contraseña personalmente durante activación es una operación distinta del reenvío.
- R: SMS y WhatsApp excluidos de autenticación; Google Sign-In y Microsoft Sign-In fuera del alcance actual. Admitir buzón de cualquier proveedor no habilita inicio federado con ese proveedor.
- R: verificar correo no acredita por sí solo titularidad completa ni concede acceso a agencia. Identidad global única, código nunca reasignable y membresías independientes conservados; sin aprobación humana central individual obligatoria por alta.

Sucesión: los antecedentes «vigencia/canal/reenvío por definir» quedan precisados únicamente por estas reglas; las 24 horas y modalidades de reenvío ya no son decisiones funcionales abiertas. El protocolo anterior de solo lectura proponía un solicitante acotado para reemisión y sustitución versionada: ahora existe autoservicio ratificado, conservando su obligación de no enumeración/no invalidación abusiva; la sustitución precisa NO queda ratificada. No conservar la propuesta anterior como impedimento al autoservicio ni interpretar autoservicio como permiso de revocar/reemitir destructivamente. La vigencia no se reinicia por repetir el envío del mismo enlace; si la política futura admite una emisión nueva, tendrá su emisión propia y 24 horas, con sustitución/revocación todavía por definir. No inventar que todo reenvío crea enlace nuevo o conserva necesariamente el mismo. AN-01/AN-02/AN-80, D-01–D-04, A/B/C/D, P0/POL e I-11 conservados en lo no sucedido; sin nuevo factor, proveedor, costo, cuota o excepción.

### Flujo, estados y transiciones — P/T, no esquema físico aprobado

Objetos separados: caso de alta, provisión/vínculo, invitación, entrega, prueba de control, ejecución Auth, identidad y membresía. Refinamientos conceptuales de I-01/I-05/A-03–A-07 y R1, no entidades físicas nuevas ni cambio de estados de tareas/hallazgos.

| Objeto / transición propuesta | Condición verificable | Efecto y límite |
|---|---|---|
| Alta recibida→nueva/existente | Coordinador/agencia/facultad válidos y correspondencia acreditada | Seleccionar flujo; contacto coincidente no es titularidad |
| Alta recibida→ambigua/bloqueada | Insuficiencia/conflicto | Sin privilegios, fusión o segunda identidad evasiva; revisión limitada |
| Provisión preparada→pendiente externa→reconciliada | Comando central autorizado, intención durable y resultado correlacionado | Código/vínculo únicos; incompleto sin acceso de negocio |
| Invitación preparada→emitida | Destinatario/finalidad/versión/autoridad vigentes, registro confirmado | Capacidad limitada; registrar emisión y vencimiento 24 horas después; uso único |
| Entrega pendiente→aceptada/fallida/incierta | Evidencia de transporte correlacionada | Aceptada no significa leída ni correo controlado |
| Emitida→control acreditado | Prueba vigente, confirmación explícita y control servidor | Solo control de canal de esa emisión; no membresía/titularidad completa |
| Activación control acreditado→ejecución autorizada | Titularidad restante, prueba/versiones y exclusión válidas | Consumo/reserva únicos y ejecución durable; sin privilegios anticipados |
| Credencial pendiente→efecto confirmado→reconciliado | Contraseña aportada personalmente, resultado Auth y vínculo confirmados | No secreto persistido por aplicación ni generación habilitada ante incertidumbre |
| Identidad pendiente→activa | Correo/credencial/titularidad/restantes condiciones satisfechos | Activación global independiente; acceso posterior por I-02 |
| Membresía pendiente→aceptación/elegibilidad→activa | D-03 cuando corresponda, permiso D-04 y transición válida | Solo relación/rol/agencia autorizados |
| Invitación vigente→vencida/revocada/sustituida | Reloj autoritativo o procedimiento/facultad válidos | Terminal no revive; política concreta de sustitución/revocación pendiente |
| Ejecución→resultado incierto→reconciliación/fallo bloqueado | Posible efecto externo sin resultado; salida solo con evidencia correlacionada/cierre de intentos | Ningún efecto incompatible nuevo ni desbloqueo por plazo/lease |

Ruta nueva: registro D-01→clasificación→provisión/código centrales D-02→invitación correo→control→contraseña personal→reconciliación/activación global→login código+contraseña→membresía con precondiciones. Ruta existente: solicitud D-03→identidad autenticada acepta términos exactos→activación local D-04; no repetir activación inicial ni cambiar credencial por defecto. Ambigua: revisión limitada pendiente sin habilitación. Identidad suspendida/bloqueada no se restaura por aceptar invitación local.

### Procedimiento verificable y autoridades — P/T salvo reglas R expresas

| Paso/actor | Autoridad y precondición | Efecto permitido / rechazo seguro |
|---|---|---|
| Registro/coordinador | Facultad D-01 en agencia concreta, datos admisibles | Registro y tramitación central; sin autoridad global ni provisión ajena |
| Clasificación/servicio o verificador pertinente | Consulta mínima/finalidad/evidencia de correspondencia | Nueva/existente/ambigua; no búsqueda global enumeradora ni unión por contacto solo |
| Código y provisión/servicio | Comando exacto central, sujeto/vínculo/namespace acreditados | Reserva/asignación única e intentos rastreados; código histórico nunca reasignable, incompleto sin negocio |
| Emisión/servicio | Caso/destino/versión autorizados y registro previo | Enlace limitado a activación; no reset de cuenta existente ni destino tomado arbitrariamente del cliente |
| Entrega/transporte autorizado | Emisión vigente y despacho revalidado | Intento correlacionado; aceptación de transporte no acredita control |
| Confirmación/destinatario | Capacidad válida, vigente, no consumida/revocada; confirmación protegida | Prueba limitada de control; abrir GET no consume/activa, evitando escáneres/previsualizadores |
| Contraseña/titular y servicio | Autorización limitada, titularidad/restantes condiciones, exclusión y versiones | Contraseña personal hacia Auth sin transformación ni persistencia en logs/colas/idempotencia |
| Finalización/servicio | Auth y vínculo reconciliados, sin intento tardío incompatible | Activar global solo si corresponde; sesión automática Auth no acredita I-02 ni negocio |
| Incorporación/titular existente | Aceptación autenticada de sujeto/términos/versiones exactos | Precondición local; no lectura de otra agencia ni cambio de credencial |
| Activación local/coordinador-servicio | D-04, identidad habilitada y demás precondiciones | Una membresía independiente; correo controlado o identidad activa solos no bastan |
| Reenvío autoservicio/reclutador | Modalidad R, protocolo antiabuso P/T | Respuesta homogénea y destino ya registrado; sin revelar existencia, modificar datos o invalidar material legítimo abusivamente |
| Reenvío/coordinador | Modalidad R, facultad y agencia/caso vigentes | Gestionar envío limitado; no elegir otro correo ni obtener enlace/contraseña global para sí |
| Corrección/sustitución de correo | Procedimiento y autoridad PENDIENTES como antecedente; véanse «Corrección antes de activación — RATIFICADA» y «Cambio después de activación — RATIFICADO»: autoridad funcional ya ratificada, mecanismos técnicos concretos pendientes | Flujo separado; no encubrir cambio de destino como reenvío |
| Reconciliación/actor específico | Facultad pendiente de designar y evidencia por intento | Solo salida R1 admitida; no contraseña nueva, aprobaciones omitidas o privados adicionales |

Propuesta de enlace: secreto opaco, comprobación protegida, sujeto/finalidad/destino/versiones/ejecución ligados, origen/continuación confiables y sin redirección arbitraria. No guardar URL utilizable en logs generales ni devolverla al coordinador por administrar el envío. Comprobante de control limitado a activación, nunca sesión administrativa o acceso a expedientes. Diseño deberá evitar filtraciones por URL, referer, caché, telemetría o contenido externo; controles específicos por validar, sin seleccionar tecnología.

Propuesta transaccional: confirmar intención antes de efecto externo, registrar intento antes de emitir y no mantener transacción de negocio abierta durante llamada Auth/transporte. Revalidar facultad/estado al consumo y finalización. Antes de commit inicial fallido, ningún efecto habilitante; después de posible envío, ausencia de respuesta no acredita cancelación. Auth confirmado y BD fallida conserva ejecución sin negocio habilitado; reconciliar la misma. No guardar contraseña para reintentar. Si Auth crea sesión automáticamente, controlarla/descartarla según mecanismo validado; exigir I-02 para sesión de negocio. Finalización global sin membresía local no se compensa borrando identidad o repitiendo cambio de contraseña.

### Reenvío, expiración y carreras — obligaciones R y política P separadas

- R: ambas modalidades de reenvío permitidas; nunca cambio de correo/código/contraseña/identidad/membresías ni filtración de existencia. P/T: protección por origen/identificador, presupuesto de trabajo, colas y respuestas homogéneas; sin cifras inventadas. Solicitud anónima no toma exclusión global, revoca material ni prueba titularidad. Si una estrategia candidata permite invalidación abusiva, no habilitarla: diseñar alternativa compatible con autoservicio, no eliminar la modalidad ratificada.
- R: enlace válido solo durante 24 horas desde emisión y para un uso. T propuesto: registrar instante/vencimiento con reloj autoritativo; rechazar en o después de vencimiento, consumo o terminal. Reenvío del mismo material no extiende vigencia. P: cuándo conservar material o emitir sustituto, quién revoca y cómo tratar entregas fallidas; no ratificado por este diseño.
- T: reintento equivalente consulta la misma ejecución sin emitir segundo efecto; contenido diferente con misma idempotencia es conflicto seguro. Nueva solicitud de reenvío no se confunde con reintento técnico ni autoriza por sí sola cambio de versión invalidante.
- P/T: si se autoriza sustitución futura, versión/invalidación de derivados y estado de emisión deben ser coherentes; correo retrasado con enlace terminal no revive. La política deberá preservar no invalidación abusiva de autoservicio. Entrega fallida nueva no restaura material terminal ni revoca por sí sola factor anterior válido; emisión inicial y sustitución de factor son objetos distintos.
- T: confirmación doble, consumo/revocación/cambio de correo y activación/suspensión comparten orden autoritativo pertinente. Revocación confirmada primero impide consumo posterior; confirmación anterior no permite omitir una suspensión vigente al activar. Solicitud/términos modificados requieren aceptación aplicable nueva, sin transferir permiso anterior.
- P: cambio de correo previo a activación necesita autoridad/prueba por definir y derivados invalidados coherentemente; cambio de canal ya verificado sigue sustitución I-05, no edición de contacto. Sin procedimiento, operación afectada no habilitada. Pérdida/compromiso conserva vía excepcional central y controles P0/POL, sin factor adicional inventado. Remisión vigente: «Corrección antes de activación — RATIFICADA» y «Cambio después de activación — RATIFICADO» suceden a este antecedente en autoridad funcional; permanecen pendientes los mecanismos técnicos concretos, no la ratificación de quién gestiona la corrección previa o solicita el cambio posterior.

### Invariantes, riesgos y criterios de aceptación futuros — NO EJECUTADOS

Una identidad/vínculo acreditados; código no reasignable; coordinador sin secreto/facultad global; control correo distinto de titularidad/sesión/membresía; enlace inicial nunca recupera otra cuenta; global/local/aceptación separados; autoridad actual en cada efecto; idempotencia no reentrega privados tras revocación; incierto no se declara completo; SDK/Auth/REST/RPC/Storage/Realtime/caché no eluden bloqueo. Auditoría minimizada con actor/autoridad/sujeto/ámbito/versiones/resultado/correlación y motivo pertinente, sin secretos; fallo de registro exigido bloquea entrega según R1. Rutas cookie con origen/CSRF y configuración confiables; respuesta pública no enumeradora. Dirección válida no acredita entrega/control; acceso a buzón compartido/institucional no acredita por sí solo persona. Ningún plazo/lease acredita cancelación externa.

| Caso / riesgo | P existentes | Criterio futuro verificable |
|---|---|---|
| Agencia/actor sin facultad, servicio como CRUD global | P15–P17/P25/P33/P37/P38 | Sin alta, incorporación, efecto o privado ajenos |
| Correos personales/institucionales de distintos proveedores; contacto coincidente/ambiguo | P09/P10/P26/P39 | Admisibilidad sin restricción de proveedor; control/titularidad separados, sin fusión o apropiación |
| Doble alta/código/vínculo o reintento | P08/P26/P39/P40 | Una correspondencia/asignación legítima; idempotencia sin reasignación histórica |
| Enlace alterado/ajeno/terminal y frontera 24 horas | P09/P19/P25/P37/P40 | Negativo y positivo equivalentes antes de vencimiento; en/después, rechazo sin consumo indebido ni activación |
| GET de escáner y entrega aceptada sin confirmación | P09/P09.d/P27 | Sin consumo/contraseña/membresía ni control declarado por transporte solo |
| Autoservicio repetido/inexistente y coordinador sin facultad | P02/P19/P37/P40 | Sin enumeración o invalidación abusiva, cambio de datos ni efecto ajeno; modalidad legítima conservada |
| Reenvío/sustitución/cambio correo contra confirmación | P09/P31/subcasos | Solo material vigente conforme política futura; terminal no revive; no factor sustituido utilizable |
| Consumo doble y payload distinto | P08/P09.c/P20 | Un efecto; conflicto seguro sin pérdida de titular/destino |
| Fallo/timeout en cada frontera y respuesta Auth tardía | P14/P30/subcasos | Sin éxito falso, repetición ciega o efecto incompatible nuevo; reconciliar intentos |
| Sesión Auth residual/JWT anterior | P03/P25/P30.d/P37/P38 | Sin registro I-02 ni negocio antes de condiciones válidas |
| Identidad existente acepta otra cuenta/términos | P18–P20/subcasos | No membresía activa; identidad/historia preservadas |
| Suspensión global/local y entrega privada/auditoría fallida | P16/P17/P23/P27/P35/P38/subcasos | Estado final autorizado, sin restauración implícita ni privados por fallo de registro |

Estos casos desarrollan P01–P40/subcasos y nueve experimentos existentes; no nuevos tests ejecutados, P41 o IDs permanentes. HTTP negativo solo no demuestra ausencia de efectos: observar estado/vínculos/generaciones/filas/efectos externos pertinentes con datos sintéticos cuando se autorice. Proveedor/entorno efectivo y garantías Auth siguen sin comprobar.

### Pendientes abiertos y límite de aceptación

Procedimiento/autoridad de corrección o sustitución de correo; suficiencia de titularidad y ambigüedad; límites operativos de reenvío/antiabuso; política precisa de sustitución/revocación de enlaces; recuperación excepcional/cambio autenticado; viabilidad y garantías Auth; autoridades y evidencia de reconciliación; pruebas de seguridad/integración NO EJECUTADAS. También catálogos/designaciones, campos restantes/usuario, namespace/provisión, retención y demás parámetros no resueltos por las 24 horas. El protocolo está incorporado como P/T para revisión, no validado ni aceptado íntegramente; revisión independiente pendiente. CT-01/CT-02/REC-F2-001 y hallazgos abiertos; inventarios/estados preservados, sin fases/tareas/hallazgos nuevos ni implementación, conexiones, código, SQL/migraciones/configuración, gobernanzas, commit/push/merge/deploy.

## Titularidad y cambios de correo — consolidación de decisiones PO, 2026-11-07

Fuente normativa: PO, instrucciones «Consolidación documental integral de REC-F2-001» y «Recuperación de decisiones ratificadas y consolidación documental», que proporcionan el contenido faltante E1–E7 y políticas concretas. Rector: HALLAZGOS, «Consolidación integral — titularidad, E1–E7 y correo, 2026-11-07», incluida matriz de trazabilidad. Esta sección contiene las decisiones ratificadas, no aprobación en bloque de la matriz propuesta de titularidad ni del protocolo P/T. TASKS registra continuidad y PLAN dependencias; se preservan íntegros los antecedentes y la matriz única de 27 operaciones.

### Resolución central y verificación escalonada — RATIFICADAS

Identidad nueva: alta normal al cumplir condiciones, sin aprobación humana central individual obligatoria. Identidad existente: reutilizar identidad y exigir aceptación autenticada para nueva agencia. Identidad ambigua: bloquear solo la operación afectada y resolver exclusivamente mediante autoridad central autorizada, sin eliminar bloqueos independientes exigidos por otras políticas. Coordinador aporta evidencia y solicita revisión, nunca resuelve unilateralmente ambigüedad global. Verificación escalonada (opción B): primero evidencia técnica, después complementaria y solo cuando sea necesario reforzada, proporcional al riesgo y operación. No pedir identificación oficial a todos, no fusionar por coincidencias débiles ni revelar privados de otras agencias.

Resolución central ordinaria: autoridad central facultada resuelve casos con evidencia suficiente y sin riesgo excepcional. Revisión central reforzada: dos personas distintas, facultadas e independientes para operaciones excepcionales de alto riesgo; sin doble aprobación general para altas normales. Mantener revisión independiente pertinente. La matriz propuesta de titularidad del informe anterior conserva carácter propuesto en sus detalles no ratificados; no asignar facultades nominales por esta distinción.

### Catálogo E1–E7 — RATIFICADO POR EL PO

| ID | Categoría | Evidencia admisible | Alcance |
|---|---|---|---|
| E1 | Autenticación | Sesión vigente, autenticada y vinculada a la identidad estable | Acredita control de cuenta |
| E2 | Identidad técnica | Identificadores, vínculos Auth–perfil y registros históricos verificables | Acredita correspondencia entre registros |
| E3 | Autorización | Solicitud del coordinador y aceptación autenticada del reclutador, cuando corresponda | Acredita autorización para la operación o membresía |
| E4 | Correo electrónico | Verificación vigente de una dirección electrónica | Acredita control del correo, no titularidad completa |
| E5 | Auditoría | Eventos, cambios autorizados, versiones y revocaciones | Acredita trazabilidad y permite detectar contradicciones |
| E6 | Complementaria | Confirmaciones de fuentes autorizadas vinculadas al caso | Permite resolver insuficiencias concretas |
| E7 | Reforzada | Evidencia adicional excepcional, incluida identificación oficial cuando esté justificado | Apoya revisiones de alto riesgo |

No todas las categorías son obligatorias en todos los casos. Evidencia proporcional al riesgo y operación solicitada. Identificación oficial no constituye por sí sola prueba concluyente de titularidad. E1 no acredita por sí sola todas las facultades locales; E4 no concede membresía ni cambia vínculo estable. No se prescribe documento específico obligatorio, puntuación, tecnología de verificación o retención por ratificar categorías.

### Criterios de decisión — RATIFICADOS

- APROBAR: evidencia acredita relación necesaria sujeto–identidad–operación, procede de fuentes verificables, corresponde a la operación, no presenta contradicciones materiales pendientes y satisface autorizaciones/condiciones aplicables.
- ESCALAR: contradicciones relevantes, reclamaciones incompatibles, insuficiencia o necesidad de verificación adicional/revisión central. Bloqueo limitado a operación cuestionada; no elimina bloqueos independientes de seguridad.
- RECHAZAR: falta de autorización acreditada, manipulación detectada o requisito obligatorio incumplido. Registrar rechazo sin suspender automáticamente otras membresías legítimas. Insuficiencia sola se trata según ESCALAR, sin inventar manipulación.
- Prohibidas puntuaciones que compensen contradicciones materiales mediante varias coincidencias débiles. Una aprobación de titularidad no concede automáticamente otra operación, membresía o facultad ni elimina una ejecución externa incierta.

### Corrección antes de activación — RATIFICADA

Coordinador autorizado puede gestionar corrección del correo antes de activación, con controles de seguridad. Invalidar invitación anterior y enviar nueva al correo corregido. La corrección no debe producir apropiación de identidad existente. Autorización concreta, concurrencia y revocación quedan sujetas a diseño técnico. No confundir corrección con reenvío: reenvío no cambia destino; esta operación sí tiene política específica. La invitación nueva conserva regla ratificada de 24 horas desde su emisión y un uso, sin extender ni revivir la anterior.

### Cambio después de activación — RATIFICADO

Reclutador autenticado puede solicitar cambio y debe verificar el nuevo correo. Coordinador no puede sustituir unilateralmente correo de cuenta activa. Si perdió acceso al correo anterior pero conserva credenciales válidas, aplicar controles adicionales proporcionales al riesgo. Cambio no modifica automáticamente identidad global, código individual ni membresías. Reautenticación, notificación y gestión de sesiones concretas permanecen pendientes de validación. No inventar obligación de acceso al correo anterior en todos los casos ni permitir que verificar el nuevo omita controles de apropiación o titularidad.

### Recuperación excepcional — RATIFICADA

Pérdida de acceso al correo y a credenciales requiere recuperación excepcional. Autoridad central autorizada evalúa evidencia aplicable E1–E7; alto riesgo requiere revisión reforzada de dos personas distintas, facultadas e independientes. Conocer solo código/correo/teléfono/datos declarados no basta. Sospecha de apropiación bloquea la operación cuestionada, respetando otros bloqueos independientes. Después de recuperación de alto riesgo invalidar sesiones anteriores conforme al procedimiento. Recuperar acceso no reactiva membresías revocadas ni modifica identidad estable.

Compatibilidad normativa: la última regla confirma el caso de alto riesgo, no exceptúa las recuperaciones ordinarias de P0-3/POL-CT01-03/04: TODA recuperación completada revoca sesiones anteriores y exige autenticación nueva. Se mantienen I-10/reconciliación/exclusión y bloqueo por efecto incierto; resolver titularidad no prueba cancelación Auth ni permite revivir generaciones. I-11/restauración global no sustituye recuperación ni elimina sus bloqueos técnicos.

### Sucesión, validación pendiente y alcance

Las menciones históricas «catálogo/suficiencia de titularidad», «autoridad de corrección de correo» y «políticas de cambio/recuperación por decidir» quedan sucedidas solo por los contenidos expresamente ratificados aquí. Resueltos categorías E1–E7, criterios generales, separación ordinaria/reforzada y direcciones de corrección/cambio/recuperación; mecanismos, parámetros y designaciones no se dan por aprobados. Bloqueo acotado no contradice suspensión global o saga incierta con alcance propio. Sin conflicto normativo irresoluble detectado al conservar esos ámbitos. No reabrir AN-01/AN-02/AN-80, D-01–D-04, correo/enlace/reenvío, identidad única o contratos previos.

Pendientes técnicos/operativos: documentos específicos si se justifican, plazos de conservación, mecanismos de autenticación reforzada, umbrales automáticos de riesgo, implementación de verificación documental, designaciones nominales, concurrencia/revocación/sustitución de derivados no validadas, reautenticación/notificación/sesiones para cambio, garantías Auth, reconciliación, antiabuso y política restante de reenvío. Validación legal de tratamiento/evidencia/retención cuando corresponda, sin requisitos legales específicos inventados ni consulta externa. Revisión independiente/aceptación documental y pruebas seguridad/integración pendientes. No usar E7 como exigencia universal ni inventar nuevos factores, costos o plazos.

Correspondencia futura NO EJECUTADA: I-01/I-08/I-09/M-01 y filas 2/7/8/10–12/20–26 de matriz 27; P09/P10–P13/P26/P32/P33/P39 para titularidad/independencia/privacidad; P09/P31/subcasos para cambio de canal/derivados; P14/P29/P30 y subcasos para efectos inciertos; P07/P25/P35/P37/P38 según recuperación/sesiones/superficies y P23/P27 para evidencia/auditoría. Comprobar ausencia de vínculos/activaciones/entregas indebidas y positivos equivalentes, no solo HTTP. No P41 ni tareas/fases/hallazgos nuevos. CT-01/CT-02/REC-F2-001 y hallazgos abiertos; inventarios, R1, estados y pruebas NO EJECUTADAS preservados. Sin implementación, código, históricos/gobernanzas, SQL/migraciones/configuración, servicios/conexiones, commit/push/merge/deploy.

## Acreditación operativa de titularidad — propuesta por escenarios, 2026-11-08

Fuente: mandato PO «REC-F2-001, acreditación operativa de titularidad». Base sincronizada: 1228b3804397e9cb1fd14b62307696dfdc903342. Esta sección es la definición documental única de la propuesta de suficiencia aplicada; no ratifica mecanismos por el hecho de documentarlos. R significa obligación ya ratificada en las secciones precedentes; P/T significa procedimiento operativo o mecanismo técnico propuesto para revisión. Todas las filas siguientes son P/T bajo esas obligaciones R. No reemplaza ni reproduce la matriz única de 27 operaciones ni el catálogo E1–E7: los aplica y referencia. HALLAZGOS conserva rectoría, TASKS continuidad y PLAN dependencias.

### Reglas comunes de aplicación — R y propuesta P/T

R: control del correo (E4) no equivale a titularidad completa, control de cuenta (E1), facultad ni membresía. Código conocido, teléfono, nombre o contacto coincidente son indicios, no autorización. Identidad técnica estable y código nunca reasignable se conservan; cambio autorizado de código sigue AN-01/AN-02, emisión automática D-02 no concede cambio al coordinador. D-01–D-04 conservan sus ámbitos y aceptación aplicable. No fusión por coincidencias débiles ni información privada entre agencias. Ninguna combinación de indicios compensa contradicción material.

P/T: para cada evaluación, vincular operación y sujeto estables, agencia/recurso si aplica, solicitud y versión de términos, referencias de evidencia y autoridad vigente. Registrar para cada evidencia categoría E, fuente verificable, método de comprobación, correspondencia con sujeto/operación y estado actual de revocación/sustitución. «Vigente» significa aplicable y no invalidada por cambios materiales al decidir y ejecutar; no fija una antigüedad numérica ni garantiza la tecnología que lo comprobará. No exigir E1 a quien precisamente perdió credenciales ni E7 a todas las personas. Pedir E6 solo para la insuficiencia identificada y E7 solo cuando la revisión reforzada esté justificada.

R: clasificación automática nueva/existente/ambigua no resuelve una disputa global. Caso ambiguo solo lo resuelve central autorizada; coordinador aporta evidencia sin adjudicar identidad. Resolución central ordinaria respeta I-08/I-09 y la independencia pertinente: no equivale a autoaprobación del interesado. Alto riesgo excepcional exige dos personas distintas, facultadas e independientes, no dos cuentas de la misma persona; no imponer doble aprobación a altas normales. Los conflictos y la vigencia se revalidan conforme I-09/P32.

P/T: suficiencia requiere una cadena comprobable entre solicitante, sujeto, identidad y operación, sin contradicciones materiales pendientes y con condiciones/autorizaciones satisfechas. Son contradicciones materiales, según el caso: vínculo Auth–perfil incompatible, reclamaciones excluyentes sobre identidad, fuente alterada, aceptación de otro destinatario/términos, evidencia revocada o autoridad incompatible con el ámbito. Una discrepancia de contacto aislada motiva comprobación proporcional; no demuestra por sí sola fraude ni autoriza fusión o suspensión global.

R: aplicar APROBAR/ESCALAR/RECHAZAR de «Criterios de decisión — RATIFICADOS». P/T: la columna Resultado concreta la salida de evaluación, no declara ejecutada la operación. APROBAR no crea sesión, membresía o efecto Auth por sí mismo: requiere las transiciones vigentes I/A/M y ausencia de bloqueos independientes. Insuficiencia o contradicción no resuelta conduce a ESCALAR; RECHAZAR requiere falta acreditada de autorización, manipulación detectada o incumplimiento obligatorio demostrado. No convertir falta de respuesta externa en rechazo definitivo o éxito.

### Matriz de suficiencia aplicada por escenario — P/T para revisión

Las categorías listadas son pertinentes según el caso, no una lista universal de documentos obligatorios. Auditoría de todas las filas remite al registro común de esta sección. Los números de operación remiten a la matriz 27 existente; no son nuevos identificadores.

| Operación solicitada | Actor solicitante | Evidencia pertinente | Procedencia y vigencia | Condiciones de suficiencia | Contradicciones materiales | Autoridad competente | Escalamiento y revisión reforzada | Resultado de evaluación | Registro de auditoría específico | Contratos / operaciones / pruebas existentes NO EJECUTADAS |
|---|---|---|---|---|---|---|---|---|---|---|
| Alta nueva y clasificación previa | Coordinador facultado en agencia destino | E2/E3/E5; E6 si hay insuficiencia concreta | Registros de correspondencia y facultad consultados en fuente autorizada; estado actual | Solicitud legítima y correspondencia no ambigua; no identidad existente duplicada; condiciones de I-01 | Sujeto/perfil/Auth incompatibles o identidad existente presentada como nueva | Servicio autorizado clasifica y tramita D-01; disputa solo central | Ambigua pasa a central ordinaria; alto riesgo excepcional a reforzada | APROBAR trámite de alta si suficiente; ESCALAR ambigüedad; RECHAZAR falta de facultad acreditada | Origen/agencia, clasificación y fundamento sin enumerar identidades ajenas | I-01/M-01; ops. 1/2/7; P10/P15/P26/P33/P39 |
| Emisión o cambio autorizado de código | Servicio central para emisión; solicitante de cambio según elegibilidad pendiente | E2/E3/E5; E1 si aplicable al solicitante, no prueba única | Mapeo histórico y comando central vigentes; fuente de autoridad | Misma identidad estable; unicidad histórica; emisión D-02 o cambio central AN-01/02 autorizado | Código ya asignado a otra identidad, cambio de sujeto o comando incompatible | Central sobre códigos; servicio ejecuta comando limitado; elegibilidad para pedir cambio no presumida | ESCALAR sujeto incierto o elegibilidad pendiente; reforzada solo si corresponde por riesgo | APROBAR asignación autorizada; ESCALAR insuficiencia; RECHAZAR reasignación o autoridad ausente demostradas | Asignación/comando, historial y versión, sin exponer código como prueba de titularidad | I-01/I-02/M-01; ops. 3–6; P26/P33/P39/P40 |
| Invitación y activación inicial | Reclutador destinatario; servicio autorizado tramita | E2/E3/E4/E5; E6 si necesario | Emisión y destino versionados; verificación de correo e invitación vigentes, 24 horas/un uso | Correspondencia acreditada, control del correo y contraseña establecida personalmente; estados válidos | Invitación ajena/consumida/revocada o vínculo incompatible | Servicio limitado al flujo autorizado; central resuelve ambigüedad | Insuficiencia de titularidad a central; no revisión humana central obligatoria por alta normal | APROBAR continuación global, nunca membresía por E4 solo; ESCALAR ambigüedad; RECHAZAR requisito incumplido demostrado | Emisión/confirmación/consumo y vínculo, nunca enlace ni contraseña | I-01/I-05/M-01; ops. 7/8; P09/P19/P26/P27/P40 |
| Reenvío sin cambio de datos | Reclutador por autoservicio o coordinador autorizado | E3/E5 y estado técnico del envío; E1 cuando corresponda a gestión autenticada | Solicitud y material de invitación vigentes; autoridad del coordinador actual | Modalidad aprobada; mismo destino/datos; política de sustitución no inferida | Intento de cambiar identidad/destino o invalidar material por mera petición anónima | Servicio de invitación dentro del procedimiento pendiente; coordinador solo facultad aprobada | Política no definida bloquea el efecto afectado, no elimina autoservicio; no revelar escalamiento al público | APROBAR solo trámite compatible definido; ESCALAR política/resultado incierto; RECHAZAR abuso acreditado sin enumeración | Modalidad/correlación y resultado minimizados; respuesta pública no distingue existencia | I-05; op. 8/protocolo correo; P02/P09/P19/P31/P40 |
| Corrección de correo antes de activar | Coordinador autorizado | E2/E3/E5; E6 para insuficiencia; E4 del nuevo destino en activación | Solicitud/vínculo/estado preactivación verificables; versiones anterior y nueva | Autoridad vigente y mismo sujeto; invalidación anterior y nueva invitación coherentes; no apropiación | Cuenta ya activa, identidad ajena o consumo simultáneo incompatible | Coordinador gestiona; servicio autorizado ejecuta; central resuelve disputa | ESCALAR correspondencia incierta; riesgo excepcional según I-08/I-09 | APROBAR corrección si condiciones satisfechas; ESCALAR carrera sin resolver; RECHAZAR sustitución ajena acreditada | Motivo, versiones y constancia de invalidación/nueva emisión sin direcciones completas innecesarias | I-01/I-05; op. 8 y política corrección; P09/P19/P20/P26/P31 |
| Cambio de correo de cuenta activa | Reclutador autenticado | E1/E2/E4 nuevo/E5; E6 proporcional si perdió correo anterior | Sesión vinculada vigente, nuevo correo verificado y vínculo actual | Solicitud propia, nuevo control y controles adicionales aplicables; reautenticación/sesiones concretas pendientes | Cuenta solicitante distinta, nuevo control no acreditado o apropiación sospechada | Titular solicita; servicio limitado; coordinador no sustituye unilateralmente | Falta correo anterior con credenciales válidas no impone excepcional automáticamente; contradicción a central | APROBAR solo bajo procedimiento completo; ESCALAR controles insuficientes; RECHAZAR petición ajena acreditada | Solicitud, prueba nueva, versiones y efectos de sesión/notificación por definir | I-05/I-08/I-10; ops. 21/25 y política cambio; P09/P10/P25/P31/P32/P37 |
| Incorporación a otra agencia y activación local | Coordinador facultado solicita; reclutador existente acepta autenticado | E1/E2/E3/E5 | Sesión, solicitud/destinatario/términos y permisos actuales en agencia destino | Identidad existente reutilizada, aceptación exacta y demás precondiciones de activación; sin permisos importados | Otra cuenta acepta, términos cambiados o autoridad revocada | D-03/D-04: coordinador dentro de facultades y servicio acotado; no concesión global | Ambigüedad a central; facultades no definidas no se presumen | APROBAR relación local autorizada; ESCALAR duda; RECHAZAR aceptación/facultad inválida demostrada | Autorización/aceptación y versiones, sin revelar historia de otras agencias | A-03–A-07/M-01; ops. 9–12; P15/P18–P20/P26/P33 |
| Recuperación ordinaria mediante correo verificado | Titular por flujo de recuperación; coordinador solo asistencia facultada | E2/E4/E5 y autorización limitada; E3 para asistencia aplicable | Factor previamente verificado no sustituido/comprometido; autorización/generación vigentes | Prueba de control conforme I-07 y autorización I-10, exclusión y revocación de sesiones al completar | Factor sustituido, sujeto incompatible o intento interferente | Servicio bajo procedimiento autorizado; coordinador no decide reset global | Insuficiencia/ambigüedad a central; pérdida de correo y credenciales a excepcional | APROBAR autorización limitada, no sesión; ESCALAR insuficiencia/incertidumbre; RECHAZAR prueba inválida demostrada | Factor referenciado, autorización, generaciones/intentos y finalización; ningún secreto | I-06/I-07/I-10; ops. 19–21/24; P07/P09/P25/P29–P31/P37 |
| Recuperación excepcional sin correo ni credenciales | Reclutador solicita; coordinador puede aportar evidencia permitida | E2/E5, E6 pertinente y E7 justificada; E1 solo si realmente disponible; catálogo aplicable | Fuentes autorizadas verificables vinculadas al caso y versiones actuales | Cadena suficiente sujeto–identidad–operación; sin contradicciones; revisión y autorización exactas I-08/I-09 | Reclamaciones excluyentes, datos conocidos como única prueba, conflicto de aprobadores | Central específica; ordinaria independiente o dos personas distintas facultadas independientes en alto riesgo | Técnica → complementaria → reforzada según necesidad; no exigir identificación universal | APROBAR autorización limitada si suficiente; ESCALAR insuficiencia/disputa; RECHAZAR manipulación/falta de autoridad acreditadas | Riesgo motivado, personas efectivas, independencia, evidencias/versiones y decisión | I-08–I-10; ops. 22–24; P10–P13/P26/P29/P30/P32/P33 |
| Cambio autenticado de contraseña | Titular autenticado | E1/E2/E5 y autorización propia I-10 | Sesión, prueba fresca conforme procedimiento pendiente y generación actuales | Misma identidad, autorización propia y exclusión; no confundir con recuperación sin sesión | Sesión residual/revocada o cambio concurrente incompatible | Titular y servicio acotado; interfaz Perfil no ratificada por esta propuesta | Procedimiento/factor no definido se eleva, no se inventa | APROBAR bajo contrato completo; ESCALAR insuficiencia/efecto incierto; RECHAZAR autoridad inválida demostrada | Operación propia, autorización y generación, sin contraseña | I-02/I-10; op. 25; P25/P29/P30/P37/P40 |
| Suspender o reactivar membresía local | Coordinador con permiso específico D-04 | E1/E2/E3/E5 | Permiso/agencia/relación/términos y estado global actuales | Sujeto y relación exactos, transición válida; reactivación no revive terminales; aceptación aplicable | Recurso de otra agencia, relación revocada tratada como suspendida o identidad global bloqueada al activar | Autoridad local específica, sin facultad global | Disputa de identidad a central; facultad local insuficiente no concede suspensión global | APROBAR solo efecto local legítimo; ESCALAR duda; RECHAZAR ámbito/transición prohibidos acreditados | Motivo, agencia, transición y dependencias, otras membresías intactas | A-07; ops. 14/15; P16/P17/P18/P20/P33 |
| Suspender o restaurar identidad global | Autoridad central específicamente facultada | E2/E3/E5; E1 del actor; evidencia pertinente al motivo | Facultad/motivo/identidad y generaciones actuales | Política I-11 y transición válidas; restaurar exige login nuevo y conserva impedimentos independientes | Rol genérico/local presentado como central o restauración que revive autoridad revocada | Central específica, sin facultad implícita por ser coordinador | Ambigüedad a central competente; revisión reforzada cuando el caso excepcional de alto riesgo lo exija, sin imponerla a toda suspensión | APROBAR solo transición I-11; ESCALAR insuficiencia; RECHAZAR autoridad ausente acreditada | Motivo, autoridad, generaciones, efectos globales y bloqueos conservados | I-11; ops. 17/18; P25/P33/P35/P37/P38 |
| Resolver identidad ambigua o reclamaciones incompatibles | Interesado/coordinador presenta caso; clasificación automática solo detecta | E2/E5 primero; E6 y E7 según insuficiencia/riesgo; E1/E3/E4 pertinentes, nunca concluyentes solos | Fuente y correspondencia verificadas, caso y evidencia versionados | Relación suficiente sin contradicciones materiales; no fusión por coincidencia débil | Vínculos incompatibles, reclamantes excluyentes, evidencia alterada o conflicto de interés | Exclusivamente central autorizada, ordinaria independiente o reforzada según I-09 | Bloquear solo operación cuestionada manteniendo otros bloqueos; reforzada dos personas cuando corresponde | APROBAR resolución exacta; ESCALAR mientras insuficiente; RECHAZAR solo causa acreditada según criterios | Fundamento de resolución, alternativas descartadas, independencia y alcance sin privados ajenos | I-01/I-08/I-09/M-01; op. 2; P10–P13/P26/P32/P33/P39 |
| Reconciliar efecto externo incierto | Reconciliador específicamente facultado, designación pendiente | E2/E3/E5 y evidencia técnica del intento | Resultado externo correlacionado con ejecución/sujeto/versiones y cierre de intentos | Condiciones de I-10/R1 acreditadas; decisión de titularidad no demuestra terminación Auth | Evidencia de otro intento, resultado tardío incompatible o intento todavía ejecutable | Reconciliador limitado al caso; no reemplaza aprobadores ni elige contraseña | Evidencia insuficiente mantiene bloqueo técnico aunque titularidad ya esté resuelta | APROBAR solo transición R1 permitida; ESCALAR incertidumbre; RECHAZAR transición no autorizada acreditada | Intentos, evidencia correlacionada, autoridad y transición, sin payload secreto | I-10; op. 26; P14/P27/P29/P30 y subcasos |

### Registro, privacidad y aceptación documental de la propuesta

P/T: registro común con referencia de caso/operación, actor solicitante y decisor, identidad estable, ámbito, facultad comprobada, categoría/procedencia/versión de evidencia, insuficiencia o contradicción identificada, fundamento APROBAR/ESCALAR/RECHAZAR, revisión/independencia aplicables y estado del intento. Referencias de evidencia en lugar de copias indiscriminadas. Metadatos centrales separados de contenido privado; acceso por finalidad y facultad A-12, proyección mínima, sin privados de otras agencias. No registrar contraseñas, tokens, enlaces de activación ni documentos completos en eventos. Integridad y registro previo exigido por A-12/P27 permanecen requisitos; no se acredita su implementación.

P/T: conservar evaluación vinculada a versiones; cambio material de identidad, evidencia, términos, riesgo o autoridad obliga a reevaluar lo afectado antes de ejecutar. La aceptación documental exige revisar cada escenario y sus positivos/negativos contra P existentes; insuficiencia sola no se etiqueta fraude, APROBAR no sortea autorización ni bloqueo técnico, y efectos inciertos no se convierten en éxito. Validar posteriormente rechazo sin efectos indebidos y caso legítimo equivalente, no solo HTTP. P01–P40/subcasos y nueve experimentos permanecen NO EJECUTADOS.

### Pendientes de decisión y validación — sin ratificación por inferencia

Para revisión PO: aceptar o ajustar esta aplicación por escenarios; concretar concedentes/facultades y designaciones operativas cuando impliquen asignar autoridad, elegibilidad de solicitud de cambio de código y política restante de reenvío/sustitución/antiabuso. Si se proponen documentos obligatorios, factores adicionales, umbrales, reglas de retención o excepciones funcionales, requieren decisión expresa antes de adoptarlos. No se fijan aquí. Las autoridades funcionales ya ratificadas no se reabren.

Ingeniería puede proponer, sin convertirlo en decisión PO: representación/versionado de evidencia, comprobación de procedencia/vigencia, revalidación de permisos, concurrencia/idempotencia, revocación de derivados y trazabilidad de intentos. Reautenticación/notificación/sesiones concretas, protección efectiva de evidencia, garantías Supabase Auth y reconciliación requieren diseño y validación posterior autorizados. Tratamiento/retención y validación legal pertinente siguen pendientes, sin requisitos legales inferidos. Parámetros con efecto funcional se elevan al PO; decisiones puramente técnicas compatibles no se presentan como nueva ratificación funcional.

Siguiente dependencia dentro de REC-F2-001: revisión PO de esta propuesta y pendientes indispensables → diseñar corrección previa/cambio posterior con estados/versiones e invalidación → recuperación excepcional/revocación/reconciliación → revisión independiente y aceptación documental identificable. No iniciar esas actividades por esta sección. CT-01/CT-02/REC-F2-001 ABIERTOS; sin nueva fase, tarea o hallazgo, sin implementación ni pruebas. La autorización actual permite solo esta documentación y su commit/push limitado conforme MC-07, no ejecución técnica.

## PO-REC-F2-001-SE-01 — suficiencia funcional de evidencia, 2026-11-08

**Estado: RATIFICADA POR EL PO.** Fuente: mandato expreso «REC-F2-001, registro de ratificación PO sobre suficiencia de evidencia». Alcance: suficiencia funcional de evidencia aplicable a la matriz de 14 escenarios de «Acreditación operativa de titularidad — propuesta por escenarios, 2026-11-08», dentro de CT-01/CT-02 y REC-F2-001. Esta es la disposición normativa única de esta decisión; HALLAZGOS conserva rectoría y trazabilidad, TASKS registra continuidad y PLAN dependencias.

**Criterio 1 — Proporcionalidad**

La evidencia debe ser proporcional a la operación solicitada y al riesgo del escenario.

**Criterio 2 — Correo e identidad**

El control de un correo electrónico no acredita por sí solo la titularidad completa de una identidad.

**Criterio 3 — Contradicciones materiales**

Las contradicciones materiales impiden la aprobación automática.

**Criterio 4 — Evidencia insuficiente**

La evidencia insuficiente exige escalamiento, nunca aprobación por suposición.

**Criterio 5 — Mecanismos técnicos pendientes**

Los mecanismos P/T permanecen sujetos a diseño, implementación y validación posterior. La ratificación funcional no equivale a aprobación técnica.

Relación normativa: estos cinco criterios se aplican a la evidencia pertinente E1–E7 y a los contratos CT-01/CT-02, preservando el catálogo, sus límites y APROBAR/ESCALAR/RECHAZAR. Contradicciones materiales no autorizan aprobación humana que omita su resolución: siguen vigentes las condiciones ratificadas de APROBAR. No se sustituye ni duplica la matriz de 14 escenarios o la de 27 operaciones; todas sus referencias y detalles P/T se conservan. Las notas anteriores de revisión pendiente quedan sucedidas exclusivamente respecto de estos cinco criterios funcionales, no de la aceptación integral de la aplicación por escenarios ni de mecanismos operativos/técnicos.

Siguen pendientes facultades, concedentes, designaciones, elegibilidad no definida para solicitar cambio de código y política restante de reenvío/sustitución/revocación/antiabuso. No se introducen facultades, documentos obligatorios, factores, umbrales, proveedores o plazos. Procedencia/versionado de evidencia, concurrencia, revocación, reautenticación/notificación/sesiones, garantías Auth y reconciliación requieren diseño y validación posterior autorizados. CT-01/CT-02 ABIERTOS; REC-F2-001 EN_CURSO solo diseño; P01–P40/subcasos y nueve experimentos NO EJECUTADOS. Ningún cierre técnico, de tarea o hallazgo por esta ratificación.

## Facultades, concedentes y designaciones — propuesta para revisión PO, 2026-11-08

Fuente: mandato PO «REC-F2-001, propuesta de facultades y autoridades», base master/d647687b16f81e2dbe86356841f1709166a37047. Esta es la extensión única de autoridad de la matriz existente: referencia sus filas, sin reproducir operaciones, efectos o precondiciones. R = RATIFICADO únicamente en el alcance y fuente indicados; P = PROPUESTO/PENDIENTE, sin autorización efectiva. Toda designación, concedente o revocador aquí propuesto requiere ratificación expresa. HALLAZGOS conserva rectoría, TASKS continuidad y PLAN dependencias.

### A. Concesión y revocación — límites comunes

R: D-01–D-04 permiten registro operativo, solicitud de incorporación y activación/suspensión local por coordinador ya facultado; no determinan quién concede o revoca esas facultades. AN-01/AN-02 reservan códigos a central, con identidad estable y prohibición absoluta de reasignación. PO-F2-001-D atribuye autorización de incorporación de coordinadores al Maestro o administrador expresamente delegado; no lo convierte en concedente universal. El contrato Maestro/Limitado conserva gestión de administradores por Maestro, sin extenderla al Limitado ni equiparar es_maestro del reclutador a rol administrativo. I-08/I-09/I-11 exigen autoridad central específica; no la asignan a todo administrador. Ejecutar, revisar, aprobar, conceder y revocar son facultades distintas.

P — mecanismo común de concesión: registrar beneficiario humano efectivo o principal técnico, concedente y fuente de su facultad, operación exacta, agencia/recurso/caso, techo de alcance, inicio y condición de término, dependencias, motivo y versión. No se proponen plazos numéricos. Conceder solo dentro del propio techo expresamente delegable; sin autoconcesión, ciclos ni subdelegación inferida, conforme A-08. La autoridad inicial para conceder/revocar cada familia debe resolverla el PO: esta propuesta no crea una autoridad de arranque por defecto. Revocación de una facultad no equivale a suspender identidad o membresía; cada efecto requiere su autoridad propia.

P — revocación: autoridad revocadora expresamente designada por familia y ámbito, no automáticamente el ejecutor ni cualquier superior aparente. Registrar fundamento, alcance, dependencias y momento efectivo; revalidar al decidir y al ejecutar, cancelar efectos dependientes todavía no autorizables, conservar historia y no revivir concesiones terminales al restaurar al concedente. A-08/A-09 y R1 siguen siendo contratos propuestos en sus mecanismos, no facultades ratificadas en bloque.

Bases aplicables a todas las filas de la tabla siguiente: condiciones de la operación original, I-01–I-11 y A-03–A-12 pertinentes; autoridad y membresía local actuales, términos/versiones exactos, ausencia de revocación y bloqueos compatibles al efecto. Una capacidad central no otorga acceso privado local. Evidencia E1–E7 proporcional y criterios PO-REC-F2-001-SE-01 intactos; no compensar contradicciones materiales ni aprobar por insuficiencia. Auditoría base de la matriz 27 más concesión/revocación de facultad, persona efectiva, fuente de autoridad, alcance, versiones, decisión, ejecución y resultado correlacionados. Acceso a evidencia limitado por finalidad y facultad propia; sin secretos o evidencia personal completa en logs generales. La forma concreta de registrar y comprobar esas bases es P/T, no garantía implementada.

### Matriz complementaria de facultades por familia

Todas las referencias son a filas de la matriz única 27. Las familias agrupan facultades compartidas; cada fila referenciada hereda las bases anteriores y conserva íntegro su contrato original. «Por designar P» significa que ni concedente ni revocador están aprobados; autoridad funcional ratificada no cubre ese vacío. No hay operación 28.

| Filas existentes | Actor solicitante | Titular de autoridad y ámbito | Facultad / estado | Concedente y revocador | Ejecutor | Vigencia, separación y evidencia específica |
|---|---|---|---|---|---|---|
| 1, 10 | Coordinador facultado | Coordinador, solo agencia autorizada | R D-01 registro / D-03 solicitud; asignación concreta P | Ambos por designar P para facultades locales | Coordinador solicita; servicio tramita | Permiso local vigente; nueva/existente acreditada; origen y términos; sin aprobación humana central individual obligatoria por alta |
| 2 | Coordinador/interesado presenta caso; servicio detecta | Servicio clasifica técnicamente; central autorizada resuelve ambigüedad | R resolución central exclusiva; clasificación y designación P/T | Ambos por designar P para clasificación y resolución, por separado | Servicio clasifica; operador central resuelve dentro del caso | Evidencia/versiones/fundamento; revisión independiente pertinente; dos personas facultadas distintas e independientes si excepcional de alto riesgo; sin fusión débil |
| 3, 6 | Flujo D-01/D-02 o comando de cambio autorizado | Central sobre códigos | R emisión D-02/AN-02; ejecución acotada P/T | Ambos por designar P para capacidad técnica; no coordinador por alta | Servicio autorizado | Sujeto y comando exactos, unicidad histórica, idempotencia; auditar asignación y resultado; ejecutar no autoriza cambio |
| 4, 5 | P titular propio; coordinador solo asistencia solicitada y acotada | Central para aprobar; solicitante no decide | R cambio central AN-01/02; elegibilidad y procedimiento P | Ambos por designar P para aprobación y asistencia | Solicitante registra; aprobador central decide; servicio de fila 6 ejecuta | Tres funciones separadas propuestas; evidencia de misma identidad, motivo y autorización versionada; ninguna reasignación, incluso manual |
| 7 | Flujo de alta legítimo | Central, provisión/vínculo exactos | R tramitación central D-01; capacidad/procedimiento P/T | Ambos por designar P para provisión y vínculo | Servicio autorizado | I-01/M-01, correspondencia acreditada; intención/intentos/resultados; ambigüedad a fila 2; incompleto sin acceso |
| 8 | Reclutador destinatario; reenvío por autoservicio o coordinador autorizado; corrección previa por coordinador autorizado | Titular establece contraseña; central gobierna activación; gestión local acotada | R activación/correo, modalidades de reenvío y corrección previa; facultades concretas/protocolo P | Autoridad propia del titular no es delegación; concedente/revocador de gestión y servicio por designar P | Titular y servicio; coordinador solo gestión autorizada | Invitación 24 horas/un uso, control y titularidad restante; corrección invalida anterior; política general de sustitución/revocación de reenvío sigue pendiente; auditar versiones/consumo sin enlace |
| 9, 14, 15 | Coordinador con permiso específico | Local, relación reclutador y agencia autorizadas | R D-04 activar/suspender; reactivación bajo A-07 | Ambos por designar P para cada permiso local | Coordinador ordena; servicio aplica transición | Identidad habilitada al activar, aceptación pertinente D-03, transición válida; motivo y estados; no revive revocadas ni afecta otras agencias |
| 11 | Flujo de incorporación autorizado | Servicio bajo reglas de autoridad del destino y controles centrales aplicables | P/T comprobación; no facultad autónoma de aprobar | Ambos por designar P para verificación técnica | Servicio autorizado | Revalidar solicitante, términos y aceptación; registrar fuentes/versiones; sin inventar aprobación central individual |
| 12 | Reclutador invitado autenticado | Propio titular, agencia destino y términos exactos | R D-03 aceptación propia | No se concede por tercero; invalidación de solicitud según autoridad/procedimiento pendiente, no revocación de voluntad por un operador | Titular acepta; servicio registra | Sesión/vínculo/términos vigentes; aceptación no concede facultad de activación; evidencia de persona, términos y consumo |
| 13 | Solicitud de incorporación de coordinador; invitado acepta | R Maestro o administrador expresamente delegado, central/destino | R PO-F2-001-D autorizar más aceptación; delegaciones concretas P | D identifica quién autoriza incorporación, no quién concede/revoca la facultad del administrador delegado: ambos pendientes P | Autoridad central autoriza; invitado acepta; servicio activa | Ambas condiciones vigentes; registrar fuente de delegación/aceptación; no gestión de administradores por Limitado ni poder global al coordinador |
| 16 | P actor con facultad local específica | P autoridad de revocación de relación, agencia exacta | P revocar membresía; no derivar de D-04 | Ambos por designar P; propuesta de permiso distinto de suspensión | P operador designado y servicio limitado | A-06/A-07, estado/versiones/dependencias; auditar terminación y conservación de historia; sin afectar otras membresías |
| 17, 18 | Central específicamente facultada | Central sobre identidad global | R I-11 suspender/restaurar; designaciones/procedimiento P | Ambos por designar P, diferenciando suspensión y restauración | P operador central ordena; servicio ejecuta | Motivo/autoridad/generaciones; restaurar exige login nuevo, sin revivir sesiones, facultades o membresías ni retirar bloqueo técnico; revisión reforzada solo cuando corresponda por caso ratificado |
| 19, 20 | Solicitante por flujo público; coordinador autorizado asiste | Solicitante solo inicia; asistencia local sin decisión global | R asistencia limitada; I-06/procedimiento P/T | Inicio público no es delegación; ambos por designar P para asistencia | Servicio recibe; coordinador aporta evidencia permitida | Mera solicitud no revoca, reserva exclusión ni acredita titularidad; respuesta opaca, correlación y evidencia mínima; cuotas pendientes |
| 21 | Titular por prueba del canal verificado; titular autenticado para cambio de correo activo según política propia | Servicio limitado para ordinaria; titular pide cambio propio | R correo canal de recuperación y política de cambio propio; protocolo P/T | Autoridad propia no delegable por coordinador; ambos por designar P para capacidad de servicio | Titular prueba; servicio verifica y emite autorización limitada | I-05/I-07: origen/factor/versiones/consumo; cambiar correo verifica nuevo, controles proporcionales; no sustitución unilateral local; autorización todavía no cambia contraseña |
| 22, 23 | Reclutador reclama; coordinador aporta evidencia permitida | Central específica por caso; verificador y aprobadores delimitados | R I-08/I-09 evaluación y aprobación independientes; designaciones P | Ambos por designar P, separadamente para evaluar y aprobar | Verificador evalúa; aprobadores deciden; servicio registra | Excluir interesado/conflictos; riesgo y evidencia versionados; alto riesgo/privilegiada: dos personas distintas facultadas independientes; revalidación al ejecutar, sin secretos al asistente |
| 24, 25 | Autorización ordinaria/excepcional vigente; titular autenticado para cambio propio | Autoridad limitada a acción/identidad; no autoridad decisoria del ejecutor | R resultado recuperación/sesiones; cambio propio y mecanismos I-10 P/T | Autoridad propia no es delegación; ambos por designar P para ejecución técnica | Servicio ejecuta; contraseña aportada por titular bajo procedimiento aplicable | I-10 exclusión entre vías, revalidación y generaciones; evidencia de intentos/resultado; toda recuperación completa revoca sesiones previas y exige login nuevo; Perfil no aprobado por esta propuesta |
| 26 | Ejecución con efecto externo incierto; operador técnico designado | Central técnica, caso/intentos exactos | P designación y capacidad limitada; transiciones R1 P/T conservadas | Ambos por designar P para inspección/registro/transición, sin facultad de titularidad | Reconciliador técnico acotado | Evidencia correlacionada y cierre de intentos; separación respecto de aprobación; sin liberar por timeout/lease ni elegir credenciales; auditar transición y bloqueos preservados |
| 27 | Coordinador/administrador sin facultad intenta reset ajeno | Ninguna por rol o visibilidad local | R prohibición; ninguna facultad positiva propuesta | No hay concesión implícita ni facultad que revocar por este intento | Servicio rechaza | Autoridad ausente: cero efecto, sin secretos ni cambio de factor; auditoría minimizada del rechazo |

### B. Designaciones centrales — PROPUESTO/PENDIENTE

Designar capacidades por familia y ámbito, sin crear cargos: operador central que tramita, verificador que evalúa evidencia, aprobador que decide y principal técnico que ejecuta comandos. Registrar persona efectiva, facultad, concedente acreditado, revocador, alcance y vigencia; no designar «administrador global» por pertenecer a central. Propuesta: la capacidad de tramitar no incluye evaluar, aprobar o delegar; la de verificar no incluye aprobar por sí sola; aprobación no incluye ejecución técnica libre. Las compatibilidades concretas de capacidades en casos ordinarios requieren decisión PO, respetando I-08/I-09 y las exclusiones ya ratificadas. No se impone doble aprobación a toda alta ni toda operación central.

R: en excepcional privilegiada/alto riesgo se requieren dos personas distintas, facultadas e independientes; dos cuentas de una persona no cuentan doble. P: documentar por caso comprobación de persona efectiva, ausencia de interés/conflictos, evidencia/riesgo/versiones y revalidación de ambas facultades al ejecutar; cambio material invalida lo afectado. La designación administrativa no demuestra independencia en un caso particular. Revisión independiente del diseño y aceptación documental siguen pendientes; esta autorrevisión no las acredita.

### C. Cambio de código individual — PROPUESTO/PENDIENTE salvo AN-01/AN-02

Proponer titular como solicitante elegible para su propia identidad; coordinador únicamente presenta asistencia con consentimiento y facultad local comprobables, sin aprobar ni elegir el nuevo código. El PO debe ratificar si admite ambos canales y sus condiciones; la matriz histórica que los menciona no aprobó su elegibilidad. Proponer aprobador central con facultad específica de cambio, distinto del solicitante interesado, y servicio técnico ejecutor limitado al comando aprobado. No proponer aquí que Maestro, Limitado o quien emite códigos pueda conceder o aprobar cambios por ese solo hecho.

R: identidad Auth/perfil estable, unicidad histórica y prohibición absoluta de reasignar un código a otra identidad. P/T: revalidar sujeto, historial completo, comando/versiones y autoridad al efecto, registrar antiguo/nuevo mediante referencias protegidas y conservar trazabilidad; colisión/ambigüedad impide cambio. No modificar membresías, contraseña, token de referido o atribución. D-02 sigue emisión automática sin aprobación humana individual por alta; no se extiende esa automatización a aprobación autónoma de cambios.

### D. Reconciliador — PROPUESTO/PENDIENTE

Proponer facultades separadas de inspección técnica mínima, registro de evidencia y aplicación de transición R1 admisible para ejecución e intentos identificados. No acceso general a expedientes, factores, contraseñas o datos privados de agencias. Solo evidencia correlacionada del resultado externo y de la imposibilidad de efectos tardíos incompatibles permite la transición contemplada por I-10; evidencia insuficiente mantiene bloqueo técnico. Registrar persona/principal, facultad, intentos, fuentes/versiones, fundamento y efecto. Designación, concedente/revocador y compatibilidad con otros operadores requieren ratificación PO; disponer de service-role no los sustituye.

No puede resolver titularidad, aprobar recuperación, seleccionar/cambiar credenciales por decisión propia, sustituir sujeto, repetir ciegamente una operación incierta, saltar aprobaciones ni retirar suspensiones o bloqueos independientes. Resolver titularidad no prueba terminación Auth. La revisión humana no reemplaza evidencia técnica faltante. Propuesta de separación: quien aprueba recuperación no habilita por sí mismo la salida de incertidumbre; el reconciliador registra únicamente la transición técnica autorizable, sin nueva aprobación de negocio.

### Pendientes y puerta de continuidad

Próxima decisión PO: ratificar o ajustar, por familia, quién puede conceder y revocar y con qué techo; designaciones y compatibilidades centrales; elegibilidad de solicitud de código y separación propuesta; capacidad técnica limitada del reconciliador. Sin esa decisión no se habilitan facultades nuevas. Después corresponde política restante de reenvío/sustitución/revocación/antiabuso y procedimientos de correo/recuperación; esta propuesta no los resuelve ni inicia. No contradicción normativa irresoluble detectada: autorizar incorporación de coordinadores no equivale a conceder toda facultad; suspensión local no es revocación de membresía ni suspensión global; clasificación técnica no adjudica disputas. Pendientes de garantías Auth, concurrencia, evidencia, revocación y auditoría efectiva siguen sin validar.

CT-01/CT-02 ABIERTOS; REC-F2-001 EN_CURSO solo diseño. Matrices únicas de 27 operaciones y 14 escenarios, PO-REC-F2-001-SE-01 e I-01–I-11 intactos. P01–P40/subcasos y nueve experimentos NO EJECUTADOS. Sin nuevas tareas/fases/hallazgos, implementación, pruebas de producto, migraciones, servicios o despliegues. Solo cuatro documentos y sincronización MC-07 autorizadas; entregar y detenerse para revisión PO.

## AUT-01 a AUT-04 — ratificación funcional de controles de delegación, 2026-11-08

Fuente normativa: ratificación expresa del Product Owner del 2026-11-08, mandato «REC-F2-001, ratificación AUT-01 a AUT-04», base master/94b017348925eb5187fa8de928783becf5b2fbb7. Estado de cada decisión: **RATIFICADA — ALCANCE FUNCIONAL**. HALLAZGOS conserva rectoría y trazabilidad; esta sección contiene el texto normativo único, TASKS la continuidad y PLAN las dependencias. La ratificación es exclusivamente funcional y normativa: no autoriza implementación ni valida mecanismos técnicos P/T.

### AUT-01 — Concesión y revocación de facultades administrativas de coordinadores

**RATIFICADA — ALCANCE FUNCIONAL**.

- El Maestro conserva la autoridad inicial.
- Los administradores expresamente delegados pueden conceder y revocar facultades administrativas de coordinadores únicamente dentro del alcance autorizado.
- Toda delegación debe identificar autoridad de origen, beneficiario, facultades, agencia o recursos, límites, vigencia o condiciones de término y trazabilidad.
- Prohibida la autoconcesión, ampliación unilateral, delegación superior al techo autorizado y subdelegación por inferencia.
- La autoridad para ejecutar operaciones no implica autoridad para conceder facultades.
- No extender esta ratificación a facultades globales, recuperación de identidad, administración de administradores ni otras familias pendientes.

### AUT-02 — Suspensión preventiva de facultades dependientes

**RATIFICADA — ALCANCE FUNCIONAL**.

- La revocación de una autoridad concedente obliga a identificar las facultades cuya validez dependa de ella.
- Las facultades efectivamente dependientes quedan suspendidas preventivamente hasta revisión competente.
- La suspensión no afecta indiscriminadamente facultades con fuentes independientes válidas.
- Distinguir revocación administrativa de revocación por seguridad.
- En incidentes de seguridad, revisar además concesiones y operaciones potencialmente comprometidas.
- No suspender automáticamente identidad global ni membresías locales por la sola revocación de una facultad.
- No presumir que todas las concesiones históricas fueron ilegítimas.

### AUT-03 — Tratamiento de operaciones pendientes

**RATIFICADA — ALCANCE FUNCIONAL**.

- Las operaciones aún no ejecutadas que dependan de una facultad suspendida quedan bloqueadas.
- Preservar estado, evidencia, historial, autorizaciones, intentos y resultados conocidos.
- Las operaciones ya ejecutadas con resultado confirmado conservan su resultado registrado y se revisan cuando proceda; no se revierten por suposición.
- Las operaciones con resultado externo incierto mantienen bloqueo y pasan a reconciliación técnica limitada.
- La continuación, cancelación o reinicio de una operación bloqueada requiere una nueva decisión de autoridad competente.
- Una nueva autorización no permite repetir automáticamente una operación de resultado incierto.
- El reconciliador técnico no adquiere autoridad para resolver titularidad, aprobar recuperaciones o elegir credenciales.

### AUT-04 — Restablecimiento controlado

**RATIFICADA — ALCANCE FUNCIONAL**.

- Una facultad suspendida solo puede recuperar eficacia mediante revisión y autorización expresa de autoridad competente.
- Registrar evidencia, autoridad, fundamento, alcance y momento efectivo.
- Recuperar la autoridad del concedente original no reactiva automáticamente las facultades dependientes suspendidas.
- Mantener separados el restablecimiento de facultades, la activación de membresías locales y la restauración de identidad global.
- No revivir facultades terminalmente revocadas, sesiones invalidadas ni derechos previamente extinguidos.

### Integración, sucesión delimitada y referencias existentes

AUT-01 precisa el concedente/revocador de facultades administrativas de coordinadores: Maestro como autoridad inicial y administradores expresamente delegados dentro de su alcance. No designa personas ni convierte a todos los administradores en concedentes. Sucede únicamente al pendiente de autoridad inicial en esa familia dentro de «Facultades, concedentes y designaciones — propuesta para revisión PO»; los textos históricos y las celdas P se conservan como antecedente, interpretados bajo esta delimitación. No asignar automáticamente esta solución a todas las facultades operativas de la matriz, al beneficiario reclutador, a capacidades técnicas de servicios ni a quien delega en administradores. La autoridad y condiciones de la delegación del administrador deben estar acreditadas, sin atribuir por inferencia un concedente de otra familia. D-01–D-04 conservan su reparto funcional y precondiciones; PO-F2-001-D conserva autorización central y aceptación para incorporar coordinadores, sin confundir incorporación con concesión de facultades.

Vínculo con A-08/A-09: AUT-01 ratifica los límites funcionales expresos de origen, beneficiario, alcance, techo, vigencia/trazabilidad y prohibiciones de concesión anteriores; no acepta en bloque sus mecanismos. AUT-02 exige identificar dependencia efectiva y suspender preventivamente, preservando fuentes independientes; AUT-03 distingue pendiente no ejecutada, ejecutada confirmada y resultado externo incierto; AUT-04 exige revisión y autorización expresa para restablecer suspendidas. Las menciones previas de cancelar dependientes no despachados se leen como impedir efectos no autorizables y someter continuación/cancelación/reinicio a decisión competente, no como cancelación automática o borrado. Una facultad suspendida no es una facultad terminalmente revocada. No hay contradicción con la prohibición de revivir terminales de A-09 ni con I-11: recuperar autoridad del concedente no restaura automáticamente dependientes, identidad, membresías o sesiones.

Referencias a la matriz única de 27 operaciones, sin nuevas filas ni duplicación: 1/9–16/20 conservan permisos y ámbitos locales propios; 13 conserva D sobre incorporación de coordinadores, sin extender AUT-01 a concedentes de otras familias. 2–8/17–19/21–27 mantienen sus autoridades, prohibiciones y pendientes específicos. AUT-02–AUT-04 se aplican al tratamiento de dependencia y estado cuando efectivamente corresponda en cualquiera de las 27 operaciones; no crean facultad positiva para ejecutarlas ni delegarlas. En 24–26, I-10/R1 conservan exclusión, evidencia correlacionada y bloqueo por incertidumbre; una nueva decisión de negocio no demuestra cierre de intentos ni habilita reintento ciego. En 27 permanece el rechazo al reset ajeno sin facultad. I-01–I-11, AN-01/AN-02, identidad estable, unicidad histórica y prohibición absoluta de reasignación de códigos permanecen intactos.

Evidencia y auditoría se enlazan con E3/E5, A-12 y PO-REC-F2-001-SE-01, sin alterar suficiencia proporcional, independencia I-08/I-09 o los 14 escenarios existentes. Trazabilidad de validación futura: P21/P22/P34 para delegación/revocación/dependencias; P18–P20/P33 para alcance local; P14/P29/P30 y subcasos para ejecución e incertidumbre; P23/P27 para evidencia/auditoría; P35 para separación respecto de restauración global. Son referencias a pruebas existentes NO EJECUTADAS; no nuevos casos P41 ni resultados de producto.

Pendientes PO: concedentes/revocadores de otras familias, designaciones y compatibilidades centrales, elegibilidad para solicitar cambio de código, designación/concedente/revocador del reconciliador, política restante de reenvío/sustitución/revocación/antiabuso. No se nombran por «autoridad competente»: cada decisión requiere facultad acreditada para el ámbito y acción, no rol genérico. Siguiente diseño propuesto, pendiente de autorización delimitada: identificación de dependencias y fuentes independientes, clasificación administrativa/seguridad y de resultados de operaciones, revisión competente y restablecimiento con evidencia; proponer mecanismos y resolver designaciones faltantes sin convertirlos en ratificados.

CT-01/CT-02 ABIERTOS; REC-F2-001 EN_CURSO, solo diseño. Matrices 27/14, decisiones anteriores, inventarios y estados preservados; P01–P40/subcasos y nueve experimentos NO EJECUTADOS. Sin aceptación integral ni cierre técnico, implementación o revisión independiente acreditada. Solo documentación y sincronización Git MC-07 autorizadas; sin código, migraciones, configuración, servicios de producto, pruebas de producto o despliegues manuales.

## AUT-05 — Compatibilidad condicionada de funciones centrales, 2026-11-08

**Estado: RATIFICADA — ALCANCE FUNCIONAL.** Fuente normativa: ratificación expresa del Product Owner del 2026-11-08, mandato «REC-F2-001, ratificación AUT-05», base master/058c18ad7cfd46eaf1cffe38170aaeb8812e8890. HALLAZGOS conserva rectoría; esta sección contiene la regla normativa única, TASKS continuidad y PLAN dependencias. No autoriza implementación ni valida mecanismos técnicos P/T.

### Regla y condiciones acumulativas

Una misma persona puede verificar y aprobar una operación ordinaria que requiera intervención humana solamente si:

1. Posee ambas facultades expresas y vigentes.
2. La operación permite esa compatibilidad conforme a su clasificación de riesgo.
3. Existe evidencia suficiente y pertinente.
4. No hay conflicto de interés.
5. La persona no está resolviendo una solicitud propia ni obteniendo un beneficio indebido.
6. Ambas actuaciones se registran separadamente para auditoría.
7. Se revalidan autoridad, riesgo, evidencia y condiciones al decidir y ejecutar.

La compatibilidad no concede facultad de ejecución.

### Separación reforzada e incompatibilidades

- Los procedimientos excepcionales, privilegiados o de alto riesgo mantienen la separación de funciones exigida por sus contratos.
- Cuando se requieran dos revisores humanos distintos e independientes, AUT-05 no permite sustituirlos por una sola persona.
- Una clasificación ambigua, evidencia insuficiente o conflicto no resuelto impide aplicar compatibilidad y exige escalar conforme al procedimiento autorizado.
- El operador no puede reducir unilateralmente la clasificación de riesgo para aprobar su propia intervención.

### Tres modalidades funcionales

- **Operación automática autorizada:** servicio aplica controles previamente autorizados sin aprobación humana individual inventada.
- **Operación ordinaria con intervención humana:** compatibilidad condicionada de verificación y aprobación cuando corresponda.
- **Operación excepcional o de alto riesgo:** separación reforzada conforme a contratos ratificados.

No introducir aprobación manual obligatoria en operaciones automáticas ya autorizadas.

### Integración y sucesión delimitada

AUT-05 resuelve únicamente el principio funcional de compatibilidad de verificación y aprobación en operación ordinaria con intervención humana bajo las siete condiciones acumulativas. Las referencias anteriores a «compatibilidades centrales pendientes» quedan sucedidas solo respecto de ese principio; no equivalen a prohibición absoluta ni a autorización general de acumular capacidades. Continúan pendientes las designaciones concretas, facultades de cada persona y aplicación admisible por operación/riesgo. La propuesta de separación de «Designaciones centrales — PROPUESTO/PENDIENTE» se interpreta bajo esta regla sin borrar antecedentes. No se concede ninguna de las dos facultades por ejercer la otra, ni autoridad de ejecución, concesión o revocación por compatibilidad. AUT-01–AUT-04 conservan alcance y controles de dependencia, bloqueo y restablecimiento; una facultad suspendida o revocada no satisface AUT-05.

Referencias a las 27 operaciones existentes, sin duplicar su matriz: D-01/D-02 y tramitación automática autorizada de altas en 1/3/6/7/8/11 conservan sus controles y límites, sin aprobación humana individual añadida; no se ratifican por esta remisión los mecanismos T ni se declara automática toda operación de esas filas. En 2, la clasificación técnica no adjudica disputas y la resolución central mantiene independencia según contrato. En 4/5/13 y demás operaciones con intervención humana, AUT-05 solo puede aplicarse si la operación es ordinaria, admite compatibilidad y satisface las siete condiciones, sin conceder facultades pendientes ni eliminar aceptación del invitado. Las filas 9–16/19–21 conservan permisos locales, aceptación propia o flujo público según corresponda, sin convertirse por esta decisión en aprobaciones humanas obligatorias. En 17/18, I-11 mantiene autoridad central específica y efectos propios; la compatibilidad no concede suspensión/restauración global. En 22/23, I-08/I-09 conservan separación exigida para procedimientos excepcionales y dos personas distintas facultadas e independientes cuando corresponda; AUT-05 no es excepción a esos contratos. En 24–26 se mantienen I-10, exclusión y reconciliación técnica limitada; verificar/aprobar no autoriza ejecutar ni resolver efectos inciertos por decisión de negocio. En 27 sigue el rechazo de reset ajeno sin facultad.

I-01–I-11, D-01–D-04, AN-01/AN-02, AUT-01–AUT-04 y PO-REC-F2-001-SE-01 permanecen íntegros. Evidencia suficiente bajo E1–E7 y los 14 escenarios no se sustituye por concentración de funciones: insuficiencia escala y contradicciones materiales conservan sus impedimentos. Auditoría enlazada con A-12/E5: actuaciones de verificación y aprobación separadamente registradas aun si corresponden a la misma persona; forma técnica de registro, comprobación de independencia/conflictos y revalidación siguen P/T. Referencias futuras a P10–P13/P32/P33 para riesgo/independencia, P23/P27 para auditoría y P21/P22/P34 para facultades/dependencias; NO EJECUTADAS, sin nuevos IDs de prueba ni aprobación técnica.

Pendientes PO: designaciones concretas de operadores, verificadores, aprobadores y ejecutores; concedentes/revocadores de otras familias; elegibilidad para solicitar cambio de código individual; designación y facultades del reconciliador; política restante de reenvío de invitaciones. Mecanismos técnicos y pruebas pendientes. Próxima decisión concreta: delimitar las designaciones centrales y sus facultades expresas, ámbito y vigencia, identificando aplicación de AUT-05 por operación/clasificación y separación contractual, sin nombrar cargos o personas por inferencia. El diseño de dependencias y restablecimiento AUT-02–AUT-04 continúa pendiente y no se inicia automáticamente.

REC-F2-001 EN_CURSO; CT-01/CT-02 ABIERTOS; P01–P40 NO EJECUTADAS (subcasos y nueve experimentos igualmente NO EJECUTADOS). Matrices 27/14 e inventarios íntegros, sin cierre ni aceptación integral. Solo documentación de cuatro maestros y sincronización MC-07 autorizadas; no código, migraciones, Supabase/Vercel, infraestructura, secretos, configuración, pruebas de producto ni despliegues manuales. Entregar y detenerse para revisión PO.

## AUT-06 — Designación delegada y continuidad de autoridades centrales, 2026-11-08

**Estado: RATIFICADA — ALCANCE FUNCIONAL.** Fuente: ratificación expresa del Product Owner, mandato «REC-F2-001, ratificación AUT-06», base master/50898e9dedd69ea48acb93fbb4cf06a409a3c738. HALLAZGOS conserva rectoría; esta sección contiene la norma única, TASKS continuidad y PLAN dependencias. La ratificación es funcional y normativa: no autoriza implementación ni aprueba mecanismos técnicos todavía pendientes.

### A. Autoridad inicial

El Maestro conserva la autoridad inicial conforme a los contratos vigentes.

Su intervención personal no será requisito para cada operación cotidiana ni para cada designación central que pueda efectuar válidamente una autoridad delegada.

### B. Designación delegada

El Maestro puede conceder expresamente a administradores autorizados la facultad de designar y revocar operadores centrales.

La delegación debe identificar:

- Autoridad concedente y fuente de legitimidad.
- Administrador beneficiario.
- Facultades concretas que puede conceder o revocar.
- Operaciones y recursos cubiertos.
- Ámbito de aplicación.
- Límites y condiciones de vigencia.
- Restricciones de compatibilidad.
- Evidencia y auditoría.

Ningún administrador adquiere esta facultad por su cargo, jerarquía aparente o participación operativa.

### C. Límites de autoridad

Un administrador delegado no puede:

- Concederse facultades.
- Elevar unilateralmente sus privilegios.
- Superar el techo de su delegación.
- Crear nuevos concedentes mediante subdelegación implícita.
- Otorgar facultades globales fuera del alcance expresamente autorizado.
- Eludir incompatibilidades, controles de riesgo o revisiones independientes.

La capacidad de designar operadores no implica autorización para ejecutar las operaciones que dichos operadores realizan.

### D. Continuidad ordinaria

Las autoridades delegadas vigentes y competentes podrán continuar las operaciones autorizadas sin requerir intervención personal del Maestro.

La ausencia o indisponibilidad de un administrador no paraliza automáticamente la operación si existen otras autoridades vigentes con facultades suficientes.

No presumir que la ausencia de una persona permite ampliar facultades ajenas.

### E. Separación de funciones

Preservar AUT-05.

Las operaciones ordinarias admiten compatibilidad condicionada de verificación y aprobación cuando corresponda.

Los procedimientos excepcionales, privilegiados o de alto riesgo conservan las separaciones y revisiones independientes exigidas por los contratos vigentes.

### F. Revocación y dependencias

Aplicar AUT-01 a AUT-04.

La revocación de una delegación obliga a identificar facultades efectivamente dependientes, suspenderlas preventivamente cuando corresponda, bloquear operaciones dependientes y preservar evidencias.

No reactivar facultades automáticamente por recuperación de autoridad del concedente.

### G. Continuidad extraordinaria — PENDIENTE ESPECÍFICO DE DISEÑO

Establecer como pendiente específico el diseño de un procedimiento para recuperar o sustituir autoridades cuando no exista ninguna autoridad vigente capaz de realizar una operación indispensable.

Este procedimiento:

- No queda aprobado técnicamente mediante AUT-06.
- No crea una cuenta de emergencia con privilegios ilimitados.
- No permite omitir autenticación ni auditoría.
- No permite recuperación unilateral de control global.
- Deberá contemplar controles reforzados y autoridades independientes conforme a un diseño posterior ratificado por el PO.

No inventar todavía número de participantes, quórums, plazos ni mecanismos de recuperación.

### Integración normativa y sucesión delimitada

AUT-06 precisa la fuente funcional de la delegación para designar/revocar operadores centrales: Maestro puede conceder esa facultad expresamente a administradores autorizados. Sucede solo al pendiente de ese principio, sin designaciones individuales, facultades concretas concedidas ni arquitectura paralela de autoridades. Las menciones anteriores de designaciones/concedentes pendientes se conservan como antecedentes y se interpretan bajo este alcance: no exigir presencia personal del Maestro si ya existe autoridad delegada suficiente, ni interpretar la ausencia como una delegación nueva. Administrador delegado para designar operadores no equivale a nuevo concedente universal; no habilita subdelegación implícita ni gestión de administradores por Limitado.

Relación con AUT-01–AUT-05 y A-08/A-09: AUT-01 conserva su familia de facultades administrativas de coordinadores; AUT-06 no la transforma en autoridad global ni resuelve concedentes/revocadores de familias distintas de las expresamente cubiertas. Cada designación exige fuente legítima, beneficiario, operaciones/recursos, ámbito, techo/vigencia, compatibilidad y evidencia conforme B; A-08/A-09 siguen sin ratificación técnica en bloque. AUT-02–AUT-04 mantienen dependencia efectiva y fuentes independientes, suspensión preventiva, tratamiento diferenciado de operaciones y restablecimiento expreso: confirmadas no se revierten por suposición, inciertas no se repiten por nueva autorización ni por necesidad de continuidad. AUT-05 conserva sus siete condiciones ordinarias y la separación reforzada; designar no acredita independencia por caso ni concede ejecución. Las tres modalidades de AUT-05 y la automatización autorizada sin aprobación humana individual inventada permanecen vigentes.

CT-01/CT-02 e I-01–I-11 conservan identidad global única, permisos locales por agencia, facultad central específica y separación de solicitud/aprobación/ejecución según operación. Referencias a las 27 operaciones, sin duplicar matrices: 1/3/6/7/8/11 conservan tramitación automática solo donde ya autorizada; 9–16/19–21 conservan permisos, aceptación y ámbitos propios; 13 mantiene D sobre incorporación de coordinadores, que no sustituye designación ni concesión de facultades. En 2/4/5/17/18/22/23, continuidad requiere autoridades efectivamente facultadas para cada actuación, sin asignarlas automáticamente por AUT-06; I-08/I-09 y sus revisores distintos e independientes siguen exigibles. En 24–26, continuidad no elimina I-10, incertidumbre o requisitos de reconciliación técnica; el reconciliador no resuelve titularidad, aprueba recuperación ni elige credenciales. En 27 sigue el rechazo de reset ajeno sin facultad. AN-01/AN-02 mantienen identidad estable, autoridad central sobre códigos y prohibición absoluta de reasignación.

Auditoría/evidencia enlazadas con A-12/E3/E5 y PO-REC-F2-001-SE-01: origen y vigencia de delegación/designación, límites, decisión, operación y revocación deben poder acreditarse; mecanismos de registro, revalidación, concurrencia y comprobación de independencia siguen P/T. Trazabilidad futura a pruebas existentes P21/P22/P34 (delegación/dependencias), P10–P13/P32/P33 (riesgo/independencia), P23/P27 (auditoría) y P14/P29/P30/subcasos (incertidumbre); todas NO EJECUTADAS. Continuidad extraordinaria es pendiente dentro de REC-F2-001, no tarea/fase/hallazgo nuevo, procedimiento aprobado ni prueba nueva.

Pendientes expresos: designaciones individuales de operadores centrales; concedentes/revocadores de familias distintas de las expresamente cubiertas; elegibilidad para solicitar cambio de código individual; designación del reconciliador técnico; continuidad extraordinaria; política restante de reenvío de invitaciones; procedimientos técnicos de identidad/recuperación, mecanismos y pruebas. Próxima decisión concreta PO: delimitar administradores beneficiarios y delegaciones expresas de designación/revocación central, facultades concedibles/revocables, ámbitos/recursos, límites/vigencia y compatibilidades, sin reabrir el principio AUT-06; autorizar después el diseño específico de continuidad extraordinaria con controles reforzados y autoridades independientes, sin anticipar participantes, quórums, plazos o mecanismo.

AUT-01–AUT-05, D-01–D-04, AN-01/AN-02, I-01–I-11 y PO-REC-F2-001-SE-01 íntegros. Matrices 27/14 preservadas, no duplicadas; REC-F2-001 EN_CURSO; CT-01/CT-02 ABIERTOS; P01–P40 NO EJECUTADAS, subcasos y nueve experimentos NO EJECUTADOS. Sin aceptación técnica o cierre; solo documentación/Git MC-07 de cuatro maestros, sin código, migraciones, Supabase/producción/Vercel, infraestructura, secretos, configuración, pruebas de producto o despliegues manuales. Entregar y detenerse para revisión.

## AUT-07 — Separación entre designación de operadores y delegación de autoridad administrativa, 2026-11-08

**Estado: RATIFICADA — ALCANCE FUNCIONAL.** Fuente: ratificación funcional expresa del Product Owner, mandato «REC-F2-001, ratificación AUT-07», base master/cb3bddc6c6631579f55294402a7966786511b70b. HALLAZGOS conserva rectoría; esta sección contiene el texto normativo único, TASKS continuidad y PLAN dependencias. No autoriza implementación ni ratifica mecanismos técnicos P/T por inferencia.

### Reglas funcionales y criterio de diseño

1. El Maestro conserva la autoridad inicial conforme a los contratos vigentes.
2. Los administradores con delegación expresa pueden designar y revocar operadores centrales exclusivamente dentro del ámbito autorizado.
3. La facultad de designar operadores centrales no incluye la facultad de crear otros administradores con poder de delegación.
4. La concesión de autoridad para crear nuevos administradores requiere autorización diferenciada y competente; el procedimiento reforzado queda pendiente de definición.
5. Se prohíben la autoconcesión, la autoelevación de privilegios, el exceso del techo de delegación y la subdelegación implícita.
6. La continuidad ordinaria podrá apoyarse en varias autoridades administrativas independientes, sin exigir aprobación conjunta para cada operación ordinaria.
7. Para funciones centrales críticas, registrar como criterio de diseño la disponibilidad de al menos dos autoridades independientes, sin convertir todavía esa cantidad en requisito normativo obligatorio.
8. Designar operadores no concede facultades de ejecución ni poderes globales por inferencia.
9. Mantener los controles de trazabilidad, auditoría, vigencia, revocación, dependencia y separación de funciones de AUT-01 a AUT-06.

### Integración y límites de la ratificación

AUT-07 precisa AUT-06: designar/revocar operadores dentro de delegación expresa y crear administradores con poder de delegación son autoridades distintas. La primera no permite reproducir la cadena de concedentes; la segunda requiere autorización diferenciada y competente, con procedimiento reforzado todavía pendiente. No se asigna por esta decisión un nuevo concedente/revocador de esa familia ni se modifica el contrato Maestro/Limitado de gestión de administradores. AUT-01 mantiene la familia de facultades administrativas de coordinadores; A-08/A-09 conservan límites de origen, beneficiario, techo, vigencia y revocación, sin aprobación técnica en bloque. No crear jerarquías ni arquitectura paralela a las autoridades existentes.

Continuidad ordinaria de AUT-06: varias autoridades independientes pueden sostener operaciones para las que ya tengan facultades suficientes, sin aprobación conjunta por cada ordinaria. El criterio de diseño de al menos dos autoridades para funciones críticas no designa personas, no fija una cantidad mínima obligatoria ni establece quórum de aprobación, y no se convierte en requisito de doble aprobación de toda operación. Se mantiene AUT-05 con sus siete condiciones acumulativas cuando proceda; procedimientos excepcionales, privilegiados o de alto riesgo conservan separación y revisores humanos distintos e independientes exigidos por I-08/I-09 y demás contratos. La disponibilidad de autoridades para continuidad y la independencia de revisores por caso no son equivalentes. Ausencia de una persona no concede autoridad a otra.

AUT-02–AUT-04 siguen rigiendo dependencia efectiva/fuentes independientes, suspensión preventiva, bloqueo de operaciones dependientes, preservación de evidencia y restablecimiento expreso, sin reactivación automática por recuperar autoridad del concedente. AUT-07 no habilita ejecución por designar, repetición automática de efectos inciertos, resolución de titularidad ni recuperación global unilateral. Continuidad extraordinaria de AUT-06 permanece pendiente de diseño/ratificación posterior; no cuenta de emergencia ilimitada, omisión de autenticación/auditoría, número de participantes, quórums, plazos o mecanismo nuevo.

Referencias existentes, sin duplicar matrices: las 27 operaciones conservan sus actores, ámbitos y precondiciones. En 13, autorización de incorporación de coordinador y aceptación no equivalen a crear administrador o concedente; las facultades locales de 1/9–16/20 no confieren administración global. En 2/4/5/17/18/22/23, cada intervención central sigue requiriendo facultad específica y separación pertinente; en 3/6/7/8/11 se conserva automatización solo donde autorizada, sin aprobación manual inventada; 12/19/21 mantienen aceptación propia/flujo público/autorización limitada según su contrato. En 24–26 siguen I-10 y reconciliación técnica limitada, en 27 rechazo de reset ajeno sin facultad. No operación 28 ni nueva matriz de autoridades. D-01–D-04, AN-01/AN-02, I-01–I-11, PO-REC-F2-001-SE-01, E1–E7 y los 14 escenarios permanecen íntegros.

Auditoría y evidencia enlazadas con A-12/E3/E5: acreditar fuente, objeto y límite de cada designación/delegación sin confundir ambas; registro y revalidación técnicos siguen P/T. Trazabilidad futura a P21/P22/P34 (delegación/dependencias), P10–P13/P32/P33 (riesgo/independencia), P23/P27 (auditoría), todas NO EJECUTADAS. No nuevo caso de prueba ni afirmación de eficacia técnica. No contradicción normativa irresoluble detectada al separar designación, creación de administradores, disponibilidad para continuidad y revisión independiente por caso.

Pendientes expresos: designaciones concretas y concedentes/revocadores de otras familias; procedimiento reforzado de creación de administradores con delegación; cantidad mínima obligatoria de autoridades independientes; continuidad extraordinaria; elegibilidad para cambio de código individual; designación y facultades del reconciliador; política restante de invitaciones; procedimientos técnicos y pruebas. Las referencias históricas de pendientes se conservan, precisadas exclusivamente por el reparto funcional ratificado, sin resolver esos puntos por inferencia. Próxima decisión concreta PO: delimitar designaciones/delegaciones centrales concretas y autorizar el diseño del procedimiento reforzado diferenciado; decidir posteriormente si el criterio de al menos dos autoridades debe convertirse en mínimo obligatorio, sin tratarlo ahora como norma ni quórum.

REC-F2-001 EN_CURSO; CT-01/CT-02 ABIERTOS; P01–P40 NO EJECUTADAS, subcasos/nueve experimentos NO EJECUTADOS. AUT-01–AUT-06, demás decisiones, matrices 27/14 e inventarios íntegros. Sin cierre técnico ni aceptación integral; solo cuatro maestros y sincronización Git MC-07, sin código, migraciones, servicios/producción, infraestructura, secretos, configuración, pruebas de producto o despliegues. Entregar y detenerse para revisión PO.

## AUT-08 — Delegación diferenciada de capacidades centrales, 2026-11-08

**Estado: RATIFICADA — ALCANCE FUNCIONAL.** Fuente normativa: ratificación expresa del Product Owner del 2026-11-08, mandato «REC-F2-001, ratificación AUT-08», base master/cdfb070ce2b1310246760bf7eb2c130cfa7da41b. HALLAZGOS conserva rectoría; esta sección contiene el texto normativo único, TASKS continuidad y PLAN dependencias. Son capacidades funcionales diferenciadas, no cargos nuevos ni arquitectura paralela; la ratificación no autoriza implementación ni aprueba mecanismos técnicos P/T.

### A. Tramitación central

Permite recibir solicitudes, reunir información y organizar evidencias dentro del ámbito autorizado.

No concede aprobación, ejecución ni autoridad para decidir titularidad.

### B. Verificación central

Permite evaluar evidencia, identidad y condiciones de operaciones autorizadas.

La facultad se limita al ámbito y nivel de riesgo expresamente concedidos.

No concede automáticamente aprobación ni capacidad para otorgar permisos.

### C. Aprobación central

Permite autorizar o rechazar operaciones dentro del ámbito expresamente concedido.

La aprobación ordinaria solo puede ser delegada por una autoridad con facultad específica para conceder esa capacidad.

Las aprobaciones críticas requieren autorización diferenciada y separación reforzada conforme a los contratos vigentes.

No concede automáticamente ejecución ni ampliación de autoridad propia.

### D. Ejecución técnica

Permite aplicar operaciones válidamente autorizadas, bajo condiciones verificables y con registro de resultados.

No concede autoridad para decidir identidad, titularidad, aprobar solicitudes ni otorgar permisos.

Los servicios automatizados deberán operar bajo identidades técnicas y facultades limitadas; sus mecanismos concretos permanecen pendientes de diseño.

### Límites acumulativos

1. La concesión de una capacidad no concede las demás.
2. Ningún administrador puede exceder su autoridad ni el techo de delegación.
3. Las operaciones críticas no pueden reclasificarse como ordinarias para eludir controles.
4. La compatibilidad de verificación y aprobación se rige por AUT-05.
5. Toda concesión, modificación, suspensión y revocación debe ser trazable, incluyendo autoridad de origen, beneficiario, ámbito, vigencia, condiciones y evidencia.
6. La facultad de designar operadores no incluye crear administradores con poder de delegación, conforme a AUT-07.
7. Ninguna capacidad equivale a un permiso genérico de acceso total.
8. La autorización para ejecutar una operación no sustituye las aprobaciones humanas o automáticas exigidas por su contrato.

### Integración con AUT-01–AUT-07 y contratos vigentes

AUT-08 ratifica la distinción funcional entre tramitar, verificar, aprobar y ejecutar; las propuestas anteriores que delimitaban esas capacidades quedan precisadas solo en este alcance. No designa beneficiarios ni concede capacidades concretas por cargo, visibilidad, compatibilidad o necesidad operativa. AUT-01 conserva su familia de facultades administrativas de coordinadores; AUT-06 conserva delegación expresa de designación/revocación de operadores dentro de techo autorizado, sin convertir a cualquier designador en concedente de aprobación ordinaria. Para conceder esta última se debe acreditar facultad específica conforme C; concedentes/revocadores de otras familias siguen pendientes. AUT-07 mantiene diferenciación de creación de administradores con poder de delegación, procedimiento reforzado pendiente y prohibición de subdelegación implícita.

AUT-02–AUT-04 conservan dependencia efectiva, fuentes independientes válidas, suspensión preventiva, bloqueo, tratamiento de confirmadas/inciertas y restablecimiento expreso sin reactivación automática. AUT-05 permite compatibilidad de verificar/aprobar únicamente bajo sus siete condiciones acumulativas, sin conceder ninguna capacidad ni ejecución; independencia y separación reforzada excepcional/privilegiada/alto riesgo de I-08/I-09 permanecen exigibles. Continuidad ordinaria AUT-06/AUT-07 conserva autoridades vigentes suficientes sin aprobación conjunta de cada ordinaria; disponibilidad de al menos dos autoridades independientes para funciones críticas sigue criterio de diseño, no mínimo obligatorio o quórum. Continuidad extraordinaria sigue sin procedimiento aprobado.

CT-01/CT-02, A-08/A-09/A-12, E3/E5 y PO-REC-F2-001-SE-01 mantienen autoridad verificable, auditoría, evidencia suficiente y prohibición de privilegios por inferencia; mecanismo físico de identidades técnicas, capacidades, registro y revalidación sigue P/T. D-01–D-04, AN-01/AN-02 e I-01–I-11 conservan identidad estable, códigos nunca reasignables, membresías independientes, autoridad central específica y permisos locales por agencia. Ejecución técnica no resuelve titularidad ni autoriza por sí misma una recuperación; I-10 y reconciliación limitada conservan sus bloqueos ante incertidumbre, sin reintento automático por nueva autorización.

### Relación conceptual con la matriz canónica y clasificación pendiente

AUT-08 se vincula conceptualmente con las 27 operaciones existentes: las capacidades deben distinguirse en cada operación conforme a su contrato, actor, ámbito y riesgo, sin modificar ni duplicar la matriz canónica o la matriz complementaria de facultades. Tampoco se reproduce o altera la matriz de 14 escenarios. No se asigna ahora una categoría de riesgo o combinación de capacidades a ninguna fila, ni se presume que toda operación requiera aprobación humana. Operaciones automáticas ya autorizadas conservan controles previos sin aprobación humana individual inventada; AUT-08 no ratifica sus mecanismos técnicos pendientes.

Queda PENDIENTE la clasificación individual de las 27 operaciones en ordinarias, sensibles y excepcionales, sus capacidades requeridas, incompatibilidades y controles específicos, preservando las clasificaciones y separaciones ya ratificadas que resulten aplicables. Esa actividad no puede rebajar riesgo para eludir controles ni convertir una facultad pendiente en permiso aprobado. Siguiente actividad documental PROPUESTA: preparar dicha clasificación sobre las referencias canónicas, para revisión PO con distinción expresa de obligaciones ratificadas, propuestas y mecanismos P/T, sin crear otra matriz operativa ni iniciar implementación.

Pendientes conservados: clasificación de las 27 operaciones por riesgo/capacidades; designaciones concretas y concedentes/revocadores de otras familias; procedimiento reforzado para crear administradores con delegación; cantidad mínima obligatoria de autoridades independientes; continuidad extraordinaria; elegibilidad para cambio de código individual; designación y facultades del reconciliador técnico; política restante de reenvío de invitaciones; procedimientos técnicos y pruebas. AUT-01–AUT-07 permanecen RATIFICADAS — alcance funcional, en sus alcances originales; AUT-08 no los reabre ni asigna cargos/personas/proveedores.

REC-F2-001 EN_CURSO; CT-01/CT-02 ABIERTOS; P01–P40 NO EJECUTADAS, subcasos/nueve experimentos NO EJECUTADOS. Contenido anterior, matrices 27/14, decisiones e inventarios íntegros, sin aceptación integral ni cierre técnico. Solo cuatro maestros y sincronización Git MC-07; sin código, migraciones, Supabase/producción/Vercel, infraestructura, secretos, configuración, pruebas de producto o despliegues manuales. Entregar y detenerse para revisión.

## Operaciones 4 y 5 — ratificación PO de solicitud y aprobación de cambio de código, 2026-11-08

Fuente: ratificación funcional expresa del Product Owner del 2026-11-08, mandato «REC-F2-001, ratificación PO de operaciones 4 y 5», base master/5e8e8dfc66cdec9261eff23e6411b236a118a67d. HALLAZGOS conserva rectoría; esta sección contiene la norma única, TASKS continuidad y PLAN dependencias. Cada decisión: **RATIFICADA — ALCANCE FUNCIONAL**. No ratifica clasificación general de riesgos, mecanismos técnicos P/T, implementación ni pruebas.

Correspondencia documental: **PO-REC-F2-001-OP04-01** identifica esta decisión sobre la operación canónica **4 — solicitar cambio de código**; **PO-REC-F2-001-OP05-01** identifica esta decisión sobre la operación canónica **5 — autorizar cambio**. Son identificadores nuevos de decisión, comprobados sin colisión; no nuevas operaciones, tareas, fases o hallazgos. Se conservan AN-01 y «AN-02 — autoridad central sobre códigos» como fundamentos previos, sin reutilizar sus referencias conversacionales ambiguas para identificar estas dos ratificaciones nuevas ni alterar su texto.

### PO-REC-F2-001-OP04-01 — operación 4

**Estado: RATIFICADA — ALCANCE FUNCIONAL.**

1. El titular puede solicitar directamente el cambio mediante autenticación válida.
2. Un coordinador expresamente autorizado puede asistir y tramitar la solicitud.
3. La asistencia requiere consentimiento verificable del titular.
4. La asistencia no concede facultad de aprobación, ejecución, decisión de titularidad ni modificación unilateral.
5. La solicitud no produce automáticamente un cambio de código.
6. Evidencia insuficiente, contradictoria o titularidad ambigua impide la aprobación ordinaria y requiere tratamiento por autoridad competente.

### PO-REC-F2-001-OP05-01 — operación 5

**Estado: RATIFICADA — ALCANCE FUNCIONAL.**

1. El cambio requiere aprobación de autoridad central específicamente facultada.
2. La facultad de registrar reclutadores, asistir solicitudes o designar operadores no concede por sí sola autoridad para aprobar cambios de código.
3. El titular y el coordinador asistente no pueden aprobar administrativamente su propia solicitud o asistencia.
4. La aprobación debe corresponder al sujeto, solicitud, ámbito y condiciones autorizadas.
5. La ejecución posterior permanece separada y limitada conforme a AUT-08.
6. Las designaciones concretas, concedentes/revocadores y separación reforzada específica permanecen pendientes de definición.

### Invariantes y sucesión delimitada

Se preservan código individual único, prohibición permanente de reasignación a otra persona, identidad técnica estable, historial y trazabilidad del cambio, ninguna creación implícita de una identidad distinta y ninguna ampliación de permisos, membresías o facultades por el cambio de código. AN-01/AN-02 mantienen vínculo Auth/perfil estable y prohibición histórica de reasignación; no cambia contraseña, token de referido o atribución por inferencia. D-02 conserva emisión automática bajo reglas centrales; no autoriza cambio autónomo por un servicio o coordinador.

Resuelto funcionalmente el pendiente de elegibilidad de los dos canales en «Cambio de código individual — PROPUESTO/PENDIENTE salvo AN-01/AN-02» y referencias anteriores: solicitud directa autenticada del titular y asistencia de coordinador expresamente autorizado con consentimiento verificable. También queda explícita aprobación central específica, exclusión del titular/coordinador asistente como aprobadores de su propia intervención y separación de ejecución. Los textos históricos y marcas P de las matrices permanecen íntegros, sucedidos solo en estos puntos por las decisiones identificadas; consentimiento, autenticación, facultad, titularidad y aprobación requieren cumplimiento verificable, no una simple declaración ni habilitación técnica por documentar.

AUT-01–AUT-08 conservan su alcance: ejecutar/asistir/registrar/designar no concede aprobar ni delegar esa capacidad; AUT-05 no permite aprobar solicitud propia o asistencia propia ni eludir independencia contractual. No se ratifica aquí una cantidad de revisores ni separación reforzada específica de cambio de código: sigue pendiente, sin eliminar exigencias aplicables por contratos ya ratificados. AUT-02–AUT-04 mantienen dependencia efectiva, bloqueo, preservación de evidencia y restablecimiento expreso; AUT-06/AUT-07 mantienen continuidad ordinaria sin poderes globales o subdelegación inferida. AUT-08 conserva tramitación/verificación/aprobación/ejecución diferenciadas y requisitos del concedente específico.

Referencias canónicas sin duplicación: operación 4 en matriz 27 (solicitud), operación 5 (autorización) y operación 6 (ejecución acotada de comando central). La clasificación general de las 27 operaciones y la asignación individual de riesgos/capacidades siguen pendientes: el análisis conversacional previo no se incorpora como ratificado, ni sus etiquetas Sensible/Alto para 4/5. No se ratifica en bloque la matriz complementaria ni los 14 escenarios P/T. Se enlazan I-01/I-02/M-01 para correspondencia estable y código, I-08/I-09 cuando proceda tratamiento competente de ambigüedad/riesgo, A-08/A-09/A-12 y E1–E7/PO-REC-F2-001-SE-01 para facultades, evidencia y trazabilidad. Insuficiencia exige escalamiento y contradicciones materiales mantienen sus impedimentos; la intervención humana no permite aprobarlas sin resolución.

Pendientes: designaciones concretas, concedentes/revocadores de aprobación y asistencia, separación reforzada específica; procedimiento de consentimiento/autenticación/evidencia, unicidad histórica, concurrencia, idempotencia, ejecución/auditoría y garantías técnicas; clasificación de las 27 operaciones. Otros pendientes AUT-08 permanecen: procedimiento reforzado para crear administradores con delegación, mínimo obligatorio de autoridades independientes, continuidad extraordinaria, designación/facultades del reconciliador, política restante de reenvío, procedimientos de identidad/recuperación y pruebas. No volver a pedir elegir entre los dos canales ya ratificados; diseñar sus condiciones verificables y delimitar autoridades sin concederlas por inferencia. Trazabilidad futura a P26/P33/P39/P40 y subcasos pertinentes existentes, NO EJECUTADAS; sin nuevo caso de prueba.

REC-F2-001 EN_CURSO; CT-01/CT-02 ABIERTOS; AUT-01–AUT-08 RATIFICADAS en su alcance funcional; P01–P40 NO EJECUTADAS y subcasos/nueve experimentos NO EJECUTADOS. Contenido previo y matrices 27/14 íntegros. Operaciones 4/5 no implementadas, probadas ni cerradas por esta ratificación. Solo cuatro maestros y sincronización Git MC-07, sin código, migraciones, servicios/producción/infraestructura, pruebas de producto, despliegues o archivos adicionales. Entregar y detenerse para revisión PO.

## PO-REC-F2-001-OP05-02 — separación proporcional de operación 5, 2026-11-08

**Estado: RATIFICADA — ALCANCE FUNCIONAL.** Fuente: ratificación expresa del Product Owner del 2026-11-08, mandato «REC-F2-001, separación proporcional de operación 5», base master/7d34e2d7f0c5f3fd260abdc711a7c7f9f061cad3. Identificador de decisión nuevo y sin colisión, complemento de **PO-REC-F2-001-OP05-01**, no nueva operación/tarea/fase/hallazgo. HALLAZGOS conserva rectoría; esta sección contiene la norma única, TASKS continuidad y PLAN dependencias. Ratificación exclusivamente funcional, sin implementación o mecanismos P/T aprobados.

### Reglas funcionales ratificadas

1. La solicitud de cambio conserva los canales ratificados en PO-REC-F2-001-OP04-01.
2. La verificación corresponde a autoridad central facultada, con evaluación de titularidad, evidencia, historial y conflictos.
3. La aprobación corresponde exclusivamente a autoridad central con facultad específica.
4. La misma persona puede verificar y aprobar solamente si el caso se admite expresamente como operación ordinaria humana compatible y satisface íntegramente AUT-05.
5. La compatibilidad no permite autoaprobación, beneficio indebido, conflictos de intereses ni ampliación de facultades.
6. La ejecución posterior corresponde a servicio técnico específicamente autorizado, sin facultad decisoria implícita.
7. Evidencia contradictoria, disputa de identidad, conflicto de intereses o sospecha fundada de suplantación impiden la aprobación ordinaria y requieren revisión central reforzada.
8. Se conservan las exigencias contractuales de dos revisores humanos distintos e independientes para los supuestos excepcionales privilegiados o de alto riesgo donde ya son obligatorias.
9. Ningún cambio de código altera la identidad técnica permanente, reasigna códigos a otras personas ni amplía membresías, sesiones o facultades.

### Límites expresos de la decisión

No interpretar esta decisión como:

- Clasificación universal de la operación 5 como ordinaria.
- Autorización para verificar y aprobar cualquier caso con una sola persona.
- Exigencia universal de dos aprobadores.
- Facultad de aprobación derivada de asistencia, tramitación o designación.
- Autorización de mecanismos técnicos, interfaces, algoritmos o procedimientos concretos.
- Designación de personas, concedentes o revocadores.

La clasificación definitiva por supuesto de riesgo y las condiciones operativas específicas siguen pendientes.

### Integración y sucesión delimitada

La operación canónica 4 conserva solicitud directa del titular autenticado y asistencia de coordinador expresamente autorizado con consentimiento verificable conforme OP04-01. OP05-01 mantiene aprobación específica central para sujeto/solicitud/ámbito/condiciones, exclusión del titular y coordinador asistente como aprobadores administrativos de su propia solicitud/asistencia y ejecución separada. OP05-02 precisa el principio de separación proporcional: autoridad central con ambas facultades puede verificar/aprobar solo un caso expresamente admitido como ordinario humano compatible bajo todas las condiciones de AUT-05; no basta llamarlo ordinario o poseer un cargo central. La operación 6 mantiene ejecución por servicio autorizado, limitada al comando aprobado, sin elegir sujeto/código o adjudicar titularidad por decisión propia.

Los pendientes históricos de separación reforzada quedan precisados exclusivamente por las reglas funcionales aquí ratificadas. No se reabre este principio ni se considera resuelta la clasificación por supuestos, condiciones operativas o designaciones. AUT-05/AUT-08 conservan capacidades distintas, facultades expresas/vigentes, evidencia suficiente/pertinente, ausencia de conflicto/interés propio, actuaciones registradas separadamente y revalidación de autoridad/riesgo/evidencia/condiciones al decidir y ejecutar. AUT-01–AUT-04 mantienen techo/dependencias/bloqueo/restablecimiento; AUT-06/AUT-07 no permiten facultad de aprobación por designar, subdelegación implícita ni poder global por continuidad.

Revisión central reforzada ante los impedimentos de la regla 7 no equivale a permiso para aprobar contradicciones o conflictos sin resolver. E1–E7 y PO-REC-F2-001-SE-01 conservan criterios de suficiencia y APROBAR/ESCALAR/RECHAZAR: evidencia insuficiente exige tratamiento competente, contradicciones materiales mantienen impedimentos y la intervención humana no los subsana por sí sola. I-08/I-09 conservan independencia y dos personas distintas facultadas e independientes en los supuestos donde ya son obligatorias; no se prescribe esa cantidad para toda revisión reforzada de cambio de código ni se permite reemplazarla cuando el contrato sí la exige. No rebajar clasificación de riesgo para eludir controles.

AN-01/AN-02 e I-01/I-02/M-01 conservan código único, unicidad histórica y prohibición permanente de reasignación a otra persona, identidad Auth/perfil estable e historial/trazabilidad, sin identidad nueva ni cambios de permisos, membresías, sesiones, facultades, contraseña o referido por inferencia. A-08/A-09/A-12 siguen delimitando autoridad/evidencia/auditoría sin ratificación técnica en bloque. Referencias exclusivas a operaciones 4/5/6 y a los escenarios existentes pertinentes, sin alterar o duplicar matrices 27/14. Trazabilidad futura a P26/P33/P39/P40 para identidad/código y P10–P13/P32, P23/P27 según revisión/independencia/auditoría, todos NO EJECUTADAS; sin prueba nueva ni afirmación de eficacia técnica.

Pendientes conservados: clasificación definitiva de supuestos de operación 5 y clasificación general de las 27 operaciones; condiciones operativas de admisión ordinaria/revisión reforzada y evidencia; designaciones concretas y concedentes/revocadores; procedimientos de autenticación/consentimiento, verificación/aprobación, unicidad histórica, comando/ejecución, concurrencia/idempotencia/auditoría y garantías técnicas; demás pendientes AUT-08 no resueltos. Siguiente revisión PO: delimitar supuestos de riesgo, condiciones admisibles y autoridades concretas conforme al principio ratificado, sin designarlas o aprobar mecanismos por esta sección.

REC-F2-001 EN_CURSO; CT-01/CT-02 ABIERTOS; P01–P40 NO EJECUTADAS, subcasos/nueve experimentos NO EJECUTADOS. AUT-01–AUT-08, OP04-01/OP05-01 y demás decisiones/matrices/inventarios íntegros, sin cierre ni implementación/pruebas de 4/5/6. Solo cuatro maestros y sincronización MC-07; sin archivos adicionales, código, migraciones, Supabase/infraestructura/producción, pruebas de producto o despliegues. Entregar y detenerse para revisión PO.

## PO-REC-F2-001-REX-01 — recuperación excepcional por pérdida de correo y contraseña, 2026-11-08

**Estado: RATIFICADA — ALCANCE FUNCIONAL.** Fuente: ratificación expresa del Product Owner del 2026-11-08, mandato «REC-F2-001, recuperación excepcional por pérdida de correo y contraseña», base master/f9d6e1ec2a7209f74b4835220588336099903210. Identificador documental único sin colisión, no nueva operación/tarea/fase/hallazgo. HALLAZGOS conserva rectoría; esta sección contiene la norma única, TASKS continuidad y PLAN dependencias. Ratificación funcional/normativa, sin implementación ni mecanismos técnicos P/T aprobados.

### Reglas funcionales ratificadas

1. La pérdida conjunta de acceso a contraseña y correo registrado habilita la solicitud de evaluación excepcional, no su aprobación automática.
2. La solicitud puede ser presentada por el titular mediante el canal excepcional que posteriormente se defina.
3. Un coordinador expresamente autorizado puede asistir en la tramitación, sin adquirir facultades de titularidad, aprobación ni ejecución.
4. Ningún coordinador puede sustituir unilateralmente el correo registrado, restablecer credenciales o adjudicar la identidad.
5. La verificación de titularidad y evidencia corresponde a autoridad central específicamente facultada.
6. La aprobación requiere autoridad central competente, evidencia suficiente y separación de funciones conforme al riesgo y los contratos vigentes.
7. La evidencia contradictoria, insuficiente o una disputa de titularidad impiden aprobar hasta que exista resolución competente y evidencia suficiente.
8. Se conserva la independencia de dos revisores humanos distintos en los supuestos excepcionales privilegiados o de alto riesgo donde ya es obligatoria.
9. La ejecución técnica posterior no concede facultad para decidir titularidad ni alterar membresías, permisos o identidad técnica por inferencia.
10. La recuperación completada exige autenticación nueva; no revive sesiones, membresías ni facultades revocadas.

### Integración con operaciones y contratos existentes

Referencias a operaciones canónicas 20–24, sin nuevas filas ni duplicación: 20 conserva asistencia local autorizada y evidencia permitida; 21 conserva exclusivamente la vía ordinaria por correo previamente verificado y no se usa como sustituto de evaluación excepcional cuando se perdieron ambos accesos; 22 evalúa titularidad/evidencia/riesgo mediante central facultada; 23 registra aprobación central independiente conforme al caso; 24 ejecuta técnicamente autorización limitada vigente bajo I-10, sin decidir titularidad ni crear acceso por mera solicitud. El inicio mantiene límites de I-06 y operación 19 por remisión: no prueba titularidad, cambia factores, revoca sesiones o autoriza ejecución por sí solo. No se crea operación 28 ni se reclasifican las 27 operaciones por esta decisión.

I-01/I-02 y M-01 conservan correspondencia de identidad técnica permanente, login y códigos únicos nunca reasignables; I-03/I-04 mantienen continuidad/cierre de sesiones y sus pendientes técnicos; I-05 no permite tratar una edición de contacto como sustitución de factor verificado. I-06/I-07 mantienen solicitud limitada y recuperación ordinaria; I-08/I-09 rigen evaluación/aprobación excepcional, independencia y dos personas distintas facultadas e independientes donde exigidas; I-10 conserva exclusión, autorización limitada de un uso, registro de intentos/resultados y reconciliación; I-11 conserva suspensión/restauración global separadas. Toda recuperación completada, incluida la ordinaria, sigue exigiendo revocar sesiones anteriores y autenticación nueva; esta decisión no reduce esa regla previa ni convierte autorización de recuperación en sesión de negocio.

AUT-01–AUT-04 conservan techo, dependencia efectiva/fuentes independientes, suspensión/bloqueo/preservación y restablecimiento expreso; AUT-05 no habilita eludir separación contractual de procedimientos excepcionales ni reemplazar dos revisores exigidos por una persona. AUT-06/AUT-07 mantienen delegación expresa, continuidad ordinaria y prohibición de crear nuevos concedentes por inferencia; AUT-08 separa tramitación, verificación, aprobación y ejecución. Asistir, registrar, designar o disponer de privilegio técnico no acredita facultad de aprobar recuperación ni acceso privado general. Las capacidades y designaciones concretas siguen pendientes.

E1–E7 y PO-REC-F2-001-SE-01 mantienen su catálogo y criterios funcionales ya ratificados: evidencia proporcional a operación/riesgo; control del correo no basta para titularidad; contradicciones materiales impiden aprobación y evidencia insuficiente exige escalamiento; intervención humana no compensa contradicciones sin resolver. No se reabre ese catálogo: «evidencias admisibles y criterios operativos de suficiencia pendientes» significa fuentes/pruebas concretas y aplicación operativa, no categorías o principios funcionales ya aprobados. Nombre, teléfono, agencia o conocimiento de código individual no habilitan recuperación automática ni adjudicación; no inventar identificación universal, factores, puntuaciones o documentos obligatorios.

Se preservan recuperación ordinaria por correo previamente verificado, activación inicial por invitación, contrato y pendientes propios de cambio autenticado de contraseña en Perfil, suspensión global/sesiones, independencia y prohibición permanente de reutilizar códigos en otra persona. Perder correo anterior con credenciales válidas conserva su política de cambio autenticado y controles proporcionales, sin forzar automáticamente esta vía excepcional. No se aprueban sustitución del correo, prueba de control de nuevo correo, reautenticación o entrega por documentar la recuperación. No credencial provisional elegida por coordinador ni bypass de autenticación por inferencia.

Resultado externo incierto mantiene bloqueo técnico y exclusión; aprobación de titularidad no demuestra terminación Auth ni permite reintento automático. AUT-03 e I-10 conservan evidencia correlacionada/cierre de intentos y autoridad técnica limitada del reconciliador, que no decide titularidad, aprueba recuperación o elige credenciales. Recuperación no retira suspensiones globales/locales ni bloqueos independientes, no reactiva terminales y no amplía permisos/membresías.

### Pendientes y continuidad documental

Permanecen sin ratificar: canal concreto para iniciar recuperación excepcional; evidencias admisibles concretas y criterios operativos de suficiencia dentro de E1–E7/SE-01; designaciones de verificadores/aprobadores; concedentes/revocadores; procedimiento de sustitución segura del correo; prueba de control del nuevo correo; reautenticación y entrega de credenciales; implementación, pruebas y reconciliación de efectos externos inciertos. Se conservan demás pendientes AUT-08, clasificación 27 y decisiones específicas OP04-01/OP05-01/OP05-02, sin reapertura o aprobación técnica.

Siguiente actividad documental PROPUESTA, pendiente de autorización delimitada: delimitar canal excepcional, evidencia operativa y autoridades de evaluación/aprobación, después diseñar sustitución segura de correo/control nuevo y ejecución/entrega/reautenticación con sesiones, incertidumbre y reconciliación; revisión PO e independiente/aceptación documental posteriores. No se inicia el procedimiento por registrar el principio. Referencias a escenarios existentes de recuperación excepcional, ordinaria y reconciliación de la matriz 14; P10–P13/P26/P32/P33, P09/P31 y P14/P29/P30/subcasos, P07/P25/P35/P37 y P23/P27 pertinentes, todos NO EJECUTADAS; sin matriz o prueba nueva.

Contenido anterior, I-01–I-11, AUT-01–AUT-08, demás decisiones, matrices 27/14 e inventarios íntegros. REC-F2-001 EN_CURSO; CT-01/CT-02 ABIERTOS; P01–P40 NO EJECUTADAS, subcasos/nueve experimentos NO EJECUTADOS. Sin implementación, pruebas o cierre; solo cuatro maestros y Git MC-07, sin archivos adicionales, código, Supabase/migraciones/infraestructura/producción o despliegues. Entregar y detenerse para revisión PO.

## PO-REC-F2-001-REX-02 — evidencia proporcional en recuperación excepcional, 2026-11-08

**Estado: RATIFICADA — ALCANCE FUNCIONAL.** Fuente: ratificación expresa del Product Owner del 2026-11-08, mandato «REC-F2-001, evidencia proporcional en recuperación excepcional», base master/80f7c4ff4de5b170f78846c5b002d0d046aa6120. Identificador único sin colisión en familia REX, complemento de PO-REC-F2-001-REX-01 y PO-REC-F2-001-SE-01, sin sustituir sus reglas. HALLAZGOS conserva rectoría; esta sección contiene la norma única, TASKS continuidad y PLAN dependencias. Sin aprobación de procedimientos técnicos, implementación o mecanismos P/T.

### Diez principios funcionales ratificados

1. Evaluación integral y proporcional de evidencias pertinentes.
2. Corroboración independiente cuando corresponda.
3. Identificación oficial no universal ni suficiente por sí sola.
4. Datos históricos como corroboración, no como factor suficiente aislado.
5. Agencia como fuente contextual, nunca adjudicadora unilateral.
6. Control verificado del nuevo correo antes de habilitarlo, sin equivalencia con titularidad.
7. Resolución obligatoria de contradicciones materiales antes de aprobar.
8. Aprobación exclusivamente por autoridad competente, con independencia contractual.
9. Minimización, protección y trazabilidad de datos personales.
10. Rechazo seguro de aprobación ante insuficiencia, sin acceso provisional.

### Límites e interpretación integrada

Evaluación acumulativa significa considerar integralmente las evidencias pertinentes y su corroboración, procedencia, vigencia y contradicciones, sin puntuación automática de identidad, número fijo de documentos o aprobación por simple suma. Varias coincidencias débiles no compensan contradicciones materiales. No identificación oficial universal ni concluyente sola; nombre/teléfono/código/agencia o un dato histórico aislado no habilitan recuperación. Agencia aporta contexto dentro de autoridad/acceso permitidos, no adjudica identidad; coordinador asiste conforme REX-01 sin titularidad, aprobación, ejecución o cambio unilateral de correo. No cargos nuevos, privilegios globales ni facultad por cantidad de información disponible.

El principio 10 deniega la aprobación y cualquier acceso provisional mientras la evidencia sea insuficiente. No convierte insuficiencia por sí sola en fraude o rechazo definitivo del caso: mantiene ESCALAR bajo los criterios ratificados de APROBAR/ESCALAR/RECHAZAR y SE-01, hasta resolución competente y evidencia suficiente. Corroboración independiente no se presume por duplicar datos del mismo origen ni sustituye la independencia contractual de verificadores/aprobadores. Se mantienen dos revisores humanos distintos facultados e independientes en los supuestos excepcionales privilegiados/alto riesgo donde ya son obligatorios; ninguna evidencia o compatibilidad AUT-05 permite omitirlos.

Control verificado del nuevo correo antes de habilitarlo es requisito funcional ratificado, no prueba de titularidad completa ni facultad para sustituir el canal por sí mismo. Las menciones previas de «prueba de control del nuevo correo pendiente» quedan precisadas solo respecto de esta obligación: mecanismo, procedimiento, vínculo seguro con identidad/caso y condiciones de habilitación siguen pendientes. REX-01 mantiene evaluación/aprobación centrales y separación de ejecución; no se aprueba sustitución segura, factor nuevo implícito por recuperar ni un procedimiento de entrega/reautenticación por esta regla. Recuperación ordinaria por correo previamente verificado, activación inicial y cambio autenticado conservan sus contratos.

E1–E7 y SE-01 conservan categorías, límites y proporcionalidad ratificados; admisibilidad de fuentes/pruebas concretas y criterios operativos por supuesto siguen pendientes. I-01/I-02/M-01 preservan correspondencia estable/código nunca reasignable; I-05–I-09 rigen canal/factor, solicitud, ordinaria y excepcional; I-10/I-11 mantienen exclusión, efectos inciertos y suspensión/restauración separadas. Toda recuperación completa conserva revocación de sesiones anteriores y autenticación nueva, sin revivir derechos terminales. Resolver suficiencia/titularidad no demuestra fin de intentos Auth ni libera bloqueo técnico. I-03/I-04 y sus pendientes de sesiones permanecen intactos.

AUT-01–AUT-08 conservan facultades expresas/techo, dependencias/revocación/restablecimiento, separación/independencia, continuidad y capacidades diferenciadas. Tramitación, verificación, aprobación y ejecución no se conceden entre sí ni por nueva evidencia; designaciones/concedentes/revocadores no se asignan. A-12/E5 enlazan minimización/protección/trazabilidad: no autorización de almacenamiento documental, servicio externo, retención, tecnología o acceso privado general. Tratamiento de información sensible, condiciones de acceso/custodia/retención y mecanismos concretos requieren diseño/revisión posteriores, sin datos o documentos reales recabados por esta actividad.

Referencias a operaciones existentes 20–24: asistencia contextual 20, ordinaria 21 preservada, evaluación central 22, aprobación independiente 23 y ejecución limitada 24; operación 26 mantiene reconciliación específica sin decisión de titularidad. Matriz 27 y escenarios 14 existentes, especialmente recuperación excepcional/ambigüedad/reconciliación, se aplican sin copiar o modificar filas. Correspondencia futura con P10–P13/P26/P32/P33 (suficiencia/independencia), P09/P31 (canal/derivados), P23/P27 (privacidad/auditoría), P14/P29/P30/subcasos (incertidumbre), todos NO EJECUTADAS; sin nuevos casos ni prueba de eficacia técnica.

### Pendientes y siguiente actividad

Mantener pendientes: evidencias concretas admisibles por supuesto; criterios operativos de suficiencia y contradicción; designación de verificadores/aprobadores y concedentes/revocadores; canal excepcional; sustitución segura de correo; tratamiento de información sensible; procedimientos técnicos, pruebas y reconciliación. No reabrir categorías E1–E7, los diez principios o SE-01; no se ratifica la aplicación completa de los 14 escenarios ni la clasificación general de las 27 operaciones.

Siguiente actividad documental PROPUESTA, pendiente de autorización delimitada: diseñar sustitución segura del correo en recuperación excepcional, relacionando caso/identidad, aprobación competente, verificación de control del nuevo correo antes de habilitar, invalidación de derivados anteriores, ejecución/entrega/reautenticación y sesiones, con protección de información e incertidumbre. Canal/evidencia/autoridades pendientes son dependencias, no resueltas por proponer esa secuencia. Sin estados, plazos, proveedores, almacenamiento o mecanismos técnicos ratificados por inferencia; revisión PO e independiente posteriores.

Contenido anterior, REX-01/SE-01, AUT-01–AUT-08, demás decisiones/matrices 27/14/inventarios íntegros. REC-F2-001 EN_CURSO; CT-01/CT-02 ABIERTOS; P01–P40 NO EJECUTADAS, subcasos/nueve experimentos NO EJECUTADOS. Solo cuatro maestros y documentación/Git MC-07; sin archivos adicionales, código, migraciones, Supabase/producción/infraestructura, pruebas de producto o despliegues. Entregar y detenerse para revisión PO.

## PO-REC-FASES-01 — fases vigentes y estados de evidencia, 2026-11-08

Fuente rectora: HALLAZGOS, «PO-REC-FASES-01 — decisión rectora de cuatro fases y control de ejecución», mandato expreso PO del 2026-11-08, base master/314a720116c9104c7dcd6cb3c27db4fa81433224. **Estructura de cuatro fases RATIFICADA POR EL PO**, no creada ahora: sustituye para planificación vigente la interpretación de Validación como fase general independiente. La validación sigue siendo actividad y puerta obligatoria verificable/documentada en auditoría, preparación y reparación. No quinta fase ni cambio de IDs existentes; no ratificación integral de versiones 0.1 o mecanismos P/T.

### Definición oficial y puertas conservadas

- **F1 — Auditoría:** diagnóstico del proyecto existente, hallazgos, riesgos, contradicciones, cobertura y evidencia. Mantiene cierre documental condicionado de 2026-11-06 y pendientes transferidos; no auditoría técnica integral concluida ni hallazgos cerrados. Inventario/evidencia/certeza/limitaciones y aceptación documental siguen diferenciados de comprobación externa.
- **F2 — Reparación y estabilización:** comprende, en orden controlado, (1) validación de hallazgos y contratos, (2) contraste con evidencia técnica, (3) preparación y autorización de incrementos, (4) reparación de defectos confirmados, (5) pruebas, regresiones y aceptación. No se omite validación por incluirla en F2; el cierre requiere evidencia pertinente, excepciones/riesgos explícitos y aceptación PO, conforme a criterios existentes por tarea/incremento.
- **F3 — Mejoras:** continuación del desarrollo y evolución funcional según inventario existente y prioridades PO, preservando necesidades multiagencia ratificadas y dependencias. No reclasificar reparación de identidad/seguridad como mejora; AN-80 conserva diferimiento de desarrollo completo de negocio y exigencia de controles en superficies existentes. Mejoras se aceptan individualmente tras puertas de seguridad/calidad pertinentes.
- **F4 — Agentes IA:** desarrollo/integración agentiva bajo puertas de seguridad, autorización, control y calidad; contratos, permisos, privacidad, pruebas adversariales/supervisión y activación gradual según alcance aprobado. Nombrar la fase no autoriza implementar ni habilitar agentes; pilotos/controles requieren evidencia y aceptación propias.

### Estados documentales y técnicos no intercambiables

| Condición | Significado y evidencia necesaria | Lo que no acredita |
|---|---|---|
| Diagnóstico documentado | Observación registrada con fuente, versión, alcance y límites | Confirmación técnica completa o corrección |
| Hallazgo confirmado | Evidencia contrastada; distinguir CONFIRMADO_ESTÁTICAMENTE de CONFIRMADO_POR_PRUEBA | Explotación o presencia efectiva en producción por una lectura local |
| Riesgo potencial | Escenario condicionado/hipótesis con incertidumbre explícita | Defecto reproducido o severidad histórica recuperada |
| Contrato ratificado | Decisión expresa PO identificada con alcance | Mecanismo implementado/probado o facultad concedida a una persona |
| Diseño pendiente de contraste | Propuesta de solución, interfaces/estados o modelo con pendientes P/T | Esquema efectivo, garantía Auth/RLS/Storage o aceptación final |
| Reparación autorizada | Mandato específico con alcance, responsable/revisor, archivos/sistemas, pruebas y reversión | Cambio ya realizado, permiso productivo o autorización de otras correcciones |
| Reparación implementada | Cambio versionado y trazable al mandato | Pruebas satisfactorias o cierre del hallazgo |
| Prueba ejecutada | Resultado esperado/observado, versión/entorno y evidencia reproducible; declarar simulaciones | Cobertura de superficies no probadas o seguridad global |
| Corrección aceptada | Criterios pertinentes cumplidos, riesgos/excepciones registrados, revisión y aceptación competente | Cierre automático de otras tareas o permiso de publicación |

Estos son estados de interpretación/evidencia, no sustituyen el catálogo de estados TASKS ni renumeran hallazgos. Las ratificaciones recientes no constituyen pruebas de producto. Resultados históricos de TCE-004 y pruebas offline de 004 conservan alcance y fecha; no se presentan como repetidos ni suficientes para integración real.

### Puertas de ejecución y continuidad acotada

Las vistas vigentes de siete tareas en TASKS/PLAN, bloques PO-REC-FASES-01, consolidan el estado sin sustituir fichas originales: 001/002 EN_CURSO en diseño/conceptual, 004 EN_CURSO preparación con offline cerrado y aceptación integral pendiente; 003/005/006/007 PENDIENTES. F2 avanza en preparación/validación, sin reparación general aceptada. TCE-004 permanece excepción local EN_VALIDACION y no altera esa conclusión.

Secuencia PROPUESTA, pendiente de autorización delimitada PO: revisión consolidada/acotada de suficiencia 001; puerta laboratorio 004; contraste 002/003/005; preparación de incremento/cobertura 006/007; autorización, implementación y pruebas del incremento. No exige terminar todos los detalles funcionales de recuperación excepcional para avanzar en preparación paralela permitida. 001 preliminar alimenta 002/005; 007 puede planificar antes de finalizar F2; ejecución requiere entorno y dependencias pertinentes. No exigir cierre total de 001 antes de obtener las evidencias de contraste que necesita para cerrarse.

Para revisar suficiencia, usar contratos/matrices/pruebas existentes, distinguir pendientes indispensables de diferibles y resolver o bloquear expresamente operaciones afectadas, sin aceptar superficies inseguras. Aceptar un incremento no equivale a cerrar toda REC-F2-001: su cierre conserva matriz/sesión completas, contraste autorizado, revisión independiente/PO, pruebas y reversión previstas. Pruebas de correcciones aún inexistentes se ejecutan después de implementación autorizada; evidencia de viabilidad/alcance necesaria no se sustituye por mera planificación. No repetir ratificaciones resueltas ni convertir el siguiente detalle de correo en bloqueo universal de toda F2.

Cabeceras/continuidades históricas («Fase activa F1», «F2 no iniciada», «pruebas no ejecutadas», «propuesta pendiente», «siguiente paso») mantienen fecha y alcance; para estado actual prevalecen esta decisión y las vistas consolidadas, con las ratificaciones específicas posteriores a cada antecedente. Se agregan referencias de lectura sin borrar historia. No resolver por este registro discrepancias TCE-003/012, gobernanzas no ratificadas integralmente o evidencia faltante.

CT-01/CT-02 ABIERTOS, REC-F2-001 EN_CURSO; I-01–I-11, AUT-01–AUT-08, D-01–D-04, AN-01/AN-02, OP04/OP05, REX-01/REX-02/SE-01, matrices 27/14 e inventarios/hallazgos preservados. P01–P40/subcasos y nueve experimentos NO EJECUTADOS. Solo documentación/Git MC-07 de cuatro maestros; no código, Supabase/migraciones/infraestructura/despliegues, pruebas de producto, tareas/fases/documentos nuevos o autorización técnica implícita. Entregar y detenerse para revisión PO.
