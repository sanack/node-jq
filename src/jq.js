import execa from 'execa'
import { validateJsonPath } from './utils'

const buildNullInputParams = (filter, json) => {
  return [
    '--null-input',
    `${filter} | ${JSON.stringify(json)}`
  ]
}

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

const runJq = (filter, json, options) => {
  return new Promise((resolve, reject) => {
    const { cmd, params } = createJqCommand(filter, json, options)
    execa(cmd, params)
    .then(({ stdout }) => {
      return resolve(JSON.parse(stdout))
    })
    .catch(reject)
  })
}

export const run = (filter, json, options = {}) => {
  return new Promise((resolve, reject) => {
    runJq(filter, json, options).then(resolve).catch(reject)
  })
}
