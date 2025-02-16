# Thai Lott Result

```ts
import { ThaiLotto } from 'thai-lotto'
const thaiLotto = new ThaiLotto()

// get result from specific date
const date = new Date('2025-02-01')
const result = await thaiLotto.getResult(date)

// get list of announcement date 
const list = await thaiLotto.getList()

// get latest result
const latest = await thaiLotto.getLatest()
```

| Function | Description |
| ------------- |:-------------|
| getResult | get result from specific date |
| getLatest | get latest result |
| getList | get list of announcement date |

Note: Thai Lott Result is based on [Sanook](https://news.sanook.com/lotto/)
