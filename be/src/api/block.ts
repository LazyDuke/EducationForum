import {getConnection} from '../module/database'
import {Thread} from '../entity/Thread'
import { req, path, APIError, IParams } from './api'
import { User } from '../entity/User'
import { Block as BlockModel } from '../entity/Block'
import { Blocklist } from '../entity/Blocklist'
import { ThreadList } from '../entity/ThreadList'
import { Comment } from "../entity/Comment";
@path('/block')
export class Block {
  adminindentify (user: User) {
    if (user.role.name !== 'administrator') {
      throw new APIError(107)
    }
  }
  @req()
  async init () {
    let connection = await getConnection()
    let blockRepo = await connection.getRepository(BlockModel)
    let blocklistRepo = await connection.getRepository(Blocklist)
    let blocks = await blocklistRepo.createQueryBuilder('blocklist').leftJoinAndSelect('blocklist.blocks','blocks').getMany()
    return blocks
  }
  @req()
  async getblocklist ({user}: IParams) {
    this.adminindentify(user)
    let connection = await getConnection()
    let blocklistRepo = await connection.getRepository(Blocklist)
    let blocklist = await blocklistRepo.find({})
    return blocklist
  }
  @req()
  async getBlock ({user, blocklistname}: IParams) {
    let connection = await getConnection()
    let blockRepo = await connection.getRepository(BlockModel)
    let blocks = await blockRepo.find({}, {
      alias: 'block',
      leftJoinAndSelect: {
        blocklist: 'block.blocklist'
      },
      whereConditions: {
        'blocklist.name': blocklistname
      }
    })
    return blocks
  }
  @req()
  async createBlockList ({user, blocklistname}: IParams) {
    this.adminindentify(user)
    let connection = await getConnection()
    let blocklistRepo = await connection.getRepository(Blocklist)
    let blocklist = new Blocklist()
    console.log(blocklistname)
    blocklist.name = blocklistname
    blocklist.bid = Math.round((Math.random() * 10000))
    await blocklistRepo.persist(blocklist)
    return blocklist
  }
  @req()
  async createBlock ({user, blocklist, blockname, pic}: IParams) {
    this.adminindentify(user)
    let connection = await getConnection()
    let blockRepo = await connection.getRepository(BlockModel)
    let blocklistRepo = await connection.getRepository(Blocklist)
    let listRepo = await connection.getRepository(ThreadList)
    let block = new BlockModel()
    let list = new ThreadList()
    list.block = blockname
    block.blocklist = await blocklistRepo.findOne({'name': blocklist})
    block.pic = pic
    block.bid = Math.round(Math.random() * 100000)
    block.name = blockname
    await blockRepo.persist(block)
    await listRepo.persist(list)
    return block
  }
  @req()
  async deleteBlockList ({user, bid}: IParams) {
    if (user.role.name !== 'administrator') {
      throw new APIError(107)
    }
    let connection = await getConnection()
    let blocklistRepo = await connection.getRepository(Blocklist)
    let listRepo = await connection.getRepository(ThreadList)
    let blocklist = await blocklistRepo.findOne({}, {
      alias: 'blocklist',
      leftJoinAndSelect: {
        blocks: 'blocklist.blocks'
      },
      whereConditions: {
        'blocklist.id': bid
      }
    })
    let blockRepo = await connection.getRepository(BlockModel)
    let threadRepo = await connection.getRepository(Thread)
    if (blocklist.blocks.length) {
      for (let j in blocklist.blocks) {
        let block = blocklist.blocks[j]
        let threads = await threadRepo.find({}, {
          alias: 'thread',
          leftJoinAndSelect: {
            list: 'thread.list',
            commemts: 'thread.comments'
          },
          whereConditions: {
            'list.block': block.name
          }
        })
        if (threads.length) {
          for (let index in threads) {
            let thread = threads[index]
            if (thread.comments.length) {
              let coRepo = await connection.getRepository(Comment)
              for (let i in thread.comments) {
                try {
                  let comment = thread.comments[thread.comments.length - Number.parseInt(i) - 1]
                  await coRepo.remove(comment)
                } catch (e) {
                  throw new APIError(e)
                }
              }
            }
          }
          await threadRepo.remove(threads)
        }
        let list = await listRepo.findOne({'block': block.name})
        if (list) {
          await listRepo.remove(list)
        }
        await blockRepo.remove(block)
      }
    }
    await blocklistRepo.remove(blocklist)
    return
  }
  @req()
  async deleteBlock ({user, bid}: IParams) {
    this.adminindentify(user)
    let connection = await getConnection()
    let blockRepo = await connection.getRepository(BlockModel)
    let threadRepo = await connection.getRepository(Thread)
    let block = await blockRepo.findOneById(bid)
    let listRepo = await connection.getRepository(ThreadList)
    let threads = await threadRepo.find({}, {
      alias: 'thread',
      leftJoinAndSelect: {
        list: 'thread.list',
        commemts: 'thread.comments'
      },
      whereConditions: {
        'list.block': block.name
      }
    })
    if (threads.length) {
      for (let thread of threads) {
        if (thread.comments.length) {
          let coRepo = await connection.getRepository(Comment)
          if (thread.comments.length) {
            let coRepo = await connection.getRepository(Comment)
            for (let i in thread.comments) {
              try {
                let comment = thread.comments[thread.comments.length - Number.parseInt(i) - 1]
                await coRepo.remove(comment)
              } catch (e) {
                throw new APIError(e)
              }
            }
          }
        }
      }
      await threadRepo.remove(threads)
      console.log('thread delete success')
    }
    let list = await listRepo.findOne({'block': block.name})
    if (list) {
      await listRepo.remove(list)
    }
    await blockRepo.remove(block)
    console.log('block delete success')
    return
  }
}
