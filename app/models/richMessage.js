const { inputType, stringArray } = require('./resource')

const validateResult = (result) => {
  if (!result.text) throw new Error("invalid converter missing 'text' property convertion")
  if (typeof result.text !== 'string')
    throw new Error("invalid converter 'text' property is not a string")

  stringArray(result.gallery_urls)
  ;['description', 'image_url'].forEach((p) => {
    if (result[p] && typeof result[p] !== 'string')
      throw new Error(`invalid converter '${p}' is not a string`)
  })
}

module.exports.toRich = (data, converter) => {
  const parsed = inputType(data)

  if (parsed.isString) {
    return { text: data }
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

module.exports.ResponsaRichMessageResource = {
  required: ['payload', 'text'],
  type: 'object',
  properties: {
    text: {
      type: 'string',
    },
    payload: {
      type: 'object',
      additionalProperties: true,
    },
    description: {
      type: 'string',
      nullable: true,
    },
    action_title: {
      type: 'string',
      nullable: true,
    },
    image_url: {
      type: 'string',
      nullable: true,
    },
    gallery_urls: {
      type: 'array',
      items: {
        type: 'string',
      },
      nullable: true,
    },
  },
}
