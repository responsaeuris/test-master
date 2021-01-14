const cache = require('../../cache/cache')
const helper = require('../helper')

it('correctly stores and retrieve value in cache', () => {
  const key = 'cache-test'
  let actual = cache.get(key, () => 'some-value')

  expect(actual).toEqual('some-value')

  actual = cache.get(key, () => 'some-other-value')
  expect(actual).toEqual('some-value')

  cache.delete(key)
  actual = cache.get(key, () => 'some-third-value')
  expect(actual).toEqual('some-third-value')
})

describe('cache life cycle', () => {
  it('separate app means seprate caches', async () => {
    const app = await helper.setupApp()
    app.cache.get('foo', () => 'bar')
    expect(app.cache.get('foo')).toEqual('bar')

    const app2 = await helper.setupApp()
    app2.cache.get('foo', () => 'goofy')
    expect(app2.cache.get('foo')).toEqual('goofy')
  })

  it('correctly expires in due time', (done) => {
    cache.nuke()
    const key = 'cache-test'
    cache.get(key, () => 'some-value', { stdTTL: 1, checkperiod: 2 })
    setTimeout(() => {
      const actual = cache.checkCacheItem(key)
      expect(actual).not.toBeDefined()
      done()
    }, 1000)
  })
})
