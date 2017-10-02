import {delay} from './utils'
import axios from 'axios'
import shared from './shared'

axios.defaults.withCredentials = true
// const ServerBase = '/api'
let ServerBase = '/api'
if (process.env.NODE_ENV === 'development') {
  ServerBase = 'http://localhost:4000/api'
}
export { ServerBase }
class ServiceError extends Error {

}
class APIError extends Error {

}
async function apiCall (path, data = {}) {  // 统一调用后台api
  let res = await axios.post(`${ServerBase}${path}`, data)
  if (res.status === 200) {
    const data = res.data
    if (data.code === 0) {
      return data
    } else {
      throw new APIError(data.msg)
    }
  } else {
    throw new ServiceError('网络或服务器出错')
  }
}

export class User {
  static async login (username, password) { // 登录api
    let ret = await apiCall('/user/login', {
      username, password
    })
    // 对shared的赋值放在这里
    return ret
  }
  static async logout () {  // 登出
    let ret = await apiCall('/user/logout')
    shared.resetUser()
    return ret
  }
  static register (form, cid) { // 注册
    return apiCall('/user/register', {form, cid})
  }

  static init () { // 页面初始化api,通过shared.init()调用
    return apiCall('/user/init')
  }
  static infoupdate (uid, info) {  // 更改个人信息
    return apiCall('/user/updateinfo', {uid, info})
  }
  static pwupdate (uid, password) { // 更改密码
    return apiCall('/user/updatepw', {uid, password})
  }
  static checkunique (username, uid) { // 验证唯一性
    return apiCall('/user/checkunique', {
      username, uid
    })
  }
  static getPersonalInfo (username) {
    return apiCall('/user/getPersonalInfo', {
      username
    })
  }
}
export class Notify {
  static create (cid, caption, content, date) { // 发布通知
    return apiCall('/notify/create', {
      cid, caption, content, date
    })
  }
  static delete (caption) { // 删除通知
    return apiCall('/notify/delete', {
      caption
    })
  }
  static getnotify (cid) { // 获取通知
    return apiCall('/notify/getnotify', {
      cid
    })
  }
}
export class Block {
  static init () {
    return apiCall('/block/init')
  }
  static getblocklist () {
    return apiCall('/block/getblocklist')
  }
  static createBlockList (blocklistname) {
    return apiCall('/block/createBlockList', {
      blocklistname
    })
  }
  static createBlock (blocklist, blockname, pic) {
    return apiCall('/block/createBlock', {
      blocklist, blockname, pic
    })
  }
  static deleteBlockList (bid) {
    return apiCall('/block/deleteBlockList', {
      bid
    })
  }
  static deleteBlock (bid) {
    return apiCall('/block/deleteBlock', {
      bid
    })
  }
  static getBlock (blocklistname) {
    return apiCall('/block/getBlock', {
      blocklistname
    })
  }
}
export class Thread {
  static async getthread (block, index, pagesize) {
    return apiCall('/thread/getthread', {block, index, pagesize})
  }
  static newthread (title, content, block) {
    return apiCall('/thread/newthread', {title, content, block})
  }
  static countThreads (block) {
    return apiCall('/thread/countThreads', {
      block
    })
  }
  static getPersonalThread () {
    return apiCall('/thread/getPersonalThread', {})
  }
  static getHotThread () {
    return apiCall('/thread/hotthread', {})
  }
}

export class Comment {
  static async getComment (threadid, index, pagesize) {
    return await apiCall('/comment/getComment', {threadid, index, pagesize})
  }
  static async newComment (content, threadid, citeid) {
    return await apiCall('/comment/newComment', {
      content, threadid, citeid
    })
  }
}
export class Admin {
  static getAccount (role) {
    return apiCall('/admin/getAccount', {role})
  }
  static delete (uid) {
    return apiCall('/admin/deleteAccount', {uid})
  }
  static getthreads () {
    return apiCall('/admin/getthreads', {})
  }
  static accessThread (id) {
    return apiCall('/admin/accessThread', {
      id
    })
  }
  static addElite (id) {
    return apiCall('/admin/addElite', {
      id
    })
  }
  static deleteElite (id) {
    return apiCall('/admin/deleteElite', {
      id
    })
  }
  static deleteThread (id, reason) {
    return apiCall('/admin/deleteThread', {
      id, reason
    })
  }
  static restoreThread (id) {
    return apiCall('/admin/restoreThread', {
      id
    })
  }
  static getPreview (id) {
    return apiCall('/admin/getPreview', {
      id
    })
  }
}
export class File {
  static getFile (path) {
    return apiCall('/file/getfile', {path})
  }
  static download (filename, path) {
    return apiCall('/uploadfile/download', {filename, path})
  }
  static deletefile (filename, path) {
    return apiCall('/file/deletefile', {filename, path})
  }
}
export class Message {
  static init () {
    return Message.unread()
  }
  static async unread () {
    shared.message.unread = 0
    let ret = await apiCall('/message/unread')
    shared.message.unread = ret.body.unread
    return ret
  }
  static async list () {
    shared.message.list = []
    let ret = await apiCall('/message/list')
    shared.message.list = ret.body
    return ret
  }
  static async getMessages (senderId) {
    let ret = await apiCall('/message/getMessages', { otherUserId: senderId })
    return ret.body
  }
  static async send (receiver, content) {
    let ret = await apiCall('/message/send', {receiver, content})
    return ret
  }
  static async sendToUsername (username, content) {
    let ret = await apiCall('/message/send', {username, content})
    return ret
  }
}
export class Homework {
  static create (title, date, cid) {
    return apiCall('/homework/create', {title, date, cid})
  }
  static gethomework (cid) {
    return apiCall('/homework/gethomework', {cid})
  }
  static handinhomework (filename, hwid, cid, date) {
    return apiCall('/homework/handinhomework', {
      filename, hwid, cid, date
    })
  }
  static remark (id, rate) {
    return apiCall('/homework/remark', {
      id, rate
    })
  }
  static getfilesbyid (hwid, cid) {
    return apiCall('/homework/getfilesbyid', {
      hwid, cid
    })
  }
  static getallfiles (title, cid) {
    return apiCall('/homework/getallfiles', {
      title, cid
    })
  }
}
export class CourseList {
  static getProgress () {
    return apiCall('/courselist/getProgress')
  }
  static mendProgressing (active) {
    return apiCall('/courseList/mendProgressing', {
      active
    })
  }
  static createProgress (total) {
    return apiCall('/courseList/createProgress', {
      total
    })
  }
  static getStudentProgress () {
    return apiCall('/courseList/getStudentProgress', {})
  }
  static getCourseList () {
    return apiCall('/courseList/getCourseList', {})
  }
  static addStudent (cid) {
    return apiCall('/courseList/addStudent', {
      cid
    })
  }
}
export async function asyncExample () {
  await delay(2000)
  return [
    {
      title: 'll1',
      content: '越来越多分析师认为今年的 iPhone 售价会超过 1000 美元，昨天就有分析师提到钴价格的飙升会引发一连串的反应，现在看来，这个看法很有可能会成真。iPhone 新的设计和功能将会迫使苹果需要在组件上花费更多的成本，遗憾的是，与这些新设计和功能相关的组件，今年价格都在不断上升。不过 iPhone 的粉丝也用不着唉声叹气，因为分析师提到，今年售价超过 1000 美元的手机或许不止 iPhone 一部。'
    }
  ]
}
