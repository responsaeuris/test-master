require('jest-extended')
const helper = require('./helper')
const core = require('..')

describe('plugin registration', () => {
  it('should register the correct decorators', async () => {
    expect.assertions(4)

    const sut = await helper.setupApp()

    expect(sut.coreStatus).toBeDefined()
    expect(sut.cache).toBeDefined()
    expect(sut.singleChoice).toBeDefined()
    expect(sut.richMessage).toBeDefined()
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

  it('skips error responseTime', () => {
    const error = { res: { statusCode: 500 }, err: {} }
    const cb = (data) => {
      expect(data).toEqual(error)
    }
    getCalled([error], cb)
  })

  it('skips error responseTime', () => {
    notCalled([{ res: { statusCode: 500 } }])
  })
})

describe('Logger Formatter', () => {
  const requiredHeaders = {
    'X-ConversationId': 4,
    'X-ResponsaTS': 12312315648974,
  }
  it('logs message with res, req and elapsed', async () => {
    const qry = 'param1=1'
    const app = await helper.setupApp()
    const response = await helper.doGet(
      app,
      `/required-querystring-param-and-response?${qry}`,
      requiredHeaders
    )
    response.raw.req.query = qry
    const sut = core.loggerFormatter
    const actual = sut(response.raw.req, response.raw.res, null, 1.98975)
    expect(actual).toBeDefined()
    expect(actual.conversationId).toBeDefined()
    expect(actual.responsaTS).toBeDefined()
    expect(actual.clientTS).toBeDefined()
    expect(actual.requestBody).toBeDefined()
    expect(actual.requestBody).toEqual('')
    expect(actual.requestHasBody).toBeDefined()
    expect(actual.requestHasBody).toBeBoolean()
    expect(actual.requestHasBody).toBeFalse()
    expect(actual.requestIsHttps).toBeDefined()
    expect(actual.requestIsHttps).toBeBoolean()
    expect(actual.requestContentLength).toBeDefined()
    expect(actual.requestQueryString).toBeDefined()
    expect(actual.requestQueryString).toEqual(qry)
    expect(actual.requestQueryStringHasValue).toBeDefined()
    expect(actual.requestQueryStringHasValue).toBeTrue()
    expect(actual.requestHeaders).toBeDefined()
    expect(actual.requestHeaders).toBeObject()
    expect(actual.responseBody).toBeDefined()
    expect(actual.responseBody).toEqual('{"field":"value"}')
    expect(actual.responseHasBody).toBeDefined()
    expect(actual.responseHasBody).toBeTrue()
    expect(actual.RequestMethod).toBeDefined()
    expect(actual.RequestMethod).toEqual('GET')
    expect(actual.RequestPath).toBeDefined()
    expect(actual.RequestPath).toEqual(`/required-querystring-param-and-response?${qry}`)
    expect(actual.StatusCode).toBeDefined()
    expect(actual.StatusCode).toEqual(200)
    expect(actual.Elapsed).toBeDefined()
    expect(actual.Elapsed).toEqual(1.98975)
    expect(actual.exceptionMessage).toBeDefined()
    expect(actual.exceptionMessage).toEqual('')
    expect(actual.exceptionStackTrace).toBeDefined()
    expect(actual.exceptionStackTrace).toEqual('')
  })
})
