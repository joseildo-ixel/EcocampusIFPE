import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateColetorDto {
  @IsString()
  @IsNotEmpty()
  localizacao: string;

  @IsNumber()
  @Min(1)
  capacidadeMaxima: number;
}