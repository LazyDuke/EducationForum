<template>
  <div>
    <el-row>
      <el-col :span="24">
        <teacher-nav-bar></teacher-nav-bar>
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
import TeacherNavBar from '@/components/teacher/TeacherNavBar'
import Calendar from 'vue2-calendar'
import Info from '@/components/shared/Info'

@Component({
  components: {
    TeacherNavBar,
    Calendar,
    Info
  }
})
export default class Teacher extends Vue {
}

</script>

<style scoped>

.nav-gap {
  padding-top: 30px;
}

</style>
