# CLAUDE.md — TuChamba Express 2.0

## Contexto del proyecto
Lee spec.md, plan.md y tasks.md antes de cualquier tarea.
Soy José, fundador de BitX, sin background técnico profesional previo —
uso IA como mi herramienta principal de desarrollo.
Explica decisiones técnicas en términos simples cuando
recomiendes algo que no esté ya documentado en plan.md.

## Reglas inquebrantables
- NUNCA hardcodear credenciales. Todo va en `.env.local`.
- NUNCA desactivar RLS en Supabase, ni siquiera "temporalmente para probar".
- NUNCA cambiar el stack definido en plan.md (Next.js, Supabase, Claude API,
  Vercel, Tailwind, Shadcn/ui) sin preguntarme primero y explicarme por qué.
- NUNCA marcar una tarea de tasks.md como completa [X] sin que yo confirme
  explícitamente que pasó el Criterio de Aceptación correspondiente en spec.md.
- NUNCA saltarte el ciclo SPECBOOT: siempre `/new` (proponer) antes de `/apply`
  (ejecutar). Ver protocolo completo en tasks.md.
- NUNCA renombrar o reestructurar una tabla ya definida en spec.md sin
  registrar el cambio ahí primero.
- La API Key de Anthropic (Claude) NUNCA va en código que se ejecute en el
  navegador. Solo vive en Edge Functions de Supabase.

## Protocolo de cada sesión nueva
1. Al iniciar, revisa qué tareas de tasks.md están [X] vs [ ].
2. Trabaja SOLO la siguiente tarea pendiente, en el orden en que aparece.
3. Si la tarea no está clara o falta contexto, pregúntame — no asumas.
4. Al terminar una tarea, dame un resumen breve de qué cambió y por qué.
5. Espera mi confirmación explícita antes de hacer commit.
6. Si detectas que una tarea ya fue completada en una sesión anterior
   (código ya existe y funciona), márcala [X] y avísame, no la repitas.

## Cuando algo no cuadra
Si encuentras una contradicción entre spec.md, plan.md y tasks.md,
detente y pregúntame en lugar de elegir una interpretación por tu cuenta.
Si un error se repite 3 veces sin resolverse, deja de intentar variaciones
y dime exactamente qué error es, qué intentaste, y qué necesitas de mí.

## Modo sostenimiento (se activa cuando tasks.md esté 100% completo)
- Revisa logs de Sentry al inicio de cada sesión si ya están conectados.
- Sugiere mejoras de performance o refactors solo si las pido explícitamente.
- Prioriza estabilidad del sistema en producción sobre features nuevas.
- Cualquier cambio a código que ya está en producción (Vercel main) necesita
  mi aprobación explícita antes de aplicarse — sin excepción.
- Si conectamos agentes autónomos (Fase 2/3), tu rol cambia a supervisor:
  revisas lo que el agente propone antes de que se ejecute solo.
