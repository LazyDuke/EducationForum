<template>
 <el-card class="box-card">
    <div slot="header">
      <span class="title">已发帖子</span>
    </div>
    <span v-loading='loading'>    
      <span class="loading" v-if="loading">
      </span>
      <span>
        <el-row v-for="(postedThread, index) in postedThreads" :key="postedThread" type="flex" justify="space-between" align="middle">
          <el-col :span="4">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ postedThread.date }}</span>
          </el-col>
          <el-col :span="16" style="text-align: center">
            <el-button @click="open(index)" type="text">{{postedThread.title}}</el-button>
          </el-col>
          <el-col :span="2">
            <el-tag v-if="postedThread.status === 0" type="success">已通过</el-tag>
            <el-tag v-if="postedThread.status === 1" type="warning">审核中</el-tag>
            <el-tag v-if="postedThread.status === 2" type="danger">未通过</el-tag>
          </el-col>
        </el-row>
      </span>
    </span>    
  </el-card>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Thread } from '@/service'

@Component()
export default class TeaAndStuPostedThread extends Vue {
  loading = false
  postedThreads = [
  ]
  async mounted () {
    this.loading = true
    let ret = await Thread.getPersonalThread()
    console.log(ret)
    for (let thread of ret.body) {
      this.postedThreads.push({date: thread.time, status: thread.status, title: thread.title, id: thread.id, reason: thread.deleteReason})
    }
    this.loading = false
  }
  open (index) {
    if (this.postedThreads[index].status === 2) {
      this.$alert(this.postedThreads[index].reason, '未通过原因', {
        confirmButtonText: '确定'
      })
    } else if (this.postedThreads[index].status === 1) {
      this.$alert('您的帖子正在审核中，请耐心等待...', '系统提示', {
        confirmButtonText: '确定'
      })
    } else {
      // 打开相关帖子页面
      this.$router.push({name: 'SinglePost', params: { threadid: this.postedThreads[index].id }})
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
.loading {
  display: block;
  height: 100px;
}

</style>
