Esto es el paso /verify + /code_review del ciclo SPECBOOT.

Audita el trabajo que acabas de hacer con /ejecutar, requisito por
requisito, contra el spec.md. Sé tu propio crítico más exigente —
no te audites por encima.

Para cada Criterio de Aceptación relevante a la tarea, responde
explícitamente:

✅ CUMPLE — y por qué exactamente (cita el código o la configuración
   que lo demuestra)
❌ NO CUMPLE — qué falta exactamente, y la corrección específica
   necesaria
⚠️ CUMPLE PARCIAL — qué parte funciona y qué parte necesita ajuste

Revisa también, sin que te lo pida cada vez:
- ¿Hay alguna credencial hardcodeada en el código nuevo?
- ¿RLS sigue activo en todas las tablas que tocaste?
- ¿El nombre de cada tabla/columna coincide exactamente con spec.md?
- ¿Agregaste algo que NO estaba pedido en la tarea (scope creep)?

Si encuentras cualquier ❌ o ⚠️, corrígelo tú mismo ahora
(esto es el "implement changes" del loop) y vuelve a auditar el
resultado corregido antes de entregármelo.

Solo cuando TODO esté en ✅, dime explícitamente:
"Esta tarea está lista para /archivar — todos los criterios se cumplen."

Si después de dos intentos de corrección algo sigue sin cumplir,
detente y explícame exactamente qué obstáculo encontraste, en vez
de seguir intentando variaciones a ciegas.
