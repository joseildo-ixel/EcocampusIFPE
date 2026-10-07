import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Objeto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao?: string;

  @Column()
  quantidade: number;
}