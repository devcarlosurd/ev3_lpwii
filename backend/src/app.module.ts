import { Controller, Get, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from './database';
import { AuthModule } from './auth/auth.module';
import { CompetitionsModule } from './competitions/competitions.module';
import { MatchesModule } from './matches/matches.module';

// Ruta de salud para comprobar que el servidor responde.
@Controller('salud')
class HealthController {
  @Get()
  check() {
    return { estado: 'ok' };
  }
}

// Punto de unión de la conexión MySQL y los tres módulos.
@Module({
  imports: [TypeOrmModule.forRootAsync({ useFactory: databaseOptions }), AuthModule, CompetitionsModule, MatchesModule],
  controllers: [HealthController],
})
export class AppModule {}
