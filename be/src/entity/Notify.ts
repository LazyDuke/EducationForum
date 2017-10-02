import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne, PrimaryColumn } from 'typeorm'
import { User } from './User'
import { Course } from './Course'
@Entity()
export class Notify {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  caption: string
  @Column()
  content: string
  @Column()
  date: string
  @ManyToOne(type => User)
  user: User
  @ManyToOne(type => Course, course => course.notifys, {
    cascadeRemove: true
  })
  course: Course
}
