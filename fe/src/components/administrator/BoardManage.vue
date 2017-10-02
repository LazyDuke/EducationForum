<template>
  <el-card class="box-card">
    <div slot="header">
      <span class="title">板块管理</span>
      <el-button icon="edit" style="float: right;" @click="dialogFormVisible = true" type="primary">增加板块</el-button>
    </div>     
    <el-row v-for="(board, index) in boards" :key="board" type="flex" justify="space-between" align="middle">
      <el-col :span="5">
        <el-button style="float: left;" type="text" @click="$router.push({name: 'SubBoardManage', params: { boardname: board.name }})">{{board.name}}</el-button>
      </el-col>
      <el-col :span="2">        
        <el-button icon="delete" type="danger" size="mini" @click="deleteBoard(index)" >删 除</el-button>
      </el-col>
    </el-row>
    <el-dialog 
      title="增加板块" 
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      size="tiny">
      <el-form :model="board" :rules="boardRules" ref="Boards">        
        <el-form-item label="板块名：" prop="name">
          <el-input v-model="board.name"></el-input>
        </el-form-item>          
        <el-form-item>        
          <el-button type="primary" @click="onSubmit(board.name)">确 定</el-button>
        </el-form-item>
      </el-form>   
    </el-dialog>   
  </el-card>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Block } from '@/service'
@Component()
export default class BoardManage extends Vue {
  dialogFormVisible = false
  board = {
    name: ''
  }
  boards = []
  boardRules = {
    name: [
      {required: true, message: '板块名不能为空', trigger: 'blur'}
    ]
  }
  async deleteBoard (index) {
    // 删除操作
    this.$confirm('这个操作将会删除板块下所有子版块和贴子，且无法恢复，确定要删除吗', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      try {
        await Block.deleteBlockList(this.boards[index].id)
        this.boards.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      } catch (e) {
        this.$alert('未知的错误发生了')
        console.error(e)
      }
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消'
      })
    })
  }
  async onSubmit (blockname) {
    console.log(blockname)
    await Block.createBlockList(blockname)
    this.$refs['Boards'].resetFields()
    this.dialogFormVisible = false
    this.$message({
      type: 'success',
      message: '创建成功'
    })
    this.boards.push({name: blockname, id: this.boards[this.boards.length - 1].id + 1})
  }
  handleClose (done) {
    this.$confirm('是否放弃已输入的内容？', '系统提示')
      .then(_ => {
        done()
        this.$refs['Boards'].resetFields()
      })
      .catch(_ => {})
  }
  async mounted () {
    let blocklists = await Block.getblocklist()
    for (let index in blocklists.body) {
      let blocklist = blocklists.body[index]
      this.boards.push({name: blocklist.name, id: blocklist.id})
    }
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
