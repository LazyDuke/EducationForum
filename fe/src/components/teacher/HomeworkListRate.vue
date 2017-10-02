<template> 
  <el-card>
    <el-row class="head-tab">
      <el-col :span="24">
        <el-breadcrumb style="font-size: 20px;">
          <el-breadcrumb-item :to="{ name: 'HomeworkCategory' }">所有作业</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.params.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row align="muiddle">
      <el-col :span="24">
        <el-table
          :data="tableData"
          border
          max-height="700"
          style="wuidth: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column
            prop="uid"
            label="学号"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column        
            label="作业"
            align="center">
            <template scope="scope">
              <el-button type="text" @click="download(tableData[scope.$index].homework)">{{ scope.row.homework }}</el-button>
            </template>
          </el-table-column>
          <el-table-column      
            label="评分"
            width="202"
            align="center">
            <template scope="scope">
              <el-rate
                :max="4"
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                show-text
                :texts="['不及格', '及格', '良好', '优秀']"
                v-model="tableData[scope.$index].rate"
                @change="submit(scope.$index, tableData[scope.$index].rate)">
              </el-rate>
            </template>
          </el-table-column>
        </el-table>    
      </el-col>
    </el-row>    
  </el-card>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import shared from '@/shared'
import { Homework } from '@/service'
@Component()
export default class HomeworkListRate extends Vue {
  tableData = []
  async submit (index, rate) {
    console.log(this.tableData[index])
    try {
      await Homework.remark(this.tableData[index].id, rate)
      this.$message('评分成功')
    } catch (e) {
      this.$alert('未知的错误发生了')
      console.error(e)
    }
  }
  directory = 'software/' + this.$route.params.title + '/'
  download (filename) {
    window.open('http://localhost:4000/uploadfile/download?filename=' + encodeURI(filename) + '&path=' + this.directory, 'download')
  }
  async mounted () {
    let hws = await Homework.getallfiles(this.$route.params.title, shared.cid)
    for (let index in hws.body) {
      let file = hws.body[index]
      this.tableData.push({
        category: this.$route.params.title,
        date: file.date,
        uid: file.uid,
        rate: file.rate,
        homework: file.filename,
        id: file.id
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.head-tab {
  margin-bottom: 20px;
  margin-left: 20px;
}
</style>
