const fp = require('fastify-plugin')
const oas = require('fastify-oas')
const autoload = require('fastify-autoload')
const path = require('path')
const pino = require('pino')
const pinoms = require('pino-multi-stream')
const pinoElastic = require('pino-elasticsearch')
const cache = require('./cache/cache')
const csv = require('./csv/csv')
const { status } = require('./routes/status/index')
const { toSingle, ResponsaSingleChoiceResource } = require('./models/singleChoiceResource')
const config = require('./config/constants')

const defaultOptions = {
  appName: 'Application Name',
  apiVersion: 'v1',
  esIndex: 'app-name-v1',
  servers: [
    { url: 'server1 url', description: 'server1 description' },
    { url: 'server2 url', description: 'server2 description' },
  ],
  translationsPath: '',
}

const csvParser = async (file) => csv(file).catch(() => null)

const getCsvData = async (key, file, useCache = true) =>
  useCache ? cache.get(key, () => csvParser(file)) : csvParser(file)

const getTranslations = async (translationsPath, useCache = true) => {
  const translations = await getCsvData('translations', translationsPath, useCache)
  return translations ? translations.map((tr) => tr.TRANSLATION_KEYS) : []
}

const buildLogger = (esIndex = null) => {
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
  logger.info(`core logger built with streams ${streams}`)
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

    f.decorate('coreStatus', status)
    f.decorate('cache', cache)
    f.decorate('getCsvData', getCsvData)
    f.decorate('getTranslations', getTranslations)
    f.decorate('singleChoice', toSingle)
    f.decorate('ResponsaSingleChoiceResource', ResponsaSingleChoiceResource)

    f.register(oas, {
      swagger: {
        info: {
          title: options.appName,
          version: options.apiVersion,
          'x-translations': await getTranslations(options.translationsPath),
          'x-log-index': options.esIndex.toLowerCase(),
        },
        servers: options.servers,
        components: {
          schemas: {
            ResponsaSingleChoiceResource,
          },
        },
      },
      exposeRoute: true,
    })

    next()
  },
  { fastify: '3.x', name: 'plugin-core' }
)

module.exports.log = (esIndex = null) => buildLogger(esIndex)
module.exports.ResponsaSingleChoiceResource = ResponsaSingleChoiceResource
