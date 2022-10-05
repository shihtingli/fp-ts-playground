import { pipe } from 'fp-ts/lib/function'
import { Lens } from 'monocle-ts'

export interface Street {
  num: number
  name: string
}
export interface Address {
  city: string
  street: Street
}
export interface Company {
  name: string
  address: Address
}
export interface Employee {
  name: string
  company: Company
}

export const employee: Employee = {
  name: 'john',
  company: {
    name: 'awesome inc',
    address: {
      city: 'london',
      street: {
        num: 23,
        name: 'high street'
      }
    }
  }
}

const company = new Lens<Employee, Company>(
  (s) => s.company,
  (a) => (s) => ({ ...s, company: a })
)

console.log(JSON.stringify(company.get(employee), null, 2))

const address = new Lens<Company, Address>(
  (s) => s.address,
  (a) => (s) => ({ ...s, address: a })
)
const street = new Lens<Address, Street>(
  (s) => s.street,
  (a) => (s) => ({ ...s, street: a })
)
const name = new Lens<Street, string>(
  (s) => s.name,
  (a) => (s) => ({ ...s, name: a })
)

// composition
const streetLens = company.compose(address).compose(street)
export const nameLens = streetLens.compose(name)

console.log(JSON.stringify(nameLens.get(employee), null, 2))

const employee2 = nameLens.modify((a) => a.toUpperCase())(employee)

console.log(JSON.stringify(employee2, null, 2))

const employee3 = nameLens.set('low street')(employee)

console.log(JSON.stringify(employee3, null, 2))

const numLens = streetLens.compose(
  new Lens<Street, number>(
    (s) => s.num,
    (a) => (s) => ({ ...s, num: a })
  )
)

console.log(JSON.stringify(numLens.set(42)(employee), null, 2))

// generation
type PersonType = {
  name: string
  age: number
}

const person: PersonType = { name: 'Giulio', age: 42 }

const age = Lens.fromProp<PersonType>()('age')

console.log(age.set(43)(person)) // => { name: 'Giulio', age: 43 }

//compose all set

type PersonType2 = {
  name: string
  age: number
  address: Address
}

const changePerson =
  (age: number) =>
  (streetName: string) =>
  (person: PersonType2): PersonType2 =>
    pipe(
      person,
      Lens.fromProp<PersonType2>()('age').set(age),
      Lens.fromPath<PersonType2>()(['address', 'street', 'name']).set(streetName)
    )

const ST: PersonType2 = {
  name: 'ST',
  age: 18,
  address: {
    city: 'Hsin-Chu',
    street: {
      num: 1,
      name: 'happy'
    }
  }
}
console.log(changePerson(40)('sad')(ST))
