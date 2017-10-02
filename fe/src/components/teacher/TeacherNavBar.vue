<template>
  <div>
    <el-menu theme="dark" :default-active="activeIndex" class="teacher-nav-bar" :router="true" mode="horizontal">        
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/board">板块</el-menu-item>
      <el-menu-item :index="'/teacher/'+$route.params.uid+'/teachernotification'">教务通知</el-menu-item>     
      <el-submenu index="4">
        <template slot="title">资料管理</template>
        <el-menu-item :index="'/teacher/'+$route.params.uid+'/teachermanagedata'" >软件工程</el-menu-item> <!--页面已写好把index替换为:index="'/teacher/'+$route.params.uid+'/teachermanagedata'"-->        
      </el-submenu>       
      <el-submenu index="5">
        <template slot="title">点评作业</template>
        <el-menu-item :index="'/teacher/'+$route.params.uid+'/homeworkcategory'">软件工程</el-menu-item>
      </el-submenu>
      <el-submenu index="6">
        <template slot="title">教学进度</template>
        <el-menu-item :index="'/teacher/'+$route.params.uid+'/teacherprogress'">软件工程</el-menu-item>
      </el-submenu>
      <el-menu-item :index="'/teacher/'+$route.params.uid+'/teacherpostedthread'">已发帖子</el-menu-item>
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
export default class TeacherNavBar extends Vue {
  uploadVisible = false
  filetreeVisible = false
  activeIndex = '1'
  username = shared.user.username
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.teacher-nav-bar {
  display: flex;
  justify-content: center;
}


</style>
