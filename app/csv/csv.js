const neatCsv = require('neat-csv')
const fs = require('fs')

const defaultOptions = { separator: ';' }

module.exports = async (file, opts) => {
  const options = { ...defaultOptions, ...opts }
  return neatCsv(fs.readFileSync(file), options)
}
