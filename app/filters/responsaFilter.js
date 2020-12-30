module.exports = (request, reply, payload, done) => {
  if (!payload.is('singleChoiceResource')) throw new Error('Payload type not allowed')
  done()
}
