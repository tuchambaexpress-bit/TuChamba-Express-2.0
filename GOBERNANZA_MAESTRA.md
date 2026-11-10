# GOBERNANZA_MAESTRA — TuChambaExpress 2.0
**Versión:** 0.1 — propuesta para aprobación del propietario  
**Estado:** BORRADOR; no vigente hasta aprobación expresa  
**Ámbito:** producto, desarrollo, datos, infraestructura, operaciones, proveedores y automatizaciones.

## 1. Propósito y precedencia
TuChambaExpress 2.0 es un sistema existente en producción. El objetivo inmediato es auditarlo, estabilizarlo, concluir mejoras justificadas y preparar su comercialización; después, habilitar autonomía agentiva controlada. No se autoriza reconstruirlo desde cero por conveniencia.

### 1.1 Jerarquía documental

**DEC-REC-005 — aprobación limitada:** el propietario aprobó la estructura documental descrita a continuación. Esta decisión no ratifica íntegramente las versiones 0.1 de las gobernanzas ni de los documentos de recuperación y no autoriza ejecución técnica. Las reglas adicionales incorporadas permanecen como propuesta pendiente de ratificación; las autorizaciones específicas del propietario conservan su alcance propio.

La precedencia interna se aplica por ámbito y conforme a las decisiones y versiones expresamente aprobadas:

1. Legislación y obligaciones aplicables.
2. Decisiones expresas del propietario, dentro de sus facultades y con el alcance autorizado, respetando los controles vigentes y el procedimiento de excepciones o modificación que corresponda.
3. GOBERNANZA_MAESTRA.md, como autoridad documental interna superior del proyecto, subordinada a las obligaciones aplicables y a las decisiones expresas del propietario.
4. GOBERNANZA_IA.md, especializada para inteligencia artificial y sin reducir las restricciones superiores.
5. RECUPERACION_TCE_2.0/SPEC_RECUPERACION.md, para requisitos, fases, restricciones y criterios de aceptación de la recuperación.
6. RECUPERACION_TCE_2.0/PLAN_RECUPERACION.md, para procedimientos y decisiones de ejecución de la recuperación.
7. RECUPERACION_TCE_2.0/TASKS_RECUPERACION.md, para tareas, autorizaciones, avances, evidencias, decisiones, commits y continuidad de la recuperación.
8. spec.md, plan.md y tasks.md de la raíz, como línea base funcional e historial del producto. Sus requisitos vigentes se conservan y no se eliminarán ni sustituirán sin una decisión documentada.

El código, la configuración y las evidencias describen el estado observado; no conceden permisos, no aprueban requisitos y no sustituyen decisiones del propietario. Cuando contradigan un documento, la discrepancia deberá registrarse y resolverse, sin alterar los hechos observados.

La existencia de un documento, su fecha posterior o su declaración de estar firmado, certificado o completo no demuestran por sí solas su aprobación ni su precedencia actual.

### 1.2 Relación entre documentos históricos y de recuperación

La tríada de recuperación dirige el proceso de recuperación dentro del alcance aprobado por DEC-REC-005. La tríada histórica conserva la línea base funcional y el historial del producto; no constituye por sí misma autorización para ejecutar su backlog durante la recuperación.

Los requisitos históricos vigentes del producto no quedan anulados en bloque por la creación de los documentos de recuperación. Su modificación, sustitución o retiro deberá identificarse expresamente mediante una decisión documentada, con referencia al requisito original, la decisión del propietario y la documentación sucesora.

Los documentos históricos solo podrán modificarse mediante autorización explícita y referencias cruzadas. Se conservarán los identificadores originales y su relación con cualquier identificador sucesor; no se reescribirá silenciosamente la historia.

Las expresiones SPEC, PLAN y TASKS deberán indicar la tríada aplicable cuando exista posibilidad de confusión. Durante la recuperación, las referencias al proceso de trabajo corresponderán a SPEC_RECUPERACION.md, PLAN_RECUPERACION.md y TASKS_RECUPERACION.md.

### 1.3 Resolución de contradicciones

Ante una discrepancia entre documentos, instrucciones, código o evidencia:

1. Identificar los documentos y versiones involucrados, las secciones o líneas, el ámbito afectado y la evidencia disponible.
2. Distinguir una contradicción real de una diferencia legítima de alcance o de una decisión histórica expresamente sustituida.
3. Suspender la aceptación y la acción afectadas cuando la discrepancia impida determinar el requisito, el permiso o el criterio de cierre aplicable.
4. Registrar el conflicto y proponer una resolución al propietario, sin ampliar permisos ni modificar hechos o resultados.
5. Obtener una decisión explícita que identifique qué regla prevalece, su alcance, las referencias sustituidas y las actualizaciones autorizadas.
6. Actualizar únicamente los documentos autorizados y verificar su conciliación antes de reanudar la acción afectada o aceptar su cierre.

Si el mandato vigente es de solo lectura, el conflicto y su propuesta se entregarán en la conversación; su incorporación a archivos quedará pendiente de autorización.

Ningún documento inferior habilita incumplir controles superiores. Una excepción o modificación de gobernanza requiere el procedimiento y la aprobación correspondientes; no se presume por una instrucción ambigua.

## 2. Autoridad
El propietario del proyecto (PO) conserva la autoridad para aprobar alcance, prioridades, presupuesto, proveedores, tratamiento de datos, accesos, pruebas, cambios, commits, operaciones sobre Supabase, despliegues, excepciones y cierre de fases.

La identidad del propietario y cualquier delegación deberán quedar identificadas en el registro de autorización o decisión correspondiente. Toda delegación indicará persona, facultades, límites, ámbito y vigencia. Los términos históricos «arquitecto», «administrador», «revisor» o «agente» no confieren facultades del propietario sin delegación expresa.

Proponer, ejecutar, revisar y aceptar son funciones distintas. Una revisión técnica no sustituye la autorización de ejecución; la aceptación de un resultado no autoriza por sí misma un commit, una publicación o un despliegue.

Agentes, colaboradores y herramientas no adquieren autoridad por acceso técnico. Las autorizaciones serán explícitas, específicas y trazables; el silencio no equivale a consentimiento.

Cada autorización identificará, como mínimo: aprobador y facultad con la que actúa, fecha, tarea o decisión relacionada, objetivo, operaciones permitidas, archivos o sistemas afectados, entorno, datos permitidos, límites y condiciones. Se registrarán las exclusiones y la vigencia cuando correspondan.

Una autorización podrá cubrir una tarea o un lote delimitado. Dentro de ese alcance conservará validez mientras no cambien sus condiciones ni sea revocada. No se ampliará por inferencia a otras operaciones o entornos.

La aprobación o ratificación de un documento no autoriza automáticamente la ejecución de todas las actividades que describe.

## 3. Invariantes
1. **Producción protegida:** por defecto, solo lectura. No escribir en base de datos, desplegar, migrar, modificar permisos, enviar mensajes reales ni publicar vacantes sin aprobación concreta.
2. **Preservar lo existente:** documentar comportamiento actual antes de modificar; no eliminar funcionalidades o datos sin análisis de impacto, respaldo y plan de reversión.
3. **Seguridad desde el origen:** mínimos privilegios, aislamiento entre agencias y roles, validación del lado servidor, RLS verificable, secretos fuera de Git y registros sin datos sensibles.
4. **Privacidad:** minimización, finalidad, consentimiento o base legal aplicable, retención definida y mecanismos para atender derechos de titulares. Prohibido utilizar datos reales en pruebas no autorizadas.
5. **Confiabilidad:** cambios pequeños, reproducibles, reversibles y respaldados por pruebas independientes.
6. **Cero fricción y accesibilidad:** experiencia intuitiva, móvil, ligera y transparente; no sacrificar seguridad por conveniencia.
7. **Trazabilidad:** cada decisión, hallazgo, excepción y cambio tiene identificador, responsable, evidencia y estado.
8. **Viabilidad comercial:** priorizar impacto medible en candidatos, reclutadores, coordinadores y operación; evitar alcance inflado.
9. **Observabilidad:** monitorear errores, costos, tiempos de respuesta, disponibilidad y acciones automatizadas sin exponer información personal.
10. **No discriminación:** criterios de selección vinculados al puesto, revisables, con evaluación de sesgos y vías de impugnación.

## 4. Procedimiento obligatorio de cambios
**Solicitud → evidencia del estado actual → análisis de riesgo e impacto → criterios de aceptación en SPEC → diseño en PLAN → tarea en TASKS → autorización → implementación en rama aislada → pruebas → revisión independiente → aprobación de despliegue → monitoreo y cierre.**

Para cada modificación registrar: ID, propósito, archivos/servicios afectados, roles afectados, datos tratados, riesgo, pruebas, plan de reversión, aprobador y resultado. No marcar tareas como terminadas por declaración de una IA: exigir evidencia verificable.

Durante la recuperación, este procedimiento se vinculará expresamente con SPEC_RECUPERACION.md, PLAN_RECUPERACION.md y TASKS_RECUPERACION.md, y con los requisitos históricos del producto que resulten aplicables.

La autorización deberá identificar la operación concreta. Aprobar una propuesta no implica autorizar su implementación; autorizar código no implica autorizar pruebas contra producción, commits, push, merge o despliegues.

La documentación del procedimiento no adelanta fases ni habilita acciones excluidas por el mandato vigente.

## 5. Clases de riesgo y autorizaciones
| Nivel | Ejemplos | Regla |
|---|---|---|
| R0 — lectura | Inventario, análisis estático, documentación propuesta | Permitido dentro del acceso autorizado, sin divulgar datos |
| R1 — cambio aislado | Rama de desarrollo, tests sintéticos | Requiere alcance y entorno aprobados |
| R2 — impacto operativo | Cambios de permisos, integraciones, automatizaciones con efectos reales | Aprobación específica y pruebas previas |
| R3 — crítico | Producción, migraciones, borrado, pagos, decisiones laborales sensibles, comunicaciones masivas | Aprobación expresa por acción o lote delimitado, controles adicionales y reversión cuando sea posible |

### 5.1 Autorización por tipo de operación

La clasificación de riesgo no constituye por sí misma autorización de acceso o ejecución.

| Operación | Autoridad y condición de autorización |
|---|---|
| Auditoría local de solo lectura | El PO o una persona con delegación expresa delimita el repositorio, documentos y operaciones permitidas. No incluye ejecución del proyecto, escritura, acceso a secretos ni servicios externos salvo autorización explícita. |
| Creación o modificación documental | Requiere autorización sobre los archivos y el alcance de edición. Una propuesta presentada en conversación no autoriza escribirla en el repositorio. |
| Cambios de código | Requieren tarea identificada, alcance, criterios de aceptación, entorno o rama autorizados, pruebas previstas y reversión. |
| Pruebas ejecutables | Requieren autorización del tipo de prueba, entorno, datos y efectos permitidos. Las pruebas contra producción o con datos reales requieren autorización específica. |
| Commit | Requiere autorización expresa del PO sobre la tarea o lote delimitado. No habilita push, merge ni despliegue. |
| Push o merge | Requiere autorización expresa que identifique repositorio, ramas y alcance. No habilita por sí mismo un despliegue. |
| Auditoría de Supabase, RLS, funciones, permisos o Storage | Requiere autorización de acceso al entorno, recursos, consultas y datos permitidos, aun cuando sea de solo lectura. |
| Modificación de Supabase, RLS, funciones, permisos o Storage | Requiere autorización específica por acción o lote delimitado, análisis de impacto, validación previa y respaldo o reversión cuando corresponda. |
| Acceso a producción | Requiere autorización específica, incluido el acceso de solo lectura. La regla de protección de producción no concede acceso por defecto. |
| Despliegue | Requiere aprobación expresa del PO o delegado facultado, identificando versión o artefacto, entorno, validaciones, riesgos y reversión. |
| Aceptación y cierre de tarea o hallazgo | Requiere evidencia, criterios de cierre satisfechos y aceptación del PO o delegado expresamente facultado. Una revisión técnica no equivale al cierre. |
| Cierre de fase | Requiere autorización expresa del PO y cumplimiento de la puerta de salida correspondiente. |
| Contención urgente | La detección autoriza elevar una propuesta y preservar evidencia dentro del alcance existente; ejecutar medidas sensibles requiere autorización específica o una política de contención previamente aprobada y aplicable. |

No se interpretará la aprobación de una operación como aprobación de otra. Cuando un flujo automático pueda desencadenar operaciones adicionales, esos efectos deberán estar incluidos expresamente en la autorización.

## 6. Gobernanza de roles
**Candidato/usuario:** acceso a vacantes, postulación, información de su proceso y privacidad.  
**Reclutador:** gestión de candidatos y vacantes asignadas, conforme a su agencia y permisos.  
**Coordinador:** supervisión de vacantes, equipos, pipelines, contrataciones y reportes en su ámbito.  
**Administrador:** gobierno de agencias, cuentas, políticas y operación transversal autorizada.  
Los permisos reales se determinarán auditando código, API y políticas de base de datos; una pantalla no constituye prueba de autorización.

## 7. Autonomía y límites
La automatización debe operar por capacidades específicas, no con credenciales universales. Las tareas reversibles y de bajo riesgo pueden ejecutarse bajo políticas preaprobadas. Las decisiones que afecten derechos, oportunidades laborales, datos sensibles, pagos, bloqueo de cuentas o publicación masiva requieren revisión o reglas explícitas con escalamiento. Toda automatización tendrá límites de volumen, presupuesto, tiempo, alcance, registro, alerta y apagado.

## 8. Auditoría y liberación
Antes de declarar listo para comercialización: inventario de funcionalidades; matriz requisito→código→prueba; revisión de autenticación/autorización y RLS; gestión de secretos; pruebas funcionales por rol; pruebas de recuperación; rendimiento móvil; accesibilidad; privacidad; monitoreo y soporte; plan de incidentes y continuidad. **La existencia de un archivo o checklist marcado no demuestra cumplimiento.**

## 9. Incidentes, excepciones y cambios de gobernanza
Ante posible filtración, acceso indebido o comportamiento agentivo fuera de límites: detener acciones, preservar evidencias sin exponer secretos, evaluar alcance, contener y escalar al PO. Las excepciones requieren motivo, alcance, duración, compensaciones, aprobador y fecha de caducidad. Cambios a esta gobernanza requieren versión, diff, justificación y aprobación expresa; nunca modificación silenciosa.

## 10. Pendientes de ratificación
Confirmar identidad y facultades de aprobadores, infraestructura real, responsables legales, políticas de retención, SLAs, presupuesto, umbrales de riesgo y procedimiento de despliegue. No presumir que la documentación histórica describe producción actual.

La ratificación deberá identificar la versión y el alcance aprobados, el propietario que aprueba, la fecha de vigencia, las reservas o excepciones y la decisión documental que la sustenta. La incorporación de una decisión puntual no ratifica automáticamente el resto de esta gobernanza ni los demás documentos.


## 11. GOV-SIMPLE-01 — sencillez, eficiencia y profesionalismo

**RATIFICADA POR EL PRODUCT OWNER. Incorporación puntual, versión 1.** Fuente: mandato expreso «GOV-SIMPLE-01: simplificación operativa y continuidad de I-05B», sesión de incorporación sobre develop/tce2-recuperacion, base d0eb9b87b5ff3aaf4832c99c59b75b744ab4a273. Esta sección es la norma general única; complementa el procedimiento de cambios y las clases de riesgo de las secciones 4 y 5, sin ratificar íntegramente el borrador 0.1. Justificación: evitar repetición de diagnósticos e infraestructura sin evidencia material adicional; impacto: seleccionar controles según riesgo concreto, conservando autorización, trazabilidad y protección de producción.

**Principio: la complejidad de cada control debe ser proporcional al riesgo concreto que mitiga.**

1. Utilizar primero herramientas y pruebas existentes.
2. No construir infraestructura adicional si un procedimiento más sencillo ofrece evidencia suficiente para el objetivo autorizado.
3. No repetir auditorías o diagnósticos sin una causa técnica nueva. Revalidar solo hechos susceptibles de cambio que afecten la siguiente operación; reutilizar evidencia anterior con versión, alcance y límites.
4. Distinguir controles indispensables, recomendables y opcionales. Un control recomendable u opcional no se convierte en bloqueo por el solo hecho de poder añadirse.
5. Exigir justificación del riesgo antes de introducir controles complejos.
6. Priorizar actividades que permitan cerrar tareas reales del PLAN/TASKS, sin anticipar aceptación ni omitir criterios de cierre.
7. Mantener evidencia verificable, criterios PASS/FAIL y trazabilidad.
8. No confundir simplicidad con ausencia de seguridad.
9. No exigir aislamiento avanzado por defecto a pruebas locales conocidas y revisadas.
10. Exigir aislamiento reforzado cuando existan riesgos concretos de acceso a producción, secretos, escrituras peligrosas o ejecución de código no confiable.

Para cualquier control adicional significativo, registrar brevemente: riesgo mitigado; evidencia que lo justifica; alternativa más sencilla; costo y complejidad añadidos; riesgo residual; decisión y autorización correspondiente. Una justificación breve es suficiente cuando permite evaluar esos puntos; no crear matrices extensas por rutina.

Permanecen las facultades PO y autorizaciones por operación de las secciones 2 y 5.1, los invariantes de la sección 3, revisión independiente, MC-01–MC-07 y puerta §12 de GOBERNANZA_IA, metodología Regla → Contraejemplo → Riesgo → Invariante → Control → Prueba y GIT-DEPLOY-01. Simplificar no concede permisos, elimina evidencia ni habilita producción como laboratorio. Riesgo concreto no mitigado exige informar y detener la operación afectada conforme MC-05; la mera posibilidad abstracta no justifica por sí sola construir infraestructura.
