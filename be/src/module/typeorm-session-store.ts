import { Connection, Repository, Entity } from 'typeorm'
import { Session } from '../entity/Session'

export class TypeormSessionStore {
  repo: Repository<Session>

  constructor (private connection: Connection) {
    this.repo = connection.getRepository(Session)
  }
  async get (sid: string): Promise<any> {
    let record = await this.repo.findOne({
      sid
    })
    if (record) {
      return record.sess
    }
    return null
  }
  async set (sid: string, sess: any, ttl: number) {
    let record = await this.repo.findOne({
      sid
    })
    if (record instanceof Session) {
      record.sess = sess
      await this.repo.persist(record)
    } else {
      let record = new Session()
      record.sid = sid
      record.sess = sess
      await this.repo.persist(record)
    }
  }
  async destroy (sid: string) {
    let record = await this.repo.findOne({
      sid
    })
    if (record instanceof Session) {
      await this.repo.remove(record)
    }
  }
}
