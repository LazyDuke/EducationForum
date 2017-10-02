import { req, path, APIError, IParams } from './api'
import { User as UserModel } from '../entity/User'
import {getConnection} from '../module/database'
import {config} from '../module/config'
import retcode from './retcode'
import { Role } from '../entity/Role'
import { Thread } from "../entity/Thread";
import { Course } from "../entity/Course";
import { CourseList } from "../entity/CourseList";
class LoginError extends APIError {
}
@path('/user')
class User {
  checkLogin (user: UserModel) {
    if (!user) {
      throw new LoginError(106)
    }
  }
  @req()
  async login ({username, password, set}: IParams) {
    let connection = await getConnection()
    let userrepository = connection.getRepository(UserModel)
    let rolerepo = connection.getRepository(Role)
    let u = await userrepository.findOne({
      username: username,
      password: password
    }, {
      alias: 'user',
      leftJoinAndSelect: {
        role: 'user.role'
      }
    })// 验证
    set('user', u)
    if (u) {
      return u
    } else {
      throw new LoginError(102)
    }
  }
  @req()
  async register ({form, cid}: any) {
    let connection = await getConnection()
    let user = new UserModel()
    let rorepo = await connection.getRepository(Role)
    let role = new Role()
    let courselistRepo = await connection.getRepository(CourseList)
    let courseRepo = await connection.getRepository(Course)
    user.uid = form.tid || form.sid
    user.gender = form.gender
    user.username = form.username
    user.password = form.pass
    user.email = form.email
    user.phone = form.phone
    user.realname = form.realname
    user.pic = form.pic
    if (form.role === '教师') {
      role = await rorepo.findOne({
        name: 'teacher'
      })
      // 这个先放这边，以后有需要有更多的课程再把这个单独写到一个方法里
      let courselist = new CourseList()
      let course = await courseRepo.findOne({'cid': cid})
      console.log(cid)
      courselist.course = course
      user.teachcourses.push(courselist)
    } else {
      role = await rorepo.findOne({
        name: 'student'
      })
      let courselist = await courselistRepo.findOne({}, {
        alias: 'list',
        leftJoinAndSelect: {
          course: 'list.course'
        },
        whereConditions: {
          'course.cid': cid
        }
      })
      user.learncourses.push(courselist)
    }
    user.role = role
    let userRepository = await connection.getRepository(UserModel)
    let result = await userRepository.persist(user)
    if (result) {
      return result
    } else {
      throw new APIError(101)
    }

  }
  @req()
  async init ({user}: IParams) {
    this.checkLogin(user)
    delete user['password']
    return user
  }
  @req()
  async logout ({user, set}: IParams) {
    this.checkLogin(user)
    set('user', undefined)
  }
  @req()
  async updateinfo ({user, info}: IParams) {
    this.checkLogin(user)
    let connection = await getConnection()
    let userRepo = await connection.getRepository(UserModel)
    console.log(user)
    if (info.email) {
      user.email = info.email
    }
    if (info.phone) {
      user.phone = info.phone
    }
    if (info.gender) {
      user.gender = info.gender
    }
    if (info.post) {
      user.post = info.post
    }
    if (info.institude) {
      user.institude = info.institude
    }
    if (info.location) {
      user.location = info.location
    }
    await userRepo.persist(user)
  }
  @req()
  async updatepw ({user, password}: IParams) {
    this.checkLogin(user)
    let connection = await getConnection()
    let userRepo = await connection.getRepository(UserModel)
    user.password = password
    await userRepo.persist(user)
  }
  @req()
  async checkunique ({username, uid}: any) {
    let connection = await getConnection()
    let userRepo = await connection.getRepository(UserModel)
    let u = await userRepo.findOne({username: username})
    if (u) {
      throw new APIError(104)
    } else if (await userRepo.findOne({uid: uid})) {
      throw new APIError(105)
    }
    return
  }
  @req()
  async getPersonalInfo ({username}: any) {
    let connection = await getConnection()
    let userRepo = await connection.getRepository(UserModel)
    let thRepo = await connection.getRepository(Thread)
    let user = await userRepo.findOne({'username': username})
    let threads = await thRepo.find({'username': username})
    delete user['password']
    return [user, threads]
  }
}
