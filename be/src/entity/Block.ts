import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany} from 'typeorm'
import { Blocklist } from './Blocklist'

/**
 * as child blocks
 */
@Entity()
export class Block {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
    nullable: false
  })
  bid: number   // block id
  @Column('string')
  name: string
  @Column({
    type: 'text',
    nullable: true
  })
  pic: string  // pic url
  @ManyToOne(type => Blocklist, blocklist => blocklist.blocks, {
    cascadeRemove: true
  })
  blocklist: Blocklist
}
