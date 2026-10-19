import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class AddColetorVolumeDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  volume: number;
}
