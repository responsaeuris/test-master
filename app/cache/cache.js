const NodeCache = require('node-cache')
const config = require('../config/constants')

let cache = null

const defaultOptions = { stdTTL: config.CACHE_EXPIRATION_SECONDS }

const checkCache = (opts) => {
  if (cache === null) {
    cache = new NodeCache({ ...defaultOptions, ...opts })
  }
}

module.exports.checkCacheItem = (key) => cache.get(key)

module.exports.get = (key, retriever, opts) => {
  checkCache(opts)
  const value = cache.get(key)
  if (value) {
    return value
  }

  const data = retriever()
  cache.set(key, data)
  return data
}

module.exports.delete = (key, opts) => {
  checkCache(opts)
  cache.del(key)
}

module.exports.nuke = () => {
  cache = null
}
