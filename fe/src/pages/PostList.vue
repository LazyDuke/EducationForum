<template>
  <div>
    <el-row>
      <el-col :span="24">
        <home-nav-bar></home-nav-bar>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-breadcrumb style="font-size: 20px; margin: 30px;">
          <el-breadcrumb-item :to="{path: '/board'}">{{ thread.list }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ thread.blockname }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="12">
        <div class="thread-button">
          <el-button icon="edit" type="primary" size="large" @click="onthread">发表帖子</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="22" v-loading='loading' element-loading-text='玩命加载中'>
        <div class="loading" v-if="loading"></div>
        <el-row type="flex" justify="center" align="middle" class="header">
          <el-col :span="5">
            <div>
              <span>发帖时间</span>
            </div>
          </el-col>
          <el-col :span="14">
            <p>主题</p>
          </el-col>
          <el-col :span="5">
            <div>
              <p>用户</p>
            </div>
          </el-col>
          <el-col :span="5">
            <div>
              <p>回复量/浏览量</p>
            </div>
          </el-col>
        </el-row>
        <div class="threadlist" v-for="(thread, index) in threads" :key="thread">
          <el-row type="flex" justify="center" align="middle">
            <el-col :span="5">
              <div>
                <el-icon name="time"></el-icon>
                <span>{{ thread.time }}</span>
              </div>
            </el-col>
            <el-col :span="14">
              <el-tag type="danger" v-if="thread.elite">精</el-tag><el-button type="text" @click="post(thread.id)">{{ thread.caption }}</el-button>
            </el-col>
            <el-col :span="5">
              <div>
                <el-button type="text" @click="$router.push({name: 'PersonalMessage', params: { username: thread.username }})">{{ thread.username }}</el-button>
              </div>
            </el-col>
            <el-col :span="5">
              <div>
                <p>{{ thread.replies }}/{{ thread.views }}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pageNation.currentPage"
          :page-size="pageNation.pagesize"
          layout="total, prev, pager, next, jumper"
          :total="pageNation.total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import HomeNavBar from '@/components/shared/HomeNavBar'

import { Thread, User } from '@/service'
@Component({
  components: {
    HomeNavBar
  }
})
export default class PostList extends Vue {
  data () {
    return {
      thread: {
        list: '',
        blockname: ''
      },
      pageNation: {
        total: 0,
        currentPage: 1,
        pagesize: 10
      },
      threads: []
    }
  }
  async onthread () { // 发帖
    try {
      await User.init()
      this.$router.push({name: 'Post', params: { blockname: this.thread.blockname }})
    } catch (e) {
      this.$alert(e.toString())
      this.$router.push('/')
    }
  }
  async handleCurrentChange (currentPage) {
    this.loading = true
    let ret = await Thread.getthread(this.thread.blockname, currentPage - 1, this.pageNation.pagesize)
    this.threads.splice(0, this.threads.length)
    for (let index in ret.body[0]) {
      let thread = ret.body[0][index]
      let th = {
        caption: '',
        time: '',
        elite: false,
        username: '',
        id: '',
        replies: 0,
        views: 0,
        status: 0
      }
      th.caption = thread.title
      th.username = thread.username
      th.elite = thread.elite
      th.time = thread.time
      th.id = thread.id
      th.replies = thread.replies
      th.views = thread.views
      this.loading = false
      this.threads.push(th)
    }
    this.loading = false
  }
  loading = true
  async mounted () {  // 初始化贴子列表
    try {
      let block = this.$route.params.block.split(' ')
      this.thread.list = block[0]
      this.thread.blockname = block[1]
      let param = await Thread.countThreads(this.thread.blockname)
      this.pageNation.total = param.body[0]
      this.pageNation.pagesize = param.body[1]
      let result = await Thread.getthread(this.thread.blockname, this.pageNation.currentPage - 1, this.pageNation.pagesize)
      if (this.pageNation.total === 0) {
        this.loading = false
        return
      }
      for (let index in result.body[0]) {
        let thread = result.body[0][index]
        let th = {
          caption: '',
          time: '',
          elite: false,
          username: '',
          id: '',
          replies: 0,
          views: 0,
          status: 0
        }
        th.caption = thread.title
        th.username = thread.username
        th.elite = thread.elite
        th.time = thread.time
        th.id = thread.id
        th.replies = thread.replies
        th.views = thread.views
        this.loading = false
        this.threads.push(th)
      }
    } catch (error) {
      this.$alert('未知的错误发生了，请稍后重试')
      console.log(error)
      this.loading = false
    }
  }
  post (id) { // 跳转到贴子页面
    // this.$router.push('/singlepost/' + id)
    this.$router.push({name: 'SinglePost', params: { threadid: id }})
  }
}
</script>

<style scpoed>

.threadlist {
  border-bottom-style: solid;
  border-bottom-color: #E5E9F2;
}

.thread-button {
  margin-top: 20px;
  float: right;
  margin-right: 30px;
}
.loading {
  display: block;
  height: 100px;
}
.loading:before {
  content: " ";
}
.header {
  font-size: 14px;
}
</style>

