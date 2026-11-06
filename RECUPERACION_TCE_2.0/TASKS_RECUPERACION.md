Versión: 0.1
Estado: Propuesta pendiente de aprobación del propietario
Fase activa: F1 — Auditoría integral
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

## Punto de continuidad vigente — REC-F1-002

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
