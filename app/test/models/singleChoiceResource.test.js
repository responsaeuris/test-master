const sut = require('../../models/singleChoiceResource')

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

describe('results', () => {
  it('spits a single choice', () => {
    const actual = sut.toSingle('hi')

    expect(actual.text).toBeDefined()
    expect(actual.text).toEqual('hi')
    expect(actual.payload).toBeDefined()
    expect(actual.payload).toEqual({})

    expect(actual.actionTitle).not.toBeDefined()
    expect(actual.imageUrl).not.toBeDefined()
    expect(actual.galleryUrls).not.toBeDefined()
  })

  it('throws an exception if a converter is not defined for complex objects', () => {
    expect.assertions(1)

    try {
      sut.toSingle({})
    } catch (e) {
      expect(e.toString()).toEqual('Error: missing converter')
    }
  })

  it('converts complex objects with a valid converter', () => {
    const converter = (data) => ({ text: data.prop.value, payload: data.p })
    const actual = sut.toSingle(
      {
        prop: { value: 'some-value' },
        p: { someKey: 'another-value' },
      },
      converter
    )

    expect(actual.text).toEqual('some-value')
    expect(actual.payload).toEqual({ someKey: 'another-value' })
  })

  describe('invalid convertions', () => {
    const defaultInput = {
      prop: { value: 'some-value' },
      p: { someKey: 'another-value' },
    }

    const doCheck = (converter, expectedErrorMsg, input = defaultInput) => {
      expect.assertions(1)

      try {
        sut.toSingle(input, converter)
      } catch (e) {
        expect(e.toString()).toEqual(expectedErrorMsg)
      }
    }

    describe('text', () => {
      it('missing property', () => {
        const converter = (data) => ({ missing_text: data.prop.value, payload: data.p })
        doCheck(converter, "Error: invalid converter missing 'text' property convertion")
      })

      it('wrong dataType', () => {
        const converter = (data) => ({ text: data.prop, payload: data.p })
        doCheck(converter, "Error: invalid converter 'text' property is not a string")
      })
    })

    describe('payload', () => {
      it('missing property', () => {
        const converter = (data) => ({ text: data.prop.value, no_payload: data.p })
        doCheck(converter, "Error: invalid converter missing 'payload' property convertion")
      })

      it('wrong dataType', () => {
        const converter = (data) => ({ text: data.prop.value, payload: data.p.someKey })
        doCheck(converter, "Error: invalid converter 'payload' property is not an object")
      })
    })
  })
})
