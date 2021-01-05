const pino = require("pino");
const pinoElastic = require("pino-elasticsearch");

const streamToElastic = pinoElastic({
  index: "an-index",
  consistency: "one",
  node: "http://localhost:9200",
  "es-version": 7,
  "flush-bytes": 1000,
});

const logger = pino({ level: "info" }, streamToElastic);

logger.info("hello world");
