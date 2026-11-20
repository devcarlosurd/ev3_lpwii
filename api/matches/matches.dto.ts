import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString, Length, Max, Min } from 'class-validator';

export class ScheduleDto {
  @ApiProperty({ minimum: 1 }) @IsInt() @Min(1) torneoId!: number;
  @ApiProperty({ minimum: 1 }) @IsInt() @Min(1) equipoLocalId!: number;
  @ApiProperty({ minimum: 1 }) @IsInt() @Min(1) equipoVisitanteId!: number;
  @ApiProperty({ format: 'date-time' }) @IsDateString() fechaHora!: string;
  @ApiProperty() @IsString() @Length(2, 60) ronda!: string;
}

export class ScoreDto {
  @ApiProperty({ minimum: 0, maximum: 999 }) @IsInt() @Min(0) @Max(999) puntajeLocal!: number;
  @ApiProperty({ minimum: 0, maximum: 999 }) @IsInt() @Min(0) @Max(999) puntajeVisitante!: number;
}
