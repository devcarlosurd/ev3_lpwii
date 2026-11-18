const test = require('node:test');
const assert = require('node:assert/strict');
const { checkPassword, hashPassword } = require('../dist/auth/password');
const { AuthService } = require('../dist/auth/auth.service');

test('una contraseña conserva su validez y usa una sal distinta', async () => {
  const first = await hashPassword('password de prueba');
  const second = await hashPassword('password de prueba');
  assert.notEqual(first, second);
  assert.equal(await checkPassword('password de prueba', first), true);
  assert.equal(await checkPassword('password incorrecta', first), false);
});

test('solo se puede registrar un estudiante y la respuesta omite la contraseña', async () => {
  const users = {
    create: value => value,
    save: async value => Object.assign(value, { id: 1, activo: true }),
  };
  const result = await new AuthService(users, {}).register({
    nombre: 'Persona', alias: 'Jugador', correo: 'persona@example.test', password: 'solo para esta prueba',
  });
  assert.equal(result.rol, 'estudiante');
  assert.equal('password' in result, false);
});
