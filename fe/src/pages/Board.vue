<template>
  <div>
    <el-row>
      <el-col :span="24">
        <home-nav-bar></home-nav-bar>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <carousel></carousel>
      </el-col>      
    </el-row>
    <board-list></board-list>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Carousel from '@/components/board/Carousel'
import HomeNavBar from '@/components/shared/HomeNavBar'
import BoardList from '@/components/board/BoardList'

@Component({
  components: {
    HomeNavBar,
    Carousel,
    BoardList
  }
})
export default class Board extends Vue {

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
