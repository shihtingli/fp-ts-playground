import * as T from 'fp-ts/lib/Task'
import { resolve } from 'path'

const a = async () => {
  return 'a'
}

const b = T.of('b')

a().then((res) => console.log(res))
b().then((res) => console.log(res))

const c = async () => {
  return new Promise((resolve) => {
    resolve('c')
  })
}

c().then((res) => console.log(res))

const d = async () => {
  const count = (t: string, s: number) => {
    return new Promise((resolve) => {
      let a = 0
      let timer = setInterval(() => {
        console.log(`${t}${a}`)
        a = a + 1
        if (a > 5) {
          clearInterval(timer)
          resolve('') // 表示完成
        }
      }, s)
    })
  }

  console.log(1)
  await count('haha', 1000)
  console.log(2)
}
d()
