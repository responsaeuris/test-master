const path = require('path')
const csv = require('../../csv/csv')

describe('csv tests', () => {
  it('correctly parses a valid csv file', async () => {
    const actual = await csv(path.join(__dirname, 'valid-csv.csv'))
    expect(actual).toBeInstanceOf(Array)
    expect(actual.length).toBeGreaterThan(0)
  })

  it('throws with not existing csv file', async () => {
    let error = null
    try {
      await csv(path.join(__dirname, 'not-existing.csv'))
    } catch (e) {
      error = e
    }
    expect(error).not.toEqual(null)
  })
})
