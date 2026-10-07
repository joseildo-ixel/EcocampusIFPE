import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Coletor } from '../../coletor/entities/coletor.entity';

@Entity()
export class Coleta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: Date;

  @Column()
  quantidade: number;

  @ManyToOne(() => Coletor, (coletor) => coletor.coletas)
  @JoinColumn({ name: 'coletor_id' })
  coletor: Coletor;
}