import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match, Result } from '../entities';
import { SecurityModule } from '../security.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';

@Module({
  imports: [SecurityModule, TypeOrmModule.forFeature([Match, Result])],
  controllers: [MatchesController, ResultsController],
  providers: [MatchesService, ResultsService],
})
export class MatchesModule {}
