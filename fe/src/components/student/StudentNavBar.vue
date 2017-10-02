<template>
  <div>
    <el-menu theme="dark" :default-active="activeIndex" class="student-nav-bar" :router="true" mode="horizontal">        
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/board">板块</el-menu-item>
      <el-menu-item :index="'/student/'+$route.params.uid+'/studentnotification'">教务通知</el-menu-item>     
      <el-submenu index="4">
        <template slot="title">上传作业</template>
        <el-menu-item :index="'/student/'+$route.params.uid+'/uploadhomework'">软件工程</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">下载资料</template>
        <el-menu-item :index="'/student/'+$route.params.uid+'/downloaddata'">软件工程</el-menu-item>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">学习进度</template>
        <el-menu-item :index="'/student/'+$route.params.uid+'/studentprogress'">软件工程</el-menu-item>
      </el-submenu>
      <el-menu-item :index="'/student/'+$route.params.uid+'/studentpostedthread'">已发帖子</el-menu-item>
    </el-menu>     
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import shared from '@/shared'

@Component({
  components: {

  }
})
export default class StudentNavBar extends Vue {
  activeIndex = '1'
  username = shared.user.username
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.student-nav-bar {
  display: flex;
  justify-content: center;
}


</style>
