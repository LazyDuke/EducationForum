import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'

import Home from '@/pages/Home'

import PostList from '@/pages/PostList'
import Post from '@/pages/Post'
import SinglePost from '@/pages/SinglePost'
import Homework from '@/pages/Homework'

import Application from '@/pages/Application'

import Board from '@/pages/Board'

import PersonalMessage from '@/pages/PersonalMessage'

import TeaAndAdminNotification from '@/components/shared/TeaAndAdminNotification'
import TeaAndStuPostedThread from '@/components/shared/TeaAndStuPostedThread'
import ManageData from '@/components/shared/ManageData'
import Compose from '@/components/shared/Compose'
import DetailCompose from '@/components/shared/DetailCompose'

import Administrator from '@/pages/Administrator'
import AccountManage from '@/components/administrator/AccountManage'
import BoardManage from '@/components/administrator/BoardManage'
import SubBoardManage from '@/components/administrator/SubBoardManage'
import ThreadManage from '@/components/administrator/ThreadManage'

import Teacher from '@/pages/Teacher'
import HomeworkListRate from '@/components/teacher/HomeworkListRate'
import HomeworkCategory from '@/components/teacher/HomeworkCategory'
import TeacherProgress from '@/components/teacher/TeacherProgress'

import Student from '@/pages/Student'
import StudentNotification from '@/components/student/StudentNotification'
import UploadHomework from '@/components/student/UploadHomework'
import DownloadData from '@/components/student/DownloadData'
import StudentProgress from '@/components/student/StudentProgress'

import Test from '@/pages/Test'

Vue.use(Router)
Vue.use(Resource)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/postlist/:block',
      name: 'PostList',
      component: PostList
    },
    {
      path: '/post/:blockname',
      name: 'Post',
      component: Post
    },
    {
      path: '/singlepost/:threadid',
      name: 'SinglePost',
      component: SinglePost
    },
    {
      path: '/board',
      name: 'Board',
      component: Board
    },
    {
      path: '/homework',
      name: 'Homework',
      component: Homework
    },
    {
      path: '/application',
      name: 'Application',
      component: Application
    },
    {
      path: '/administrator/:uid',
      component: Administrator,
      children: [
        {path: '', name: 'Administrator', component: TeaAndAdminNotification},
        {path: 'adminnotification', name: 'AdminNotification', component: TeaAndAdminNotification},
        {path: 'accountmanage/:role', name: 'AccountManage', component: AccountManage},
        {path: 'adminmanagedata', name: 'AdminManageData', component: ManageData},
        {path: 'boardmanage', name: 'BoardManage', component: BoardManage},
        {path: 'subboardmanage/:boardname', name: 'SubBoardManage', component: SubBoardManage},
        {path: 'threadmanage', name: 'ThreadManage', component: ThreadManage},
        {path: 'compose', name: 'Compose', component: Compose},
        {path: 'detailcompose/:id', name: 'DetailCompose', component: DetailCompose}
      ]
    },
    {
      path: '/teacher/:uid',
      component: Teacher,
      children: [
        {path: '', name: 'Teacher', component: TeaAndAdminNotification},
        {path: 'teachernotification', name: 'TeacherNotification', component: TeaAndAdminNotification},
        {path: 'homeworklistrate/:title', name: 'HomeworkListRate', component: HomeworkListRate},
        {path: 'homeworkcategory', name: 'HomeworkCategory', component: HomeworkCategory},
        {path: 'teacherpostedthread', name: 'TeacherPostedThread', component: TeaAndStuPostedThread},
        {path: 'teachermanagedata', name: 'teacherManageData', component: ManageData},
        {path: 'teacherprogress', name: 'TeacherProgress', component: TeacherProgress},
        {path: 'compose', name: 'Compose', component: Compose},
        {path: 'detailcompose/:id', name: 'DetailCompose', component: DetailCompose}
      ]
    },
    {
      path: '/student/:uid',
      component: Student,
      children: [
        {path: '', name: 'Student', component: StudentNotification},
        {path: 'studentnotification', name: 'StudentNotification', component: StudentNotification},
        {path: 'uploadhomework', name: 'UploadHomework', component: UploadHomework},
        {path: 'downloaddata', name: 'DownloadData', component: DownloadData},
        {path: 'studentpostedthread', name: 'StudentPostedThread', component: TeaAndStuPostedThread},
        {path: 'studentprogress', name: 'StudentProgress', component: StudentProgress},
        {path: 'compose', name: 'Compose', component: Compose},
        {path: 'detailcompose/:id', name: 'DetailCompose', component: DetailCompose}
      ]
    },
    {
      path: '/personalMessage/:username',
      name: 'PersonalMessage',
      component: PersonalMessage
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    }
  ]
})
