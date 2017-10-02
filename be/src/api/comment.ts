import { getConnection } from '../module/database'
import { Thread as ThreadModel, Status } from '../entity/Thread'
import { req, path, APIError, IParams } from './api'
import { User } from '../entity/User'
import { Comment as CommentModel } from '../entity/Comment'
@path('/comment')
export class Comment {
  @req()
  async newComment ({content, threadid, citeid, user}: IParams) {
    let connection = await getConnection()
    let commentRepo = await connection.getRepository(CommentModel)
    let thRepo = await connection.getRepository(ThreadModel)
    let comment = new CommentModel()
    if (!user) {
      throw new APIError(106)
    }
    comment.username = user.username
    comment.uid = user.uid
    comment.pic = user.pic
    comment.content = content
    let thread = await thRepo.findOneById(threadid, {
      alias: 'thread',
      leftJoinAndSelect: {
        comments: 'thread.comments'
      }
    })
    // comment.thread = thread
    thread.replies ++
    let date = new Date()
    comment.time = date.toLocaleString()
    if (citeid !== -1) {
      let cite = await commentRepo.findOneById(citeid)
      comment.cite = cite
    }
    thread.comments.push(comment)
    await thRepo.persist(thread)
    return comment
  }
  @req()
  async getComment ({threadid, index, pagesize}: any) {
    let connection = await getConnection()
    let thRepo = await connection.getRepository(ThreadModel)
    let commentRepo = await connection.getRepository(CommentModel)
    let th = await thRepo.findOneById(threadid, {
      alias: 'thread',
      leftJoinAndSelect: {
        comments: 'thread.comments'
      }
    })
    th.views ++
    await thRepo.persist(th)
    if (th.status !== Status.checked) {
      throw new APIError(103)
    }
    let comments = await commentRepo.findAndCount({}, {
      alias: 'comment',
      firstResult: index * pagesize,
      maxResults: pagesize,
      leftJoinAndSelect: {
        thread: 'comment.thread',
        cite: 'comment.cite'
      },
      whereConditions: {
        'thread.id': threadid
      }
    })
    return [th, comments]
  }
}
