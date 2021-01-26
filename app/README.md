# responsa-plugin-core-js

`responsa-plugin-core-js` provides logging, open api documentation and Responsa objects for Responsa Plugins

## Install

```
npm i responsa-plugin-core-js
```

## Usage

```js
const fastify = require('fastify')()
const pluginCore = require('responsa-plugin-core-js')

const app = fastify({ logger: pluginCore.loggerFactory(elasticOptions) })

app.register(pluginCore, { prefix: '/core' })
```
