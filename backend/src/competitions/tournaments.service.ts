import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { Entry, EntryState, Match, Tournament } from '../entities';
import { TournamentDto, UpdateTournamentDto } from './tournaments.dto';

// Elimina milisegundos para comparar con la precisión de MySQL.
function mysqlDate(value: string) {
  const date = new Date(value);
  date.setUTCMilliseconds(0);
  return date;
}

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament) private readonly tournaments: Repository<Tournament>,
    private readonly database: DataSource,
  ) {}

  list() {
    return this.tournaments.find({ order: { fechaInicio: 'ASC', id: 'ASC' } });
  }

  async detail(id: number) {
    const tournament = await this.tournaments.findOneBy({ id });
    if (!tournament) throw new NotFoundException('Torneo no encontrado.');
    return tournament;
  }

  create(dto: TournamentDto) {
    const tournament = this.tournaments.create({
      ...dto, fechaInicio: mysqlDate(dto.fechaInicio), cierreInscripcion: mysqlDate(dto.cierreInscripcion),
    });
    this.checkDates(tournament);
    return this.tournaments.save(tournament);
  }

  update(id: number, dto: UpdateTournamentDto) {
    return this.database.transaction(async manager => {
      const tournament = await manager.findOne(Tournament, { where: { id }, lock: { mode: 'pessimistic_write' } });
      if (!tournament) throw new NotFoundException('Torneo no encontrado.');
      // Aplica solo los campos enviados y conserva las demás fechas.
      const { fechaInicio, cierreInscripcion, ...changes } = dto;
      Object.assign(tournament, changes);
      if (fechaInicio !== undefined) tournament.fechaInicio = mysqlDate(fechaInicio);
      if (cierreInscripcion !== undefined) tournament.cierreInscripcion = mysqlDate(cierreInscripcion);
      this.checkDates(tournament);
      // El nuevo cupo debe cubrir las inscripciones pendientes y aceptadas.
      const occupied = await manager.countBy(Entry, { torneoId: id, estado: Not(EntryState.Rejected) });
      if (occupied > tournament.cupoMaximo) throw new ConflictException('El cupo es menor que el número de equipos inscritos.');
      // Con partidos programados, la modalidad queda fija.
      if (changes.modalidad && await manager.existsBy(Match, { torneoId: id })) {
        const previous = await manager.findOneByOrFail(Tournament, { id });
        if (previous.modalidad !== changes.modalidad) {
          throw new ConflictException('La modalidad queda fija cuando se programa un partido.');
        }
      }
      return manager.save(tournament);
    });
  }

  remove(id: number) {
    return this.database.transaction(async manager => {
      const tournament = await manager.findOne(Tournament, { where: { id }, lock: { mode: 'pessimistic_write' } });
      if (!tournament) throw new NotFoundException('Torneo no encontrado.');
      // Evita borrar un torneo con historial de partidos.
      if (await manager.existsBy(Match, { torneoId: id })) {
        throw new ConflictException('El torneo tiene partidos. Puedes finalizarlo para conservar su historial.');
      }
      await manager.remove(tournament);
    });
  }

  // La inscripción debe cerrar antes del inicio.
  private checkDates(tournament: Tournament) {
    if (!(tournament.cierreInscripcion < tournament.fechaInicio)) {
      throw new BadRequestException('El cierre de inscripción debe ser anterior al inicio.');
    }
  }
}
