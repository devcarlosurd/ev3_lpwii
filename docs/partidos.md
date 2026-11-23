# Partidos, resultados y ranking

| Operación | Ruta bajo `/api` | Acceso |
|---|---|---|
| GET | /partidos y /partidos/:id | Público |
| POST | /partidos | Administrador. Programa entre equipos distintos aceptados en el torneo. |
| GET | /partidos/:id/resultado | Público |
| POST | /partidos/:id/resultado | Administrador. Registra el resultado oficial y cambia el estado en la misma transacción. |
| GET | /torneos/:torneoId/ranking | Público |

En liga se permite empate. En eliminación el resultado exige un ganador. El ranking da 3 puntos por victoria, 1 por empate y 0 por derrota. Ordena por puntos, diferencia, victorias y nombre. Conserva en la tabla los equipos aceptados con cero partidos.

## Datos de demostración

Ejecutar `npm run seed` con una clave local en `DEMO_PASSWORD`. Se crean dos torneos, cuatro equipos, un partido finalizado, un resultado oficial y un partido pendiente. Ingresar como `admin@gamehub.example` o `jade@gamehub.example` con la contraseña elegida por el equipo. Los correos de demostración están reservados para una base de desarrollo.

## Verificación SQL

```sql
SELECT id, nombre, videojuego, modalidad, estado FROM torneos ORDER BY id;
SELECT i.torneoId, e.nombre, i.estado FROM inscripciones i JOIN equipos e ON e.id = i.equipoId;
SELECT p.id, p.estado, r.puntajeLocal, r.puntajeVisitante, r.ganadorId
FROM partidos p LEFT JOIN resultados r ON r.partidoId = p.id ORDER BY p.id;
```
