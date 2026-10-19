import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Coletor } from '../../coletor/entities/coletor.entity';
import { DescarteItem } from '../../objetos/entities/descarte-item.entity';

@Entity('descartes')
export class Descarte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  status: string;

  @Column({ type: 'timestamp' })
  dataDescarte: Date;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  pesoKg: number;

  @Column({ length: 50 })
  tipoResiduo: string; // 'eletrônico', 'perigoso', 'comum'

  @Column({ length: 100 })
  destino: string; // Para onde foi o resíduo

  @Column('text', { nullable: true })
  observacoes: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  @Column({ type: 'uuid' })
  usuarioId: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.descartes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column({ type: 'uuid', nullable: true })
  coletorId: string | null;

  @ManyToOne(() => Coletor, (coletor) => coletor.descartes, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'coletorId' })
  coletor: Coletor | null;

  @OneToMany(() => DescarteItem, (item) => item.descarte)
  itens: DescarteItem[];
}