const path = require('path')

/* eslint-disable global-require */
describe('plugin tests', () => {
  it('should register the correct decorators', async () => {
    expect.assertions(2)
    const app = require('fastify')()

    app.register(require('..'), { prefix: '/core' })

    await app.ready()
    expect(app.getCsvData).toBeDefined()
    expect(app.getTranslations).toBeDefined()
  })

  it('correctly loads translations into array', async () => {
    const app = require('fastify')()

    app.register(require('..'), { prefix: '/core' })

    await app.ready()
    const actual = await app.getTranslations(path.join(__dirname, 'csv', 'valid-csv.csv'), false)
    expect(actual).toBeInstanceOf(Array)
    expect(actual.length).toEqual(2)
  })
})
