import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../entities';
import { AccessGuard, RequireRole } from '../security';
import { ScheduleDto } from './matches.dto';
import { MatchesService } from './matches.service';

@ApiTags('Partidos')
@Controller('partidos')
export class MatchesController {
  constructor(private readonly service: MatchesService) {}

  @Get()
  list() { return this.service.list(); }

  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) { return this.service.detail(id); }

  @Post()
  @ApiBearerAuth() @UseGuards(AccessGuard) @RequireRole(Role.Admin)
  create(@Body() dto: ScheduleDto) { return this.service.schedule(dto); }
}
