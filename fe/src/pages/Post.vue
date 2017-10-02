<template>
  <div class="test">
    <el-row>
      <el-col :span="24">
        <home-nav-bar></home-nav-bar>
      </el-col>
    </el-row>    
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <el-form ref="thread" :model="thread" :rules="capRule">
          <el-form-item label="标 题：" prop="title">
            <el-input v-model="thread.title"></el-input>
          </el-form-item>    
        </el-form>         
        <quill-editor
          class="myquill"           
          v-model="thread.content"
          ref="myQuillEditor"
          :options="editorOption">
        </quill-editor>
        <el-row class="buttongroup"> 
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit('thread')">发 表</el-button>
        </el-row>        
      </el-col>
    </el-row>    
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { quillEditor } from 'vue-quill-editor'

import HomeNavBar from '@/components/shared/HomeNavBar'
import { Thread } from '@/service'
@Component({
  components: {
    HomeNavBar,
    quillEditor
  }
})

export default class thread extends Vue {
  data () {
    return {
      thread: {
        title: '',
        content: ''
      },
      capRule: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ]
      },
      editorOption: {
        placeholder: '请输入帖子内容...',
        theme: 'snow'
      }
    }
  }
  get editor () {
    return this.$refs.myQuillEditor.quill
  }
  onCancel () {
    this.$confirm('是否放弃已输入的内容？')
      .then(_ => {
        this.$router.go(-1)
      })
      .catch(_ => {})
  }
  onSubmit (formName) {
    this.$refs[formName].validate(async (valid) => {
      if (valid) {
        // 提交逻辑补充
        try {
          await Thread.newthread(this.thread.title, this.thread.content, this.$route.params.blockname)
          this.$alert('发表成功，等待管理员审核', {
            callback: action => {
              this.$router.go(-1)
            }
          })
          setTimeout(() => {
            this.$router.go(-1)
          }, 5000)
        } catch (error) {
          // console.log(error)
          this.$alert('未知的错误发生了', {
            callback: action => {
              this.$router.push('/')
            }
          })
        }
      } else {
        this.$alert('输入不符合要求，请重新输入后再发表。', '系统提示', {
          confirmButtonText: '确定'
        })
        return false
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.myquill {
  height: 300px;
}

.buttongroup {
  margin-top: 80px;
}
</style>
