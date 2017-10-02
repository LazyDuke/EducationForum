import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne, PrimaryColumn, JoinTable } from 'typeorm'
import {User} from './User'
@Entity()
export class Messages {
  isMySelf: boolean
  @PrimaryGeneratedColumn()
  id: number
  @Column('text')
  content: string
  @Column('bigint')
  time: number
  @Column()
  isRead: boolean
  @ManyToOne(type => User)
  @JoinTable()
  sender: User
  @ManyToOne(type => User)
  @JoinTable()
  receiver: User
  // @ManyToOne(type => MessageList, messageList => messageList.messages)
  // list: MessageList
}
