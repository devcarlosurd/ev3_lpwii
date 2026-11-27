import {
  CanActivate, createParamDecorator, ExecutionContext, ForbiddenException, Injectable,
  SetMetadata, UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from './entities';

const ROLE = 'gamehub-role';
// Deja el rol requerido en metadatos que lee el guard.
export const RequireRole = (role: Role) => SetMetadata(ROLE, role);
// Entrega al controlador el usuario cargado por el guard.
export const Actor = createParamDecorator((_data, context: ExecutionContext): User =>
  context.switchToHttp().getRequest().user,
);

export function jwtKey(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 bytes.');
  }
  return secret;
}

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // Lee el token del encabezado Authorization: Bearer.
    const [scheme, token, extra] = String(request.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token || extra) throw new UnauthorizedException('Ingresa a tu cuenta.');
    let id: number;
    try {
      // Valida firma y expiración. sub contiene el ID del usuario.
      const claims = await this.jwt.verifyAsync<{ sub: number }>(token, { secret: jwtKey(), algorithms: ['HS256'] });
      id = claims.sub;
      if (!Number.isSafeInteger(id) || id < 1) throw new Error('Token inválido.');
    } catch {
      throw new UnauthorizedException('Tu sesión expiró o es inválida.');
    }
    // Consulta la cuenta activa y el rol vigente en MySQL.
    const user = await this.users.findOneBy({ id, activo: true });
    if (!user) throw new UnauthorizedException('La cuenta no está disponible.');
    // El rol de la ruta tiene prioridad sobre el del controlador.
    const role = this.reflector.getAllAndOverride<Role>(ROLE, [context.getHandler(), context.getClass()]);
    if (role && user.rol !== role) throw new ForbiddenException('Tu rol no permite realizar esta acción.');
    // Deja el usuario disponible para @Actor().
    request.user = user;
    return true;
  }
}
