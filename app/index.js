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

const loggerFactory = (esIndex = null) => {
  const streams = [{ stream: process.stdout }]
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

  const logger = pino({ level: 'info' }, pinoms.multistream(streams))
  logger.info(`core logger built with ${streams.length} streams`)
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

    translationsKeys = options.translationsKeys

    f.decorate('coreStatus', status)
    f.decorate('cache', cache)
    f.decorate('singleChoice', toSingle)
    f.decorate('ResponsaSingleChoiceResource', ResponsaSingleChoiceResource)
    f.decorate('ErrorSchema', errorSchema)

    f.register(oas, {
      swagger: {
        info: {
          title: options.appName,
          version: options.apiVersion,
          'x-translations': translationsKeys,
          'x-log-index': options.esIndex.toLowerCase(),
        },
        servers: options.servers,
        components: {
          schemas: {
            ResponsaSingleChoiceResource,
            Error: errorSchema,
          },
        },
      },
      exposeRoute: true,
    })

    next()
  },
  { fastify: '3.x', name: 'plugin-core' }
)

module.exports.loggerFactory = loggerFactory
module.exports.ResponsaSingleChoiceResource = ResponsaSingleChoiceResource
