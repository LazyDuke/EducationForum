<template>
  <el-card>
    <div slot="header">
      <el-button style="float: left;" @click="$router.go(-1)">返回</el-button>
      <span class="title">与{{ name }}的对话</span>
      <el-button type="info" style="float: right;" @click="update()">刷新</el-button>
    </div>
    <el-row :gutter="10" type="flex" justify="space-between" align="middle" style="padding-bottom: 10px">
      <el-col :span="1">
        <router-link to="/" tag="img" :src="avatar" height="30" width="30" style="cursor: pointer;"></router-link>
      </el-col>
      <el-col :span="19">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2}"
          placeholder="回复 Ta 点什么吧~"
          v-model="textareaMessage">
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="info" size="small" icon="message" @click="send()">发送</el-button>
      </el-col>
    </el-row>
    <hr >
    <el-row v-for="(detailCompose, index) in detailComposes" :key="detailCompose">
      <el-row v-if="detailCompose.isMyself" type="flex" justify="end" align="middle" style="margin: 5px">
        <!--<el-col :span="1">
          <el-button icon="minus" type="danger" size="mini" @click="deleteDetailCom(index)"></el-button>
        </el-col>-->
        <el-col :span="21">
          <el-input
            type="textarea"
            :readonly="true"
            v-model="detailCompose.content">
          </el-input>
        </el-col>
        <el-col :span="2">
          <router-link to="/" tag="img" :src="detailCompose.avatar" height="30" width="30" style="cursor: pointer;"></router-link>
        </el-col>
      </el-row>
      <el-row v-else type="flex" justify="start" align="middle" style="margin: 5px">
        <el-col :span="2">
          <router-link to="/" tag="img" :src="detailCompose.avatar" height="30" width="30" style="cursor: pointer;"></router-link>
        </el-col>
        <el-col :span="21">
          <el-input
            type="textarea"
            :readonly="true"
            v-model="detailCompose.content">
          </el-input>
        </el-col>
        <!--<el-col :span="1">
          <el-button icon="minus" type="danger" size="mini" @click="deleteDetailCom(index)"></el-button>
        </el-col>-->
      </el-row>
      <el-row style="margin-bottom: 10px; color: #99A9BF;">
        {{ detailCompose.date }}
      </el-row>
    </el-row>
  </el-card>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import moment from 'moment'
import { Message } from '@/service'
import shared from '@/shared'
@Component({
  computed: {
    name () {
      return this.sender.realname
    },
    id () {
      return this.$route.params.id
    },
    sender () {
      return shared.message.list[this.id].sender
    },
    detailComposes () {
      return this.list.map(i => {
        let ret = {
          content: i.content,
          date: moment(i.time * 1000).format('YYYY-MM-DD HH:mm'),
          isMyself: i.isMySelf
        }
        if (ret.isMyself) {
          ret.avatar = this.me.pic
        } else {
          ret.avatar = this.other.pic
        }
        return ret
      }).reverse()
    }
  }
})
export default class DetailCompose extends Vue {
  async mounted () {
    await this.update()
  }
  data () {
    return {
      list: [],
      me: null,
      other: null,
      avatar: require('@/assets/avatar.png'),
      textareaMessage: '',
      detailComposes2: [
        {
          avatar: require('@/assets/avatar.png'),
          content: '明天有空吗？',
          date: '2017-6-26 22:59',
          isMyself: true
        },
        {
          avatar: require('@/assets/avatar.png'),
          content: '有空，什么事？',
          date: '2017-6-26 23:29',
          isMyself: false
        }
      ]
    }
  }
  async update () {
    // 刷新数据
    let ret = await Message.getMessages(this.sender.id)
    console.log(ret)
    this.me = ret.me
    this.other = ret.other
    this.list = ret.msgs
    await Message.unread()
  }
  async send () {
    // 发送逻辑（记得将isMyself置为true
    await Message.send(this.other.id, this.textareaMessage)
    this.$message({
      message: '发送成功',
      type: 'success'
    })
    // this.detailComposes.unshift({
    //   avatar: this.me.pic,
    //   content: this.textareaMessage,
    //   date: moment().format('YYYY-MM-DD HH:mm'),
    //   isMyself: true
    // })
    this.textareaMessage = ''
    await this.update()
  }
  deleteDetailCom (index) {
    // 删除逻辑
    this.$message({
      message: '删除成功',
      type: 'success'
    })
    this.detailComposes.splice(index, 1)
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
