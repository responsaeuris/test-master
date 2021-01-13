const sut = require('../../models/resource')

describe('parsing', () => {
  it('detect strings', () => {
    const actual = sut.parse('hi')

    expect(actual.isString).toEqual(true)
    expect(actual.isComplex).toEqual(false)
  })

  it('detect objects', () => {
    const actual = sut.parse({})

    expect(actual.isString).toEqual(false)
    expect(actual.isComplex).toEqual(true)
  })
})
