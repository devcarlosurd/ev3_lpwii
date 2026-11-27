import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayUnique, IsArray, IsEmail, IsIn, IsString, Length, ValidateIf } from 'class-validator';

export class TeamDto {
  @ApiProperty() @IsString() @Length(2, 100) nombre!: string;
  @ApiProperty() @IsString() @Length(2, 80) juegoPreferido!: string;
}

export class UpdateTeamDto extends TeamDto {
  @ApiProperty({ enum: ['activo', 'inactivo'] })
  @IsIn(['activo', 'inactivo']) estado!: string;

  @ApiPropertyOptional({ type: [String], example: ['jugador@example.test'] })
  // Si se envían correos, deben ser válidos, únicos y hasta 30.
  @ValidateIf((_object, value) => value !== undefined)
  @IsArray() @ArrayUnique() @ArrayMaxSize(30) @IsEmail({}, { each: true })
  correos?: string[];
}
