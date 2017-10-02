import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany} from 'typeorm'
import { Block } from './Block'

@Entity()
export class Blocklist {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
    nullable: false
  })
  bid: number   // block id

  @Column('text')
  name: number

  @OneToMany(type => Block, block => block.blocklist, {
    cascadeInsert: true,
    cascadeUpdate: true
  })
  blocks: Block[] = []
}
