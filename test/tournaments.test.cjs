const test = require('node:test');
const assert = require('node:assert/strict');
const { TournamentsService } = require('../dist/competitions/tournaments.service');

test('rechaza inicio y cierre que caerían en el mismo segundo de MySQL', () => {
  const tournaments = { create: fields => fields };
  const service = new TournamentsService(tournaments, {});

  assert.throws(() => service.create({
    fechaInicio: '2026-11-24T10:00:00.900Z',
    cierreInscripcion: '2026-11-24T10:00:00.600Z',
  }), /cierre de inscripción debe ser anterior/);
});
