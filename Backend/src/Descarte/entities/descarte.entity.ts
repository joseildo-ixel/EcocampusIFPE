import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Coletor } from '../../coletor/entities/coletor.entity'; // Ajuste o caminho conforme sua estrutura

@Entity('descartes')
export class Descarte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  tipoResiduo: string;

  @Column('float')
  quantidade: number;

  @Column({ nullable: true })
  localColeta: string;

  @CreateDateColumn()
  criadoEm: Date;

  // Relacionamento com Usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.descartes, {
    onDelete: 'CASCADE', 
    // Justificativa (Rubrica): Se um usuário for removido do sistema, seus registros de descarte também são apagados para não gerar dados órfãos.
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // Relacionamento com Coletor
  @ManyToOne(() => Coletor, {
    onDelete: 'RESTRICT', 
    // Justificativa (Rubrica): Impede que um ponto de coleta/coletor seja apagado acidentalmente se já existirem descartes históricos vinculados a ele.
  })
  @JoinColumn({ name: 'coletor_id' })
  coletor: Coletor;
}