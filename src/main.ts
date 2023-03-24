import { PlaywrightCrawler } from 'crawlee'
import { BASE_URL } from './common/var.js'
import { Link } from './entities/Link.js'
import { Video } from './entities/Video.js'
import sqlite from './sqlite/index.js'

const videoResp = sqlite.getRepository(Video)
const linkResp = sqlite.getRepository(Link)

const startup = new PlaywrightCrawler({
  async requestHandler({ request, page, log }) {
    const body = await page.waitForSelector('iframe:last-child')
    let frame = await body.contentFrame()
    if (frame != null) {
      frame = await frame.parentFrame()
      if (frame != null) {
        const player = await frame.evaluate(() => {
          return window.player_aaaa
        })
        const params: Link = request.userData.params
        const video: any = {
          flag: player.id,
          m3u8: player.url,
          thumb: params.thumb,
          title: player.vod_data.vod_name,
          tag: player.vod_data.vod_class
        }
        await videoResp.save(video)
        params.locked = 1
        await linkResp.save(params)
        log.info(`${video.title} = > OK`)
      }
    }
  }
})

const links: Link[] = await linkResp.find({
  where: {
    locked: 0
  }
})

const startUrls: any[] = links.map((link: Link) => {
  return {
    userData: {
      params: link
    },
    url: `${BASE_URL}${link.href}`
  }
})

await startup.addRequests(startUrls)

await startup.run()