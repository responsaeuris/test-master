require('jest-extended')
const helper = require('../helper')

const requiredHeaders = {
  conversationId: 4,
  responsaTS: 12312315648974,
}

describe('error handling', () => {
  it('400 - answers with an error with invalid querystring', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/required-querystring-param', requiredHeaders)
    expect(response.statusCode).toEqual(400)
  })

  it('200 - answers with an ok with valid querystring', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(
      sut,
      '/required-querystring-param?param1=1',
      requiredHeaders
    )
    expect(response.statusCode).toEqual(200)
  })

  it('500 - answers with an error with unhandled exception', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/throws-error', requiredHeaders)
    expect(response.statusCode).toEqual(500)
    expect(response.payload).toEqual(
      '{"statusCode":500,"error":"Internal Server Error","message":"Voluntary error"}'
    )
  })
  it('404 on invalid route', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/non-existant', requiredHeaders)
    expect(response.statusCode).toEqual(404)
    expect(response.payload).toEqual(
      '{"message":"Route GET:/non-existant not found","error":"Not Found","statusCode":404}'
    )
  })

  it('answers with an error with invalid response', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/invalid-response-schema', requiredHeaders)
    expect(response.statusCode).toEqual(200)
    expect(response.payload).toEqual('{}')
  })

  it('answers with an error with invalid response', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/valid-response-schema', requiredHeaders)
    expect(response.statusCode).toEqual(200)
    expect(response.payload).toEqual('{"field":"value"}')
  })
})

describe('responsa headers', () => {
  it('200 with correct responsa headers', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/valid-response-schema', requiredHeaders)
    expect(response.statusCode).toEqual(200)
  })

  it('400 w/o conversationId', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/valid-response-schema', { responsaTS: Date.now() })
    expect(response.statusCode).toEqual(400)
  })

  it('400 w/o responsaTS', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/valid-response-schema', { conversationId: '55' })
    expect(response.statusCode).toEqual(400)
  })

  // TODO timestamp formatting

  it('answers with all three headers', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/valid-response-schema', requiredHeaders)
    expect(response.statusCode).toEqual(200)
    expect(response.raw.res.getHeader('conversationId')).toEqual(
      requiredHeaders.conversationId.toString()
    )
    expect(response.raw.res.getHeader('responsaTS')).toEqual(requiredHeaders.responsaTS.toString())
    expect(response.raw.res.getHeader('clientTS')).toBeDefined()
    expect(response.raw.res.getHeader('clientTS')).toBeNumber()
  })
})
