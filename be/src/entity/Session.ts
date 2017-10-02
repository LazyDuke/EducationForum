import {Entity, Column} from 'typeorm'

@Entity()
export class Session {
  @Column({
    primary: true,
    unique: true
  })
  sid: string
  @Column('json')
  sess: string
}
