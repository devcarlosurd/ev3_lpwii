import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../entities';
import { SecurityModule } from '../security.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  imports: [SecurityModule, TypeOrmModule.forFeature([Match])],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
