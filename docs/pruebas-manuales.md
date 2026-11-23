# Pruebas funcionales

Completar fecha, responsable, resultado observado y evidencia después de ejecutar cada caso en MySQL. Una descripción del caso por sí sola no acredita su ejecución.

| Caso | Pasos | Resultado esperado | Resultado observado y evidencia |
|---|---|---|---|
| Login correcto e incorrecto | Ingresar con cuenta de estudiante y clave válida. Repetir con clave incorrecta. | Sesión en el primer intento. Error y 401 en el segundo. | Pendiente |
| Acceso por rol | En Swagger, probar POST /torneos sin token, con estudiante y con admin. | 401, 403 y 201 con datos válidos. | Pendiente |
| Perfil | Cambiar alias desde Perfil y recargar. | El perfil muestra el alias nuevo. | Pendiente |
| Equipos | Crear equipo como estudiante. Actualizar integrantes con correos válidos. Probar editar desde otra cuenta. | Cambios del capitán persistidos. Otra cuenta recibe 403. | Pendiente |
| Crear, editar y eliminar torneo | Con Admin crear torneo de prueba, editar nombre, cancelar eliminación y luego confirmarla. | Lista y detalle actualizados. La segunda eliminación deja el recurso en 404. | Pendiente |
| Validación | Enviar cupo 1, fechas invertidas o un marcador negativo desde Swagger. | 400 con mensaje. | Pendiente |
| Búsqueda y filtros | Buscar un nombre y aplicar simultáneamente estado y modalidad. | La lista satisface los tres criterios. Un filtro incompatible muestra estado vacío. | Pendiente |
| Recurso inexistente | Abrir /torneos/999999 y GET /api/torneos/999999. | Vista con mensaje y API 404. | Pendiente |
| Inscripción duplicada | Inscribir dos veces el mismo equipo por Swagger en un torneo abierto. | Primer registro pendiente. Segundo 409. | Pendiente |
| Cupo e inscripción cerrada | Llenar un torneo con cupo 2 e intentar un tercer equipo. Intentar también uno cerrado. | 409 en ambos casos, con mensajes distintos. | Pendiente |
| Inscripciones | Admin acepta las dos primeras solicitudes y rechaza otra en un torneo separado. | Cambian los estados visibles. | Pendiente |
| Partidos | Programar con dos equipos aceptados. Repetir con el mismo equipo o uno sin aceptar. | 201 válido. 400 para los inválidos. | Pendiente |
| Resultado y ranking | Registrar un resultado en liga. Recargar ranking. Repetir el resultado e intentar empate en eliminación. | Tabla suma los puntos. Reintento 409. Empate de eliminación 400. | Pendiente |
| Persistencia | Reiniciar la API y consultar equipos, partidos y ranking. | MySQL conserva las filas. | Pendiente |
| Fallo de comunicación | Detener la API, mantener Vite y volver a abrir torneos. | Estado de error visible. | Pendiente |
