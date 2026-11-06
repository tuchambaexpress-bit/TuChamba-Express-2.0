Versión: 0.1
Estado: Propuesta pendiente de aprobación del propietario
Documento rector: SPEC_RECUPERACION.md
Gobernanza: GOBERNANZA_MAESTRA.md y GOBERNANZA_IA.md, pendientes de ratificación.
Establecer el procedimiento de ejecución del Plan de Recuperación de TuChambaExpress 2.0, desde la auditoría integral hasta la incorporación controlada de agentes de inteligencia artificial.

El proceso deberá garantizar trazabilidad, continuidad entre sesiones, control de cambios, protección de producción y evidencia verificable.
1. Consolidar los 17 hallazgos iniciales, preservando sus identificadores TCE-001 a TCE-017.
2. Profundizar en autenticación, autorización, aislamiento multiagencia y seguridad.
3. Auditar Supabase, RLS, permisos, funciones y Storage mediante procedimientos autorizados.
4. Revisar integridad transaccional y concurrencia.
5. Verificar funcionalidad por rol.
6. Evaluar rendimiento, escalabilidad, experiencia de usuario y accesibilidad.
7. Revisar dependencias, configuración y despliegue.
8. Contrastar implementación y evidencia con SPEC, PLAN, TASKS y gobernanzas.
9. Consolidar hallazgos, causas raíz, dependencias y riesgos.
10. Obtener aceptación del diagnóstico por parte del propietario.
Entregable: diagnóstico integral y matriz de hallazgos.
1. Priorizar defectos según riesgo, impacto y dependencias.
2. Definir solución y pruebas antes de modificar código.
3. Obtener autorización específica.
4. Implementar en entorno controlado.
5. Ejecutar pruebas funcionales, seguridad, regresión e integridad pertinentes.
6. Revisar resultados y actualizar documentación.
7. Realizar commits trazables.
8. Verificar criterios de cierre.
9. Preparar despliegues controlados únicamente con autorización.
10. Confirmar estabilidad y aceptación.
Entregable: versión estabilizada con evidencias de validación.

Registro específico TCE-007 (2026-11-06): reservar la eventual reparación del ciclo de identidad del reclutador para F2, sin iniciar F2 ni tratarla como mejora F3. Antes de implementar: validar el identificador compatible con Supabase Auth sin correo obligatorio; definir alta/recuperación por coordinador autorizado, credencial temporal y cambio inicial, caducidad/revocación; diseñar autorización por identidad, recurso y agencia y su cobertura en API, consultas directas y RLS. Coordinar TCE-005 y diagnosticar dependencias posibles con TCE-008/TCE-009. Turnstile y límites de intentos siguen propuestos. Requiere autorización específica posterior para implementación, esquema, pruebas y cualquier intervención en producción; no existe tal autorización en esta actividad. Fuente: instrucción del PO «Registrar TCE-007 y continuar F1»; evidencia y estado en HALLAZGOS_RECUPERACION.md, ficha TCE-007, y continuidad en TASKS_RECUPERACION.md. No se cambia el estado de borrador ni se cierra el hallazgo.

1. Registrar solicitudes del propietario.
2. Analizar impacto y dependencias.
3. Definir requisitos y criterios de aceptación.
4. Diseñar e implementar por incrementos.
5. Validar cada incremento.
6. Actualizar documentos y trazabilidad.
7. Obtener aceptación de las mejoras.
Entregable: funcionalidades nuevas aprobadas y verificadas.
1. Definir casos de uso y límites de autonomía.
2. Identificar datos, herramientas y permisos requeridos.
3. Diseñar arquitectura de agentes.
4. Implementar controles de seguridad, privacidad y supervisión.
5. Realizar pruebas funcionales y adversariales.
6. Ejecutar pilotos controlados.
7. Evaluar resultados antes de ampliar autonomía.
8. Documentar y autorizar cualquier activación operativa.
Entregable: agentes integrados con gobernanza y evidencia de funcionamiento.
Toda tarea seguirá este ciclo:

Preparación
- Asignar ID permanente.
- Vincular requisito SPEC y actividad TASKS.
- Registrar estado inicial, alcance, riesgos y dependencias.
- Definir criterios de aceptación y pruebas.
- Identificar archivos y sistemas afectados.
- Obtener autorización correspondiente.
Ejecución
- Respetar el alcance autorizado.
- Registrar decisiones y desviaciones al producirse.
- Mantener TASKS actualizado con el estado real.
- Detenerse ante cambios no autorizados o riesgos nuevos.
Validación
- Ejecutar únicamente pruebas autorizadas.
- Registrar resultados y evidencia.
- Distinguir pruebas aprobadas, fallidas y no ejecutadas.
- Verificar efectos secundarios y reversibilidad.
Cierre
- Actualizar SPEC cuando cambien requisitos.
- Actualizar PLAN cuando cambien procedimientos o decisiones técnicas.
- Actualizar TASKS al finalizar la tarea.
- Revisar consistencia documental.
- Preparar y realizar commits autorizados.
- Registrar hashes definitivos.
- Verificar estado Git.
- Obtener aprobación y cerrar administrativamente.
Cada commit deberá:
- Corresponder a una o más tareas identificadas.
- Tener alcance definido y justificado.
- Incluir o vincular la documentación pertinente.
- Registrar las pruebas ejecutadas y sus resultados.
- Evitar cambios ajenos a la tarea.
- Permitir identificar el estado anterior y el nuevo.
- Tener un mensaje descriptivo.
El hash definitivo se registrará después de crear el commit. Si esto exige un commit documental posterior, ambos deberán quedar vinculados.

No se realizarán commits sin autorización del propietario.
Cada hallazgo tendrá:
- Identificador único.
- Descripción.
- Evidencia y ubicación.
- Clasificación y severidad.
- Nivel de certeza.
- Impacto potencial.
- Causa raíz, cuando se determine.
- Dependencias.
- Propuesta de resolución.
- Estado.
- Tareas relacionadas.
- Pruebas y criterios de cierre.
Estados permitidos:

IDENTIFICADO, EN_ANALISIS, CONFIRMADO, DESCARTADO_CON_EVIDENCIA, PLANIFICADO, EN_CORRECCION, EN_VALIDACION, CERRADO, BLOQUEADO.

No se eliminarán hallazgos históricos; se documentará su resolución.
Antes de terminar cada sesión de trabajo deberá quedar registrado:
- Última tarea trabajada.
- Estado real.
- Evidencia obtenida.
- Decisiones pendientes.
- Bloqueos.
- Archivos modificados.
- Rama y commit HEAD.
- Cambios no confirmados.
- Próximo paso autorizado.
La siguiente sesión deberá consultar esta información antes de ejecutar nuevas tareas.
Durante la auditoría se priorizan operaciones de lectura.

No se autorizan modificaciones a producción, Supabase, datos reales, despliegues, configuraciones sensibles ni ramas protegidas sin aprobación específica.

Las pruebas potencialmente destructivas deberán realizarse en entornos aislados y con datos de prueba.

Los riesgos activos identificados deberán notificarse al propietario para decidir medidas de contención.
Toda modificación a este PLAN deberá indicar:
- Motivo.
- Secciones afectadas.
- Relación con SPEC y TASKS.
- Autor de la propuesta.
- Aprobación.
- Evidencia y commit asociado.
Una fase solo podrá cerrarse cuando:
1. Sus entregables estén completos.
2. Sus criterios de aceptación estén verificados.
3. Los riesgos residuales estén identificados.
4. Las excepciones estén aprobadas.
5. SPEC, PLAN y TASKS estén sincronizados.
6. Los cambios estén trazados a sus commits.
7. El propietario autorice expresamente el cierre.
- Fase activa: F1 — Auditoría integral.
- Auditoría estática inicial: realizada.
- Hallazgos iniciales: TCE-001 a TCE-017.
- Auditorías complementarias: pendientes.
- Reparaciones: no autorizadas.
- Mejoras: no iniciadas.
- Agentes IA: no iniciados.
- Gobernanzas: borradores pendientes de ratificación.
