import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateObjetoDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  @MaxLength(255)
  nome: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipo: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999.99)
  pesoKg: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}