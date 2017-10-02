<template>
  <el-card>
    <div slot="header">
      <span class="title">所有私信</span>
      <!--<el-button icon="delete" style="float: right;" type="danger" @click="deleteAll()">清空所有</el-button>-->
    </div>
    <el-row v-for="(compose, index) in composes" :key="compose" style="margin: 5px;" type="flex" justify="space-between" align="middle">
      <el-col tag="el-button" @click.native="openCom(compose)">
        <el-row  type="flex" justify="space-between" align="middle">
          <el-col :span="2">
            {{ compose.name }}
          </el-col>
          <el-col :span="6">
            <el-col :span="6">
              <i class="el-icon-document">{{ compose.total }}</i>
            </el-col>
            <el-col :span="18">
              <i class="el-icon-time">{{ compose.date }}</i>
            </el-col>
          </el-col>
        </el-row>
        <el-row type="flex" align="bottom" style="padding-top: 5px; color: #BDBDBC">
          <i class="el-icon-edit">{{ compose.content }}</i>
        </el-row>
      </el-col>
      <!--<el-col :span="1">
        <el-button icon="minus" style="float: right;" type="danger" size="mini" @click="deleteCom(index)"></el-button>
      </el-col>-->
    </el-row>
  </el-card>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import moment from 'moment'
import { Message } from '@/service'

@Component({
  computed: {
    composes () {
      return this.list.map((i, index) => ({
        name: i.sender.realname,
        content: i.content,
        total: i.total,
        date: moment(i.latest * 1000).format('YYYY-MM-DD'),
        id: index
      }))
    }
  }
})
export default class Compose extends Vue {
  async mounted () {
    let ret = await Message.list()
    this.list = ret.body
  }
  data () {
    return {
      list: []
    }
  }
  openCom (selectedCompose) {
    this.$router.push({name: 'DetailCompose', params: { id: selectedCompose.id }})
  }
  deleteCom (index) {
    // 删除逻辑
    this.$message({
      message: '删除成功',
      type: 'success'
    })
    this.composes.splice(index, 1)
  }
  deleteAll () {
    // 删除全部逻辑
    this.composes.splice(0, this.composes.length)
  }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  line-height: 36px;
  font-size: 20px;
  font-weight: bold;
}
</style>
