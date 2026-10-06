import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Descarte } from '../../Descarte/entities/descarte.entity'; // Lembre-se de ajustar o caminho conforme sua estrutura

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senhaHash: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criadoEm: Date;

  // Relacionamento essencial para a rubrica do projeto
  @OneToMany(() => Descarte, (descarte) => descarte.usuario)
  descartes: Descarte[];
}