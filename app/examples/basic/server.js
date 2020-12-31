const fastify = require('fastify')
const pluginCore = require('../..')

const app = fastify()

app.register(pluginCore, { prefix: '/core' })

app.get('/', async (req, reply) => {
  reply.send(await app.coreStatus())
})

app.listen(process.env.PORT || 3100)
