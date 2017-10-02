export function delay (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}
export function range (start, end = null, step = 1) {
  return {
    [Symbol.iterator] () {
      if (end === null) {
        end = start
        start = 0
      }
      let i = start
      const iterator = {
        next () {
          const r = {
            done: i >= end,
            value: i
          }
          i += step
          return r
        }
      }
      return iterator
    }
  }
}
