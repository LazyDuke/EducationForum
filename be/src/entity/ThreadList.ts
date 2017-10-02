import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, Column, ManyToOne } from 'typeorm'
import { User } from './User'
import { Thread } from './Thread'

@Entity()
export class ThreadList {
  @PrimaryGeneratedColumn()
  id: number
  @OneToMany(type => Thread, thread => thread.list, {
    cascadeUpdate: true,
    cascadeInsert: true
  })
  threads: Thread[] = []
  @Column()
  block: string
}
