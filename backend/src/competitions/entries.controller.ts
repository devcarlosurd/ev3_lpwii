import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, User } from '../entities';
import { AccessGuard, Actor, RequireRole } from '../security';
import { EntryDto, ReviewEntryDto } from './entries.dto';
import { EntriesService } from './entries.service';

@ApiTags('Inscripciones')
@Controller('torneos/:torneoId/inscripciones')
export class EntriesController {
  constructor(private readonly service: EntriesService) {}

  // ParseIntPipe convierte el ID de la URL o responde 400.
  @Get()
  list(@Param('torneoId', ParseIntPipe) torneoId: number) { return this.service.list(torneoId); }

  // La sesión identifica a quien intenta inscribir al equipo.
  @Post()
  @ApiBearerAuth() @UseGuards(AccessGuard)
  create(@Param('torneoId', ParseIntPipe) torneoId: number, @Body() dto: EntryDto, @Actor() actor: User) {
    return this.service.create(torneoId, dto.equipoId, actor);
  }

  // Solo un administrador puede aceptar o rechazar.
  @Patch(':id')
  @ApiBearerAuth() @UseGuards(AccessGuard) @RequireRole(Role.Admin)
  review(@Param('torneoId', ParseIntPipe) torneoId: number, @Param('id', ParseIntPipe) id: number, @Body() dto: ReviewEntryDto) {
    return this.service.review(torneoId, id, dto);
  }
}
