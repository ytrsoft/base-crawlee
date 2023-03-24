import { log } from 'crawlee'
import { DataSource } from 'typeorm'
import { User } from '../entities/User.js'

const sqlite: DataSource = new DataSource({
  type: 'sqlite',
  synchronize: true,
  database: 'src/sqlite/storage.sqlite',
  entities: [
    User
  ]
})

try {
  await sqlite.initialize()
} catch({ message }) {
  log.error(String(message))
}

export default sqlite