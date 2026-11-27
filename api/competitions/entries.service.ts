import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, Not } from 'typeorm';
import { Entry, EntryState, Match, Role, Team, Tournament, TournamentState, User } from '../entities';
import { ReviewEntryDto } from './entries.dto';

// Valida estado, fecha límite y cupo con un reloj que se puede fijar en las pruebas.
export function checkEntryWindow(tournament: Tournament, occupied: number, now = Date.now()) {
  if (tournament.estado !== TournamentState.Open || tournament.cierreInscripcion.getTime() <= now) {
    throw new ConflictException('La inscripción está cerrada.');
  }
  if (occupied >= tournament.cupoMaximo) throw new ConflictException('El torneo alcanzó su cupo.');
}

@Injectable()
export class EntriesService {
  constructor(private readonly database: DataSource) {}

  async list(torneoId: number) {
    if (!await this.database.manager.existsBy(Tournament, { id: torneoId })) throw new NotFoundException('Torneo no encontrado.');
    const entries = await this.database.manager.find(Entry, { where: { torneoId }, relations: { equipo: true }, order: { id: 'ASC' } });
    return entries.map(({ id, equipoId, equipo, fecha, estado }) => ({ id, equipoId, equipo: equipo.nombre, fecha, estado }));
  }

  create(torneoId: number, equipoId: number, actor: User) {
    return this.database.transaction(async manager => {
      const tournament = await this.lockTournament(manager, torneoId);
      const team = await manager.findOneBy(Team, { id: equipoId, estado: 'activo' });
      if (!team) throw new NotFoundException('Equipo activo no encontrado.');
      // Puede inscribir el capitán del equipo o un administrador.
      if (actor.rol !== Role.Admin && actor.id !== team.capitanId) throw new ForbiddenException('Solo el capitán puede inscribir su equipo.');
      // Detecta el duplicado antes de intentar guardar.
      if (await manager.existsBy(Entry, { torneoId, equipoId })) throw new ConflictException('El equipo ya está inscrito.');
      // Pendientes y aceptadas cuentan para el cupo.
      const occupied = await manager.countBy(Entry, { torneoId, estado: Not(EntryState.Rejected) });
      checkEntryWindow(tournament, occupied);
      // Toda inscripción comienza pendiente.
      return manager.save(manager.create(Entry, { torneoId, equipoId, fecha: new Date(), estado: EntryState.Pending }));
    });
  }

  review(torneoId: number, id: number, dto: ReviewEntryDto) {
    return this.database.transaction(async manager => {
      const tournament = await this.lockTournament(manager, torneoId);
      const entry = await manager.findOneBy(Entry, { id, torneoId });
      if (!entry) throw new NotFoundException('Inscripción no encontrada.');
      // Repetir la misma revisión devuelve el estado actual.
      if (entry.estado === dto.estado) return entry;
      // Impide rechazar a un equipo que ya tiene partidos.
      if (dto.estado === EntryState.Rejected && await manager.exists(Match, {
        where: [{ torneoId, equipoLocalId: entry.equipoId }, { torneoId, equipoVisitanteId: entry.equipoId }],
      })) throw new ConflictException('El equipo tiene partidos programados.');
      // Volver a aceptar consume un cupo disponible.
      if (entry.estado === EntryState.Rejected && dto.estado === EntryState.Accepted) {
        const occupied = await manager.countBy(Entry, { torneoId, estado: Not(EntryState.Rejected) });
        if (occupied >= tournament.cupoMaximo) throw new ConflictException('El torneo alcanzó su cupo.');
      }
      entry.estado = dto.estado;
      return manager.save(entry);
    });
  }

  // Serializa las operaciones concurrentes sobre el mismo torneo.
  private async lockTournament(manager: EntityManager, id: number) {
    const tournament = await manager.findOne(Tournament, { where: { id }, lock: { mode: 'pessimistic_write' } });
    if (!tournament) throw new NotFoundException('Torneo no encontrado.');
    return tournament;
  }
}
