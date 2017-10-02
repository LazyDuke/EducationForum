import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm'
import {Thread} from './Thread'
import { User } from './User'

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number
  @Column({
    unique: true
  })
  name: string
  @Column()
  description: string
  // @Column('json')
  // permissions: string[] = []

  // 不需要啊
  // @OneToMany(type => User, user => user.role)
  // users: User[] = []
}
