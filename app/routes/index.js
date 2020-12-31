const smr = require('../models/singleChoiceResource')

module.exports = async function (fastify) {
  fastify.get(`/smr`, async (req, reply) => {
    smr.resource = {
      actionTitle: 'sdfsdf',
      payload: { field: 'value' },
      description: 'asdasd',
      imageUrl: 'asdasd',
      galleryUrls: [],
    }
    reply.send(smr.resource)
  })
}
