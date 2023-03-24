import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  text!: string;

  @Column({ nullable: false })
  type!: number;

  @Column({ nullable: false })
  page!: number;

  @Column({ default: 0 })
  locked!: number;
}