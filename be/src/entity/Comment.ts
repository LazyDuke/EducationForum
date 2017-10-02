import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne} from 'typeorm'
import {Role} from './Role'
import {User} from './User'
import {Thread} from './Thread'

@Entity()
export class Comment {

  @PrimaryGeneratedColumn()
  id: number  /* 楼层id */

  @Column()
  uid: number
  @Column()
  username: string

  @Column('time')
  time: string
  @Column('text', {
    nullable: true
  })
  pic: string
  @Column('text')
  content: string   /* 回复正文 */
  @OneToOne(type => Comment)
  @JoinColumn()
  cite: Comment   /* 引用回复 */
  @ManyToOne(type => Thread, thread => thread.comments, {
    cascadeRemove: true
  })
  thread: Thread
}