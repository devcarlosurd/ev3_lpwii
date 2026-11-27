import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Entry, EntryState, Match, MatchState, Tournament, TournamentState } from '../entities';
import { ScheduleDto } from './matches.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match) private readonly matches: Repository<Match>,
    private readonly database: DataSource,
  ) {}

  list() {
    // Carga los nombres de equipos y torneo para el calendario.
    return this.matches.find({ relations: { torneo: true, local: true, visitante: true }, order: { fechaHora: 'ASC', id: 'ASC' } });
  }

  async detail(id: number) {
    const match = await this.matches.findOne({ where: { id }, relations: { torneo: true, local: true, visitante: true } });
    if (!match) throw new NotFoundException('Partido no encontrado.');
    return match;
  }

  schedule(dto: ScheduleDto) {
    // Un equipo no puede jugar contra sí mismo.
    if (dto.equipoLocalId === dto.equipoVisitanteId) throw new BadRequestException('Selecciona dos equipos distintos.');
    return this.database.transaction(async manager => {
      // Bloquea el torneo mientras valida inscripciones y programa el partido.
      const torneo = await manager.findOne(Tournament, { where: { id: dto.torneoId }, lock: { mode: 'pessimistic_write' } });
      if (!torneo) throw new NotFoundException('Torneo no encontrado.');
      if (torneo.estado === TournamentState.Finished) throw new ConflictException('El torneo está finalizado.');
      const teams = In([dto.equipoLocalId, dto.equipoVisitanteId]);
      // Exige que ambos equipos estén aceptados en este torneo.
      const accepted = await manager.countBy(Entry, { torneoId: dto.torneoId, equipoId: teams, estado: EntryState.Accepted });
      if (accepted !== 2) throw new BadRequestException('Ambos equipos deben tener una inscripción aceptada.');
      const fechaHora = new Date(dto.fechaHora);
      // El partido puede comenzar desde el inicio del torneo.
      if (!(fechaHora >= torneo.fechaInicio)) throw new BadRequestException('El partido debe ser después del inicio del torneo.');
      return manager.save(manager.create(Match, { ...dto, fechaHora, estado: MatchState.Scheduled }));
    });
  }
}
