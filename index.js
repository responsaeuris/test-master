const fp = require('fastify-plugin')
const oas = require('fastify-oas')
const smr = require('./models/singleChoiceResource')

const defaultOptions = {
  appName: 'Application Name',
  apiVersion: 'v1',
  servers: [
    { url: 'server1 url', description: 'server1 description' },
    { url: 'server2 url', description: 'server2 description' },
  ],
}

module.exports = fp(
  async (fastify, opts, next) => {
    const options = { ...defaultOptions, ...opts }

    // plugin route example --> remove it eventually
    fastify.get(`${opts.prefix}/smr`, async (req, reply) => {
      smr.resource = {
        actionTitle: 'sdfsdf',
        payload: { field: 'value' },
        description: 'asdasd',
        imageUrl: 'asdasd',
        galleryUrls: [],
      }
      reply.send(smr.resource)
    })

    fastify.decorate('exampleDecorator', () => 'decorated')

    fastify.register(oas, {
      swagger: {
        info: {
          title: options.appName,
          version: options.apiVersion,
          'x-translations': [],
          'x-log-index': `${options.appName}-${options.apiVersion}`,
        },
        servers: options.servers,
      },
      exposeRoute: true,
    })

    next()
  },
  { fastify: '3.x', name: 'plugin-core' }
)
