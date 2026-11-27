import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../entities';
import { AccessGuard, RequireRole } from '../security';
import { TournamentDto, UpdateTournamentDto } from './tournaments.dto';
import { TournamentsService } from './tournaments.service';

@ApiTags('Torneos')
@Controller('torneos')
export class TournamentsController {
  constructor(private readonly service: TournamentsService) {}

  @Get()
  list() { return this.service.list(); }

  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) { return this.service.detail(id); }

  // La administración del torneo exige sesión y rol administrador.
  @Post()
  @ApiBearerAuth() @UseGuards(AccessGuard) @RequireRole(Role.Admin)
  create(@Body() dto: TournamentDto) { return this.service.create(dto); }

  @Patch(':id')
  @ApiBearerAuth() @UseGuards(AccessGuard) @RequireRole(Role.Admin)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTournamentDto) {
    return this.service.update(id, dto);
  }

  // Si se elimina correctamente, devuelve 204 sin cuerpo.
  @Delete(':id')
  @ApiBearerAuth() @UseGuards(AccessGuard) @RequireRole(Role.Admin) @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
