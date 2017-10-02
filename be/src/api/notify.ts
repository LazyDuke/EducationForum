import { req, path, APIError, IParams } from './api'
import { User as UserModel } from '../entity/User'
import {getConnection} from '../module/database'
import {config} from '../module/config'
import retcode from './retcode'
import { Role } from '../entity/Role'
import { Notify as NotifyModel } from '../entity/Notify'
import { Course } from "../entity/Course";
class NotifyError extends APIError {
}
@path('/notify')
class Notify {
  @req()
  async create ({cid, caption, content, date, user}: IParams) {
    let connection = await getConnection()
    let courseRepo = await connection.getRepository(Course)
    let notiRepo = connection.getRepository(NotifyModel)
    let notify = new NotifyModel()
    let course = await courseRepo.findOne({'cid': cid})
    notify.content = content
    notify.caption = caption
    notify.user = user
    notify.course = course
    notify.date = date
    await notiRepo.persist(notify)
    delete notify.user['password']
    delete notify.user['realname']
    delete notify.user['uid']
    return notify
  }
  @req()
  async delete ({caption, user}: IParams){
    let connection = await getConnection()
    let notiRepo = await connection.getRepository(NotifyModel)
    if (user.role.name === 'administrator') {
      let notify = await notiRepo.findOne({'caption': caption})
      console.log(notify)
      await notiRepo.remove(notify)
      return
    } else if (user.role.name === 'teacher') {
      let notify = await notiRepo.createQueryBuilder('notify').leftJoinAndSelect('notify.user', 'user')
      .where('user.uid=:uid').andWhere('notify.caption=:caption')
      .setParameters({
        'uid': user.uid,
        'caption': caption
      }).getOne()
      if (notify) {
        let result = await notiRepo.remove(notify)
        return
      } else {
        throw new NotifyError(101)
      }
    }
    throw new APIError(106)
  }
  @req()
  async getnotify ({cid}: any) {
    let connection = await getConnection()
    let notiRepo = await connection.getRepository(NotifyModel)
    let notifys = await notiRepo.find({}, {
      alias: 'notify',
      leftJoinAndSelect: {
        course: 'notify.course',
        user: 'notify.user'
      },
      whereConditions: {
        'course.cid': cid
      }
    })
    for (let index in notifys) {
      let notify = notifys[index]
      delete notify['course']
    }
    if (notifys) {
      for (let index in notifys) {
        let notify = notifys[index]
        delete notify.user['password']
        delete notify.user['realname']
        delete notify.user['uid']
      }
      // console.log(notifys[0].user.password)
      return notifys
    } else {
      throw new NotifyError(101)
    }
  }
}
