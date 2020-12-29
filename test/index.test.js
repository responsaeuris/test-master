/* eslint-disable global-require */
describe('plugin tests', () => {
  it('should register the correct decorator', async () => {
    const app = require('fastify')()

    app.register(require('..'))

    await app.ready()
    expect(app.exampleDecorator()).toEqual('decorated')
  })
})
