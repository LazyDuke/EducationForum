<template>
<div>
  <el-card class="box-card" v-for="(thread, index) in threads" :key="thread">
    <div class="title">
      <el-button type="text" style="font-size:24px;" @click="$router.push({name: 'SinglePost', params: { threadid: thread.id }})">{{ thread.title }}</el-button>
    </div>
    <p class="content item" v-html="thread.content">
    </p>
  </el-card>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import { Thread } from '@/service'
@Component({
  props: ['title', 'content']
})
export default class ThumbnailPost extends Vue {
  //
  threads = []
  async mounted () {
    let ret = await Thread.getHotThread()
    console.log(ret)
    for (let thread of ret.body) {
      this.threads.push({title: thread.title, content: thread.content, id: thread.id})
    }
    this.threads.reverse()
  }
}
</script>

<style scoped>
.box-card {
  display: flex;
}

.title {  
  text-align: left;
}

.item {  
  text-indent: 33px;
  text-align: left;  
}

</style>
