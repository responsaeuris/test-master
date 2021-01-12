const fp = require('fastify-plugin')
const oas = require('fastify-oas')
const autoload = require('fastify-autoload')
const path = require('path')
const pino = require('pino')
const pinoms = require('pino-multi-stream')
const pinoElastic = require('pino-elasticsearch')
const cache = require('./cache/cache')
const { status } = require('./routes/status/index')
const { toSingle, ResponsaSingleChoiceResource } = require('./models/singleChoiceResource')
const errorSchema = require('./models/error')
const config = require('./config/constants')
const checkHeaders = require('./filters/requiredHeaders')

let translationsKeys = null

const defaultOptions = {
  appName: 'Application Name',
  apiVersion: 'v1',
  esIndex: 'app-name-v1',
  servers: [
    { url: 'server1 url', description: 'server1 description' },
    { url: 'server2 url', description: 'server2 description' },
  ],
  translationsKeys: [],
}

const loggerFilter = (input) => {
  const data = input[0] || []
  const plainResponse = () => data.err || data.res.statusCode !== 500

  if (typeof data === 'string' || (data.res && plainResponse())) return data
  return null
}

const loggerFactory = (esIndex = null) => {
  const streams = [{ stream: process.stdout }]
  const hooks = {
    logMethod(inputArgs, method) {
      const data = loggerFilter(inputArgs)
      if (data) return method.apply(this, inputArgs)
      return null
    },
  }

  if (esIndex) {
    streams.push({
      stream: pinoElastic({
        index: `${esIndex.toLowerCase()}-%{DATE}`,
        consistency: 'one',
        node: config.DEFAULT_ELASTICSEARCH_URI,
        auth: {
          username: config.ES_USERNAME,
          password: config.ES_PASSWORD,
        },
        rejectUnauthorized: false,
        'es-version': 7,
        'flush-bytes': 10,
      }),
    })
  }

  const logger = pino({ level: 'info', hooks }, pinoms.multistream(streams))
  return logger
}

module.exports = fp(
  async (fastify, opts, next) => {
    const f = fastify
    const options = { ...defaultOptions, ...opts, cache }

    f.register(autoload, {
      dir: path.join(__dirname, 'routes'),
      options: { ...opts },
    })

    f.addHook('onRequest', (request, reply, done) => {
      if (!request.url.includes('/documentation')) checkHeaders(request.headers)
      done()
    })

    f.addHook('onSend', (request, reply, payload, done) => {
      if (!request.url.includes('/documentation')) {
        if (!reply.raw.getHeader('conversationId'))
          reply.raw.setHeader('conversationId', request.headers.conversationid)
        if (!reply.raw.getHeader('responsaTS'))
          reply.raw.setHeader('responsaTS', request.headers.responsats)
        reply.raw.setHeader('clientTS', Date.now())
      }
      done()
    })

    f.decorate('coreStatus', status)
    f.decorate('cache', cache)
    f.decorate('singleChoice', toSingle)

    translationsKeys = options.translationsKeys

    f.register(oas, {
      swagger: {
        info: {
          title: options.appName,
          version: options.apiVersion,
          'x-translations': translationsKeys,
          'x-log-index': options.esIndex.toLowerCase(),
        },
        consumes: ['application/json'],
        produces: ['application/json'],
        servers: options.servers,
        components: {
          schemas: {
            ResponsaSingleChoiceResource,
            Error: errorSchema,
          },
        },
      },
      exposeRoute: true,
      openapi: '3.0.3',
      addModels: true,
    })

    next()
  },
  { fastify: '3.x', name: 'plugin-core' }
)

module.exports.loggerFactory = loggerFactory
module.exports.loggerFilter = loggerFilter
module.exports.errorSchema = errorSchema
module.exports.ResponsaSingleChoiceResource = ResponsaSingleChoiceResource
