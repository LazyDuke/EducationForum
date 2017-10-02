import { req, path, APIError, IParams } from './api'
import { User as UserModel } from '../entity/User'
import {getConnection} from '../module/database'
import {config} from '../module/config'
import retcode from './retcode'
import { Messages } from '../entity/Messages'
function deleteUseless (user: any) {
  delete user.teachcourses
  delete user.learncourses
  // delete user.pic
}
function otherUser (msg: Messages, self: UserModel) {
  if (msg.sender.id === self.id) {
    return msg.receiver
  } else {
    return msg.sender
  }
}
@path('/message')
export class Message {
  @req()
  async list ({user}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    let connection = await getConnection()
    let msgRepo = await connection.getRepository(Messages)
    const query = msgRepo.createQueryBuilder('msg')
      .leftJoinAndSelect('msg.sender', 'sender')
      .leftJoinAndSelect('msg.receiver', 'receiver')
      .where('msg.sender = :id', { id: user.id })
      .orWhere('msg.receiver = :id', { id: user.id })
    let list = await query.getMany()
    list = list.map(i => {
      deleteUseless(i.sender)
      deleteUseless(i.receiver)
      return i
    })
    let groups: {
      [key: string]: {
        latest: number,
        content: Messages
        other: UserModel,
        total: number
      }
    } = {}
    for (let msg of list) {
      let other = otherUser(msg, user)
      groups[other.id] = groups[other.id] || {
        latest: 0,
        content: msg,
        other: other,
        total: 0
      }
      groups[other.id].total += 1
      if (groups[other.id].latest < msg.time) {
        groups[other.id].latest = msg.time
        groups[other.id].content = msg
      }
    }
    let ret = Object.keys(groups).map((id: string) => groups[id]).sort((a, b) => b.latest - a.latest).map(i => ({
      latest: i.latest,
      sender: i.other,
      total: i.total,
      content: i.content.content
    }))
    return ret
  }
  @req()
  async unread ({user}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    let connection = await getConnection()
    let msgRepo = await connection.getRepository(Messages)
    let unread = await msgRepo.count({
      'receiver': user.id,
      'isRead': false
    })
    return {
      unread
    }
  }
  @req()
  async getMessages ({user, otherUserId}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    let connection = await getConnection()
    let msgRepo = await connection.getRepository(Messages)
    let query = msgRepo.createQueryBuilder('msg')
      .leftJoinAndSelect('msg.sender', 'sender')
      .leftJoinAndSelect('msg.receiver', 'receiver')
      .where('msg.sender = :id1 AND msg.receiver = :id2', { id1: user.id, id2: otherUserId })
      .orWhere('msg.receiver = :id1 AND msg.sender = :id2', { id1: user.id, id2: otherUserId })
    let msgs = await query.getMany()
    let update = msgRepo.createQueryBuilder('')
      .where('receiver = :id1 AND sender = :id2', { id1: user.id, id2: otherUserId })
      .update({
        isRead: true
      })
    // console.log(update.getSqlWithParameters())
    await update.execute()

    let other = null
    let me = null
    if (msgs.length > 0) {
      other = otherUser(msgs[0], user)
      me = user
      deleteUseless(other)
      deleteUseless(me)
    }
    msgs = msgs.map(i => {
      i.isMySelf = i.sender.id === user.id
      delete i.sender
      delete i.receiver
      return i
    })
    return {
      other,
      me,
      msgs
    }
  }
  @req()
  async send ({user, receiver, username, content}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    let connection = await getConnection()
    let msgRepo = await connection.getRepository(Messages)
    let userRepo = await connection.getRepository(UserModel)
    let recver
    if (username && receiver === undefined) {
      recver = await userRepo.findOne({
        username
      })
    } else {
      recver = await userRepo.findOneById(receiver)
    }
    if (recver.id === user.id) {
      throw new APIError(100, '不能给自己发私信')
    }
    let msg = new Messages()
    msg.sender = user
    msg.receiver = recver
    msg.content = content
    msg.isRead = false
    msg.time = ~~((new Date().getTime()) / 1000)
    msgRepo.persist(msg)
  }
}
