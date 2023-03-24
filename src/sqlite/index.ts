import { log } from 'crawlee'
import { DataSource } from 'typeorm'
import { Menu } from '../entities/Menu.js'
import { Link } from '../entities/Link.js'
import { Video } from '../entities/Video.js'

const sqlite: DataSource = new DataSource({
  type: 'sqlite',
  synchronize: true,
  database: 'src/sqlite/storage.sqlite',
  entities: [
    Menu,
    Link,
    Video
  ]
})

try {
  await sqlite.initialize()
} catch({ message }) {
  log.error(String(message))
}

export default sqlite