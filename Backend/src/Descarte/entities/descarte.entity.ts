import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Coletor } from '../../coletor/entities/coletor.entity';
import { DescarteItem } from '../../objetos/entities/descarte-item.entity';
import { DescarteStatus } from '../../common/enums/descarte-status.enum';

@Entity('descartes')
export class Descarte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DescarteStatus,
    enumName: 'descartes_status_enum',
  })
  status: DescarteStatus;

  @Column({ type: 'timestamp' })
  dataDescarte: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  pesoKg: number;

  @Column({ type: 'varchar', length: 50 })
  tipoResiduo: string; // 'eletrônico', 'perigoso', 'comum'

  @Column({ type: 'varchar', length: 100 })
  destino: string; // Para onde foi o resíduo

  @Column({ type: 'text', nullable: true })
  observacoes: string | null;

  @CreateDateColumn({ type: 'timestamp' })
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
