import execa from 'execa'
import { validateJsonPath } from './utils'
import { buildNullInputParams } from './options'

const createJqCommand = (filter, json, options = {}) => {
  const command = {
    cmd: 'jq',
    params: []
  }

  if (options.nullInput === true) {
    command.params = buildNullInputParams(filter, json)
  } else {
    validateJsonPath(json)
    command.params = [filter, json]
  }

  return command
}

export const run = (filter, json, options = {}) => {
  return new Promise((resolve, reject) => {
    const { cmd, params } = createJqCommand(filter, json, options)
    execa(cmd, params)
    .then(({ stdout }) => {
      return resolve(JSON.parse(stdout))
    })
    .catch(reject)
  })
}
