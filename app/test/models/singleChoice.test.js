const sut = require('../../models/singleChoice')

describe('results', () => {
  it('spits a single choice', () => {
    const actual = sut.toSingle('hi')

    expect(actual.text).toBeDefined()
    expect(actual.text).toEqual('hi')
    expect(actual.payload).toBeDefined()
    expect(actual.payload).toEqual({})

    expect(actual.action_title).not.toBeDefined()
    expect(actual.image_url).not.toBeDefined()
    expect(actual.gallery_urls).not.toBeDefined()
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
    const converter = (data) => ({
      text: data.prop.value,
      payload: data.p,
      description: data.p.someKey,
      action_title: data.p.someKey,
      image_url: data.p.someKey,
      gallery_urls: [],
    })
    const actual = sut.toSingle(
      {
        prop: { value: 'some-value' },
        p: { someKey: 'another-value' },
      },
      converter
    )

    expect(actual.text).toEqual('some-value')
    expect(actual.payload).toEqual({ someKey: 'another-value' })
    expect(actual.description).toEqual('another-value')
    expect(actual.action_title).toEqual('another-value')
    expect(actual.image_url).toEqual('another-value')

    expect(actual.gallery_urls).toEqual([])
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

    describe('additional properties', () => {
      it('checks description', () => {
        const converter = (data) => ({ text: data.prop.value, payload: data.p, description: data })
        doCheck(converter, "Error: invalid converter 'description' is not a string")
      })

      it('checks action_title', () => {
        const converter = (data) => ({
          text: data.prop.value,
          payload: data.p,
          action_title: data,
        })
        doCheck(converter, "Error: invalid converter 'action_title' is not a string")
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
})
