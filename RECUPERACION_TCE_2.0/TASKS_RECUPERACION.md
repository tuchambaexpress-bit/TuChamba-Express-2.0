Versión: 0.1
Estado: Propuesta pendiente de aprobación del propietario
Estado F1: CERRADA DOCUMENTALMENTE CON CONDICIONES. F2: REC-F2-001 EN_CURSO, solo análisis y diseño; implementación NO INICIADA.
Documento de requisitos: SPEC_RECUPERACION.md
Documento de ejecución: PLAN_RECUPERACION.md
Registrar y controlar todas las actividades del Plan de Recuperación de TuChambaExpress 2.0, garantizando trazabilidad entre requisitos, tareas, hallazgos, evidencias, decisiones y commits.

Este documento deberá actualizarse durante la ejecución y obligatoriamente al terminar cada tarea.

Una tarea no podrá declararse cerrada únicamente porque un agente de IA afirme haberla completado.
1. Toda tarea tendrá un ID permanente REC-<FASE>-<NNN>.
2. Ninguna tarea se ejecutará sin alcance y autorización definidos.
3. Cada tarea tendrá estado, responsable, evidencia y criterio de cierre.
4. Los avances, bloqueos y decisiones se registrarán al producirse.
5. Al finalizar una tarea se actualizarán sus resultados, pruebas y documentación relacionada.
6. Cada commit deberá quedar vinculado a una tarea.
7. Ningún hallazgo se eliminará del historial.
8. Los cambios de requisitos actualizarán SPEC.
9. Los cambios de procedimiento actualizarán PLAN.
10. Las tareas cerradas requerirán evidencia y aceptación.
11. Los cambios no autorizados obligarán a detener la ejecución.
12. Al cerrar cada sesión se actualizará el punto de continuidad.
- PENDIENTE: tarea definida sin iniciar.
- EN_CURSO: actividad autorizada y en ejecución.
- BLOQUEADA: no puede continuar hasta resolver una dependencia.
- EN_VALIDACION: ejecución concluida, evidencia o aceptación pendiente.
- CERRADA: criterios cumplidos y aceptación registrada.
- CANCELADA: cancelación justificada y autorizada.
Las tareas de F2, F3 y F4 se desglosarán cuando existan entradas suficientes y autorización del propietario. No se considerarán iniciadas por anticipado.
La auditoría estática local identificó 17 hallazgos con identificadores TCE-001 a TCE-017.

Se conserva su clasificación inicial:
Estas clasificaciones no demuestran explotación ni presencia efectiva en producción.
- Estado:
- Responsable:
- Autorización:
- Requisito SPEC:
- Procedimiento PLAN:
- Hallazgos relacionados:
- Objetivo:
- Alcance:
- Exclusiones:
- Dependencias:
- Riesgos:
- Archivos o sistemas afectados:
- Criterios de aceptación:
- Pruebas previstas:
- Evidencia obtenida:
- Pruebas ejecutadas:
- Pruebas no ejecutadas:
- Resultados:
- Desviaciones:
- Commits asociados:
- Decisión de cierre:
- Siguiente paso:
El registro se actualizará después de cada commit autorizado. Los hashes definitivos no se anticiparán.
## Registro de decisión — DEC-REC-005

- Fecha de registro: 2026-11-05.
- Autoridad: propietario del proyecto (PO), mediante instrucción expresa en la conversación «TuChambaExpress 2.0 — Integración documental DEC-REC-005».
- Estado de la decisión: estructura documental aprobada; no ratificación íntegra de versiones 0.1.
- Actividad relacionada: REC-F1-001.
- Fuente de autorización de escritura: autorización limitada de la misma instrucción, independiente de la aprobación de estructura.
- Alcance autorizado de escritura: GOBERNANZA_MAESTRA.md, GOBERNANZA_IA.md y RECUPERACION_TCE_2.0/TASKS_RECUPERACION.md.
- Restricciones: sin cambios de código, SPEC, PLAN o documentos históricos; sin pruebas del producto, commits, sincronizaciones, cambios de rama, servicios externos, Supabase o producción.

Texto de la decisión aprobada por el propietario:

> La Gobernanza Maestra será la autoridad documental interna superior del proyecto, subordinada a las obligaciones aplicables y a las decisiones expresas del propietario.
>
> La Gobernanza IA regulará específicamente el comportamiento, permisos y límites de los agentes, sin reducir las restricciones superiores.
>
> SPEC, PLAN y TASKS de recuperación dirigirán el proceso de recuperación.
>
> SPEC, PLAN y TASKS históricos se conservarán como línea base funcional e historial del producto. Sus requisitos vigentes no se eliminarán ni sustituirán sin una decisión documentada.
>
> Esta decisión aprueba la estructura documental, pero NO ratifica íntegramente las versiones 0.1 ni autoriza ejecución técnica.

## REC-F1-001 — Integración documental de DEC-REC-005

- Estado: EN_VALIDACION.
- Responsable de ejecución: Codex, bajo la autorización limitada del PO.
- Responsable de validación y aceptación: PO; aceptación de la integración pendiente.
- Autorización: instrucción expresa del PO para integrar GM-A a GM-E y GI-A a GI-D y registrar esta actividad exclusivamente en los tres archivos autorizados.
- Requisito SPEC: SPEC_RECUPERACION.md, R-DOC-001 a R-DOC-010 y criterios de aceptación por tarea; sin modificación de SPEC.
- Procedimiento PLAN: PLAN_RECUPERACION.md, actividades de contraste documental de F1, ciclo Preparación/Ejecución/Validación/Cierre y autorización de commits; sin modificación de PLAN.
- Hallazgos relacionados: GOV-REC-001 y GOV-REC-002.
- Objetivo: incorporar la jerarquía aprobada y precisar autoridad, autorizaciones y resolución de contradicciones, sin declarar cerrados los hallazgos.
- Estado anterior: ambas gobernanzas en versión 0.1, BORRADOR; referencias genéricas a SPEC/PLAN/TASKS, sin separación explícita entre tríadas ni matriz por operación. TASKS contenía la plantilla y continuidad de su creación, sin este registro.
- Alcance: reemplazos e inserciones GM-A, GM-B, GM-C, GM-D, GM-E, GI-A, GI-B, GI-C y GI-D; registro de DEC-REC-005, actividad, evidencia y continuidad.
- Exclusiones: todo archivo distinto de los tres autorizados y toda ejecución técnica o acción externa prohibida por el mandato.
- Dependencias: decisión y autorización expresas del PO recibidas; validación y aceptación posteriores todavía pendientes.
- Riesgos: confundir estructura aprobada con ratificación integral; anular requisitos históricos por omisión; ampliar permisos; perder contenido no afectado.
- Archivos afectados: GOBERNANZA_MAESTRA.md, GOBERNANZA_IA.md y RECUPERACION_TCE_2.0/TASKS_RECUPERACION.md.
- Criterios de aceptación: integrar los nueve bloques compatibles con DEC-REC-005; conservar contenido no afectado, versión 0.1 y BORRADOR; registrar autorización y SIN_COMMIT; mantener ambos hallazgos pendientes de validación y aceptación; comprobar alcance y estado Git; entregar diff al PO. La aceptación final corresponde al PO.
- Verificaciones previstas: lectura y comparación textual con la línea base; comprobación de anclas y referencias; contraste semántico con DEC-REC-005; comparación SHA-256 de los cinco documentos protegidos; estado Git inicial y final.
- Evidencia inicial EVD-REC-F1-001-A: lectura numerada de los tres archivos y verificación de anclas; GM con 56 líneas, GI con 56 y TASKS con 82. Rama master, HEAD 94e3af763112afc7408e30d89b53868cc645fb86; cinco archivos no rastreados preexistentes y ningún cambio rastreado.
- Evidencia de línea base EVD-REC-F1-001-B: contenidos previos conservados en memoria para comparación y diff; huellas SHA-256 iniciales: GM 182358053C9D605E096D9101B0B9A0E3B9B059AB25160DED0F9A3CDE10FD5EBE; GI C7E1FAA18D6119639ACC6D5EDC7673C3EAB0817422483BBAFE06B28C4E1368FE; TASKS 4991A84D3F8094C016A61E83DAD912307A5501DA49C0A2995AB62090BC2ECF40.
- Pruebas ejecutadas: ninguna prueba del producto.
- Pruebas no ejecutadas: todas las pruebas ejecutables del producto, por restricción expresa. La validación prevista es documental.
- Evidencia final EVD-REC-F1-001-C: comparación íntegra de GM y GI con los nueve bloques preparados; contenido no afectado conservado, versión 0.1 y BORRADOR presentes; referencias a secciones 1, 2, 5 y 1.3 verificadas. Contraste con DEC-REC-005: GM subordinada a obligaciones y decisiones del PO; GI especializada sin reducir restricciones; recuperación dirige su proceso; requisitos históricos vigentes preservados; sin ratificación integral ni autorización técnica.
- Evidencia de alcance EVD-REC-F1-001-D: SHA-256 de spec.md, plan.md, tasks.md, SPEC_RECUPERACION.md y PLAN_RECUPERACION.md coincide con la línea base. Git mantiene master y HEAD 94e3af763112afc7408e30d89b53868cc645fb86, sin diferencias rastreadas ni staging y con los mismos cinco archivos no rastreados.
- Evidencia de cambios EVD-REC-F1-001-E: diff textual de los tres archivos contra sus contenidos al inicio, conservados en memoria para producir el informe de esta actividad. Los archivos ya eran no rastreados; el diff ordinario de Git no muestra estas ediciones.
- Resultados: integración de los nueve bloques completada y comparación documental realizada; no se identificaron contradicciones nuevas en el ámbito editado. Esta comprobación no sustituye la validación y aceptación del PO ni resuelve otros hallazgos documentales.
- Desviaciones de la propuesta: GM-A precisa que los requisitos históricos vigentes se conservan salvo decisión documentada, sin exigir nueva ratificación individual. GM-A y GI-A explicitan la aprobación limitada de DEC-REC-005 y distinguen las reglas adicionales pendientes de ratificación. GI-C precisa «por iniciativa propia» en la prohibición de modificar gobernanzas, para preservar la posibilidad de ediciones expresamente autorizadas y su coherencia con la regla universal 8 de GI. No se cambia el estado de las versiones 0.1.
- Incidencia de edición: un parche de actualización de TASKS no encontró un ancla de línea y fue rechazado sin cambios; se comprobó el contenido íntegro antes de aplicar correctamente la actualización. Sin pérdida de información ni ampliación de alcance.
- Reversión propuesta: previa autorización, revertir exclusivamente los reemplazos e inserciones de esta actividad con la línea base y el diff; preservar el historial de DEC-REC-005 y registrar cualquier decisión sucesora. No usar restablecimientos generales de Git, especialmente al tratarse de archivos no rastreados.
- Commits asociados: SIN_COMMIT; commits no autorizados.
- Decisión de cierre: NO CERRADA. Integración ejecutada; actividad y GOV-REC-001/GOV-REC-002 pendientes de validación y aceptación del PO. DEC-REC-005 no ratifica íntegramente las versiones 0.1.
- Siguiente paso autorizado: entregar resumen, diff y estado Git final; detenerse. Nuevas ediciones o ejecución técnica requieren instrucciones del PO.

### Seguimiento de hallazgos relacionados

| Hallazgo | Estado de trabajo | Validación | Aceptación | Cierre |
|---|---|---|---|---|
| GOV-REC-001 | EN_VALIDACION | Integración documental realizada; validación pendiente del PO | Pendiente del PO | No cerrado |
| GOV-REC-002 | EN_VALIDACION | Autoridad y matriz incorporadas; validación pendiente del PO | Pendiente del PO | No cerrado |

Último estado conocido:
- Fecha de actualización: 2026-11-05.
- Última tarea: REC-F1-001 — Integración documental DEC-REC-005.
- Estado real: EN_VALIDACION; aceptación del PO pendiente.
- Decisión: DEC-REC-005 aprobada exclusivamente en su estructura documental; no ratificación integral ni autorización técnica.
- Evidencias obtenidas: EVD-REC-F1-001-A a EVD-REC-F1-001-E, registradas en esta tarea; diff contra la línea base inicial.
- Decisiones pendientes: validación y aceptación de la integración por el PO; GOV-REC-001 y GOV-REC-002 no cerrados.
- Bloqueos: ninguno para la integración autorizada; cierre administrativo pendiente de aceptación.
- Rama local: master.
- HEAD: 94e3af763112afc7408e30d89b53868cc645fb86.
- Archivos no rastreados: GOBERNANZA_MAESTRA.md, GOBERNANZA_IA.md, RECUPERACION_TCE_2.0/SPEC_RECUPERACION.md, RECUPERACION_TCE_2.0/PLAN_RECUPERACION.md y RECUPERACION_TCE_2.0/TASKS_RECUPERACION.md.
- Auditoría estática inicial: realizada.
- Informe: 17 hallazgos preliminares.
- Reparaciones: ninguna autorizada.
- Despliegues: ninguno autorizado.
- Gobernanzas: versión 0.1, BORRADOR; ratificación integral pendiente. Estructura documental aprobada mediante DEC-REC-005.
- SPEC, PLAN y TASKS de recuperación: versión 0.1, pendientes de aprobación del propietario.
- TASKS_RECUPERACION.md: creado y verificado; archivo no rastreado.
- Cambios de esta tarea: GOBERNANZA_MAESTRA.md, GOBERNANZA_IA.md y RECUPERACION_TCE_2.0/TASKS_RECUPERACION.md; sin cambios en código, SPEC, PLAN ni documentos históricos.
- Pruebas del proyecto: no ejecutadas, conforme al alcance autorizado; verificaciones documentales y Git realizadas.
- Commits asociados: SIN_COMMIT; no autorizados.
Próximo paso autorizado: informar el resultado y detenerse; nuevas actividades pendientes de instrucciones del propietario.
Antes de abandonar una sesión, actualizar este documento con:
- Tarea activa y estado.
- Evidencias obtenidas.
- Hallazgos nuevos.
- Decisiones pendientes.
- Bloqueos.
- Archivos modificados.
- Rama y HEAD.
- Estado Git.
- Próximo paso autorizado.
Si falta evidencia, el estado deberá reflejarlo. No se inventarán resultados para completar el registro.


## REC-F1-002 — Integración documental de hallazgos e índice de evidencias

- Fecha: 2026-11-05.
- Estado: EN_VALIDACION; aceptación del PO pendiente.
- Responsable de ejecución: Codex; responsable de validación y aceptación: PO.
- Disponibilidad del ID: búsqueda local previa sin registro de REC-F1-002; REC-F1-001 conserva exclusivamente la integración documental DEC-REC-005.
- Autorización: instrucción expresa del PO «TuChambaExpress 2.0 — Integración documental de hallazgos»; crear únicamente HALLAZGOS_RECUPERACION.md e INDICE_EVIDENCIAS.md y modificar únicamente TASKS_RECUPERACION.md, dentro de RECUPERACION_TCE_2.0.
- Objetivo y alcance: registrar 33 fichas preliminares y el índice de soportes disponibles o ausentes; preservar procedencia, incertidumbre e historial, sin repetir la auditoría.
- Estado anterior: dos archivos nuevos inexistentes; TASKS, dos gobernanzas y SPEC/PLAN de recuperación no rastreados; rama master, HEAD 94e3af763112afc7408e30d89b53868cc645fb86, sin cambios rastreados ni staging.
- Exclusiones: código, documentos históricos, SPEC, PLAN, gobernanzas, auditoría técnica, pruebas del producto, correcciones, producción, servicios externos y operaciones de sincronización o commit.
- Archivos creados: RECUPERACION_TCE_2.0/HALLAZGOS_RECUPERACION.md; RECUPERACION_TCE_2.0/INDICE_EVIDENCIAS.md.
- Archivo modificado: RECUPERACION_TCE_2.0/TASKS_RECUPERACION.md; adición al final, sin alterar el contenido previo.
- Hallazgos relacionados: TCE-001 a TCE-017 y GOV-REC-001 a GOV-REC-016, solo para registro; GOV-REC-001/002 mantienen EN_VALIDACION.
- Requisitos SPEC: R-DOC-001, R-DOC-003, R-DOC-004, R-DOC-007, R-DOC-008, R-DOC-010; secciones 4 y 5. SPEC no modificado.
- Procedimientos PLAN: consolidación F1, contraste documental; ciclo Preparación/Ejecución/Validación/Cierre; registro de hallazgos y continuidad. PLAN no modificado.
- Dependencias y riesgos: informes originales y soportes históricos no localizados; no equiparar narración con prueba ni ausencia con falsedad. Evitar atribuir severidades o estados individuales por inferencia.
- Criterios de aceptación documental: 17 fichas TCE y 16 GOV únicas; campos solicitados presentes; referencias con destino o ausencia explícita; registro anterior íntegro; cambios limitados a tres archivos; revisión del PO pendiente.
- Evidencias realmente obtenidas: lectura de TASKS, existencia inicial de destinos, búsqueda del ID, hashes iniciales de ocho documentos; conteo y unicidad de fichas, referencias locales y comparación posterior del contenido previo y documentos protegidos. Resultados detallados en la entrega de esta sesión; sin nuevos IDs EVD permanentes.
- Resultados de comprobaciones documentales: 17 fichas TCE y 16 GOV, 33 IDs únicos; destinos locales existentes y ausencias declaradas; prefijo previo íntegro de TASKS, incluidos REC-F1-001 y DEC-REC-005; siete documentos protegidos sin cambios por SHA-256.
- Pruebas ejecutadas del producto: ninguna. Comprobaciones de archivos y documentos únicamente.
- Pruebas no ejecutadas: todas las pruebas funcionales, seguridad, regresión, integridad y producción; no autorizadas.
- Limitaciones: no recuperados los informes completos ni soportes originales A–E; los hashes no recuperan contenidos. No se valida técnicamente ningún hallazgo ni se cierra F1.
- Reversión propuesta: solo con autorización, retirar exclusivamente las adiciones de esta tarea y preservar su historial; no borrar ni sobrescribir evidencias ni utilizar restablecimientos generales.
- Commits asociados: SIN_COMMIT; no autorizados.
- Decisión de cierre: NO CERRADA; tarea EN_VALIDACION y hallazgos sin cierres nuevos.
- Siguiente paso sujeto a validación del PO: revisar fichas, procedencia y vacíos; autorizar recuperación y custodia de informes originales. Ninguna actividad adicional queda autorizada por este registro.

- Actualización documental 2026-11-05, autorizada por el PO en «Recuperación de descripciones de los 33 hallazgos»: incorporados sus 33 resúmenes como RECONSTRUCCIÓN DOCUMENTAL en HALLAZGOS_RECUPERACION.md; fuente: Resumen de antecedentes conversacionales proporcionado por el PO; informe original no localizado. Descripciones originales literales y soportes siguen pendientes. Se conservan estados, evidencias, GOV-REC-001/002 y DEC-REC-005; INDICE_EVIDENCIAS.md intacto. Solo HALLAZGOS y TASKS modificados. Comprobación mínima: 33 fichas únicas y 33 descripciones reconstruidas; sin repetir verificaciones de REC-F1-002, auditoría ni pruebas del producto. REC-F1-002 permanece EN_VALIDACION y SIN_COMMIT; aceptación pendiente del PO. Próximo paso: informar y detenerse, sin nuevas tareas ni IDs.

## Punto de continuidad — instantánea histórica de REC-F1-002

La instantánea «Último estado conocido» anterior se conserva como historial de REC-F1-001; este bloque es el punto vigente y no modifica aquella tarea ni DEC-REC-005.

- Fecha: 2026-11-05.
- Última tarea: REC-F1-002; EN_VALIDACION, aceptación pendiente del PO.
- Rama: master.
- HEAD: 94e3af763112afc7408e30d89b53868cc645fb86.
- Estado Git: sin diferencias rastreadas ni staging; siete archivos no rastreados: GOBERNANZA_IA.md, GOBERNANZA_MAESTRA.md y, en RECUPERACION_TCE_2.0, SPEC_RECUPERACION.md, PLAN_RECUPERACION.md, TASKS_RECUPERACION.md, HALLAZGOS_RECUPERACION.md e INDICE_EVIDENCIAS.md.
- Archivos de esta tarea: dos creados y TASKS ampliado; ninguno fuera del alcance.
- Evidencia y hallazgos: 33 fichas registradas con vacíos explícitos; A–E indexadas sin inventar soportes; no se asignan nuevos hallazgos ni se cierran los existentes.
- Decisiones pendientes y bloqueos: aceptación documental del PO, recuperación de informes y soportes originales, decisión de custodia; auditoría formal F1 no declarada concluida.
- Pruebas del producto: no ejecutadas. SIN_COMMIT.
- Próximo paso: entregar resumen, comparación verificable y estado Git; detenerse. Recuperación, validación o cambios posteriores requieren autorización.

## Punto de continuidad — instantánea histórica del registro TCE-007/TCE-008

- Fecha: 2026-11-06. Fuente de autorización: instrucción expresa del PO «Registrar TCE-007 y continuar F1»; solo actualización de apartados documentales existentes y diagnóstico dirigido TCE-008.
- Registro relacionado: REC-F1-002, únicamente como conservación documental de la ficha; su EN_VALIDACION y aceptación pendiente no cambian. No se inicia una tarea de reparación.
- TCE-007: CONFIRMADO_ESTÁTICAMENTE, sin prueba de producción; login por código y localStorage sin sesión verificable; reestructuración del ciclo de identidad necesaria. Ficha EN_ANALISIS, no cerrada.
- Aprobado: experiencia código individual + contraseña, alta y recuperación por coordinador autorizado. Propuesto: credencial temporal y cambio inicial, Supabase Auth sujeto a compatibilidad sin correo obligatorio, Turnstile y límites de intentos. Exigir autorización por identidad, recurso y agencia.
- Dependencias: TCE-005; posibles TCE-008/TCE-009. Implementación diferida a F2, no F3; sin autorización para cambiar esquema, RLS o producción.
- Archivos documentales afectados: HALLAZGOS_RECUPERACION.md, SPEC_RECUPERACION.md, PLAN_RECUPERACION.md y TASKS_RECUPERACION.md. Versiones 0.1 pendientes de aprobación integral; decisiones técnicas pendientes no ratificadas.
- Rama master; HEAD a26775d54c1374666ed2890ddd032e5c9f563e81. Estado inicial limpio. SIN_COMMIT para esta actualización; no autorizado.
- Siguiente paso de esta instrucción: diagnóstico dirigido de consultas de postulaciones/chats por teléfono TCE-008 y entrega en conversación; sin código, pruebas destructivas ni servicios externos. Detenerse tras el informe.
- Resultado del diagnóstico TCE-008 (2026-11-06): confirmado en código el uso de teléfono y chatId controlados por navegador sin verificación de identidad en el flujo; acceso efectivo a datos ajenos condicionado por RLS no consultada. app/api/postular/route.ts:5–9 usa cliente anónimo; 38–52 valida presencia/longitud y busca candidato por teléfono; 70–91 devuelve chatId y etapa de postulación existente sin prueba de posesión. components/candidato/ChatModal.tsx:111–133 consulta etapa por teléfono y abre chatId del almacenamiento; ChatWindow.tsx:72–86 consulta mensajes/estado por chatId. Dependencia conceptual con TCE-007 (identidad verificable del reclutador) y posible punto compartido con TCE-009 (mismo POST recibe atribución/precalificación). No se amplió la auditoría a TCE-009 ni se comprobó explotación o producción. Informe entregado en conversación; sin pruebas ejecutables.
- Estado de cierre de esta sesión: cuatro documentos de recuperación modificados, staging vacío; ningún archivo de producto, pruebas ni TCE-004 modificado. SIN_COMMIT. Próximo paso: revisión del PO y nueva autorización para continuar; F1 y hallazgos permanecen abiertos.

## Punto de continuidad — instantánea histórica del diagnóstico TCE-009

- Fecha: 2026-11-06. Autorización: instrucción del PO «conservar el diagnóstico TCE-007/TCE-008 y avanzar a TCE-009»; F1 exclusivamente diagnóstica.
- Commit documental autorizado y realizado: 8bcea01e52449ca600e360b87b04eeefe7d63e4f, mensaje docs(recovery): record TCE-007 decisions and TCE-008 diagnosis; padre a26775d54c1374666ed2890ddd032e5c9f563e81. Alcance: HALLAZGOS, SPEC, PLAN y TASKS de recuperación, 42 inserciones y 5 eliminaciones. Diff revisado, sin código ni cambios ajenos y git diff --check aprobado; sin pruebas de producto. Sin push ni despliegue. Los SIN_COMMIT anteriores se conservan como estados históricos, no como descripción del commit actual.
- Diagnóstico TCE-009: ausencia confirmada estáticamente de validación de atribución y cálculo servidor de precalificación; persistencia efectiva condicionada por RLS no consultada. Evidencia y límites en HALLAZGOS_RECUPERACION.md, ficha TCE-009; EN_ANALISIS, no cerrado. No se modifica la ficha TCE-007 ni se inicia reparación.
- Controles observados: agencia derivada de vacante, duplicado existente candidato-vacante, fallback maestro activo. Faltan sesión/relaciones activas y evaluación de precalificación; referido público no es autenticación. Camino manual usa sesion.id del navegador y requiere autorización real, no solo selector filtrado.
- Dependencias TCE-007 y TCE-008; reparación mínima propuesta para F2, no F3. Requisitos y procedimiento propuestos vinculados en SPEC/PLAN; R-DOC-003/004/007/008/010 para trazabilidad. REC-F1-002 se conserva como registro documental, no como tarea de implementación ni nueva autorización de reparación.
- Archivos modificados después del commit: HALLAZGOS_RECUPERACION.md, SPEC_RECUPERACION.md, PLAN_RECUPERACION.md y TASKS_RECUPERACION.md. SIN_COMMIT para TCE-009 y esta conciliación del hash; segundo commit no autorizado.
- Rama master, HEAD 8bcea01e52449ca600e360b87b04eeefe7d63e4f; estado posterior al commit limpio, al finalizar cuatro documentos modificados y staging vacío. Producto, TCE-004 y documentos históricos intactos; ningún archivo nuevo.
- No se ejecutaron pruebas, migraciones ni accesos a Supabase/Vercel/producción; solo lectura de código y comprobaciones documentales. Pendientes: RLS real, impacto efectivo, política de atribución/fallback y aceptación del PO; informes originales siguen pendientes.
- Próximo paso: entregar diagnóstico y detenerse. No iniciar TCE-010 ni realizar otro commit sin autorización; F1 y hallazgos permanecen abiertos.

## Punto de continuidad — instantánea histórica del diagnóstico TCE-010

- Fecha: 2026-11-06. Autorización: instrucción del PO «Continuar auditoría F1 / TCE-010»; diagnóstico de comisiones y registro en documentos existentes, sin reparación.
- Inicio: master, HEAD 8bcea01e52449ca600e360b87b04eeefe7d63e4f; únicos cambios pendientes: HALLAZGOS, SPEC, PLAN y TASKS de recuperación correspondientes a TCE-009. Se preservan; no se descartan ni se incluyen en commit.
- Resultado TCE-010: CONFIRMADO_ESTÁTICAMENTE el corte por escrituras independientes, falta de manejo completo de errores y ausencia de idempotencia visible; escenarios de inconsistencia condicionados por esquema, triggers, restricciones y RLS no consultados. Ficha EN_ANALISIS, no cerrada; evidencia y límites en HALLAZGOS_RECUPERACION.md, TCE-010.
- Eventos: comisión fijada en Inducción; firma de Contratado conserva monto; limpieza en retrocesos/no efectivo; corte manual marca pagado y relaciona corte_id. No se demuestran pagos bancarios ni duplicados reales.
- Propuesta F2 pendiente: comandos transaccionales autorizados, cálculo confiable, protección de concurrencia, clave de idempotencia y reconciliación de totales/detalles. Dependencias TCE-007/TCE-009/TCE-011, sin iniciar este último ni otros hallazgos.
- Trazabilidad: SPEC/PLAN, apartados específicos TCE-010 propuestos; R-DOC-003/004/007/008/010. REC-F1-002 permanece registro documental; sin tarea de reparación iniciada ni nuevas autorizaciones implícitas.
- Archivos modificados: los mismos cuatro documentos; se añaden apartados TCE-010 sin alterar TCE-009 previo. Producto, TCE-004, pruebas y documentos históricos intactos; ningún archivo nuevo.
- Estado final: master, mismo HEAD, cuatro documentos modificados y staging vacío. SIN_COMMIT; ningún commit autorizado ni realizado en esta sesión. Sin pruebas ejecutables, migraciones ni accesos externos. F1 exclusivamente diagnóstica.
- Pendiente: validación aislada de fallos/concurrencia/permisos, esquema efectivo y aprobación de políticas de ajuste y criterios de cierre. Próximo paso: informe al PO y detenerse; ninguna continuación autorizada por este registro.

## Punto de continuidad — instantánea histórica del diagnóstico TCE-011

- Fecha: 2026-11-06. Autorización: instrucción del PO «F1 / Diagnóstico TCE-011», exclusivamente diagnóstico de inducción, transiciones, historial y candidatos/chats relacionados.
- Inicio: master, HEAD 8bcea01e52449ca600e360b87b04eeefe7d63e4f; cuatro documentos con cambios pendientes TCE-009/TCE-010 preservados, staging vacío. Ningún cambio descartado ni confirmado.
- Resultado: TCE-011 CONFIRMADO_ESTÁTICAMENTE en secuencias independientes y controles de interfaz; ficha EN_ANALISIS. Evidencia detallada, controles presentes, ausentes y escenarios condicionados registrados en HALLAZGOS_RECUPERACION.md. Sin explotación, incidente o impacto de producción demostrado.
- Observaciones específicas: historial/UI continúan sin revisar todos los errores; checklist requerido ausente no cuenta como pendiente; bucle de descarte masivo no archiva explícitamente todos sus chats; entrevista/postulación/ficha/resumen se guardan en pasos independientes. BD/RLS/triggers y efectos reales pendientes.
- Dependencias: TCE-010 por atomicidad e integridad de comisiones/etapas y TCE-007 por identidad. SPEC/PLAN contienen solo garantías y procedimiento F2 propuestos, sin inicio de reparación. R-DOC-003/004/007/008/010 aplicados a este registro; REC-F1-002 conserva función documental, no se reutiliza como tarea de implementación.
- Archivos: los mismos HALLAZGOS, SPEC, PLAN y TASKS de recuperación; ningún documento nuevo. Código, pruebas, TCE-004 y documentos históricos intactos.
- Estado final: master, mismo HEAD; cuatro documentos modificados, staging vacío, SIN_COMMIT. Sin pruebas ejecutables, migraciones ni servicios externos; F1 y hallazgos abiertos.
- Pendientes: validación aislada de fallos/concurrencia/autorización, política de requisitos y descarte masivo, evidencia de esquema real y aceptación del PO. Próximo paso: entregar informe y detenerse; no continuar ni confirmar cambios sin autorización.

## Punto de continuidad — instantánea histórica del diagnóstico TCE-012

- Fecha: 2026-11-06. Autorización: instrucción del PO «F1 / Diagnóstico TCE-012», administración de reclutadores por coordinadores, alcance multiagencia; sin reparación.
- Inicio y fin: master, HEAD 8bcea01e52449ca600e360b87b04eeefe7d63e4f; cuatro documentos con cambios previos TCE-009/TCE-010/TCE-011 preservados. Ningún cambio descartado ni confirmado; staging vacío, SIN_COMMIT.
- TCE-012 CONFIRMADO_ESTÁTICAMENTE en el alcance global de las escrituras cliente; ficha EN_ANALISIS. Explotación, borrado real, cascadas y permisos dependen de RLS/FK/triggers pendientes, no incidentes demostrados.
- Controles: middleware identifica coordinador activo al entrar, listado/conteos por agencia, botones de edición/eliminación sujetos a 24h y consulta de actividad antes de borrar. Ausencias: autorización propia por recurso y agencia, control servidor de ventana/actividad, operaciones compuestas atómicas y comprobación completa de errores. Evidencia detallada en ficha TCE-012.
- Discrepancia histórica: resumen reconstruido de TCE-012 decía coordinadores; se conserva sin alteración. Mandato actual y diagnóstico tratan reclutadores; conciliación con informe original/PO pendiente, sin cambiar ID ni afirmar diagnóstico de eliminación de coordinadores.
- SPEC/PLAN registran solo propuestas F2 para separar estado global, identidad compartida y relación local; autoridad global/local pendiente del PO. Dependencias TCE-007/TCE-009 y conservación vinculada a TCE-010/TCE-011, sin ampliar auditorías.
- Archivos: HALLAZGOS, SPEC, PLAN y TASKS de recuperación, los mismos cuatro; sin archivos nuevos. Producto, TCE-004, pruebas y documentos históricos intactos. R-DOC-003/004/007/008/010 para trazabilidad; REC-F1-002 conserva función de registro, no tarea de implementación.
- Sin pruebas ejecutables, migraciones, commits ni servicios externos. F1 y hallazgos abiertos; próximo paso: entregar informe y detenerse. Ninguna continuación o intervención queda autorizada por esta nota.

## Punto de continuidad — instantánea histórica del diagnóstico TCE-013

- Fecha: 2026-11-06. Autorización: mandato del PO «Auditoría F1 / TCE-013», diagnóstico dirigido de filtrado/autorización del pipeline coordinador multiagencia y registro en cuatro documentos existentes.
- Rama master, HEAD 8bcea01e52449ca600e360b87b04eeefe7d63e4f; cuatro documentos previamente modificados TCE-009 a TCE-012 preservados, sin descartes ni commits; staging vacío.
- Resultado TCE-013: CONFIRMADO_ESTÁTICAMENTE filtro principal solo por reclutador y alcance cliente; mezcla/lectura/escritura efectiva condicionada por RLS no consultada. Ficha EN_ANALISIS, no cerrada; evidencias y límites en HALLAZGOS.
- Diferenciación de capacidades: tarjeta principal solo renderiza y no muestra conversaciones ni mueve etapas; Detalles candidato sí filtra agencia al listar cuando está presente y permite cambiar checklist por ID, sujeto a autorización efectiva pendiente. No se afirma propagación automática de las filas del tablero hacia esa pestaña.
- Propuesta F2 en SPEC/PLAN: agencia confiable, filtros conjuntos y autorización por recurso/RLS; pruebas sintéticas multiagencia/Realtime/scope ausente. Dependencias TCE-012/TCE-007 y documentos TCE-001; discrepancia histórica TCE-012 conservada pendiente de conciliación.
- Trazabilidad: R-DOC-003/004/007/008/010; REC-F1-002 mantiene función documental, no tarea de implementación. Originales y severidades siguen pendientes; sin nuevas decisiones técnicas aprobadas.
- Archivos afectados: HALLAZGOS, SPEC, PLAN y TASKS de recuperación, sin nuevos archivos. Código, TCE-004, pruebas y documentos históricos intactos. SIN_COMMIT; sin migraciones, pruebas ejecutables ni servicios externos.
- Estado final: mismo HEAD, cuatro documentos modificados, staging vacío. F1 exclusivamente diagnóstica y hallazgos abiertos; próximo paso: entregar informe y detenerse, sin continuar ni confirmar cambios sin autorización.

## Punto de continuidad — instantánea histórica del diagnóstico TCE-014

- Fecha: 2026-11-06. Autorización: mandato del PO «Auditoría F1 / TCE-014», exclusivamente diagnóstico del ciclo de invitaciones y registro en documentos existentes.
- Rama master, HEAD 8bcea01e52449ca600e360b87b04eeefe7d63e4f; cuatro documentos pendientes TCE-009 a TCE-013 preservados; no se descartan ni confirman cambios. Discrepancia histórica TCE-012 sigue pendiente de conciliación y sin edición retroactiva.
- TCE-014 EN_ANALISIS: CONFIRMADO_ESTÁTICAMENTE token validado/ID cliente desacoplados, alta y consumo independientes, error final no comprobado. Formato generado/consumido compatible, NO REPRODUCIDA ESTÁTICAMENTE discrepancia de formato; incidentes y garantías BD pendientes.
- Controles confirmados: emisión con sesión admin y origen (TCE-004 intacto); randomUUID, caducidad de 7 días, usado y repetición de validación en aceptación, teléfono esperado opcional y compensaciones parciales. Token persistido legible; destinatario no acredita posesión; no se localizó revocación ni consumo atómico/idempotente en código.
- Evidencia detallada y escenarios condicionados en HALLAZGOS TCE-014. SPEC/PLAN registran propuestas F2, sin autorización de implementación: ID derivado, reserva/consumo seguro, transacción de BD y recuperación ante fallos Auth. Dependencia con TCE-004 y patrón de integridad TCE-010/TCE-011, sin reabrir sus auditorías.
- Trazabilidad: R-DOC-003/004/007/008/010; REC-F1-002 solo función documental. No se asignan severidades originales ni cierres. Pendientes: constraints/RLS/triggers, política de destinatario, revocación, hash/recopia y validación aislada de concurrencia/reintentos.
- Archivos afectados: mismos HALLAZGOS, SPEC, PLAN y TASKS de recuperación; sin archivos nuevos. Producto, pruebas, TCE-004 y documentos históricos intactos. Estado final: mismo HEAD, cuatro documentos modificados, staging vacío; SIN_COMMIT.
- Sin pruebas ejecutables, migraciones, commits ni servicios externos. F1 permanece diagnóstica; entregar informe y detenerse, sin otras tareas autorizadas por esta nota.

## Punto de continuidad — instantánea histórica del diagnóstico TCE-015

- Fecha: 2026-11-06. Autorización: mandato del PO «Auditoría F1 / TCE-015», diagnóstico de publicación/ocultamiento de datos de vacantes y registro en documentos existentes.
- Inicio y fin: master, HEAD 8bcea01e52449ca600e360b87b04eeefe7d63e4f; cuatro documentos con TCE-009 a TCE-014 preservados, incluida discrepancia histórica TCE-012, sin descartes ni commits; staging vacío.
- TCE-015 EN_ANALISIS, CONFIRMADO_ESTÁTICAMENTE el transporte de campos sin redacción en consultas/props públicas pese a ocultamiento visual. Exposición de valores reales y permisos BD pendientes, sin incidente demostrado. Evidencia detallada en HALLAZGOS.
- Controles/diferencias: renderizado y SEO condicionan etiquetas; búsqueda incluye empresa real y recarga selecciona valores completos. Vista privada puede recibirlos legítimamente; exportación requiere autorización (dependencia TCE-002), acceso a detalle privado TCE-003/TCE-007. No se inicia TCE-016.
- Propuestas F2 en SPEC/PLAN: proyección pública redactada y mínima, restricciones del SELECT directo y separación de acceso privado/exportación; validar matriz de banderas/roles y contenido de archivos/textos en aislamiento. Sin autorización para implementar o cambiar BD/producción.
- Archivos: HALLAZGOS, SPEC, PLAN y TASKS de recuperación; ningún archivo nuevo. Producto, TCE-004, pruebas y documentos históricos intactos. R-DOC-003/004/007/008/010 para trazabilidad; REC-F1-002 conserva función documental, sin reutilizarlo como reparación.
- SIN_COMMIT; sin pruebas ejecutables, migraciones ni servicios externos. Estado final: cuatro documentos modificados, staging vacío, mismo HEAD. F1 y hallazgos abiertos; próximo paso: entregar informe y detenerse, sin continuación implícita.

## Punto de continuidad — instantánea histórica del diagnóstico TCE-016

- Fecha: 2026-11-06. Autorización: mandato del PO «Auditoría F1 / TCE-016», diagnóstico dirigido de paginación/límites de listados y registro documental.
- Rama master, HEAD 8bcea01e52449ca600e360b87b04eeefe7d63e4f; cuatro documentos con TCE-009 a TCE-015 preservados, incluida discrepancia histórica TCE-012. Sin descartes ni commits; staging vacío.
- TCE-016 EN_ANALISIS, CONFIRMADO_ESTÁTICAMENTE slice público de 15 filas, consultas sin páginas, top-N explícitos y filtros/contadores de arrays. Máximo API efectivo, truncamiento y carga reales pendientes de validación; no se presumen 1000 filas ni incidentes.
- Evidencia: vacantes públicas/recarga, kanban, detalles de candidatos, plantilla/agencias, reclutadores con consultas 1+N, conversaciones/mensajes y exportación. Se distinguen límites intencionales y count exacto de servidor de paginación real y length cliente; referencias exactas en HALLAZGOS TCE-016.
- SPEC/PLAN solo propuestas F2 de páginas/cursor, filtros/orden estable, completitud explícita, cargas acotadas y mediciones sintéticas; dependencias TCE-015/TCE-013/TCE-010 sin ampliar sus diagnósticos. R-DOC-003/004/007/008/010 y función documental REC-F1-002 conservadas.
- Archivos: mismos HALLAZGOS, SPEC, PLAN y TASKS, sin archivos nuevos. Producto, TCE-004, pruebas y documentos históricos intactos. SIN_COMMIT; sin pruebas de carga/ejecutables, migraciones ni servicios externos.
- Estado final: mismo HEAD, cuatro documentos modificados, staging vacío. F1 y hallazgos abiertos; entregar informe y detenerse sin iniciar otro hallazgo o confirmar cambios sin autorización.

## Punto de continuidad vigente — diagnóstico TCE-017

- Fecha: 2026-11-06. Autorización: mandato del PO «Auditoría F1 / TCE-017», inspección estática de dependencias/configuración y registro en documentos existentes.
- Inicio/final: master, HEAD 8bcea01e52449ca600e360b87b04eeefe7d63e4f; cuatro documentos TCE-009 a TCE-016 preservados, incluida discrepancia histórica TCE-012. Sin descartes ni commits; staging vacío.
- TCE-017 EN_ANALISIS: inventario local confirmado; package-lock v3, 744 entradas incluida raíz, manifiesto coincidente y 27 directas resueltas dentro de rango/instaladas coincidentes. Next 14.1.4, React/DOM 18.3.1, Supabase 2.110.0, SSR 0.12.0, xlsx 0.18.5. Evidencia detallada en HALLAZGOS.
- Avisos: Next con advertencia local de seguridad; ESLint/glob/inflight/rimraf y otros con deprecación; utilidades para Tailwind 4 frente a Tailwind 3.4.19. CVE/aplicabilidad/soporte vigente y fallo real pendientes, sin afirmación de explotación ni consulta de enlaces externos.
- Compatibilidad: Node local 22.22.3 satisface engines; Supabase exige >=22 y peer SSR requiere supabase-js ^2.108.0. Runtime desplegado desconocido. Falta pin de runtime/gestor y auditoría automatizada localizada; scripts disponibles no equivalen a pruebas ejecutadas en esta sesión.
- SPEC/PLAN registran solo estrategia F2 propuesta de verificación externa autorizada, actualizaciones compatibles y regresiones aisladas; TCE-004 permanece intacto. R-DOC-003/004/007/008/010 y función documental REC-F1-002 preservadas; sin nuevas decisiones técnicas aprobadas.
- Archivos: HALLAZGOS, SPEC, PLAN y TASKS existentes; ningún archivo nuevo ni cambio en producto, lock, paquetes, pruebas o históricos. SIN_COMMIT. No se ejecutó npm install/update/audit, pruebas, migraciones ni acceso externo; solo lectura y cálculo local de metadatos.
- F1 y hallazgos abiertos: consolidación/conciliación de evidencia y revisión del PO pendientes. Estado final cuatro documentos modificados, staging vacío, mismo HEAD. Entregar informe y detenerse, sin otras actividades autorizadas por este registro.

## Punto de continuidad vigente — consolidación documental F1, 2026-11-06

Este punto sucede a la instantánea TCE-017 y a los puntos anteriores llamados «vigentes», que conservan valor histórico. Fuente de autorización: instrucción del PO «Consolidación final de F1», exclusivamente integración en documentos existentes y preparación de aceptación; no código, nueva auditoría integral, F2, commits ni servicios externos.

- Inicio: master, HEAD 8bcea01e52449ca600e360b87b04eeefe7d63e4f; staging vacío; únicamente HALLAZGOS, SPEC, PLAN y TASKS de recuperación modificados por TCE-009 a TCE-017. Se conservan sus contenidos anteriores; sin descartes.
- Actividad documental asociada al registro REC-F1-002, que permanece EN_VALIDACION y no se convierte en tarea técnica; no se asignan IDs nuevos. REC-F1-001 y DEC-REC-005 intactos. Ningún hallazgo ni fase cerrado.
- Evidencia obtenida: conteo de fichas únicas 17 TCE y 16 GOV; contraste documental de estados, límites y dependencias; localización del diagnóstico TCE-008 en esta continuidad histórica; metadatos del commit TCE-004 a26775d54c1374666ed2890ddd032e5c9f563e81 y comprobación puntual de sus controles actuales. No se repite la auditoría del producto.
- Resultado: HALLAZGOS añade matriz de 17 filas con problema/certeza, impacto, prioridad propuesta, dependencias, corrección, pruebas y pendientes. SPEC enlaza requisitos de grupo; PLAN agrupa implementación futura para evitar duplicación. Propuestas pendientes del PO; no autorizan ejecución.
- Brechas: los diagnósticos individuales completos TCE-001/002/003/005/006 no están conservados en sus fichas; no se declaran confirmados por la sola descripción reconstruida. TCE-008 se referencia desde este registro derivado. TCE-004 tiene corrección local versionada y seguimiento EN_VALIDACION, sin prueba actual de integración/despliegue; las 117 pruebas PASS/TypeScript PASS son antecedentes comunicados por el PO, no repetidos hoy.
- TCE-012: resultado C, evidencia insuficiente para decidir entre descripción imprecisa del mismo problema y dos problemas distintos. Conservar descripción histórica sobre coordinadores y diagnóstico de reclutadores; resolver mediante fuente/decisión expresa del PO, sin renumerar ni crear hallazgos.
- Bloqueos de aceptación: soportes originales o sustitución aprobada, cinco diagnósticos individuales faltantes, conciliación TCE-012, severidades/prioridades/plan de validación aceptados, cobertura integral F1 o excepciones expresas (BD/RLS/Storage, roles, concurrencia, rendimiento/UX/accesibilidad, dependencias). Aceptar diagnóstico no equivale a reparar ni a iniciar F2.
- Relación documental: R-DOC-001/003/004/006/007/008/010 y puertas de salida SPEC; matriz HALLAZGOS y agrupación PLAN. Requisitos históricos específicos no recuperados y severidades originales pendientes. Las huellas/ubicaciones del índice representan instantáneas anteriores y no se presentan como contenido actual o soporte original.
- Archivos afectados: únicamente los mismos cuatro documentos existentes; ningún archivo nuevo. INDICE_EVIDENCIAS, gobernanzas, históricos, producto, TCE-004, pruebas, configuración y dependencias sin modificaciones en esta actividad.
- Verificaciones documentales: unicidad/cobertura de fichas y matriz, referencias locales y correspondencia de bloques, conservación del contenido previo mediante comparación de huellas del prefijo de los cuatro archivos, alcance Git y git diff --check. Sin pruebas del producto ni acceso externo.
- Estado de trabajo: EN_VALIDACION documental; SIN_COMMIT para TCE-009 a TCE-017 y esta consolidación, porque no está autorizado confirmar cambios. Los commits anteriores permanecen antecedentes, no se reetiquetan como SIN_COMMIT.
- Cierre de sesión: master y mismo HEAD, cuatro documentos modificados, staging vacío. Sin commits, push/pull/fetch, producción ni nuevas correcciones. F1 abierta y F2 no iniciada. Recomendación: revisión del PO de matriz y brechas; recuperar/delimitar soportes antes de aceptar el cierre de fase.
- Próximo paso autorizado: entregar informe y detenerse. Cualquier commit, validación adicional, cambio de alcance o corrección requiere nueva autorización.

## Punto de continuidad vigente — cinco soportes estáticos actuales, 2026-11-06

Este punto sucede a la consolidación F1 anterior, que se conserva como instantánea histórica. Autorización: instrucción del PO «Recuperación de soportes faltantes de F1»; revisión focalizada y actualización de los cuatro documentos existentes, sin código, commits ni servicios externos.

- Inicio: master, HEAD 8bcea01e52449ca600e360b87b04eeefe7d63e4f; staging vacío; únicamente HALLAZGOS, SPEC, PLAN y TASKS de recuperación modificados. Se preservan íntegramente TCE-007 a TCE-017 y las doce filas de matriz ajenas al alcance. No se descartan cambios TCE-009 a TCE-017.
- Registro documental dentro de REC-F1-002, EN_VALIDACION, sin convertirlo en tarea técnica ni asignar IDs permanentes nuevos. REC-F1-001 y DEC-REC-005 intactos.
- Procedimiento/evidencia: lectura numerada de handlers de documentos, import/export, perfiles y pases; ficha SSR de vacante y layouts; cobertura de middleware, configuración no secreta y referencias cliente necesarias. Evidencias actuales en cinco subsecciones «Reconstrucción estática actual» de HALLAZGOS y referencias de sus filas de matriz. No se presenta como recuperación de informes originales.
- Resultados: TCE-001/002/005/006, ausencia de autenticación/autorización confirmada estáticamente; TCE-003 parcialmente confirmado frente al título histórico, con defecto de autorización confirmado en ficha de vacante, no exposición personal de reclutador acreditada. Seguimiento EN_ANALISIS, sin cierre ni reparación. Condiciones de infraestructura y configuración de servicio efectiva no verificadas.
- Soportes: cinco vacíos de evidencia estática actual cubiertos. Persisten originales/severidades históricas, precisión histórica TCE-003, discrepancia C de TCE-012, aprobación de prioridades/criterios/plan y cobertura integral pendiente o excepciones del PO. No recomendar cierre íntegro F1 ni iniciar F2 por esta actualización.
- Archivos afectados: únicamente HALLAZGOS, SPEC, PLAN y TASKS; sin nuevos archivos. Las cinco fichas y filas de matriz se actualizan por nueva evidencia; las secciones de los demás hallazgos se conservan. Código, TCE-004, pruebas, dependencias, gobernanzas, históricos e INDICE_EVIDENCIAS intactos.
- Verificaciones documentales: 17 fichas TCE y 16 GOV únicas; cinco soportes nuevos y destinos de matriz; comparación de huellas de secciones TCE-007 a TCE-017 y doce filas restantes; conservación del contenido previo de SPEC/PLAN/TASKS; alcance Git y git diff --check. Son comprobaciones documentales, no pruebas del producto.
- Pruebas de aceptación F2 propuestas en HALLAZGOS y agrupadas en PLAN; no ejecutadas. Sin HTTP, secretos, datos, migraciones, instalaciones, Supabase, Vercel ni producción.
- Estado final: master, mismo HEAD, cuatro documentos modificados, staging vacío; SIN_COMMIT por restricción expresa. Sin commits, push/pull/fetch ni cambios de rama. F1 activa; F2 no iniciada; gobernanzas/borradores no ratificados.
- Siguiente paso autorizado: entregar tabla por hallazgo y bloqueos al PO, detenerse y esperar autorización. No queda autorizada otra validación, conciliación del índice, commit o reparación por este registro.

## Tareas heredadas y primer bloque F2 — propuesta 2026-11-06

Autorización documental: mandato del PO «Cierre documental condicionado de F1». Se permite registrar y preparar estas tareas, no ejecutarlas. Búsqueda previa en los documentos de recuperación y gobernanzas sin registros REC-F2-001 a REC-F2-007; se asignan para trazabilidad del trabajo futuro. REC-F1-001 sigue reservado a DEC-REC-005 y REC-F1-002 a registro documental, ambos sin cierre.

Reglas comunes aplicables a las siete fichas:
- Estado: PENDIENTE, no iniciadas. Responsable ejecutor/revisor independiente: por designar expresamente por el PO; autoridad de aceptación: PO. Prioridad, calendario y aceptación de riesgo: pendientes de aprobación.
- Requisitos SPEC: sección «Propuesta de aceptación documental condicionada F1 y transición» y R-DOC-001/002/003/004/006/007/008/009/010. Procedimiento PLAN: «Transición condicionada y primer bloque», además del procedimiento específico de cada hallazgo.
- Autorización de ejecución: NO OTORGADA. Aprobar el cierre documental o esta planificación no autoriza código, consultas externas, uso de credenciales/datos, cambios BD/Storage/configuración, instalaciones, migraciones, pruebas, commits ni despliegue. Una ejecución futura requiere mandato de entorno, operaciones, datos y alcance delimitados.
- Evidencia de partida: las fichas y matriz de HALLAZGOS y checkpoint b94d24d12c5684eafe57959459036c6fe0b0a021. Ningún resultado técnico nuevo obtenido al registrar las tareas.
- Pruebas ejecutadas: ninguna. Las pruebas/criterios de cada ficha son previstos y pendientes; no usar producción ni datos reales. Registrar fallos, limitaciones, entorno, versión y salida verificable sin secretos.
- Riesgos y reversión: tratar cada tarea como verificación/diseño inicialmente; no hay implementación que revertir ahora. Antes de cualquier cambio autorizado, documentar estado previo, impacto y reversión específica; no considerar un git revert suficiente para datos/migraciones/efectos externos.
- Commits de ejecución: ninguno; no hay commit autorizado por esta propuesta. Decisión de cierre: pendiente de evidencia, revisión y aceptación del PO. Próximo paso común: aprobar alcance/responsables/entorno antes de iniciar, o mantener PENDIENTE.
- Toda validación fallida bloquea la aceptación técnica de su operación y su habilitación/publicación, aunque se haya aprobado un cierre documental condicionado de F1. No se crean garantías por trasladar un pendiente de fase.

### REC-F2-001 — Arquitectura de identidad, sesiones y autorización multiagencia

- Objetivo/alcance: primer bloque de diseño para identidad confiable y permiso por recurso; incluir reclutador, candidato, coordinador y administrador en sus contratos actuales; mapear endpoints, SSR, consultas directas, Realtime y Storage. No crear un segundo sistema administrativo ni alterar TCE-004.
- Hallazgos: TCE-007/008/009/012/013; consumidores TCE-001/002/003/005/006 y contrato administrativo TCE-004. Dependencias: contrato de producto/roles, discrepancias TCE-003/012, evidencias de REC-F2-002/003/004/005 para finalizar el diseño. El borrador puede alimentar esas verificaciones, no exige finalizarlas antes de empezar a diseñar.
- Sistemas/archivos candidatos: flujos existentes de login/perfil/pipeline, middleware, clientes Supabase y API identificadas en HALLAZGOS; lista de cambios exacta debe aprobarse después, no queda autorizada aquí.
- Criterios de aceptación: matriz actor-operación-recurso-agencia completa; decisión documentada del mapeo código + contraseña a Supabase Auth sin correo obligatorio; contratos de alta, primer cambio, recuperación por coordinador vigente, expiración, renovación, logout, revocación y desactivación; separación de identidad global y membresía local; política explícita para facultades globales, referidos y acceso privado del candidato; CSRF y permiso antes de privilegios. Ambigüedades bloqueadas, sin inventar política. Revisión y aprobación del PO antes de implementación.
- Pruebas previstas/evidencia de salida: casos de amenaza y aceptación trazados a recursos y consultas; diseños y decisiones versionados cuando se autorice, con plan de pruebas negativas/positivas y reversión por incremento. Ninguna prueba ni diseño técnico aprobado todavía.

### REC-F2-002 — Modelo BD, restricciones, RLS e integridad

- Objetivo/alcance: contrastar esquema efectivo autorizado con código: tablas, roles/grants, políticas RLS, funciones/RPC, triggers, FK, unicidad y transacciones. Incluir negocio compartido, membresías, atribución, etapas, historial, comisiones e invitaciones. No inferir despliegue desde SQL histórico.
- Hallazgos: TCE-001/002/004/005/006/007/008/009/010/011/012/013/014/015/016. Dependencias: entorno autorizado REC-F2-004 y matriz preliminar REC-F2-001; acceso efectivo BD aún no autorizado.
- Sistemas afectados previstos: Supabase/Postgres del entorno de prueba, esquema/migraciones disponibles y políticas; no se autoriza modificar ninguno ahora.
- Criterios de aceptación: inventario fechado del modelo realmente revisado y su versión; matriz de permisos contrastada con políticas/roles, incluido anon/authenticated y alcance de servicio; pruebas de lectura/escritura por identidad/agencia y restricciones; garantías transaccionales e idempotencia de cortes/transiciones/consumo documentadas con evidencia o defecto abierto. Demostrar rechazo cruzado y preservación de integridad en entorno aislado para cada operación que vaya a habilitarse. Diferenciar modelo propuesto, observado y probado; aceptación del PO.
- Pruebas previstas/evidencia: dos agencias, reclutador compartido, identidad inactiva/ajena, restricciones, reintentos, fallos intermedios y concurrencia; conservar resultados por tabla/operación/rol. Garantías aún no demostradas, ninguna consulta externa ejecutada.

### REC-F2-003 — Storage y protección de documentos

- Objetivo/alcance: comprobar políticas/privacidad de buckets, acceso directo, URL pública/firmada y autorización por candidato/postulación/negocio/agencia; consistencia archivo-registro.
- Hallazgos: TCE-001/006; relacionados TCE-003/011/015. Dependencias: contratos REC-F2-001, modelo REC-F2-002 y entorno REC-F2-004. Sistemas previstos: buckets y endpoints documentales del entorno aislado, no producción.
- Criterios de aceptación: evidencia de configuración y políticas efectivas; matriz por recurso/actor que rechace lectura, firma, subida, sustitución y borrado ajenos; relaciones incoherentes rechazadas; caducidad de URL firmada y privacidad acordada comprobadas; casos autorizados y fallos Storage/BD sin estado aceptado como íntegro por error. No usar getPublicUrl como prueba de bucket público. Aprobar tratamiento de negocio compartido y revisión PO.
- Pruebas previstas/evidencia: archivos sintéticos, acceso directo permitido/denegado, vencimiento, tamaño/tipo y fallos de almacenamiento/registro; resultados y versión sin URLs sensibles ni documentos reales.

### REC-F2-004 — Entorno aislado, infraestructura y medidas temporales

- Objetivo/alcance: preparar y validar aislamiento, capacidades locales, runtime y configuración no secreta; trazabilidad commit-entorno, respaldos/reversión y conservación de protección temporal.
- Hallazgos: TCE-004/017 y precondición de validación de todos. Dependencias: autorización de herramientas/entorno y responsable designado; existencia de un entorno aislado no se presume.
- Sistemas previstos: herramientas locales y, solo con permiso específico futuro, metadatos/configuración no secreta de infraestructura. Prohibido usar el único Supabase de producción para pruebas por falta de alternativa.
- Criterios de aceptación: entorno de pruebas sin conexión ni credenciales productivas, datos sintéticos, runtime/gestor documentados y compatibles; configuración de origen segura y contrato Preview/Production diferenciado; procedimiento de respaldo/restauración y reversión verificable en aislamiento; relación con commit documentada. Protección Vercel Authentication / All Deployments conservada y, cuando se autorice consultarlo, alcance/estado no sensibles registrados. Cualquier cambio de protección o despliegue requiere autorización independiente.
- Pruebas previstas/evidencia: comprobación de aislamiento y restauración en entorno de prueba autorizado, compatibilidad de origen y configuración; ninguna instalación, acceso a consola ni prueba ejecutada ahora. Si no existe alternativa aislada autorizada, no avanzar integración.

### REC-F2-005 — Seguridad, privilegios y dependencias

- Objetivo/alcance: revisar contratos de autenticación/autorización, CSRF, exposición de datos, mínimo privilegio y controles anti-abuso; contrastar avisos de dependencias con paquete/versión/fuente verificable y compatibilidad.
- Hallazgos: TCE-001 a TCE-017 según su superficie; priorizar controles administrativos/documentales/identidad y TCE-017 sin declarar CVE por nombre de paquete. Dependencias: arquitectura preliminar REC-F2-001 y entorno REC-F2-004; las fuentes externas y pruebas necesitan autorización futura.
- Sistemas/archivos candidatos: handlers/componentes ya identificados, package.json/lock y configuración no secreta; no actualizar paquetes ni modificar producto en esta tarea sin ampliación expresa.
- Criterios de aceptación: amenazas y permisos documentados por operación, pruebas negativas de sesión/rol/recurso/agencia/origen y ausencia de efectos privilegiados al rechazar; verificación de secreto público solo con procedimiento autorizado, sin valores en evidencias; fuentes y aplicabilidad de avisos registradas o pendientes explícitos; plan de actualización compatible y regresión aprobado. Revisión independiente y aceptación PO; no afirmar seguridad global.
- Pruebas previstas/evidencia: mocks e integración aislada, entradas manipuladas, CSRF y abuso según límites aprobados; matriz versiones/avisos y riesgo residual, sin explotación de producción, secretos ni instalaciones ahora.

### REC-F2-006 — Integración aislada y regresión por incremento

- Objetivo/alcance: validar primero TCE-004 tal como está consolidado; después validar cada incremento de identidad/autorización y, cuando se implementen con autorización propia, integridad, invitaciones, publicación y paginación. Esta tarea de validación no autoriza implementar esas correcciones.
- Hallazgos: TCE-001 a TCE-017 según incremento disponible. Dependencias: entorno REC-F2-004 y contratos/modelo/permisos REC-F2-001/002/003/005; correcciones fuera de TCE-004 deben existir y estar autorizadas antes de probar su aceptación.
- Sistemas previstos: aplicación y Supabase Auth/BD/Storage de prueba con identidades/datos sintéticos; nunca proyecto productivo.
- Criterios de aceptación: login real, getUser, lectura/renovación de cookies, expiración/logout/revocación y administrador activo/permisos conforme al contrato; cuatro API TCE-004 aceptan casos legítimos y rechazan sesión/rol/origen inválidos o clave antigua sola sin efectos de negocio. Por incremento posterior, identidad/recurso/agencia, comisiones/etapas/historial/invitaciones consistentes y reintentos/concurrencia según matriz. Evidencia por prueba y versión, fallos/no ejecutadas explícitos; revisión y aceptación PO antes de proponer publicación.
- Pruebas previstas/evidencia: integración real aislada más mocks/regresiones pertinentes. Las 117 pruebas históricas de TCE-004 no sustituyen esta integración ni se presentan como repetidas en esta tarea.

### REC-F2-007 — Cobertura funcional, completitud, rendimiento y accesibilidad

- Objetivo/alcance: cobertura integral no ejecutada en F1 para Candidato, Reclutador, Coordinador y Administrador; listados/paginación, filtros/orden/conteos, experiencia y accesibilidad; medición con volúmenes sintéticos.
- Hallazgos: TCE-016 y flujos afectados por TCE-007 a TCE-015; regresión pública/documental TCE-001/002/003/005/006. Dependencias: entorno REC-F2-004, contratos y cada incremento pertinente, REC-F2-006. No esperar validación de toda F2 para planificar escenarios; no probar funcionalidades inexistentes como terminadas.
- Sistemas previstos: interfaces/API/consultas de prueba, sin carga sobre producción.
- Criterios de aceptación: inventario de flujos y roles con requisitos históricos/recuperación enlazados y resultado reproducible; dataset supera límites configurados, páginas sin omisiones/duplicados y totales fiables; metas de latencia/volumen y matriz accesible/móvil definidas y aprobadas antes de medir, no inventadas al cierre; errores, bloqueos y pruebas no ejecutadas explícitos. Defectos continúan abiertos hasta resolución y aceptación PO.
- Pruebas previstas/evidencia: navegación/teclado/estados de error, flujo funcional positivo/negativo por rol, completitud y carga sintética controlada; registros de entorno, límites y métricas, revisión y aceptación. No realizadas ahora.

## Punto de continuidad vigente — propuesta de cierre condicionado F1, 2026-11-06

- Esta nota sucede a puntos previos sin reescribirlos. Actividad documental vinculada a REC-F1-002, EN_VALIDACION; no autoriza implementación y no cierra tareas previas.
- Inicio: master, HEAD b94d24d12c5684eafe57959459036c6fe0b0a021, árbol limpio y staging vacío. Ese checkpoint documental conserva consolidación y soportes estáticos; los SIN_COMMIT anteriores son instantáneas previas al checkpoint, no descripción del estado actual del historial.
- Autorización vigente: PO «Cierre documental condicionado de F1», solo HALLAZGOS/SPEC/PLAN/TASKS. Resultado: propuesta de aceptación con reservas, mapa de pendientes y siete tareas F2 PENDIENTES con criterios; primer bloque de arquitectura definido, no ejecutado.
- Evidencia de esta actividad: lectura documental/Git, búsqueda previa de disponibilidad de IDs, comprobación de unicidad de 17 fichas/matriz y siete tareas, preservación del contenido previo de los cuatro documentos y control de alcance. No nueva auditoría del código, pruebas de producto ni comprobaciones externas.
- Decisiones pendientes del PO: aceptación/sustitución de fuentes, discrepancias TCE-003/012, alcance excluido/excepciones, prioridades y riesgos, responsables y criterios, versión aceptada y permisos del primer bloque. No se crea una decisión aprobada ni se ratifican borradores.
- Protección temporal Vercel conservada por instrucción del PO y sin verificación remota; corrección TCE-004 local preservada y validación integral pendiente. Diecisiete hallazgos abiertos; F1 abierta y F2 no iniciada.
- Archivos modificados: únicamente los mismos cuatro documentos existentes; sin nuevas creaciones, producto, TCE-004, configuración, dependencias, migraciones, gobernanzas, históricos ni índice modificados.
- Pruebas ejecutadas: ninguna del producto. Comprobaciones documentales y git diff --check; no pruebas BD/RLS/Storage/infraestructura/seguridad/integración. Estas últimas quedan propuestas, no aprobadas ni ejecutadas.
- Commits: checkpoint previo b94d24d12c5684eafe57959459036c6fe0b0a021; esta propuesta SIN_COMMIT, sin autorización para confirmar. Reversión documental, si se solicita, debe retirar solo añadidos de esta propuesta preservando la línea base; no se ejecuta ahora.
- Estado final esperado y comprobado al entregar: master, mismo HEAD, cuatro documentos modificados, staging vacío. Sin commits, push/pull/fetch, despliegues ni accesos externos.
- Próximo paso autorizado: entregar propuesta y detenerse. Esperar aprobación expresa de cierre documental y autorización separada para inicio del bloque F2; no ejecutar ninguna tarea por haberla registrado.

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

## Punto de continuidad vigente — F1 cerrada documentalmente con condiciones, 2026-11-06

- Última actividad: formalización documental autorizada del VoBo F1, asociada a la función de registro REC-F1-002 sin convertirla en tarea técnica ni cerrar automáticamente REC-F1-001/002. Las instantáneas anteriores y propuesta están conservadas.
- Inicio: master, HEAD b94d24d12c5684eafe57959459036c6fe0b0a021; cuatro documentos de transición modificados, staging vacío y ningún archivo nuevo. Se incorporan al checkpoint junto a esta formalización.
- Estado F1: CERRADA DOCUMENTALMENTE CON CONDICIONES por autorización expresa del PO fechada 2026-11-06. F2: NO INICIADA. TCE-001 a TCE-017 ABIERTOS; TCE-004 conserva seguimiento EN_VALIDACION y validación integral pendiente.
- Tareas: REC-F2-001 a REC-F2-007 PENDIENTES, no ejecutadas ni autorizadas técnicamente. Responsables/revisores por designar y alcance/entorno por autorizar. Siguiente bloque: REC-F2-001, diseño de identidad, sesiones, autorización y aislamiento multiagencia; no iniciar implementación ni diseño ejecutado sin nuevo mandato delimitado.
- Reservas: originales no recuperados, reconstrucciones actuales aceptadas con límites, discrepancias TCE-003/012 pendientes; garantías BD/RLS/Storage/infraestructura/seguridad/integración y cobertura funcional/no funcional pendientes conforme a tareas. VoBo no es resultado de prueba ni demuestra producción segura.
- Protección: conservar Vercel Authentication / All Deployments informado por PO y corrección local TCE-004; sin consulta o modificación de producción ni verificación remota actual.
- Archivos afectados: únicamente HALLAZGOS, SPEC, PLAN y TASKS de recuperación. Ningún archivo nuevo; producto, TCE-004, pruebas, dependencias, configuración, migraciones, gobernanzas, históricos e índice intactos.
- Comprobaciones: conservación de contenido anterior (solo encabezado actual de fase TASKS actualizado), propuesta/evidencias y 17 fichas/filas preservadas; siete tareas únicas, correspondencia del estado/condiciones entre cuatro documentos, alcance de staging y git diff --check. No pruebas de producto ni servicios externos.
- Commit: autorizado uno solo con mensaje docs(recovery): approve conditional F1 closure. Se parte de b94d24d12c5684eafe57959459036c6fe0b0a021; no anticipar hash. El hash definitivo se comunica al PO en el informe final; el propio checkpoint se identifica por este mensaje, padre y cuatro rutas. No se crea un segundo commit para insertar su hash dentro de sí mismo.
- Reconciliación: los SIN_COMMIT y prohibiciones de commit anteriores describen sus respectivas sesiones; este mandato autoriza únicamente el checkpoint documental actual. No se reescriben autorizaciones ni evidencias pasadas.
- Resultado y siguiente paso: completar comprobaciones, realizar único commit autorizado, informar hash/estado Git y detenerse. No push/pull/fetch, despliegue ni otro trabajo. Esperar autorización específica para el siguiente bloque.

## REC-F2-001 — actualización vigente: criterios funcionales aprobados, 2026-11-06

- Fuente/autorización: PO, VoBo otorgado el 2026-11-06 para cuatro criterios funcionales, comunicado en «REC-F2-001: registro de decisiones aprobadas». Autorizado actualizar cuatro documentos y un único commit local; no código, esquema, dependencias, servicios externos, migraciones ni implementación.
- Estado vigente de REC-F2-001: EN_CURSO — análisis y diseño exclusivamente; sin aceptación final. Este estado sucede a la instantánea de siete tareas PENDIENTES de la planificación: REC-F2-002 a REC-F2-007 permanecen PENDIENTES. No se cierran REC-F1-001/002 ni hallazgos por este registro.
- Acuerdos: (1) código individual + contraseña sin correo/SMS en cada login; (2) identidad global única y membresías/estados/permisos independientes por agencia, sin suspensión global por autoridad local; (3) solicitudes de recuperación por coordinador autorizado con verificación, sin control global automático; (4) postulación pública sin registro y privados con mecanismo verificable limitado al recurso.
- Requisitos/plan: SPEC «REC-F2-001 — criterios funcionales aprobados por el PO» contiene texto vinculante y aceptación propuesta; PLAN «REC-F2-001 — aplicación del VoBo funcional y siguiente validación» define secuencia. HALLAZGOS relaciona TCE-005/007/008/009/012/013 y recursos documentales, sin alterar evidencias.
- Responsable de aceptación: PO; ejecutor material de este registro, agente bajo el mandato. Responsable técnico/revisor de próxima validación y autorización de entorno: por designar/confirmar por el PO, sin inventar delegación.
- Antecedente: análisis/diseño previo realizado solo en conversación bajo autorización de lectura, sin modificación de TASKS; no se presenta como aceptación final. La actualización actual concilia ese avance con el estado documental.
- Riesgos y dependencias: compatibilidad código-Auth, teléfono/identificador legítimo y unicidad, entrega/caducidad/uso único inicial, recuperación compartida, sesión/cookies/CSRF, revocación y RLS/Storage. Dependencias REC-F2-002/003/004/005/006; no ejecutadas por este mandato.
- Alternativas pendientes de aprobación: mapeo con teléfono real, otras identidades admitidas sin correo obligatorio, proveedor adicional/autenticación propia, SSR/browser frente a intermediación servidor y mecanismo privado del candidato. No confundir alternativas con decisiones funcionales aceptadas; no contraseñas propias ni correos ficticios inseguros.
- Criterios de aceptación: demostrar viabilidad del login sin correo/SMS habitual; dos agencias con aislamiento y sin suspensión global desde A; recuperación sin control global por membresía local; privados de candidato rechazados sin credencial válida y postulación pública preservada; completar matriz, ciclo de sesiones, riesgos y plan de pruebas/reversión para revisión PO. Ninguno consta probado por este registro.
- Evidencia obtenida: instrucción expresa del PO y correspondencia entre cuatro documentos; no nueva auditoría o prueba técnica. Pruebas ejecutadas: ninguna del producto/integración. No ejecutadas: Auth real, RLS/Storage, concurrencia, revocación, antiabuso y flujos de aceptación; requieren próxima etapa y permisos de entorno.
- Resultado: cuatro criterios funcionales formalizados; diseño técnico no aceptado y sin implementación. TCE-001 a TCE-017 ABIERTOS, discrepancias TCE-003/012 pendientes; TCE-004 conserva corrección local y validación integral pendiente.
- Siguiente actividad propuesta: viabilidad técnica de autenticación y sesiones, con evidencia y comparación de alternativas; detenerse ahora y esperar autorización de esa actividad/entorno. No se inicia automáticamente por figurar en PLAN.
- Commits: línea base 92098c3f2fc940dd90b0eb66069fb60997b85dd6; autorizado únicamente docs(recovery): approve F2 identity functional criteria. Hash definitivo se comunica tras crearlo; no se anticipa ni se requiere un segundo commit para insertarlo dentro de sí mismo.
- Reversión: ningún producto o dato afectado; cualquier reversión documental futura debe preservar historia y alcance de la autorización, no borrar decisiones silenciosamente. Decisión de aceptación final REC-F2-001: PENDIENTE.

## Punto de continuidad vigente — REC-F2-001 en diseño, 2026-11-06

- Inicio: master, HEAD 92098c3f2fc940dd90b0eb66069fb60997b85dd6, árbol limpio y staging vacío. Se mantiene F1 CERRADA DOCUMENTALMENTE CON CONDICIONES.
- Trabajo actual: registro de cuatro decisiones funcionales aprobadas por el PO; REC-F2-001 EN_CURSO solo análisis/diseño. No inicio de implementación ni autorización implícita de otras tareas F2.
- Archivos: únicamente SPEC, PLAN, TASKS y HALLAZGOS de recuperación; sin archivos nuevos. Índice, gobernanzas, históricos, código, TCE-004, pruebas, dependencias y configuración intactos.
- Comprobaciones: presencia de 17 fichas y 17 filas de matriz, siete tareas únicas, conservación de contenido histórico y correspondencia de criterios/estado entre documentos, alcance de staging y git diff --check. Sin pruebas de producto ni servicios externos.
- Protección de producción: Vercel Authentication informado por PO conservado; sin acceso a Vercel/Supabase, sin datos reales ni modificación productiva.
- Decisiones pendientes: alternativa técnica, responsabilidades, verificación/recuperación global, sesiones, mecanismo de candidato y entorno aislado; no aceptación final de diseño.
- Próximo paso autorizado: verificar, crear único checkpoint documental, informar hash/estado Git y detenerse. Después, esperar autorización para viabilidad técnica. No push/pull/fetch ni despliegue; hash posterior no anticipado.

## REC-F2-001 — documentación de viabilidad y protocolo preparado, 2026-11-06

- Autorización: PO «REC-F2-001: documentación de viabilidad y preparación de laboratorio», solo cuatro documentos existentes; no implementación, instalaciones, cuentas, pruebas, servicios ni commits. Inicio master, HEAD a3b536d6967d54ac83048192127514fd16b73e2b, árbol limpio y staging vacío.
- Estado: EN_CURSO, análisis y diseño; sin aceptación final ni viabilidad definitiva. Los cuatro criterios funcionales aprobados permanecen vinculantes; ninguna alternativa técnica aprobada.
- Evidencia obtenida: estudio previo conversacional y relectura de package.json instalados y fuentes SDK. Next 14.1.4; supabase-js/auth-js 2.110.0; SSR 0.12.0. Contraseña admite email/phone, no código arbitrario; scopes de logout y límite de JWT; contratos de cookies y API administrativa. Referencias y límites en SPEC «viabilidad local y requisitos de laboratorio».
- Resultado documental: comparación teléfono real/identidad técnica administrada y protocolo/matriz de nueve experimentos en PLAN «protocolo propuesto de laboratorio y experimentos». Nombres de escenarios son referencias locales, sin crear nuevas tareas permanentes ni duplicar hallazgos.
- Vínculos: REC-F2-002, esquema/identidad/membresías/RLS y estados; REC-F2-003, Storage/documentos y URLs; REC-F2-004, aislamiento/runtime/herramientas/credenciales de laboratorio; REC-F2-005, amenazas/origen/antiabuso/privilegios; REC-F2-006, integración Auth/SSR y regresiones. Sus estados PENDIENTES no cambian ni se ejecutan por el vínculo.
- Criterios de aceptación: completar matriz de PLAN con entradas sintéticas, esperado/observado/rechazo, versión/entorno y revisión; demostrar cobertura funcional sin confundir soporte SDK con garantía del backend. Las alternativas que no cubran requisitos se descartan o bloquean explícitamente. No aceptar arquitectura con recuperación global indebida, acceso privado por teléfono o aislamiento sin acreditar.
- Laboratorio requerido: independiente, endpoints locales y salida denegada, sin credenciales/configuración/datos productivos; Auth/BD/Storage locales o mocks explícitos; runtime >=22 por SDK y versiones fijadas; entrega SMS/correo/proveedores simulados, sin mensajes reales. Laboratorio NO provisionado ni verificado actualmente. No copiar .env ni crear usuarios ahora.
- Pruebas ejecutadas: ninguna. Nueve experimentos NO EJECUTADOS; tampoco documentación externa, Supabase, Vercel, migraciones o integración. No se crean credenciales ni fixtures reales al describir entradas.
- Riesgos: teléfono compartido/ausente/reciclado; legitimidad y ciclo de alias técnico; autoridad global de recuperación; revocación JWT diferida, refresh concurrente y cookies; RLS/Realtime/Storage directos; URLs firmadas ya emitidas; antiabuso/proveedor no confirmado.
- Decisiones PO pendientes: alternativa a comparar y política de identidad/recuperación, duraciones/revocación, cookies e intermediación, mecanismo candidato, responsables, herramientas/entorno, autorización de fuentes externas y pruebas, lugar/retención de evidencia y criterio de aceptación de riesgo.
- Próxima actividad propuesta: autorizar alcance de laboratorio y documentación externa pertinente; después proveer y verificar aislamiento mediante REC-F2-004 antes de pruebas autorizadas. No ejecutar esa secuencia por esta nota.
- Commits asociados: estudio/checkpoint funcional a3b536d6967d54ac83048192127514fd16b73e2b como base; estos añadidos SIN_COMMIT por prohibición actual. No se anticipa ni solicita commit ahora.
- Aceptación: PENDIENTE; sin hallazgos cerrados. F1 CERRADA DOCUMENTALMENTE CON CONDICIONES, TCE-003/012 pendientes; corrección local TCE-004 y protección temporal conservadas.

## Punto de continuidad vigente — protocolo de laboratorio sin ejecutar, 2026-11-06

- Actividad actual: documentación de estudio y preparación de validación aislada para REC-F2-001, EN_CURSO solo diseño. Este punto sucede a instantáneas previas; no altera evidencia ni permisos históricos.
- Inicio/final: master, HEAD a3b536d6967d54ac83048192127514fd16b73e2b; inicialmente limpio, al entregar únicamente SPEC/PLAN/TASKS/HALLAZGOS modificados, staging vacío, ningún archivo nuevo.
- Documentos: SPEC conserva capacidades verificadas y alternativas pendientes; PLAN contiene protocolo y matriz única de experimentos; TASKS registra vínculos/estado; HALLAZGOS conserva dependencias y límites sin duplicar fichas.
- Verificaciones documentales: conservación íntegra del contenido previo de los cuatro documentos; 17 fichas TCE y matriz de 17 filas, siete tareas únicas; nueve filas de experimentos y referencias con destino; alcance Git y git diff --check.
- Pruebas/servicios: ninguno ejecutado/iniciado. Sin instalaciones, cuentas, usuarios, credenciales, migraciones, datos reales, cambios producto/configuración/paquetes, Supabase/Vercel o producción. Protección temporal Vercel intacta; no comprobada remotamente.
- Decisiones/bloqueos: entorno independiente no acreditado; alternativas/mecanismos no aprobados; autoridad de recuperación y políticas de sesión pendientes; falta autorización para fuentes externas, provisión y experimentos.
- SIN_COMMIT, sin push/pull/fetch. No se declara viabilidad definitiva ni se acepta REC-F2-001. Siguiente paso autorizado: informar matriz y pendientes al PO, detenerse y esperar autorización; no iniciar laboratorio ni pruebas.

## REC-F2-004 — avance vigente de aislamiento local, 2026-11-06

- Autorización: PO «REC-F2-004: implementar aislamiento mínimo»; permite lanzador/copia/telemetría y pruebas ficticias de rechazo, además de cuatro documentos. No servicios, conexiones, SQL, cuentas, dependencias ni commits. Inicio master, HEAD 40dab9b14b2779386bec0a36ce9a268f07ed3ecb, árbol limpio y staging vacío.
- Estado vigente REC-F2-004: EN_CURSO, solo preparación y validación local del aislamiento de configuración; sucede a PENDIENTE inicial sin reescribirlo. Aceptación final PENDIENTE: laboratorio no operativo ni seguro integralmente acreditado.
- Confirmación PO, no observación remota: TCE-2-LAB, ref ieioysefckvafdbasqxl, organización Free, East US (North Virginia), Compute Nano. TuChamba-V2-Oficial producción permanece fuera de alcance.
- Objetivo/resultados: scripts/lab-launcher.cjs ofrece check/prepare sin servicios; ubicación privada prevista .lab-private/lab.config.json ignorada, no creada; URL exacta y origen https://localhost:3443; variables Supabase heredadas rechazadas por nombre sin acceder a sus valores; entorno previsto por allowlist; claves opacas/claims incompatibles fallan seguras. Configuración ficticia no acredita claves ni firma.
- Copia: allowlist de fuentes/activos del manifiesto a TEMP nuevo fuera del repositorio, sin .env, privados convencionales, cachés, .git, .vercel, documentos ni node_modules, sin enlaces simbólicos/junctions. Marcador no secreto bloquea arranque. Artefacto real de la suite: directorio TEMP tce-2-lab-run-szzfQ6; contiene fuentes del momento de prueba, sin configuración/dependencias/servicios. Otros directorios de la suite son fixtures sintéticos, no laboratorios activos. No recrearlos ni usarlos como copia productiva.
- Telemetría: modo NEXT_PUBLIC_TCE_LAB_MODE=true elimina GTM/Pixel/noscript y Lead en salidas offline probadas; modo no laboratorio conserva ramas previas. next.config bloquea servicios incluso con configuración sintácticamente correcta.
- Archivos creados: scripts/lab-launcher.cjs y tests/lab-isolation.test.cjs. Modificados: .gitignore, package.json (solo scripts), next.config.js, app/layout.tsx, components/candidato/VacanteDetalle.tsx y estos HALLAZGOS/SPEC/PLAN/TASKS. Sin lock, dependencias, código de API TCE-004, su suite, migraciones, configuración privada/productiva ni nuevos documentos de gobernanza.
- Requisitos/procedimientos: SPEC «REC-F2-004 — aislamiento mínimo local implementado», PLAN «procedimiento disponible y arranque bloqueado»; HALLAZGOS conserva límites/dependencias. REC-F2-001 sigue diseño, REC-F2-002/003/005/006/007 PENDIENTES; ninguna corrección de hallazgos cerrada.
- Evidencia ejecutada: node --test tests/lab-isolation.test.cjs: 18 tests, 18 PASS, 0 FAIL, 0 SKIP. Casos requeridos: ausente, URL incorrecta/manipulada, variables heredadas, origen HTTP/ajeno, ausencia de privados en copia y eliminación de telemetría en transformación/minificación offline. Incluye claves de otra ref, rol/clave opaca rechazados, traversal/junction y arranque bloqueado. No usar estos tests como integración Auth ni build Next.
- No ejecutadas: TypeScript global, suite TCE-004, Next build/dev/start, nueve experimentos de laboratorio, TLS/red, validez real de claves, Auth/SQL/RLS/Storage y pruebas contra servicios. Excluidas por autorización actual; ninguna instalación ni contacto externo.
- Riesgos/bloqueos: HTTPS y red no acreditados; dependencia de claves legacy con ref/rol (firma no verificada); claves opacas sin método offline aceptable; permisos locales del futuro archivo privado; copia sin dependencias; allowlist no detecta secretos arbitrarios incrustados en código elegible; telemetría probada no equivale a bloqueo de todo tráfico.
- Criterios de cierre pendientes: revisión del PO de guards y límites, provisión autorizada de configuración lab/HTTPS/red/dependencias y pruebas posteriores por alcance; no retirar bloqueo por una prueba local PASS. No se solicita ni inicia esa ampliación ahora.
- Reversión: cambios locales identificados en diff; producto/producción no desplegados. Retirar solo cambios de esta tarea si se autoriza, preservando TCE-004 y documentación histórica; limpieza TEMP exige rutas verificadas. SIN_COMMIT por restricción expresa.

## Punto de continuidad vigente — aislamiento local sin servicios, 2026-11-06

- REC-F2-004 EN_CURSO en preparación; REC-F2-001 en diseño y F1 CERRADA DOCUMENTALMENTE CON CONDICIONES. Diecisiete hallazgos ABIERTOS, discrepancias TCE-003/012 pendientes.
- Implementación local de configuración/copia/telemetría registrada; 18 pruebas de rechazo/offline aprobadas. No aceptación final del laboratorio ni viabilidad definitiva.
- Git: master y HEAD 40dab9b14b2779386bec0a36ce9a268f07ed3ecb, cambios locales de los archivos arriba listados y staging vacío; sin commits ni operaciones remotas.
- Documentación previa y evidencias preservadas mediante añadidos. Solo cuatro documentos de recuperación existentes modificados; no gobernanzas, históricos o índice. TCE-004 intacto.
- No lectura/copia/impresión de secretos existentes; no archivo de claves creado. Credenciales de pruebas deliberadamente ficticias y no válidas. No Supabase, Vercel, SQL, usuarios, datos remotos, servidores, dependencias o despliegues.
- Próximo paso autorizado: verificar integridad documental y diff, entregar resultados/bloqueos y detenerse; esperar revisión posterior antes de commit o ampliación de alcance.

- Revisión final local REC-F2-004, 2026-11-06, autorizada por el PO: revisados los 11 archivos previstos; corregido rechazo de enlaces duros en configuración privada y fuentes. Reforzadas las mismas 18 pruebas para comprobar check/prepare sin omitir destino/origen/herencia, impedir flags de bypass y conservar next.config vacío y telemetría/Lead sin modo laboratorio. Suite offline repetida: 18 PASS, 0 FAIL, 0 SKIP; sin servidor, red o secretos reales. Copia de validación temporal tce-2-lab-run-ek3Glv sin configuración/dependencias. TCE-004 y lock intactos; escaneo local de indicadores de secretos sin hallazgos, integridad de 17 fichas/siete tareas/nueve experimentos y git diff --check verificados antes del checkpoint. Los nueve experimentos siguen NO EJECUTADOS; TLS/egress, claves reales/opacas e integración pendientes. Autorizado un único commit feat(lab): isolate TCE test runtime and disable telemetry; hash definitivo se informa al PO tras crearlo, sin commit adicional. Este mandato sucede a la prohibición de commit de la implementación anterior, sin autorizar servicios ni producción.
## REC-F2-004 — avance de sonda mínima sin red, 2026-11-06

- Mandato PO: «implementar sonda mínima»; implementación offline, pruebas ficticias y cuatro documentos, sin conexión ni credenciales existentes. Inicio master, HEAD 9ecb4dd6c0686228da15f73600d309383c5ba31e, árbol limpio y staging vacío.
- Estado: EN_CURSO, preparación; aceptación final PENDIENTE. REC-F2-001 sigue diseño, demás tareas no iniciadas por esta intervención. F1 cierre documental condicionado y 17 hallazgos abiertos.
- Resultado: creado scripts/lab-probe.cjs y tests/lab-probe.test.cjs; modificados lanzador, script package y expectativa de error de test previo. lab:probe despacha un bloqueo antes de leer configuración o conectar; check/prepare conservan guardas y next.config permanece sin cambios.
- Contrato de endpoint: BLOQUEADO. Fuentes SDK prueban prefijo REST/apikey pero no autenticación de la raíz; GET /rest/v1/ es candidato simulado, no endpoint real aprobado. getUser requiere usuario. No se inventa validación ni se consulta documentación externa.
- Configuración/ACL: perfil separado de dos campos para URL/clave pública, .lab-private/probe.config.json NO creado. Validación de ubicación, enlaces/hardlinks, tamaño, Git ignore y ACL Windows (dueño actual, sin herencia, grants solo dueño/SYSTEM) antes de contenido; ningún valor real consultado. Puente Get-Acl probado con simulación, no ACL productiva ni de archivo de claves real.
- Red: no implementación real ni permiso de conexión. Descriptor simulado restringido a host LAB HTTPS/443/GET/ruta, sin redirects/proxy/reintentos; límites 10 s total y 64 KiB por respuesta; abort/errores sanitizados. No considerar esto un firewall o transporte ya verificado.
- Pruebas ejecutadas: node --test tests/lab-isolation.test.cjs tests/lab-probe.test.cjs; 36 PASS, 0 FAIL, 0 SKIP (18+18). Incluyen dispatch real con entorno OS mínimo: probe bloquea y --connect rechaza; cero lectura de credenciales/red. Fixture copia temporal de la regresión: tce-2-lab-run-KWbyk1, sin configuración/dependencias/servicios. Tests previos incluyen tokens ficticios por rol; ningún cliente privilegiado real utilizado.
- Evidencia: referencias de SDK y límites en SPEC; procedimiento, escenarios y criterios en PLAN; dependencia y estado en HALLAZGOS. Resultados simulatedHttpsReachable y códigos HTTP ficticios nunca se convierten en httpsReachable real (null) ni authenticationValidated (false).
- No ejecutado: conexiones Supabase/Vercel, autenticación real de clave, SQL, migraciones, usuarios/datos, servidores, build Next, suite TCE-004 o nueve experimentos originales. No instalación, cambio de ACL real ni archivo privado creado.
- Bloqueos: contrato oficial de endpoint, autorización de petición, futura implementación de transporte/egress y validación efectiva de ACL/claves. Claves opacas siguen rechazadas; claims legacy no validan firma. HTTPS local pendiente no es requisito para sonda saliente, sí para futura app.
- Archivos documentales: solo SPEC/PLAN/TASKS/HALLAZGOS existentes, mediante añadidos; no nuevos documentos de gobernanza. TCE-004, telemetría del checkpoint previo, lock/dependencias, históricos e índice intactos.
- Commits: SIN_COMMIT, no autorizado. Próximo paso: revisión PO de bloqueo/implementación offline y autorización específica de documentación de endpoint/transporte antes de probar red. No retirar LAB_SERVICES_NOT_AUTHORIZED.

## Punto de continuidad vigente — sonda bloqueada por contrato, 2026-11-06

- master, HEAD 9ecb4dd6c0686228da15f73600d309383c5ba31e; cambios locales de los archivos arriba listados, staging vacío, sin commits/operaciones remotas.
- REC-F2-004 EN_CURSO solo preparación offline; lab:probe no conecta ni abre archivo de credenciales; 36 pruebas offline aprobadas. No autenticación ni conectividad real demostradas.
- Integridad: 17 fichas TCE, siete tareas F2 y nueve experimentos originales preservados NO EJECUTADOS; evidencias previas íntegras. TCE-003/012 pendientes; protección Vercel conservada sin acceso remoto y TCE-004 intacto.
- Siguiente paso autorizado: verificar diff/integridad, entregar informe y detenerse. Esperar revisión; no iniciar red, configuración real ni preparación de base de datos.

## Punto de continuidad vigente — cierre offline autorizado, 2026-11-06

- Mandato PO actual sucede a SIN_COMMIT: revisión exclusivamente de nueve archivos pendientes y un único commit local `feat(lab): add offline Supabase connection probe` si revisión/pruebas pasan. Base master/9ecb4dd6c0686228da15f73600d309383c5ba31e; hash resultante se entrega tras crear el commit, sin commit adicional.
- Revisión de código offline aprobada; 36/36 PASS, 0 FAIL/SKIP con `node --test tests/lab-isolation.test.cjs tests/lab-probe.test.cjs`; `git diff --check` sin errores. Copia sintética temporal de regresión: tce-2-lab-run-eX5bw5, sin configuración/dependencias/servicios. No instalación ni lectura de credenciales existentes.
- Fuentes oficiales de anon/publishable y health consultadas; enlaces y límites en SPEC, procedimiento futuro en PLAN. GET /auth/v1/health propuesto, sin contrato demostrado de rechazo de clave inválida. Validación de clave BLOQUEADA; GET /rest/v1/ no acredita autenticación. Alternativa: evidencia oficial del contrato y mantener simulaciones; sin ampliar infraestructura.
- Bloqueos concretos: contrato diferencial del gateway, autorización de peticiones/lectura, procedencia pública exclusiva LAB, ACL efectiva, transporte DNS/TLS/egress revisado; soporte publishable pendiente porque guardas actuales exigen legacy. No habilitación por flag.
- Implementación offline cerrada. REC-F2-004 permanece EN_CURSO sin aceptación integral; REC-F2-001 en diseño. Se conservan 17 hallazgos abiertos, siete tareas F2 y nueve experimentos NO EJECUTADOS; TCE-004 y producción intactos. Conexiones reales y arranque general bloqueados. Tras commit local e informe Git final, detenerse; sin push/pull/fetch/despliegue.

## Punto de continuidad vigente — diseño mínimo REC-F2-001/002, 2026-11-06

- Autorización: PO «Continuidad F2 y diseño mínimo multiagencia», solo revisión local y actualización de SPEC/TASKS/PLAN/HALLAZGOS existentes. Inicio master, checkpoint esperado/confirmado 65fa41829a1beb0e5c17d467ed6b057ab5120d88, árbol limpio y staging vacío. Sin nuevos documentos, código, migraciones, servicios, credenciales/datos reales ni commits; no operaciones remotas.
- Precedencia consultada: gobernanzas → SPEC → TASKS → PLAN → HALLAZGOS → comprobación acotada de código. spec.md §2/§3 y HU-18 consultados por remisión expresa de gobernanza para conservar contrato histórico, sin modificarlo. DEC-REC-005 no ratifica integralmente gobernanzas 0.1. No nueva fase ni auditoría.
- Hooks: `git config --show-origin --get-all core.hooksPath` no devolvió configuración efectiva; `git rev-parse --git-path hooks` resolvió .git/hooks, donde solo existen 14 archivos .sample y ningún hook activo relevante de commit. No se ejecutaron ni alteraron hooks/configuración. El commit anterior se creó mediante `git -c core.hooksPath=NUL commit ...`: opción temporal por comando para evitar potenciales servicios/conexiones fuera del mandato. El historial de herramientas acredita esa motivación preventiva; la inspección actual no acredita que hubiera un hook activo ni una validación efectiva omitida. No presentar omisión como requisito de gobernanza o garantía de seguridad; no persistió core.hooksPath.
- Requisitos ratificados recuperados: los cuatro acuerdos de SPEC (código+contraseña sin correo/SMS habitual; identidad global/membresías locales; recuperación verificable sin toma global local; postulación pública y privados por recurso), más contratos históricos de roles preservados. No se seleccionó mecanismo Auth, recuperación, sesión ni permiso global nuevo.
- Entregable propuesto: modelo lógico agencias/usuarios/reclutadores/membresías, compatibilidad de coordinadores y administradores, matriz actor-operación-recurso-agencia, ocho invariantes y decisiones pendientes en SPEC; casos negativos/positivos, concurrencia y secuencia LAB en PLAN. Sin DDL, migraciones ni afirmación de esquema real.
- Estado vigente: REC-F2-001 EN_CURSO solo análisis/diseño, sin aceptación final. REC-F2-002 pasa de PENDIENTE a EN_CURSO exclusivamente para diseño conceptual bajo mandato actual; inventario/contraste BD, implementación y pruebas siguen NO EJECUTADOS. Este cambio no declara cumplidos criterios originales de REC-F2-002 ni autorización de acceso. REC-F2-004 EN_CURSO, offline cerrado pero laboratorio/conexiones/arranque bloqueados; REC-F2-003/005/006/007 PENDIENTES. F1 CERRADA DOCUMENTALMENTE CON CONDICIONES; ningún hallazgo cerrado.
- Criterios de revisión del entregable: no duplicar identidad; vínculo estable Auth; estados global/local separados; sin poderes administrativos por es_maestro; matriz cruzada con denegación efectiva y controles positivos; decisiones no ratificadas identificadas; secuencia con permisos de entorno y reversión por incremento. Aceptación PO y revisión técnica independiente pendientes; el agente autor no se declara revisor independiente.
- Comprobaciones realizadas: checkpoint/Git/hooks, lectura documental y compatibilidad estática acotada; preservación de prefijos históricos de cuatro documentos, 17 fichas/matriz técnica, siete fichas F2 y nueve experimentos originales; alcance de cuatro archivos y `git diff --check`. No pruebas de producto, Auth/RLS/Storage/concurrencia o servicios ejecutadas. Las 36 pruebas offline pertenecen al checkpoint previo y no se presentan como repetidas ahora.
- Decisiones PO: mapeo código–Auth, vinculación/códigos, autoridad global/recuperación, modelo físico y coexistencia de roles, edición/baja compartida, sesión/revocación, mecanismo candidato, referidos/negocios compartidos, ejecutor/revisor y permisos LAB. Propuestas de SPEC no sustituyen acuerdos ratificados. TCE-003/012 siguen discrepancias históricas pendientes.
- Reversión documental: añadidos delimitados, historia intacta; no hay cambios de producto/datos que revertir. SIN_COMMIT, staging vacío; no se solicita ni crea commit. Protección temporal Vercel y corrección TCE-004 intactas, sin verificación remota.
- Siguiente tarea exacta del plan: REC-F2-001, revisar con PO y documentar decisión del mapeo código individual + contraseña a identificador legítimo Supabase Auth y autoridad de recuperación global, con alternativas/casos no cubiertos de SPEC. Después ajustar modelo/matriz REC-F2-002; no iniciar implementación. Ahora entregar y detenerse para revisión; pruebas en TCE-2-LAB requieren resolver REC-F2-004 y autorización independiente.

## Punto de continuidad vigente — ratificación PO-F2-001-A/B/C, 2026-11-06

- Mandato: PO «REC-F2-001: registro de decisiones ratificadas por el PO», exclusivamente documental. Inicio confirmado master/65fa41829a1beb0e5c17d467ed6b057ab5120d88; solo SPEC/TASKS/PLAN/HALLAZGOS modificados desde la intervención anterior, staging vacío. Añadidos anteriores preservados; no archivos nuevos ni commit.
- Decisiones funcionales/de arquitectura CERRADAS en el alcance ratificado, APROBADAS POR EL PO: PO-F2-001-A (código+contraseña con identidad técnica estable y Supabase Auth, sin correo personal/SMS habitual), B (verificación independiente sin apropiación unilateral por coordinador) y C (identidad, rol, agencia del recurso, membresía activa/permisos vigentes y controles servidor/BD/RLS cuando proceda). Texto íntegro vinculante en SPEC «decisiones ratificadas PO-F2-001-A/B/C»; no cierre de tareas por esta aprobación.
- Diseño técnico PENDIENTE: formato/mapeo/protección del identificador técnico, almacenamiento/custodia, enumeración, alta y credenciales; autoridad/factores/procedimiento de recuperación y revocación; sesión; modelo físico y compatibilidad de IDs/tablas; políticas/grants/RLS, integridad y concurrencia. No se aprueba un mecanismo particular ni se reabre la elección de identidad técnica ratificada.
- Implementación REC-F2-001/002: NO INICIADA. Pruebas de laboratorio: NO EJECUTADAS; nueve experimentos originales intactos y pendientes. El experimento telefónico anterior se conserva como planificación histórica, no como alternativa elegida ni prueba autorizada; su eventual pertinencia se revisará conforme a A sin eliminar la matriz original. No se repitieron las 36 pruebas offline del checkpoint.
- Estados: REC-F2-001 EN_CURSO solo diseño y REC-F2-002 EN_CURSO solo diseño conceptual, ambas sin aceptación final ni cierre. REC-F2-004 conserva offline cerrado y bloqueos de conexión/arranque, aceptación integral pendiente. REC-F2-003/005/006/007 PENDIENTES. F1 CERRADA DOCUMENTALMENTE CON CONDICIONES; 17 hallazgos ABIERTOS, TCE-004 EN_VALIDACION e intacto.
- Contradicciones/compatibilidad: no contradicción funcional nueva detectada frente a los cuatro acuerdos previos y contratos de coordinadores, administradores Maestro/Limitado, reclutadores compartidos y candidatos. A sucede explícitamente a alternativas no seleccionadas de las instantáneas previas. Aplicación detallada de C a facultades transversales administrativas pendiente, sin inventar excepción ni membresías locales nuevas; incompatibilidad concreta futura se eleva al PO. TCE-003/012 conservan discrepancias históricas.
- Comprobaciones exclusivamente documentales: lectura de gobernanzas y cuatro documentos; preservación de contenido previo incluido trabajo pendiente, 17 fichas/matriz técnica, siete tareas F2, nueve experimentos originales; tres decisiones en SPEC y trazabilidad en los cuatro documentos; alcance Git y `git diff --check` sin errores. No pruebas ejecutables, SQL/migraciones, credenciales, servidores, Supabase/Vercel ni producción.
- Próximo paso concreto REC-F2-001: especificar para revisión el contrato técnico del código→identidad técnica→sujeto Auth→reclutador, incluyendo protección contra enumeración y ciclo de credenciales, y el procedimiento de recuperación independiente con autoridad/factores/revocación aún no aprobados. Luego REC-F2-002: diseño físico compatible y matriz de políticas RLS/límites conforme a PLAN, sin ejecutar ni crear SQL. Autorización de diseño detallado posterior según alcance que ratifique el PO; no comenzar por esta nota.
- Autor material: agente bajo mandato; aceptación del PO y revisión técnica independiente pendientes. Reversión documental por añadidos delimitados preservando historia; producto/datos no afectados. SIN_COMMIT, sin push/pull/fetch/deploy, staging vacío. Entregar y detenerse para revisión del PO.

## Punto de continuidad vigente — propuesta PO-F2-001-D, 2026-11-06

- Mandato PO «REC-F2-001: ampliación coordinador multiagencia», solo cuatro documentos existentes. Confirmados master y HEAD 65fa41829a1beb0e5c17d467ed6b057ab5120d88; inicio con SPEC/TASKS/PLAN/HALLAZGOS pendientes y staging vacío. Contenido anterior, incluidas A/B/C ratificadas, preservado íntegramente; no commit ni archivos adicionales.
- PO-F2-001-D registrada como PROPUESTA FUNCIONAL PENDIENTE DE RATIFICACIÓN FORMAL FINAL DEL PO, no decisión aprobada. Texto de diez puntos, compatibilidad y pendientes técnicos en SPEC «PO-F2-001-D, coordinador multiagencia y autorización híbrida». A/B/C conservan aprobación y alcance. La ampliación propuesta de coordinador de una a varias agencias no está habilitada operativamente.
- REC-F2-001 EN_CURSO diseño: incorporar identidad global del coordinador, contexto por agencia y autorización central más aceptación; obtener ratificación final D y después especificar contrato detallado. No cambiar el login de coordinador por inferencia de A ni otorgar recuperación global por asignar membresía.
- REC-F2-002 EN_CURSO solo diseño conceptual: modelar membresías/estados/permisos independientes, compatibilidad con coordinadores.agencia_id e IDs existentes, unicidad/concurrencia y límites servidor/BD/RLS. Diseño físico, políticas y contraste efectivo pendientes; no SQL/migraciones ni acceso a BD.
- REC-F2-006 PENDIENTE: planificar integración futura con coordinador compartido, autorización central y aceptación independientes, revocación local, permisos expresos y concurrencia. TCE-004 se preserva y su validación integral sigue primero cuando se autorice entorno operativo. No pruebas ejecutadas.
- REC-F2-007 PENDIENTE: ampliar cobertura prevista de rol coordinador a selección/cambio de agencia, mensajes/errores, contexto visible, navegación y accesibilidad; evitar caché/datos mezclados. Mantener cobertura de reclutadores compartidos, administradores y candidatos. No nueva tarea ni fase.
- IA: posibilidad futura condicionada, sin agente implementado o habilitado, sin nuevas credenciales/permisos ni ejecución autónoma. Facultades expresas, riesgo, límites, auditoría/revocación y escalamiento humano siguen por definir/aprobar; prohibida autoasignación o edición de reglas por el agente.
- Verificaciones documentales: conservación por longitud/huella del prefijo de cada archivo pendiente; A/B/C intactas; 17 fichas/matriz técnica, siete tareas F2 y nueve experimentos originales preservados; git diff --check sin errores y alcance Git solo cuatro documentos. Pruebas de producto/laboratorio NO EJECUTADAS. Sin código, SQL, migraciones, credenciales, servidores, Supabase/Vercel, producción u operaciones remotas.
- Estados restantes sin cambio: REC-F2-004 EN_CURSO con offline cerrado pero conexión/arranque bloqueados; REC-F2-003/005 PENDIENTES. F1 CERRADA DOCUMENTALMENTE CON CONDICIONES; 17 hallazgos abiertos y TCE-004 EN_VALIDACION. No cierre REC-F2-001/002 por documentar D.
- Próximo paso exacto: revisión del PO de D y ratificación final o ajustes explícitos, especialmente alcance multiagencia del coordinador y facultad central de asignación. Mantener preparación del contrato técnico REC-F2-001 bajo A/B/C y, tras decisión sobre D, traducir alcance ratificado a REC-F2-002. Ahora entregar y detenerse; SIN_COMMIT, staging vacío. Reversión documental futura delimitada sin borrar decisiones/historia.

## Punto de continuidad vigente — A/B/C/D ratificadas y checkpoint documental, 2026-11-06

- Fuente/autoridad: PO, mandato «REC-F2-001: ratificación D, consolidación A/B/C/D y checkpoint». Inicio confirmado master/65fa41829a1beb0e5c17d467ed6b057ab5120d88, únicamente cuatro documentos esperados modificados y staging vacío. Se incluyen íntegros los añadidos pendientes anteriores; D se actualiza en su sección SPEC, conservando antecedente y sucesión de estado. Gobernanzas consultadas sin modificación.
- APROBADAS POR EL PO: PO-F2-001-A, autenticación del reclutador código+contraseña con identidad técnica estable en Supabase Auth; B, recuperación verificable independiente sin control unilateral de credencial global; C, identidad/rol/agencia/recurso/membresía activa/permisos vigentes en límites servidor/BD/RLS cuando proceda; D, coordinador multiagencia y autorización híbrida bajo sus diez condiciones. A/B/C no se alteran. D deja de estar pendiente de ratificación; el supuesto anterior de coordinador de una sola agencia queda sucedido funcionalmente, sin autorizar implementación.
- REC-F2-001 EN_CURSO solo diseño: contrato detallado de mapeo/protección/almacenamiento/anti-enumeración y ciclo de credenciales, recuperación independiente/autoridad/factores/revocación y sesión todavía pendientes. Para coordinador multiagencia: invitación, aceptación, autorización central, auditoría y revocación por diseñar. Delegación futura IA condicionada; no implementada ni autorizada aquí.
- REC-F2-002 EN_CURSO solo diseño conceptual: representación física compatible, vínculos estables/IDs, fuente autoritativa de membresías/permisos, unicidad/FK/estados/transacciones, concurrencia, grants/RLS y límites por canal pendientes. No esquema efectivo inspeccionado ni SQL/migraciones creados/ejecutados.
- REC-F2-006 y REC-F2-007 PENDIENTES: integración/concurrencia/regresión y cobertura funcional por rol/agencia no ejecutadas. Validar primero TCE-004 existente cuando se autorice entorno operativo; mantener Maestro/Limitado y protección del candidato/reclutadores compartidos. REC-F2-004 continúa EN_CURSO sin aceptación integral, conexión/arranque bloqueados; REC-F2-003/005 PENDIENTES. Implementación REC-F2-001/002 NO INICIADA; nueve experimentos originales NO EJECUTADOS. No se cierra ninguna tarea ni hallazgo.
- Verificaciones de checkpoint: revisión del diff completo de las cuatro rutas, alcance exclusivo documental, conservación de 17 fichas/matriz técnica, siete tareas F2 y nueve experimentos originales; decisiones A/B/C intactas y A/B/C/D aprobadas; estados de tareas/pendientes conciliados y git diff --check sin errores. No pruebas ejecutables ni nueva evidencia de Auth/RLS/Storage. Las 36 pruebas offline siguen evidencia del checkpoint anterior, no repetidas.
- Commit autorizado UNO: `docs(rec-f2): ratify multiagency identity and authorization decisions`, solo SPEC/TASKS/PLAN/HALLAZGOS, incluidos sus cambios pendientes. Sin opciones para omitir hooks ni cambio de configuración Git. Hash definitivo se entrega después de crearlo, sin otro commit para insertarlo en sí mismo. Las prohibiciones de commit y ratificación D pendiente anteriores son instantáneas históricas sucedidas por este mandato delimitado.
- Próxima tarea exacta REC-F2-001: especificar para revisión el contrato técnico código→identidad técnica→sujeto Auth→reclutador (custodia, enumeración, credenciales y recuperación independiente) e identidad global/coordinador→membresías por agencia (autorización central más aceptación, auditoría y revocación), conforme a A/B/C/D ya ratificadas. Después REC-F2-002: traducirlo a modelo físico compatible y matriz de políticas RLS/límites. No volver a solicitar ratificación funcional de D; resolver detalles técnicos mediante revisión/autorización posterior. PLAN «secuencia técnica consolidada A/B/C/D» fija el orden y puertas futuras.
- Autor material: agente bajo mandato; aceptación técnica/revisión independiente pendientes. F1 CERRADA DOCUMENTALMENTE CON CONDICIONES; 17 hallazgos abiertos, TCE-004 EN_VALIDACION y discrepancias históricas TCE-003/012 intactas. Ningún código, producción, dato/credencial, servicio o agente afectado. Reversión documental delimitada preservando historia; sin operaciones remotas. Tras único commit y comprobación de árbol limpio, informar y detenerse.

## Punto de continuidad — contrato técnico propuesto REC-F2-001, 2026-11-06

Mandato PO «Implement the plan»: cuatro documentos exclusivamente, base master/580ef81828e56cf2ac2f57074be9c4303bd61adc, inicio limpio. A/B/C/D aprobadas intactas. SPEC añade contrato técnico propuesto; PLAN compatibilidad/secuencia/casos; HALLAZGOS riesgos. Preferencias confirmadas: SSR/navegador y política candidata de recuperación para revisión, sin ratificar mecanismo particular.

REC-F2-001/002 EN_CURSO solo diseño; REC-F2-006/007 PENDIENTES. Implementación pendiente, pruebas NO EJECUTADAS. Contrato distingue requisitos ratificados, diseño propuesto, decisiones PO y bloqueo de recuperación. No código/SQL/migraciones, credenciales, datos reales, instalaciones, servicios, agentes, producción ni operaciones remotas. No commit autorizado.

Siguiente tarea exacta: revisión PO del contrato REC-F2-001 y política candidata de recuperación (autoridad, factores, canal, plazos y revocación), además de namespace/provisión y parámetros de sesiones/antiabuso; luego REC-F2-002 traducir contrato revisado a diseño físico compatible y matriz RLS, sin acceso/implementación por inferencia. Mantener REC-F2-004 y conexión/arranque bloqueados. No cierre de tareas/hallazgos. Verificación documental: prefijos previos conservados, 17 fichas/siete tareas/nueve experimentos originales y git diff --check; no repetición de 36 pruebas offline. Entregar y detenerse, SIN_COMMIT.


## Punto de continuidad — inventario funcional original del PO, 2026-11-06

Autorización PO: inventario/análisis de impacto y continuación con ruta original C:/Users/jgonz/Desktop/Pendientes TCE2_0.docx. Base master/580ef81828e56cf2ac2f57074be9c4303bd61adc; inicio con solo cuatro documentos pendientes del contrato técnico, staging vacío. DOCX existente, legible íntegro: 24 párrafos no vacíos/72 nodos texto, sin partes adicionales de contenido ni dibujos; SHA-256 en SPEC. Transcripción completa y 30 IDs MF-PO-001…030, con remisión a párrafo original y separación de solicitudes concatenadas; P02 es encabezado. Validación funcional/prioridades PO pendientes.

SPEC incorpora original e inventario con necesidad/rol/estado/evidencia/aceptación/prioridad; PLAN matriz de impactos datos/seguridad/permisos/UI/integraciones y dependencias por grupo; HALLAZGOS hechos estáticos e hipótesis explícitas. Se conservan íntegros contrato técnico pendiente, política candidata de recuperación NO APROBADA y A/B/C/D ratificadas. Sin fases/tareas nuevas ni mejoras implementadas. RFC consulta y validación no se fusionan sin PO.

REC-F2-001/002 EN_CURSO diseño; REC-F2-003/006/007 conservan sus trabajos pendientes; REC-F2-004 red/arranque bloqueados. No cierre de tareas ni 17 hallazgos. Prioridad sugerida P1: decisiones de datos/aislamiento/historial/cupos; P2 interacción/catálogos/chat; P3 usabilidad/editorial, todas por aprobar. IA solo intención futura, sin funcionalidades ratificadas/agentes diseñados.

Siguiente tarea exacta: revisión PO del inventario MF-PO, especialmente traslado versus nueva postulación, retención/borrado de chat, alcance WhatsApp, propiedad de planta/archivos, cardinalidad de pases, estados catálogo, IDs/reimportación, cupo y atribución. Conciliar esas decisiones con contrato técnico REC-F2-001; luego REC-F2-002 diseñar únicamente relaciones/claves/RLS con alcance resuelto. No iniciar implementación ni acceso a LAB por este registro.

Verificaciones: preservación del prefijo de los cuatro archivos, inventario 30 filas contra transcripción de 24 párrafos íntegra, 17 fichas/siete tareas/nueve experimentos originales, alcance Git y git diff --check. Son controles documentales, no pruebas del producto. Sin instalaciones/SQL/migraciones/código, credenciales/datos reales, servicios externos, servidores, push/pull/fetch/deploy ni commit. Entregar informe y detenerse para revisión.

## Punto de continuidad — decisiones DF/DA y recuperación consolidadas, 2026-11-06

Mandato PO «Consolidación documental de decisiones del PO», solo cuatro documentos existentes. Inicio master/580ef81828e56cf2ac2f57074be9c4303bd61adc; cuatro modificaciones pendientes de contrato/inventario, staging vacío. Gobernanzas y documentos consultados; añadido íntegro sin descartar trabajo anterior. A/B/C/D, 30 referencias MF y transcripción original se conservan.

Ratificado por PO: DF-PO-001 nueva postulación con identidad/expediente y anteriores preservados, sin traslado automático de comisión/referido; DF-PO-002 archivo/ocultamiento sin eliminar mensajes ni efectos en postulaciones/comisiones; DF-PO-003 propiedad documental por entidad y reutilización autorizada sin acceso universal; DF-PO-004 pausa de recepción al agotarse disponible, conservación y reactivación autorizada sin sobreasignación; DF-PO-005 SOLO investigación futura WhatsApp. DA-PO-001 ratifica gestión operativa supervisada, capacidades objetivo, control humano exclusivo y límites; ninguna capacidad implementada/habilitada. Recuperación: vía ordinaria con factor verificado/controlado por titular y excepcional central independiente; detalles no aprobados.

SPEC contiene requisitos/invariantes/aceptación; PLAN matriz de relación MF/REC-F2 e impactos/secuencia; HALLAZGOS riesgos e hipótesis sin nueva comprobación técnica. DF/DA son decisiones, no nuevas tareas F2/hallazgos/experimentos. Notas previas «IA sin funciones ratificadas», traslado frente a nueva postulación, borrar frente a archivar y recuperación solo central se conservan históricas y quedan precisadas por esta consolidación. No se aprueban en bloque restantes MF ni prioridades.

Estados: REC-F2-001/002 EN_CURSO solo diseño; REC-F2-003/005/006/007 conservan pendientes; REC-F2-004 conexión/arranque bloqueados, aceptación integral pendiente. 17 hallazgos abiertos, TCE-004 EN_VALIDACION y discrepancias TCE-003/012 intactas. Implementación PENDIENTE, validación PENDIENTE; nueve experimentos originales NO EJECUTADOS. Sin ejecución de pruebas de producto.

Próxima tarea exacta: REC-F2-001, especificar para revisión las reglas pendientes de cierre/simultaneidad/atribución/comisiones por postulación, consulta/restauración/retención de chat, acceso/reutilización documental, semántica de cupo/causas de pausa/reactivación y recuperación dos vías (factores/autoridades/plazos/canales), junto con contrato de control/acciones IA-humano. Después REC-F2-002 traducir alcance revisado a modelo físico y matriz de autorización/RLS compatible, contemplando necesidades DA sin construir agente. Investigación WhatsApp es futura y separada de implementar transferencia; no consultar fuentes externas ahora.

Comprobaciones documentales: conservación por longitud/huella de prefijos de cuatro archivos; presencia DF-PO-001…005/DA-PO-001 y dos vías; compatibilidad A/B/C/D; 17 fichas/matriz, siete tareas, nueve experimentos y 30 filas MF intactos; git diff --check y alcance exclusivo de cuatro rutas. Sin código/SQL/migraciones/servicios/credenciales/datos reales/instalaciones/agentes ni cambios de gobernanza/producción. SIN_COMMIT, staging vacío y mismo HEAD; ningún push/pull/fetch/deploy. Informar y detenerse para revisión PO.

## Punto de continuidad — DC-PO-001…004 y prioridad de recuperación, 2026-11-06

Autorización: PO «Actualización documental REC-F2-001», solo cuatro documentos. Inicio master/5584c79ec867ace57619eafe7e93b42a3d279437, árbol limpio y staging vacío. Gobernanzas/documentos consultados; contenido anterior preservado. SPEC registra reglas DC-PO-001/002/003 ratificadas y DC-PO-004 como invariantes/mecanismos propuestos para validar; PLAN dependencias/orden; HALLAZGOS evidencia previa/riesgos. A/B/C/D, DF, DA, recuperación dos vías y 30 MF intactos.

Orden expreso: reparar hallazgos → validar técnica/seguridad con evidencia → mejoras posteriores autorizadas. Dependencia técnica requiere autorización expresa propia; no se implementa por anticipar documentos. Sin nueva fase, tarea ni agente.

REC-F2-001 EN_CURSO diseño: precisar admisión/reserva al confirmar cita, estados independientes, comandos humanos autorizados y supervisión IA sin cambios autónomos de cupo/resultados. DF-PO-004 sigue vigente y su interacción con lista de espera/reservas pendiente. REC-F2-002 EN_CURSO diseño: modelo físico, transacciones/idempotencia/concurrencia y RLS por diseñar, sin esquema congelado, SQL ni migraciones. Implementación PENDIENTE; validación PENDIENTE. REC-F2-006/007 conservan trabajo futuro de pruebas/cobertura NO EJECUTADO; REC-F2-004 conexión/arranque bloqueados.

Siguiente tarea exacta: revisión PO de interacción DF-PO-004–DC y pendientes (lista de espera, plazos/escalamiento, reaplicación/simultaneidad, citas excepcionales sin reserva, ajustes de capacidad, reactivación y liberación/reversión poscontratación); después completar en REC-F2-001 comandos/transiciones auditables y propuesta de invariantes, y preparar REC-F2-002 solo con alcance resuelto, priorizando correcciones de hallazgos. No reabrir evento de reserva ya ratificado ni inventar política para los casos abiertos. Cita vencida/alerta no libera, contratación no consume dos veces y reagendar no duplica.

Verificaciones documentales: prefijos de los cuatro archivos conservados; decisiones DC/DF/DA compatibles en alcance explícito, límites pendientes identificados; 17 fichas y matriz, siete tareas, nueve experimentos originales y 30 MF preservados. git diff --check sin errores; solo cuatro rutas modificadas, mismo HEAD y staging vacío. No pruebas de producto, servicios, datos/credenciales, código, migraciones, dependencias, producción ni cambios de gobernanza. Sin commit/push. Ninguna tarea/hallazgo cerrado; entregar y detenerse para revisión PO.

## Punto de continuidad — cinco P0 ratificadas CT-01/CT-02, 2026-11-06

Mandato PO «Consolidación documental de cinco decisiones P0», exclusivamente cuatro documentos. Inicio master/8eb9ca9b4d0615cf887c683239b38162f5893925, árbol y staging limpios. Gobernanzas y cuatro documentos leídos; contrato previo, A/B/C/D, DF/DA/DC, 17 fichas, siete tareas, nueve experimentos y 30 MF preservados.

Estado funcional: APROBADAS POR EL PO las cinco direcciones: (1) canal previamente verificado o códigos de un uso mediante enrolamiento seguro; (2) revisión central independiente ordinaria y dos aprobaciones independientes en privilegiadas/alto riesgo; (3) recuperación completada revoca sesiones previas, exige autenticación nueva y no autoriza por mera vigencia JWT; (4) matriz por rol y delegaciones por operación/ámbito/vigencia revocables/auditables sin autoelevación; (5) enrolamiento heredado ambiguo asistido por coordinador, verificación independiente antes de activar/vincular, sin fusiones ni apropiación por código/contacto y conservando IDs/historia. Texto normativo único en SPEC, impactos/secuencia PLAN y riesgos HALLAZGOS.

CT-01 y CT-02 NO CERRADOS documentalmente; REC-F2-001/002 EN_CURSO solo diseño. Falta especificar mecanismos/evidencias/actores concretos, plazos/enrolamiento/canales, clasificación de riesgo, revocación efectiva y fallos Auth–BD, matriz detallada/concedentes y migración/reconciliación. Implementación PENDIENTE y validación técnica PENDIENTE; ninguna prueba ejecutada. No se convierte análisis previo en diseño técnico íntegramente aprobado.

Siguiente tarea: REC-F2-001 completar para revisión los contratos de enrolamiento/recuperación/revocación CT-01 y permisos/delegaciones/membresías CT-02 bajo las cinco políticas ya ratificadas, con casos positivos/negativos, concurrencia y plan de migración; obtener revisión/aceptación documental separada antes de transición autorizada a REC-F2-002. No volver a pedir aprobación de esas cinco direcciones. Políticas concretas no definidas y demás pendientes DF/DC siguen abiertos. Corrección de hallazgos y validación con evidencia anteceden mejoras; no iniciar implementación.

Controles: conservación de prefijos por huella/longitud de cuatro archivos, cinco reglas presentes y coherentes, antecedentes/17 fichas/siete tareas/nueve experimentos NO EJECUTADOS/30 MF intactos y git diff --check. Solo cuatro documentos modificados, staging vacío y mismo HEAD, SIN_COMMIT. Sin código, SQL/migraciones, servicios, datos personales/secretos, pruebas de producto, gobernanzas u otros archivos. Ningún hallazgo/tarea cerrado; entregar y detenerse para revisión PO.

## Punto de continuidad — seis políticas operativas CT-01/CT-02, 2026-11-06

Mandato PO «Consolidación de seis políticas operativas ratificadas CT-01/CT-02». Inicio master/419b6d2b1348dfa193e63093606b275a6c4a6f76, árbol limpio/staging vacío; únicamente cuatro documentos autorizados. SPEC incorpora políticas/invariantes/aceptación; PLAN avance/condiciones; HALLAZGOS riesgos/trazabilidad. Contenido anterior y cinco P0 preservados.

APROBADAS POR EL PO: POL-CT01-01 verificación central independiente proporcional al riesgo sin titularidad unilateral del coordinador; POL-CT01-02 dos aprobaciones centrales distintas/facultadas para privilegiadas o alto riesgo incluso ordinarias; POL-CT02-01 concedentes/revocadores definidos por central y delegaciones acotadas, sin autoconcesión/subdelegación/escalamiento; POL-CT01-03 recuperación gradual con factores verificados, autorizaciones limitadas/de un uso, factores comprometidos/sustituidos inválidos y revocación global; POL-CT01-04 sesiones diferenciadas por riesgo, cierre actual/global y rechazo efectivo de sesión revocada pese a JWT; POL-CT02-02 suspensión bloquea agencia al usuario, conserva historia y solo otros actores explícitamente autorizados la consultan con finalidad/alcance/auditoría, sin alterar otras membresías.

Pendiente técnico: evidencias y responsables concretos, parámetros de riesgo/sesiones/recuperación, catálogo de facultades y concedentes designados, retención/finalidad y mecanismos servidor/BD/RLS/canales directos, consistencia/fallos/concurrencia. No se ratifica estructura física ni análisis conversacional completo. CT-01/CT-02 y REC-F2-001 ABIERTOS; REC-F2-001/002 EN_CURSO diseño, implementación PENDIENTE y validación PENDIENTE. Ninguna política habilitada por documento.

Siguiente tarea exacta REC-F2-001: completar matriz operativa, estados/transiciones, pre/postcondiciones y errores seguros con trazabilidad seis POL→cinco P0→A/B/C/D, resolver detalles concretos y obtener revisión/aceptación documental separada; luego preparar transición autorizada REC-F2-002 sin iniciarla automáticamente. No pedir nueva aprobación de las seis políticas ratificadas. Reparar hallazgos, validar con evidencia y solo después mejoras autorizadas; pendientes DF/DA/DC intactos.

Verificaciones documentales: diff completo y git diff --check; antecedentes/prefijos conservados; 17 fichas/matriz, siete tareas F2, nueve experimentos NO EJECUTADOS y 30 MF preservados; seis políticas presentes. Solo cuatro rutas modificadas, mismo HEAD/staging vacío, SIN_COMMIT. Sin código/SQL/migraciones/gobernanzas/otros archivos, pruebas de producto, servicios, secretos/datos reales ni agentes implementados. Ningún hallazgo cerrado; TCE-004 EN_VALIDACION y discrepancias TCE-003/012 permanecen. Entregar y detenerse para revisión PO.

## Punto de continuidad — consolidación documental R1 autorizada e incorporada, 2026-11-07

Mandato PO «AUTORIZACIÓN PO: Consolidación documental CT-01/CT-02 R1»: escritura expresamente autorizada únicamente en SPEC, HALLAZGOS, PLAN y TASKS de recuperación. Sucede al mandato previo de preparar plan/diff sin escribir; no queda pendiente autorización de esta escritura. Base verificada master/5e0cb789927d6b5ab8892b33cfce38f6cdfd75da, árbol/staging inicialmente limpios. Cuatro documentos disponibles y conformes con HEAD; R1 y diff íntegros en el contexto de sesión y propuesta original accesible con hash registrado en SPEC. Sin discrepancia de preflight que impida consolidar.

Escritura documental realizada:
- SPEC: bloque autosuficiente R1, fuente/sucesión, separación central/agencia e I-11 ratificadas; modelo lógico, permisos, convenciones, pre/postcondiciones/invariantes, estados, I-01–I-11, A-01–A-12, M-01, concurrencia/reconciliación Auth–BD, delegaciones/escalamiento, despacho IA, superficies/parámetros/bloqueos, P01–P40 y trazabilidad completa. No depende de escritorio/conversación para interpretar contratos.
- HALLAZGOS: matriz H01–H12 Regla→Contraejemplo→Invariante→Corrección→Prueba, clasificación/estado/dependencias y riesgos residuales; sin nuevas fichas TCE ni explotación acreditada.
- PLAN: secuencia documental y puertas Auth/Auth–BD/concurrencia/RLS/RPC/Storage/Realtime/cachés/migración/IA/parámetros/pruebas, aceptación y autorización separadas.
- TASKS: registro actual de autorización, escritura realizada, estados abiertos y siguiente paso. Antecedentes preservados en los cuatro documentos.

I-11 y separación central/agencia figuran RATIFICADAS en SPEC. H07/P35 ya no requieren aprobación funcional; mecanismos/pruebas pendientes. R1 sigue propuesta técnica para revisión/aceptación; autorizar documentación no ratifica capacidades de Supabase ni valida controles.

Siguiente paso exacto: revisión PO del diff documental incorporado y decisión sobre checkpoint documental; cualquier commit requiere autorización posterior. No implementar, probar, conectar LAB/producción o iniciar automáticamente REC-F2-002. Catálogos/personas/evidencias/conflictos/finalidades/canales/valores operativos siguen pendientes donde no definidos; no reaprobación de políticas ya ratificadas.

CT-01/CT-02/REC-F2-001 ABIERTOS, REC-F2-001/002 EN_CURSO solo diseño. Implementación/validación PENDIENTES. 17 hallazgos originales abiertos, TCE-004 EN_VALIDACION, discrepancias TCE-003/012, siete tareas F2 y 30 MF intactos. P01–P40 y nueve experimentos NO EJECUTADOS. Bloqueos Auth/RLS/Storage/Realtime/concurrencia/migración/pruebas y REC-F2-004 vigentes. Sin nueva fase, tarea o agente.

Alcance realizado: solo consolidación de los cuatro documentos; sin código, gobernanzas, migraciones, configuración, dependencias, secretos/datos reales, servicios, consultas remotas, commit, push, deploy o cambio de rama. Evidencia de verificación posterior se entrega al PO tras inspeccionar el diff y el estado final; esta escritura no equivale a prueba funcional o cierre.

Verificación documental realizada: diff completo inspeccionado; cuatro rutas autorizadas con adiciones y sin eliminaciones, prefijos originales comparados línea por línea con HEAD y conservados (SPEC 769, HALLAZGOS 1154, PLAN 567, TASKS 689 líneas originales). Definiciones únicas I-01–I-11 (11), A-01–A-12 (12), M-01; matriz H01–H12 (12) y P01–P40 (40), sin identificadores faltantes; referencias H→P resuelven. Encabezados nuevos sin duplicados; referencias de los tres documentos a la sección SPEC existente; estados ratificados/propuestos/abiertos y bloqueos revisados. git diff --check aprobado; Git avisa conversión futura LF→CRLF, sin error de whitespace ni cambios de configuración. Estas son comprobaciones documentales, no ejecución de P01–P40 ni laboratorio. Entregar para revisión PO y detenerse SIN_COMMIT/SIN_PUSH.

### Continuidad — cuatro correcciones y dos precisiones R1 autorizadas e incorporadas, 2026-11-07

PO autoriza expresamente la incorporación de la propuesta íntegra de segunda revisión R1 disponible en la conversación, con transiciones coherentes y denegación transversal en fallida_bloqueada. Sucede al mandato previo de proponer sin escribir solo en este alcance; escritura actual autorizada, no pendiente de permiso. Preflight: master/5e0cb789927d6b5ab8892b33cfce38f6cdfd75da, staging vacío y cuatro documentos previamente modificados, 437 adiciones/0 eliminaciones contra HEAD. No se exigió árbol limpio ni se descartaron esas modificaciones.

Aplicado: SPEC precisa salidas/evidencia/facultad de reconciliación/terminal seguro, transacción I-10 y separación de efectos Auth, contrato SSR/cookies/origen/CSRF y subcasos dentro P existentes. Tabla principal incluye reconciliando→efecto_pendiente; terminal fallida_bloqueada impide login/refresh/operaciones por todas las rutas relevantes como requisito, sin afirmar implementación. HALLAZGOS registra seis precisiones y dependencias sin nuevas fichas TCE. PLAN registra puertas/validaciones conservando secuencia. TASKS registra autorización, aplicación y continuidad, sin atribuir independencia plena al mismo agente.

Evidencia disponible: texto incorporado y diff local contra HEAD; verificaciones documentales de alcance, referencias, transiciones, identificadores y antecedentes a entregar con estado final. No auditoría independiente realizada ni pruebas funcionales. La afirmación histórica de verificación anterior conserva su alcance y no certifica estas precisiones nuevas.

Preservados I-01–I-11/A-01–A-12/M-01/H01–H12/P01–P40 y antecedentes. I-11/separación central-agencia RATIFICADAS; cinco P0/seis políticas/A/B/C/D intactos. CT-01/CT-02/REC-F2-001 y 17 hallazgos originales abiertos; TCE-004 EN_VALIDACION; discrepancias TCE-003/012 intactas. P01–P40/subcasos y nueve experimentos NO EJECUTADOS; 30 MF-PO diferidas en implementación, sin nueva fase/tarea. REC-F2-001/002 EN_CURSO solo diseño; implementación y validación pendientes; bloqueos Auth/RLS/Storage/Realtime/concurrencia/migración/pruebas y REC-F2-004 conservados.

Siguiente paso: auditoría independiente y revisión PO del diff consolidado; detenerse sin commit/push/merge, pruebas o implementación hasta autorización expresa posterior. Alcance realizado solo cuatro documentos; sin código/gobernanzas/configuración/migraciones/dependencias/servicios externos/Supabase/Vercel/producción/deploy. Reconciliador, protocolo de entrega y catálogos/parámetros operativos aún requieren designación/definición, sin poderes inferidos.

Verificación documental de esta incorporación: diff completo contra HEAD inspeccionado; prefijos originales conservados línea por línea (SPEC 769, HALLAZGOS 1154, PLAN 567, TASKS 689), contratos I (11)/A (12)/M-01 y matrices H (12)/P (40) presentes; 27 subcasos únicos dentro de familias existentes, sin definición P41 ni referencias a subcasos ausentes. Encabezados nuevos sin duplicados y remisión histórica SSR/cookies existente. Tabla principal, salidas de reconciliación y P30.b–P30.d cotejados para continuación y bloqueo terminal; I-11/separación ratificadas preservadas; 17 fichas originales sin cambios. git diff --check aprobado, avisos LF→CRLF sin error de whitespace. Revisión documental del mismo agente, no auditoría independiente ni validación funcional; todas las pruebas/experimentos siguen NO EJECUTADOS. Estado final y estadísticas se entregan al PO, sin commit/push.

## Continuidad AN-80 — delimitación funcional CT-01/CT-02 ratificada, 2026-11-07

Autorización: PO, mandato de incorporar su ratificación expresa de delimitación funcional, únicamente en los cuatro documentos de recuperación. Preflight aprobado: master, HEAD 38d58105574ecf9b786c64ce1b4dad86b01a6e87, árbol limpio y staging vacío. Este HEAD es el checkpoint documental local R1, mensaje `docs(rec-f2-001): checkpoint documental CT-01 CT-02 R1`, padre 5e0cb789927d6b5ab8892b33cfce38f6cdfd75da; las notas SIN_COMMIT anteriores describen sus respectivas intervenciones previas a ese checkpoint.

Ratificación registrada como fuente normativa en SPEC, «CT-01/CT-02 — delimitación funcional ratificada por el PO y continuidad AN-80, 2026-11-07». AN-80 es identificador de análisis del informe anterior, no actividad nueva. Queda resuelta exclusivamente la decisión de delimitación funcional: identidad y seguridad, incluyendo fronteras candidatas/documentales/postulaciones/atribución/recursos compartidos/IA-humano; desarrollo funcional completo de mejoras MF-PO, WhatsApp, cupos, citas, pipeline y otro negocio no indispensable diferido. Las superficies existentes conservan la exigencia de controles efectivos o bloqueo cuando no se acredita autorización; no se implementó ni comprobó ese bloqueo.

Trabajo documental: SPEC incorpora decisión y sucesión delimitada; PLAN aplica alcance y dependencias diferidas; HALLAZGOS añade remisión de trazabilidad sin modificar fichas, estados o evidencias. Contenido previo y decisiones A/B/C/D, cinco P0, seis POL, separación central/agencia, I-11 y DF/DA/DC preservados. No se registra AN-80 como cierre de REC-F2-001, CT-01, CT-02 ni hallazgo alguno.

Pendientes conservados: detalles operativos de autoridad/catálogos/parámetros/protocolos y revisión independiente/aceptación; garantías Supabase Auth, RLS, Storage, Realtime, migración y pruebas. P01–P40/subcasos y nueve experimentos siguen NO EJECUTADOS. CT-01/CT-02/REC-F2-001 y los 17 hallazgos originales abiertos, TCE-004 EN_VALIDACION; discrepancias TCE-003/012 intactas. REC-F2-001 sigue EN_CURSO solo diseño; REC-F2-002 conserva su antecedente EN_CURSO solo diseño, sin iniciarse ni ampliarse por este mandato. REC-F2-004 mantiene red/arranque bloqueados.

Siguiente paso: presentar diff, consistencia documental, git diff --check y estado Git final; detenerse SIN_COMMIT. La continuación del diseño requiere alcance autorizado posterior sobre los detalles pendientes, sin volver a solicitar delimitación funcional AN-80. La ratificación no constituye aceptación integral de R1 ni cierre documental/técnico. Sin código, gobernanzas, archivos nuevos, pruebas, servicios externos, commit, push, merge o despliegue. Evidencia de verificaciones de esta actualización se entrega en el informe, sin atribuir auditoría independiente a la autorrevisión.

## Continuidad REC-F2-001 — reconciliación documental aplicada, 2026-11-07

Mandato expreso PO «Aplicación documental autorizada por el PO», limitado a HALLAZGOS/SPEC/TASKS/PLAN. Preflight: master/38d58105574ecf9b786c64ce1b4dad86b01a6e87, staging vacío, exactamente cuatro archivos modificados y 50 adiciones/0 eliminaciones AN-80; hashes iniciales coinciden con el informe de solo lectura. Esas adiciones se preservan como contenido previo, sin commit ni descarte. HALLAZGOS, «Reconciliación sucesora del plan y decisiones recientes — 2026-11-07», es rector de esta integración; SPEC, «Normativa ratificada y propuestas pendientes de la reconciliación, 2026-11-07», contiene la normativa puntual, sin duplicar contratos extensos.

Registradas AN-01 ratificada y autoridad central ratificada de AN-02; la referencia histórica AN-02 namespace/provisión se conserva diferenciada por asunto/fuente, no reutilizada ni declarada resuelta. Identidad única y membresías multiagencia ratificadas no se reabren. Pendientes de decisión PO: facultades específicas de alta/asignación de reclutadores por coordinador, campos obligatorios/usuario, credencial provisional, correo verificado como factor, cambio desde Perfil y escaparates/enlaces por agencia/atribución. No se ratifican por incorporarlas al registro. Catálogos, parámetros, autoridades, protocolos, ingeniería y evidencia técnica no definidos siguen pendientes.

Siguiente tarea exacta: REC-F2-001, completar el contrato operativo CT-01/CT-02 empezando por matriz actor→operación→sujeto/recurso→agencia/ámbito→facultad→precondiciones→efecto→auditoría→rechazo seguro para alta, emisión/cambio de código, vinculación y activación; resolver con PO el reparto central/coordinador sin reabrir AN-01, autoridad central o AN-80. Preparar después los flujos de factor/cambio y membresías/atribución, revisión independiente y aceptación documental. Esta escritura no autoriza ejecutar ese siguiente diseño ni avanzar automáticamente REC-F2-002; entregar informe y esperar autorización.

Estados conservados: F1 CERRADA DOCUMENTALMENTE CON CONDICIONES; REC-F2-001/002 EN_CURSO solo diseño; REC-F2-004 EN_CURSO preparación con red/arranque bloqueados; REC-F2-003/005/006/007 PENDIENTES. CT-01/CT-02/REC-F2-001 y hallazgos abiertos; TCE-004 EN_VALIDACION e integración real pendiente. Preservados 17 TCE, 16 GOV, H01–H12, siete tareas F2, nueve experimentos NO EJECUTADOS, P01–P40/subcasos y 30 MF. Ninguna prueba de producto ni aceptación nueva; revisión documental del mismo agente no acredita independencia. Garantías Auth/RLS/Storage/Realtime/migración y demás bloqueos técnicos intactos; mejoras no se convierten en bloqueos automáticos de CT-01/CT-02. Verificaciones documentales y estado Git se entregan en el informe final. SIN_COMMIT, sin push/merge/cambio de rama, código, gobernanzas, SQL/configuración, servicios, agentes o despliegues.

## Continuidad REC-F2-001 — reparto funcional D-01–D-04 resuelto, 2026-11-07

PO autoriza exclusivamente integración documental D-01–D-04. Preflight conforme: master/38d58105574ecf9b786c64ce1b4dad86b01a6e87, staging vacío, solo cuatro documentos con 111 adiciones/0 eliminaciones anteriores y hashes coincidentes; contenido íntegro preservado. Rector: HALLAZGOS, «Decisiones PO D-01–D-04 — reparto funcional de alta, códigos y membresías, 2026-11-07»; normativa única: SPEC, «D-01–D-04 — normativa ratificada de alta, códigos y membresías, 2026-11-07»; PLAN aplica dependencias. Sin duplicar contratos o crear tareas.

RESUELTO únicamente el reparto funcional ratificado: registro operativo por coordinador facultado, tramitación central mediante servicios autorizados, emisión automática bajo reglas centrales, incorporación existente con aceptación autenticada y precondiciones, activación/suspensión local con permiso específico. No volver a pedir ratificación de esas direcciones. Las continuidades/matriz anteriores son antecedentes sucedidos solo en este alcance; no aprobación íntegra de la matriz ni cierre de REC-F2-001/CT-01/CT-02. No se concede autoridad global al coordinador ni cambio de código por D-02.

Siguiente paso exacto REC-F2-001: proponer la actualización de la matriz operativa bajo D-01–D-04, concretando el flujo de alta nueva frente a incorporación existente: actor/comando→facultad vigente→prueba de titularidad/vínculo→aceptación aplicable→provisión/ejecución central→activación global y local separadas→auditoría/rechazo seguro. Identificar protocolos, designaciones, parámetros y fallos pendientes sin inventar credencial inicial o factor aprobado; después revisión independiente y aceptación documental. La autorización actual permite este registro, no ejecutar automáticamente ese diseño ni iniciar/ampliar REC-F2-002. Entregar verificaciones y detenerse sin commit.

Pendientes: provisión técnica/namespace, titularidad, campos/usuario, credencial inicial y entrega, recuperación, cambio de contraseña, suspensión global en su procedimiento/mecanismos (I-11 ratificada intacta), resultados externos inciertos, revisión independiente y garantías técnicas/pruebas. Estados anteriores conservados; REC-F2-001/002 EN_CURSO solo diseño, REC-F2-004 red/arranque bloqueados, TCE-004 EN_VALIDACION y hallazgos abiertos. AN-01/AN-02/AN-80/R1, 17 TCE/16 GOV/H01–H12/siete tareas F2/nueve experimentos NO EJECUTADOS/P01–P40/subcasos/30 MF preservados. No implementación, pruebas, conexiones, código, gobernanzas, SQL/migraciones/configuración, commit/push/merge/deploy.

## Continuidad REC-F2-001 — matriz de 27 operaciones y activación por correo, 2026-11-07

Mandato PO «REC-F2-001 / Consolidación documental CT-01 y CT-02», solo cuatro documentos. Preflight master/38d58105574ecf9b786c64ce1b4dad86b01a6e87, staging vacío, 162 adiciones previas exactas sin eliminaciones, distribución y hashes coincidentes; preservadas íntegramente. Rector HALLAZGOS, «Consolidación CT-01/CT-02 — activación inicial y matriz reconciliada, 2026-11-07»; normativa y matriz única en SPEC, «CT-01/CT-02 — activación por correo y matriz operativa reconciliada, 2026-11-07»; PLAN secuencia. No nuevos IDs de tareas/fases/hallazgos.

Realizado: incorporar 27 referencias conservadas con R/P/T y reglas comunes; registrar decisión PO de invitación inicial exclusivamente por correo, control acreditado y contraseña personal; login código+contraseña, correo verificado para recuperación y exclusión SMS/WhatsApp de autenticación. No aprobación humana central individual por alta; D-01–D-04/AN-01/AN-02/AN-80 y límites preservados. Ya no pedir elección funcional de canal inicial/correo frente a SMS/WhatsApp. Siguen pendientes protocolos y mecanismos, no la dirección ratificada; verificar correo no concede membresía ni acredita automáticamente toda titularidad. No se ratifica la matriz técnica completa ni se ejecuta su flujo.

Siguiente tarea exacta REC-F2-001: proponer protocolo verificable de invitación inicial por correo y establecimiento personal de contraseña, separando emisión/entrega/control de correo/titularidad/vínculo/activación global y activación local; precisar entrada por alta nueva frente a incorporación autenticada existente y fallos/reintentos/resultado incierto. Identificar decisiones operativas pendientes y mecanismos de ingeniería sin inventar valores, proveedor, costos, factor o facultades; después revisión independiente y aceptación documental. La autorización actual termina con informe y detención; no iniciar ese siguiente diseño ni REC-F2-002 por inferencia.

Conservar REC-F2-001/002 EN_CURSO solo diseño, REC-F2-004 red/arranque bloqueados y restantes estados; CT-01/CT-02/REC-F2-001 y hallazgos abiertos, TCE-004 EN_VALIDACION. 17 TCE/16 GOV/H01–H12/siete tareas F2/nueve experimentos NO EJECUTADOS/P01–P40/subcasos/30 MF intactos. Verificación documental del mismo agente no es revisión independiente ni prueba funcional. Resultado de diff/check/stat/status, preservación y referencias se entrega al PO; SIN_COMMIT, sin pruebas de producto, conexiones, código, gobernanzas, SQL/migraciones/configuración, servicios o deploy.

## Continuidad REC-F2-001 — protocolo de correo incorporado para revisión, 2026-11-07

Mandato PO «CONSOLIDACIÓN DOCUMENTAL DEL PROTOCOLO DE ACTIVACIÓN POR CORREO», exclusivamente cuatro documentos. Preflight master/38d58105574ecf9b786c64ce1b4dad86b01a6e87, staging vacío y 247 adiciones previas exactas con distribución/hashes coincidentes, sin eliminaciones; contenido anterior preservado. Rector HALLAZGOS, «Protocolo de activación por correo — ratificaciones, riesgos y trazabilidad, 2026-11-07»; SPEC, «Protocolo de activación por correo — decisiones PO y diseño propuesto, 2026-11-07», contiene normativa/protocolo detallado; PLAN puertas. Matriz única de 27 operaciones referenciada sin duplicación.

Registrado: doce direcciones ratificadas en su alcance, incluidos correo personal/institucional sin restricción de proveedor, 24 horas/uso único, modalidades de reenvío y límites, exclusión de Sign-In Google/Microsoft; protocolo previo incorporado como propuesta P/T con estados/transiciones/autoridad/invariantes/casos P existentes. El registro no valida Auth ni ratifica todos sus mecanismos. Las notas históricas de vigencia/modalidades pendientes quedan sucedidas solo en esos puntos; sustitución precisa de enlaces sigue abierta. No volver a pedir aprobación de canal, 24 horas o modalidades; tampoco declarar resueltas titularidad o entrega/control por mera dirección válida.

Siguiente paso exacto REC-F2-001: revisión PO de la propuesta y resolución de política de reenvío/sustitución/revocación compatible con autoservicio no enumerador/no invalidante, autoridad de corrección de correo y criterios de titularidad; concretar límites y responsables pendientes sin inventarlos. Ingeniería propondrá mecanismos de emisión/consumo/idempotencia/entrega/reconciliación que cumplan las obligaciones; revisión independiente y aceptación documental posteriores. La autorización actual termina en informe y detención, no habilita siguiente diseño, implementación ni REC-F2-002.

REC-F2-001/002 EN_CURSO solo diseño; REC-F2-004 conexiones/arranque bloqueados y demás estados conservados. CT-01/CT-02/REC-F2-001 y hallazgos abiertos; TCE-004 EN_VALIDACION. Inventarios 17 TCE/16 GOV/H01–H12/siete tareas F2/nueve experimentos NO EJECUTADOS/P01–P40/subcasos/30 MF intactos. Comprobaciones documentales/preservación/diff/check/stat/status se entregan al PO; autorrevisión no es independencia ni prueba funcional. SIN_COMMIT, sin pruebas de producto, conexiones, servicios, código, históricos, gobernanzas, SQL/migraciones/configuración o deploy.

## Continuidad REC-F2-001 — decisiones de titularidad y correo recuperadas, 2026-11-07

PO proporciona contenido faltante y autoriza consolidarlo, exclusivamente cuatro maestros. Preflight master/38d58105574ecf9b786c64ce1b4dad86b01a6e87, staging vacío, cuatro documentos/374 adiciones/0 eliminaciones con distribución y hashes coincidentes; contenido íntegro preservado. Rector HALLAZGOS, «Consolidación integral — titularidad, E1–E7 y correo, 2026-11-07», con matriz de trazabilidad; normativa única SPEC, «Titularidad y cambios de correo — consolidación de decisiones PO, 2026-11-07»; PLAN puertas. La detención previa fue falta de fuente concreta, ahora suministrada; no requiere nueva autorización para este registro.

Incorporado como RATIFICADO: central exclusiva para ambigüedad/bloqueo acotado y demás bloqueos preservados; opción B escalonada; ordinaria central frente a reforzada por dos personas independientes facultadas en excepcional alto riesgo; E1–E7 sin exigencia universal; APROBAR/ESCALAR/RECHAZAR; no fusión/privados entre agencias; corrección previa coordinador autorizado invalidando invitación anterior; cambio posterior solicitado por autenticado/verificación nuevo/no sustitución unilateral coordinador; controles proporcionales con credenciales válidas sin correo anterior; excepcional si faltan correo y credenciales; preservación de identidad/código/membresías sin revivir revocadas. No ratificar toda matriz técnica anterior. La revocación tras recuperación sigue aplicando a toda recuperación completada conforme P0/POL, no solo alto riesgo.

Siguiente paso exacto REC-F2-001: revisar la trazabilidad y concretar propuesta de mecanismos de titularidad/corrección/cambio/recuperación bajo las políticas ya resueltas, especialmente facultades concretas, estados/versiones, invalidación de invitación/derivados, concurrencia, reautenticación/notificación/sesiones y evidencia de reconciliación; separar parámetros/designaciones/retención o validación legal pendientes sin inventarlos. Mantener política general de reenvío/antiabuso no resuelta y revisión independiente/aceptación documental. No volver a solicitar E1–E7 o direcciones funcionales suministradas. La autorización actual termina con verificaciones/informe; no iniciar ese siguiente diseño ni REC-F2-002 automáticamente.

Estados conservados: F1 CERRADA DOCUMENTALMENTE CON CONDICIONES, REC-F2-001/002 EN_CURSO solo diseño, REC-F2-004 conexiones/arranque bloqueados y restantes estados anteriores. CT-01/CT-02/REC-F2-001 y hallazgos abiertos; TCE-004 EN_VALIDACION. Matriz única 27 intacta; 17 TCE/16 GOV/H01–H12/siete tareas F2/nueve experimentos NO EJECUTADOS/P01–P40/subcasos/30 MF preservados. Verificaciones estáticas y hashes de prefijo se entregan al PO; autorrevisión no acredita independencia ni pruebas. Sin código, SQL/migraciones/configuración, históricos/gobernanzas, servicios, conexiones, pruebas de producto, commit/push/merge/deploy.

## Continuidad REC-F2-001 — suficiencia operativa propuesta por escenarios, 2026-11-08

Realizado documentalmente bajo mandato PO: propuesta única en SPEC, «Acreditación operativa de titularidad — propuesta por escenarios, 2026-11-08», trazada por HALLAZGOS homónimo y PLAN. Aplica reglas vigentes a alta/código, invitación/reenvío, corrección/cambio de correo, incorporación, recuperación/cambio de contraseña, suspensión local/global, ambigüedad y reconciliación. No ratifica mecanismos P/T ni reemplaza matriz 27, E1–E7, criterios de decisión o contratos.

REC-F2-001 permanece EN_CURSO solo diseño; CT-01/CT-02 ABIERTOS. Diseño aplicado preparado para revisión, implementación y validación PENDIENTES; pruebas P01–P40/subcasos y nueve experimentos NO EJECUTADOS. Demás tareas/estados/inventarios intactos. No iniciar REC-F2-002 ni ampliar REC-F2-004, cuyo entorno conserva bloqueos. No crear tareas para las filas de escenarios.

Siguiente paso exacto dentro de REC-F2-001: revisión PO de la propuesta de suficiencia aplicada y de facultades/designaciones pendientes que sean indispensables; después, bajo autorización delimitada, diseñar corrección previa y cambio posterior con estados/versiones, invalidación de invitación/derivados, concurrencia, reautenticación/notificación/sesiones; continuar recuperación/reconciliación según PLAN. No pedir de nuevo ratificación de identidad única, AN-01/02/80, D-01–D-04, E1–E7 o criterios generales. Ingeniería propone detalles compatibles; facultades nuevas, parámetros funcionales y política restante de reenvío requieren decisión pertinente. Revisión independiente/aceptación siguen pendientes, sin auditoría nueva por esta actividad.

Cierre de esta actividad documental: integridad/preservación/referencias y git diff --check; solo cuatro maestros; commit/push normal y verificación local/remota conforme MC-07 autorizados, sin modificar código, gobernanzas o configuración ni ejecutar pruebas. Evidencia de Git y hash final se informan al PO; ante discrepancia detener sincronización, sin forzar ni alterar historial. El respaldo remoto no cierra REC-F2-001 ni contratos.

## Continuidad REC-F2-001 — ratificación PO-REC-F2-001-SE-01, 2026-11-08

Revisión PO de los cinco criterios funcionales de suficiencia de evidencia COMPLETADA DOCUMENTALMENTE, exclusivamente en el alcance PO-REC-F2-001-SE-01. Fuente normativa única: SPEC, «PO-REC-F2-001-SE-01 — suficiencia funcional de evidencia, 2026-11-08»; rector HALLAZGOS, «Ratificación PO-REC-F2-001-SE-01 — criterios funcionales de suficiencia, 2026-11-08». No solicitar otra ratificación de esos cinco criterios; no aceptar por inferencia filas P/T completas ni mecanismos técnicos.

REC-F2-001 permanece EN_CURSO solo diseño; CT-01/CT-02 ABIERTOS. Facultades, concedentes y designaciones pendientes, elegibilidad no definida y política restante de reenvío continúan abiertas. Diseño técnico, implementación y validación pendientes; P01–P40/subcasos y nueve experimentos NO EJECUTADOS. Sin cierre de tarea, contrato, hallazgo u otra dependencia; inventarios y matrices 14/27 conservados.

Siguiente paso exacto dentro de REC-F2-001, con autorización delimitada posterior: precisar facultades, concedentes y designaciones pendientes; después resolver política restante de reenvío/sustitución/revocación de invitaciones; continuar procedimientos de correo y recuperación conforme PLAN y dependencias existentes. El hito documental de suficiencia no autoriza avanzar esos trabajos ni iniciar otras tareas. La actividad actual termina con verificaciones documentales, commit limitado a cuatro maestros, push normal y comprobación de igualdad local/remota MC-07, informe y detención.
