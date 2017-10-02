<template>
  <el-carousel indicator-position="outside" type="card">
    <el-carousel-item v-for="item in items" :key='item.src'>
      <img v-bind:src="item.src">
    </el-carousel-item>
  </el-carousel>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component()
export default class Carousel extends Vue {
  items=[
    {
      src: require('@/assets/carousel/carouselOne.jpg')
    },
    {
      src: require('@/assets/carousel/carouselTwo.jpg')
    },
    {
      src: require('@/assets/carousel/carouselThree.jpg')
    },
    {
      src: require('@/assets/carousel/carouselFour.jpg')
    }
  ]
}
</script>

<style scoped>
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
