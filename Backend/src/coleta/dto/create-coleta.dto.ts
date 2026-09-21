import { IsDateString, IsNumber, Min } from 'class-validator';

export class CreateColetaDto {
  @IsDateString()
  data: string;

  @IsNumber()
  @Min(0)
  quantidade: number;
}