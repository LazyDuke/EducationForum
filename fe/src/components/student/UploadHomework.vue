<template>
  <el-card class="box-card">
    <div slot="header">
      <span class="title">上传作业</span>
    </div>   
    <el-row v-for="(hwCategory, index) in hwCategorys" :key="hwCategory" type="flex" justify="space-between" align="middle">
      <el-col style="text-align: left;">
        <el-button @click="setVisible(hwCategory)" type="text">{{hwCategory.title}}</el-button>
        <el-dialog
          style="text-align: center;"
          title="上传作业"
          :visible.sync="activeVisible"
          size="tiny"
          :before-close="handleclose">
          <!--<el-upload
            class="upload"
            drag
            :data="'software/' + hwCategory.title + '/'"
            action="http://localhost:4000/uploadfile/upload "
            :auto-upload='false'>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>              
          </el-upload>-->
      <el-form> 
      <el-upload
        class="upload"
        drag
        :data="'software/' + hwCategory.title + '/'"
        :action="url  + '/uploadfile/upload' "
        :auto-upload="false"
        ref="homeworkupload">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>              
      </el-upload> 
      <el-form-item>        
        <el-button type="primary" @click="onsubmit(hwCategory)">上 传</el-button>
      </el-form-item>         
    </el-form>
        </el-dialog>
      </el-col>
      <el-col>
        <el-icon name="document"></el-icon>
        <span>{{ hwCategory.hasuploaded }}</span>
      </el-col>
      <el-col style="text-align: right;">
        <el-icon name="time"></el-icon>
        <span style="margin-left: 10px">{{ hwCategory.date }}</span>
      </el-col>
    </el-row>      
  </el-card>
</template>
<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import { Homework, ServerBase } from '@/service'
import shared from '@/shared'
import moment from 'moment'

@Component({

})
export default class UploadHomework extends Vue {
  data () {
    return {
      dialogVisible: false,
      activeVisible: false,
      hwCategorys: [
      ]
    }
  }
  handleclose (dialogVisible) {
    this.activeVisible = false
    this.$refs['homeworkupload'][0].clearFiles()  //  关闭时清空上传文件列表
  }
  url = ''
  async created () {
    try {
      this.url = ServerBase
      let hws = await Homework.gethomework(shared.cid)
      for (let index in hws.body) {
        let hw = hws.body[index]
        let files = await Homework.getfilesbyid(hw.id, shared.cid)
        if (!files.body.length) {
          this.hwCategorys.push({id: hw.id, title: hw.title, date: hw.date, dialogVisible: false})
          return
        }
        this.hwCategorys.push({id: hw.id, title: hw.title, date: hw.date, dialogVisible: false, hasuploaded: files.body[0].filename})
      }
    } catch (error) {
      console.error(error)
      this.$alert('未知的错误发生了')
    }
  }
  async onsubmit (hw) {
    try {
      for (let index in this.$refs['homeworkupload'][0].uploadFiles) {
        let file = this.$refs['homeworkupload'][0].uploadFiles[index]
        await Homework.handinhomework(file.name, hw.id, 'C101', moment().format('YYYY-MM-DD'))
        hw.hasuploaded = file.name
      }
      await this.$refs['homeworkupload'][0].submit()
      setTimeout(() => {
        history.go(0)
      }, 1000)
    } catch (e) {
      this.$alert('未知的错误发生了')
      console.error(e)
    }
  }
  setVisible (selectedHomework) {
    // selectedHomework.address= 根据每个作业的title来设置作业的地址
    selectedHomework.dialogVisible = true // 打开对话框
    this.activeVisible = selectedHomework.dialogVisible
  }
  open (index) {
    // 上传操作
    this.dialogVisible = false // 关闭dialog
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
