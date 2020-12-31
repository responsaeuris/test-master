const path = require('path')
const app = require('..')
const helper = require('./helper')

describe('plugin registration', () => {
  it('should register the correct decorators', async () => {
    expect.assertions(5)

    const sut = await helper.setupApp()

    expect(sut.coreStatus).toBeDefined()
    expect(sut.cache).toBeDefined()
    expect(sut.getCsvData).toBeDefined()
    expect(sut.getTranslations).toBeDefined()
    expect(sut.singleChoice).toBeDefined()
  })
})

describe('cache', () => {
  it('correctly loads translations into array', async () => {
    const sut = await helper.setupApp()

    const actual = await sut.getTranslations(path.join(__dirname, 'csv', 'valid-csv.csv'), false)
    expect(actual).toBeInstanceOf(Array)
    expect(actual.length).toEqual(2)
  })

  it('get empty array if app initialization has been made without translation file', async () => {
    const sut = await helper.setupApp()

    const actual = await sut.getTranslations(path.join(__dirname, 'csv', 'valid-csv.csv'), true)
    expect(actual).toBeInstanceOf(Array)
    expect(actual.length).toEqual(0)
  })
})

describe('options loading', () => {
  const getSwaggerInfo = async (opt) => {
    const sut = await helper.setupApp(opt)

    const response = await helper.doGet(sut, 'documentation/json')

    const actual = JSON.parse(response.payload)

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
    const actual = await getSwaggerInfo({ appName: 'some-app-name', apiVersion: 'v1' })

    expect(actual['x-log-index']).toEqual('some-app-name-v1')
  })

  it('loads translations', async () => {
    const response = await getSwaggerInfo({
      translationsPath: path.join(__dirname, 'csv', 'valid-csv.csv'),
    })

    const actual = response['x-translations']

    expect(actual).toBeDefined()
    expect(actual).toBeInstanceOf(Array)

    expect(actual.length).toEqual(2)

    expect(actual[0]).toEqual('{{KEY_SELECT}}')
    expect(actual[1]).toEqual('{{KEY_VIEW_DETAILS}}')
  })
})

describe('single choice resouce', () => {
  const validate = (output) => {
    // expect(output.text).toBeDefined()
    // expect(output.payload).toBeDefined()
    // expect(output.actionTitle).toBeDefined()
    // expect(output.imageUrl).toBeDefined()
    // expect(output.galleryUrls).toBeDefined()
  }

  it('translate a siple string', async () => {
    const sut = await helper.setupApp()
    const data = 'hello'

    const actual = sut.singleChoice(data)

    validate(actual)
  })
})
