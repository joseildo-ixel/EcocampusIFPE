import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Coletor } from '../../coletor/entities/coletor.entity';

@Entity('coletas')
export class Coleta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data: Date;

  @Column('float')
  quantidade: number;

  @ManyToOne(() => Coletor, (coletor) => coletor.coletas, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'coletor_id' })
  coletor: Coletor;
}
