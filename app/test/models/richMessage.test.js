const sut = require('../../models/richMessage')

describe('results', () => {
  it('spits a richMessage with a single text', () => {
    const actual = sut.toRich('hi')

    expect(actual.text).toBeDefined()
    expect(actual.text).toEqual('hi')

    expect(Object.keys(actual).length).toEqual(1)

    expect(actual.description).not.toBeDefined()
    expect(actual.image_url).not.toBeDefined()
    expect(actual.gallery_urls).not.toBeDefined()
  })

  it('throws an exception if a converter is not defined for complex objects', () => {
    expect.assertions(1)

    try {
      sut.toRich({})
    } catch (e) {
      expect(e.toString()).toEqual('Error: missing converter')
    }
  })

  it('converts complex objects with a valid converter', () => {
    const converter = (data) => ({
      text: data.prop.value,
      description: data.p.someKey,
      action_title: data.p.someKey,
      image_url: data.p.someKey,
      gallery_urls: [],
    })
    const actual = sut.toRich(
      {
        prop: { value: 'some-value' },
        p: { someKey: 'another-value' },
      },
      converter
    )

    expect(actual.text).toEqual('some-value')
    expect(actual.description).toEqual('another-value')
    expect(actual.action_title).toEqual('another-value')
    expect(actual.image_url).toEqual('another-value')

    expect(actual.gallery_urls).toEqual([])
  })
})

describe('invalid convertions', () => {
  const defaultInput = {
    prop: { value: 'some-value' },
    p: { someKey: 'another-value' },
  }

  const doCheck = (converter, expectedErrorMsg, input = defaultInput) => {
    expect.assertions(1)

    try {
      sut.toRich(input, converter)
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

  describe('additional properties', () => {
    it('checks description', () => {
      const converter = (data) => ({ text: data.prop.value, payload: data.p, description: data })
      doCheck(converter, "Error: invalid converter 'description' is not a string")
    })

    it('checks image_url', () => {
      const converter = (data) => ({
        text: data.prop.value,
        payload: data.p,
        image_url: data,
      })
      doCheck(converter, "Error: invalid converter 'image_url' is not a string")
    })

    it('checks gallery_urls', () => {
      const converter = (data) => ({
        text: data.prop.value,
        payload: data.p,
        gallery_urls: data,
      })
      doCheck(converter, "Error: invalid converter 'gallery_urls' is not an array of strings")
    })

    it('checks each gallery_urls', () => {
      const converter = (data) => ({
        text: data.prop.value,
        payload: data.p,
        gallery_urls: ['string-here', data.p],
      })
      doCheck(converter, "Error: invalid converter 'gallery_urls' is not an array of strings")
    })
  })
})

describe('model validation', () => {
  it('exposes EXACTLY this model', () => {
    const expected = {
      required: ['text'],
      type: 'object',
      properties: {
        text: {
          type: 'string',
        },
        description: {
          type: 'string',
          nullable: true,
        },
        image_url: {
          type: 'string',
          nullable: true,
        },
        gallery_urls: {
          type: 'array',
          items: {
            type: 'string',
          },
          nullable: true,
        },
      },
    }

    const actual = sut.ResponsaRichMessageResource

    expect(actual).toEqual(expected)
  })
})
