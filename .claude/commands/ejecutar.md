Ejecuta la tarea pendiente que identificaste con /verificar.

Esto es el paso /apply del ciclo SPECBOOT. Antes de escribir una sola
línea:

1. Confirma en voz alta (en tu respuesta) cuál tarea vas a ejecutar
   y cuál es su Criterio de Aceptación exacto según spec.md
2. Si la tarea implica tocar base de datos, usa las definiciones
   exactas de tablas y campos de spec.md §3 — nunca inventes nombres
   de columnas nuevos sin decírmelo primero
3. Si la tarea implica código de frontend o Edge Functions, sigue
   exactamente el stack y la estructura de carpetas de plan.md §1-2

Reglas inquebrantables (de CLAUDE.md, repetidas aquí para que nunca
se te olviden a media tarea):
- NUNCA hardcodear credenciales — todo va en .env.local
- NUNCA desactivar RLS
- NUNCA cambiar el stack sin preguntarme
- NUNCA inventes requisitos que no estén en spec.md para esta tarea
  (cero scope creep — si se te ocurre algo nuevo, anótalo aparte
  como sugerencia de Backlog, no lo construyas ahora)

Al terminar de construir:
1. Lista exactamente qué archivos creaste o modificaste
2. Lista, uno por uno, qué Criterios de Aceptación de spec.md cubriste
3. NO marques la tarea como [X] en tasks.md todavía — eso solo pasa
   después de /revisar y mi confirmación explícita
4. NO hagas commit todavía
