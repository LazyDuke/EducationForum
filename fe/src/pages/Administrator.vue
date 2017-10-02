<template>
  <div>
    <el-row>
      <el-col :span="24">
        <administrator-nav-bar></administrator-nav-bar>
      </el-col>
    </el-row>    
    <el-row :gutter="20" class="nav-gap">
      <el-col :span="5" :offset="1" >
        <info></info>
      </el-col>
      <el-col :span="12">
        <router-view></router-view>
      </el-col>
      <el-col :span="5">
        <calendar :view="'month'"></calendar>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import AdministratorNavBar from '@/components/administrator/AdministratorNavBar'
import Calendar from 'vue2-calendar'
import Info from '@/components/shared/Info'

@Component({
  components: {
    AdministratorNavBar,
    Calendar,
    Info
  }
})
export default class Administrator extends Vue {
}

</script>

<style scoped>

.nav-gap {
  padding-top: 30px;
}

</style>
