import { ThaiLotto } from '../src'

describe('ThaiLotto', () => {
  it('should get result', async () => {
    const thaiLotto = new ThaiLotto()
    const date = new Date('2025-02-16')
    const res = await thaiLotto.getResult(date)
    expect(res?.data).toBeDefined()
    expect(res?.data.first.numbers[0]).toBe('847377')
    expect(res?.date).toBe(date)
  }, 30000)

  it('should get array list greater than 0', async () => {
    const thaiLotto = new ThaiLotto()
    const res = await thaiLotto.getList(1)
    expect(res.length).toBeGreaterThan(0)
  }, 30000)

  it('should get latest result', async () => {
    const thaiLotto = new ThaiLotto()
    const res = await thaiLotto.getLatest()
    expect(res?.data).toBeDefined()
    expect(res?.date).toBeDefined()
  }, 30000)
})