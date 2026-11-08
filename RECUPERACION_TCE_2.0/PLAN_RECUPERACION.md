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

## REC-F2-004 — protocolo de sonda offline, 2026-11-06

Fuente: PO «implementar sonda mínima», sobre 9ecb4dd6c0686228da15f73600d309383c5ba31e. Autor material: agente bajo mandato. Requisitos: SPEC «sonda mínima offline y contrato de endpoint bloqueado»; evidencia y continuidad TASKS/HALLAZGOS. SIN_COMMIT; no conexión autorizada.

Comando disponible: node scripts/lab-launcher.cjs probe (npm run lab:probe). Actualmente SOLO comunica bloqueo de contrato de endpoint y autorización de red; no abre credenciales ni inicia Next. Flags de conexión o argumentos adicionales se rechazan. check/prepare conservan sus validaciones, y la copia incluye el módulo de sonda sin habilitar servicios.

Perfil futuro de sonda: .lab-private/probe.config.json con únicamente URL y clave pública del laboratorio, separado de la configuración completa. No crearlo ni introducir valores ahora. readProbeConfig comprobaría herencia de variables por nombre, enlaces/ubicación/tamaño, ACL Windows de directorio/archivo, Git ignore y solo después el contenido. Get-Acl es consulta de metadatos, sin Get-Content/Set-Acl; sus salidas se usan internamente, no se imprimen. Política: dueño SID actual, herencia deshabilitada, acceso explícito solo dueño y SYSTEM. No cambiar ACL ni leer archivos reales por este registro.

Endpoint BLOQUEADO: SDK local muestra prefijo REST y cabeceras, no contrato de la raíz para autenticación de apikey. GET /rest/v1/ se usa solo como candidato simulado. No usar GET público de health/settings o auth.getUser para inferir aceptación de una clave pública; 200 no basta. Hace falta documentación técnica autorizada y verificable que defina el endpoint apropiado y respuesta al control negativo antes de cualquier transporte real.

Matriz de comprobación offline de la sonda: configuración ausente/campos extra/URL o clave incompatibles; ACL insegura, dueño incorrecto, reglas heredadas o grants ajenos; enlaces; métodos y destinos fuera de allowlist; TLS/peer no válidos; redirect; timeout; cuerpo excesivo; error que contiene detalle sensible; control negativo 401 y configurado 200 o ambos 200; CLI y --connect bloqueados. Todo se ejecutó con valores/respuestas ficticios; ningún resultado valida autenticación real.

Control del transporte simulado: GET único host canónico HTTPS/443 y ruta fija, sin redirecciones/proxies/reintentos; máximo dos peticiones de control, timeout total <=10 s, <=64 KiB por respuesta descartada. Cancelación AbortController y errores por código, sin cabeceras/cuerpo/stack. No hay fetch, https.request o SDK real en esta implementación; el transporte de red posterior sigue pendiente de diseño/revisión. Un descriptor con flags no equivale por sí solo a control de red de una implementación futura.

Siguientes pasos propuestos, NO ejecutados ni autorizados aquí:
1. Acreditar contrato del endpoint y criterio de aceptación con documentación oficial autorizada; si no se logra, mantener bloqueo.
2. Autorizar lectura de una clave pública obtenida exclusivamente del proyecto LAB y su archivo con ACL verificada; mantener fuera credenciales productivas y privilegiadas.
3. Autorizar implementación/revisión del transporte HTTPS restringido, DNS/TLS/egress y peticiones exactas. No añadir habilitación por variable o flag sin revisión.
4. Ejecutar únicamente esa sonda si se autoriza, separando resultado TLS, HTTP y aceptación efectiva de clave. No retirar bloqueo general Next ni preparar DB por éxito de sonda.

Suite ejecutada: 36/36 PASS, sin skips; incluye 18 regresiones de aislamiento/telemetría y 18 de sonda/ACL, con prueba real del dispatcher sin abrir servicios. No build completo, certificado local, conexión, migración, creación de usuarios ni validez real de claves. Las pruebas de ACL simulan proveedor Windows; verificar ACL efectiva futura sigue pendiente. Nueve experimentos originales siguen NO EJECUTADOS. REC-F2-004 EN_CURSO en preparación, sin aceptación integral, TCE-004 intacto.

## REC-F2-004 — procedimiento mínimo posterior al cierre offline, 2026-11-06

La consulta oficial autorizada ahora identifica GET /auth/v1/health como candidato sin datos de usuarios: [referencia de Supabase](https://supabase.com/kb/troubleshooting/how-do-i-check-gotrueapi-version-of-a-supabase-project-lQAnOR). Endpoint exacto y criterio diferencial en SPEC «cierre offline y contrato pendiente». No se acredita contrato de rechazo de apikey inválida: mantener bloqueo, sin sustituirlo por GET /rest/v1/ ni inferir autenticación de health/settings públicos.

Alternativa mínima, propuesta y NO ejecutada: conservar dobles offline y solicitar al PO evidencia oficial o confirmación técnica de Supabase sobre el control negativo de health alojado. La procedencia que confirme el PO en API Keys de TCE-2-LAB identifica la clave, pero no acredita aceptación HTTP. Si solo se autoriza comprobar conectividad/salud con health, reportar ese alcance y authenticationValidated=false; nunca promoverlo a validación de clave. No crear tablas, funciones, usuarios, endpoints ni infraestructura para resolver este bloqueo.

Puertas para primera conexión, en orden:
1. Acreditar contrato del candidato y respuesta negativa; aprobar endpoint y criterio diferencial. Si no se acredita, mantener validación de clave BLOQUEADA.
2. PO confirma procedencia exclusivamente TCE-2-LAB/ref ieioysefckvafdbasqxl y tipo público. Autorizar lectura del perfil privado y verificar ACL efectiva antes del contenido. No leer claves existentes ahora.
3. Revisar transporte HTTPS saliente/DNS/TLS/egress, límites y sanitización. Para publishable revisar soporte explícito: hoy se rechaza; no desactivar guardas ni usar Authorization Bearer con clave opaca.
4. Autorizar específicamente las dos peticiones diferenciales al host LAB, primero control inválido sintético del mismo formato y después clave pública. Sin cookies ni sesión, sin redirects/proxy/reintentos; como máximo 10 s total y 64 KiB por respuesta. Distinguir rechazo de gateway de cualquier 401 de otra causa, con criterio de error previamente documentado y sin imprimir cuerpos/claves.
5. Registrar solo evidencia sanitizada de TLS, estados y conclusión limitada. Cualquier resultado inconcluso mantiene el bloqueo; incluso éxito no habilita Next, SQL, migraciones o los nueve experimentos.

Este procedimiento es preparación documental, no autorización ni implementación del transporte. Cierre offline autorizado con un único commit local de nueve archivos; arranque general y conexiones reales continúan bloqueados.

## REC-F2-001/002 — validación mínima multiagencia, 2026-11-06

Mandato actual: continuar diseño del plan F2, base 65fa41829a1beb0e5c17d467ed6b057ab5120d88; actualizar solo cuatro documentos, sin commit ni ejecución. Modelo/requisitos/invariantes y decisiones abiertas en SPEC «diseño mínimo de identidad y aislamiento multiagencia». Los casos siguientes detallan los nueve experimentos existentes, especialmente RLS/recursos, recuperación y revocación; no crean otra auditoría, fase o matriz competidora. Todos NO EJECUTADOS.

### Compatibilidad local acotada

La línea histórica spec.md §2/§3 y HU-18 se consultó por remisión de gobernanza para conservar contratos. Código contrastado solo como observación: app/api/reclutador/login/route.ts:10–41 recibe código, consulta reclutadores/reclutador_agencia y toma primera relación activa sin emitir sesión; app/coordinador/login/page.tsx:27–56 usa Auth por email y localStorage; middleware.ts:52–77 valida perfiles por email, sin equivalencia entre ID de perfil y Auth. app/coordinador/reclutadores/page.tsx:80–103 muestra relación local y filtro conjunto para conteos, mientras :128–148 contiene borrado global condicionado en cliente; app/coordinador/pipeline/page.tsx:55–80 consulta postulaciones solo por reclutador. Son incompatibilidades a resolver por incrementos futuros, no nuevos diagnósticos ni pruebas de acceso efectivo. No se leyó configuración/credenciales ni BD real.

La propuesta no reemplaza IDs de perfil por auth.uid() indiscriminadamente ni enlaza cuentas por coincidencia de email. Se requiere vínculo estable explícito y comprobado. Conservar reclutador_agencia, coordinadores y administradores durante la transición física que apruebe el PO; un solo origen autoritativo para cada permiso, sin período de OR permisivo entre políticas antiguas/nuevas. No ampliar facultades de coordinador ni modificar TCE-004. Código es evidencia de compatibilidad, no autoridad para ratificar conductas inseguras.

### Casos mínimos positivos y negativos previstos

Fixtures exclusivamente sintéticos en TCE-2-LAB/ref ieioysefckvafdbasqxl cuando se autorice: A/B; CA solo A, CB solo B; R1 compartido, R2 solo A, R3 inactivo; R1 con A suspendida y B activa; administrador Maestro/Limitado; C1/C2 y vacantes/postulaciones/chats/documentos separados. Contactos son marcadores hasta aprobar formato/entrega simulada, sin SMS/correo real. Los estados pendientes/rechazados/inactivos de agencia también se cubren.

| Caso local de prueba (no tarea nueva) | Intento negativo y resultado esperado | Control positivo / evidencia prevista |
|---|---|---|
| Sesión y vínculo | anon/JWT inválido o vencido, sujeto sin vínculo, usuario/perfil inactivo, localStorage/rol falsificados: ningún acceso privado ni escritura | Sujeto legítimo con vínculo estable accede solo a operación autorizada; registrar identidad sintética, rol, estado y resultado sin token |
| Contexto multiagencia | CA solicita B o R2 usa B; R1 usa contexto A para recursos B: no filas privadas, conteos, joins ni efectos | R1 opera cada agencia solo con membresía y contexto correctos; CA ve únicamente A, incluso mismo reclutador compartido |
| RLS CRUD directo | SELECT/INSERT/UPDATE/DELETE directos con IDs A/B cambiados; UPDATE mueve agencia, dueño o rol; INSERT mezcla vacante A/postulación B: denegar o cero filas según contrato, estado final intacto | Operación legítima por tabla/rol funciona. Capturar antes/después sintético y código, distinguir 0 filas de error y no aceptar UI oculta como prueba |
| Membresías y roles | Autoinserción/activación, elevar coordinador/admin, es_maestro como administrador, Limitado gestiona administradores: denegar | Comandos administrativos ya permitidos conservan contrato; gestión de administradores solo Maestro, sin reescribir TCE-004 |
| Separación global/local | CA desactiva A y trata de bloquear global o cambiar contraseña de R1; JWT antiguo intenta escribir A después de revocación: denegar | B sigue habilitada y con historial intacto; nueva operación en A rechazada. Medir Realtime/cachés/lecturas en curso, sin prometer revocación retroactiva |
| Privados/público | C1 usa teléfono/chatId/capacidad de C2 o de otro recurso, vencida/revocada; anon consulta tablas privadas: denegar sin revelar existencia/datos | Postulación pública sin cuenta funciona; proyección pública omite columnas privadas; mecanismo aprobado solo abre su recurso |
| Alcances indirectos | Vistas/RPC, relaciones embebidas, agregados, Realtime o URL Storage intentan eludir agencia; función privilegiada recibe actor/agencia falsificados: denegar | Misma matriz por cada canal; servicio autorizado solo después de guardas. Storage real se valida por REC-F2-003, no se declara resuelto con RLS de tablas |
| Unicidad/concurrencia | Dos altas del mismo código/vínculo/membresía; doble consumo o recuperación concurrente; versión antigua actualiza estado: máximo un efecto válido, resto conflicto/reintento seguro | Verificar restricciones, número de filas/efectos e historial; reintento con misma clave idempotente conserva resultado, payload distinto no reutiliza éxito |
| Revocación contra escritura | Revocar membresía mientras se ejecuta comando: sin ventana de check y escritura separadas que permita confirmar después de revocación ya confirmada | Dos intercalaciones controladas, orden de commit y bloqueos; resultado serializable respecto del estado autorizado, sin actualización perdida |
| Fallos Auth/BD y recursos compartidos | Caída tras crear Auth/antes de membresía, fallo al finalizar, cliente reintenta; negocio compartido sin política o relaciones incoherentes: no activar acceso ni ampliar ámbito | Recuperación idempotente/reconciliación del alta pendiente; política compartida aprobada antes de probar caso permitido. Sin asumir transacción distribuida |

También negar consultas a todos los perfiles/contactos por necesitar mostrar nombre de un reclutador y verificar que cambios de teléfono/correo no transfieran identidad. Pruebas RLS usarán anon/authenticated con sujetos sintéticos; ejecutar todo con service_role no verifica RLS. No inventar políticas SQL ni resultados ahora.

### Secuencia propuesta de implementación y pruebas, NO autorizada para ejecución

1. REC-F2-001: revisión PO de requisitos, modelo/matriz, coexistencia de roles y decisiones Auth/recuperación/sesión/candidato; resolver o delimitar bloqueos antes de fijar diseño. Entregable inmediato siguiente: decisión documentada del mapeo código–Auth y autoridad global, con alternativas y casos no cubiertos. No requiere abrir servicios para revisar el diseño.
2. REC-F2-004: resolver primero contrato de sonda o aprobar alternativa limitada, procedencia de clave pública, ACL y transporte/egress, responsables y autorización específica de conexión a TCE-2-LAB. Cierre offline no habilita conexiones, app ni provisión. No usar producción como sustituto; autorización futura de instalación/servicios/migraciones es separada.
3. REC-F2-002: con alcance de metadatos explícitamente autorizado, inventariar esquema/grants/RLS/FK/funciones/triggers efectivos de LAB y contrastar propuesta. No clonar producción ni leer filas reales. Presentar delta, archivos exactos, restricciones/migraciones propuestas y reversión al PO; hoy no crear migraciones.
4. REC-F2-006: una vez autorizado entorno operativo, validar primero TCE-004 existente con identidades sintéticas y su contrato Maestro/Limitado/sesión/origen, sin refactorizarlo. Si falla, registrar bloqueo antes de ampliar integración.
5. Incremento autorizado REC-F2-001/002: vínculo Auth–usuario–perfil y alta pendiente; después membresías/estados y autorización común por recurso; después grants/RLS/restricciones coordinadas. Diseñar despliegue que nunca habilite rutas nuevas antes de controles; acceso antiguo inseguro no se conserva como bypass. Comparar alternativas de login en los experimentos originales antes de aceptar una.
6. Ejecutar casos de matriz autorizados con fixtures sintéticos: primero controles positivos mínimos y negativos CRUD, luego concurrencia/fallos/revocación; incluir API/SSR y acceso directo. REC-F2-003 Storage y REC-F2-005 seguridad son dependencias de aceptación, sin ampliar ahora su ejecución. REC-F2-007 conserva cobertura/completitud/rendimiento pendiente.
7. Registrar versión/entorno, rol/agencia sintéticos, entrada, esperado/observado, PASS/FAIL/NO EJECUTADO, estado final y revisión independiente. Rechazos sin datos ni efectos, no solo status HTTP. Guardar evidencias sin tokens/contactos/URLs sensibles en ubicación/retención que apruebe PO. Ningún cierre automático de hallazgos o publicación.

Riesgo principal: ruptura de vínculos/contratos existentes o mezcla global/local durante transición. Reversión futura por incremento: snapshot exclusivamente sintético autorizado, compatibilidad de IDs y relaciones, suspensión del incremento ante fallo y restauración comprobada de LAB; compensar Auth por procedimiento aprobado, sin borrar identidad con historial ni asumir que revertir Git revierte BD. En este mandato solo se añaden secciones documentales; no hay datos/producto que revertir.

## REC-F2-001/002 — secuencia consolidada tras PO-F2-001-A/B/C, 2026-11-06

Fuente: ratificación expresa PO de fecha 2026-11-06; texto vinculante y alcance APROBADO en SPEC «decisiones ratificadas PO-F2-001-A/B/C». Este registro actualiza la secuencia anterior únicamente donde proponía elegir entre teléfono e identidad técnica: A ya fija identidad técnica estable con Supabase Auth. Las demás decisiones técnicas y los criterios de aceptación no se consideran resueltos; se conserva el protocolo anterior como antecedente sin ejecutar experimentos. No nueva fase ni auditoría ni autorización técnica/operativa por esta planificación.

1. **Consolidación del contrato de identidad y autenticación — REC-F2-001.** Próximo entregable documental: definir código individual→identidad técnica protegida→sujeto Auth→perfil estable; explicar resolución/normalización, almacenamiento y acceso al mapeo, no edición por reclutador ni bypass de Auth, respuestas y controles contra enumeración, alta/cambio/baja y ciclo de credenciales. Especificar recuperación con verificación independiente, autoridad, factores y revocación sin elegirlos por inferencia. Revisar con PO los detalles pendientes, conservar código+contraseña sin correo personal/SMS habitual, contratos administrativos y acceso público/privado del candidato. No crear identidades, contactos, endpoints ni claves ahora.
2. **Diseño físico compatible con el esquema existente — REC-F2-002.** Traducir contrato a entidades/vínculos/estados, unicidad/FK, fuente autoritativa de permisos, transiciones, idempotencia y concurrencia; conservar IDs/historial de agencias, reclutadores, reclutador_agencia y coordinadores, además del contrato administrativo. Distinguir esquema documentado/observado del efectivo: consulta de metadatos de LAB necesita autorización separada. Entregar propuesta y delta revisables, sin crear SQL o migraciones ni afirmar que el modelo conceptual está aprobado físicamente.
3. **Diseño de políticas RLS y límites de autorización — REC-F2-002, contrato REC-F2-001.** Matriz por actor/operación/recurso/agencia/canal con identidad autenticada, rol, agencia derivada del recurso, membresía activa y permisos vigentes. Precisar aplicación a administradores transversales conservando Maestro/Limitado, sin excepción general inferida a C. Cubrir servidor, grants/tablas/RLS cuando proceda, vistas/RPC/joins/conteos/Realtime y dependencias Storage; guardas explícitas antes de privilegios de servicio. Definir rechazo y ausencia de efectos, concurrencia con revocación y plan de reversión. Diseñar políticas no equivale a instalarlas ni comprobarlas.
4. **Implementación aislada en TCE-2-LAB, previa autorización específica.** Solo proyecto ref ieioysefckvafdbasqxl, datos sintéticos, ejecutor/revisor y lista de archivos/operaciones aprobados. Antes, resolver puertas REC-F2-004 de contrato de sonda/alternativa, credenciales LAB, ACL, transporte/egress y autorización de servicios/provisión/conexión. Mantener bloqueos generales actuales. Requiere permisos separados para código, SQL/migraciones y pruebas: la ratificación A/B/C no los concede. No usar producción como sustituto.
5. **Pruebas negativas, concurrencia e integración.** Una vez autorizado entorno operativo, REC-F2-006 valida primero TCE-004 existente y después cada incremento sin reescribirlo. Aplicar nueve experimentos originales y casos detallados de «validación mínima multiagencia» que correspondan al contrato aprobado; conservar todos NO EJECUTADOS hasta evidencia. Incluir positivos, CRUD directo/relaciones cruzadas/escalamiento de roles, recuperación sin control global local, enumeración, identidad técnica no editable, revocación concurrente e idempotencia/fallos Auth–BD. Registrar resultados sanitizados por versión, rol/agencia/recurso, esperado/observado y estado final; revisión independiente y PO antes de aceptación. Los dobles offline no acreditan Auth/RLS reales. REC-F2-003/005/007 conservan sus dependencias y alcance sin ejecución nueva.

La elección de dirección A está cerrada; comprobar viabilidad técnica permanece pendiente y no autoriza cambiarla unilateralmente. Si falla un detalle propuesto, documentar bloqueo/alternativa compatible y elevar al PO antes de implementar. Las filas históricas de experimentos telefónico/identidad técnica se preservan: no convierten el teléfono en opción aprobada ni autorizan pruebas. Toda implementación está NO INICIADA y el laboratorio sigue NO EJECUTADO. REC-F2-001/002 no se cierran por esta secuencia; próxima acción autorizada ahora es entregar registro y detenerse para revisión.

## REC-F2-001/002/006/007 — secuencia condicionada por propuesta PO-F2-001-D, 2026-11-06

Fuente: mandato documental PO «REC-F2-001: ampliación coordinador multiagencia». D está PENDIENTE DE RATIFICACIÓN FORMAL FINAL; A/B/C siguen aprobadas. Complementa la secuencia consolidada anterior, no otra fase/auditoría ni autorización de ejecución. Requisitos y detalles pendientes en SPEC «PO-F2-001-D, coordinador multiagencia y autorización híbrida».

1. REC-F2-001: presentar D al PO para ratificación final o ajustes; identificar ampliación del supuesto coordinador de una agencia y registrar su sustitución solo cuando se ratifique. Conservar contrato técnico de identidad bajo A/B/C; añadir propuesta de coordinador global con membresías independientes, facultad central de asignación y aceptación autenticada del invitado. No decidir unilateralmente recuperación, mecanismo de invitación, facultades administrativas ni catálogo de riesgo.
2. REC-F2-002: después de fijar alcance ratificado, diseñar representación física compatible de coordinadores/membresías y estado por agencia con IDs/historial conservados; restricciones de unicidad, autorización y aceptación verificables, consumo/idempotencia y revocación concurrente. Contrastar esquema efectivo solo con permiso específico futuro; ahora sin SQL ni migraciones. Definir matriz por actor/operación/recurso/agencia y políticas servidor/BD/RLS, incluyendo privilegios de servicio, permisos administrativos expresos y ausencia de poderes globales por rol coordinador.
3. Implementación futura solo tras aprobación del diseño y autorización delimitada de código/migraciones/servicios/pruebas en TCE-2-LAB/ref ieioysefckvafdbasqxl, datos sintéticos y puertas REC-F2-004 resueltas. No activar relación hasta contar con autorización central y aceptación válida; no ampliar permisos por fallos parciales. Mantener producción, TCE-004 y bloqueos reales actuales intactos. No implementar agentes IA como parte de este incremento; cualquier delegación futura requiere permisos/mandato explícitos propios dentro del plan autorizado.
4. REC-F2-006: cuando se autorice, validar primero TCE-004 existente y después incremento multiagencia. Detallar dentro de los nueve experimentos originales de RLS/recursos, activación, revocación y concurrencia los casos siguientes; todos NO EJECUTADOS. No sustituir pruebas reales por dobles ni usar service_role para afirmar RLS verificada.
5. REC-F2-007: verificar flujos positivos/negativos de cambio de agencia y estado de membresías, contexto visible y accesibilidad móvil/teclado, listados/conteos/historial por agencia y ausencia de datos residuales de otro contexto; conservar funciones de los demás roles. Registrar evidencia sanitizada, entorno/versión, esperado/observado y revisión independiente/PO antes de aceptación, sin cerrar tareas/hallazgos por propuesta.

Casos futuros adicionales al protocolo existente, sin crear nuevos experimentos permanentes:

| Escenario sintético | Criterio propuesto para revisión, no resultado obtenido |
|---|---|
| Un coordinador con relaciones A/B y permisos distintos; otro solo A | Acceso legítimo dentro de cada membresía; cambiar agencia/ID no concede B al segundo ni une permisos de A/B; agencia C ajena denegada |
| Maestro/facultad expresa frente a Limitado sin facultad y coordinador invitado | No activar por autoasignación, aceptación sola o autorización sola; ambas condiciones verificadas para sujeto y agencia exactos. Limitado sin facultad no autoriza ni adquiere gestión administrativa |
| Invitado distinto, aceptación repetida, invitación revocada o alcance cambiado | Rechazo sin efecto indebido; un único alta/consumo coherente ante aceptación concurrente/reintentos; caducidad y cambios de alcance conforme al mecanismo todavía por aprobar |
| Revocar A con B vigente, mientras hay solicitudes concurrentes y JWT previo | Nueva operación de A denegada según orden de revocación/escritura, B preservada sin suspensión global; comprobar servidor/BD/Realtime/cachés, sin prometer cancelar respuestas ya emitidas |
| Recuperación y escalamiento | Ser coordinador A/B no permite sustituir credencial global de reclutador ni operar como administrador; B sigue requiriendo verificación independiente |
| Delegación híbrida futura | Revisar documentalmente límites: falta de permiso, permiso vencido/revocado, cambio de reglas propias o caso fuera de alcance impiden ejecución automática; excepciones/alto riesgo pasan a humano. No ejecutar agentes ni simular aceptación de una política todavía no aprobada |

Riesgos/reversión futura: cambios de representación no deben duplicar identidad ni perder historial; fallos entre autorización y aceptación mantienen estado no habilitado. Diseñar bloqueo/versionado y reconciliación antes de implementar. Reversión técnica requiere plan específico de LAB autorizado; hoy solo añadidos documentales reversibles con historia preservada. Siguiente acción actual: informe y revisión del PO, sin ejecución ni commit.

## REC-F2-001/002 — secuencia técnica consolidada A/B/C/D, 2026-11-06

Mandato PO «ratificación D, consolidación A/B/C/D y checkpoint»: A/B/C permanecen aprobadas sin cambios y D queda APROBADA POR EL PO el 2026-11-06 como requisito funcional. Su sección SPEC actualiza estado y condiciones sin duplicar íntegramente el contenido. La secuencia anterior de D se conserva como antecedente: su paso de ratificación final ya está satisfecho y no es la próxima tarea. No se presume implementación ni política concreta de IA aprobada.

1. **REC-F2-001, contrato técnico de identidad/autenticación/autorización.** Próximo entregable: especificar código→identidad técnica→Auth→reclutador con vínculo estable, custodia/mapeo/almacenamiento, anti-enumeración y ciclo de credenciales; recuperación independiente con autoridad/factores/revocación aún por definir. Incorporar coordinador global con membresías independientes, asignación central más aceptación y permisos vigentes por recurso/agencia. Diseñar invitación/aceptación/autorización/auditoría/revocación; no decidir mecanismos por ratificación funcional ni cambiar login de coordinador por inferencia. Revisar detalles con PO antes de implementar.
2. **REC-F2-002, modelo físico compatible.** Traducir contrato a perfiles/usuarios/membresías, estados, unicidad/FK, conservación de IDs e historial y transición desde coordinadores.agencia_id sin duplicar identidad o tener fuentes permisivas de autoridad. Definir idempotencia, transacciones, fallos Auth–BD y concurrencia con revocación. D sustituye el supuesto funcional de una agencia por coordinador, no acredita esquema real. Inspección efectiva de metadatos LAB necesita autorización específica; no SQL/migraciones en este mandato.
3. **REC-F2-002, diseño RLS y límites.** Completar matriz actor/rol/operación/recurso/agencia con identidad/membresía/permisos actuales; proteger consultas/escrituras directas, proyecciones, joins, RPC, conteos y Realtime y sus dependencias Storage. Guardas antes de privilegios de servicio; explicitar facultades administrativas Maestro/Limitado sin crear excepciones generales a C ni poderes globales por multiagencia. Validación técnica/revisión de políticas pendiente, sin instalarlas ahora.
4. **Implementación aislada futura, previa autorización.** Solo TCE-2-LAB/ref ieioysefckvafdbasqxl y datos sintéticos, con diseño revisado, ejecutor/revisor, archivos/operaciones y reversión aprobados. Resolver antes puertas REC-F2-004 de conexión, clave LAB, ACL, transporte/egress y entorno operativo; autorización específica para código/migraciones/servicios/pruebas. Mantener bloqueos actuales y producción fuera de alcance. Agentes IA no se implementan ni habilitan por esta ratificación; delegaciones concretas/controles humanos requieren mandato posterior.
5. **REC-F2-006/007, pruebas futuras.** Validar primero TCE-004 existente en entorno autorizado; luego negativos/positivos por agencia, asignación autorizada y aceptada, facultad expresa, ausencia de autoelevación, revocación local, idempotencia/concurrencia y fallos intermedios. Reutilizar nueve experimentos originales y sus casos detallados, conservados NO EJECUTADOS; cobertura funcional de cambio de agencia/contexto/accesibilidad en REC-F2-007, dependencias Storage/seguridad REC-F2-003/005 intactas. Registrar esperado/observado/estado final por versión y revisión independiente/PO. No cerrar tareas/hallazgos sin evidencia y aceptación.

Ratificación funcional y aceptación técnica son distintas: REC-F2-001/002 EN_CURSO; REC-F2-006/007 PENDIENTES; implementación NO INICIADA y laboratorio NO EJECUTADO. Única operación final autorizada ahora: checkpoint documental de cuatro rutas con cambios pendientes, mensaje indicado en TASKS y hooks sin omitir, seguido de informe/árbol limpio y detención. No nuevas fases, auditoría ni ejecución de esta secuencia por figurar aquí.

## REC-F2-001/002 — aplicación del contrato técnico propuesto, 2026-11-06

Mandato «Implement the plan», solo documentación. SPEC «contrato técnico propuesto de identidad y autorización» define interfaces lógicas y estados; A/B/C/D no se reabren. Preferencia PO: SSR/navegador y política candidata de recuperación para revisión, no política aprobada.

Secuencia: revisar contrato y pendientes PO; después REC-F2-002 diseñar almacenamiento privado/vínculos/estados/membresías, restricciones y RLS compatibles; presentar delta y reversión antes de cualquier implementación. No crear SQL/migraciones ahora. Conservar IDs de reclutadores y relaciones existentes; migrar coordinadores.agencia_id hacia relaciones múltiples sin duplicar identidad ni dos fuentes permisivas. Vínculos por email actuales requieren asociación estable comprobada, nunca reemplazo masivo por auth.uid(). Login actual por código/localStorage requiere adaptación coordinada de servidor, cookies y consultas directas, sin mantener bypass antiguo. No inspección de esquema efectivo: documentación/código no acreditan BD desplegada.

Casos futuros REC-F2-002/006: código inexistente frente a contraseña errónea sin enumeración; mapeo/identidad técnica editados por perfil o Auth directo; sujeto sin vínculo; cookies inválidas y refresh concurrente; contexto/agencia/recurso ajenos; cambios de rol/dueño/agencia; alta huérfana Auth–BD; doble aceptación y recuperación consumida dos veces; autorización revocada antes de activar; revocar A conserva B; JWT previo tras revocación. Incluir positivos y estado final, no solo HTTP; service_role no sirve para acreditar RLS. Revisar exposición nativa de identificador técnico en sesión sin tratarlo como secreto de autenticación.

REC-F2-007: selección/cambio de agencia, cachés y navegación sin datos residuales, accesibilidad y mensajes genéricos útiles; preservar candidatos sin registro y contratos Maestro/Limitado. Casos desarrollan nueve experimentos originales, todos NO EJECUTADOS. REC-F2-006 valida primero TCE-004 cuando haya entorno autorizado. Implementación/pruebas futuras solo TCE-2-LAB/ref ieioysefckvafdbasqxl, datos sintéticos y puertas REC-F2-004 resueltas, con autorización específica. Recuperación permanece bloqueada hasta ratificar autoridad/factores/entrega/sesiones. Sin agentes IA, servicios ni cambios productivos.


## Impacto de inventario MF-PO-001 a 030 sobre F2, 2026-11-06

Fuente y descripciones literales en SPEC «Inventario funcional del PO». Todas las prioridades y aceptaciones son PROPUESTAS. No crea fase, tarea ni autorización de implementación. Se mantiene contrato REC-F2-001 pendiente intacto.

| Grupo (filas del inventario SPEC) | Datos / seguridad y permisos / interfaz / integraciones | Dependencias y riesgo |
|---|---|---|
| L — catálogo y domicilios | Separar planta, entrevista, punto y parada; ubicaciones y estado del catálogo con relación a vacante. Lectura según audiencia y escritura por empresa/agencia autorizada. Copia/enlaces Maps son UI; no conexión ahora | REC-F2-001/002/006/007: cardinalidad, propiedad compartida y vigencia antes de modelo físico; no propagar cambios a otra agencia por accidente |
| D — documentos/pases | Entidad archivo con tipo, dueño/empresa/planta/agencia y audiencia; autorización de listar/ver/copiar/descargar/subir/borrar, Storage y registro coherentes. UI dos pases/acciones separadas. URL pública construida no demuestra bucket público | REC-F2-001/002/003/006/007, TCE-001/006/015: definir alcance antes de esquema; impedir acceso público PDF sin bloquear información pública legítima; investigar denuncia sin afirmar contaminación real |
| C — chat/mensajes/eliminación | Separar candidato, postulación, conversación y mensajes; plantillas/disparadores/calendario y auditoría por agencia; retención/borrado por decidir. Panel lateral consume ficha autorizada, nunca datos por teléfono | REC-F2-001/002/006/007, TCE-008/011/012/013: no confundir archivar, borrar y eliminar historial; mensajes automáticos idempotentes sin IA implícita |
| W — WhatsApp | Determinar exportación de historial frente a continuación o sincronización; datos de terceros, consentimiento, entrega y trazabilidad, permisos/retención y dependencia proveedor por aprobar | REC-F2-001/002/003/006/007: transferencia externa no está aprobada; evitar copiar CV/documentos/chats ajenos. No configurar ni contactar proveedor |
| U — usabilidad/trámites | Botones/etiquetas/columnas sin datos nuevos salvo confirmar municipio. No deducir autorización de WhatsApp de una etiqueta. Enlaces gubernamentales leídos del código, vigencia/destino no verificados | REC-F2-001/006/007; REC-F2-002 solo si municipio exige modelo. Descargar/copiar archivo además requiere grupo D. No automatizar trámites ni recomendar URL no validada |
| I — identidad vacante | UUID estable separado de título y número visible; unicidad/ámbito de numeración y clave de importación. Nunca deducir dueño por ID ni actualizar agencia ajena | REC-F2-001/002/006/007, TCE-002/016: renombrar sin ID no debe fusionar ni duplicar silenciosamente; clave empresarial externa por decidir |
| E — editorial | Canal/publicación/curación/propiedad y aprobación humana; UI/copy y enlaces externos, sin nueva integración o IA aprobada | REC-F2-007; REC-F2-001/002/003/006 solo si se propone CMS/archivos/publicación autenticada después, no infraestructura ahora |
| R — referidos | Token de atribución distinto de identidad; persistencia/precedencia/caducidad y navegación. No concede sesión ni recursos privados | REC-F2-001/002/006/007, TCE-009: preservar atribución legítima al cambiar vacante/agencia, sin reasignación comercial inventada |
| M — múltiples postulaciones | Candidato estable con postulaciones independientes; decidir traslado versus nueva postulación y enlace de conversación, etapas, comisiones, permisos y traza | REC-F2-001/002/003/006/007: no UPDATE vacante_id ciego ni historial perdido; cambio cruzado de agencia requiere reglas y autoridad específicas |
| Q — cupos | Definir cupo requerido/disponible/cubierto y estado de vacante; transición/contadores consistentes con entrevistas/contrataciones y reactivación | REC-F2-001/002/006/007, TCE-010/011: garantizar concurrencia/idempotencia en BD autorizada, no confiar en guardas cliente |

Puerta previa REC-F2-002: PO debe decidir MF-PO-015/024/025/026/027/028/029 y relación con 016/018/020/030 antes de congelar entidades, claves, relaciones y políticas afectadas. WhatsApp/automatismos (007–012) requieren contrato de conversación/retención/eventos; no bloquean diseño no afectado, sí habilitación de esos caminos. A/B/C/D se conservan: coordinador/reclutador multiagencia opera por membresía/rol/recurso y facultad vigente, no permisos unidos.

Secuencia propuesta: PO valida inventario/prioridades y resuelve decisiones de cardinalidad/propiedad/retención; conciliar contrato REC-F2-001; diseñar delta físico y matriz RLS REC-F2-002 con Storage REC-F2-003; solo tras autorización implementar incremento aislado LAB y validar REC-F2-006/007. Nuevas mejoras sin relación de estabilización permanecen trabajos futuros, sin abrir otra fase ni incorporarlas como implementación F2 aprobada.

Casos futuros (NO EJECUTADOS): C1 postula V1/V2 preservando historias; cambio repetido/concurrente sin doble comisión ni pérdida de referido; coordinador A/B con recursos B inaccesibles al contexto A; documento/pase de empresa A no sustituye B; enlaces copiados no filtran privados; aceptación/revocación vigentes; reimportar título distinto con/sin ID; cupo agotado simultáneo; archivar frente a borrar con retención; envío automático duplicado/fuera de horario; exportación WhatsApp solo con alcance aprobado. Añaden detalle a protocolo existente, no reemplazan nueve experimentos originales. No SQL, tests ejecutables ni servicios ahora.

## Consolidación DF/DA — impactos y secuencia dentro de F2, 2026-11-06

Fuente ratificada y requisitos completos en SPEC «Consolidación DF-PO-001…005, DA-PO-001 y recuperación de dos vías». Sucesión delimitada del análisis MF previo, sin borrarlo ni duplicar inventario/tareas. No investigación externa ni selección tecnológica ahora.

| Decisión | Inventario relacionado | Dependencias e impacto técnico pendiente |
|---|---|---|
| DF-PO-001 | MF-PO-026; 011/016/028 | REC-F2-001/002/006/007: identidad de candidato estable y postulaciones separadas; conversaciones/estados/historial conservados; decidir vínculo chat nueva postulación, cierre/simultaneidad/atribución/comisión |
| DF-PO-002 | MF-PO-018; 007…011/026 | REC-F2-001/002/006/007: visibilidad/archivo separados de mensajes/postulación; retención, actor que archiva, consulta histórica y restauración por diseñar |
| DF-PO-003 | MF-PO-003/006/015/024/025/030; 001/004/005/027 | REC-F2-001/002/003/006/007: propietario tipado y reutilización explícita autorizada, sin herencia implícita de acceso; definir planta/sede/ruta/vacante y audiencia |
| DF-PO-004 | MF-PO-029; 026/028 | REC-F2-001/002/006/007: operación de admisión/cupo consistente bajo concurrencia, causas de pausa diferenciadas, reactivación autorizada e importación/idempotencia |
| DF-PO-005 | MF-PO-012/023 | REC-F2-001/002/003/006/007 según alternativa futura: investigación de viabilidad, no integración. Contemplar privacidad/consentimiento/costos/historial sin proveedor elegido |
| DA-PO-001 | MF-PO-007…011/018/026/029; contexto 001/004/005/015 | REC-F2-001/002/006/007 y seguridad REC-F2-005, datos REC-F2-003: identidad/capacidades propias, control exclusivo IA/humano, acciones autorizadas, auditoría, tareas/notificaciones, límites/fallos |
| Recuperación dos vías | Contrato REC-F2-001; protege actores del inventario, sin nueva fila MF | REC-F2-001/002/005/006: factor verificado ordinario y excepcional central independiente; autoridad/factores/plazos/canales por aprobar |

Secuencia propuesta:
1. REC-F2-001 conciliar contratos de nueva postulación, archivo, recursos jerárquicos, cupo, control de conversación y recuperación dos vías. Presentar decisiones técnicas pendientes al PO sin reabrir dirección funcional ratificada.
2. REC-F2-002 preparar diseño físico compatible y matriz de operaciones/grants/RLS: preservar IDs/historial; distinguir sujeto humano/agente sin acceso por credencial universal; propietario/reutilización documental autorizados; modelo de cupo/causas de pausa. Incluir estados/controladores/ejecutores conversacionales y contratos idempotentes como necesidades arquitectónicas, sin construir agente.
3. Propuestas técnicas para revisión: serializar toma de control y envío sobre una versión de control autoritativa; un envío automático verifica control IA en el mismo límite de confirmación y pierde autorización si humano confirma primero. Mensajes ya enviados no se eliminan retroactivamente; mecanismo para trabajos en vuelo y entrega externa pendiente de diseño. Deduplicar comandos y auditar actor/controlador/resultado sin exponer datos personales. Ninguna solución concreta ratificada.
4. Mantener bloqueos de entorno REC-F2-004; implementación posterior solo con alcance/archivos/operaciones y LAB/datos sintéticos autorizados. REC-F2-003 define Storage/acceso; REC-F2-005 revisa privilegios/privacidad y preselección. No infraestructura nueva, proveedor, servicio o agente en este mandato.
5. REC-F2-006/007: ampliar casos dentro de protocolo existente, sin nuevos experimentos permanentes: C1 V1/V2 con originales intactos y sin traslado automático comercial; archivo/consulta/restauración por ámbito; propiedad versus descarga documental y reutilización A/B; últimas plazas simultáneas y otras causas de pausa; toma humana concurrente con envío/reintento, devolución a IA sin perder contexto; fallo/escalamiento y acceso agente ajeno/revocado denegado. Incluir criterios legítimos, explicación/corrección y prohibición de decisión final sin humano. Pruebas NO EJECUTADAS, primero TCE-004 existente cuando se autorice integración.
6. DF-PO-005 abre investigación futura de APIs oficiales/limitaciones/privacidad/consentimiento/costos/historial/alternativas, pero esta intervención no la ejecuta ni habilita transferencia. No bloqueo de modelo no afectado por falta de integración WhatsApp.

No congelar esquema de conversaciones/postulaciones/cupo/documentos hasta delimitar pendientes; DA guía compatibilidad futura sin adelantar fase de construcción de agentes. A/B/C/D y requisitos históricos no sustituidos conservan vigencia. No cerrar REC-F2-001/002 ni aceptar seguridad por documentación.

## REC-F2-001/002 — dependencias DC-PO-001…004 y orden F2, 2026-11-06

Requisitos ratificados, invariantes propuestos y casos negativos en SPEC «DC-PO-001…004: plazas, Pipeline y supervisión». No nueva fase ni tarea, no autorización de implementación. Se conserva DF-PO-004; su interacción con reservas/lista de espera requiere precisión PO antes de habilitar caminos afectados.

Orden vinculante del proyecto: recuperar/corregir hallazgos → validación técnica y de seguridad con evidencia → mejoras funcionales posteriores según dependencias y autorizaciones. Solo dependencia técnica expresamente autorizada puede alterar esa secuencia; mencionar una dependencia no la autoriza. Documentación anticipada de reservas/IA no desplaza reparación TCE.

| Decisión | Dependencias existentes | Diseño/validación pendiente |
|---|---|---|
| DC-PO-001 | MF-PO-029/026/028; DF-PO-001/004; REC-F2-001/002/006/007 | Reserva por cita válida confirmada, conversión sin doble consumo y descarte autorizado que libera solo reserva activa; reglas posteriores a contratación pendientes |
| DC-PO-002 | Pipeline/historial TCE-010/011; REC-F2-001/002/006/007 | Cuatro dimensiones separadas; resultados reales por reclutador con actor/fecha/motivo/evidencia; no equivalencia vencimiento-descarte |
| DC-PO-003 | DA-PO-001, MF-PO-007…011/029; REC-F2-001/002/005/006/007 | Supervisión/alertas sin efectos de cupo; control humano, contexto y facultades vigentes; plazos sin fijar |
| DC-PO-004 | TCE-009/010/011/012/013; REC-F2-001/002/005/006 | Invariantes propuestos, transacción/idempotencia/concurrencia y RLS por actor/agencia; ninguna garantía efectiva acreditada |

Secuencia documental/técnica propuesta: REC-F2-001 resolver con PO interacción DF-PO-004 y decisiones abiertas, especificar comandos y transiciones sin seleccionar esquema; REC-F2-002 diseñar representación compatible de citas/reservas/ocupaciones/seguimiento, restricciones y autorización/RLS, preservando IDs e historial. No congelar claves/cardinalidades o usar comision_aplicable como contador autoritativo de reservas por herencia del código.

Antes de cualquier implementación: delimitar qué corrige hallazgos versus qué es mejora; obtener autorización concreta y revisión de impacto/reversión. REC-F2-004 mantiene bloqueo de conexiones/arranque; validación futura en LAB sintético requiere permiso específico. REC-F2-006 comprobará primero TCE-004 existente y luego incrementos autorizados; REC-F2-007 cubrirá claridad de estados, pendientes y accesibilidad. Casos de SPEC desarrollan protocolo de nueve experimentos sin ejecutarlo ni duplicarlo. No crear agente IA, motor de alertas, SQL o servidor.

La fórmula es criterio técnico propuesto, no decisión sobre reservas físicas por plaza. Diseño debe tratar atomicidad de resultado nuclear/historial, reintentos, carrera contratación-descarte y confirmación última plaza; entrega de alerta es efecto separado que nunca mueve cupo. No inferir liberación por timeout. Diseño de importación/capacidad/reactivación queda bloqueado en sus políticas pendientes, sin impedir revisión documental de lo ya ratificado.

## REC-F2-001 — dependencias y avance tras cinco decisiones P0, 2026-11-06

Reglas completas en SPEC «cinco decisiones P0 ratificadas para CT-01/CT-02»; no repetirlas como propuestas sin aprobación. P0 1–5 son referencias locales al mandato PO, no nuevas tareas o hallazgos. A/B/C/D, DF/DA/DC y pendientes no resueltos conservan vigencia.

| Política ratificada | Dependencia de diseño e impacto REC-F2-002 | Condición de avance pendiente |
|---|---|---|
| Ordinaria: canal verificado o códigos de un uso/enrolamiento seguro | Vínculos/factores/autorización limitada y consumo único, sin contraseña propia | Especificar canal/enrolamiento/custodia/rotación y validación, sin proveedor elegido |
| Excepcional según riesgo y dos aprobaciones para privilegiadas/alto riesgo | Estados de aprobación, identidad/facultad vigente e independencia de actores | Definir clasificación/evidencia/autoridades y procedimiento, sin delegación administrativa inventada |
| Revocación global y nueva autenticación | Vigencia autoritativa de sesiones/credenciales, permisos actuales y canales directos | Diseñar consistencia Auth–BD, fallos y revocación efectiva sin esperar solo JWT |
| Matriz base y delegaciones delimitadas | Roles/concesiones/ámbito/vigencia y auditoría; RLS/funciones seguras | Completar catálogo/concedentes/revocación sin autoconcesión, escalamiento ni subdelegación tácita |
| Enrolamiento heredado asistido con verificación independiente | Estados de reconciliación y vínculo estable, IDs/historial conservados | Especificar prueba/actor independiente y resolver ambigüedad antes de activar |

Secuencia propuesta: completar CT-01 en REC-F2-001 con flujos ordinario/excepcional, enrolamiento y revocación; completar CT-02 con matriz y ciclo de delegaciones/membresías; presentar mecanismos y pendientes concretos para revisión sin reabrir reglas ratificadas. Distinguir cierre documental de contrato (aún NO otorgado) de aceptación REC-F2-001, implementación y validación real. REC-F2-002 no inicia automáticamente: preparar transición solo con contratos revisados, trazabilidad y autorización de alcance.

Validación futura REC-F2-005/006/007: casos de SPEC, roles legítimos positivos y negativos, sujeto ambiguo, doble consumo/aprobación/revocación concurrente, tokens previos y acceso directo a BD/Realtime/Storage. Integración primero TCE-004 existente cuando se autorice entorno; nueve experimentos originales siguen NO EJECUTADOS. REC-F2-004 mantiene conexión/arranque bloqueados; no código/SQL/migraciones/servicios/pruebas ahora.

Mantener orden vigente de reparación de auditoría → evidencia técnica/seguridad → mejoras posteriores autorizadas. Las políticas P0 no autorizan funciones nuevas, agentes IA ni operación productiva. Pendientes de reservas/cupos/lista de espera/retención/atribución no se consideran resueltos por CT-01/02.

## CT-01/CT-02 — avance tras seis políticas operativas, 2026-11-06

Reglas ratificadas y relación con cinco P0 en SPEC «seis políticas operativas ratificadas». No crear otra fase/tarea ni repetir como pendientes las direcciones ya aprobadas.

Secuencia propuesta: REC-F2-001 completar catálogo de evidencia/independencia/riesgo, autoridades y matriz de ejecutar/conceder/revocar; definir enrolamiento/sustitución y recuperación limitada con revocación global; concretar límites de sesión por rol y consulta histórica por otros actores con finalidad/ámbito auditables. Conservar contrato administrativo vigente mientras se revisan parámetros, sin inventar nuevos tiempos. Vincular cada transición y error seguro con amenaza y caso esperado.

REC-F2-002 recibirá después contratos revisados, matriz y estados: factores/consumo, aprobaciones distintas, sesiones/credenciales/membresías y delegaciones, identidad heredada e historial. Diseñar protección servidor/BD/RLS y canales directos; suspensión A no abre lectura histórica al suspendido ni afecta B; recuperación global exige reautenticación sin devolver facultades revocadas. Inspección efectiva/diseño físico y ejecución requieren alcance autorizado; no iniciarlos por esta nota.

Condiciones de cierre documental CT-01/02, TODAVÍA NO satisfechas: mecanismos y pendientes concretos especificados, matriz/estados/errores trazados a las seis políticas y P0, revisión independiente y aceptación expresa sobre versión identificable. Implementación y validación real son posteriores y separadas; no cerrar REC-F2-001/002. Validación futura REC-F2-005/006/007 deberá cubrir evidencia insuficiente, cuenta ordinaria de alto riesgo, independencia de aprobadores, consumo concurrente, sesiones revocadas, delegaciones ajenas y consulta histórica negada/permitida con auditoría. Nueve experimentos originales siguen NO EJECUTADOS; integración primero TCE-004 existente cuando se autorice.

Mantener REC-F2-004 red/arranque bloqueados, retención/Storage vinculados a REC-F2-003 y facultades IA propias según DA sin construcción. Correcciones de hallazgos anteceden validación con evidencia y mejoras autorizadas. DF/DC y sus pendientes (cupos/lista de espera/atribución) intactos; este registro no habilita implementación.

## REC-F2-001 — consolidación R1, I-11 ratificada y puertas pendientes, 2026-11-07

Mandato PO «AUTORIZACIÓN PO: Consolidación documental CT-01/CT-02 R1», base master/5e0cb789927d6b5ab8892b33cfce38f6cdfd75da: escritura autorizada exclusivamente en cuatro documentos. Fuente única de políticas/contratos/matrices: SPEC_RECUPERACION.md, sección «REC-F2-001 — consolidación documental CT-01/CT-02 R1 e I-11 ratificada, 2026-11-07». H01–H12/riesgos en HALLAZGOS; trabajo realizado/continuidad en TASKS. No duplicar contratos o P01–P40 aquí.

RATIFICADOS: A/B/C/D, cinco P0, seis políticas, separación central/agencia e I-11. Ya no pedir decisión conceptual de separación ni aprobación funcional de suspensión/restauración global. Mecanismos R1 incorporados como propuesta, revisión/aceptación y validación pendientes. P35 exige evidencia técnica, no nueva ratificación funcional.

Secuencia documental vigente:
1. Aplicar autorización limitada a los cuatro documentos, preservando antecedentes y contenido completo R1.
2. Revisar diff completo, alcance, identificadores, referencias, políticas/estados y conservación; solo verificación documental, no pruebas de producto.
3. Presentar resultado para revisión PO, sin commit/push/cambio de rama ni transición automática.
4. Tras revisión, cualquier checkpoint mediante commit requiere autorización posterior expresa.

| Puerta | Dependencia | Condición todavía pendiente |
|---|---|---|
| Contratos | I-01–I-11, A-01–A-12, M-01 y H01–H12 | Revisión/aceptación de versión identificable; consolidar no cierra |
| Autoridad operativa | Personas/facultades/conflictos/evidencias/finalidades | Catálogo autorizado; no rol genérico |
| Parámetros | Sesiones/canales/vigencias/cuotas/retención | Valores/unidades/responsables/versión y P40 |
| Auth | Procedencia/refresh/rutas alternativas | Garantía demostrada; P01–P14/P30/P37 |
| Auth–BD | Resultado incierto/efecto tardío | Acreditar terminación/reconciliación antes de cambio incompatible; P14/P29/P30 |
| Concurrencia | Recuperación/revocación/delegaciones/controlador | Intercalaciones/orden y estado final; P17/P20/P29–P36 |
| RLS/RPC/service-role | Grants/funciones/tablas/vistas/columnas | Inspección/pruebas autorizadas por superficie; P25/P38 |
| Storage/Realtime/cachés | Objetos/entrega/URLs/privados | Evidencia específica; REC-F2-003 y P38 |
| Migración | Corte/autoridad única/reversión | Sin fallback ni sesión anterior; P26/P39 |
| IA/despacho | Barrera/traspaso/resultados inciertos | Transporte demostrado; no habilitación por documento |
| Validación | P01–P40 y nueve experimentos existentes | Autorización de entorno/datos/efectos y evidencia posterior |

Auth sin reconciliación demostrable de efecto incierto bloquea flujo afectado; plazo/lease no sustituyen garantía. I-11 ratificada requiere demostrar rechazo efectivo también en límites directos; restauración nunca rehabilita sesiones. Local A no suspende B. Autoridad central tampoco omite controles locales privados.

REC-F2-004 mantiene conexiones/arranque bloqueados. Pruebas sintéticas futuras requieren permiso específico; primero integración TCE-004 existente cuando se autorice. P01–P40/nueve experimentos NO EJECUTADOS. REC-F2-005/006 validarán dependencias y concurrencia; REC-F2-007 roles/contexto/claridad/alcance; REC-F2-003 Storage/retención. Sin SQL, implementación o laboratorio por esta secuencia.

REC-F2-001/002 EN_CURSO solo diseño. Cierre documental, implementación y validación son actos separados; REC-F2-002 no inicia automáticamente. Mantener 17 hallazgos abiertos, discrepancias TCE-003/012 y TCE-004 EN_VALIDACION. DF/DA/DC, privados del candidato, recursos compartidos/atribución y pendientes de cupo/lista de espera no se resuelven aquí. Prioridad: reparar hallazgos → validar con evidencia → mejoras autorizadas.

### Segunda revisión R1 — correcciones autorizadas y puertas complementarias, 2026-11-07

PO autorizó incorporar cuatro correcciones propuestas y dos precisiones de consistencia en los cuatro documentos, conservando el diff previo. Fuente contractual: SPEC, «Salidas de resultado_incierto y autoridad de reconciliación», «I-10 — exclusión, saga y resultado incierto Auth–BD», «Transporte de sesión y protección de mutaciones» y «Subcasos explícitos de aceptación». HALLAZGOS registra tratamiento/riesgos; TASKS trabajo realizado. No requiere nueva autorización para esta escritura, sí para cualquier commit/prueba/implementación.

| Puerta complementaria | Condición pendiente / evidencia futura |
|---|---|
| Reconciliación | Designar facultad específica; demostrar resultado por intento y ausencia de efectos tardíos; fallida_bloqueada no habilita identidad; P30.a–P30.d |
| Transacción de inicio | Consumo I-10/ejecución/generaciones/bloqueo/idempotencia/auditoría juntos, sin efecto Auth antes de commit; P14.a–P14.c |
| Correspondencia de estados | Tabla principal/salidas/narrativa aceptan reconciliando→efecto_pendiente solo en mismo supuesto; terminal no revive; P30.b/P30.c |
| Bloqueo transversal | Login/renovación/operaciones protegidas denegados en fallida_bloqueada por todas las rutas pertinentes; no atribuirlo a Auth sin prueba; P30.d/P25/P37/P38 |
| Transporte | SSR/navegador/cookies coherentes y configuración confiable; CSRF fuera y dentro de administración; sin excepción por Origin ausente; P25.a/P28.a/P37.a/P37.b/P40.a |
| Enrolamiento/entrega | Protocolo por tipo, prueba de control y tratamiento de entrega incierta; sin retirada implícita de factor anterior ni reexposición; P09.a–P09.e/P31.a |
| Reincorporación/auditoría | A-07 con nueva autorización/aceptación cuando corresponde y A-12 sin privados implícitos; ausencia de efectos; P18.a/P18.b/P19.a/P20.a/P23.a–P23.c/P27.a/P38.a |

Mantener secuencia aprobada reparación → validación con evidencia → mejoras autorizadas. No ejecutar ahora P01–P40/subcasos/nueve experimentos; REC-F2-004 red/arranque bloqueados, restantes puertas Auth/RLS/RPC/Storage/Realtime/cachés/concurrencia/migración vigentes. 30 MF-PO diferidas en implementación, sin borrar direcciones funcionales ratificadas.

Paso posterior: auditoría independiente de la consolidación y revisión PO; la revisión del mismo agente no la sustituye. Sin nueva fase/tarea, sin transición automática a REC-F2-002, sin cierre de CT-01/CT-02/REC-F2-001 o 17 hallazgos. Catálogos/personas/parámetros y garantías externas siguen pendientes. Commit, pruebas o implementación requieren autorización expresa posterior.

## CT-01/CT-02 — aplicación de la delimitación funcional ratificada y AN-80, 2026-11-07

Fuente normativa única: SPEC, «CT-01/CT-02 — delimitación funcional ratificada por el PO y continuidad AN-80, 2026-11-07». Autoridad: ratificación expresa del PO; agente ejecutor únicamente del registro documental. Base master/38d58105574ecf9b786c64ce1b4dad86b01a6e87, árbol limpio y staging vacío antes de esta actualización. AN-80 es referencia del análisis previo, no nueva tarea.

Aplicación al alcance de REC-F2-001: completar el diseño de identidad/autenticación/recuperación/sesiones/suspensión y de membresías/roles/facultades/delegaciones/autorización central, local y por recurso, incluidos privacidad y auditoría de acceso. Candidatos, postulaciones, documentos, atribución, recursos compartidos y control IA/humano se revisan como fronteras de autorización y seguridad.

Dependencias diferidas: el desarrollo funcional completo de MF-PO, WhatsApp, cupos, citas, pipeline y demás negocio no indispensable para identidad/seguridad no es condición de completar funcionalmente CT-01/CT-02. Se preservan sus decisiones ratificadas y pendientes propios, sin implementarlos, borrarlos ni darlos por resueltos. Su diferimiento no elimina autorización, aislamiento, protección privada o auditoría exigibles en las superficies existentes: deben conservar controles efectivos o permanecer bloqueadas si su autorización no se acredita. Este registro no implementa ni verifica bloqueos.

Orden documental dentro del trabajo existente: aplicar esta delimitación ya ratificada → concretar catálogos/parámetros/autoridades/protocolos pendientes de los contratos y sus fronteras → revisar cobertura y trazabilidad I/A/M→H→P → revisión independiente y aceptación documental expresa sobre versión identificable. No volver a pedir la decisión funcional de alcance AN-80 ni reabrir A/B/C/D, P0, POL, separación central/agencia o I-11.

Dependencias técnicas conservadas: Supabase Auth, RLS/RPC/grants, Storage, Realtime/cachés, migración y pruebas siguen sin garantía acreditada; REC-F2-004 mantiene conexiones/arranque bloqueados. REC-F2-003/005/006/007 conservan su alcance de validación posterior, con integración TCE-004 existente primero cuando se autorice. No se inicia ni amplía REC-F2-002 por este procedimiento. Cierre documental, aceptación técnica, implementación y habilitación son actos separados; CT-01/CT-02/REC-F2-001 y hallazgos permanecen abiertos. Sin pruebas, servicios, código, gobernanzas, commit, push, merge ni deploy; entregar diff/verificaciones y detenerse.

## Dependencias y secuencia existente tras reconciliación documental — 2026-11-07

Fuente/autorización: PO «Aplicación documental autorizada por el PO», exclusivamente registro en cuatro documentos. HALLAZGOS, «Reconciliación sucesora del plan y decisiones recientes — 2026-11-07», dirige esta reconciliación; normativa puntual en SPEC, «Normativa ratificada y propuestas pendientes de la reconciliación, 2026-11-07»; continuidad en TASKS. AN-80 y antecedentes preservados. No nuevas fases, tareas ni ejecución técnica por esta secuencia.

Dentro de REC-F2-001: partir de AN-01 y autoridad central sobre códigos AN-02 ya ratificadas → precisar facultades central/coordinador para solicitud/captura, emisión/cambio, provisión/vinculación y activación → resolver campos/usuario y credencial provisional → concretar factor/cambio autenticado y membresías/atribución → completar cobertura I/A/M→H→P → revisión independiente y aceptación documental identificable. Propuestas no ratificadas permanecen pendientes hasta decisión PO; ingeniería define mecanismos respetando autoridad y efectos funcionales aprobados. Namespace/provisión del inventario histórico AN-02 conserva pendiente propio diferenciado por fuente/asunto; no confundirlo con autoridad central sobre códigos.

Después, con autorizaciones separadas: acreditar entorno operativo REC-F2-004 y avanzar diseño/contraste REC-F2-002/003/005 según contratos revisados → REC-F2-006 integra primero TCE-004 existente → corregir por incrementos causas raíz de identidad/acceso y consumidores, integridad/invitaciones/publicación/completitud/plataforma conforme a dependencias TCE → validar REC-F2-006/007 con evidencia y aceptación de F2 → retomar mejoras F3 y agentes F4 conforme a puertas existentes y autorización. Los antecedentes de diseño conceptual REC-F2-002 y preparación offline REC-F2-004 no se borran ni se declaran aceptación técnica; no se inicia/amplía su ejecución ahora.

Escaparates/enlaces por agencia, WhatsApp y desarrollo funcional completo MF/cupos/citas/pipeline/IA siguen diferidos según AN-80; no son condiciones automáticas de cierre documental CT-01/CT-02. La atribución y el control IA/humano siguen fronteras de seguridad; superficies existentes requieren autorización efectiva acreditada o bloqueo. Diferir mejoras no exceptúa defectos de autorización/integridad TCE-010/011 de operaciones habilitadas: corrección, bloqueo o tratamiento expreso correspondiente siguen necesarios, sin afirmar ninguno ejecutado aquí. El apoyo IA al desarrollo no habilita agentes operativos ni adelanta F4.

Puertas conservadas: catálogos/parámetros/autoridades y conflictos PO resueltos o bloqueados expresamente; diseño revisado; entorno/operaciones/datos autorizados; pruebas y estado final verificables; revisión/aceptación por operación y riesgos/excepciones expresos antes de cierre. Supabase Auth/RLS/Storage/Realtime/migración sin garantías nuevas, REC-F2-004 red/arranque bloqueados, P01–P40/subcasos y nueve experimentos NO EJECUTADOS. Estados, 17 TCE/16 GOV/H01–H12/siete tareas F2/30 MF intactos. Terminar esta actualización con diff/check/status y preservación AN-80; informar y detenerse sin commit, pruebas, servicios, agentes o despliegues.

## REC-F2-001 — dependencias tras D-01–D-04 ratificadas, 2026-11-07

Mandato PO «REC-F2-001 / Integración D-01 a D-04», exclusivamente documental. Rector: HALLAZGOS, «Decisiones PO D-01–D-04 — reparto funcional de alta, códigos y membresías, 2026-11-07»; normativa en SPEC, «D-01–D-04 — normativa ratificada de alta, códigos y membresías, 2026-11-07»; continuidad TASKS. AN-01/AN-02/AN-80/R1 y las 111 adiciones previas preservados. El paso anterior de decidir reparto funcional central/coordinador queda satisfecho solo en el alcance D-01–D-04; no repetirlo como aprobación pendiente ni ratificar toda la matriz propuesta.

Siguiente secuencia dentro de REC-F2-001, previa autorización de continuación: actualizar propuesta de matriz con registro nuevo/incorporación existente y servicios centrales acotados → concretar titularidad/vínculo/aceptación, facultades/designaciones y parámetros → especificar provisión/credencial inicial/entrega y activación global/local separadas → precisar fallos/reconciliación y dependencias de recuperación/cambio/suspensión global conforme R1 → revisión independiente y aceptación documental. Emisión automática no omite unicidad, concurrencia, idempotencia o auditoría; activación local no omite aceptación/precondiciones ni habilita globalmente.

Procedimientos técnicos, titularidad, credencial inicial, recuperación, cambio de contraseña, suspensión global y efectos inciertos siguen pendientes en lo no definido; I-11 no pierde su ratificación. Ninguna garantía Auth/RLS/Storage/Realtime/migración o prueba se acredita por automatizar. Conservar después la secuencia existente: entorno REC-F2-004 y diseño/contraste autorizado REC-F2-002/003/005; integración REC-F2-006 primero TCE-004 existente; correcciones y validación REC-F2-006/007 por dependencias antes de mejoras autorizadas. No iniciar esos trabajos por esta nota ni crear fases. Mejoras MF/WhatsApp/cupos/citas/pipeline/IA diferidas según AN-80, sin bloqueos automáticos de CT-01/CT-02; seguridad de superficies existentes sigue exigible.

CT-01/CT-02/REC-F2-001 y hallazgos abiertos, estados/inventarios y pruebas NO EJECUTADAS preservados. REC-F2-004 mantiene red/arranque bloqueados. Verificación exclusivamente documental de diff/check/stat/status y preservación del contenido anterior; entregar informe y detenerse sin commit, pruebas de producto, conexiones, servicios, código, SQL/migraciones/configuración, gobernanzas o deploy.

## REC-F2-001 — secuencia tras matriz reconciliada y activación por correo, 2026-11-07

Fuente: mandato documental y decisiones expresas del PO «REC-F2-001 / Consolidación documental CT-01 y CT-02». Rector HALLAZGOS, «Consolidación CT-01/CT-02 — activación inicial y matriz reconciliada, 2026-11-07». Remitir a SPEC, «CT-01/CT-02 — activación por correo y matriz operativa reconciliada, 2026-11-07», para normativa y matriz única 1–27/R/P/T; TASKS continuidad. Preflight y 162 adiciones anteriores preservados; sin nueva fase/tarea ni ejecución técnica.

Dependencias dentro de REC-F2-001: invitación inicial exclusivamente por correo y contraseña establecida por titular ya ratificadas → diseñar protocolo de enlace/entrega/control/correspondencia y titularidad restante → separar activación global de membresía y aceptación autenticada de incorporación existente → concretar recuperación por correo verificado y cambio autenticado/fallos/reconciliación conforme R1 → catálogos/designaciones/parámetros pendientes → revisión independiente y aceptación documental identificable. Login sigue código+contraseña, SMS/WhatsApp fuera de autenticación; no aprobación humana central individual por alta ni factores/plazos/proveedores/costos inventados. Control de correo no activa automáticamente relación local. No pedir nueva elección de canal ya resuelta; procedimientos y mecanismos permanecen pendientes.

Secuencia posterior intacta, solo con permisos específicos: REC-F2-004 acredita entorno; REC-F2-002/003/005 diseño/contraste y seguridad; REC-F2-006 integra primero TCE-004 existente; correcciones autorizadas por dependencias y validación REC-F2-006/007 antes de mejoras posteriores. AN-80 no convierte desarrollo completo MF/WhatsApp/cupos/citas/pipeline/IA en bloqueo automático de CT-01/CT-02, sin exceptuar seguridad de superficies existentes. Garantías Auth/RLS/Storage/Realtime/migración y pruebas pendientes; red/arranque LAB bloqueados. Estados/inventarios y P01–P40/subcasos/nueve experimentos NO EJECUTADOS conservados; sin cierre por redacción. Entregar diff/check/stat/status y preservación, detenerse sin commit, pruebas, conexiones, código, gobernanzas, SQL/migraciones/configuración o deploy.

## REC-F2-001 — puertas tras protocolo de activación y reenvío por correo, 2026-11-07

Mandato PO «CONSOLIDACIÓN DOCUMENTAL DEL PROTOCOLO DE ACTIVACIÓN POR CORREO». Rector HALLAZGOS, «Protocolo de activación por correo — ratificaciones, riesgos y trazabilidad, 2026-11-07»; fuente única normativa/técnica SPEC, «Protocolo de activación por correo — decisiones PO y diseño propuesto, 2026-11-07»; TASKS continuidad. Se preservan 247 adiciones anteriores y la matriz 1–27 sin copiarla. Estados/protocolos P/T propuestos no equivalen a implementación ni cierre.

Puertas dentro de REC-F2-001: revisión de propuesta incorporada → decidir política precisa de sustitución/revocación/reenvío y autoridad para corregir correo, titularidad/ambigüedad y límites pendientes → concretar mecanismos de enlace limitado/consumo único/24 horas/reintentos/entrega/correspondencia/reconciliación → revisión independiente y aceptación documental identificable. No reabrir vigencia/modalidades/canal ya ratificados; no inventar umbrales/proveedor/costos/factor. Autoservicio legítimo es requisito: cualquier diseño que permita enumerar o invalidar abusivamente invitaciones debe corregirse antes de habilitarse, sin eliminar la modalidad aprobada. Reenvío no cambia destino ni otros datos; sustitución correo es otro procedimiento pendiente.

Conservar secuencia posterior autorizada por separado: entorno REC-F2-004, diseño/contraste REC-F2-002/003/005, integración REC-F2-006 primero TCE-004, correcciones por dependencias y validación REC-F2-006/007 antes de mejoras autorizadas. Buzones de cualquier proveedor admitidos no habilitan Sign-In Google/Microsoft; SMS/WhatsApp fuera de autenticación, WhatsApp funcional sigue diferido según AN-80. Desarrollo completo de mejoras no bloquea automáticamente CT-01/CT-02; controles de superficies existentes sí exigibles. Garantías Auth/RLS/Storage/Realtime/migración y pruebas pendientes; LAB red/arranque bloqueados. No nuevas fases/tareas/hallazgos ni cierres. Finalizar con comprobaciones documentales/preservación y detenerse sin commit, pruebas, conexiones, código, gobernanzas/históricos, SQL/migraciones/configuración, servicios o deploy.

## REC-F2-001 — dependencias tras decisiones de titularidad y correo, 2026-11-07

Fuente PO «Recuperación de decisiones ratificadas y consolidación documental», continuación del mandato integral. Rector HALLAZGOS, «Consolidación integral — titularidad, E1–E7 y correo, 2026-11-07», contiene trazabilidad por decisión/contrato/tarea/P/pendiente. Normativa única SPEC, «Titularidad y cambios de correo — consolidación de decisiones PO, 2026-11-07»; TASKS continuidad. Preservar 374 adiciones previas, matriz única 27 e historia; no duplicar catálogo ni contratos aquí.

Puertas dentro de REC-F2-001: revisar incorporación fiel de E1–E7/criterios/políticas → concretar propuesta operativa/técnica de suficiencia aplicada, facultades/designaciones y manejo de evidencia por caso → diseñar corrección previa con invalidación/nueva invitación y cambio posterior autenticado/verificación nuevo bajo controles proporcionales → especificar recuperación excepcional, revocación de sesiones y reconciliación conforme I-10/P0/POL → parámetros/retención/validación legal pertinente pendientes → revisión independiente y aceptación documental identificable. Resolver ambigüedad solo central, escalonar evidencia técnica/complementaria/reforzada según necesidad; no identificación universal ni doble aprobación de toda alta normal. Sospecha/ambigüedad bloquea operación cuestionada sin retirar bloqueos independientes. No volver a pedir ratificación de políticas ya incorporadas.

Diseño posterior debe separar reenvío sin cambio de datos de corrección/cambio de correo; invalidar invitación anterior al corregir antes de activación está ratificado, mecanismos de concurrencia/revocación por validar. Autenticado que pierde correo anterior sigue controles proporcionales; sin correo ni credenciales requiere excepcional; ningún contacto conocido sustituye evidencia. Alto riesgo confirma revocación y dos personas independientes, sin limitar regla previa de revocación para toda recuperación completada. Viabilidad Auth, protección por superficies, política restante de reenvío, antiabuso, reconciliador y pruebas pendientes. No documentos/plazos/umbrales/mecanismos legales o técnicos inventados.

Secuencia existente después, solo con autorización delimitada: REC-F2-004 entorno, REC-F2-002/003/005 diseño/contraste y seguridad, REC-F2-006 integra primero TCE-004, correcciones por dependencias y validación REC-F2-006/007 antes de mejoras autorizadas. Sin fases/tareas nuevas ni cambios de estado; CT-01/CT-02/REC-F2-001 y hallazgos abiertos, inventarios y P/nueve experimentos NO EJECUTADOS intactos. Red/arranque LAB bloqueados; AN-80 conserva diferimientos sin convertir mejoras en bloqueo automático. Finalizar con integridad estática/diff/check/stat/status y preservación, informar y detenerse sin commit, pruebas, conexiones, código, históricos/gobernanzas, SQL/migraciones/configuración o despliegue.

## REC-F2-001 — puerta de revisión de suficiencia aplicada, 2026-11-08

Fuente: mandato PO «REC-F2-001, acreditación operativa de titularidad». Rector HALLAZGOS, «Acreditación operativa de titularidad — propuesta documentada, 2026-11-08»; definición única SPEC, «Acreditación operativa de titularidad — propuesta por escenarios, 2026-11-08»; TASKS continuidad. Se concreta documentalmente la propuesta de suficiencia por caso prevista en la sección de dependencias del 2026-11-07; no se declara aceptada ni técnicamente validada esa puerta.

Secuencia vigente: revisión PO de aplicación propuesta y resolución o bloqueo explícito de facultades/designaciones indispensables → diseño autorizado de corrección previa y cambio posterior de correo, con estados/versiones e invalidación/nueva invitación y controles de sesión → recuperación excepcional/revocación/reconciliación I-10 → parámetros/retención y validación legal pertinente → revisión independiente y aceptación documental identificable. Se preservan direcciones ratificadas; no imponer identificación universal, doble aprobación de toda alta o permisos globales al coordinador. Política restante de reenvío/antiabuso y viabilidad Auth siguen pendientes; no sustituir corrección de correo por reenvío.

Dependencias posteriores sin inicio automático: REC-F2-004 entorno autorizado, REC-F2-002/003/005 diseño/contraste y seguridad, REC-F2-006 integración primero TCE-004, correcciones y validación REC-F2-006/007 antes de mejoras autorizadas. La propuesta documental no exige cerrar garantías técnicas antes de redactar, ni las acredita; no añade fases/tareas/hallazgos. AN-80/diferimientos conservados. CT-01/CT-02/REC-F2-001 ABIERTOS, estados/inventarios intactos, P01–P40/subcasos y nueve experimentos NO EJECUTADOS.

La actividad actual solo autoriza esta documentación, comprobaciones estáticas y respaldo limitado de los cuatro maestros por commit/push normal y verificación de igualdad HEAD/árbol limpio conforme MC-07. No código, pruebas, servicios de producto, configuración ni despliegues manuales. Entregar informe y detenerse para revisión PO antes del siguiente procedimiento.

## REC-F2-001 — hito documental PO-REC-F2-001-SE-01, 2026-11-08

COMPLETADO DOCUMENTALMENTE únicamente el hito de revisión y ratificación PO de los cinco criterios funcionales de suficiencia de evidencia. Rector HALLAZGOS, «Ratificación PO-REC-F2-001-SE-01 — criterios funcionales de suficiencia, 2026-11-08»; norma única SPEC, «PO-REC-F2-001-SE-01 — suficiencia funcional de evidencia, 2026-11-08»; TASKS continuidad. No se acepta íntegramente la propuesta operativa ni se aprueban mecanismos P/T por esta decisión.

Orden de continuidad ratificado para los pendientes de REC-F2-001: (1) precisar facultades, concedentes y designaciones pendientes; (2) resolver la política restante de reenvío/sustitución/revocación de invitaciones; (3) continuar los procedimientos de correo y recuperación conforme a las dependencias existentes, incluidos estados/versiones, invalidación, sesiones y reconciliación. Cada continuación requiere autorización delimitada. No reabrir los cinco criterios ni políticas funcionales anteriores, crear fases o alterar prioridades ratificadas.

Revisión independiente/aceptación documental, diseño e implementación técnica y validaciones posteriores conservan sus puertas; REC-F2-004 y secuencia REC-F2-002/003/005/006/007 sin cambio ni inicio automático. REC-F2-001 EN_CURSO, CT-01/CT-02 y hallazgos ABIERTOS; P01–P40/subcasos y nueve experimentos NO EJECUTADOS, inventarios y matrices 14/27 intactos. La sincronización MC-07 registra este hito y no cierra contratos ni dependencias adicionales. Solo cuatro maestros, comprobaciones documentales, commit/push normal y verificación final autorizados; detenerse después del informe, sin pruebas, código, configuración ni despliegues manuales.
## REC-F2-001 — revisión PO de facultades y autoridades propuestas, 2026-11-08

Continuación documental autorizada sobre master/d647687b16f81e2dbe86356841f1709166a37047. Rector HALLAZGOS, «Facultades y autoridades — propuesta pendiente del PO»; norma/propuesta única SPEC, «Facultades, concedentes y designaciones — propuesta para revisión PO»; TASKS conserva REC-F2-001 EN_CURSO. Propuesta elaborada, revisión PO pendiente; no hito de aceptación ni implementación.

Dependencia inmediata: PO debe ratificar o ajustar concedentes/revocadores por familia y techo delegable, designaciones/compatibilidades de operadores centrales/verificadores/aprobadores, elegibilidad para solicitar cambio de código y separación solicitante/aprobador/ejecutor, más designación y alcance técnico del reconciliador. No atribuir estas facultades automáticamente a Maestro, Limitado, coordinador, servicio privilegiado o revisor. La autoridad ratificada de incorporación de coordinadores conforme D conserva su alcance específico. Identificar expresamente en la próxima decisión qué celdas P se ratifican; no aprobar en bloque mecanismos T por aceptar una función.

Secuencia conservada: revisión PO de facultades → política restante de reenvío/sustitución/revocación/antiabuso → procedimientos de corrección previa/cambio posterior de correo con versiones, invalidación y sesiones → recuperación excepcional/revocación/reconciliación → revisión independiente y aceptación documental identificable. Ratificaciones D-01–D-04, AN-01/AN-02, I-01–I-11 y PO-REC-F2-001-SE-01 no se reabren. No exigir aprobación humana central individual para toda alta ni doble aprobación fuera de casos ya ratificados. Resolución de titularidad no acredita garantías Auth ni permite retirar bloqueos técnicos.

Dependencias técnicas posteriores, sin inicio: viabilidad Auth, procedencia/versiones, independencia comprobable, revocación concurrente y auditoría; entorno REC-F2-004 y alcances vigentes REC-F2-002/003/005/006/007. Conservar orden de corregir hallazgos → validar con evidencia → mejoras autorizadas. No cambia AN-80 ni prioridades; no nueva fase/tarea/hallazgo. Matrices originales 27/14 y sus pruebas futuras conservadas, no reproducidas.

Puerta de salida de esta actividad: comprobar integridad documental y git diff --check, solo cuatro documentos autorizados; commit `docs(rec-f2-001): propose authority and delegation matrix`; verificar remoto sin cambios inesperados, push normal a origin/master y comprobar HEAD local/GitHub iguales, árbol limpio, staging vacío y cero commits pendientes. Ante divergencia/error detenerse sin force push, merge, rebase o reset. Este respaldo MC-07 no ratifica la propuesta ni cierra contratos. CT-01/CT-02 ABIERTOS, REC-F2-001 EN_CURSO, P01–P40/subcasos y nueve experimentos NO EJECUTADOS. Sin código, pruebas de producto, servicios de producto, configuración ni despliegues manuales; entregar y detenerse para revisión PO.

## REC-F2-001 — dependencias tras ratificación AUT-01 a AUT-04, 2026-11-08

Fuente: ratificación PO del 2026-11-08, base master/94b017348925eb5187fa8de928783becf5b2fbb7. AUT-01, AUT-02, AUT-03 y AUT-04: **RATIFICADA — ALCANCE FUNCIONAL**, cada una. Rector HALLAZGOS, «AUT-01 a AUT-04 — registro rector de ratificación PO»; norma única SPEC, «AUT-01 a AUT-04 — ratificación funcional de controles de delegación»; TASKS continuidad. Hito exclusivamente documental, sin aceptación técnica ni cierre de REC-F2-001.

Dependencia funcional resuelta solo para concesión/revocación de facultades administrativas de coordinadores: Maestro conserva autoridad inicial y administradores expresamente delegados operan dentro de alcance/techo acreditados conforme AUT-01. No volver a pedir ratificación de ese principio ni extenderlo a otras familias o a autoridad de delegar en administradores. AUT-02–AUT-04 fijan suspensión preventiva de dependientes efectivos, tratamiento diferenciado de operaciones y restablecimiento expreso; los mecanismos para cumplirlo siguen por diseñar/validar.

Siguiente actividad de diseño PROPUESTA, pendiente de autorización delimitada: especificar dependencia efectiva frente a fuente independiente válida; distinción de revocación administrativa/seguridad y revisión de lo comprometido; clasificación de no ejecutada/confirmada/incierta, preservación de evidencia y decisión competente de continuación/cancelación/reinicio; revisión y autorización expresa de restablecimiento con registro auditable. Conservar bloqueo I-10 y reconciliación limitada ante incertidumbre, sin reintento automático por nueva autorización. Identificar autoridad competente aún no definida antes de habilitar acciones; no diseñar atribuciones globales por inferencia.

Pendientes PO conservados: concedentes/revocadores de otras familias, designaciones/compatibilidades centrales, elegibilidad de solicitud de código, designación/concedente/revocador del reconciliador. Tras revisión delimitada de estos pendientes y del diseño anterior, mantener secuencia de política restante de reenvío/sustitución/revocación/antiabuso → procedimientos de correo/recuperación → revisión independiente y aceptación documental identificable. No nueva fase/tarea, cambio de prioridades ni inicio automático de REC-F2-002/003/004/005/006/007. D-01–D-04, AN-01/AN-02, I-01–I-11 y PO-REC-F2-001-SE-01 intactos; matrices 27/14 solo referenciadas. P01–P40/subcasos y nueve experimentos NO EJECUTADOS; CT-01/CT-02 ABIERTOS; REC-F2-001 EN_CURSO diseño.

Cierre autorizado de esta actividad: integridad del contenido previo, alcance de cuatro maestros, consistencia funcional y git diff --check; staging exclusivo, commit `docs(rec-f2-001): ratify authority delegation controls`, nueva comprobación del HEAD remoto antes del push normal a origin/master; igualdad HEAD local/origin/master/GitHub, árbol limpio, staging vacío y divergencia 0/0. Ante bloqueo/divergencia/error detenerse y reportar; sin force push, merge, rebase o reset. La autorización es documental/Git; no implementación, pruebas de producto, servicios de producto, configuración, secretos, infraestructura o despliegues manuales. Entregar y detenerse.

## REC-F2-001 — designaciones centrales tras AUT-05, 2026-11-08

Hito exclusivamente documental: AUT-05 **RATIFICADA — ALCANCE FUNCIONAL**, por el PO el 2026-11-08, base master/058c18ad7cfd46eaf1cffe38170aaeb8812e8890. Rector HALLAZGOS, «AUT-05 — registro rector de compatibilidad condicionada»; norma única SPEC, «AUT-05 — Compatibilidad condicionada de funciones centrales»; TASKS continuidad. No implementación ni validación de mecanismos P/T.

Dependencia funcional resuelta: principio de compatibilidad de verificación/aprobación ordinaria humana bajo las siete condiciones acumulativas. No volver a solicitar ratificación de ese principio. Siguiente actividad de diseño PROPUESTA, pendiente de autorización delimitada: preparar designaciones concretas de operadores, verificadores, aprobadores y ejecutores, con facultades expresas, ámbito/vigencia y aplicación por operación/clasificación. La decisión PO debe delimitar esas designaciones, no asignar facultades por mera compatibilidad. Ejecución permanece separada como facultad propia; operaciones automáticas autorizadas no reciben aprobación manual obligatoria y excepcionales/privilegiadas/alto riesgo conservan separación contractual y dos personas distintas independientes cuando exigidas.

Puertas conservadas: autoridad vigente y no suspendida, riesgo admisible, evidencia suficiente, ausencia de conflicto/interés propio/beneficio indebido, auditoría separada de actuaciones y revalidación al decidir/ejecutar. Ambigüedad/insuficiencia/conflicto no resuelto exige escalar; no reducción unilateral de riesgo por operador interesado. AUT-01–AUT-04, D-01–D-04, AN-01/AN-02, I-01–I-11 y PO-REC-F2-001-SE-01 intactos. No se asignan concedentes/revocadores de otras familias, elegibilidad de solicitud de código ni designación/facultades del reconciliador.

Continuidad pendiente: diseño de dependencias/tratamiento/restablecimiento AUT-02–AUT-04 y decisiones de autoridad restantes → política restante de reenvío → procedimientos de correo/recuperación → revisión independiente/aceptación documental. Mecanismos técnicos y pruebas requieren autorización posterior; no nueva fase/tarea ni inicio automático de REC-F2-002/003/004/005/006/007. REC-F2-001 EN_CURSO; CT-01/CT-02 ABIERTOS; P01–P40 NO EJECUTADAS, subcasos/nueve experimentos NO EJECUTADOS; matrices 27/14 e inventarios íntegros y no duplicados.

Cierre actual MC-07: comprobar integridad y alcance de cuatro maestros, consistencia y git diff --check; staging exclusivo, commit `docs(rec-f2-001): ratify conditional role compatibility`, verificar nuevamente remoto y push normal a origin/master; confirmar HEAD local/origin/master/GitHub iguales, árbol limpio, staging vacío y divergencia 0/0. Ante anomalía detenerse; sin force push, merge, rebase o reset. Solo documentación/Git, sin código, migraciones, Supabase/Vercel, infraestructura, secretos, configuración, pruebas de producto o despliegues manuales. Entregar y detenerse para revisión.

## REC-F2-001 — dependencias de designación y continuidad tras AUT-06, 2026-11-08

AUT-06 **RATIFICADA — ALCANCE FUNCIONAL**, ratificación expresa PO, base master/50898e9dedd69ea48acb93fbb4cf06a409a3c738. Rector HALLAZGOS, «AUT-06 — registro rector de designación delegada y continuidad»; norma única SPEC, «AUT-06 — Designación delegada y continuidad de autoridades centrales»; TASKS continuidad. No implementación ni mecanismos P/T aprobados por inferencia.

Dependencia funcional resuelta: Maestro conserva autoridad inicial y puede delegar expresamente designación/revocación de operadores centrales a administradores autorizados dentro de límites verificables/revocables/auditables. No exigir presencia personal por cada operación o designación delegable válida. Continuidad ordinaria depende de autoridad suficiente vigente, no de disponibilidad personal; ausencia no amplía permisos. AUT-01–AUT-04 y AUT-05 se mantienen para alcance/dependencias/restablecimiento y compatibilidad/separación, sin arquitectura paralela ni facultad de ejecución por designar.

Orden de decisiones pendientes: (1) delimitar beneficiarios y delegaciones expresas de designación/revocación central, operaciones/recursos, facultades concedibles/revocables, ámbito, límites/vigencia, restricciones de compatibilidad y evidencia; designaciones individuales siguen abiertas; (2) autorizar el diseño específico de continuidad extraordinaria para ausencia de toda autoridad vigente suficiente, con posterior revisión/ratificación PO. Este pendiente no impide documentar continuidad ordinaria ni habilita procedimiento de emergencia: no cuenta ilimitada, omisión de autenticación/auditoría o control global unilateral; controles reforzados/autoridades independientes por diseñar, sin número de participantes, quórums, plazos o mecanismos anticipados.

Conservar pendientes de concedentes/revocadores de otras familias, elegibilidad de solicitud de código, designación del reconciliador, diseño de dependencias/operaciones/restablecimiento AUT-02–AUT-04, política restante de reenvío y procedimientos técnicos de correo/identidad/recuperación. Continuar su secuencia con autorización delimitada, revisión independiente y aceptación documental; no inicio automático de tareas técnicas REC-F2-002/003/004/005/006/007 ni cambio de prioridades. AUT-01–AUT-05, D-01–D-04, AN-01/AN-02, I-01–I-11 y PO-REC-F2-001-SE-01 íntegros; matrices 27/14 sin duplicación. REC-F2-001 EN_CURSO; CT-01/CT-02 ABIERTOS; P01–P40 NO EJECUTADAS, subcasos/nueve experimentos NO EJECUTADOS.

Cierre actual MC-07: validar contenido anterior íntegro, solo cuatro documentos, consistencia y git diff --check; staging exclusivo, commit `docs(rec-f2-001): ratify delegated central authority continuity`, nueva comprobación del HEAD remoto y push normal a origin/master; verificar HEAD local/origin/master/GitHub iguales, árbol limpio, staging vacío y divergencia 0/0. Ante anomalía detenerse; sin force push, merge, rebase o reset. Solo documentación/Git, sin código, migraciones, Supabase/producción/Vercel, infraestructura, secretos, configuración, pruebas de producto o despliegues manuales. Entregar y detenerse para revisión.

## REC-F2-001 — decisiones pendientes tras AUT-07, 2026-11-08

AUT-07 **RATIFICADA — ALCANCE FUNCIONAL**, mandato expreso PO, base master/cb3bddc6c6631579f55294402a7966786511b70b. Rector HALLAZGOS, «AUT-07 — registro rector de límites de designación y delegación»; norma única SPEC, «AUT-07 — Separación entre designación de operadores y delegación de autoridad administrativa»; TASKS continuidad. No implementación ni validación de mecanismos P/T.

Dependencia funcional precisada: facultad delegada de designar/revocar operadores centrales no incluye crear administradores con poder de delegación; esta autoridad requiere autorización diferenciada competente y procedimiento reforzado por definir. Maestro conserva autoridad inicial; continuidad ordinaria AUT-06 admite varias autoridades independientes sin aprobación conjunta de cada ordinaria. Registrar disponibilidad de al menos dos autoridades para funciones críticas como criterio de diseño, sin mínimo normativo obligatorio ni quórum. No alterar AUT-05 ni revisiones independientes exigidas; designar no concede ejecutar, poder global o subdelegación.

Orden de decisiones: (1) delimitar designaciones/delegaciones centrales concretas con facultades, ámbitos/recursos, techo/vigencia, compatibilidad y trazabilidad; (2) autorizar diseño del procedimiento reforzado diferenciado de creación de administradores con delegación y someterlo después a ratificación, sin concedentes o mecanismos inventados; (3) decidir posteriormente si el criterio de disponibilidad se convierte en cantidad mínima obligatoria; (4) conservar diseño de continuidad extraordinaria de AUT-06 pendiente de autorización y ratificación posterior. Registrar estos pendientes no bloquea automáticamente operaciones ordinarias válidamente autorizadas ni habilita procedimientos nuevos.

Mantener pendientes de concedentes/revocadores de otras familias, elegibilidad de cambio de código, designación/facultades del reconciliador, diseño de dependencias/tratamiento/restablecimiento AUT-02–AUT-04, política restante de invitaciones, procedimientos técnicos de identidad/recuperación y pruebas. Continuar con autorización delimitada, revisión independiente/aceptación documental; sin nueva fase/tarea ni inicio automático técnico. AUT-01–AUT-06 y demás decisiones, matrices 27/14 e inventarios íntegros; REC-F2-001 EN_CURSO; CT-01/CT-02 ABIERTOS; P01–P40 NO EJECUTADAS, subcasos/nueve experimentos NO EJECUTADOS.

Cierre MC-07 actual: integridad del contenido anterior, solo cuatro documentos, consistencia con AUT-01–AUT-06 y git diff --check; staging exclusivo, commit `docs(rec-f2-001): ratify central authority delegation boundaries`, comprobar nuevamente remoto y push normal a origin/master; verificar HEAD local/origin/master/GitHub iguales, árbol limpio, staging vacío y divergencia 0/0. Ante anomalía detenerse, sin force push, merge, rebase o reset. Solo documentación/Git; sin código, migraciones, Supabase/producción, infraestructura, secretos, configuración, pruebas de producto o despliegues. Entregar y detenerse para revisión.

## REC-F2-001 — clasificación pendiente tras AUT-08, 2026-11-08

AUT-08 **RATIFICADA — ALCANCE FUNCIONAL**, PO 2026-11-08, base master/cdfb070ce2b1310246760bf7eb2c130cfa7da41b. Rector HALLAZGOS, «AUT-08 — registro rector de capacidades centrales diferenciadas»; norma única SPEC, «AUT-08 — Delegación diferenciada de capacidades centrales»; TASKS continuidad. Capacidades de tramitación/verificación/aprobación/ejecución técnica y límites funcionales ratificados, sin cargos nuevos, acceso total, cadenas implícitas ni mecanismos P/T aprobados.

Siguiente actividad documental PROPUESTA, pendiente de autorización delimitada: clasificar las 27 operaciones canónicas por riesgo ordinario/sensible/excepcional, capacidades requeridas, incompatibilidades y controles específicos, con referencias a filas existentes y distinción R/P/T para revisión PO. No realizar esa clasificación por esta ratificación ni duplicar/modificar matrices; conservar separaciones/riesgos ya ratificados. No imponer aprobación humana universal: servicios automáticos autorizados conservan controles y AUT-05 rige compatibilidad ordinaria humana; aprobación crítica conserva autorización diferenciada/separación reforzada, ejecución no sustituye aprobaciones contractuales.

Orden de continuidad documental: clasificación de operaciones para revisión PO → delimitación de designaciones/delegaciones concretas y decisiones de concedentes/revocadores aún pendientes, según capacidades y riesgo → diseño del procedimiento reforzado de creación de administradores con delegación y revisión PO; conservar decisiones pendientes sobre mínimo obligatorio de autoridades y diseño/ratificación de continuidad extraordinaria. Permanecen elegibilidad de cambio de código, designación/facultades del reconciliador, dependencias/tratamiento/restablecimiento AUT-02–AUT-04, política restante de reenvío y procedimientos técnicos de identidad/recuperación/pruebas. Sin inicio automático ni cambio de prioridades de corrección/validación; revisión independiente y aceptación documental siguen pendientes.

AUT-01–AUT-07 RATIFICADAS — alcance funcional y AUT-08 RATIFICADA — alcance funcional; demás decisiones e inventarios íntegros. REC-F2-001 EN_CURSO; CT-01/CT-02 ABIERTOS; matrices 27/14 conservadas; P01–P40 NO EJECUTADAS, subcasos/nueve experimentos NO EJECUTADOS. Sin nueva tarea/fase o implementación técnica.

Cierre MC-07 actual: integridad previa, alcance exclusivo de cuatro maestros, consistencia con AUT-01–AUT-07, matrices intactas y git diff --check; staging exclusivo, commit `docs(rec-f2-001): ratify differentiated central capabilities`, comprobar nuevamente remoto, push normal a origin/master y verificar HEAD local/origin/master/GitHub iguales, árbol limpio, staging vacío y divergencia 0/0. Ante anomalía detenerse, sin force push, merge, rebase o reset. Solo documentación/Git; sin código, migraciones, Supabase/producción/Vercel, infraestructura, secretos, configuración, pruebas de producto o despliegues manuales. Entregar y detenerse para revisión.

## REC-F2-001 — dependencias tras ratificación de operaciones 4 y 5, 2026-11-08

Ratificación PO del 2026-11-08, base master/5e8e8dfc66cdec9261eff23e6411b236a118a67d: **PO-REC-F2-001-OP04-01 → operación 4** y **PO-REC-F2-001-OP05-01 → operación 5**, ambas **RATIFICADA — ALCANCE FUNCIONAL**. Rector HALLAZGOS, «Operaciones 4 y 5 — registro rector de ratificaciones PO»; norma única SPEC, «Operaciones 4 y 5 — ratificación PO de solicitud y aprobación de cambio de código»; TASKS continuidad. Identificadores de decisión, no nuevas operaciones/fases/tareas.

Dependencia resuelta: elegibilidad del titular autenticado y asistencia de coordinador expresamente autorizado con consentimiento verificable. Solicitud sin efecto automático; aprobación central específica, sin titular/asistente como aprobadores administrativos de su propia intervención; ejecución separada AUT-08. No reabrir esa elegibilidad ni derivar facultad de aprobación de registro, asistencia o designación. Evidencia insuficiente/contradictoria o titularidad ambigua exige tratamiento competente, sin aprobación ordinaria por suposición. Invariantes de identidad estable, código único nunca reasignable e historial permanecen.

Próxima revisión concreta PO: delimitar designaciones, concedentes/revocadores de aprobación/asistencia y separación reforzada específica, sin imponer ahora una cantidad de revisores. Diseño posterior de autenticación/consentimiento/evidencia y comando/ejecución con unicidad histórica, concurrencia/idempotencia/auditoría requiere autorización delimitada y validación; no mecanismo P/T ratificado por obligación funcional. Operación 6 conserva ejecución acotada de comando autorizado; no se modifica su matriz ni se elimina su pendiente técnico.

Continuidad documental de clasificación 27 y capacidades/riesgos sigue pendiente, sin ratificar el análisis conversacional anterior ni etiquetas para 4/5. Conservar demás decisiones pendientes AUT-08 salvo canales de solicitud funcionalmente resueltos; reenvío/identidad/recuperación, revisión independiente y aceptación documental mantienen sus dependencias. AUT-01–AUT-08 RATIFICADAS en su alcance funcional y demás contratos íntegros; matrices 27/14 sin duplicación. REC-F2-001 EN_CURSO; CT-01/CT-02 ABIERTOS; P01–P40 NO EJECUTADAS, subcasos/nueve experimentos NO EJECUTADOS. No cierre de 4/5 como implementadas o probadas.

Cierre MC-07 actual: integridad documental, consistencia, exclusividad de cuatro maestros y git diff --check; staging exclusivo, commit `docs(rec-f2-001): ratify individual code change authority`, comprobar de nuevo HEAD remoto antes del push normal a origin/master; verificar HEAD local/origin/master/GitHub iguales, árbol limpio, staging vacío y divergencia 0/0. Ante anomalía detenerse, sin force push, merge, rebase o reset. Solo documentación/Git; sin archivos adicionales, código, migraciones, Supabase/infraestructura/producción, pruebas de producto o despliegues. Entregar y detenerse para revisión PO.
