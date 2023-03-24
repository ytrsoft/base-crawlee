import { PlaywrightCrawler } from 'crawlee'
import { BASE_URL } from './common/var.js'
import { Menu } from './entities/Menu.js'
import sqlite from './sqlite/index.js'

const LABEL_SEARCH = 'search'
const LABEL_MAX_PAGE = 'max_page'

const startup = new PlaywrightCrawler({
  async requestHandler({ request, page, log }) {
    if (request.label === LABEL_SEARCH) {
      const list = await page.$$eval('.categories.play-tags>a', ($tags) => {
        const items: any = []
        $tags.forEach(($tag) => {
          const label = $tag.textContent
          const href = $tag.getAttribute('href')
          const match = href?.match(/^\/t\/(\d+)\/$/)
          if (/^\/t\/\d+\/$/.test(href || '') && match) {
            items.push({
              text: label,
              type: parseInt(match[1])
            })
          }
        })
        return items
      })
      const reuqests: any[] = []
      list.forEach((item: any) => {
        reuqests.push({
          label: LABEL_MAX_PAGE,
          url: `${BASE_URL}/t/${item.type}-99999/`,
          userData: {
            params: item
          }
        })
      })
      await startup.addRequests(reuqests)
    }
    if (request.label === LABEL_MAX_PAGE) {
      const data: any[] = await page.$$eval('.pagelist li a', ($pages) => {
        return $pages.map(($page) => {
          return $page.textContent
        })
      })
      if (data.length >= 3) {
        const pages = parseInt(data[data.length - 2])
        const params = request.userData.params
        const menu: Menu[] = []
        for (let i = 1; i <= pages; i++) {
          menu.push({
            ...params,
            page: i
          })
        }
        await sqlite.getRepository(Menu).save(menu)
        log.info(params.text + ' = > OK')
      }
    }
  }
})

await startup.addRequests([
  {
    label: LABEL_SEARCH,
    url: `${BASE_URL}/label/sort/`
  }
])

await startup.run()