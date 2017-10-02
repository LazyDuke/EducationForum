<template>
  <el-card>
    <el-row>
      <el-dialog
        title="预览"
        :visible.sync="previewdialogVisible"
        size="tiny"
        :before-close="handleClose">
        <h3>{{ preview.title }}</h3>
        <p>用户名:{{ preview.username }}&nbsp&nbsp板块:{{ preview.block }}</p>
        <p v-html="preview.content"></p>                   
        <p v-if="preview.status === 2">删帖原因：{{ preview.reason }}</p>
      </el-dialog>
      <el-tabs v-model="activeName">
        <el-tab-pane label="未审核" name="checking">
          <span v-if="checkingThreads.length !== 0">
            <el-row v-for="(checkingThread, index) in checkingThreads" :key="checkingThread" type="flex" justify="space-between" align="middle">
              <el-col :span="6">
                <el-icon name="time"></el-icon>
                <span style="margin-left: 10px">{{checkingThread.date}}</span>
              </el-col>
              <el-col span='2'>{{checkingThread.block}}</el-col>
              <el-col :span="12" style="text-align: center">
                <el-button @click="openPreview(checkingThread.id)" type="text">{{checkingThread.title}}</el-button>
              </el-col>
              <el-col :span="6">
                <el-button class='button-group' type="success" size="small" icon="check" @click="check(checkingThread, index)">通过</el-button>
                <el-button class='button-group' type="danger" size="small" icon="close" @click="onDelete(checkingThread, index)">不通过</el-button>
                <!--<el-dialog
                  title="审核"
                  :visible.sync="checkingThread.dialogVisible"
                  size="tiny"
                  :before-close="handleClose">
                  <el-form :model="checkingThreads[index]" ref="checkingThreads">        
                    <el-form-item label="原因：" prop="reason">
                      <el-input v-model="checkingThreads[index].reason"></el-input>
                    </el-form-item>                   
                    <el-form-item>        
                      <el-button type="primary" @click="onDelete(checkingThread, index)">确 定</el-button>
                    </el-form-item>
                  </el-form>                   
                </el-dialog>-->
              </el-col>
            </el-row>
          </span>
          <span v-else>
            <div>暂无数据</div>
          </span>
        </el-tab-pane>
        <el-tab-pane label="已审核" name="checked">
          <span v-if="checkedThreads.length !== 0">
            <el-row v-for="(checkedThread, index) in checkedThreads" :key="checkedThread" type="flex" justify="space-between" align="middle">
              <el-col :span="6">
                <el-icon name="time"></el-icon>
                <span style="margin-left: 10px">{{checkedThread.date}}</span>
              </el-col>
              <el-col span='2'>{{checkedThread.block}}</el-col>
              <el-col :span="12" style="text-align: center">
                <el-button @click="openPreview(checkedThread.id)" type="text">{{checkedThread.title}}</el-button>
              </el-col>
              <el-col :span="6">
                <el-button class='button-group' type="warning" icon="star-on" size="small" @click="elite(checkedThread, index)">加 精</el-button>
                <el-button class='button-group' type="danger" icon="delete" size="small" @click="onDelete(checkedThread, index)">删 除</el-button>
              </el-col>
            </el-row>
          </span>
          <span v-else>
            <div>暂无数据</div>
          </span>
        </el-tab-pane>
        <!--<el-tab-pane label="未通过" name="uncheck">
          <span v-if="uncheckThreads.length !== 0">
            <el-row v-for="(uncheckThread, index) in uncheckThreads" key="uncheckThread" type="flex" justify="space-between" align="middle">
              <el-col :span="6">
                <el-icon name="time"></el-icon>
                <span style="margin-left: 10px">{{uncheckThread.date}}</span>
              </el-col>
              <el-col :span="18" style="text-align: center">
                <el-col span='2'>{{uncheckThread.block}}</el-col>
                <el-button @click="openUncheck(index)" type="text">{{uncheckThread.title}}</el-button>
              </el-col>            
            </el-row>
          </span>
          <span v-else>
            <div>暂无数据</div>
          </span>
        </el-tab-pane>-->
        <el-tab-pane label="加精" name="elite">
          <span v-if="eliteThreads.length !== 0">
            <el-row v-for="(eliteThread, index) in eliteThreads" :key="eliteThread" type="flex" justify="space-between" align="middle">
              <el-col :span="6">
                <el-icon name="time"></el-icon>
                <span style="margin-left: 10px">{{eliteThread.date}}</span>
              </el-col>
              <el-col span='2'>{{eliteThread.block}}</el-col>
              <el-col :span="12" style="text-align: center">
                <el-button @click="openPreview(eliteThread.id)" type="text">{{eliteThread.title}}</el-button>
              </el-col>
              <el-col :span="6">
                <el-button type="warning" icon="star-on" size="small" @click="unElite(eliteThread)">取消加精</el-button>
              </el-col>
            </el-row>
          </span>
          <span v-else>
            <div>暂无数据</div>
          </span>
        </el-tab-pane>
        <el-tab-pane label="删除" name="deleted">
          <span v-if="deletedThreads.length !== 0">
            <el-row v-for="(deletedThread, index) in deletedThreads" :key="deletedThread" type="flex" justify="space-between" align="middle">
              <el-col :span="6">
                <el-icon name="time"></el-icon>
                <span style="margin-left: 10px">{{deletedThread.date}}</span>
              </el-col>
              <el-col span='2'>{{deletedThread.block}}</el-col>
              <el-col :span="12" style="text-align: center">
                <el-button @click="openPreview(deletedThread.id)" type="text">{{deletedThread.title}}</el-button>
              </el-col>
              <el-col :span="6">
                <el-button type="success" icon="upload2" size="small" @click="recover(deletedThread, index)">恢复</el-button>
              </el-col>
            </el-row>
          </span>
          <span v-else>
            <div>暂无数据</div>
          </span>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </el-card>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Admin } from '@/service'
@Component()
export default class ThreadManage extends Vue {
  activeName = 'checking'
  preview = {
    previewdialogVisible: false,
    title: '',
    status: '',
    username: '',
    reason: '',
    block: '',
    content: ''
  }
  checkingThreads = [
  ]
  checkedThreads = [
  ]
  uncheckThreads = [
  ]
  eliteThreads = [
  ]
  deletedThreads = [
  ]
  opSuccess () {  // 操作成功统一函数
    this.$message({
      type: 'success',
      message: '操作成功'
    })
  }
  async openPreview (id) {
    try {
      let ret = await Admin.getPreview(id)
      this.preview.title = ret.body.title
      this.preview.username = ret.body.username
      this.preview.reason = ret.body.deleteReason
      this.preview.status = ret.body.status
      this.preview.block = ret.body.list.block
      this.preview.content = ret.body.content
      this.previewdialogVisible = true
    } catch (e) {
      console.error(e)
      this.$alert('未知的错误发生了')
    }
  }
  async mounted () {
    let threads = await Admin.getthreads()
    for (let index in threads.body) {
      let thread = threads.body[index]
      if (thread.status === 0 && thread.elite !== true) {
        this.checkedThreads.push({title: thread.title, date: thread.time, status: thread.status, elite: false, block: thread.list.block, id: thread.id, username: thread.username})
      } else if (thread.status === 1) {
        this.checkingThreads.push({title: thread.title, date: thread.time, status: thread.status, block: thread.list.block, id: thread.id, username: thread.username})
      } else if (thread.status === 2) {
        this.deletedThreads.push({title: thread.title, date: thread.time, status: thread.status, block: thread.list.block, id: thread.id, reason: thread.deleteReason, username: thread.username})
      } else if (thread.status === 0 && thread.elite === true) {
        this.eliteThreads.push({title: thread.title, date: thread.time, status: thread.status, elite: true, block: thread.list.block, id: thread.id, username: thread.username})
      }
    }
  }
  handleClose (done) {
    this.preview.reason = ''
    this.preview.status = ''
    this.preview.title = ''
    this.preview.username = ''
    this.preview.block = ''
    this.preview.content = ''
    done()
  }
  open (Thread) {

  }

  async check (checkingThread, index) {
    try {
      await Admin.accessThread(checkingThread.id)
      this.checkedThreads.push({title: checkingThread.title, date: checkingThread.date, status: checkingThread.status, elite: false, block: checkingThread.block, id: checkingThread.id, username: checkingThread.username})
      this.checkingThreads.splice(index, 1)
      this.opSuccess()
    } catch (e) {
      this.$alert('未知的错误发生了')
      console.error(e)
    }
    // 后续操作
  }
  // async uncheck (checkingThread, index) {
  //   try {
  //     console.log(checkingThread.id)
  //     await Admin.unaccessThread(checkingThread.id, checkingThread.reason)
  //     this.uncheckThreads.push({title: checkingThread.title, date: checkingThread.date, status: checkingThread.status, block: checkingThread.block, id: checkingThread.id, reason: checkingThread.reason})
  //     this.checkingThreads.splice(index, 1)
  //     this.opSuccess()
  //   } catch (e) {
  //     this.$alert('未知的错误发生了')
  //     console.error(e)
  //   }
  //   checkingThread.dialogVisible = false
  // }
  openUncheck (index) {
    this.$alert(this.uncheckThreads[index].reason, '未通过原因', {
      confirmButtonText: '确定'
    })
  }
  async elite (checkedThread, index) {
    try {
      await Admin.addElite(checkedThread.id)
      this.eliteThreads.push({title: checkedThread.title, date: checkedThread.date, status: checkedThread.status, elite: true, block: checkedThread.block, id: checkedThread.id, username: checkedThread.username})
      this.checkedThreads.splice(index, 1)
      this.opSuccess()
    } catch (e) {
      console.error(e)
      this.$alert('未知的错误发生了')
    }
    // 提交给数据库操作
  }
  async unElite (eliteThread, index) {
    try {
      await Admin.deleteElite(eliteThread.id)
      this.checkedThreads.push({title: eliteThread.title, date: eliteThread.date, status: eliteThread.status, elite: false, block: eliteThread.block, id: eliteThread.id, username: eliteThread.username})
      this.eliteThreads.splice(index, 1)
      this.opSuccess()
    } catch (error) {
      console.error(error)
      this.$alert('未知的错误发生了')
    }
    // 提交给数据库操作
  }
  async onDelete (thread, index) {  // 删帖实际上和不通过是一样的
    this.$prompt('删帖原因', '审核', {
      confirmButtonText: '提交'
    }).then(async ({ value }) => {
      try {
        await Admin.deleteThread(thread.id, value)
        this.deletedThreads.push({title: thread.title, date: thread.time, status: thread.status, block: thread.block, id: thread.id, reason: value, username: thread.username})
        if (thread.status === 1) {
          this.checkingThreads.splice(index, 1)
        } else if (thread.status === 0) {
          this.checkedThreads.splice(index, 1)
        }
      } catch (e) {
        console.error(e)
        this.$alert('未知的错误发生了')
      }
    })
    // 提交给数据库操作
  }
  async recover (deletedThread, index) {
    try {
      let ret = await Admin.restoreThread(deletedThread.id)
      this.checkedThreads.push({title: ret.body.title, date: ret.body.time, status: ret.body.status, elite: false, block: deletedThread.block, id: ret.body.id, username: ret.body.username})
      this.deletedThreads.splice(index, 1)
      this.opSuccess()
    } catch (e) {
      this.$alert('未知的错误发生了')
      console.error(e)
    }
    deletedThread.status = 'checked'
     // 提交给数据库操作
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.head-tab {
  margin-bottom: 20px;
  margin-left: 20px;
}
.button-group {
  width: 42%;
}
</style>
