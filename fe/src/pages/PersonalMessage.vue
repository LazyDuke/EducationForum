<template>
  <div>
    <el-row>
      <el-col :span="24">
        <home-nav-bar></home-nav-bar>
      </el-col>
    </el-row>
    <el-row>
      <el-button style="margin-top: 30px; margin-bottom: 30px; float: left;" @click="$router.go(-1)" icon="arrow-left">返回</el-button>
    </el-row>
    <el-row type="flex" justify="center" :gutter="20">
      <el-col :span="5">
        <el-card class="avatar">
          <el-row>
            <el-col :span="24">
              <router-link to="/" tag="img" :src="user.userImg" height="100" width="100" style="cursor: pointer;"></router-link>
            </el-col>
            <el-row>
              <el-col :span="24">
                <el-row class="username">
                  <el-button type="text">{{user.userName}}</el-button>
                </el-row>
                <el-row class="buttongroup" align="middle" type="flex" justify="space-around">
                  <el-col :span="12" :push="1">
                    <el-button type="danger" icon="plus" size="small">关注</el-button>
                  </el-col>
                  <el-col :span="12" :pull="1">
                    <el-button type="info" icon="message" size="small" @click="dialogFormVisible = true">私信</el-button>
                    <el-dialog title="私信" :visible.sync="dialogFormVisible">
                      <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="sendMessage"></el-input>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="dialogFormVisible = false">取 消</el-button>
                      <el-button type="primary" @click="send()">确 定</el-button>
                    </div>
                  </el-dialog>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="15">
        <el-row style="margin-bottom: 25px">
          <el-card class="personal-data">
            <div slot="header">
              <span class="title">个人资料</span>
            </div>
            <el-row type="flex" justify="space-between" align="middle" :gutter="20">
              <el-col>
                <el-row class="data">用户名：{{ user.userName }}</el-row>
                <el-row class="data">Email：{{ user.email }}</el-row>
                <el-row class="data">院校：{{ user.institude }}</el-row>
                <el-row class="data">地址{{ user.location }}</el-row>
              </el-col>
              <el-col>
                <el-row class="data">性别：{{ user.gender }}</el-row>
                <el-row class="data">手机：{{ user.phone }}</el-row>
                <el-row class="data">角色：{{ user.role }}</el-row>
                <el-row class="data">邮编：{{ user.post }}</el-row>
              </el-col>
            </el-row>
          </el-card>
        </el-row>
        <el-row style="margin-top: 25px">
          <el-card>
            <div slot="header">
              <span class="title">动 态</span>
            </div>
            <el-row v-for="(postedThread, index) in user.postedThreads" :key="postedThread">
              <span style="color: #58B7FF">{{ user.userName }}</span>
              于{{ postedThread.date }}发表了帖子
              <el-button type="text" @click="$router.push({name: 'SinglePost', params: { threadid: postedThread.id }})">{{ postedThread.caption }}</el-button>
            </el-row>
          </el-card>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import HomeNavBar from '@/components/shared/HomeNavBar'
import { User, Message } from '@/service'
@Component({
  components: {
    HomeNavBar
  }
})
export default class PersonalMessage extends Vue {
  // 可通过this.$router.params.username获得用户名
  user = {
    userImg: require('@/assets/avatar.png'),
    userName: '懒成铁',
    gender: '男',
    email: '429881302@qq.com',
    phone: '15659732087',
    role: '学生',
    location: '福州大学生活一区1#408',
    institude: '福州大学',
    post: '353108',
    postedThreads: [
    ]
  }
  dialogTableVisible = false

  dialogFormVisible = false
  sendMessage = ''

  async mounted () {
    let ret = await User.getPersonalInfo(this.$route.params.username)
    let u = ret.body[0]
    this.user.userImg = u.pic
    this.user.email = u.email
    this.user.gender = u.gender
    this.user.institude = u.institude
    this.user.location = u.location
    this.user.post = u.post
    this.user.phone = u.phone
    this.user.userName = u.username
    for (let thread of ret.body[1]) {
      this.user.postedThreads.push({caption: thread.title, id: thread.id, date: thread.time})
    }
  }
  async send () {
    // 发送私信逻辑
    try {
      await Message.sendToUsername(this.user.userName, this.sendMessage)
      this.$alert('发送成功')
      this.dialogFormVisible = false
    } catch (e) {
      this.$alert(e.message)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.data {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
