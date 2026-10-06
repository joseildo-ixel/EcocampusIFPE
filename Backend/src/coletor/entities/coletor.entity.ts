import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Coleta } from '../../coleta/entities/coleta.entity'; // Ajuste o caminho se necessário
import { Descarte } from '../../descarte/entities/descarte.entity'; // Ajuste o caminho se necessário

@Entity('coletores')
export class Coletor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  localizacao: string;

  @Column('float')
  capacidadeMaxima: number;

  @Column('float', { default: 0 })
  volumeAtual: number;

  // Relação com as coletas (esvaziamento do coletor)
  @OneToMany(() => Coleta, (coleta) => coleta.coletor)
  coletas: Coleta[];

  // Relação com os descartes (usuários jogando lixo no coletor) - Feito na etapa anterior!
  @OneToMany(() => Descarte, (descarte) => descarte.coletor)
  descartes: Descarte[];
}