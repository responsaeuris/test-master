/* eslint-disable global-require */
describe('plugin tests', () => {
  it('should register the correct decorator', async () => {
    const app = require('fastify')()

    app.register(require('..'), { prefix: '/core' })

    await app.ready()
    expect(app.exampleDecorator()).toEqual('decorated')
  })
})
