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
      sut({ 'X-ConversationId': '4', 'X-ResponsaTS': Date.now() })
    } catch (e) {
      expect(true).toEqual(true)
    }
  })

  it('throws if responsaTS is missing', () => {
    fails({ 'X-ConversationId': '4' }, 'Missing required "X-ResponsaTS" request header')
  })

  it('throws if conversationId is missing', () => {
    fails({ 'X-ResponsaTS': Date.now() }, 'Missing required "X-ConversationId" request header')
  })

  it('throws if conversationId has wrong type', () => {
    fails(
      { 'X-ConversationId': 'invalid-value', 'X-ResponsaTS': Date.now() },
      '"X-ConversationId" request header must be a number'
    )
  })

  it('throws if responsaTS has wrong type', () => {
    fails(
      { 'X-ConversationId': '4', 'X-ResponsaTS': 'invalid-value' },
      '"X-ResponsaTS" request header must be a a valid timestamp'
    )
  })
})
