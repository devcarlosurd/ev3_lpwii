const test = require('node:test');
const assert = require('node:assert/strict');
const { winner } = require('../dist/matches/results.service');
const { standings } = require('../dist/matches/ranking.service');

const match = { equipoLocalId: 1, equipoVisitanteId: 2 };

test('el empate es válido en liga y se rechaza en eliminación', () => {
  const score = { puntajeLocal: 1, puntajeVisitante: 1 };
  assert.equal(winner(match, 'liga', score), null);
  assert.throws(() => winner(match, 'eliminacion', score), /requiere un ganador/);
  assert.equal(winner(match, 'eliminacion', { puntajeLocal: 0, puntajeVisitante: 1 }), 2);
});

test('la tabla suma victorias y empates y mantiene equipos sin partidos', () => {
  const teams = [{ id: 1, nombre: 'Jade' }, { id: 2, nombre: 'Titán' }, { id: 3, nombre: 'Iris' }];
  const results = [
    { partido: match, ganadorId: 1, puntajeLocal: 3, puntajeVisitante: 1 },
    { partido: match, ganadorId: null, puntajeLocal: 2, puntajeVisitante: 2 },
  ];
  const rows = standings(teams, results);
  assert.deepEqual(rows.map(row => [row.equipoId, row.puntos, row.jugados, row.victorias, row.derrotas, row.empates]), [
    [1, 4, 2, 1, 0, 1], [2, 1, 2, 0, 1, 1], [3, 0, 0, 0, 0, 0],
  ]);
});
