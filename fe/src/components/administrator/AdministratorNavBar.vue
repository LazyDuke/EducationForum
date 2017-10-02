<template>
  <div>
    <el-menu theme="dark" :default-active="activeIndex" class="administrator-nav-bar" :router="true" mode="horizontal">        
      <el-menu-item index="/">首页</el-menu-item>      
      <el-menu-item index="/board">板块</el-menu-item>
      <el-menu-item :index="'/administrator/'+$route.params.uid+'/adminnotification'">教务通知</el-menu-item>
      <el-submenu index="3">
        <template slot="title">资料管理</template>
        <el-menu-item :index="'/administrator/'+$route.params.uid+'/adminmanagedata'">软件工程</el-menu-item>
      </el-submenu>     
      <el-submenu index="4">
        <template slot="title">账号管理</template>
        <el-menu-item :index="'/administrator/'+$route.params.uid+'/accountmanage/teacher'" @click="go">教师</el-menu-item>     
        <el-menu-item :index="'/administrator/'+$route.params.uid+'/accountmanage/student'" @click="go">学生</el-menu-item>     
      </el-submenu>
      <el-menu-item :index="'/administrator/'+$route.params.uid+'/boardmanage'">板块管理</el-menu-item>
      <el-menu-item :index="'/administrator/'+$route.params.uid+'/threadmanage'">帖子管理</el-menu-item>       
    </el-menu>  
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  components: {

  }
})
export default class AdministratorNavBar extends Vue {
  activeIndex = '1'
  go () { // 得刷新一下才行
    history.go(0)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.administrator-nav-bar {
  display: flex;
  justify-content: center;
}


</style>
