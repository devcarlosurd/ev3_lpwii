# Autenticación y perfil

| Método | Ruta bajo `/api` | Permiso |
|---|---|---|
| POST | /auth/registro | Público. Crea una cuenta Estudiante. |
| POST | /auth/login | Público. Entrega token si las credenciales son válidas. |
| GET | /auth/perfil | Sesión activa. |
| PATCH | /auth/perfil | Sesión activa. Edita nombre y alias propios. |

El guard verifica firma y expiración del JWT y consulta el usuario activo para decidir su rol vigente. Swagger permite usar el token con **Authorize**. Vue Router protege la vista de perfil y el cliente envía el encabezado Bearer.

En una cuenta de prueba, registrar un usuario, comprobar que un correo repetido devuelve 409, probar contraseña correcta e incorrecta, editar el alias y recargar. Probar GET de perfil sin token y comprobar 401. Verificar que el perfil no exponga el hash.

## Apoyo de inteligencia artificial

OpenAI Codex propuso e implementó el código de registro, login y perfil en `backend/src/auth` y en `frontend/src/features/auth`, además del alta del administrador local y las pruebas en `backend/test/auth.test.cjs`. Codex ejecutó las compilaciones de NestJS y Vue y las pruebas automáticas de autenticación. La revisión personal de Carlos y sus pruebas manuales quedan por registrar con su evidencia.
