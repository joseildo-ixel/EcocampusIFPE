import { PartialType } from '@nestjs/mapped-types';
import { CreateObjetoDto } from './create-objeto.dto';

export class UpdateObjetoDto extends PartialType(CreateObjetoDto) {}
