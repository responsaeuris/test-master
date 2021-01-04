const smr = require('../models/singleChoiceResource')

module.exports = async function (fastify) {
  fastify.get(`/smr`, async (req, reply) => {
    smr.resource = {
      action_title: 'sdfsdf',
      payload: { field: 'value' },
      description: 'asdasd',
      image_url: 'asdasd',
      gallery_urls: [],
    }
    reply.send(smr.resource)
  })
}
