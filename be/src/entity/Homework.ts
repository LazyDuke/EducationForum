/**
 * 作业表
 */
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne, PrimaryColumn } from 'typeorm'
import { User } from './User'
import { HomeWorkFile } from './HomeWorkFile'
import { Course } from "./Course";

@Entity()
export class HomeWork {

  @PrimaryGeneratedColumn()
  id: number
  @Column()
  cid: number
  @Column()
  title: string
  @Column()
  date: string
  @OneToMany(type => HomeWorkFile, file => file.homework)
  files: HomeWorkFile[] = []
}
