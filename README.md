# GameHub IPVG

GameHub IPVG centraliza los equipos, inscripciones, partidos y resultados de torneos internos del Instituto Profesional Virginio Gómez.

## Integrantes

Carlos, Jostin y Nicolás. Completar nombres, usuarios de GitHub y enlaces con los datos del equipo.

## Instalación local

Requisitos. Node.js 22.12 o superior, npm y MySQL 8. Ejecutar los comandos desde la raíz del repositorio.

1. Ejecutar `npm ci`.
2. Crear una base MySQL llamada `gamehub` y conceder permisos sobre ella a una cuenta local.
3. Copiar `.env.example` como `.env`. Completar la contraseña MySQL, el secreto JWT y una contraseña propia de demostración de al menos 8 caracteres.
4. Ejecutar `npm run api` en una terminal y `npm run web` en otra.
5. Abrir [la SPA](http://127.0.0.1:5173) y [Swagger](http://127.0.0.1:3000/docs). API REST en `/api`.

`DB_SYNC=true` sincroniza el esquema solo para el entorno local de la evaluación. Mantener `.env` fuera del repositorio. El archivo de ejemplo documenta las variables de MySQL, puertos, origen permitido y credenciales de demostración.

## Arquitectura y datos

Vue 3 con Vite y Vue Router consume la API con `fetch`. NestJS usa módulos, servicios, DTO, guards y repositorios TypeORM sobre MySQL. Usuarios tienen rol y pueden capitanear o integrar equipos. Inscripción vincula un equipo con un torneo. Un torneo tiene partidos entre equipos y cada partido admite un resultado oficial.

## Colaboración

Completar enlace al tablero Kanban, tarjetas, PR, aportes y problemas observados. Cada integrante registra su aporte y cómo verificó el código.

## Uso de IA

Se usó OpenAI Codex para planificar el reparto y proponer código de referencia, documentación y casos de prueba. Cada integrante registra la parte concreta utilizada y lo que modificó o comprobó en su prueba, commit o PR.
