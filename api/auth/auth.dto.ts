import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'estudiante@example.test' })
  // Normaliza el correo antes de validarlo y buscarlo.
  @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
  @IsEmail() @Length(3, 180)
  correo!: string;

  @ApiProperty({ minLength: 8, writeOnly: true })
  @IsString() @Length(8, 128)
  password!: string;
}

export class ProfileDto {
  @ApiProperty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString() @Length(2, 100)
  nombre!: string;

  @ApiProperty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString() @Length(2, 40)
  alias!: string;
}

// Reutiliza las reglas de correo y contraseña del login.
export class RegisterDto extends LoginDto {
  @ApiProperty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString() @Length(2, 100)
  nombre!: string;

  @ApiProperty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString() @Length(2, 40)
  alias!: string;
}
