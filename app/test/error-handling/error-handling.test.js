const helper = require('../helper')

describe('Error Handling', () => {
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
  })
  it('answers with an error with invalid response', async () => {
    const sut = await helper.setupApp()
    const response = await helper.doGet(sut, '/invalid-response')
    expect(response.statusCode).toEqual(400)
  })
})
