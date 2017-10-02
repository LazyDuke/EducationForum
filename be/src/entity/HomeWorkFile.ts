import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne} from 'typeorm'
import {Role} from './Role'
import {User} from './User'
import {Thread} from './Thread'
import { HomeWork } from './Homework'

@Entity()
export class HomeWorkFile {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  hwid: number  // 所属作业id
  @Column('text')
  filename: string
  @Column({
    nullable: true
  })
  date: string
  @Column({
    nullable: true
  })
  rate: string
  @Column()
  uid: number
  @ManyToOne(type => HomeWork, homework => homework.files)
  homework: HomeWork
}
