<template>
<div class="board">
  <el-row>   
    <el-col :span="24">   
      <el-card :body-style="{ padding: '0px' }">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;">推荐板块</span>          
        </div>
        <div class="picture"><img style="cursor: pointer;" v-bind:src=picOne class="image" @click="$router.push('/postlist/' + '学习讨论' + ' ' + 'JAVA讨论区')"></div></a>
        <div style="padding: 14px;">
         <span>JAVA讨论区</span>          
       </div>     
      </el-card>  
    </el-col> 
  </el-row>
  <el-row> 
     <el-col :span="24">
      <el-card :body-style="{ padding: '0px' }">
        <div class="picture"><img style="cursor: pointer;" v-bind:src=picOne class="image" @click="$router.push('/postlist/' + '学习讨论' + ' ' + 'C、C++讨论区')"></div></a>
        <div style="padding: 14px;">
         <span>C、C++讨论区</span>          
       </div>     
      </el-card>  
     </el-col>
  </el-row>
  <el-row> 
     <el-col :span="24">
      <el-card :body-style="{ padding: '0px' }">
        <div class="picture"><img style="cursor: pointer;" v-bind:src='picThree' class="image" @click="$router.push('/postlist/' + '站务管理' + ' ' + '投诉建议')"></div></a>
        <div style="padding: 14px;">
         <span>投诉建议</span>          
       </div>     
      </el-card>  
     </el-col>
  </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
})
export default class BestBoard extends Vue {
  picOne = require('@/assets/bestboard/learningOnline.png')
  picTwo = require('@/assets/bestboard/topicDiscuss.png')
  picThree = require('@/assets/bestboard/administration.png')
  picFour = require('@/assets/bestboard/uselessTopic.png')

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.image {
    width: 100%;
    display: block;
}

.picture {
  width: 100%;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}

</style>
