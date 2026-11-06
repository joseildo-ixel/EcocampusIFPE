import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UsuarioRole } from '../../common/enums/usuario-role.enum';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha: string;

  @IsEnum(UsuarioRole)
  @IsNotEmpty({ message: 'A função do usuário é obrigatória' })
  role: UsuarioRole;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
