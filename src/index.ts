import { type CheerioAPI, load } from 'cheerio'
import { type ThaiLottoResult } from './interface'

const urls = {
  list: 'aHR0cHM6Ly9hcGkuYWxsb3JpZ2lucy53aW4vcmF3P3VybD1odHRwczovL25ld3Muc2Fub29rLmNvbS9sb3R0by9hcmNoaXZlL3BhZ2Uv',
  check: 'aHR0cHM6Ly9hcGkuYWxsb3JpZ2lucy53aW4vcmF3P3VybD1odHRwczovL25ld3Muc2Fub29rLmNvbS9sb3R0by9jaGVjay8='
}

function getUrl (type: keyof typeof urls): string {
  const encodedUrl = urls[type]
  const decodedUrl = atob(encodedUrl)
  return decodedUrl
}

const scrapeText = (api: CheerioAPI) => (selector: string) =>
  api(selector).map((_, element) => api(element).text()).toArray()

export class ThaiLotto {
  public async getResult (date: Date): Promise<ThaiLottoResult | undefined> {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear() + 543)
    const targetId = `${day}${month}${year}`
    const url = `${getUrl('check')}${targetId}`

    const html = load(await fetch(url).then(async res => await res.text()))
    const scraper = scrapeText(html)

    const [
      prizeFirst,
      prizeFirstNear,
      prizeSecond,
      prizeThird,
      prizeFourth,
      prizeFifth,
      runningNumberFrontThree,
      runningNumberBackThree,
      runningNumberBackTwo
    ] = await Promise.all([
      scraper(
        '#contentPrint > div.lottocheck__resize > div.lottocheck__sec.lottocheck__sec--bdnone > div.lottocheck__table > div:nth-child(1) > strong.lotto__number'
      ),
      scraper(
        '#contentPrint > div.lottocheck__resize > div.lottocheck__sec.lottocheck__sec--bdnone > div.lottocheck__sec--nearby > strong.lotto__number'
      ),
      scraper(
        '#contentPrint > div.lottocheck__resize > div:nth-child(2) > div > span.lotto__number'
      ),
      scraper(
        '#contentPrint > div.lottocheck__resize > div:nth-child(3) > div > span'
      ),
      scraper(
        '#contentPrint > div.lottocheck__resize > div.lottocheck__sec.lottocheck__sec--font-mini.lottocheck__sec--bdnoneads > div.lottocheck__box-item > span.lotto__number'
      ),
      scraper(
        '#contentPrint > div.lottocheck__resize > div:nth-child(7) > div > span.lotto__number'
      ),
      scraper(
        '#contentPrint > div.lottocheck__resize > div.lottocheck__sec.lottocheck__sec--bdnone > div.lottocheck__table > div:nth-child(2) > strong.lotto__number'
      ),
      scraper(
        '#contentPrint > div.lottocheck__resize > div.lottocheck__sec.lottocheck__sec--bdnone > div.lottocheck__table > div:nth-child(3) > strong.lotto__number'
      ),
      scraper(
        '#contentPrint > div.lottocheck__resize > div.lottocheck__sec.lottocheck__sec--bdnone > div.lottocheck__table > div:nth-child(4) > strong.lotto__number'
      )
    ])

    // no result yet
    if (prizeFirst[0] === 'xxxxxx') return

    return {
      date,
      endpoint: url,
      data: {
        first: {
          price: '6000000.00',
          numbers: prizeFirst
        },
        second: {
          price: '200000.00',
          numbers: prizeSecond
        },
        third: {
          price: '80000.00',
          numbers: prizeThird
        },
        fourth: {
          price: '80000.00',
          numbers: prizeFourth
        },
        fifth: {
          price: '20000.00',
          numbers: prizeFifth
        },
        last2: {
          price: '2000.00',
          numbers: runningNumberBackTwo
        },
        last3f: {
          price: '4000.00',
          numbers: runningNumberFrontThree
        },
        last3b: {
          price: '4000.00',
          numbers: runningNumberBackThree
        },
        near1: {
          price: '100000.00',
          numbers: prizeFirstNear
        }
      }
    }
  }

  public async getLatest (): Promise<ThaiLottoResult | undefined> {
    const list = await this.getList()
    const firstList = list[0]
    const res1 = await this.getResult(firstList.date)
    if (res1) return res1
    const secondList = list[1]
    return await this.getResult(secondList.date)
  }

  public async getList (page: number = 1): Promise<Array<{
    id: string
    url: string
    date: Date
  }>> {
    const $ = load(
      await fetch(`${getUrl('list')}${page}`).then(async res =>
        await res.text()
      )
    )
    const res = $(
      'div.box-cell.box-cell--lotto.content > div > div > div > article.archive--lotto'
    ).map((_, element) => {
      const linkElement = $('div > div > a', element)
      const id = linkElement.attr('href')?.split('/')[5]
      const yearString = id?.slice(4, 8) ?? '0'
      const year = parseInt(yearString) - 543
      const date = new Date(`${year}-${id?.slice(2, 4)}-${id?.slice(0, 2)}`)
      return {
        id: id ?? '',
        url: `https://news.sanook.com/lotto/check/${id}`,
        date
      }
    })
      .toArray()
      .filter(item => {
        // remove the item which date is greater than today (comparing dates only)
        const today = new Date()
        const todayDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
        return item.date.getTime() <= todayDate.getTime()
      })

    return res
  }
}
