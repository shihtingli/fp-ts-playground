import { Lens, Optional } from 'monocle-ts'
import { some, none } from 'fp-ts/lib/Option'

interface Street {
  num: number
  name: string
}
interface Address {
  city: string
  street: Street
}
interface Company {
  name: string
  address: Address
}
interface Employee {
  name: string
  company: Company
}

const employee: Employee = {
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

function capitalize(s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1)
}

const employee2 = {
  ...employee,
  company: {
    ...employee.company,
    address: {
      ...employee.company.address,
      street: {
        ...employee.company.address.street,
        name: capitalize(employee.company.address.street.name)
      }
    }
  }
}

console.log(JSON.stringify(employee2, null, 2))

const company = Lens.fromProp<Employee>()('company')
const address = Lens.fromProp<Company>()('address')
const street = Lens.fromProp<Address>()('street')
const name = Lens.fromProp<Street>()('name')

const firstLetter = new Optional<string, string>(
  (s) => (s.length > 0 ? some(s[0]) : none),
  (a) => (s) => a + s.substring(1)
)

console.log(
  JSON.stringify(
    company
      .compose(address)
      .compose(street)
      .compose(name)
      .asOptional()
      .compose(firstLetter)
      .modify((s) => s.toUpperCase())(employee),
    null,
    2
  )
)

// test for Experimental
import * as L from 'monocle-ts/Lens'
import { pipe } from 'fp-ts/function'
import * as O from 'monocle-ts/Optional'

const firstLetterOptional: O.Optional<string, string> = {
  getOption: (s) => (s.length > 0 ? some(s[0]) : none),
  set: (a) => (s) => s.length > 0 ? a + s.substring(1) : s
}
const modifyFunction = (s: string) => s.toLocaleUpperCase()

const firstLetter2 = pipe(
  L.id<Employee>(),
  L.prop('company'),
  L.prop('address'),
  L.prop('street'),
  L.prop('name'),
  L.composeOptional(firstLetterOptional)
)
const firstLetter2UpperCase = O.modify(modifyFunction)(firstLetter2)

console.log(JSON.stringify(firstLetter2UpperCase(employee), null, 2))
