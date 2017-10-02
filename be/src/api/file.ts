import { req, path, APIError, IParams, file, execfile } from './api'
import { User } from '../entity/User'
import {getConnection} from '../module/database'
import {config} from '../module/config'
import retcode from './retcode'
import { Role } from '../entity/Role'
let fs = require('fs')
@path('file')
@file('uploadfile/')
export class File {
  @execfile('upload')
  upload ({path, user}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    return path
  }
  @req()
  async getfile ({path, user}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    let p = 'uploadfile/' + path
    let filegroup: any = []
    let files = await fs.readdirSync(p)
    for (let file in files) {
      let perfile = {
        isDirectory: false,
        file: new Object(),
        date: ''
      }
      let stat = fs.lstatSync(p + files[file])
      let time: Date = stat.birthtime
      perfile.date = time.toLocaleDateString()
      perfile.isDirectory = stat.isDirectory()
      perfile.file = files[file]
      filegroup.push(perfile)
    }
    return filegroup
  }
  @execfile('download')
  async download ({filename, path, user}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    return path + decodeURI(filename)
  }
  @req()
  async deletefile ({filename, path, user}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    let p = 'uploadfile/' + path + filename
    let isExist = await fs.existsSync(p)
    console.log(isExist)
    try {
      if (isExist) {
        await fs.unlinkSync(p)
      }
    } catch (e) {
      console.log(e)
      throw new APIError(101)
    }
  }
}
