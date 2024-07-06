import exec from './exec'
import { commandFactory } from './command'
import type { FilterInput, JsonInput, OptionsInput } from './options'

export const run = (
  filter: FilterInput,
  json: JsonInput,
  options?: OptionsInput,
  jqPath?: string,
  cwd?: string,
  detached?: boolean,
): Promise<object | string> => {
  return new Promise((resolve, reject) => {
    const { command, args, stdin } = commandFactory(
      filter,
      json,
      options,
      jqPath,
    )

    exec(command, args, stdin, cwd, detached)
      .then((stdout) => {
        if (options?.output === 'json') {
          let result: object | string
          try {
            result = JSON.parse(stdout)
          } catch (_error) {
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
