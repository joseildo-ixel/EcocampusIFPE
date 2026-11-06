import { Type } from 'class-transformer';
import {
  IsDateString,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { DescarteStatus } from '../../common/enums/descarte-status.enum';
import { CreateDescarteItemDto } from './create-descarte-item.dto';

export class CreateDescarteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipoResiduo: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999.99)
  pesoKg: number;

  @IsOptional()
  @IsEnum(DescarteStatus)
  status?: DescarteStatus;

  @IsOptional()
  @IsDateString()
  dataDescarte?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  destino: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsUUID()
  @IsNotEmpty()
  usuarioId: string;

  @IsUUID()
  @IsNotEmpty()
  coletorId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDescarteItemDto)
  itens?: CreateDescarteItemDto[];
}
