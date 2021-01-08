module.exports = (headers) => {
  const isConversationIdOk = Object.getOwnPropertyNames(headers).filter(
    (key) => key.toLowerCase() === 'conversationid'
  )
  const isResponsaTsOk = Object.getOwnPropertyNames(headers).filter(
    (key) => key.toLowerCase() === 'responsats'
  )
  if (isConversationIdOk.length === 0) throw new Error('asdf')
  if (isResponsaTsOk.length === 0) throw new Error('asdf')
}
