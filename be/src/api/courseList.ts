import { req, path, APIError, IParams, file, execfile } from './api'
import { User } from '../entity/User'
import {getConnection} from '../module/database'
import {config} from '../module/config'
import retcode from './retcode'
import { Role } from '../entity/Role'
import { HomeWork as HomeworkModel } from '../entity/Homework'
import { HomeWorkFile } from "../entity/HomeWorkFile";
import { CourseList as CourseListModel } from "../entity/CourseList";
@path('courselist')
export class CourseList {
  @req()
  async mendProgressing ({user, active}: IParams) {
    if (!user || user.role.name !== 'teacher') {
      throw new APIError(106)
    }
    let connection = await getConnection()
    let courselistRepo = await connection.getRepository(CourseListModel)
    let courselist = await courselistRepo.findOne({}, {
      alias: 'list',
      leftJoinAndSelect: {
        teacher: 'list.teacher',
        course: 'list.course',
        students: 'list.students'
      },
      whereConditions: {
        'teacher.uid': user.uid
      }
    })
    courselist.activeUnit = active
    await courselistRepo.persist(courselist)
    return courselist
  }
  async reviseProgress ({user, total}: IParams) {
    if (!user || user.role.name !== 'teacher') {
      throw new APIError(106)
    }
    let connection = await getConnection()
    let courselistRepo = await connection.getRepository(CourseListModel)
    let courselist = await courselistRepo.findOne({}, {
      alias: 'list',
      leftJoinAndSelect: {
        teacher: 'list.teacher',
        course: 'list.course',
        students: 'list.students'
      },
      whereConditions: {
        'teacher.uid': user.uid
      }
    })
    courselist.totalUnit = total
    courselist.activeUnit = 0
    await courselistRepo.persist(courselist)
    return courselist
  }
  @req()
  async getProgress ({user}: IParams) {
    if (!user || user.role.name !== 'teacher') {
      throw new APIError(106)
    }
    let connection = await getConnection()
    let courselistRepo = await connection.getRepository(CourseListModel)
    let courselist = await courselistRepo.findOne({}, {
      alias: 'list',
      leftJoinAndSelect: {
        teacher: 'list.teacher',
        course: 'list.course',
        students: 'list.students'
      },
      whereConditions: {
        'teacher.uid': user.uid
      }
    })
    return [courselist.activeUnit, courselist.totalUnit]
  }
  @req()
  async createProgress ({user, total}: IParams) {
    if (!user || user.role.name !== 'teacher') {
      throw new APIError(106)
    }
    let connection = await getConnection()
    let courselistRepo = await connection.getRepository(CourseListModel)
    let courselist = await courselistRepo.findOne({}, {
      alias: 'list',
      leftJoinAndSelect: {
        teacher: 'list.teacher',
        course: 'list.course',
        students: 'list.students'
      },
      whereConditions: {
        'teacher.uid': user.uid
      }
    })
    courselist.activeUnit = 0
    courselist.totalUnit = total
    await courselistRepo.persist(courselist)
    return [courselist.activeUnit, courselist.totalUnit]
  }
  @req()
  async getStudentProgress ({user}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    let connection = await getConnection()
    let userRepo = await connection.getRepository(User)
    let u = await userRepo.findOne({}, {
      alias: 'user',
      leftJoinAndSelect: {
        learn: 'user.learncourses'
      },
      whereConditions: {
        'user.uid': user.uid
      }
    })
    console.log(u)
    if (u.learncourses.length) {
      return [u.learncourses[0].activeUnit, u.learncourses[0].totalUnit]
    } else {
      return [0]
    }
  }
  @req()
  async getCourseList ({user}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    let connection = await getConnection()
    let courselistRepo = await connection.getRepository(CourseListModel)
    let courselists = await courselistRepo.find({}, {
      alias: 'list',
      leftJoinAndSelect: {
        teacher: 'list.teacher',
        course: 'list.course',
        students: 'list.students'
      }
    })
    for (let courselist of courselists) {
      delete courselist['students']
      delete courselist.teacher.password
    }
    return courselists
  }
  @req() 
  async addStudent ({user, cid}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    console.log(cid)
    let connection = await getConnection()
    let courselistRepo = await connection.getRepository(CourseListModel)
    let courselist = await courselistRepo.findOne({}, {
      alias: 'list',
      leftJoinAndSelect: {
        teacher: 'list.teacher',
        course: 'list.course',
        students: 'list.students'
      },
      whereConditions: {
        'list.id': cid
      }
    })
    courselist.students.push(user)
    await courselistRepo.persist(courselist)
    return courselist
  }
}