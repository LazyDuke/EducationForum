import { req, path, APIError, IParams, file, execfile } from './api'
import { User } from '../entity/User'
import {getConnection} from '../module/database'
import {config} from '../module/config'
import retcode from './retcode'
import { Role } from '../entity/Role'
import { HomeWork as HomeworkModel } from '../entity/Homework'
import { HomeWorkFile } from "../entity/HomeWorkFile";
import { Course } from "../entity/Course";

let fs = require('fs')
@path('homework')
export class Homework {

  @req()
  async create ({user, title, date, cid}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    let connnection = await getConnection()
    let hwRepo = await connnection.getRepository(HomeworkModel)
    let hw = new HomeworkModel()
    let courseRepo = await connnection.getRepository(Course)
    hw.title = title
    hw.cid = cid
    hw.date = date
    try {
      if (!await fs.existsSync('uploadfile/software/' + hw.title + '/')) {
        await fs.mkdirSync('uploadfile/software/' + hw.title + '/')
        console.log('创建成功')
      } else {
        console.log('文件夹已存在')
      }
    } catch (e) {
      console.error(e)
    }
    await hwRepo.persist(hw)
    return
  }
  @req()
  async getallfiles ({user, title, cid}: IParams) {
    if (!user || user.role.name !== 'teacher') {
      throw new APIError(107)
    }
    let connection = await getConnection()
    let hwfileRepo = await connection.getRepository(HomeWorkFile)
    let files = await hwfileRepo.find({}, {
      alias: 'files',
      leftJoinAndSelect: {
        homework: 'files.homework'
      },
      whereConditions: {
        'homework.cid': cid,
        'homework.title': title   // 这也算是一个bug吧，毕竟难免是重名的作业，先放着
      }
    })
    return files
  }
  @req()
  async getfilesbyid ({user, hwid, cid}: IParams) {
    let connection = await getConnection()
    let hwfileRepo = await connection.getRepository(HomeWorkFile)
    let files = await hwfileRepo.find({}, {
      alias: 'files',
      leftJoinAndSelect: {
        homework: 'files.homework'
      },
      whereConditions: {
        'homework.cid': cid,
        'homework.id': hwid,
        'files.uid': user.uid
      }
    })
    return files
  }
  @req()
  async gethomework ({user, cid}: IParams) {
    let connection = await getConnection()
    let hwRepo = await connection.getRepository(HomeworkModel)
    let hwfileRepo = await connection.getRepository(HomeWorkFile)
    let hws = await hwRepo.find({'cid': cid})
    return hws
  }
  @req()
  async handinhomework ({filename, hwid, cid, date, user}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    try {
      let connection = await getConnection()
      let hwfileRepo = await connection.getRepository(HomeWorkFile)
      let hwRepo = await connection.getRepository(HomeworkModel)
      let hw = await hwRepo.findOne({'cid': cid})
      let ret = await hwfileRepo.findOne({}, {
        alias: 'homeworkfile',
        whereConditions: {
          'homeworkfile.hwid': hwid,
          'homeworkfile.uid': user.uid
        }
      })
      if (ret) {  // 已上传过作业，删除原来的
        if (await fs.existsSync('uploadfile/software/' + hw.title + '/' + ret.filename)) {
          await fs.unlink('uploadfile/software/' + hw.title + '/' + ret.filename)
        }
        ret.filename = filename
        ret.date = date
        await hwfileRepo.persist(ret)
        return ret
      } else {
        let hwfile = new HomeWorkFile()
        hwfile.filename = filename
        hwfile.hwid = hwid
        hwfile.uid = user.uid
        hwfile.homework = hw
        hwfile.date = date
        let result = await hwfileRepo.persist(hwfile)
        return result
      }
    } catch (e) {
      console.error(e)
      throw new APIError(101)
    }
  }
  @req()
  async remark ({id, rate, user}: IParams) {
    let connection = await getConnection()
    let hwfileRepo = await connection.getRepository(HomeWorkFile)
    let hwfile = await hwfileRepo.findOneById(id)
    hwfile.rate = rate
    hwfileRepo.persist(hwfile)
    return hwfile
  }
}
