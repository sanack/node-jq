import exec from './exec'
import { parseOptions } from './options'

const createJqCommand = (filter, json, options = {}) => {
  const command = {
    cmd: 'jq',
    params: []
  }
  command.params = parseOptions(filter, json, options)
  return command
}

export const run = (filter, json, options = {}) => {
  return new Promise((resolve, reject) => {
    const { cmd, params } = createJqCommand(filter, json, options)
    exec(cmd, params)
    .then((stdout) => {
      if (options.output === 'json') {
        return resolve(JSON.parse(stdout))
      } else {
        return resolve(stdout)
      }
    })
    .catch(reject)
  })
}
