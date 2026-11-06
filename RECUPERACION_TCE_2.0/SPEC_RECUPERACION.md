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
