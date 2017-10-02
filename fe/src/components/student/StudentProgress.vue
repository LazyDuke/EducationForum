<template>
  <el-card>
    <div slot="header">
      <span class="title">学习进度</span>     
    </div>
    <span v-if="progress.total">  
    <el-steps
      style="text-align: left"
      :space="100"
      direction="vertical"
      :active="progress.active"
      :finish-status="finishStatus">
      <el-step v-for="(step, index) in progress.steps" :key="step" :title="step.title">
      </el-step>
    </el-steps>
    </span>
    <span v-else>
      <div>老师暂时还未发布进度</div>
    </span>
    <el-dialog
      title="选择教师" 
      :visible.sync="dialogFormVisible"
      size="tiny">
      <el-form :model="teacherlist" :rules="proRules" ref="Progress">
        <el-form-item label="教师">
          <el-radio-group v-model="chosen">
          <el-radio  v-for="teacher in teacherlist" :key="teacher" :label="teacher.courseid">{{ teacher.teachername }}</el-radio>
          </el-radio-group>
        </el-form-item>        
        <el-form-item>        
          <el-button type="primary" @click='add'>确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>    
  </el-card>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { CourseList } from '@/service'

@Component()

export default class StudentProgress extends Vue {
  dialogFormVisible = false
  finishStatus ='success'
  progress = {
    active: 0,
    total: 0,
    steps: []
  }
  teacherlist = []
  chosen = ''
  async add () {
    try {
      await CourseList.addStudent(this.chosen)
      this.dialogFormVisible = false
      history.go(0)
    } catch (e) {
      console.error(e)
      this.$alert(e.toString())
    }
  }
  async mounted () {
    let ret = await CourseList.getStudentProgress()
    if (ret.body[0] === 0) {
      let r = await CourseList.getCourseList()
      for (let course of r.body) {
        this.teacherlist.push({teachername: course.teacher.realname, courseid: course.id})
      }
      this.dialogFormVisible = true
    } else {
      this.progress.active = ret.body[0]
      this.progress.total = ret.body[1]
      for (let i = 1; i <= this.progress.total; i++) {
        this.progress.steps.push({title: '第' + i + '章'})
      }
    }
  }
  created () {
   // 从数据库获取进度数据
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  line-height: 36px;
  font-size: 20px;
  font-weight: bold;
}
</style>
