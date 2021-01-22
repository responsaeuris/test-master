/* eslint-disable no-console */
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

const execute = async (cmd) => {
  let output = null
  try {
    output = await exec(cmd)
    return output.stdout.trim()
  } catch (e) {
    console.log(`Execute error: ${e}`)
    return null
  }
}

module.exports.bumpNpmVersion = async (fromMerge) => {
  // if called from pre-commit but in merge state, do nothing
  const isMerge = await execute('git rev-parse -q --verify MERGE_HEAD')
  console.log(`fromMerge is "${fromMerge}"`)
  console.log(`MERGE_HEAD is "${isMerge}"`)
  if (!fromMerge && isMerge !== null && isMerge !== undefined && isMerge !== '') return

  console.log('Bumping npm package version ....')
  const branch = await execute('git rev-parse --abbrev-ref HEAD')
  const versionType = branch !== 'master' ? 'patch' : 'minor'

  const version = await execute(`npm version ${versionType}`)

  await execute('git add --all')

  /* if (fromMerge) {
    await execute('git commit')
  } */

  console.log('... done')
  console.log(`New package version: ${version}`)
}

module.exports.amendLastCommit = async () => {
  console.log('Amending last commit ...')
  const result = await execute('git commit --amend --no-edit')
  console.log(`... done [with result ${result}]`)
}

module.exports.execute = execute
