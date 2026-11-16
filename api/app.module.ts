import { Controller, Get, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from './database';
import { AuthModule } from './auth/auth.module';
import { CompetitionsModule } from './competitions/competitions.module';
import { MatchesModule } from './matches/matches.module';

@Controller('salud')
class HealthController {
  @Get()
  check() {
    return { estado: 'ok' };
  }
}

@Module({
  imports: [TypeOrmModule.forRootAsync({ useFactory: databaseOptions }), AuthModule, CompetitionsModule, MatchesModule],
  controllers: [HealthController],
})
export class AppModule {}
