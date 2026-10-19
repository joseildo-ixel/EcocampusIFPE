import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Descarte } from '../../Descarte/entities/descarte.entity';

@Entity('coletores')
export class Coletor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  localizacao: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  capacidadeMaxima: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  volumeAtual: number;

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  @OneToMany(() => Descarte, (descarte) => descarte.coletor)
  descartes: Descarte[];
}