import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { DescarteItem } from './descarte-item.entity';

@Entity('objetos')
export class Objeto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nome: string;

  @Column('text')
  descricao: string;

  @Column({ length: 50 })
  tipo: string; // 'metal', 'plástico', 'vidro', 'papel', 'eletrônico'

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  pesoKg: number; // Peso em quilogramas

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  dataCriacao: Date;

  @Column({ default: false })
  pertencePatrimonio: boolean;

  @OneToMany(() => DescarteItem, (item) => item.objeto)
  itensDescarte: DescarteItem[];
}
