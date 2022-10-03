import { Iso } from 'monocle-ts'

const mTokm = new Iso<number, number>(
  (m) => m / 1000,
  (km) => km * 1000
)

console.log(mTokm.get(100)) // => 0.1
console.log(mTokm.reverseGet(1.2)) // => 1200

const kmToMile = new Iso<number, number>(
  (km) => km / 1.60934,
  (miles) => miles * 1.60934
)

// composition
const mToMile = mTokm.compose(kmToMile)

console.log(mToMile.get(100))

const Mile2m = kmToMile.reverseGet(1)

// example 2
type Person = {
  name: string
  hobbies?: string[]
}
type Coder = Person & { languages?: string[] }
const personToCoder = new Iso<Person, Coder>(
  (person) => person,
  (coder) => {
    const { languages, ...rest } = coder
    return rest
  }
)
const newCoder = personToCoder.modify((_) => _)({ name: 'Steve' })

console.log(newCoder.name) // "Steve"
const newCoderSteve = personToCoder.get({ name: 'Steve' })
const SteveWasntCoder = personToCoder.reverseGet(newCoderSteve)
