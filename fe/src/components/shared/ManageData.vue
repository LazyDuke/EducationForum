<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <span class="title">资料管理</span>
        <el-button icon="edit" style="float: right;" @click="dialogFormVisible = true" type="primary">上传资料</el-button>
      </div>     
      <el-row v-for="(data, index) in datas" :key="data" type="flex" justify="space-between" align="middle">
        <el-col :span="5">
          <el-button @click="open(index)" style="float: left;" type="text">{{data.caption}}</el-button>
        </el-col>
        <el-col :span="6">
          <span>{{ data.date }}</span>
          <el-button icon="delete" type="danger" size="mini" @click="deleteData(index)" >删 除</el-button>
        </el-col>
      </el-row>     
    </el-card>    

    <el-dialog 
    title="上传资料" 
    :visible.sync="dialogFormVisible"    
    size="tiny">   
      <el-upload
        class="upload"
        drag
        :data="directory"
        :action="url + '/uploadfile/upload' "        
        :auto-upload="false"
        ref="dataupload">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>              
      </el-upload>           
        <el-button type="primary" @click="onSubmit()">上 传</el-button>  
    </el-dialog>  
  </div>
</template>
<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import {File, ServerBase} from '@/service'

@Component({

})
export default class ManageData extends Vue {
  directory = 'software/'
  data () {
    return {
      datas: [],
      dialogFormVisible: false
    }
  }
  url = ''
  async created () {
    this.url = ServerBase
    let ret = await File.getFile(this.directory)
    for (let index in ret.body) {
      let perfile = ret.body[index]
      let construct = {
        date: '',
        caption: ''
      }
      if (perfile.isDirectory === false) {
        construct.date = perfile.date
        construct.caption = perfile.file
        this.datas.push(construct)
      }
    }
  }
  onSubmit () {
    this.$refs['dataupload'].submit()// 手动控制上传不是直接上传，所以先做完输入校验再调用这句
    setTimeout(function () {
      history.go(0)
    }, 1000)
  }
  open (index) {
    this.$alert(this.datas[index].content, this.datas[index].caption, {
      confirmButtonText: '下载',
      callback: async action => {
        // await File.download(this.datas[index].caption, this.directory)
        if (action === 'confirm') {
          window.open(ServerBase + '/uploadfile/download?filename=' + encodeURI(this.datas[index].caption) + '&path=' + this.directory, 'download')
        }
      }
    })
  }
  async deleteData (index) {
    try {
      await File.deletefile(this.datas[index].caption, this.directory)
      this.$message({
        showClose: 'true',
        message: '删除成功',
        type: 'success'
      })
    } catch (error) {
      this.$alert(error)
    }
    this.datas.splice(index, 1)
  }
}
</script>
<style scoped>
.title {
  line-height: 36px;
  font-size: 20px;
  font-weight: bold;
}
</style>
