const inputType = (data) => ({
  isString: typeof data === 'string',
  isComplex: typeof data === 'object',
})

const stringArray = (gallery) => {
  const throwErr = () => {
    throw new Error("invalid converter 'gallery_urls' is not an array of strings")
  }

  if (!gallery) return
  if (!(gallery instanceof Array)) throwErr()

  let isValid = true

  gallery.forEach((e) => {
    isValid = isValid && typeof e === 'string'
  })

  if (!isValid) throwErr()
}

module.exports.inputType = inputType
module.exports.stringArray = stringArray
