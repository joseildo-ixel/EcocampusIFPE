import { Type } from 'class-transformer';
import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateDescarteItemDto {
  @IsUUID()
  objetoId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantidade: number;
}
