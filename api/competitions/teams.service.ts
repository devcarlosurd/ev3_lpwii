import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryFailedError, Repository } from 'typeorm';
import { Role, Team, User } from '../entities';
import { TeamDto, UpdateTeamDto } from './teams.dto';

const summary = ({ id, alias }: User) => ({ id, alias });

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private readonly teams: Repository<Team>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async list() {
    return (await this.teams.find({ order: { nombre: 'ASC' } })).map(team => this.present(team));
  }

  async detail(id: number) {
    return this.present(await this.find(id));
  }

  async create(user: User, dto: TeamDto) {
    const team = this.teams.create({ ...dto, capitanId: user.id, capitan: user, integrantes: [user], estado: 'activo' });
    return this.present(await this.save(team));
  }

  async update(user: User, id: number, dto: UpdateTeamDto) {
    const team = await this.find(id);
    if (user.rol !== Role.Admin && user.id !== team.capitanId) {
      throw new ForbiddenException('Solo el capitán o un administrador puede editar este equipo.');
    }
    if (dto.correos) {
      const correos = [...new Set(dto.correos.map(email => email.toLowerCase()).filter(email => email !== team.capitan.correo))];
      const members = correos.length ? await this.users.findBy({ correo: In(correos), activo: true, rol: Role.Student }) : [];
      if (members.length !== correos.length) throw new BadRequestException('Algún correo no corresponde a un estudiante activo.');
      team.integrantes = [team.capitan, ...members];
    }
    Object.assign(team, { nombre: dto.nombre, juegoPreferido: dto.juegoPreferido, estado: dto.estado });
    return this.present(await this.save(team));
  }

  private async find(id: number) {
    const team = await this.teams.findOne({ where: { id }, relations: { integrantes: true, capitan: true } });
    if (!team) throw new NotFoundException('Equipo no encontrado.');
    return team;
  }

  private async save(team: Team) {
    try {
      return await this.teams.save(team);
    } catch (error) {
      if (error instanceof QueryFailedError && (error.driverError as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Ya existe un equipo con ese nombre.');
      }
      throw error;
    }
  }

  private present(team: Team) {
    const { id, nombre, juegoPreferido, estado, capitanId, capitan, integrantes } = team;
    return {
      id, nombre, juegoPreferido, estado, capitanId,
      capitan: capitan ? summary(capitan) : undefined,
      integrantes: integrantes?.map(summary),
    };
  }
}
