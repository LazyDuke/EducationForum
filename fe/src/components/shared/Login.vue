<template>
  <div>
    <el-form ref="login" :model="form" :rules="loginRule">
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="form.username" placeholder="Username">
        </el-input>
      </el-form-item>
      <el-form-item label="密 码：" prop="password">
        <el-input
          v-model="form.password"
          placeholder="Password"
          type="password"
          icon="search"
          :on-icon-click="checkPsw"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="login('login')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { User } from '@/service'
import shared from '@/shared'
@Component({
})
export default class Login extends Vue {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      loginRule: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      result: ''
    }
  }
  async login (formName) {
    let flag = false
    this.$refs[formName].validate((valid) => {
      if (valid) {
        // 提交逻辑补充
        flag = true
      } else {
        this.$alert('请输入正确的用户名和密码', '系统提示', {
          confirmButtonText: '确定'
        })
        return false
      }
    })
    if (flag) {
      let error
      let result = await User.login(this.form.username, this.form.password).catch(e => { // 登录
        error = e
      })
      if (error instanceof Error) {
        this.$message.error('用户名或密码错误')
      } else {  // 登录成功，赋值
        // 这些代码放到service里
        shared.isLogin = true
        shared.user.username = result.body.username
        shared.user.realname = result.body.realname
        shared.user.uid = result.body.uid
        shared.user.role = result.body.role.name
        if (shared.user.role === 'teacher') {
          shared.user.role = '教师'
        } else if (shared.user.role === 'student') {
          shared.user.role = '学生'
        } else if (shared.user.role === 'administrator') {
          shared.user.role = '管理员'
        }
        // alert('success' + shared.isLogin + shared.user.realname)
        this.$emit('loginsuccess')
        this.$message({
          message: '登录成功',
          type: 'success'
        })
      }
    }
  }
  register () { // 注册窗口控制
    this.loginVisible = false
    this.regisVisible = true
  }
  checkPsw (event) {
    if (event.target.nextSibling.type === 'password') {
      event.target.nextSibling.type = 'text'
    } else {
      event.target.nextSibling.type = 'password'
    }
  }
}
</script>
<style scoped>

</style>
