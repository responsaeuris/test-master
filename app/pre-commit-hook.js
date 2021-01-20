/* eslint-disable no-console */
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

const execute = async (cmd) => {
  const output = await exec(cmd)
  return output.stdout.trim()
}

const bumpNpmVersion = async () => {
  console.log('Bumping npm package version ....')
  const branch = await execute('git rev-parse --abbrev-ref HEAD')
  const versionType = branch !== 'master' ? 'patch' : 'major'

  const version = await execute(`npm version ${versionType}`)

  await execute('git add --all')
  console.log('... done')
  console.log(`New package version: ${version}`)
}

bumpNpmVersion()
