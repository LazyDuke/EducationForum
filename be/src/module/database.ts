import {createConnection, Connection} from 'typeorm'
import * as path from 'path'
import {config} from './config'

let connection: Connection = null
export async function getConnection () {
  if (connection === null) {
    connection = await createConnection({
      driver: config.database,
      entities: [
        path.join(path.resolve(__dirname, '..'), 'entity', '*.js')
      ],
      autoSchemaSync: true
    })
  }
  return connection
}
