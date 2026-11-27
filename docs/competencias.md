# Torneos, equipos e inscripciones

| Operación | Ruta bajo `/api` | Acceso |
|---|---|---|
| GET lista y detalle | /torneos y /torneos/:id | Público |
| POST, PATCH, DELETE | /torneos y /torneos/:id | Administrador |
| GET lista y detalle | /equipos y /equipos/:id | Público |
| POST | /equipos | Estudiante |
| PATCH | /equipos/:id | Capitán o administrador |
| GET y POST | /torneos/:torneoId/inscripciones | GET público. POST capitán o administrador. |
| PATCH | /torneos/:torneoId/inscripciones/:id | Administrador |

Se reserva cupo para inscripciones pendientes y aceptadas. La base garantiza una inscripción por par torneo y equipo. Las operaciones de inscripción y partidos toman un bloqueo sobre el torneo para evitar aceptar más equipos que el cupo o invalidar un partido programado.

Las fechas del torneo se validan con precisión de segundos, igual que las columnas MySQL que las guardan.

## Apoyo de inteligencia artificial

OpenAI Codex preparó el código para torneos, equipos e inscripciones en `backend/src/competitions` y `frontend/src/features/competitions`. También preparó las pruebas de cupo y precisión de fechas en `backend/test/entries.test.cjs` y `backend/test/tournaments.test.cjs`, y ejecutó la compilación y las pruebas automáticas. La revisión personal de Jostin y las pruebas manuales deben registrarse con su evidencia.
