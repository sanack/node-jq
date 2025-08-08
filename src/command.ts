import * as path from 'node:path'
import {
  buildCommandFlags,
  commandArgsSchema,
  type FilterInput,
  type JsonInput,
  type OptionsInput,
} from './options'

const JQ_PATH =
  process.env.JQ_PATH ??
  process.env.npm_config_jq_path ??
  path.join(__dirname, '..', 'bin', 'jq')

const validateArguments = (
  filter: FilterInput,
  json: JsonInput,
  options: OptionsInput,
) => {
  const validatedArgs = commandArgsSchema.parse({
    filter,
    json,
    options,
  })
  const flags = buildCommandFlags(validatedArgs.options)
  const commandArgs = [...flags, validatedArgs.filter]

  let stdin = ''
  switch (validatedArgs.options?.input) {
    case 'file': {
      const paths = validatedArgs.json as string | string[]
      commandArgs.push(...(typeof paths === 'string' ? [paths] : paths))
      break
    }
    case 'json': {
      stdin = JSON.stringify(validatedArgs.json)
      break
    }
    case 'string': {
      stdin = validatedArgs.json as string
      break
    }
  }

  return {
    args: commandArgs,
    stdin,
  }
}

interface Command {
  command: string
  args: string[]
  stdin: string
}

export const commandFactory = (
  filter: FilterInput,
  json: JsonInput,
  options?: OptionsInput,
  jqPath?: string,
): Command => {
  const command = jqPath ? path.join(jqPath, './jq') : JQ_PATH
  const { args, stdin } = validateArguments(filter, json, options ?? {})

  return {
    command,
    args,
    stdin,
  }
}
