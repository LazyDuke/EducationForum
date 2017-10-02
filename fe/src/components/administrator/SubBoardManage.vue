<template>
  <el-card class="box-card">
    <div slot="header">
      <el-button icon="arrow-left" style="float: left;" @click="$router.go(-1)" type="primary">返回</el-button>
      <span class="title">{{$route.params.boardname}}</span>
      <el-button icon="edit" style="float: right;" @click="dialogFormVisible = true" type="primary">增加子板块</el-button>
    </div>
    <span v-if="subBoards.length !== 0">     
      <el-row v-for="(subBoard, index) in subBoards" :key="subBoard" type="flex" justify="space-between" align="middle">
        <el-col :span="5">
          <el-button style="float: left;" type="text">{{subBoard.name}}</el-button>
        </el-col>
        <el-col :span="2">        
          <el-button icon="delete" type="danger" size="mini" @click="deleteSubBoard(index)" >删 除</el-button>
        </el-col>
      </el-row>
    </span>
    <span v-else>
      <div>暂无数据</div>
    </span>
    <el-dialog 
      title="增加子板块" 
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      size="tiny">
      <el-form :model="subBoard" :rules="subBoardRules" ref="subBoards">        
        <el-form-item label="板块名：" prop="name">
          <el-input v-model="subBoard.name"></el-input>
        </el-form-item>
        <el-upload
          class="upload"
          drag
          :action="imageAddress"          
          :auto-upload="false"
          :on-preview="handlePreview"
          ref="imgUpload"
          accept="image/*">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将板块图片拖到此处，或<em>点击上传</em>,图片小于30kb</div>              
        </el-upload> 
        <el-form-item>        
          <el-button type="primary" @click="onSubmit('subBoards')">确 定</el-button>
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
export default class SubBoardManage extends Vue {
  dialogFormVisible = false
  imageAddress = '' // 服板块的不同，上传图片也有所不同
  subBoard = {
    name: ''
  }
  subBoards = []
  subBoardRules = {
    name: [
      {required: true, message: '子板块名不能为空', trigger: 'blur'}
    ]
  }
  async mounted () {
    let blocks = await Block.getBlock(this.$route.params.boardname)
    console.log(blocks)
    for (let index in blocks.body) {
      let block = blocks.body[index]
      this.subBoards.push({name: block.name, id: block.id})
    }
  }
  handlePreview (file) {
    let reader = new FileReader()
    reader.readAsDataURL(file.raw)
    reader.onloadend = (e) => {
      console.log(reader.result)
    }
  }
  deleteSubBoard (index) {
    // 删除操作
    try {
      this.$confirm('这个操作将会删除板块下所有贴子，且无法恢复，确定要删除吗', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await Block.deleteBlock(this.subBoards[index].id)
        this.subBoards.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      })
    } catch (e) {
      this.$alert('未知的错误发生了')
      console.error(e)
    }
  }
  onSubmit (formName) {
    // 提交操作
    if (this.$refs['imgUpload'].uploadFiles.length > 1) {
      this.$alert('只能上传一个文件')
      return
    }
    if (this.$refs['imgUpload'].uploadFiles[0].raw.size > 30720) {
      this.$alert('图片太大了')
      return
    }
    // if (this.$refs['imgUpload'].uploadFiles[0].raw !== 'image/png') {
    //   this.$alert('请上传图片格式的文件')
    //   return
    // }
    console.log(this.$refs['imgUpload'].uploadFiles[0].raw)
    let reader = new FileReader()
    reader.readAsDataURL(this.$refs['imgUpload'].uploadFiles[0].raw)
    reader.onloadend = async (e) => {
      let pic = reader.result
      let newblock = await Block.createBlock(this.$route.params.boardname, this.subBoard.name, pic)
      this.subBoards.push({name: newblock.body.name, id: newblock.body.id})
      this.dialogFormVisible = false
      this.$message({
        type: 'success',
        message: '创建成功'
      })
    }
  }
  handleClose (done) {
    this.$confirm('是否放弃已输入的内容？')
      .then(_ => {
        done()
        this.$refs['imgUpload'].resetFields()
      })
      .catch(_ => {})
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
