import { req, path, APIError, IParams } from './api'
import { User } from '../entity/User'
import {getConnection} from '../module/database'
import {config} from '../module/config'
import retcode from './retcode'
import { Role } from '../entity/Role'
import { Thread, Status } from '../entity/Thread'
class adminError extends APIError {
}
@path('/admin')
export class Admin {
  adminidentify (user: User) {
    if (user.role.name !== 'administrator') {
      throw new APIError(107)
    }
  }
  @req()
  async getAccount ({role, user}: IParams) {
    if (!user) {
      throw new adminError(106)
    } else if (user.role.name !== 'administrator') {
      throw new adminError(107)
    }
    let connection = await getConnection()
    let userRepo = await connection.getRepository(User)
    let users = userRepo.find({}, {
      alias: 'user',
      leftJoinAndSelect: {
        role: 'user.role'
      },
      whereConditions: {
        'role.name': role
      }
    })
    return users
  }
  @req()
  async deleteAccount ({user, uid}: IParams) {
    this.adminidentify(user)
    let connection = await getConnection()
    let userRepo = await connection.getRepository(User)
    let u = await userRepo.findOne({
      'uid': uid
    })
    console.log(uid)
    await userRepo.remove(u).then(e => {
      console.log('delete success')
    })
  }
  @req()
  async getthreads ({user}: IParams) {
    this.adminidentify(user)
    let connection = await getConnection()
    let thRepo = await connection.getRepository(Thread)
    let result = await thRepo.find({}, {
      alias: 'thread',
      leftJoinAndSelect: {
        block: 'thread.list'
      }
    })
    return result
  }
  @req()
  async accessThread ({user, id}: IParams){
    this.adminidentify(user)
    let connection = await getConnection()
    let thRepo = await connection.getRepository(Thread)
    let thread = await thRepo.findOne({id})
    thread.status = Status.checked
    await thRepo.persist(thread)
    return thread
  }
  @req()
  async deleteThread ({user, id, reason}: IParams) {
    this.adminidentify(user)
    let connection = await getConnection()
    let thRepo = await connection.getRepository(Thread)
    let thread = await thRepo.findOne({id})
    thread.status = Status.deleted
    thread.deleteReason = reason
    thread.elite = false
    await thRepo.persist(thread)
    return thread
  }
  @req()
  async addElite ({user, id}: IParams) {
    this.adminidentify(user)
    let connection = await getConnection()
    let thRepo = await connection.getRepository(Thread)
    let thread = await thRepo.findOne({id}, {
      alias: 'thread',
      leftJoinAndSelect: {
        comment: 'thread.comments'
      }
    })
    thread.elite = true
    await thRepo.persist(thread)
    return thread
  }
  @req()
  async deleteElite ({user, id}: IParams) {
    this.adminidentify(user)
    let connection = await getConnection()
    let thRepo = await connection.getRepository(Thread)
    let thread = await thRepo.findOne({id})
    thread.elite = false
    await thRepo.persist(thread)
    return thread
  }
  @req()
  async restoreThread ({user, id}: IParams) {
    this.adminidentify(user)
    let connection = await getConnection()
    let thRepo = await connection.getRepository(Thread)
    let thread = await thRepo.findOneById(id)
    console.log(thread)
    thread.status = Status.checked
    thread.deleteReason = ''
    await thRepo.persist(thread)
    return thread
  }
  @req()
  async getPreview ({user, id}: IParams) {
    this.adminidentify(user)
    let connection = await getConnection()
    let thRepo = await connection.getRepository(Thread)
    let thread = await thRepo.findOneById(id, {
      alias: 'thread',
      leftJoinAndSelect: {
        list: 'thread.list'
      }
    })
    return thread
  }
}
