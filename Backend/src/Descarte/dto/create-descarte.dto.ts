import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateDescarteDto {
  @IsString()
  tipoResiduo: string;

  @IsNumber()
  quantidade: number;

  @IsOptional()
  @IsString()
  localColeta?: string;
}