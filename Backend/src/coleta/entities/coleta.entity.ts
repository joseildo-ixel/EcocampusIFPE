import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Coletor } from '../../coletor/entities/coletor.entity'; // Ajuste o caminho se necessário

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
    // Justificativa (Rubrica): Impede a exclusão de um coletor no sistema se ele já possuir um histórico de coletas (esvaziamentos) registradas, garantindo a integridade dos relatórios.
  })
  @JoinColumn({ name: 'coletor_id' })
  coletor: Coletor;
}