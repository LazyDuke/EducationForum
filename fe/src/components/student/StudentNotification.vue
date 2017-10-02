<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="title">教务通知</span>
    </div>
    <div class="text item notifications clearfix" v-for="(notification, index) in notifications" :key="notification">
      <el-button @click="open(index)" style="float: left;" type="text">{{notification.caption}}</el-button>
      <span style="float: right; line-height: 28px;">{{ notification.date }}</span>
    </div>
  </el-card>
</template>
<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import moment from 'moment'
import { Notify } from '@/service'
import shared from '@/shared'

@Component({

})
export default class StudentNotification extends Vue {
  data () {
    return {
      notifications: []
    }
  }
  async created () {
    try {
      // await shared.init()
      let notifys = await Notify.getnotify(shared.cid)
      for (let notify in notifys.body) {
        this.notifications.push({caption: notifys.body[notify].caption, content: notifys.body[notify].content, date: moment().format('YYYY-MM-DD')})
      }
    } catch (error) {
      this.$alert('未知的错误发生了')
    }
  }
  open (index) {
    this.$alert(this.notifications[index].content, this.notifications[index].caption, {
      confirmButtonText: '确定'
    })
  }
}
</script>
<style scoped>
.text {
  font-size: 14px;
  text-align: left;
}

.title {
  line-height: 36px;
  font-size: 20px;
  font-weight: bold;
}

.item {
  padding: 10px 0;
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
