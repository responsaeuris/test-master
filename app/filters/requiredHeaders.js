module.exports = (headers) => {
  const ConversationIdKey = Object.getOwnPropertyNames(headers).filter(
    (key) => key.toLowerCase() === 'conversationid'
  )
  const ResponsaTsKey = Object.getOwnPropertyNames(headers).filter(
    (key) => key.toLowerCase() === 'responsats'
  )
  if (ConversationIdKey.length === 0)
    throw new Error('Missing required "ConversationId" request header')
  if (ResponsaTsKey.length === 0) throw new Error('Missing required "ResponsaTS" request header')

  const convId = parseInt(headers[ConversationIdKey], 10)
  if (Number.isNaN(convId)) throw new Error('"ConversationId" request header must be a number')

  const resTS = parseFloat(headers[ResponsaTsKey], 10)
  if (Number.isNaN(resTS))
    throw new Error('"ResponsaTS" request header must be a a valid timestamp')
}
