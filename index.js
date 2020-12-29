const fp = require('fastify-plugin')
const swagger = require('fastify-swagger')

const defaultOptions = {
  appName: 'Application Name',
  servers: [
    { url: 'server1 url', description: 'server1 description' },
    { url: 'server2 url', description: 'server2 description' },
  ],
}

module.exports = fp(
  async (fastify, opts, next) => {
    const options = { ...defaultOptions, ...opts }

    fastify.decorate('exampleDecorator', () => 'decorated')

    fastify.register(swagger, {
      swagger: {
        info: {
          title: 'Test swagger',
          description: 'testing the fastify swagger api',
          version: '0.1.0',
        },
        securityDefinitions: {
          apiKey: {
            type: 'apiKey',
            name: 'apiKey',
            in: 'header',
          },
        },
        host: 'localhost:3000',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
      },
      exposeRoute: true,
    })

    next()
  },
  { fastify: '3.x', name: 'plugin-core' }
)
