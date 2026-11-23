# GameHub IPVG

GameHub IPVG centraliza el registro de equipos, inscripciones, partidos y resultados de los torneos internos del Instituto Profesional Virginio Gómez.

## Integrantes

[Carlos](https://github.com/devcarlosurd), [Jostin Valenzuela](https://github.com/jostinvalenzuela-glitch) y [Nicolás Echeverría](https://github.com/nico-saplii).

## Cómo ejecutar el proyecto

Requisitos. Node.js 22.12 o superior, npm y MySQL Community Server. Ejecutar los comandos desde la raíz del repositorio.

1. Ejecutar `npm ci`.
2. En MySQL Workbench o el cliente `mysql`, conectarse con una cuenta administradora. Ejecutar este SQL reemplazando la contraseña de muestra por una local propia.

   ```sql
   CREATE DATABASE IF NOT EXISTS gamehub CHARACTER SET utf8mb4;
   CREATE USER IF NOT EXISTS 'gamehub'@'localhost' IDENTIFIED BY 'CAMBIAR_POR_CLAVE_LOCAL';
   GRANT ALL PRIVILEGES ON gamehub.* TO 'gamehub'@'localhost';
   ```

3. Copiar `.env.example` a `.env`. Completar `DB_PASSWORD`, `JWT_SECRET` (al menos 32 bytes) y `DEMO_PASSWORD` (al menos 8 caracteres). Para generar un secreto ejecutar `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Mantener `.env` local.
4. Ejecutar `npm run seed`. Se crean datos y usuarios de demostración. Las credenciales de ejemplo se describen en [partidos y datos de prueba](docs/partidos.md).
5. Ejecutar `npm run api` y, en otra terminal, `npm run web`. Abrir [GameHub](http://127.0.0.1:5173) y [Swagger](http://127.0.0.1:3000/docs).

`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` configuran la conexión a MySQL. `DB_SYNC=true` habilita la sincronización del esquema para desarrollo local. `PORT` y `WEB_ORIGIN` configuran la API y CORS. El proxy local de Vite espera la API en el puerto 3000.

## Arquitectura y modelo

Vue 3, Vite y Vue Router implementan la SPA. El cliente consume JSON con `fetch`. NestJS expone REST con módulos, controllers, services, DTO, ValidationPipe y guards. Los repositorios y transacciones TypeORM persisten en MySQL.

Un usuario puede capitanear e integrar equipos. Un equipo tiene un capitán y miembros. Inscripción enlaza torneo con equipo y es única por par. Un torneo programa partidos con equipos aceptados. Cada partido puede tener un único resultado, validado según la modalidad y registrado por un administrador. La tabla de posiciones se calcula de los resultados oficiales.

## Permisos, API y Swagger

- Acceso público para listar y consultar torneos, equipos, partidos, resultados e inscripciones. El registro siempre genera un Estudiante.
- Estudiante autenticado para editar su perfil, crear equipos, administrar los que capitanea e inscribirlos.
- Administrador para CRUD de torneos, edición de equipos, revisión de inscripciones, programación de partidos y registro de resultados.

Usar `POST /api/auth/login` y pegar el valor de `token` en **Authorize** de Swagger para probar los endpoints protegidos. Consultar [autenticación](docs/autenticacion.md), [competencias](docs/competencias.md) y [partidos, ranking y SQL](docs/partidos.md).

## Pruebas

Ejecutar `npm test` para las pruebas automáticas de autenticación, cupos y ranking, y `npm run build` para verificar ambas capas. Registrar resultados observados, errores y evidencias en la [pauta de pruebas manuales](docs/pruebas-manuales.md).

## Kanban y colaboración

| Integrante | Módulo | Evidencia para completar |
|---|---|---|
| Carlos | Autenticación, sesión y perfil | Tarjetas, commits y PR |
| Jostin | Torneos, equipos e inscripciones | Tarjetas, commits y PR |
| Nicolás | Partidos, resultados, ranking y datos demo | Tarjetas, commits y PR |

Agregar el enlace al tablero y registrar los cambios de alcance y los problemas reales con su solución. Mover las tarjetas entre Pendiente, En proceso y Terminado, enlazando sus commits o PR. Cada integrante aporta en Vue y NestJS.

## Uso de IA

Se usó OpenAI Codex para planificar la distribución y proponer el código de referencia, casos de prueba y documentación. Cada integrante debe completar su fila con el archivo, componente o función que utilizó y la evidencia de su revisión.

| Integrante | Uso y sección | Qué modificó o verificó |
|---|---|---|
| Carlos | Codex preparó registro, login, perfil y pruebas de autenticación. | Codex comprobó compilación y pruebas automáticas. Revisión personal pendiente de registrar. |
| Jostin | Codex preparó torneos, equipos, inscripciones y pruebas de cupo y fechas. | Codex comprobó la API contra MySQL y las pruebas automáticas. Revisión personal pendiente de registrar. |
| Nicolás | Codex preparó partidos, resultados, ranking, datos demo y pruebas. | Codex compiló Vue y NestJS y ejecutó las pruebas automáticas. Revisión personal pendiente de registrar. |
