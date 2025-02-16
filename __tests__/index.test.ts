import { ThaiLotto } from '../src'

describe('index', () => {
  it('should work', async () => {
    const thaiLotto = new ThaiLotto()
    const date = new Date('2025-02-01')
    const res = await thaiLotto.getResult(date)
    expect(res.data).toBeDefined()
    expect(res.date).toBe(date)
  })
})