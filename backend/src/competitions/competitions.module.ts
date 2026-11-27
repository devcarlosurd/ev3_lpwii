import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry, Match, Team, Tournament, User } from '../entities';
import { SecurityModule } from '../security.module';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';

// Registra los endpoints, servicios y repositorios de competencias.
@Module({
  imports: [SecurityModule, TypeOrmModule.forFeature([Tournament, Entry, Match, Team, User])],
  controllers: [TournamentsController, TeamsController, EntriesController],
  providers: [TournamentsService, TeamsService, EntriesService],
})
export class CompetitionsModule {}
