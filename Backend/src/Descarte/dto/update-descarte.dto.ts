import { PartialType } from '@nestjs/mapped-types';
import { CreateDescarteDto } from './create-descarte.dto';

export class UpdateDescarteDto extends PartialType(CreateDescarteDto) {}