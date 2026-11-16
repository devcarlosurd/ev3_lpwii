import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { AccessGuard } from './security';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  providers: [AccessGuard],
  exports: [JwtModule, TypeOrmModule, AccessGuard],
})
export class SecurityModule {}
