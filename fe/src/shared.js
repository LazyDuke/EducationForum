import Vue from 'vue'
import { User, Message } from '@/service'
let shared = new Vue({
  async created () {
    //
  },
  data () {
    return {  // shared组件共享数据
      message: {
        list: [],
        unread: 0
      },
      user: {
        username: '',
        realname: '',
        uid: '',
        role: '',
        email: '',
        phone: '',
        gender: '',
        institute: '',
        post: '',
        pic: ''
      },
      isLogin: false, //  登录标志，未登录为false，登录为true
      cid: 'C101' // 软件工程课程id
    }
  },
  methods: {
    async init () { // 页面初始化函数
      try {
        await Message.init()
        let result = await User.init() // 后端查询初始化状态
        if (!result.code) {
          console.log('login success')
          this.user.username = result.body.username
          this.user.realname = result.body.realname
          this.user.email = result.body.email
          this.user.uid = result.body.uid
          this.user.role = result.body.role.name
          this.user.gender = result.body.gender
          this.user.phone = result.body.phone
          this.user.institute = result.body.institute
          this.user.post = result.body.post
          this.user.pic = result.body.pic
          if (this.user.role === 'teacher') { // 判断角色，并转化为汉字
            this.user.role = '教师'
          } else if (this.user.role === 'student') {
            this.user.role = '学生'
          } else if (this.user.role === 'administrator') {
            this.user.role = '管理员'
          }
          this.isLogin = true
        }
      } catch (e) {
        console.log(e)
      }
    },
    resetUser () {  // 重置各项参数
      this.user.username = ''
      this.user.realname = ''
      this.user.uid = ''
      this.user.role = ''
      this.user.gender = ''
      this.user.phone = ''
      this.user.email = ''
      this.isLogin = false
    }
  }
})
window.shared = shared
export default shared
