const createError = require('fastify-error')
const config = require('../config/constants')

const HeadersBadRequestError = createError('BAD_REQ_HEADERS', '%s', 400)

module.exports = (headers) => {
  const ConversationIdKey = Object.getOwnPropertyNames(headers).filter(
    (key) => key.toLowerCase() === config.HEADER_CONVERSATION_ID.toLowerCase()
  )
  const ResponsaTsKey = Object.getOwnPropertyNames(headers).filter(
    (key) => key.toLowerCase() === config.HEADER_RESPONSA_TS.toLowerCase()
  )
  if (ConversationIdKey.length === 0)
    throw new HeadersBadRequestError('Missing required "X-ConversationId" request header')

  if (ResponsaTsKey.length === 0)
    throw new HeadersBadRequestError('Missing required "X-ResponsaTS" request header')

  const convId = parseInt(headers[ConversationIdKey], 10)
  if (Number.isNaN(convId))
    throw new HeadersBadRequestError('"X-ConversationId" request header must be a number')

  const resTS = parseFloat(headers[ResponsaTsKey], 10)
  if (Number.isNaN(resTS))
    throw new HeadersBadRequestError('"X-ResponsaTS" request header must be a a valid timestamp')
}
