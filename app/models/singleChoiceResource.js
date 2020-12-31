const parse = (data) => ({
  isString: typeof data === 'string',
  isComplex: typeof data === 'object',
})

const validateResult = (data) => {
  if (!data.text) throw new Error("invalid converter missing 'text' property convertion")
  if (typeof data.text !== 'string')
    throw new Error("invalid converter 'text' property is not a string")

  if (!data.payload) throw new Error("invalid converter missing 'payload' property convertion")
  if (typeof data.payload !== 'object')
    throw new Error("invalid converter 'payload' property is not an object")
}

module.exports.parse = parse

module.exports.validateResult = validateResult

module.exports.toSingle = (data, converter) => {
  const parsed = parse(data)
  if (parsed.isString) {
    return {
      text: data,
      payload: {},
    }
  }

  if (parsed.isComplex && !converter) {
    throw new Error('missing converter')
  }

  if (parsed.isComplex) {
    const result = converter(data)
    validateResult(result)
    return result
  }

  throw new Error('dummy exceptions avoids warnings')
}

// module.exports.resource = {
//   text: '',
//   payload: {},
//   description: '',
//   actionTitle: '',
//   imageUrl: '',
//   galleryUrls: [],
// }
