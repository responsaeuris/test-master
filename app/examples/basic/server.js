const fastify = require('fastify')
const pluginCore = require('../..')

const app = fastify({ logger: pluginCore.log })

app.register(pluginCore, { prefix: '/core' })
app.log.info('started')

app.get('/', async (req, reply) => {
  req.log.info('hereeeeeeeeeeee')
  reply.send(await app.coreStatus())
})

app.listen(process.env.PORT || 3100)
