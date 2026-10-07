import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Coleta } from '../../coleta/entities/coleta.entity';

@Entity()
export class Coletor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  localizacao: string;

  @Column()
  capacidadeMaxima: number;

  @Column({ default: 0 })
  volumeAtual: number;

  @OneToMany(() => Coleta, (coleta) => coleta.coletor)
  coletas: Coleta[];
}