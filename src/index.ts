import exec from './exec'
import { commandFactory, PartialOptions } from './command'

export const run = (filter: string, json: unknown | string | undefined | null, options?: PartialOptions): Promise<object | string> => {
  return new Promise((resolve, reject) => {
    const { command, args, stdin, cwd } = commandFactory(
      filter,
      json,
      options,
    );

    return exec(command, args, stdin, cwd)
      .then((stdout) => {
        if (options?.output === 'json') {
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
