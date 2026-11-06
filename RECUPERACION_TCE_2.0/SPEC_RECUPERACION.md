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
