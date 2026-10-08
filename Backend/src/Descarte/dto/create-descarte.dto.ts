import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateDescarteDto {
  @IsString()
  @IsNotEmpty()
  tipoResiduo: string;

  @IsNumber()
  quantidade: number;

  @IsOptional()
  @IsString()
  localColeta?: string;

  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @IsNumber()
  @IsNotEmpty()
  coletorId: number;
}