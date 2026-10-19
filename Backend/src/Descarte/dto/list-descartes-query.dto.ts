import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { PageQueryDto } from '../../common/dto/page-query.dto';

export class ListDescartesQueryDto extends PageQueryDto {
  @IsOptional()
  @IsIn(['pendente', 'processado', 'finalizado'])
  status?: string;

  @IsOptional()
  @IsString()
  tipoResiduo?: string;

  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @IsOptional()
  @IsUUID()
  coletorId?: string;
}
