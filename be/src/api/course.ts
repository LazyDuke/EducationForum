import { req, path, APIError, IParams, file, execfile } from './api'
import { User } from '../entity/User'
import {getConnection} from '../module/database'
import {config} from '../module/config'
import retcode from './retcode'
import { Role } from '../entity/Role'
import { Course as CourseModel } from '../entity/Course'
import { CourseList } from "../entity/CourseList";
@path('course')
export class Course {
  @req()
  async getstudent ({cid}: any) {
    let connection = await getConnection()
    let courseRepo = connection.getRepository(CourseModel)
    let course = await courseRepo.findOne({'cid': cid})
    let userRepo = await connection.getRepository(User)
    let users = await userRepo.find({}, {
      alias: 'user',
      leftJoinAndSelect: {
        course: 'user.course'
      },
      whereConditions: {
        'course.cid': cid
      }
    })
    return users
  }
  @req()
  async addstudent ({user, uid, cid}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    let connection = await getConnection()
    let courselistRepo = connection.getRepository(CourseList)
    let courselist = await courselistRepo.findOne({}, {
      alias: 'list',
      leftJoinAndSelect: {
        course: 'list.course'
      },
      whereConditions: {
        'course.cid': cid
      }
    })
    let userRepo = await connection.getRepository(User)
    let u = await userRepo.findOne({'uid': uid})
    u.learncourses.push(courselist)
    await userRepo.persist(user)
    return
  }
}