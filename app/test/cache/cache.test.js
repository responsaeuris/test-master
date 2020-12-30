const cache = require('../../cache/cache')

describe('cache tests', () => {
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
})
