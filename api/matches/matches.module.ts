import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match, Result } from '../entities';
import { SecurityModule } from '../security.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';

@Module({
  imports: [SecurityModule, TypeOrmModule.forFeature([Match, Result])],
  controllers: [MatchesController, ResultsController, RankingController],
  providers: [MatchesService, ResultsService, RankingService],
})
export class MatchesModule {}
