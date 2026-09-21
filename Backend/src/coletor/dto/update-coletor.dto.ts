import { PartialType } from '@nestjs/mapped-types';
import { CreateColetorDto } from './create-coletor.dto';

export class UpdateColetorDto extends PartialType(CreateColetorDto) {}
