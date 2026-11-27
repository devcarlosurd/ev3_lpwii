import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, User } from '../entities';
import { AccessGuard, Actor, RequireRole } from '../security';
import { TeamDto, UpdateTeamDto } from './teams.dto';
import { TeamsService } from './teams.service';

@ApiTags('Equipos')
@Controller('equipos')
export class TeamsController {
  constructor(private readonly service: TeamsService) {}

  @Get()
  list() { return this.service.list(); }

  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) { return this.service.detail(id); }

  // La creación queda reservada al rol estudiante.
  @Post()
  @ApiBearerAuth() @UseGuards(AccessGuard) @RequireRole(Role.Student)
  create(@Actor() actor: User, @Body() dto: TeamDto) { return this.service.create(actor, dto); }

  // El guard exige sesión y el servicio verifica quién puede editar.
  @Patch(':id')
  @ApiBearerAuth() @UseGuards(AccessGuard)
  update(@Actor() actor: User, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTeamDto) {
    return this.service.update(actor, id, dto);
  }
}
