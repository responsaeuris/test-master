const neatCsv = require('neat-csv')
const fs = require('fs')

const defaultOptions = { separator: ';' }

module.exports = async (file, opts) => {
  const options = { ...defaultOptions, ...opts }
  let content = ''
  try {
    content = fs.readFileSync(file)
  } catch (e) {
    throw new Error(e)
  }
  const result = await neatCsv(content, options)
  return result
}
