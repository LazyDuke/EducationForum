import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm'
import {User} from './User'

export type IdentityType = 'password'

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn()
  id: number
  @ManyToOne(type => User)
  user: User
  @Column()
  identityType: IdentityType
  constructor (type: IdentityType) {
    this.identityType = type
  }
}
