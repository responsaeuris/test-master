const fastify = require('fastify')
const cache = require('../cache/cache')

const doGet = async (fastifyInstance, path, secret) => {
  const serverResponse = await fastifyInstance.inject({
    url: path,
    method: 'GET',
    headers: { 'x-secret': secret || 'some secret' },
  })
  return serverResponse
}

const doPost = async (fastifyInstance, path, secret) => {
  const serverResponse = await fastifyInstance.inject({
    url: path,
    method: 'POST',
    headers: { 'x-secret': secret || 'some secret' },
  })
  return serverResponse
}

/* eslint-disable global-require */
const setupApp = async (config) => {
  cache.nuke()

  const conf = config || {}
  conf.prefix = '/core'

  const app = fastify()

  app.register(require('..'), conf)

  return app.ready()
}

module.exports = { doGet, doPost, setupApp }
