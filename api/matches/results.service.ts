import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Match, MatchState, Mode, Result, Tournament } from '../entities';
import { ScoreDto } from './matches.dto';

export function winner(match: Pick<Match, 'equipoLocalId' | 'equipoVisitanteId'>, mode: Mode, score: ScoreDto) {
  if (score.puntajeLocal === score.puntajeVisitante) {
    if (mode === Mode.Elimination) throw new BadRequestException('Un partido de eliminación requiere un ganador.');
    return null;
  }
  return score.puntajeLocal > score.puntajeVisitante ? match.equipoLocalId : match.equipoVisitanteId;
}

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result) private readonly results: Repository<Result>,
    private readonly database: DataSource,
  ) {}

  async get(partidoId: number) {
    if (!await this.database.manager.existsBy(Match, { id: partidoId })) throw new NotFoundException('Partido no encontrado.');
    return { resultado: await this.results.findOneBy({ partidoId }) };
  }

  record(partidoId: number, registradoPor: number, dto: ScoreDto) {
    return this.database.transaction(async manager => {
      const match = await manager.findOne(Match, { where: { id: partidoId }, lock: { mode: 'pessimistic_write' } });
      if (!match) throw new NotFoundException('Partido no encontrado.');
      if (match.estado === MatchState.Finished || await manager.existsBy(Result, { partidoId })) {
        throw new ConflictException('El partido ya tiene un resultado oficial.');
      }
      const tournament = await manager.findOneByOrFail(Tournament, { id: match.torneoId });
      const ganadorId = winner(match, tournament.modalidad, dto);
      const result = await manager.save(manager.create(Result, { ...dto, partidoId, registradoPor, ganadorId }));
      match.estado = MatchState.Finished;
      await manager.save(match);
      return result;
    });
  }
}
