<template>
  <div>    
    <el-form ref="register" :model="form" :rules="rules">
      <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="Username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
          <el-input 
            v-model="form.pass" 
            placeholder="Password" 
            type="password" 
            icon="search"
            :on-icon-click="checkPsw"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
          <el-input 
            v-model="form.checkPass" 
            placeholder="Confirm password" 
            type="password"
            icon="search"
            :on-icon-click="checkPsw"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realname">
        <el-input v-model="form.realname" placeholder="Name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender" style="margin-right: 30%;">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
          <el-radio label="保密"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-radio-group v-model="form.role" style="margin-right: 42%;" >
          <el-radio label="教师"></el-radio>
          <el-radio label="学生"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.role === '教师'" label="教师号" prop="tid">
        <el-input v-model="form.tid" placeholder="Teacher number"></el-input>
      </el-form-item>
      <el-form-item v-if="form.role === '学生'" label="学号" prop="sid">
        <el-input v-model="form.sid" placeholder="Student number"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="form.phone" placeholder="Telephone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="E-mail"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel('register')">取 消</el-button>
        <el-button @click="register('register')">注 册</el-button>
      </el-form-item>
    </el-form> 
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { User } from '@/service'
@Component()
export default class Register extends Vue {
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    let validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    let validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      form: {
        username: '',
        pass: '',
        checkPass: '',
        tid: '',
        sid: '',
        gender: '',
        role: '',
        phone: '',
        email: '',
        realname: '',
        pic: require('@/assets/avatar.png')
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, required: true, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validateCheckPass, required: true, trigger: 'blur' }
        ],
        realname: [
          {required: true, message: '请输入您的真实姓名', trigger: 'blur'},
          {type: 'string', min: 2, message: '请输入正确的姓名', trigger: 'blur'}
        ],
        role: [
          {required: true, message: '请选择您的角色', trigger: 'change'}
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        gender: [
          {required: true, message: '请选择您的性别', trigger: 'change'}
        ],
        sid: [
          {required: true, message: '请输入学号', trigger: 'blur'}
        ],
        tid: [
          {required: true, message: '请输入教师号', trigger: 'blur'}
        ]
      }
    }
  }
  async register () {
    try {
      await User.checkunique(this.form.username, this.form.tid || this.form.sid)
      let res = await User.register(this.form, 'C101')
      if (res.code === 0) {
        this.$emit('registsuccess')   // 注册成功，触发成功事件
        this.$refs['register'].resetFields()
      } else {
        alert('未知的错误发生了')
      }
    } catch (error) {
      this.$alert(error.toString())
    }
  }
  onCancel (formName) {
    this.$emit('cancelRegister')
    this.$refs[formName].resetFields()
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
