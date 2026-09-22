import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Descarte {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipoResiduo: string;

  @Column('float')
  quantidade: number;

  @Column({ nullable: true })
  localColeta: string;

  @CreateDateColumn()
  criadoEm: Date;
}