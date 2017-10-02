<template>
  <div id="app">
    <el-row>
     <header-bar></header-bar>
    </el-row>    
    <el-row>
     <router-view></router-view>
    </el-row>
    <el-row>
     <footer-bar></footer-bar>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import HeaderBar from '@/components/shared/HeaderBar'
import FooterBar from '@/components/shared/FooterBar'
import Component from 'vue-class-component'

@Component({
  components: {
    HeaderBar,
    FooterBar
  }
})
export default class App extends Vue {
  name = 'app'
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;  
}

html, body, div {
  margin: 0;
  padding: 0;
}
body {
  overflow-x: hidden;
}

</style>

