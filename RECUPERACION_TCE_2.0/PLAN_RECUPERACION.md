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

Registro TCE-009 (2026-11-06), propuesta F2 sin ejecución: validar las políticas de referido/fallback con el PO y las relaciones reales/RLS en entorno autorizado; diseñar por separado alta pública y manual, cálculo servidor de precalificación y autorización por identidad/recurso/agencia. Coordinar TCE-007/TCE-008 y probar atribuciones discrepantes, inactividad, otras agencias y duplicados con datos sintéticos antes de aceptar una corrección. F1 solo registra el diagnóstico en HALLAZGOS y TASKS; sin migraciones, código ni producción autorizados.

Registro TCE-010 (2026-11-06), procedimiento F2 propuesto: obtener esquema/RLS/triggers en entorno autorizado, acordar invariantes de comisión y liquidación con el PO; diseñar comandos transaccionales con autenticación, bloqueo/reserva de elegibles, idempotencia y totales derivados de filas efectivas. Probar fallos intermedios, concurrencia, reintentos y ajustes de importes liquidados con datos sintéticos antes de aceptar una reparación. Una secuencia de llamadas Supabase, aun dentro de una API, no acredita transacción. F1 solo registra el diagnóstico en HALLAZGOS/TASKS; sin código, migraciones ni producción autorizados.

Registro TCE-011 (2026-11-06), propuesta F2 compartida con TCE-010: acordar invariantes de etapas/historial/comisión/chats; validar actor y estado vigente dentro de comando transaccional, proteger concurrencia e idempotencia; persistir eventos para notificaciones reintentables. Verificar en entorno aislado checklist ausente/error, fallos intermedios, transiciones simultáneas, descarte masivo y archivo de cada chat correspondiente. No asumir atomicidad por llamadas secuenciales ni por Realtime. Diagnóstico/evidencia en HALLAZGOS/TASKS; sin implementación, migraciones o producción autorizadas.

Registro TCE-012 (2026-11-06), propuesta F2: validar con el PO autoridad sobre estado global y vínculo local; diseñar comandos autorizados por actor/agencia/reclutador para suspender o desvincular solo el alcance aprobado, conservar historial y restringir identidad/eliminación global. Verificar RLS/FK/triggers y ejecutar pruebas sintéticas multiagencia, actor ajeno, errores de conteo y actividad concurrente en entorno autorizado. Ventanas temporales y ausencia de actividad se comprueban en servidor, no solo botones. F1 conserva diagnóstico y discrepancia de denominación histórica en HALLAZGOS/TASKS; ninguna ejecución técnica autorizada.

Registro TCE-013 (2026-11-06), propuesta F2: validar identidad del coordinador y agencia confiable, relación activa del reclutador y aislamiento de consulta principal, detalles, escritura de checklist y Realtime. Probar dos agencias con reclutador compartido, manipulación de agencia/IDs, scope incompleto y políticas restrictivas. No confundir tarjeta de consulta con escritura de detalles ni tomar comentarios antiguos como capacidad implementada. Diagnóstico y límites en HALLAZGOS/TASKS; F1 solo diagnóstica, sin ejecución técnica autorizada.

Registro TCE-014 (2026-11-06), propuesta F2: confirmar esquema/constraints y política de destinatario; derivar ID validado, reservar token elegible atómicamente y diseñar finalización de relaciones/consumo más compensación durable de Auth, sin prometer transacción única entre servicios independientes. Probar IDs discrepantes, uso concurrente, reintentos y fallos de cada paso/compensación en aislamiento. Revocación y almacenamiento hash necesitan resolver la recopia actual de enlaces con el PO. F1 solo registra evidencia en HALLAZGOS/TASKS; sin implementación, migraciones ni servicios autorizados.

Registro TCE-015 (2026-11-06), propuesta F2: acordar matriz pública/privada y campos publicables, revisar permisos de columnas/relaciones y aplicar una proyección redactada común a página, props, recarga y búsqueda sin permitir eludirla por SELECT directo. Mantener acceso privado legítimo y exportación autorizada. Probar banderas/roles con datos sintéticos en HTML/RSC, consultas, estado, JSON-LD y archivos; no confundir ocultamiento visual con confidencialidad. Evidencia en HALLAZGOS/TASKS; sin ejecución técnica en F1.

Registro TCE-016 (2026-11-06), propuesta F2: inventariar top-N intencionales y listados completos, definir contrato de página/cursor y totales autorizados, trasladar búsqueda/orden/filtros a BD y acotar relaciones/recargas. Probar volumen sintético superior a páginas y tope API, empates/cambios concurrentes, búsqueda fuera de primera página, mensajes y exportación; medir antes de optimizar índices. No usar slice cliente ni aumento del máximo como sustituto de paginación real. Diagnóstico en HALLAZGOS/TASKS; F1 sin ejecución técnica ni producción.

Registro TCE-017 (2026-11-06), propuesta F2: validar avisos primarios y versiones corregidas/canales en consulta externa autorizada, comprobar runtime real y peers, fijar herramienta/runtime para instalación reproducible y actualizar por grupos acotados (Next/React/tooling, Supabase/SSR, Excel, UI). Revisar lock/transitivas/scripts y ejecutar regresiones aisladas antes de aceptación; evitar audit fix forzado o salto mayor sin diseño. F1 solo inventaría metadatos locales: sin npm install/update/audit remoto ni pruebas de carga. Consolidación documental y pendientes requieren revisión posterior; no se declara F1 cerrada al registrar TCE-017.

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

## Agrupación propuesta para F2 y puerta de salida F1 — 2026-11-06

Motivo y alcance: consolidar diagnósticos sin repetir auditoría integral ni implementar. Autor de la propuesta: agente bajo instrucción del PO «Consolidación final de F1». Aprobación limitada a esta integración documental; agrupación/prioridades y ejecución técnica pendientes del PO. Relación: SPEC «Consolidación F1 y requisitos de aceptación propuestos»; evidencia y matriz completa en HALLAZGOS «Consolidación documental de F1»; registro en último punto de TASKS. SIN_COMMIT; no modifica procedimientos históricos ni autoriza F2.

| Orden propuesto, sujeto a autorización | Trabajo compartido | Hallazgos y dependencias | Condición previa y validación |
|---|---|---|---|
| Antes de F2 | Completar aceptación del diagnóstico | Todos; especial TCE-001/002/003/005/006 y discrepancia TCE-012 | Recuperar soporte faltante, delimitar cobertura integral/exceptuada, aprobar prioridades, responsables y pruebas |
| En paralelo al diseño, sin ejecución ahora | Preparar integración administrativa aislada y evaluar avisos de seguridad | TCE-004 y TCE-017 | Preservar corrección ya versionada; conocer entorno seguro; confirmar aplicabilidad de avisos sin instalar/actualizar a ciegas |
| Base de autorización | Diseñar identidad, ciclo de credenciales y límites multiagencia una sola vez | TCE-007/008/012/013; habilita TCE-001/002/003/005/006/009 | Decidir identificador Auth compatible y facultades globales/locales; preparar RLS y matriz actor/recurso/agencia con datos sintéticos |
| Acceso y atribución | Aplicar base autorizada a cada ruta/consulta y precalificación | TCE-001/002/003/005/006/009; TCE-007/008 prerrequisitos de identidad | No bloquear la contención autorizada de una ruta por esperar todo el rediseño; no autorizar por parámetros cliente |
| Integridad compartida | Transiciones, comisiones e invitaciones como comandos de negocio | TCE-010/011/014; atribución TCE-009 e identidad previas | Definir transacciones BD, idempotencia, concurrencia y compensación Auth; probar fallos en cada frontera |
| Datos públicos y volumen | Proyección mínima antes de paginar, exportaciones y filtros acotados | TCE-015/016; TCE-002/003/013 relacionados | Aprobar campos públicos; verificar permisos de lecturas directas; medir completitud/carga en entorno aislado |
| Transversal | Actualizaciones compatibles y regresiones por bloque | TCE-017 y todos los grupos afectados | Fuentes oficiales autorizadas, runtime fijado, lock revisado; repetir regresiones pertinentes tras cada cambio, sin actualización masiva indiscriminada |

Las pruebas propuestas están por hallazgo en la matriz de HALLAZGOS, no son pruebas ejecutadas. Antes de cualquier implementación futura: tarea permanente autorizada, alcance y estado previo, criterios, archivos, riesgo y reversión conforme a R-DOC-001/002; no reutilizar REC-F1-001/002 como tareas técnicas. No hay nueva autorización de esquema, producción, instalaciones o despliegues.

Conciliación TCE-012: opción C por ausencia del informe original. Recuperar fuente o solicitar delimitación del PO, conservar descripciones y diagnóstico actual; únicamente con autorización posterior tratar un eventual problema adicional. La secuencia multiagencia no presupone esa resolución.

Cierre: no se recomienda aún cierre íntegro de F1. Preparar al PO una aceptación parcial del diagnóstico estático con brechas expresas o completar las evidencias/coberturas faltantes antes de solicitar cierre. Los siete criterios de cierre anteriores siguen vigentes; no se exige que las reparaciones F2 estén terminadas para aceptar F1. El estado histórico «reparaciones no autorizadas» no elimina la autorización excepcional previa de TCE-004 ya consolidada: ahora no se autorizan nuevas reparaciones. F1 continúa activa; gobernanzas y versiones 0.1 no se ratifican por esta consolidación.

## Procedimiento posterior a los cinco soportes actuales — 2026-11-06

Motivo/autor/autorización: agente bajo mandato del PO «Recuperación de soportes faltantes de F1», exclusivamente revisión estática focalizada y actualización de cuatro documentos existentes. Sin nueva auditoría general ni ejecución técnica. Versión 0.1 pendiente de aprobación; SIN_COMMIT. Afecta la preparación de aceptación F1 y las referencias de los grupos futuros de autorización; no modifica procedimientos históricos.

- Soportes actuales cubiertos: TCE-001/002/003/005/006, con controles y límites en sus fichas HALLAZGOS y requisitos propuestos en SPEC, sección «Soportes estáticos actuales». Las prioridades P1 se mantienen propuestas, no severidades originales recuperadas. TCE-003 distingue ficha operativa de vacante del título histórico ambiguo; precisar la correspondencia con el PO o fuente original antes de aceptar alcance definitivo.
- Conservar la agrupación previa de identidad/recurso/agencia. Diseñar controles compartidos para documentos de candidato y negocio sin confundir permisos; import/export también autoriza empresas y catálogos compartidos; perfil social preserva la lectura pública mínima y protege todas las variantes POST; ficha SSR valida identidad y recurso antes del cliente privilegiado.
- Dependencias: TCE-007/008 para identidad y acceso legítimo; TCE-013 para aislamiento; TCE-015/016 para publicación/exportación; TCE-010/011 para integridad relacionada. Se referencian, no se vuelven a diagnosticar ni se implementan. TCE-004 intacto y TCE-012 pendiente C.
- Validación futura propuesta: mocks que registren llamadas y demuestren cero lecturas sensibles/URLs/escrituras ante autorización fallida; sesión inválida/inactiva, IDs ajenos, agencia alterada y pares de recursos incoherentes; casos legítimos, archivos/enlaces inválidos y recursos compartidos. Después, integración aislada con permisos BD/Storage reales del entorno de prueba y contrato de audiencia aprobado. Pruebas detalladas por ficha; ninguna ejecutada ahora.
- Puerta de salida: retirar únicamente el bloqueo de «cinco diagnósticos actuales no conservados». Mantener recuperación de fuentes históricas o sustitución expresamente aceptada, conciliación TCE-012, precisión de TCE-003, aceptación de prioridades/criterios y cobertura integral pendiente o excepciones del PO. La declaración de soporte cubierto no demuestra explotación ni corrige el producto.
- Antes de implementar en F2: autorización específica, tarea técnica identificada, alcance, riesgo, criterios, pruebas y reversión conforme a R-DOC; no reutilizar REC-F1-001/002 para implementación. F1 abierta, F2 no iniciada. Recomendación de cierre íntegro todavía suspendida.
