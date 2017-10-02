import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany, Column, ManyToMany } from 'typeorm'
import {Role} from './Role'
import { Thread } from './Thread'
import { ThreadList } from './ThreadList'
import { HomeWork } from './Homework'
import { CourseList } from './CourseList'
import { MessageList } from './MessageList'
export enum Gender {
  unknown = 0,
  male = 1,
  female = 2
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number
  @Column({
    unique: true
  })
  uid: number
  @Column({
    unique: true
  })
  username: string
  @Column('smallint')
  gender: Gender
  @Column({
    length: 256
  })
  password: string
  @Column({
    type: 'int',
    nullable: true
  })
  phone: number
  @Column({
    type: 'string',
    nullable: true
  })
  email: number
  @Column({
    type: 'string',
    nullable: true
  })
  location: string
  @Column({
    type: 'string',
    nullable: true
  })
  institude: string
  @Column({
    type: 'string',
    nullable: true
  })
  post: string
  @Column({
    type: 'string',
    nullable: false
  })
  realname: string
  @ManyToOne(type => Role)
  role: Role
  @Column('text', {
    nullable: true
  })
  pic: string
  @OneToMany(type => CourseList, list => list.teacher, {
    cascadeInsert: true,
    cascadeUpdate: true
  })
  teachcourses: CourseList[] = []
  @ManyToMany(type => CourseList, list => list.students, {
    cascadeInsert: true,
    cascadeUpdate: true
  })
  learncourses: CourseList[] = []
  toJSON () {
    const blackList = ['password']
    let ret: any = {}
    for (let key of Object.keys(this)) {
      if (!blackList.includes(key)) {
        ret[key] = (this as any)[key]
      }
    }
    return ret
  }
}
