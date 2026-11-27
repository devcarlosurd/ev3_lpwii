import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { AccessGuard } from './security';

// Comparte el guard y el servicio JWT con los módulos que los necesitan.
@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  providers: [AccessGuard],
  exports: [JwtModule, TypeOrmModule, AccessGuard],
})
export class SecurityModule {}
