import * as Joi from 'joi'
import path from 'path'
import {
  parseOptions,
  optionsSchema,
  preSpawnSchema,
  spawnSchema,
  PartialOptions
} from './options'

const JQ_PATH = process.env.JQ_PATH || path.join(__dirname, '..', 'bin', 'jq')

const NODE_JQ_ERROR_TEMPLATE =
  'node-jq: invalid {#label} ' +
  'argument supplied: ' +
  '"{if(#value != undefined, #value, "undefined")}"'

const messages = {
  'any.invalid': NODE_JQ_ERROR_TEMPLATE,
  'any.required': NODE_JQ_ERROR_TEMPLATE,
  'string.base': NODE_JQ_ERROR_TEMPLATE,
  'string.empty': NODE_JQ_ERROR_TEMPLATE
}

const validateArguments = (filter: string, json: unknown, options?: PartialOptions) => {
  const context = { filter, json }
  const validatedOptions = Joi.attempt(options, optionsSchema)
  const validatedPreSpawn = Joi.attempt(
    context,
    preSpawnSchema.tailor(validatedOptions.input),
    { messages, errors: { wrap: { label: '' } } }
  )
  const validatedArgs = parseOptions(
    validatedOptions,
    validatedPreSpawn.filter,
    validatedPreSpawn.json
  )
  const validatedSpawn = Joi.attempt(
    {},
    spawnSchema.tailor(validatedOptions.input),
    { context: { ...validatedPreSpawn, options: validatedOptions } }
  )

  return {
    args: validatedArgs,
    stdin: validatedSpawn.stdin
  }
}

type Command = {
  command: string,
  args: string[],
  stdin: string
}

export const commandFactory = (filter: string, json: unknown, options?: PartialOptions, jqPath?: string): Command => {
  const command = jqPath ? path.join(jqPath, './jq') : JQ_PATH
  const result = validateArguments(filter, json, options)

  return {
    command,
    args: result.args,
    stdin: result.stdin
  }
}
