import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne, PrimaryColumn, JoinTable, ManyToMany } from 'typeorm'
import { User } from './User'
import { Notify } from './Notify'
import { HomeWork } from './Homework'
import { Course } from './Course'
@Entity()
export class CourseList {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => Course, course => course.lists, {
    cascadeRemove: true
  })
  course: Course
  @ManyToOne(type => User, user => user.teachcourses, {
    cascadeRemove: true
  })
  teacher: User
  @ManyToMany(type => User, user => user.learncourses)
  @JoinTable()
  students: User[] = []
  @Column({
    nullable: true
  })
  activeUnit: number
  @Column({
    nullable: true
  })
  totalUnit: number
}