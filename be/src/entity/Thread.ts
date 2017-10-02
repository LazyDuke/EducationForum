import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne, PrimaryColumn } from 'typeorm'
import {User} from './User'
import {Comment} from './Comment'
import {ThreadList} from './ThreadList'
export enum Status {
  checked = 0,
  checking = 1,
  deleted = 2 // 不通过其实和删除是一样的
}
@Entity()
export class Thread {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  title: string  // 帖子主题
  @Column()
  time: string  // 发帖时间
  @Column('text')
  content: string // 帖子正文
  @Column('int')
  replies: number
  @Column({
    type: 'boolean',
    nullable: true
  })
  elite: boolean
  @Column('smallint')
  status: Status
  @Column()
  views: number
  @Column({
    type: 'text',
    nullable: true
  })
  deleteReason: string

  @ManyToOne(type => ThreadList, list => list.threads, {
    cascadeRemove: true
  })
  list: ThreadList
  @OneToMany(type => Comment ,comment => comment.thread, {
    cascadeInsert: true,
    cascadeUpdate: true
  })    /* 回复列表 */
  comments: Comment[] = []

  /**
   * username 发帖用户名
   * uid 发帖用户ID
   */
  @Column()
  username: string
  @Column()
  uid: number
  @Column('text', {
    nullable: true
  })
  pic: string
}
