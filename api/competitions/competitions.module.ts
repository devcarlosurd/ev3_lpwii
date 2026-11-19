import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry, Match, Team, Tournament, User } from '../entities';
import { SecurityModule } from '../security.module';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';

@Module({
  imports: [SecurityModule, TypeOrmModule.forFeature([Tournament, Entry, Match, Team, User])],
  controllers: [TournamentsController, TeamsController],
  providers: [TournamentsService, TeamsService],
})
export class CompetitionsModule {}
