let cookie = {
  set (k, v) {
    let days = 3
    let date = new Date()
    date.setTime(date.getTime() + days * 24 * 3600 * 1000)
    document.cookie = k + '=' + escape(v) + ';expires=' + date.toGMTString()
    console.log(document.cookie)
  },
  get (name) {
    let arr
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    arr = document.cookie.match(reg)
    if (arr) {
      return unescape(arr[2])
    } else {
      return null
    }
  },
  delete (name) {
    let date = new Date()
    date.setTime(date.getTime() - 1)
    let cval = this.get(name)
    if (cval !== null) {
      document.cookie = name + '=' + cval + ';expires=' + date.toGMTString()
    }
  }
}

export default cookie
