const fp = require('fastify-plugin')
const oas = require('fastify-oas')
const autoload = require('fastify-autoload')
const path = require('path')
const cache = require('./cache/cache')
const csv = require('./csv/csv')
const { status } = require('./routes/status/index')
const { toSingle, ResponsaSingleChoiceResource } = require('./models/singleChoiceResource')

const defaultOptions = {
  appName: 'Application Name',
  apiVersion: 'v1',
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
          'x-log-index': `${options.appName}-${options.apiVersion}`,
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
