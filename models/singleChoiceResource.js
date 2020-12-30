// eslint-disable-next-line no-extend-native
Object.defineProperty(Object.prototype, 'is', {
  enumerable: false,
  value(method) {
    return typeof this[method] === 'function'
  },
})

module.exports.singleChoiceResource = () => true

module.exports.resource = {
  text: '',
  payload: {},
  description: '',
  actionTitle: '',
  imageUrl: '',
  galleryUrls: [],
}
