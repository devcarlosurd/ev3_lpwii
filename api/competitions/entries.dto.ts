import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, Min } from 'class-validator';
import { EntryState } from '../entities';

export class EntryDto {
  @ApiProperty({ minimum: 1 }) @IsInt() @Min(1) equipoId!: number;
}

export class ReviewEntryDto {
  @ApiProperty({ enum: [EntryState.Accepted, EntryState.Rejected] })
  @IsIn([EntryState.Accepted, EntryState.Rejected])
  estado!: EntryState.Accepted | EntryState.Rejected;
}
