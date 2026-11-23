import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { databaseOptions } from './database';
import { Entry, EntryState, Match, MatchState, Mode, Result, Role, Team, Tournament, TournamentState, User } from './entities';
import { promisify } from 'node:util';
import { randomBytes, scrypt } from 'node:crypto';

const derive = promisify(scrypt);
const day = 86_400_000;

async function seed() {
  const secret = process.env.DEMO_PASSWORD;
  if (!secret || secret.length < 8) throw new Error('Completa DEMO_PASSWORD en .env con al menos 8 caracteres.');
  const now = Date.now();
  const database = await new DataSource(databaseOptions()).initialize();
  try {
    await database.transaction(async manager => {
      const users = [];
      for (const [alias, rol] of [['admin', Role.Admin], ['jade', Role.Student], ['titan', Role.Student], ['delta', Role.Student], ['iris', Role.Student]] as const) {
        const correo = alias + '@gamehub.example';
        let user = await manager.findOneBy(User, { correo });
        if (user && (user.rol !== rol || !user.activo)) throw new Error('El correo de demostración ya existe con otro estado o rol: ' + correo);
        if (!user) {
          const salt = randomBytes(16).toString('hex');
          const hash = await derive(secret, salt, 64) as Buffer;
          user = await manager.save(manager.create(User, { nombre: 'Demo ' + alias, alias, correo, rol, password: salt + ':' + hash.toString('hex') }));
        }
        users.push(user);
      }
      const teams = [];
      for (const [index, nombre] of ['Jade', 'Titán', 'Delta', 'Iris'].entries()) {
        const capitan = users[index + 1];
        const existing = await manager.findOneBy(Team, { nombre, capitanId: capitan.id });
        teams.push(existing || await manager.save(manager.create(Team, {
          nombre, capitan, capitanId: capitan.id, integrantes: [capitan], juegoPreferido: index < 2 ? 'Rocket League' : 'Valorant',
        })));
      }
      for (const [index, videojuego] of ['Rocket League', 'Valorant'].entries()) {
        const nombre = 'Demo ' + videojuego;
        const modalidad = index === 0 ? Mode.League : Mode.Elimination;
        const torneo = await manager.findOneBy(Tournament, { nombre }) || await manager.save(manager.create(Tournament, {
          nombre, videojuego, modalidad, estado: index === 0 ? TournamentState.Closed : TournamentState.Open,
          fechaInicio: new Date(now + (index === 0 ? -day : 2 * day)),
          cierreInscripcion: new Date(now + (index === 0 ? -2 * day : day)), cupoMaximo: 4,
        }));
        const [local, visitante] = teams.slice(index * 2, index * 2 + 2);
        for (const team of [local, visitante]) {
          const keys = { torneoId: torneo.id, equipoId: team.id };
          if (!await manager.existsBy(Entry, keys)) {
            await manager.save(manager.create(Entry, { ...keys, fecha: new Date(now - 3 * day), estado: EntryState.Accepted }));
          }
        }
        const keys = { torneoId: torneo.id, equipoLocalId: local.id, equipoVisitanteId: visitante.id, ronda: 'Ronda demo' };
        let match = await manager.findOneBy(Match, keys);
        if (!match) {
          match = await manager.save(manager.create(Match, {
            ...keys, fechaHora: new Date(torneo.fechaInicio.getTime() + 3600000),
            estado: index === 0 ? MatchState.Finished : MatchState.Scheduled,
          }));
          if (index === 0) {
            await manager.save(manager.create(Result, {
              partidoId: match.id, ganadorId: local.id, puntajeLocal: 3, puntajeVisitante: 1, registradoPor: users[0].id,
            }));
          }
        }
      }
      console.log('Datos demo disponibles. Administrador: admin@gamehub.example. Estudiante: jade@gamehub.example.');
    });
  } finally {
    await database.destroy();
  }
}

void seed().catch(error => { console.error(error.message); process.exitCode = 1; });
