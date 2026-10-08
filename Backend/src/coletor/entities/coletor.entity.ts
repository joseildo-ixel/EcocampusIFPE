import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Coleta } from '../../coleta/entities/coleta.entity';
import { Descarte } from '../../Descarte/entities/descarte.entity';

@Entity('coletores')
export class Coletor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  localizacao: string;

  @Column('float')
  capacidadeMaxima: number;

  @Column('float', { default: 0 })
  volumeAtual: number;

  @OneToMany(() => Coleta, (coleta) => coleta.coletor)
  coletas: Coleta[];

  @OneToMany(() => Descarte, (descarte) => descarte.coletor)
  descartes: Descarte[];
}