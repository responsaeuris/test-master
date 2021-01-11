const helper = require('./helper')
const core = require('..')

describe('plugin registration', () => {
  it('should register the correct decorators', async () => {
    expect.assertions(3)

    const sut = await helper.setupApp()

    expect(sut.coreStatus).toBeDefined()
    expect(sut.cache).toBeDefined()
    expect(sut.singleChoice).toBeDefined()
  })
})

describe('options loading', () => {
  const getSwagger = async (opt) => {
    const sut = await helper.setupApp(opt)

    const response = await helper.doGet(sut, 'documentation/json')

    const actual = JSON.parse(response.payload)

    return actual
  }

  const getSwaggerInfo = async (opt) => {
    const actual = await getSwagger(opt)
    expect(actual.info).toBeDefined()
    return actual.info
  }

  it('loads appName', async () => {
    const actual = await getSwaggerInfo({ appName: 'some-app-name' })

    expect(actual.title).toEqual('some-app-name')
  })

  it('loads version', async () => {
    const actual = await getSwaggerInfo({ apiVersion: 'v1' })

    expect(actual.version).toEqual('v1')
  })

  it('loads x-log-index', async () => {
    const actual = await getSwaggerInfo({ esIndex: 'some-index-name' })

    expect(actual['x-log-index']).toEqual('some-index-name')
  })

  it('loads x-log-index lower case', async () => {
    const actual = await getSwaggerInfo({ esIndex: 'soMe-inDex-naMe' })

    expect(actual['x-log-index']).toEqual('some-index-name')
  })
  it('loads translations', async () => {
    const response = await getSwaggerInfo({
      translationsKeys: ['key1', 'key2'],
    })

    const actual = response['x-translations']

    expect(actual).toBeDefined()
    expect(actual).toBeInstanceOf(Array)

    expect(actual.length).toEqual(2)

    expect(actual[0]).toEqual('key1')
    expect(actual[1]).toEqual('key2')
  })

  it('loads components with models schemas', async () => {
    const response = await getSwagger()

    expect(response.components).toBeDefined()
    expect(response.components).toBeInstanceOf(Object)

    expect(response.components.schemas).toBeDefined()
    expect(response.components.schemas).toBeInstanceOf(Object)

    const actual = response.components.schemas.ResponsaSingleChoiceResource
    expect(actual).toBeDefined()
    expect(actual).toBeInstanceOf(Object)
  })
})

describe('single choice resource', () => {
  const validate = (output) => {
    expect(output.text).toBeDefined()
    expect(output.payload).toBeDefined()
  }

  it('translate a simple string', async () => {
    const sut = await helper.setupApp()
    const data = 'hello'

    const actual = sut.singleChoice(data)

    validate(actual)
  })
})

describe('logger factory', () => {
  const getLoggerStreams = (logger) =>
    logger[Reflect.ownKeys(logger).find((key) => key.toString() === 'Symbol(pino.stream)')]

  it('creates a logger with 2 streams', async () => {
    const logger = core.loggerFactory('some-index')
    const actual = getLoggerStreams(logger)

    expect(actual.streams).toBeDefined()
    expect(actual.streams.length).toEqual(2)
  })

  it('creates a logger with 1 stream', async () => {
    const logger = core.loggerFactory()
    const actual = getLoggerStreams(logger)

    expect(actual.streams).toBeDefined()
    expect(actual.streams.length).toEqual(1)
  })
})

describe('log filtering', () => {
  const testCalls = (input, expected, cb) => {
    const sut = core.loggerFilter
    const actual = sut(input)

    expect(!!actual).toEqual(expected)

    if (cb) cb(actual)
  }

  const getCalled = (input, cb) => testCalls(input, true, cb)
  const notCalled = (input) => testCalls(input, false)

  it('calls logger when res is present', () => {
    getCalled([{ res: {} }])
    getCalled([{ res: {} }, 'some string'])
  })

  it('calls logger with correct input', () => {
    const aResponse = { res: { key: 'value' } }
    const cb = (data) => {
      expect(data).toEqual(aResponse)
    }

    getCalled([aResponse], cb)
    getCalled([aResponse, 'some string'], cb)
  })

  it('skips call to logger if is not an array', () => {
    notCalled({ res: {} })
  })

  it('skips call when array is empty', () => {
    notCalled([])
  })
  it('a string is present at 0 it call first string element and nothing more', () => {
    const cb = (data) => {
      expect(data).toEqual('hello world')
    }

    getCalled(['hello world', { res: {} }], cb)
  })

  it('call logger when a single string is passed', () => {
    const cb = (data) => {
      expect(data).toEqual('hello world')
    }
    getCalled(['hello world'], cb)
  })
})
