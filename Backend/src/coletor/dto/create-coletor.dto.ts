import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateColetorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  localizacao: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  capacidadeMaxima: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}