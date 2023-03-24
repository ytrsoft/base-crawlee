import { PlaywrightCrawler } from 'crawlee'
import { BASE_URL } from './common/var.js'
import { Link } from './entities/Link.js'
import { Menu } from './entities/Menu.js'
import sqlite from './sqlite/index.js'

const menuResp = sqlite.getRepository(Menu)
const linkResp = sqlite.getRepository(Link)

const startup = new PlaywrightCrawler({
  async requestHandler({ request, page, log }) {
    const list = await page.$$eval('.list li a', ($list) => {
      const items: any = []
      $list.forEach(($item, index) => {
        if (index !== 0) {
          const href = $item.getAttribute('href')
          const thumb = $item.querySelector('img')?.getAttribute('data-original')
          items.push({ href, thumb })
        }
      })
      return items
    })
    await linkResp.save(list)
    const params: Menu = request.userData.params
    params.locked = 1
    await menuResp.save(params)
    log.info(`${params.text}(${params.page}) = > OK`)
  }
})

const menus: Menu[] = await menuResp.find({
  where: {
    locked: 0
  }
})

const startUrls: any[] = menus.map((menu: Menu) => {
  return {
    userData: {
      params: menu
    },
    url: `${BASE_URL}/t/${menu.type}-${menu.page}/`
  }
})

await startup.addRequests(startUrls)

await startup.run()