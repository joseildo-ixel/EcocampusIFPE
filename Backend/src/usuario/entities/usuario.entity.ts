import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Descarte } from '../../Descarte/entities/descarte.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nome: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255, select: false })
  senha: string;

  @Column({ length: 50 })
  role: string; // 'admin', 'usuario', 'coletor'

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  @OneToMany(() => Descarte, (descarte) => descarte.usuario)
  descartes: Descarte[];
}