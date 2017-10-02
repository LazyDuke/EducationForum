import { User } from './../entity/User'
import * as Koa from 'koa'
import { IParams } from '../api/api'
import { getConnection } from './database'

function UserMiddleware (paramMap: WeakMap<Koa.Context, IParams>) {
  return async (ctx: Koa.Context, next: () => Promise<any>) => {
    const connection = await getConnection()
    const repo = connection.getRepository(User)
    const param = paramMap.get(ctx)
    param.user = null
    if (ctx.session.user_id) {
      param.user = await repo.findOne({
        id: ctx.session.user_id
      }, {
        alias: 'user',
        leftJoinAndSelect: {
          role: 'user.role'
        }
      })
    }
    await next()
    // console.log(param.user)
    if (param.user) {
      ctx.session.user_id = param.user.id
    } else {
      delete ctx.session.user_id
    }
  }
}

export {
  User,
  UserMiddleware
}
