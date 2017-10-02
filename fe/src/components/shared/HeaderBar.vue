<template>
  <header>
    <div class="container">
      <div class="logo">
        <router-link to="/">
          <img v-bind:src=fzuLogo class="image">
        </router-link>
      </div>
      <div class="login">
        <div v-if="isLogin === true">
          <div>
              <el-popover
                ref="detailPop"
                trigger="hover"
                width="150px"
                >
                <el-row type="flex" justify="center">
                  <el-button class="popver-option" type="text" size="small" @click="toHomepage">个人中心</el-button>
                </el-row>
                <el-row type="flex" justify="center">
                  <el-badge :value="messageNum">
                    <el-button class="popver-option" type="text" size="small" @click="message" style="color: #13CE66">消息</el-button>
                  </el-badge>
                </el-row>
                <el-row type="flex" justify="center">
                   <el-button class="popver-option" type="text" size="small" @click="logout" style="color: #FF4949">注销</el-button>
                </el-row>
              </el-popover>
              欢迎回来，{{ user.role }}<el-button style="font-size: 20px; margin: 0;padding: 0;" type="text" @click="toHomepage" v-popover:detailPop>{{ user.realname }}</el-button>
          </div>
        </div>
        <div v-else id="login-button">
          您好，<el-button type="text" style="font-size: 20px;" @click="loginVisible = true">请登录</el-button>
          <el-dialog
          title="登录"
          v-model="loginVisible"
          size="tiny">
            <login @loginsuccess="login"></login>   <!-- 登录窗口 -->
            <div class="tip"><i>没有账号？点此<a href="#" @click="onregister" class="tip">注册</a></i></div>
          </el-dialog>
          <el-dialog
          title="注册"
          v-model="registerVisible"
          size="tiny">      <!-- 注册窗口 -->
            <register @registsuccess="register" @cancelRegister="registerVisible = false"></register>
          </el-dialog>
        </div>
        <!--<div v-model="result">{{ result.data.body.User.id }}</div>                                    -->
      </div>
     </div>
    </div>
  </header>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import shared from '@/shared'
import { User } from '@/service'
import Login from '@/components/shared/Login'
import Register from '@/components/shared/Register'
@Component({
  components: {
    Login,
    Register
  },
  computed: {
    isLogin () {
      return shared.isLogin
    },
    messageNum () {
      return shared.message.unread
    }
  }
})
export default class HeaderBar extends Vue {
  data () {
    return {
      loginVisible: false,  // 登录dialog控制
      registerVisible: false, // 注册dialog控制
      messageNum2: 5 // 未读消息数量
    }
  }
  fzuLogo = require('@/assets/FzuLogo.jpg')
  user = {
    realname: '',
    role: ''
  }
  async created () {  // 页面加载钩子函数，获取初始化状态
    // await shared.init()
    this.user.realname = shared.user.realname
    this.user.role = shared.user.role
  }
  onregister () { // el-dialog控制
    this.loginVisible = false
    this.registerVisible = true
  }
  regisVisible = false
  loginVisible = false
  register () {
    this.registerVisible = false
    this.loginVisible = true
    alert('success' + this.registerVisible + this.loginVisible)
  }
  login () {  // 响应子组件发出的登录成功事件
    this.registerVisible = false
    this.loginVisible = false
    this.user.realname = shared.user.realname
    this.user.role = shared.user.role
    console.log(this.user.role)
  }
  async logout () { // 登出操作，并重置shared的
    await User.logout()
    // 要看请求请用开发者工具看 Network
    shared.resetUser()
    this.$router.push('/')  // 跳转到home页面
    history.go(0) // 重新加载页面
  }
  async toHomepage () { // 跳转判断页面
    if (shared.user.role === '教师') {
      this.$router.push({name: 'Teacher', params: { uid: shared.user.uid }})
    } else if (shared.user.role === '学生') {
      this.$router.push({name: 'Student', params: { uid: shared.user.uid }})
    } else if (shared.user.role === '管理员') {
      this.$router.push({name: 'Administrator', params: { uid: shared.user.uid }})
    }
  }
  message () {
    if (shared.user.role === '教师') {
      this.$router.push('/teacher/' + this.$route.params.uid + '/compose')
    } else if (shared.user.role === '学生') {
      this.$router.push('/student/' + this.$route.params.uid + '/compose')
    } else if (shared.user.role === '管理员') {
      this.$router.push('/administrator/' + this.$route.params.uid + '/compose')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header {
  margin: 0;
  color: #a4aebd;
  width: 100%;
  z-index: 1000;
}

.container {
  overflow: hidden;
  padding: 20px;
}

.logo {
  float: left;
}

.login {
 padding-top: 30px;
 float: right;
}

login {
  float: right;
}

.logout-text {
  font-family: 'PingFang SC';
  font-size: 15px;
  color: #99A9BF;
}

.popver-option {
  font-size: 15px;
  margin-bottom: 5px; 
}
</style>
