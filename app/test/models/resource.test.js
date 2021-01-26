const sut = require('../../models/resource')

describe('inputType', () => {
  it('detect strings', () => {
    const actual = sut.inputType('hi')

    expect(actual.isString).toEqual(true)
    expect(actual.isComplex).toEqual(false)
  })

  it('detect objects', () => {
    const actual = sut.inputType({})

    expect(actual.isString).toEqual(false)
    expect(actual.isComplex).toEqual(true)
  })
})
