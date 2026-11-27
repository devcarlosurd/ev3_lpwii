const test = require('node:test');
const assert = require('node:assert/strict');
const { checkEntryWindow } = require('../dist/competitions/entries.service');

test('acepta una inscripción en un torneo abierto con cupo', () => {
  assert.doesNotThrow(() => checkEntryWindow({ estado: 'abierto', cierreInscripcion: new Date(100), cupoMaximo: 3 }, 2, 99));
});

test('rechaza un torneo lleno y uno cuya inscripción acaba de cerrar', () => {
  const tournament = { estado: 'abierto', cierreInscripcion: new Date(100), cupoMaximo: 3 };
  assert.throws(() => checkEntryWindow(tournament, 3, 99), /cupo/);
  // Al llegar justo al cierre, se rechaza la inscripción.
  assert.throws(() => checkEntryWindow(tournament, 1, 100), /cerrada/);
});
