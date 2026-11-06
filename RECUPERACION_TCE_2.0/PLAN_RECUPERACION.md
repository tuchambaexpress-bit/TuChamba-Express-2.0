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

## Transición condicionada y primer bloque — propuesta 2026-11-06

Motivo: preparar aceptación documental del diagnóstico F1 y transferencia explícita de verificaciones, sin afirmar auditoría integral terminada. Autor: agente bajo mandato del PO «Cierre documental condicionado de F1». Secciones afectadas: propuesta de puerta de salida y secuencia futura; se conservan procedimientos anteriores. Requisito rector: SPEC «Propuesta de aceptación documental condicionada F1 y transición»; mapa y evidencia en HALLAZGOS; REC-F2-001 a REC-F2-007 y continuidad en TASKS. SIN_COMMIT; propuesta pendiente de aprobación.

Procedimiento propuesto de aceptación:
1. Presentar al PO inventario, matriz, soportes actuales y limitaciones; distinguir diagnóstico realizado, corrección pendiente y validación pendiente.
2. Obtener decisión explícita sobre aceptación de reconstrucciones en lugar de originales no localizados, discrepancias TCE-003/012, prioridades y alcance integral no verificado. Registrar reservas, riesgos residuales y condiciones; no resolver contradicciones por inferencia.
3. Asignar responsables y acordar criterios/entornos para todas las tareas heredadas. Si falta asignación o aceptación del riesgo, no declarar cumplida la puerta de salida. Una tarea PENDIENTE no acredita garantía de BD o seguridad.
4. Si el PO aprueba, registrar cierre documental condicionado con alcance y versión; distinguirlo de cierre de hallazgos y de aceptación técnica/producción. Si no aprueba, F1 sigue abierta con sus bloqueos.
5. Obtener autorización separada y delimitada para comenzar el bloque F2. No ejecutar la secuencia siguiente por anticipado.

Primer bloque futuro: arquitectura de identidad, sesiones, autorización y aislamiento multiagencia.
- REC-F2-001 es el entregable de diseño. Precisar actores e identificadores, contrato de sesión/cookies/renovación/logout/revocación y desactivación, roles Maestro/Limitado conforme a contratos existentes y facultades coordinador/reclutador por agencia. Separar flujo público de candidato de recuperación privada y atribución de referidos.
- Definir compatibilidad Supabase Auth con código + contraseña sin correo obligatorio, sin contraseñas propias ni identidades ficticias inseguras; entregar alternativas, decisión y riesgos al PO antes de fijar mecanismo. No tratar hipótesis técnicas como decisión funcional aprobada.
- Construir matriz de permisos por operación y recurso, y mapa API/SSR/consultas directas/Realtime/Storage; identificar qué acceso requiere sesión y qué lectura pública mínima debe conservarse. Compartir contratos entre TCE-001/002/003/005/006/007/008/009/012/013; preservar TCE-004 y su contrato administrativo.
- Apoyar el diseño con revisión autorizada de BD/RLS (REC-F2-002), Storage (003), entorno/infraestructura (004) y seguridad (005). Empezar por inventario local y evidencias no sensibles; cualquier consulta externa o BD requiere permiso explícito. Una especificación SQL histórica no demuestra esquema desplegado.
- Proponer implementación en incrementos futuros con archivos exactos, tarea, pruebas negativas/positivas, riesgo y reversión por cambio. No asignar archivos de implementación como autorizados desde este plan.
- Preparar REC-F2-006: integrar primero TCE-004 en entorno aislado con datos sintéticos y sesión real; después validar cada incremento autorizado de identidad/autorización. Si no existe entorno seguro, registrar BLOQUEADA al ejecutar la tarea autorizada y detener dependencias; nunca usar el único Supabase productivo como sustituto.
- Planificar REC-F2-007 para cobertura funcional por rol, listados completos, rendimiento medido y accesibilidad con criterios aprobados; trasladar esta cobertura expresamente y no declararla ya realizada.

Criterios del bloque: contrato y matriz revisados, decisiones de identidad y autoridad resueltas, permisos propuestos contrastables con modelo BD, plan de pruebas/reversión aprobado, controles compensatorios conservados y autorización del PO. La aceptación de arquitectura no acepta implementación, pruebas ni despliegue.

Mantener Vercel Authentication / All Deployments como medida temporal informada por PO, sin acceso a consola ni verificación actual; no retirarla automáticamente al pasar de fase ni presumir que protege acceso directo a Supabase/Storage. TCE-004 permanece local y pendiente de integración integral; no refactorizarlo para iniciar el bloque.

F1 continúa abierta, F2 no iniciada y todos los hallazgos abiertos. No se ratifican documentos 0.1 ni se autoriza producción, configuración, migraciones, dependencias, pruebas, código o commits por esta propuesta.

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

Aplicación al procedimiento: se formaliza ahora el VoBo del cierre documental; los pasos de autorización del bloque F2 y de ejecución/validación continúan pendientes. Antes de REC-F2-001: delimitar entregable de diseño, responsable/revisor, datos y entorno, decisiones abiertas y autorización de inicio. No ejecutar otras tareas por el solo orden propuesto.

Control de esta actualización: motivo, formalizar autorización expresa del PO; secciones afectadas, estado actual/continuidad documental y encabezado de fase de TASKS, sin sustituir el procedimiento histórico; autor material, agente bajo instrucción del propietario; aprobación, mandato citado; evidencia, cuatro documentos y controles Git/documentales; commit asociado, checkpoint local autorizado cuyo hash definitivo se comunica al terminar.

## REC-F2-001 — aplicación del VoBo funcional y siguiente validación, 2026-11-06

Fuente/aprobación: PO, mandato «REC-F2-001: registro de decisiones aprobadas», VoBo de 2026-11-06. Autor material del registro: agente bajo ese mandato. Secciones afectadas: diseño de identidad y secuencia de validación, sin modificar procedimientos ni evidencia históricos. Requisitos vinculantes: cuatro acuerdos registrados en SPEC «REC-F2-001 — criterios funcionales aprobados por el PO»; seguimiento TASKS y dependencias HALLAZGOS. Este mandato autoriza registro y un commit documental, no implementación ni validación externa.

Aplicación de los acuerdos: conservar código + contraseña sin correo/SMS en cada login; separar identidad global de membresías/estados/permisos por agencia; recuperación por solicitudes verificables sin control global automático del coordinador; postulación pública sin registro y privacidad por mecanismo verificable ligado al recurso. No fijar teléfono como identificador Auth, cookie HttpOnly, capacidades de candidato, autoridad final de recuperación ni TTL concretos como decisiones ya aprobadas.

Siguiente actividad propuesta — viabilidad técnica de autenticación y sesiones:
1. Verificar contratos locales de Supabase/Next.js y comparar mapeo del código a teléfono legítimo u otra identidad admitida sin correo obligatorio; inventariar restricciones de formato/duplicados sin consultar datos reales. No asumir username nativo.
2. Comparar sesión SSR/browser con mayor intermediación servidor; definir lectura/renovación de cookies, logout, expiración e invalidación de acceso antiguo; distinguir revocación de refresh de la de JWT emitidos.
3. Diseñar bootstrap/cambio inicial y recuperación con control de concurrencia, caducidad, entrega y trazabilidad sin secretos; comprobar que una membresía no permite dominar una identidad global compartida.
4. Diseñar acceso privado de candidato independiente de postulación pública, evitando recuperación de datos por teléfono/chatId; comparar mecanismos limitados al recurso y recuperación entre dispositivos.
5. Proponer escenarios reproducibles, entorno aislado, mocks/fixtures y evidencia de aceptación por los cuatro criterios de SPEC. Contrastar después RLS/Storage mediante REC-F2-002/003 con permisos específicos; no dar por protegidas consultas directas o Realtime solo por cambios de UI/API.
6. Presentar resultados, riesgos, alternativa recomendada, bloqueos y archivos exactos de un eventual incremento al PO. Solo después de aprobación y autorización correspondiente plantear implementación; no instalar, probar integración o acceder a servicios por esta secuencia documental.

Aceptación de la siguiente etapa: alternativas justificadas con evidencia, casos no cubiertos explícitos, matriz de permisos y ciclo de sesión completos, garantías de aislamiento verificables, estrategia de recuperación global aceptada y plan de pruebas/reversión aprobado. Los criterios funcionales ya aceptados no equivalen a aceptar la solución ni sus pruebas.

Dependencias/riesgos: teléfono compartido/reciclado, Auth y perfiles no vinculados por ID, privilegios de servicio, sesiones coexistentes, revocación diferida, toma global de cuenta por recuperación local, exposición de privados de candidato y desalineación de RLS. REC-F2-004 debe acreditar entorno aislado antes de integración; si no existe, no usar Supabase productivo. Turnstile y límites de intentos siguen propuestos.

Estado vigente: REC-F2-001 EN_CURSO — análisis y diseño, sin implementación ni aceptación final; REC-F2-002 a REC-F2-007 PENDIENTES. F1 CERRADA DOCUMENTALMENTE CON CONDICIONES. TCE-004 y protección Vercel conservados sin cambios. Único commit autorizado: docs(recovery): approve F2 identity functional criteria; hash definitivo se informa al terminar, no se anticipa.

## REC-F2-001 — protocolo propuesto de laboratorio y experimentos, 2026-11-06

Autor material: agente bajo mandato PO «documentación de viabilidad y preparación de laboratorio». Alcance aprobado: documentar estudio y preparar protocolo en los cuatro documentos existentes; no implementar, instalar, crear cuentas, iniciar servicios o probar. Base a3b536d6967d54ac83048192127514fd16b73e2b. Relación: SPEC «viabilidad local y requisitos de laboratorio», TASKS continuidad y HALLAZGOS dependencias; SIN_COMMIT. La matriz de abajo es planificación, no evidencia de ejecución. Sus nombres son etiquetas locales de escenarios, no nuevos IDs de tareas/hallazgos.

### Puerta previa del laboratorio — REC-F2-004

Antes de cualquier ejecución futura, el PO debe autorizar responsables, herramientas/versiones y eventual instalación, datos sintéticos, duración y alcance exacto de servicios/cuentas/pruebas. Preparar un entorno independiente con:
- Auth/BD/Storage de laboratorio sin enlace al proyecto productivo, sin clonar datos/usuarios/credenciales ni copiar archivos .env del repositorio. No usar Preview si conecta a producción.
- Endpoints de ejecución locales y salida denegada por defecto hacia Supabase/Vercel, SMTP/SMS, OAuth, telemetría y cualquier servicio externo. Los simuladores de entrega no enviarán mensajes reales. Si una prueba requiere un proveedor externo, declararla NO EJECUTADA y pedir alcance específico, nunca habilitar salida general.
- Credenciales exclusivas y desechables del laboratorio solo después de autorización de creación; inyección aislada sin heredar secretos de shell/repositorio; no registrar valores. No se crean ahora.
- Versiones fijadas de Node, Next, SDK y servidor Auth/BD/Storage. Node debe satisfacer >=22 por SDK instalado. Backend real distinto de mock identificado; registrar versiones efectivas y parámetros de sesión no sensibles.
- Aislamiento de puertos/accesos, almacenamiento y navegador/perfil de prueba; no exponer servicios públicamente. Verificar aislamiento antes de usar credenciales o crear fixtures.
- Fixtures propuestos: agencias A/B; coordinadores CA/CB; reclutador R1 compartido, R2 solo A, R3 inactivo; administradores Maestro/Limitado; candidatos C1/C2 con postulaciones/chats/documentos separados. Código y números de contacto son sintéticos; TEL_A/TEL_COMPARTIDO son marcadores, no valores E.164 listos para ejecutar. Aprobar valores de prueba/formato sin enrutar SMS ni confundirlos con contactos reales.
- Snapshot/restauración solo del laboratorio, limpieza prevista y control de fallos. Si no existe entorno autorizado o no se demuestra aislamiento, no ejecutar pruebas ni recurrir a producción.

### Matriz de experimentos propuestos

Todos los estados: NO EJECUTADO. Resultado esperado significa condición a verificar, no resultado obtenido. Para cada ejecución futura: registrar fecha, responsable, tarea, versión/commit, configuración no sensible, pasos/entradas, esperado/observado, PASS/FAIL/NO EJECUTADO, limitaciones y revisión; redactar tokens, contraseñas, cookies, claves y URLs firmadas. No guardar hashes de secretos como sustituto de evidencia. Las evidencias se ubicarán donde el PO autorice, sin crear documentos/artefactos ahora.

| Experimento | Entradas sintéticas | Resultado esperado | Criterio de rechazo / decisión | Evidencia requerida | Tareas vinculadas |
|---|---|---|---|---|---|
| Identificador con teléfono | R1/R2 con teléfono único, compartido, ausente y sustituido/reciclado; códigos distintos | Login correcto solo por identidad válida y contraseña; ningún número compartido fusiona cuentas ni código resuelve a persona equivocada; ausencia se identifica como no cubierta | Descartar teléfono como solución universal si no cubre casos aprobados; rechazar diseño que invente números o altere identidad para pasar | Contratos SDK/servidor, solicitudes/respuestas redactadas, mapeos y casos cubiertos/no cubiertos | REC-F2-001/002/004/005/006 |
| Identidad técnica administrada | Identificadores sintéticos en namespace reservado al laboratorio, códigos independientes del contacto; intentos de cambiar alias y recuperar desde fuera del flujo | Backend admite el mecanismo permitido y vínculo estable; ningún buzón/tercero obtiene control; recuperación/cambios no eluden política | No viable sin dominio/namespace legítimo, política de propiedad y aprobación; rechazo ante confirmación falsa, alias compartido, recuperación indebida o cambios que rompan vínculo | Documentación oficial autorizada, configuración no sensible, respuestas Auth y pruebas de cambio/recuperación; sin correo externo | REC-F2-001/002/004/005/006 |
| Activación y primer cambio | Credencial válida/vencida/usada, dos consumos simultáneos, contraseña inicial y fallos tras cada paso Auth/BD | Caducidad/uso único verificables; ninguna autorización de negocio antes de completar; reintento recuperable sin doble activación | Rechazar si contraseña temporal es reusable fuera de política, acceso prematuro, secreto en logs o estado parcial no controlado | Línea temporal y estados antes/después, conteo de operaciones, errores inyectados y compensación; no valores secretos | REC-F2-001/002/004/005/006 |
| Recuperación multiagencia | CA solicita por R1/R2; CB intenta R2; comprobación fallida, repetición, solicitud concurrente y autoridad global ausente | Solicitud dentro de ámbito no concede control global; requiere procedimiento/autoridad aprobados, audita sin secretos e invalida credencial anterior según política | No aceptar flujo hasta definir quién aprueba efecto global; rechazo si CA domina R1 solo por membresía A, CB recupera R2 o datos quedan expuestos | Matriz de autoridad, trazas de decisión, estados/membresías y pruebas de acceso previo/posterior | REC-F2-001/002/004/005/006 |
| Sesión y cookies SSR | Login/logout local/global/others, JWT vencido, refresh válido/inválido, renovaciones concurrentes y dos perfiles de navegador | getAll/setAll propagan renovación; identidad no se mezcla; expiración y scopes según contrato; errores fallan seguros | Rechazar pérdida de cookies, sesión cruzada, expiración simulada solo con maxAge o afirmar HttpOnly con lectura cliente incompatible | Versiones Next/SSR/Auth, atributos de cookie sin valores, eventos/red redactados y cronología de expiración | REC-F2-001/004/005/006 |
| Revocación y estados actuales | Copia controlada de JWT sintético antes de logout/reset; R1 global activo pero membresía A desactivada; sesión revocada | Diferenciar token criptográficamente válido de acceso autorizado; bloquear recurso según estado/revocación, preservando B al desactivar A | Rechazar acceso fuera de política por JWT antiguo; no prometer invalidación instantánea por signOut o getUser sin comprobar estado | Casos API y acceso directo, alcance/latencia del bloqueo y TTL configurado; matriz de permisos | REC-F2-001/002/003/004/005/006 |
| RLS, recursos y privilegios | anon/authenticated, CA/CB/R1/R2; IDs de agencia/recurso alterados; mensajes, documentos, consultas y Realtime | Actor-recurso-agencia delimitados; no escrituras/lecturas privadas/firmas antes de autorización; servicio no se usa como atajo | Rechazar acceso cruzado, confianza en localStorage/rol cliente, permisos solo de UI o protección API con acceso directo abierto | Políticas/modelo del laboratorio, consultas y filas/efectos permitidos/denegados, guardas de servicio y suscripciones | REC-F2-001/002/003/004/005/006 |
| Candidato y Storage | C1/C2, postulación pública, teléfono ajeno, chatId alterado, capacidad válida/ajena/vencida/revocada y URL ya emitida | Alta pública sin registro; privados limitados al recurso; medir vigencia residual de URL tras revocar capacidad y respetar política aprobada | Rechazar privados por teléfono/chatId solos o capacidad reusable fuera de ámbito; si se exige revocación inmediata, URL aún utilizable no satisface criterio | Payloads/red redactados, políticas de bucket, tiempos y acceso autorizado/denegado, sin documentos reales | REC-F2-001/002/003/004/005/006 |
| CSRF, antiabuso y regresión administrativa | Origin ausente/ajeno/válido, sesión inválida, roles Maestro/Limitado, clave antigua sin sesión, intentos repetidos y token anti-bot simulado | Rechazos sin efectos, roles conforme a contrato, límites verificables y flujos válidos conservados; preservar corrección TCE-004 | Rechazar rate limit solo cliente, CAPTCHA sin validación servidor o aceptación de clave antigua; proveedor real no comprobado no se declara compatible | Contadores de operaciones, decisiones de origen/rol, tiempos de límites y regresiones; proveedor simulado declarado | REC-F2-001/004/005/006 |

### Secuencia, límites y decisiones pendientes

1. Obtener permiso para documentación externa vigente sobre Auth/identificadores, confirmación/cambio de cuenta, recuperación y sesión; SDK instalado no equivale al servidor desplegado. No se consultan fuentes externas ahora.
2. Resolver decisiones del PO: autorizar comparación de teléfono e identidad técnica administrada sin aprobar ninguna; legitimidad/gestión de namespace, teléfonos compartidos/ausentes; autoridad final de recuperación global y entrega/verificación de identidad; TTL, inactividad, ámbitos de logout y revocación exigida; cookies/browser frente a intermediación; mecanismo privado y recuperación entre dispositivos del candidato.
3. Aprobar laboratorio y eventual provisión mediante REC-F2-004. Asignar ejecutor y revisor; seleccionar evidencia y retención sin datos sensibles. No iniciar servicios, instalar herramientas o crear usuarios por este documento.
4. Autorizar pruebas concretas. Empezar por mapeo de identificador y sesión; continuar con activación/recuperación y controles de recursos/RLS/Storage. Mocks primero pueden comprobar orquestación, pero no aceptan por sí solos las garantías del backend.
5. Contrastar REC-F2-002/003, revisión REC-F2-005 y resultados de integración REC-F2-006; no ejecutar esas tareas por haber sido vinculadas. Si algún requisito funcional queda sin cubrir, registrar alternativa no viable/bloqueada y volver al PO.
6. Presentar evidencia y recomendación revisada. Solo aprobar arquitectura tras cobertura y aceptación; implementación requiere autorización distinta.

Dependencias de seguridad: proteger login de enumeración y abuso con controles servidor; captchaToken del SDK no confirma soporte de Turnstile en backend. Asegurar estado/membresía actuales y no confiar en roles editables del navegador. Signed URLs son credenciales de acceso temporal: revocación de sesión/capacidad no demuestra que dejen de funcionar.

Estado: protocolo preparado, laboratorio no provisionado ni acreditado, nueve experimentos NO EJECUTADOS; REC-F2-001 EN_CURSO solo diseño, sin viabilidad definitiva. Sin cambios TCE-004 ni protección Vercel; F1 mantiene cierre documental condicionado y todos los hallazgos abiertos.

## REC-F2-004 — procedimiento disponible y arranque bloqueado, 2026-11-06

Motivo/autor/autorización: implementar aislamiento mínimo bajo mandato expreso del PO; agente ejecutor, sin delegación para servicios o producción. Base 40dab9b14b2779386bec0a36ce9a268f07ed3ecb; SIN_COMMIT. Vínculos: SPEC «aislamiento mínimo local implementado», TASKS continuidad y HALLAZGOS límites.

Proyecto TCE-2-LAB (ieioysefckvafdbasqxl, Free, East US, Nano) informado creado por el PO; no conectado ni comprobado remotamente. La autorización actual no permite abrir salida al proyecto ni ejecutar SQL o pruebas de los nueve experimentos. El protocolo histórico local/egress denegado no se transforma silenciosamente en acceso remoto autorizado.

Procedimiento offline disponible, compatible con Windows:
1. Desde el repositorio, node scripts/lab-launcher.cjs check (también npm run lab:check) comprueba nombres heredados y existencia de configuración explícita. Sin archivo privado debe terminar LAB_CONFIG_MISSING; no crea configuración ni ejecuta Next.
2. La ubicación futura exclusiva es .lab-private/lab.config.json. Solo cuatro claves de configuración de SPEC; formato JSON, sin interpolación dotenv, fallback a .env ni extras. No creado por esta intervención. No copiar archivos de producción ni pegarlos para probar rechazo. Antes de aportar credenciales reales se requieren autorización y permisos locales adecuados: estar ignorado por Git no equivale a ACL privada.
3. Si se autoriza aportar configuración de laboratorio, preparar con node scripts/lab-launcher.cjs prepare (npm run lab:prepare). Exige destino exacto del proyecto y origen https://localhost:3443; no provee certificado. Para claves legacy solo contrasta ref/rol, no firma ni permisos; claves opacas no verificables quedan rechazadas sin contacto.
4. El lanzador crea un directorio temporal nuevo tce-2-lab-run-* fuera del repositorio. Copia solo archivos elegibles del manifiesto, excluyendo .env*, .git/.vercel, documentos privados, dependencias, artefactos, cachés y enlaces. Escribe únicamente un marcador no secreto con ref/origen y servicios no autorizados; no escribe configuración ni claves en la copia.
5. La copia se validó mediante una prueba con valores ficticios sin leer el archivo privado. No dispone de node_modules; no instalar dependencias ni enlazar cachés del principal por inferencia. Revisar destino de provisión y aislamiento en una autorización posterior.
6. No hay comando autorizado para iniciar servicios. next.config.js impide next dev/build en copia o modo laboratorio, incluso una invocación directa sin flags. No quitar LAB_SERVICES_NOT_AUTHORIZED hasta disponer de HTTPS y controles de salida verificados y autorización específica. El bloqueo es una protección deliberada, no prueba de que exista un entorno ejecutable.
7. Antes de uso real futuro: permisos del archivo privado, identidad de claves por procedimiento autorizado, HTTPS, red con allowlist exclusiva del laboratorio y terceros bloqueados, dependencias/artefactos independientes y limpieza/restauración. Luego, permisos separados para esquema/datos y experimentos.

Pruebas autorizadas ejecutadas: node --test tests/lab-isolation.test.cjs, 18 PASS, 0 FAIL, sin skips. Solo configuración ficticia, fixtures/copia temporales y transformación offline TypeScript/minificador. Ningún build Next, servidor, HTTP, Supabase/Vercel, migración o credencial real. No ejecutar npm lab:check contra configuración real por esta nota.

Telemetría: app/layout.tsx condiciona ambos scripts y ambos noscript a modo no laboratorio; VacanteDetalle condiciona Lead. Prueba de salida JavaScript generada offline sin destinos GTM/Pixel/evento Lead, más control de ramas no laboratorio conservadas. Esto no demuestra ausencia de todo tráfico externo de la aplicación (p. ej. fuentes externas) ni salida de red bloqueada; por eso servicios permanecen desautorizados. NEXT_TELEMETRY_DISABLED se fija en el entorno previsto, no se ejecuta Next para comprobarlo.

Artefactos de prueba: una copia real de fuentes en TEMP, además de fixtures sintéticos temporales; no son proyectos Supabase ni laboratorios adicionales activos. No se inician ni se borran automáticamente. Limpieza futura solo tras verificar rutas absolutas concretas y preservar evidencia requerida; nunca borrar recursivamente un destino calculado sin validarlo.

Reversión propuesta: revisión del diff y reversión selectiva de lanzador/guards/modo de telemetría y documentación, manteniendo TCE-004 y decisiones históricas; ninguna reversión productiva necesaria porque no se modificó producción. Descartar solo copias temporales verificadas cuando se autorice limpieza. No revertir ni confirmar cambios ahora.

Vínculos con experimentos existentes: configuración/cookies/CSRF se apoya en estas comprobaciones locales, pero los nueve experimentos Auth/BD/RLS/Storage siguen NO EJECUTADOS. REC-F2-002/003/005/006 pendientes; REC-F2-004 EN_CURSO en preparación, sin aceptación integral. Protección Vercel y corrección TCE-004 conservadas.
