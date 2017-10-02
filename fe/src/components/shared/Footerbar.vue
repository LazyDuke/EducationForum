<template>
  <footer>
    <div class="container">      
      <div class="footer-time">
        {{ time }}
      </div>
      <div class="footer-info">
        <p>Copyright ©  2017 软工三组</p>
      </div>
    </div>
  </footer>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import moment from 'moment'
@Component({
  created () {
    this.intervalId = setInterval(() => {
      this.showTime()
    }, 1000)
  },
  destoryed () {
    clearInterval(this.intervalId)
  }
})
export default class FooterBar extends Vue {
  time = ''
  intervalId = null
  showTime () {
    let now = moment()
    this.time = now.format('YYYY-MM-DD HH:mm:ss')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
footer {
  position: absolute;
  bottom: 0;
  height: 120px;
  background-color: #324057;
  color: #a4aebd;
  left: 0;
  right: 0;
  top: 320px;
}

.container {
  padding: 30px;  
}


</style>
