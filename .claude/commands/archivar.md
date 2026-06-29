Esto es el paso /archive + /commit del ciclo SPECBOOT.

SOLO ejecuta esto si /revisar ya confirmó explícitamente que todos
los criterios se cumplen. Si no se ha hecho esa confirmación, detente
y dime que falta pasar por /revisar primero.

1. Abre tasks.md y marca [X] únicamente la tarea que se completó
   (no toques ninguna otra casilla, ni adelantes ni reordenes)
2. Si esta era la última tarea de su Sprint, actualiza la tabla
   "REGISTRO DE SPRINTS COMPLETADOS" al final de tasks.md con la
   fecha de hoy en la columna "Fecha cierre" y status "Completo"
3. Prepara (pero NO ejecutes todavía) el comando de git add y el
   mensaje de commit siguiendo este formato:

   git add <archivos específicos modificados, nunca "git add ." a ciegas>
   git commit -m "feat(sprintX): <descripción breve de la tarea completada>"

4. Muéstrame ese comando exacto y espera mi confirmación explícita
   antes de correrlo

5. Después de mi confirmación y del commit real, dime cuál es la
   SIGUIENTE tarea pendiente según tasks.md, para que decida si
   corremos /verificar de nuevo o paramos la sesión aquí
