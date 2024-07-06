import isValidPath from 'is-valid-path'
import * as z from 'zod'
import { isJSONPath, isStringArray } from './utils'

const JSON_INVALID_PATH_TYPE_ERROR =
  'invalid json argument supplied (expected a string or an array of strings)'
const JSON_INVALID_PATH_ERROR =
  'invalid json argument supplied (not a valid path)'
const JSON_NOT_A_JSON_FILE_ERROR =
  'invalid json argument supplied (not a .json file)'

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof literalSchema>
export type Json = Literal | { [key: string]: Json } | Json[]
export const jsonTypeSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonTypeSchema), z.record(jsonTypeSchema)]),
)

export const optionsSchema = z.object({
  args: z.record(jsonTypeSchema).optional(),
  color: z.boolean().optional().default(false),
  input: z.enum(['file', 'json', 'string']).optional().default('file'),
  output: z
    .enum(['pretty', 'compact', 'string', 'json'])
    .optional()
    .default('pretty'),
  raw: z.boolean().optional().default(false),
  slurp: z.boolean().optional().default(false),
  sort: z.boolean().optional().default(false),
})

export type OptionsInput = z.input<typeof optionsSchema>
export type OptionsOutput = z.output<typeof optionsSchema>

const filterSchema = z.union([z.string(), z.null().transform(() => 'null')])
export type FilterInput = z.input<typeof filterSchema>
export type FilterOutput = z.output<typeof filterSchema>

const jsonSchema = z.union([z.string(), z.array(z.string()), jsonTypeSchema])
export type JsonInput = z.input<typeof jsonSchema>
export type JsonOutput = z.output<typeof jsonSchema>

export const commandArgsSchema = z
  .object({
    filter: filterSchema,
    json: jsonSchema,
    options: optionsSchema,
  })
  .superRefine((data, ctx) => {
    const json = data.json
    const input = data.options.input

    switch (input) {
      case 'file': {
        const paths: string[] = []
        if (typeof json === 'string') {
          paths.push(json)
        } else if (Array.isArray(json) && isStringArray(json)) {
          paths.concat(json)
        } else {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            fatal: true,
            message: JSON_INVALID_PATH_TYPE_ERROR,
          })
          return z.NEVER
        }

        paths.forEach((path) => {
          if (!isValidPath(path)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              fatal: true,
              message: `${JSON_INVALID_PATH_ERROR}: "${path}"`,
            })
            return
          }

          if (!isJSONPath(path)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              fatal: true,
              message: `${JSON_NOT_A_JSON_FILE_ERROR}: "${path}"`,
            })
            return
          }
        })

        break
      }
      case 'string': {
        if (typeof json !== 'string') {
          ctx.addIssue({
            code: z.ZodIssueCode.invalid_type,
            expected: 'string',
            fatal: true,
            received: typeof json,
          })
        } else if (json === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            fatal: true,
            inclusive: true,
            minimum: 1,
            type: 'string',
          })
        }
        break
      }
    }
    return z.NEVER
  })

export type CommandArgsInput = z.input<typeof commandArgsSchema>
export type CommandArgsOutput = z.output<typeof commandArgsSchema>

export const buildCommandFlags = (options: OptionsOutput) => {
  const flags = []

  options.color && flags.push('--color-output')
  options.raw && flags.push('-r')
  options.slurp && flags.push('--slurp')
  options.sort && flags.push('--sort-keys')

  if (['compact', 'string'].includes(options.output)) {
    flags.push('--compact-output')
  }

  Object.entries(options.args ?? {}).forEach(([key, value]) => {
    if (typeof value === 'string') {
      flags.push('--arg', key, value)
      return
    }

    flags.push('--argjson', key, JSON.stringify(value))
  })

  return flags
}
