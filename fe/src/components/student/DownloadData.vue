<template>
  <el-card class="box-card">
    <div slot="header">
      <span class="title">下载资料</span>
    </div>
    <el-row v-for="(DataCategory, index) in DataCategorys" :key="DataCategory" type="flex" justify="space-between" align="middle">
      <el-col style="text-align: left;">
        <el-button @click="DataCategory.dialogVisible = true" type="text">{{DataCategory.title}}</el-button>
        <el-dialog
          :title="DataCategory.title"
          :visible.sync="DataCategory.dialogVisible"
          size="tiny"
          :before-close="handleClose">
          <span>{{ DataCategory.content }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="DataCategory.dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="open(DataCategory)">下 载</el-button>
          </span>
        </el-dialog>
      </el-col>
      <el-col style="text-align: right;">
        <el-icon name="time"></el-icon>
        <span style="margin-left: 10px">{{ DataCategory.date }}</span>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import Component from 'vue-class-component'
import Vue from 'vue'
import { File } from '@/service'

@Component({

})
export default class DownloadData extends Vue {
  directory = 'software/'
  data () {
    return {
      DataCategorys: [
      ]
    }
  }
  async created () {
    let ret = await File.getFile(this.directory)
    for (let index in ret.body) {
      let perfile = ret.body[index]
      let construct = {
        date: '',
        title: '',
        dialogVisible: false
      }
      if (perfile.isDirectory === false) {
        construct.date = perfile.date
        construct.title = perfile.file
        this.DataCategorys.push(construct)
      }
    }
  }
  open (selectedData) {
    // window.location.href = selectedData.address
    selectedData.dialogVisible = false
    window.open('http://localhost:4000/api/uploadfile/download?filename=' + selectedData.title + '&path=' + this.directory, 'download')
  }
  handleClose (done) {
    this.$confirm('确认关闭？')
      .then(_ => {
        done()
      })
      .catch(_ => {})
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
