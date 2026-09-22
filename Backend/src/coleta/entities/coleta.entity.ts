import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Coleta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  data: Date;

  @Column()
  quantidade: number;
}