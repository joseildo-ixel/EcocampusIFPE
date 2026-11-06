import { IsEnum, IsOptional } from 'class-validator';
import { PageQueryDto } from '../../common/dto/page-query.dto';
import { DescarteStatus } from '../../common/enums/descarte-status.enum';
import { IsString, IsUUID } from 'class-validator';

export class ListDescartesQueryDto extends PageQueryDto {
  @IsOptional()
  @IsEnum(DescarteStatus)
  status?: DescarteStatus;

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
