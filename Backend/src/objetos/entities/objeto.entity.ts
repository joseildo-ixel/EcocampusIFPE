import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataCriacao: Date;

  @OneToMany(() => DescarteItem, (item) => item.objeto)
  itensDescarte: DescarteItem[];
}