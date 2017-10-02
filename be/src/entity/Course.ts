/**
 * 课程表
 */
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne, PrimaryColumn } from 'typeorm'
import { User } from './User'
import { Notify } from './Notify'
import { CourseList } from "./CourseList";
@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  cid: string
  @Column({
    nullable: true
  })
  cname: string
  @OneToMany(type => Notify, notify => notify.course, {
    cascadeInsert: true,
    cascadeUpdate: true
  })
  notifys: Notify[] = []
  @OneToMany(type => CourseList, list => list.course, {
    cascadeInsert: true,
    cascadeUpdate: true
  })
  lists: CourseList[] = []
}
