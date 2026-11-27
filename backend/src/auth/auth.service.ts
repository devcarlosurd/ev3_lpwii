import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Role, User } from '../entities';
import { jwtKey } from '../security';
import { LoginDto, RegisterDto } from './auth.dto';
import { checkPassword, hashPassword } from './password';

// Arma la respuesta pública con campos permitidos.
export function publicUser(user: User) {
  const { id, nombre, alias, correo, rol, activo } = user;
  return { id, nombre, alias, correo, rol, activo };
}

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>, private readonly jwt: JwtService) {}

  async register(dto: RegisterDto) {
    // El servidor asigna el rol estudiante y guarda un hash.
    const user = this.users.create({ ...dto, password: await hashPassword(dto.password), rol: Role.Student });
    try {
      await this.users.save(user);
    } catch (error) {
      // Un correo duplicado en MySQL se traduce a HTTP 409.
      if (error instanceof QueryFailedError && (error.driverError as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Este correo ya está registrado.');
      }
      throw error;
    }
    return publicUser(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users.createQueryBuilder('usuario')
      // Solo el login necesita recuperar el hash oculto.
      .addSelect('usuario.password')
      .where('usuario.correo = :correo AND usuario.activo = true', { correo: dto.correo })
      .getOne();
    if (!user || !(await checkPassword(dto.password, user.password))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }
    return {
      // Firma un JWT con el ID de la cuenta y duración de dos horas.
      token: await this.jwt.signAsync({ sub: user.id }, { secret: jwtKey(), algorithm: 'HS256', expiresIn: '2h' }),
      user: publicUser(user),
    };
  }
}
