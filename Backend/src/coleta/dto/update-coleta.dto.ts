import { PartialType } from '@nestjs/mapped-types';
import { CreateColetaDto } from './create-coleta.dto';

export class UpdateColetaDto extends PartialType(CreateColetaDto) {}