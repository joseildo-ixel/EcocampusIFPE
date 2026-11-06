import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Descarte } from '../../Descarte/entities/descarte.entity';

@Entity('coletores')
export class Coletor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  localizacao: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  capacidadeMaxima: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  volumeAtual: number;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  dataCriacao: Date;

  @OneToMany(() => Descarte, (descarte) => descarte.coletor)
  descartes: Descarte[];
}
