async function doGet(fastify, path, secret) {
  const serverResponse = await fastify.inject({
    url: path,
    method: 'GET',
    headers: { 'x-secret': secret || 'some secret' },
  })
  return serverResponse
}

async function doPost(fastify, path, secret) {
  const serverResponse = await fastify.inject({
    url: path,
    method: 'POST',
    headers: { 'x-secret': secret || 'some secret' },
  })
  return serverResponse
}

module.exports = { doGet, doPost }
