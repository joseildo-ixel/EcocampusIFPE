import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Coletor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  localizacao: string;

  @Column()
  capacidadeMaxima: number;

  @Column({ default: 0 })
  volumeAtual: number;
}