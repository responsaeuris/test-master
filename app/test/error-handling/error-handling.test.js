const helper = require('../helper')

describe('error handling', () => {
  it('400 - answers with an error with invalid querystring', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/required-querystring-param')
    expect(response.statusCode).toEqual(400)
  })

  it('200 - answers with an ok with valid querystring', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/required-querystring-param?param1=1')
    expect(response.statusCode).toEqual(200)
  })

  it('500 - answers with an error with unhandled exception', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/throws-error')
    expect(response.statusCode).toEqual(500)
    expect(response.payload).toEqual(
      '{"statusCode":500,"error":"Internal Server Error","message":"Voluntary error"}'
    )
  })
  it('404 on invalid route', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/non-existant')
    expect(response.statusCode).toEqual(404)
    expect(response.payload).toEqual(
      '{"message":"Route GET:/non-existant not found","error":"Not Found","statusCode":404}'
    )
  })

  it('answers with an error with invalid response', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/invalid-response-schema')
    expect(response.statusCode).toEqual(200)
    expect(response.payload).toEqual('{}')
  })

  it('answers with an error with invalid response', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/valid-response-schema')
    expect(response.statusCode).toEqual(200)
    expect(response.payload).toEqual('{"field":"value"}')
  })
})

describe('responsa headers', () => {
  it('200 with correct responsa headers', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/valid-response-schema', {
      conversationId: 'some-value',
      responsaTS: 'tbd',
    })
    expect(response.statusCode).toEqual(200)
  })

  // it('400 w/o conversationId', async () => {
  //   const sut = await helper.setupApp()
  //   const response = await helper.doGet(sut, '/valid-response-schema', { responsaTS: 'tbd' })
  //   expect(response.statusCode).toEqual(400)
  // })

  // TODO timestamp formatting
  // TODO clientTS
})
