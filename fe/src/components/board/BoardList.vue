<template>
  <div>    
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <el-collapse v-model="activeNames">
          <el-collapse-item v-for="blocklist in blocklists" :key="blocklist" v-bind:title="blocklist.name" class="collapsetitle" :name="blocklist.name">
            <el-row :gutter="90" type="flex" justify="center">
              <el-col :span="4" v-for="block in blocklist.blocks" :key="block">
                <el-card :body-style="{padding: '0px'}" class="box-card">
                  <img :src="block.pic" class="image" style="cursor: pointer;height:140px;" @click="go(block.name, blocklist.name)" alt="进入版块"></button>
                  <div class="boardtitle" style="padding-top: 28px;">
                    <span>{{block.name}}</span>                   
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Block } from '@/service'
@Component({
  components: {
  }
})
export default class BoardList extends Vue {
  activeNames = []
  blocklists = []
  async mounted () {  // 初始化板块列表
    let result = await Block.init()
    for (let index in result.body) {
      if (result.body.hasOwnProperty(index)) {
        let element = result.body[index]
        let list = {
          name: '',
          blocks: []
        }
        list.name = element.name
        this.activeNames.push(element.name)
        for (var key in element.blocks) {
          if (element.blocks.hasOwnProperty(key)) {
            var ele = element.blocks[key]
            let block = {
              name: '',
              pic: ''
            }
            block.name = ele.name
            block.pic = ele.pic
            list.blocks.push(block)
          }
        }
        this.blocklists.push(list)
      }
    }
  }
  go (blockname, list) { //
    this.$router.push('/postlist/' + list + ' ' + blockname)
    // this.$router.push({name: 'PostList', params: { list: list, block: blockname }})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.collapsetitle {
  font-weight: bold;  
  text-align: left;
}

 .image {
  width: 100%;
  display: block;
}

.boardtitle {
  padding: 14px;
  text-align: center;
  font-size: 15px;
}

.box-card {
  width: 150px;
  height: 200px;
}
</style>
