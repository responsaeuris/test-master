module.exports = (headers) => {
  const h = headers
  if (!h.conversationId) throw new Error('asdf')
  if (!h.responsaTS) throw new Error('asdf')
}
