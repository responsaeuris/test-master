const fastify = require("fastify");
const pluginCore = require("plugin-core-js");

const app = fastify({ logger: true });

app.register(pluginCore, { prefix: "/core" });

app.get("/", async (req, reply) => {
  reply.send(app.exampleDecorator());
});

app.listen(process.env.PORT || 3100);
