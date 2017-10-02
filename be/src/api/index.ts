import * as Router from 'koa-router'
import {getRouter} from './api'
import './user'
import './threads'
import './notify'
import './block'
import './comment'
import './admin'
import './file'
import './course'
import './homework'
import './message'
import './courseList'
const router = new Router()
router.get('/', ctx => {
  ctx.body = 'Hello world'
})
router.use(getRouter())
export default router.routes()
