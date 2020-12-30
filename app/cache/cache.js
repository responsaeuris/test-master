const NodeCache = require('node-cache')
const config = require('../config/constants')

let cache = null

const checkCache = () => {
  if (cache === null) cache = new NodeCache({ stdTTL: config.CACHE_EXPIRATION_SECONDS })
}

module.exports.get = (key, retriever) => {
  checkCache()
  const value = cache.get(key)
  if (value) {
    return value
  }

  const data = retriever()
  cache.set(key, data)
  return data
}

module.exports.delete = (key) => {
  checkCache()
  cache.del(key)
}
