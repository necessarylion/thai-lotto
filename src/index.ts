import { type CheerioAPI, load } from 'cheerio'
import { type ThaiLottoResult } from './interface'

const scrapeText = (api: CheerioAPI) => (selector: string) =>
  api(selector).map((_, element) => api(element).text()).toArray()

export class ThaiLotto {
  public async getResult (date: Date): Promise<ThaiLottoResult> {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear() + 543)
    const targetId = `${day}${month}${year}`
    const url = `https://news.sanook.com/lotto/check/${targetId}`

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
        thrid: {
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
}
