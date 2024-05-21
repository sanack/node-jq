import exec from './exec'
import { commandFactory } from './command'

export const run = (filter, json, options = {}, jqPath, cwd, detached) => {
  return new Promise((resolve, reject) => {
    const { command, args, stdin } = commandFactory(
      filter,
      json,
      options,
      jqPath
    )

    exec(command, args, stdin, cwd, detached)
      .then((stdout) => {
        if (options.output === 'json') {
          if (stdout === '') {
            return resolve(undefined)
          }

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
