import { Body, Controller, Get, HttpCode, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { AccessGuard, Actor } from '../security';
import { LoginDto, ProfileDto, RegisterDto } from './auth.dto';
import { AuthService, publicUser } from './auth.service';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  @Post('registro')
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Get('perfil')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  profile(@Actor() user: User) {
    return publicUser(user);
  }

  @Patch('perfil')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async update(@Actor() user: User, @Body() dto: ProfileDto) {
    await this.users.update(user.id, dto);
    return publicUser(Object.assign(user, dto));
  }
}
