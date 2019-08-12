import exec from './exec'
import { commandFactory } from './command'

const TEN_MEBIBYTE = 1024 * 1024 * 10

export const run = (filter, json, options = {}, jqPath, spawnOptions = { maxBuffer: TEN_MEBIBYTE }) => {
  return new Promise((resolve, reject) => {
    const { command, args, stdin } = commandFactory(filter, json, options, jqPath)
    exec(command, args, stdin, spawnOptions)
      .then(stdout => {
        if (options.output === 'json') {
          let result
          try {
            result = JSON.parse(stdout)
          } catch (error) {
            result = stdout
          }
          return resolve(result)
        } else {
          return resolve(stdout)
        }
      })
      .catch(reject)
  })
}

export class JQ {
  constructor (jqPath, spawnOptions) {
    this.jqPath = jqPath
    this.spawnOptions = spawnOptions
  }

  run (filter, json, options) {
    return run(filter, json, options, this.jqPath, this.spawnOptions)
  }
}
