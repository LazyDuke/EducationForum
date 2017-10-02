<template>
  <div>
    <el-row>
      <el-col :span="24">
        <home-nav-bar></home-nav-bar>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb style="font-size: 20px; margin: 30px;">
          <el-breadcrumb-item :to="{}">主版块</el-breadcrumb-item>
          <el-breadcrumb-item :to="{}">子版块</el-breadcrumb-item>
          <el-breadcrumb-item :to="{}"></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row align="middle" type="flex" justify="space-between">
      <el-col :span="3">
        <el-button icon="edit" type="primary" size="large" @click="toReply()">回复</el-button>
      </el-col>
    </el-row>
    <el-row class="post-starter">
     <el-col class="information" :span="3">
      <el-row clas="avatar">
        <el-col :span="24">
          <router-link to="/" tag="img" :src="thread.pic" height="100" width="100" style="cursor: pointer;"></router-link>
        </el-col>
        <el-row>
          <el-col :span="24">
            <el-row class="username">
              <el-tag type="danger" style="margin-right: 5px;">楼主</el-tag>
              <el-button type="text" @click="$router.push({name: 'PersonalMessage', params: { username: thread.username }})">{{ thread.username }}</el-button>
            </el-row>
            <el-row class="buttongroup" align="middle" type="flex" justify="space-around">
              <el-col :span="12" :push="1">
                <el-button type="danger" icon="plus" size="small">关注</el-button>
              </el-col>
              <el-col :span="12" :pull="1">
                <el-button type="info" icon="message" size="small" @click="openPM(thread.username)">私信</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-row>
     </el-col>
     <el-col class="post" :span="21" v-loading='loading'>
      <div class="loading" v-if="loading"></div>
      <el-row class="caption" type="flex" justify="start">
        <h1>{{ thread.title }}</h1>
      </el-row>
      <el-row class="content" type="flex" justify="start" style="margin-top:15px;" v-html="thread.content">
      </el-row>
      <el-row class="post-date" type="flex" justify="end" align="bottom" style="margin-top: 75px; margin-bottom: 15px;">
        <el-col :span="3">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">发表于{{ thread.time }}</span>
        </el-col>
      </el-row>
     </el-col>
    </el-row>
    <el-row class="post-followers" v-for="(comment, index) in comments" :key="comment">
      <el-col class="information" :span="3">
        <el-row clas="avatar">
          <el-col :span="24">
            <router-link to="/" tag="img" :src="comment.pic" height="100" width="100" style="cursor: pointer;"></router-link>
          </el-col>
          <el-row>
            <el-col :span="24">
              <el-row class="username">
                <el-tag v-if="false" type="danger" style="margin-right: 5px;">楼主</el-tag>
                <el-button type="text" @click="$router.push({name: 'PersonalMessage', params: { username: comment.username }})">{{ comment.username }}</el-button>
              </el-row>
              <el-row class="buttongroup" align="middle" type="flex" justify="space-around">
                <el-col :span="12" :push="1">
                  <el-button type="danger" icon="plus" size="small">关注</el-button>
                </el-col>
                <el-col :span="12" :pull="1">
                  <el-button type="info" icon="message" size="small" @click="openPM(comment.username)">私信</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
      <el-col class="post" :span="21">
        <el-row>
          <el-col>
            <el-button type="text" style="float: right" @click="reply(comment.id, comment.username)">回复</el-button>
          </el-col>
        </el-row>
        <el-row class="content" type="flex" justify="start">
          <div>
            <div v-if="comment.havingcite === true" class="quote">
            <blockquote>
              <font size='2'>
                <font color="#999999">{{comment.cite[0].username}}发表于{{ comment.cite[0].time }}</font>
              </font>
            <br><p v-html="comment.cite[0].content"></p>
            </blockquote>
            </div>
            <br>
            <p v-html="comment.content"></p>
            </div>
        </el-row>
        <el-row class="post-layer" type="flex" justify="end" align="bottom" style="margin-top: 70px; margin-bottom: 5px;">
          <el-col :span="3">
            <span style="margin-left: 10px"> #{{ index+1 }} </span>
          </el-col>
        </el-row>
        <el-row class="post-date" type="flex" justify="end" align="bottom" style="margin-top: 1px; margin-bottom: 15px;">
          <el-col :span="3">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">发表于{{ comment.time }}</span>
          </el-col>
        </el-row>
     </el-col>
    </el-row>
    <el-row align="middle" type="flex" justify="end">
      <el-col :span="6">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-size="pageNation.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pageNation.total"><!--从数据库取-->
        </el-pagination>
      </el-col>
    </el-row>
    <el-row class="reply" type="flex" justify="center" :gutter="50">
      <el-col class="reply-avatar" :span="3">
        <img :src="userpic" height="150" width="150">
      </el-col>
      <el-col class="quill-reply" :span="18">
        <el-row>
          <quill-editor
            class="quill-replyer"
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption">
          </quill-editor>
        </el-row>
        <el-row align="middle" type="flex" justify="end">
          <el-col :span="2">
            <el-button style="margin-top: 70px;"icon="edit" type="primary" @click="onReply">回复</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
     <el-dialog title="私信" :visible.sync="dialogFormVisible">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="sendMessage"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="send()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import HomeNavBar from '@/components/shared/HomeNavBar'
import { quillEditor } from 'vue-quill-editor'
import { Comment, Message } from '@/service'
import shared from '@/shared'
@Component({
  components: {
    HomeNavBar,
    quillEditor
  }
})
export default class SinglePost extends Vue {
  userImg = require('@/assets/avatar.png')
  content = ''
  loading = false
  userpic = ''

  dialogFormVisible = false
  sendMessage = ''

  editorOption = {
    placeholder: '请输入帖子内容...',
    theme: 'snow'
  }
  thread = {
    title: '',
    content: '',
    username: '',
    time: '',
    pic: ''
  }
  pageNation = {
    total: 0,
    pageSize: 15
  }
  citeid = -1
  comments = []
  replyuser = '' // 这个用来标记回复的对象，例如‘回复xxx：’，这个字符串在提交给后台时要去掉
  curPMUsername = ''
  openPM (username) {
    this.curPMUsername = username
    this.dialogFormVisible = true
  }
  get computedOption () {
    return this.editorOption
  }
  reply (commentid, username) {
    this.$refs.myQuillEditor.$el.querySelector('[contenteditable=true]').focus()
    this.citeid = commentid
    this.content = '回复' + username + '：'
    this.replyuser = this.content
  }
  async handleCurrentChange (currentPage) {
    try {
      this.loading = true
      this.comments.splice(0, this.comments.length)
      let ret = await Comment.getComment(this.$route.params.threadid, currentPage - 1, this.pageNation.pageSize)
      for (let index in ret.body[1][0]) {
        let comment = {
          id: 0,
          username: '',
          content: '',
          cite: [],
          time: '',
          pic: '',
          havingcite: false
        }
        let element = ret.body[1][0][index]
        comment.username = element.username
        comment.content = element.content
        comment.time = element.time
        comment.id = element.id
        comment.pic = element.pic
        if (typeof (element.cite) !== 'undefined') {
          let cite = {
            content: '',
            time: '',
            username: ''
          }
          cite.content = element.cite.content
          cite.time = element.cite.time
          cite.username = element.cite.username
          comment.havingcite = true
          comment.cite.push(cite)
        }
        this.comments.push(comment)
      }
    } catch (e) {
      console.error(e)
      this.$alert('未知的错误发生了')
    } finally {
      this.loading = false
    }
  }
  async mounted () {  // 初始化帖子内容。。。。这里有个超级大bug。。。。留着以后解决(已解决)
    this.loading = true
    this.userpic = shared.user.pic
    try {
      let ret = await Comment.getComment(this.$route.params.threadid, 0, this.pageNation.pageSize)
      this.thread.title = ret.body[0].title
      this.thread.content = ret.body[0].content
      this.thread.username = ret.body[0].username
      this.thread.time = ret.body[0].time
      this.thread.pic = ret.body[0].pic
      this.pageNation.total = ret.body[1][1]
      for (let index in ret.body[1][0]) {
        let comment = {
          id: 0,
          username: '',
          content: '',
          cite: [],
          time: '',
          pic: '',
          havingcite: false
        }
        let element = ret.body[1][0][index]
        comment.username = element.username
        comment.content = element.content
        comment.time = element.time
        comment.id = element.id
        comment.pic = element.pic
        if (typeof (element.cite) !== 'undefined') {
          let cite = {
            content: '',
            time: '',
            username: ''
          }
          cite.content = element.cite.content
          cite.time = element.cite.time
          cite.username = element.cite.username
          comment.havingcite = true
          comment.cite.push(cite)
        }
        this.comments.push(comment)
      }
    } catch (e) {
      console.error(e)
      this.$alert('未知的错误发生了')
    } finally {
      this.loading = false
    }
  }
  get editor () {
    return this.$refs.myQuillEditor.quill
  }
  async onReply () {
    try {
      this.content = this.content.replace(this.replyuser, '')
      let ret = await Comment.newComment(this.content, this.$route.params.threadid, this.citeid)
      if (ret.code === 0) {
        this.$alert('回复成功', {
          callback: action => {
            history.go(0)
          }
        })
      } else {
        this.$alert(ret.msg, {
          confirmButtonText: '确定',
          callback: action => {
            history.go(0)
          }
        })
      }
    } catch (e) {
      this.$alert(e.message, {
        callback: action => {
          this.$router.push('/')
        }
      })
    }
  }
  async send () {
    // 发送私信逻辑
    try {
      await Message.sendToUsername(this.curPMUsername, this.sendMessage)
      this.$alert('发送成功')
      this.dialogFormVisible = false
    } catch (e) {
      this.$alert(e.message)
    }
  }
  toReply () {
    this.$refs.myQuillEditor.$el.querySelector('[contenteditable=true]').focus()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.post-starter {
  margin-top: 30px;
  border-bottom-style: solid;
  border-bottom-color: #E5E9F2;
}

.post-followers {
  margin-top: 15px;
  border-bottom-style: solid;
  border-bottom-color: #E5E9F2;
}

.buttongroup {
  margin-bottom: 10px;
}

h1 {
  margin: 0;
}

.post {
  padding-left: 20px;
}

.content {
  text-align: left;
  font-size: 16px;
  margin-bottom: 15px;
}

.reply {
  margin-top: 30px;
}

.quill-editor {
  height: 300px;
}
.quote {
  display: block;
  width: 450%;
  background: #F9F9F9 url(http://bbs.tgbus.com/static/image/common/icon_quote_s.gif) no-repeat 20px 6px;
  padding: 10px 10px 10px 65px;
  border-bottom: 1px dashed #CDCDCD;
}
.quote blockquote {
  display: inline-block;
  margin: 0;
  padding: 0 65px 5px 0;
  background: url(http://bbs.tgbus.com/static/image/common/icon_quote_e.gif) no-repeat 100% 100%;
  line-height: 1.6;
}
.loading {
  display: block;
  height: 100px;
}
</style>
