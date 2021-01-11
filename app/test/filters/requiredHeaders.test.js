const sut = require('../../filters/requiredHeaders')

describe('error handling', () => {
  const fails = (headers, errorMessage) => {
    expect.assertions(1)

    try {
      sut(headers)
    } catch (e) {
      expect(e.message).toEqual(errorMessage)
    }
  }

  it('does not throw with both required headers', () => {
    expect.assertions(0)

    try {
      sut({ conversationId: '4', responsaTS: Date.now() })
    } catch (e) {
      expect(true).toEqual(true)
    }
  })

  it('throws if responsaTS is missing', () => {
    fails({ conversationId: '4' }, 'Missing required "ResponsaTS" request header')
  })

  it('throws if conversationId is missing', () => {
    fails({ responsaTS: Date.now() }, 'Missing required "ConversationId" request header')
  })

  it('throws if conversationId has wrong type', () => {
    fails(
      { conversationId: 'invalid-value', responsaTS: Date.now() },
      '"ConversationId" request header must be a number'
    )
  })

  it('throws if responsaTS has wrong type', () => {
    fails(
      { conversationId: '4', responsaTS: 'invalid-value' },
      '"ResponsaTS" request header must be a a valid timestamp'
    )
  })
})
