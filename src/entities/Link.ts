import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  href!: string;

  @Column({ nullable: false })
  thumb!: number;

  @Column({ default: 0 })
  locked!: number;
}