import { User } from './../entity/User'
import 'reflect-metadata'
import retcode from './retcode'
import * as Router from 'koa-router'
import {UserMiddleware} from '../module/user-middleware'
const serverBase = 'http://localhost:8080'
const inspect = require('util').inspect
const p = require('path')
const os = require('os')
const fs = require('fs')
const Busboy = require('busboy')
const router = new Router()
const moduleMethods: Map<any, string[]> = new Map()
const SSubPath = 'api:subpath'
export class APIError {
  constructor (public code: number, public description: string = '', public body: any = null) {
    if (!description) {
      this.description = retcode[code]
    }
  }
}
class APIResponse {
  code: number
  msg: string
  body: any // default: {}
  constructor (body: any) {
    this.code = 0
    this.msg = ''
    this.body = body || {}
    if (body instanceof APIError) {
      this.code = body.code
      this.msg = body.description
      this.body = body.body
    }
  }
}
router.use(async function headerSet (ctx, next) {
  ctx.set('Access-Control-Allow-Origin', serverBase)
  ctx.set('Access-Control-Allow-Credentials','true')
  ctx.set('Access-Control-Allow-Methods','PUT,GET,POST')
  ctx.set('Content-Type','text/html; charset=utf-8; application/json')
  ctx.set('Access-Control-Allow-Headers','X-Custom-Header,content-type') // 响应头设置
  if (ctx.method === 'OPTIONS') {
    ctx.body = ''
  } else {
    await next()
  }
})
router.use(async function query2body (ctx, next) {
  if (ctx.method === 'GET') {
    ctx.request.body = ctx.query
  }
  return await next()
})
export interface IParams {
  [key: string]: any
  user?: User
  session?: any
  set (k: string, v: any): void
}

const paramMap = new WeakMap<Router.IRouterContext, IParams>()
router.use(async (ctx, next) => {
  let params: IParams = Object.assign({
    set (k: string, v: any) {
      params[k] = v
    }
  }, ctx.request.body)
  params.session = ctx.session
  paramMap.set(ctx, params)
  await next()
  ctx.session = params.session
})
router.use(UserMiddleware(paramMap))

class RequestOption {}
class AllowReqOpt extends RequestOption {
  constructor (public permissions: string[]) {
    super()
  }
}
class DisallowReqOpt extends RequestOption {
  constructor (public permissions: string[]) {
    super()
  }
}
export function AllowPermission (permissions: string[]): RequestOption {
  return new AllowReqOpt(permissions)
}
export function DisallowPermission (permissions: string[]) {
  return new DisallowReqOpt(permissions)
}
export function req (opts?: RequestOption | RequestOption[]) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(SSubPath, propertyKey, target, propertyKey)
    if (!Array.isArray(opts)) {
      opts = [opts]
    }
    Reflect.defineMetadata('opts', opts, target, propertyKey)
    if (!moduleMethods.get(target)) {
      moduleMethods.set(target, [])
    }
    moduleMethods.get(target).push(propertyKey)
  }
}
// let res = fs.readdirSync('src/api')
// console.log(res)
export function path (path: string) {
  return (ctor: any) => {
    const target = ctor.prototype
    const instance = new ctor()
    const methods = moduleMethods.get(target)
    if (!methods) {
      return
    }
    for (let method of methods) {
      let subpath = Reflect.getMetadata(SSubPath, target, method)
      router.all(path + '/' + subpath, async ctx => {
        let res: APIResponse
        try {
          let params: IParams = paramMap.get(ctx)
          let ret = instance[method](params)
          if (ret instanceof Promise) {
            ret = await ret
          }
          ctx.session = params.session
          res = new APIResponse(ret)
        } catch (e) {
          if (e instanceof APIError) {
            res = new APIResponse(e)
          } else {
            res = new APIResponse(new APIError(101))
            console.error(e)
          }
        }
        ctx.body = res
        console.log(res)
      })
    }
  }
}
export function execfile (opts: string) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(opts, propertyKey, target, propertyKey)
    if (!moduleMethods.get(target)) {
      moduleMethods.set(target, [])
    }
    moduleMethods.get(target).push(propertyKey)
  }
}
export function file (directory: string) {
  return (ctor: any) => {
    let instance = new ctor()
    let target = ctor.prototype
    let methods = moduleMethods.get(target)
    let res: APIResponse
    if (!methods) {
      return
    }
    for (let method of methods) {
      let downloadmethod = Reflect.getMetadata('download', target, method)
      let uploadmethod = Reflect.getMetadata('upload', target, method)
      if (downloadmethod) {
        router.all(directory + 'download', async ctx => {
          try {
            let params: IParams = paramMap.get(ctx)
            let file = instance[method](params)
            // if (typeof(file.filename) === 'undefined') {
            //   throw new APIError(101)
            // }
            if ( file instanceof Promise) {
              file = await file
            }
            console.log('file:' + file)
            directory = directory.replace('api/', '')
            console.log(directory)
            let filepath = directory + file
            console.log(filepath)
            file = file.split('/')
            ctx.set('Content-Disposition', 'attachment;filename*="' + encodeURIComponent(file[file.length - 1]) + '"')
            let data = await fs.readFileSync(filepath)
            console.log(data)
            ctx.body = data
            // let data = fs.createReadStream(filepath)
            // console.log(data)
            // data.pipe(ctx.res)
          } catch (e) {
            if (e instanceof APIError) {
              console.error(e)
              res = new APIResponse(e)
            } else {
              console.error(e)
              res = new APIResponse(101)
            }
            ctx.body = res
          }
        })
      } else if (uploadmethod) {
        router.all(directory + 'upload', async ctx => {
          ctx.body = res
          directory = directory.replace('api/', '')
          let busboy = new Busboy({
            headers: ctx.req.headers
          })
          let subdirectory = ''
          busboy.on('field', (fieldname: string, val: string) => {
            subdirectory += val
          })
          busboy.on('file', async (fieldname: string, file: any, filename: string) => {
          // 文件保存到制定路径
            console.log('开始上传至：' + subdirectory)
            if (!fs.existsSync(directory)) {
              console.log('文件夹不存在，创建文件夹')
              try {
                fs.mkdirSync(directory)
              } catch (e) {
                console.error(e)
              }
            }
            if (!fs.existsSync(directory + subdirectory)) {
              try {
                fs.mkdirSync(directory + subdirectory)
                console.log('创建成功')
              } catch (e) {
                console.error(e)
              }
            }
            file.pipe(fs.createWriteStream(directory + subdirectory + filename))
          // 文件写入事件结束
            file.on('end', function () {
              console.log('文件上传成功！')
            })
          })
          ctx.req.pipe(busboy)
        })
      }
    }
  }
}
export function getRouter () {
  return router.routes()
}
