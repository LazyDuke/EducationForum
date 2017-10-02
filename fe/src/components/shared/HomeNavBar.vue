<template>
 <el-menu theme="dark" :router="true" :default-active="activeIndex" class="home-nav-bar" mode="horizontal">    
    <el-menu-item index="/">首页</el-menu-item>    
    <el-menu-item index="/Board">板块</el-menu-item>
    <el-menu-item index="/Homework">资源分享</el-menu-item>    
    <el-menu-item index="/Application">论坛APP</el-menu-item>
  </el-menu>

</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
})
export default class HomeNavBar extends Vue {
  activeIndex = '1'
  handleSelect (key, keyPath) {
    console.log(key, keyPath)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.home-nav-bar {
  display: flex;
  justify-content: center;
}
</style>
