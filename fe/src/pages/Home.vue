<template>
  <div>
    <el-row>
      <el-col :span="24">
        <home-nav-bar></home-nav-bar>
      </el-col>
    </el-row>
    <el-row>     
      <el-col :span="16" :offset="4">
        <news></news>
      </el-col>
      </el-col>    
    </el-row>
    <el-row>
      <el-col :span="16" :offset="4">
        <el-row :gutter="30">
          <el-col :span="20" v-loading='loading'>
            <div class="loading" v-if="loading"></div>
            <thumbnail-post v-for="post in posts" :key='post.content' :title="post.title" :content="post.content"></thumbnail-post>
          </el-col>    
          <el-col :span="4">
            <best-board></best-board>
          </el-col>
        </el-row>
      </el-col>
    </el-row>  
  </div>
</template>
<script>
import News from '@/components/home/News'
import HomeNavBar from '@/components/shared/HomeNavBar'
import ThumbnailPost from '@/components/home/ThumbnailPost'
import BestBoard from '@/components/home/BestBoard'
import Component from 'vue-class-component'
import Vue from 'vue'
import {asyncExample} from '@/service'
@Component({
  components: {
    News,
    HomeNavBar,
    ThumbnailPost,
    BestBoard
  }
})
export default class Home extends Vue {
  posts = []
  loading = true
  async created () {
    this.posts = await asyncExample()
    this.loading = false
  }
}
</script>
<style scoped>  
.loading {
  display: block;
  height: 100px;
}
.loading:before {
  content: " ";
}
</style>
