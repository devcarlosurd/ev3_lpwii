import { Module } from '@nestjs/common';
import { SecurityModule } from '../security.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Conecta las rutas de autenticación con su servicio y el guard.
@Module({ imports: [SecurityModule], controllers: [AuthController], providers: [AuthService] })
export class AuthModule {}
