import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, User } from '../entities';
import { AccessGuard, Actor, RequireRole } from '../security';
import { ScoreDto } from './matches.dto';
import { ResultsService } from './results.service';

@ApiTags('Resultados')
@Controller('partidos/:id/resultado')
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Get()
  get(@Param('id', ParseIntPipe) id: number) { return this.service.get(id); }

  @Post()
  @ApiBearerAuth() @UseGuards(AccessGuard) @RequireRole(Role.Admin)
  record(@Param('id', ParseIntPipe) id: number, @Actor() actor: User, @Body() dto: ScoreDto) {
    return this.service.record(id, actor.id, dto);
  }
}
