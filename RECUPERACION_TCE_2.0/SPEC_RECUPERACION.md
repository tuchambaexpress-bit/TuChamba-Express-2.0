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
