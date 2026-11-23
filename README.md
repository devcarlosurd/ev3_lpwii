# GameHub IPVG

GameHub IPVG centraliza los equipos, inscripciones, partidos y resultados de torneos internos del Instituto Profesional Virginio Gómez.

## Integrantes

Carlos urdaneta, jostin valenzuela, Nicolás Echeverria.


## Arquitectura y datos

Vue 3 con Vite y Vue Router consume la API con `fetch`. NestJS usa módulos, servicios, DTO, guards y repositorios TypeORM sobre MySQL. Usuarios tienen rol y pueden capitanear o integrar equipos. Inscripción vincula un equipo con un torneo. Un torneo tiene partidos entre equipos y cada partido admite un resultado oficial.

## Colaboración

Completar enlace al tablero Kanban, tarjetas, PR, aportes y problemas observados. Cada integrante registra su aporte y cómo verificó el código.

## Uso de IA

Se usó OpenAI Codex para planificar el reparto y proponer código de referencia, documentación y casos de prueba. Cada integrante registra la parte concreta utilizada y lo que modificó o comprobó en su prueba, commit o PR.

