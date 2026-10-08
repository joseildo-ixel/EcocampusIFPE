import { IsDateString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateColetaDto {
  @IsDateString()
  data: string;

  @IsNumber()
  @Min(0)
  quantidade: number;

  @IsNumber()
  @IsNotEmpty()
  coletorId: number;
}