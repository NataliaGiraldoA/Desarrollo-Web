# PARCIAL

Este trabajo ya se venía realizando con anterioridad, agregando componentes como las tarjetas, el encabezado, formulario login. Para el parcial se agregaron distintas funcionalidades las cuales son las siguientes

## TO-DO
### Filtrar tareas
- Se añadieron tres botones al componente To-Do con el fin de filtrar las tareas, donde nos muestran las tareas pendientes, las completas y todas.
- Se mantiene el filtro a pesar de agregar nuevas tareas
- A pesar de hacer Log out, se mantiene el último filtro usado además de que persisten las tareas agregadas con anterioridad.

### Edición de tareas

- Se edita el texto de una tarea ya existente dando doble click sobre esta; se guarda con tecla enter.
- Esta edición realizada se guarda en el localstorage
- si se decide dejar de editar el texto, se puede dar click a la letra escape

## ADMIN

- Se modificó el login para que varios usuarios  se guardaran en el localstorage
- Se agregó un checkbox en el registro para que se defina si es un usuario comun o un administrador

### SALUDO

- Si el usuario es admin se realiza un saludo dependiendo de la hora del día, esto se realizó en el componente "HOME"

### Dashboard

- Se agregó un componente dashboard con el fin de mostrar estadísticas globales de los usuarios, en esta se visualizan las tareas pendientes y las tareas totales de todos los usuarios
- Se agregaron botones con el fin de que los administradores sean los únicos capaces de eliminar ya sea todas las tareas o las completadas
- El usuario no puede eliminar estas tareas. Solo admin

## TEMA

- Se definió un tema claro y un tema oscuro, donde el usuario lo puede cambiar según su preferencia

## FORM

- se tiene un formulario de contacto, esta información es guardada en el local storage. 


