import {DriverOptions} from 'typeorm'
interface IConfig {
  database: DriverOptions,
  port: number,
  sessionKey: string
}
let config: IConfig
try {
  config = require('../../config/config')
} catch (e) {
  console.log('未能载入配置文件. 载入示例配置文件.')
  config = require('../../config/config.example')
}

export {
  config
}
