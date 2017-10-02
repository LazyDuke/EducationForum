<template>
  <div class="application">
    <el-row>
      <el-col :span="24">
        <home-nav-bar></home-nav-bar>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="logo">
          APP还在开发中，敬请期待......
        </div>
      </el-col>      
    </el-row>    
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import HomeNavBar from '@/components/shared/HomeNavBar'
@Component({
  components: {
    HomeNavBar
  }
})
export default class Application extends Vue {

}
</script>

<style scoped>
.logo {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  font-size: 40px;  
}

.logo::before {
  content: '';
  height: 100px;
  display: block;
}
</style>
