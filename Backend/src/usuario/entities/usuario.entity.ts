import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Descarte } from '../../Descarte/entities/descarte.entity';
import { UsuarioRole } from '../../common/enums/usuario-role.enum';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  senha: string;

  @Column({ type: 'enum', enum: UsuarioRole, enumName: 'usuarios_role_enum' })
  role: UsuarioRole;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  dataCriacao: Date;

  @OneToMany(() => Descarte, (descarte) => descarte.usuario)
  descartes: Descarte[];
}
