import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false })
  flag!: number;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  tag!: string;

  @Column({ nullable: false })
  thumb!: number;

  @Column({ nullable: false })
  m3u8!: string;
}