<template>
  <el-card class="box-card">
    <div slot="header">
      <span class="title">所有作业</span>
      <el-button icon="edit" style="float: right;" @click="dialogFormVisible = true" type="primary">布置作业</el-button>
    </div>
    <el-row v-for="(homeworkCate, index) in homeworkCates" :key="homeworkCate" type="flex" justify="space-between" align="middle">
      <el-col :span="5">
        <el-button @click="onOpenfile(homeworkCate)" style="float: left;" type="text">{{homeworkCate.title}}</el-button>
      </el-col>
      <el-col :span="5">
        <span>{{ homeworkCate.date }}</span>
      </el-col>
    </el-row>
    <el-dialog 
      title="布置作业" 
      :visible.sync="dialogFormVisible"
      :before-close="handleClose">
      <el-form :model="homeworkCateForm" :rules="cateRules" ref="homeworkcateform">
        <el-form-item label="作业名：" prop="title">
          <el-input v-model="homeworkCateForm.title"></el-input>
        </el-form-item>      
        <el-form-item>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit('homeworkcateform')">发 布</el-button>
        </el-form-item>
      </el-form>   
    </el-dialog>      
  </el-card>  
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Homework } from '@/service'
import shared from '@/shared'
import moment from 'moment'
@Component()
export default class Hello extends Vue {
  dialogFormVisible = false
  homeworkCateForm = {
    title: ''
  }
  homeworkCates = [
  ]
  cateRules = {
    title: [
      { required: true, message: '标题不能为空', trigger: 'blur' }
    ]
  }
  async mounted () {
    let hws = await Homework.gethomework(shared.cid)
    for (let index in hws.body) {
      let hw = hws.body[index]
      this.homeworkCates.push({title: hw.title, date: hw.date})
    }
  }
  onOpenfile (selectedHomework) {
    this.$router.push({name: 'HomeworkListRate', params: { title: selectedHomework.title }})
  }
  handleClose (done) {
    this.$confirm('是否放弃已输入的内容？')
      .then(_ => {
        done()
        this.$refs['homeworkcateform'].resetFields()
      })
      .catch(_ => {})
  }
  deleteCate (index) {
    // 暂时不能删除，数据库表的关联复杂
  }
  async onSubmit (formName) {
    try {
      await Homework.create(this.homeworkCateForm.title, moment().format('YYYY-MM-DD'), shared.cid)
      this.homeworkCates.push({title: this.homeworkCateForm.title, date: moment().format('YYYY-MM-DD')})
      this.$message({
        type: 'success',
        message: '发布成功'
      })
      this.dialogFormVisible = false
    } catch (e) {
      console.error(e)
      this.$alert('未知的错误发生了')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.text {
  font-size: 14px;
  text-align: left;
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

</style>
