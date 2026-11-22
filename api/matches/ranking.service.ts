import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Entry, EntryState, MatchState, Result, Tournament } from '../entities';

type Standing = {
  equipoId: number;
  nombre: string;
  puntos: number;
  jugados: number;
  victorias: number;
  derrotas: number;
  empates: number;
  diferencia: number;
};

export function standings(teams: { id: number; nombre: string }[], results: Result[]) {
  const rows = new Map<number, Standing>(teams.map(team => [team.id, {
    equipoId: team.id, nombre: team.nombre, puntos: 0, jugados: 0,
    victorias: 0, derrotas: 0, empates: 0, diferencia: 0,
  }]));
  for (const result of results) {
    const local = rows.get(result.partido.equipoLocalId);
    const visitor = rows.get(result.partido.equipoVisitanteId);
    if (!local || !visitor) continue;
    local.jugados++;
    visitor.jugados++;
    local.diferencia += result.puntajeLocal - result.puntajeVisitante;
    visitor.diferencia += result.puntajeVisitante - result.puntajeLocal;
    if (result.ganadorId === null) {
      local.empates++;
      visitor.empates++;
      local.puntos++;
      visitor.puntos++;
    } else {
      const [won, lost] = result.ganadorId === local.equipoId ? [local, visitor] : [visitor, local];
      won.victorias++;
      lost.derrotas++;
      won.puntos += 3;
    }
  }
  return [...rows.values()].sort((a, b) => b.puntos - a.puntos || b.diferencia - a.diferencia ||
    b.victorias - a.victorias || a.nombre.localeCompare(b.nombre, 'es') || a.equipoId - b.equipoId);
}

@Injectable()
export class RankingService {
  constructor(private readonly database: DataSource) {}

  ranking(torneoId: number) {
    return this.database.transaction('REPEATABLE READ', async manager => {
      const torneo = await manager.findOneBy(Tournament, { id: torneoId });
      if (!torneo) throw new NotFoundException('Torneo no encontrado.');
      const entries = await manager.find(Entry, {
        where: { torneoId, estado: EntryState.Accepted },
        relations: { equipo: true },
      });
      const results = await manager.find(Result, {
        where: { partido: { torneoId, estado: MatchState.Finished } },
        relations: { partido: true },
      });
      return { torneo, posiciones: standings(entries.map(entry => entry.equipo), results) };
    });
  }
}
