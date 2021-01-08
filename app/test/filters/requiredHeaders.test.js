const sut = require('../../filters/requiredHeaders')

describe('error handling', () => {
  const fails = (headers) => {
    expect.assertions(1)

    try {
      sut(headers)
    } catch {
      expect(true).toEqual(true)
    }
  }

  it('does not throw with both required headers', () => {
    expect.assertions(0)

    try {
      sut({ conversationId: 'asdf', responsaTS: 'asdf' })
    } catch {
      expect(true).toEqual(false)
    }
  })

  it('throws if responsaTS is missing', () => {
    fails({ conversationId: 'asdf' })
  })

  it('throws if conversationId is missing', () => {
    fails({ responsaTS: 'asdf' })
  })
})
