import 'reflect-metadata'
import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import * as KoaSession from 'koa-session-minimal'
import api from './api'
import {getConnection} from './module/database'
import {config} from './module/config'
import {TypeormSessionStore} from './module/typeorm-session-store'
import {Role} from './entity/Role'
import { User } from './entity/User'

async function main () {
  const app = new Koa()
  const connection = await getConnection()
  app.use(logger())
  app.use(KoaSession({
    key: config.sessionKey,
    store: new TypeormSessionStore(connection)
  }))
  app.use(bodyParser())
  app.use(api)
  const port = config.port
  app.listen(port)
  console.log(`Server is running at http://localhost:${port}`)
}

main().catch(e => {
  console.error(e)
})
