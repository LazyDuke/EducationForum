<template>
  <el-carousel indicator-position="outside">
    <el-carousel-item v-for="item in items" :key='item.src'>
      <img v-bind:src="item.src">
    </el-carousel-item>
  </el-carousel>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component()
export default class News extends Vue {
  items=[
    {
      src: require('@/assets/news/news1.jpg')

    }, {
      src: require('@/assets/news/news2.jpg')

    }, {
      src: require('@/assets/news/news3.jpg')

    }, {
      src: require('@/assets/news/news4.jpg')

    }
  ]
}
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  
</style>
