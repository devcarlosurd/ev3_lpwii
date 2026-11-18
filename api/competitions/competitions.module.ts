import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry, Match, Tournament } from '../entities';
import { SecurityModule } from '../security.module';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';

@Module({
  imports: [SecurityModule, TypeOrmModule.forFeature([Tournament, Entry, Match])],
  controllers: [TournamentsController],
  providers: [TournamentsService],
})
export class CompetitionsModule {}
