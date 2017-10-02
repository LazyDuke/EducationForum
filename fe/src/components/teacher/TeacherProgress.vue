<template>
  <el-card>
    <div slot="header">
      <span class="title">教学进度</span>
      <el-button icon="edit" style="float: right;margin-left: 5px;" @click="previous">上一章</el-button>
      <el-button icon="edit" style="float: right;margin-left: 5px;" @click="next">下一章</el-button>
      <el-button icon="edit" style="float: right;margin-right: 5px;" @click="dialogFormVisible = true" type="primary">编辑</el-button>
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
      <div>还没有学习进度，赶快点击编辑发布一个吧</div>
    </span>
    <el-dialog 
      title="编辑进度" 
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      size="tiny">
      <el-form :model="progress" :rules="proRules" ref="Progress">
        <el-form-item label="章节数：" prop="total">
          <el-input v-model="progress.total"></el-input>
        </el-form-item>        
        <el-form-item>        
          <el-button type="primary" @click="onSubmit(progress.total)">确 定</el-button>
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

export default class TeacherProgress extends Vue {
  dialogFormVisible = false
  finishStatus ='success'
  progress = {
    active: 0,
    total: 10,
    steps: []
  }
  proRules = {
    total: [
      {required: true, message: '章节数不能为空', trigger: 'blur'}
    ]
  }
  async mounted () {
    try {
      let ret = await CourseList.getProgress()
      this.progress.active = ret.body[0]
      this.progress.total = ret.body[1]
      for (let i = 1; i <= this.progress.total; i++) {
        this.progress.steps.push({title: '第' + i + '章'})
      }
    } catch (e) {
      console.error(e)
      this.$alert(e.toString())
    }
  }
  handleClose (done) {
    this.$confirm('是否放弃已输入的内容？')
      .then(_ => {
        done()
        this.$refs['Progress'].resetFields()
      })
      .catch(_ => {})
  }
  async next () {
    try {
      if (this.progress.active === this.progress.total) {
        this.$message('已经到最后一章了')
        return
      }
      await CourseList.mendProgressing(this.progress.active + 1)
      this.progress.active++
      this.$message({
        type: 'success',
        message: '操作成功'
      })
    } catch (e) {
      console.error(e)
      this.$alert(e.toString())
    }
    // 得把这个也提交给数据库
  }
  async previous () {
    try {
      if (this.progress.active === 1) {
        this.$message('已经是第一章了')
        return
      }
      await CourseList.mendProgressing(this.progress.active - 1)
      this.progress.active--
      this.$message({
        type: 'success',
        message: '操作成功'
      })
    } catch (e) {
      console.error(e)
      this.$alert(e.toString())
    }
    // 得把这个也提交给数据库
  }
  async onSubmit (total) {
    // 这里把数据提交给数据库
    // 然后刷新一下 估计要调用哪个钩子
    try {
      let ret = await CourseList.createProgress(total)
      this.progress.active = ret.body[0]
      this.progress.total = ret.body[1]
      for (let i = 1; i <= this.progress.total; i++) {
        this.progress.steps.push({title: '第' + i + '章'})
      }
      this.dialogFormVisible = false
    } catch (e) {
      console.error(e)
      this.$alert(e.toString())
    }
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
