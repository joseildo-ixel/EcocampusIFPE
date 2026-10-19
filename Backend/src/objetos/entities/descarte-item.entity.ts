import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Descarte } from '../../Descarte/entities/descarte.entity';
import { Objeto } from './objeto.entity';

@Entity('itens_descarte')
export class DescarteItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  descarteId: string;

  @ManyToOne(() => Descarte, (descarte) => descarte.itens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'descarteId' })
  descarte: Descarte;

  @Column({ type: 'uuid' })
  objetoId: string;

  @ManyToOne(() => Objeto, (objeto) => objeto.itensDescarte, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'objetoId' })
  objeto: Objeto;

  @Column({ type: 'integer' })
  quantidade: number;
}
