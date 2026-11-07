SPEC_RECUPERACION — TuChambaExpress 2.0
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
