<template>
  <div>
    <el-card>
      <div slot="header">
        <span class="title">教务通知</span>
        <el-button icon="edit" style="float: right;" @click="dialogFormVisible = true" type="primary">发布通知</el-button>
      </div>
      <el-row v-for="(notification, index) in notifications" :key="notification" type="flex" justify="space-between" align="middle">
        <el-col :span="5">
          <el-button @click="open(index)" style="float: left;" type="text">{{notification.caption}}</el-button>
        </el-col>
        <el-col :span="5">{{ notification.username }}</el-col>
        <el-col :span="10">
          <span>{{ notification.date }}</span>
          <el-button icon="delete" type="danger" size="mini" @click="deleteNoti(index)" >删 除</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
    title="发布通知"
    :visible.sync="dialogFormVisible"
    :before-close="handleClose">
    <el-form :model="form" :rules="notiRules" ref="notification">
      <el-form-item label="通知标题：" prop="caption">
        <el-input v-model="form.caption"></el-input>
      </el-form-item>
      <el-form-item label="通知内容：" prop="content">
        <el-input type="textarea" v-model="form.content" :rows="20"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('notification')">发 布</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import moment from 'moment'
import { Notify } from '@/service'
import shared from '@/shared'

@Component({

})
export default class TeaAndAdminNotification extends Vue {
  data () {
    return {
      form: {
        caption: '',
        content: ''
      },
      notifications: [],
      notiRules: {
        caption: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false
    }
  }
  handleClose (done) {
    this.$confirm('是否放弃已输入的内容？')
      .then(_ => {
        done()
        this.$refs['notification'].resetFields()
      })
      .catch(_ => {})
  }
  async created () {
    try {
      // await shared.init()
      let notifys = await Notify.getnotify(shared.cid)
      for (let notify in notifys.body) {
        this.notifications.push({caption: notifys.body[notify].caption, content: notifys.body[notify].content, date: moment().format('YYYY-MM-DD'), username: notifys.body[notify].user.username})
      }
    } catch (error) {
      this.$alert('未知的错误发生了')
    }
  }
  onSubmit (formName) {
    this.$refs[formName].validate(async (valid) => {
      if (valid) {
        this.dialogFormVisible = false
        try {
          await Notify.create(shared.cid, this.form.caption, this.form.content, moment().format('YYYY-MM-DD'))
          this.$message({
            message: '发布成功',
            type: 'success'
          })
          this.notifications.push({caption: this.form.caption, content: this.form.content, date: moment().format('YYYY-MM-DD'), username: shared.user.username})
        } catch (error) {
          this.$alert('未知的错误发生了，请稍后再试', '系统提示', {
            confirmButtonText: '确定'
          })
        }
        this.form.caption = ''
        this.form.content = ''
      } else {
        this.$alert('输入不符合要求，请重新输入后再提交。', '系统提示', {
          confirmButtonText: '确定'
        })
        return false
      }
    })
  }
  open (index) {
    this.$alert(this.notifications[index].content, this.notifications[index].caption, {
      confirmButtonText: '确定'
    })
  }
  async deleteNoti (index) {
    try {
      let result = await Notify.delete(this.notifications[index].caption)
      console.log(result)
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.notifications.splice(index, 1)
    } catch (error) {
      this.$alert('未知的错误发生了，可能的原因:没有权限 106')
    }
  }
}
</script>
<style scoped>
.title {
  line-height: 36px;
  font-size: 20px;
  font-weight: bold;
}
</style>
