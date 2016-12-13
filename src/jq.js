import exec from './exec'
import { commandFactory } from './command'

export const run = (filter, json, options = {}) => {
  return new Promise((resolve, reject) => {
    const command = commandFactory(filter, json, options)
    exec(command)
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
