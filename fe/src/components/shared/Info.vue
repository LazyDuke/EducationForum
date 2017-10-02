<template>
  <div>
    <el-card class="box-card" :body-style="{ height: '162%' }">
      <div slot="header" class="clearfix">
        <span class="title">个人信息</span>
      </div>
      <img :src='user.info.pic' width="100" height="100" style="cursor: pointer;" alt="点击上传头像" @click="dialogAvatarVisible = true">
      <div class="text item">
        <strong>姓名：</strong>{{user.realName}}
      </div>
      <div class="text item">
        <strong v-if="user.info.role === '管理员'">管理号：</strong>
        <strong v-else-if="user.info.role === '教师'">教师号：</strong>
        <strong v-else-if="user.info.role === '学生'">学号：</strong>
        {{user.id}}
      </div>
      <div class="buttongroup" >
        <el-button class="update" type="info" icon="information" @click="dialogInfoVisible = true">修改信息</el-button>
        <el-button class="update"type="danger" icon="information" @click="dialogPswVisible = true">修改密码</el-button>
      </div>
    </el-card>
    <el-dialog
      size="tiny"
      title="修改信息"
      :visible.sync="dialogInfoVisible"
      :before-close="handleInfoClose">
      <el-form :model="user.info" :rules="infoRules" ref="user.info">
        <el-form-item label="性别：" prop="gender">
          <el-radio-group v-model="user.info.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
            <el-radio label="保密"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机：" prop="phone">
          <el-input v-model="user.info.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="user.info.email"></el-input>
        </el-form-item>
        <el-form-item label="院校：" prop="institute">
          <el-input v-model="user.info.institute"></el-input>
        </el-form-item>
        <el-form-item label = "地址：" prop="location">
          <el-input v-model="user.info.location"></el-input>
        </el-form-item>
        <el-form-item label = "邮编：" prop="post">
          <el-input v-model="user.info.post"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmitInfo('user.info')">修 改</el-button>
      </div>
    </el-dialog>

    <el-dialog
      size="tiny"
      title="修改密码"
      :visible.sync="dialogPswVisible"
      :before-close="handlePswClose">
      <el-form :model="psw" :rules="pswRules" ref="psw">
        <el-form-item label="新密码：" prop="password">
          <el-input
            type="password"
            icon="search"
            :on-icon-click="checkPsw"
            v-model="psw.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPass">
          <el-input
            type="password"
            icon="search"
            :on-icon-click="checkPsw"
            v-model="psw.checkPass"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmitPsw('psw')">修 改</el-button>
      </div>
    </el-dialog>

    <el-dialog
      size="tiny"
      title="上传头像"
      :visible.sync="dialogAvatarVisible"
      >
      <el-upload
        class="avatar-uploader"
        action=""
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

    </el-dialog>
  </div>
</template>
<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import shared from '@/shared'
import { User } from '@/service'
@Component({

})
export default class Info extends Vue {
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.psw.checkPass !== '') {
          this.$refs.psw.validateField('checkPass')
        }
        callback()
      }
    }

    let validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.psw.password) {
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
      imageUrl: '',
      user: {
        userName: '',
        id: '',
        realName: '',
        info: {
          role: '',
          gender: '',
          phone: '',
          email: '',
          location: '',
          institute: '',
          post: '',
          pic: ''
        }
      },
      psw: {
        password: '',
        checkPass: ''
      },
      pswRules: {
        password: [
           { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validateCheckPass, trigger: 'blur' }
        ]
      },
      infoRules: {
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
        ]
      }
    }
  }
  dialogInfoVisible = false
  dialogPswVisible = false
  dialogAvatarVisible = false
  async created () {
    console.log('teacher mounted')
    // await shared.init()
    if (shared.isLogin === false) {
      this.$alert('请登录')
      this.$router.push('/')
    } else {
      this.user.realName = shared.user.realname
      this.user.id = shared.user.uid
      this.user.info.phone = shared.user.phone
      this.user.info.email = shared.user.email
      this.user.info.role = shared.user.role
      this.user.info.pic = shared.user.pic
      this.user.info.institute = shared.user.institute
      this.user.info.post = shared.user.post
      this.user.info.gender = shared.user.gender
      console.log(this.user.id)
      console.log(this.user.info.role)
    }
  }
  handleInfoClose (done) {
    this.$confirm('修改未保存，是否退出？', '系统提示')
      .then(_ => {
        this.$refs['user.info'].resetFields()
        done()
      })
      .catch(_ => {})
  }
  handlePswClose (done) {
    this.$confirm('修改未保存，是否退出？', '系统提示')
      .then(_ => {
        this.$refs['psw'].resetFields()
        done()
      })
      .catch(_ => {})
  }
  checkPsw (event) {
    if (event.target.nextSibling.type === 'password') {
      event.target.nextSibling.type = 'text'
    } else {
      event.target.nextSibling.type = 'password'
    }
  }

  async onSubmitInfo (formName) {
    this.$refs[formName].validate(async (valid) => {  // 提交表单验证
      if (valid) {
        this.dialogInfoVisible = false
        try {
          let result = await User.infoupdate(this.user.tid, this.user.info)
          if (result.code === 0) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
          }
        } catch (error) {
          this.$message({
            message: error,
            type: 'error'
          })
        }
      } else {
        this.$alert('输入不符合要求，请重新输入后再提交。', '系统提示', {
          confirmButtonText: '确定'
        })
        return false
      }
    })
  }

  onSubmitPsw (formName) {
    this.$refs[formName].validate(async (valid) => {
      if (valid) {
        this.dialogPswVisible = false
        try {
          await User.pwupdate(this.user.tid, this.psw.password)
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } catch (error) {
          this.$message({
            message: error,
            type: 'error'
          })
        }
        this.psw.password = ''
        this.psw.checkPass = ''
      } else {
        this.$alert('输入不符合要求，请重新输入后再提交。', '系统提示', {
          confirmButtonText: '确定'
        })
        return false
      }
    })
  }

  handleAvatarSuccess (res, file) {
    // 上传成功逻辑
    this.imageUrl = URL.createObjectURL(file.raw)
    this.$message({
      message: '上传成功！',
      type: 'success'
    })
  }
  beforeAvatarUpload (file) {
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!(isJPG || isPNG)) {
      this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传头像图片大小不能超过 2MB!')
    }
    return isJPG && isLt2M && isPNG
  }
}
</script>
<style scoped>
  .text {
    font-size: 14px;
  }

  .title {
  line-height: 36px;
  font-size: 20px;
  font-weight: bold;
  }

  .item {
    padding: 10px 0;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }

  .buttongroup {
    padding-top: 30px;
  }
  .buttongroup .update {
    width: 46%;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
