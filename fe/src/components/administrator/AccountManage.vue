<template>
  <el-card>
    <el-table 
      :data="accounts"
      border
      style="width: 100%">
      <el-table-column type="expand">
        <template scope="scope">
          <el-form label-position="left" inline class="table-expand">            
            <el-form-item label="姓名：">
              <span>{{ scope.row.realname }}</span>
            </el-form-item>           
            <el-form-item label="性别：">
              <span>{{ scope.row.gender }}</span>
            </el-form-item>
            <el-form-item label="手机：">
              <span>{{ scope.row.phone }}</span>
            </el-form-item>
            <el-form-item label="邮箱：">
              <span>{{ scope.row.email }}</span>
            </el-form-item>
            <el-form-item label="地址：">
              <span>{{ scope.row.location }}</span>
            </el-form-item>
            <el-form-item label="邮编：">
              <span>{{ scope.row.post }}</span>
            </el-form-item>
            <el-form-item label="院校：" style="width: 100%">
              <span>{{ scope.row.institude }}</span>
            </el-form-item>            
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="uid"
        align="center"
        :label="userType">
      </el-table-column>      
      <el-table-column
        prop="username"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="realname"
        align="center"
        label="真实姓名">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template scope="scope">
          <el-button
            size="mini"
            icon="edit"
            type="info"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-dialog
            size="tiny"
            title="修改信息"
            :visible.sync="dialogInfoVisible"
            :before-close="handleInfoClose">
          <el-form :model="accounts[scope.$index]" :rules="infoRules" ref="accounts">
            <el-form-item :label="userType" prop="uid">
              <el-input v-model="accounts[scope.$index].uid"></el-input>
            </el-form-item>
            <el-form-item label="用户名：" prop="username">
              <el-input v-model="accounts[scope.$index].username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input 
                v-model="accounts[scope.$index].password"                
                type="password" 
                icon="search"
                :on-icon-click="checkPsw"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input 
                  v-model="accounts[scope.$index].checkPass"                   
                  type="password"
                  icon="search"
                  :on-icon-click="checkPsw"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名：" prop="realname">
              <el-input v-model="accounts[scope.$index].realname"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="gender">
              <el-radio-group v-model="accounts[scope.$index].gender">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
                <el-radio label="保密"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机：" prop="phone">
              <el-input v-model="accounts[scope.$index].phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="accounts[scope.$index].email"></el-input>
            </el-form-item>      
            <el-form-item label ="地址：" prop="location">
              <el-input v-model="accounts[scope.$index].location"></el-input>
            </el-form-item>
            <el-form-item label ="邮编：" prop="post">
              <el-input v-model="accounts[scope.$index].post"></el-input>
            </el-form-item>
            <el-form-item label="院校：" prop="institude">
              <el-input v-model="accounts[scope.$index].institude"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmitInfo('accounts')">修 改</el-button>
          </div>
        </el-dialog>
        <el-button
          size="mini"
          icon="delete"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
      </el-table-column>  
    </el-table>   
  </el-card>  
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Admin } from '@/service'
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

@Component()
export default class AccountManage extends Vue {
  dialogInfoVisible = false
  accounts = [
  ]
  async created () {
    try {
      let users = await Admin.getAccount(this.$route.params.role)
      console.log(users)
      for (let index in users.body) {
        let account = {
          uid: '',
          username: '',
          password: '',
          checkPass: '',
          realname: '',
          gender: '',
          phone: '无',
          email: '无',
          location: '无',
          post: '无',
          institude: '无'
        }
        let element = users.body[index]
        account.uid = element.uid
        account.username = element.username
        account.password = element.password
        account.realname = element.realname
        account.gender = element.gender
        if (element.phone) {
          account.phone = element.phone
        }
        account.email = element.email ? element.email : '无'
        account.location = element.location ? element.location : '无'
        account.post = element.post ? element.post : '无'
        account.institude = element.institude ? element.institude : '无'
        this.accounts.push(account)
      }
    } catch (error) {
      this.$alert(error.message, {
        callback: action => {
          this.$router.push('/')
          history.go(0)
        }
      })
    }
  }
  get userType () {
    return this.$route.params.role === 'teacher' ? '教师号' : '学号'
  }
  infoRules = {
    uid: [
        {required: true, message: '请输入号码', trigger: 'blur'}
    ],
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
    gender: [
      {required: true, message: '请选择您的性别', trigger: 'change'}
    ],
    phone: [
      { validator: validatePhone, trigger: 'blur' }
    ],
    email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
    ]
  }

  handleEdit (index, row) {
    this.dialogInfoVisible = true
  }
  async handleDelete (index, row) {
    try {
      await Admin.delete(this.accounts[index].uid)
      this.$message({
        type: 'success',
        message: '删除成功'
      })
    } catch (error) {
      this.$alert(error.message)
    }
    this.accounts.splice(index, 1)
  }

  handleInfoClose (done) {
    this.$confirm('修改未保存，是否退出？')
      .then(_ => {
        this.$refs['accounts'].resetFields()
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

  onSubmitInfo (formname) {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
  text-align: left;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
  text-align: left;
}

</style>
