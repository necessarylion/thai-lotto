export interface ThaiLottoResult {
  date: Date
  endpoint: string
  data: {
    first: {
      price: string
      numbers: string[]
    }
    second: {
      price: string
      numbers: string[]
    }
    third: {
      price: string
      numbers: string[]
    }
    fourth: {
      price: string
      numbers: string[]
    }
    fifth: {
      price: string
      numbers: string[]
    }
    last2: {
      price: string
      numbers: string[]
    }
    last3f: {
      price: string
      numbers: string[]
    }
    last3b: {
      price: string
      numbers: string[]
    }
    near1: {
      price: string
      numbers: string[]
    }
  }
}
