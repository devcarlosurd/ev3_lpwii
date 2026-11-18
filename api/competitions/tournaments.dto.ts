import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsString, Length, Max, Min } from 'class-validator';
import { Mode, TournamentState } from '../entities';

export class TournamentDto {
  @ApiProperty() @IsString() @Length(2, 100) nombre!: string;
  @ApiProperty() @IsString() @Length(2, 80) videojuego!: string;
  @ApiProperty({ enum: Mode }) @IsEnum(Mode) modalidad!: Mode;
  @ApiProperty({ format: 'date-time' }) @IsDateString() fechaInicio!: string;
  @ApiProperty({ format: 'date-time' }) @IsDateString() cierreInscripcion!: string;
  @ApiProperty({ minimum: 2, maximum: 512 }) @IsInt() @Min(2) @Max(512) cupoMaximo!: number;
  @ApiProperty({ enum: TournamentState }) @IsEnum(TournamentState) estado!: TournamentState;
}

export class UpdateTournamentDto extends PartialType(TournamentDto, { skipNullProperties: false }) {}
