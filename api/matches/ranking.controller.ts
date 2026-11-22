import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RankingService } from './ranking.service';

@ApiTags('Ranking')
@Controller('torneos/:torneoId/ranking')
export class RankingController {
  constructor(private readonly service: RankingService) {}

  @Get()
  ranking(@Param('torneoId', ParseIntPipe) torneoId: number) { return this.service.ranking(torneoId); }
}
