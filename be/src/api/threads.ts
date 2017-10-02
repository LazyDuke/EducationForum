import {getConnection} from '../module/database'
import {Thread as ThreadModel, Status} from '../entity/Thread'
import { req, path, APIError, IParams} from './api'
import { ThreadList } from '../entity/ThreadList'
import { User } from '../entity/User'
import { Comment } from '../entity/Comment'
import { Block } from '../entity/Block'
@path('/thread')
export class Thread {
  @req()
  async countThreads ({block}: any) {
    let connection = await getConnection()
    let threpository = await connection.getRepository(ThreadModel)
    let count = await threpository.count({
      alias: 'thread',
      leftJoinAndSelect: {
        list: 'thread.list'
      },
      whereConditions: {
        'list.block': block
      },
      where: 'thread.status < 1'
    })
    console.log(count)
    let pagesize = 10
    let totalpages = Math.ceil(count / pagesize)
    return [count, pagesize, totalpages]
  }
  @req()
  async hotthread () {
    let connection = await getConnection()
    let thread = new ThreadModel()
    let threpository = connection.getRepository(ThreadModel)
    let re = await threpository.find({}, {
      alias: 'thread',
      where : 'thread.status < 1'
    })
    re = re.sort((a, b) => a.replies - b.replies)
    re = re.slice(0,8)
    // console.log(re)
    // console.log(JSON.stringify(re))
    return re
  }
  @req()
  async getthread ({block, index, pagesize}: any) {
    let connection = await getConnection()
    let threpository = await connection.getRepository(ThreadModel)
    let result = await threpository.find({}, {
      alias: 'thread',
      firstResult: index * pagesize,
      maxResults: pagesize,
      leftJoinAndSelect: {
        list: 'thread.list'
      },
      where: 'thread.status < 1',
      whereConditions: {
        'list.block': block
      }
    })
    return [result]
  }
  @req()
  async newthread ({title, content, block, user}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    let connection = await getConnection()
    let threpository = await connection.getRepository(ThreadModel)
    let listrepository = await connection.getRepository(ThreadList)
    let userrepository = await connection.getRepository(User)
    let th = new ThreadModel()
    th.content = content
    let list = await listrepository.findOne({block: block})
    th.list = list
    th.replies = 0
    let date = new Date()
    th.time = date.toLocaleString()
    th.title = title
    th.username = user.username
    th.pic = user.pic
    th.uid = user.uid
    th.views = 0
    th.status = Status.checking
    await threpository.persist(th)
    return
  }
  @req()
  async getPersonalThread ({user}: IParams) {
    if (!user) {
      throw new APIError(106)
    }
    let connection = await getConnection()
    let thRepo = await connection.getRepository(ThreadModel)
    let threads = await thRepo.find({'username': user.username})
    return threads
  }
}
