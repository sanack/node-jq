import path from 'path'
import { parseOptions, optionDefaults } from './options'
import { validateJSONPath } from './utils'

const JQ_PATH = process.env.JQ_PATH || path.join(__dirname, '..', 'bin', 'jq')

export const FILTER_UNDEFINED_ERROR =
  'node-jq: invalid filter argument supplied: "undefined"'
export const INPUT_JSON_UNDEFINED_ERROR =
  'node-jq: invalid json object argument supplied: "undefined"'
export const INPUT_STRING_ERROR =
  'node-jq: invalid json string argument supplied'

const getFileArray = path => {
  if (Array.isArray(path)) {
    return path.reduce((array, file) => {
      validateJSONPath(file)
      return [...array, file]
    }, [])
  }
  validateJSONPath(path)
  return [path]
}

const validateArguments = (filter, json, options) => {
  if (typeof filter === 'undefined') {
    throw new Error(FILTER_UNDEFINED_ERROR)
  }

  switch (options.input) {
    case 'json':
      if (typeof json === 'undefined') {
        throw new Error(INPUT_JSON_UNDEFINED_ERROR)
      }
      break
    case 'string':
      if (!json) {
        throw new Error(`${INPUT_STRING_ERROR}: "${json === '' ? '' : json}"`)
      }
      break
  }
}

export const commandFactory = (filter, json, options = {}) => {
  const mergedOptions = {
    ...optionDefaults,
    ...options
  }

  validateArguments(filter, json, mergedOptions)

  let args = [filter, ...parseOptions(mergedOptions)]
  let stdin = ''

  if (mergedOptions.input === 'file') {
    args = [...args, ...getFileArray(json)]
  } else {
    if (mergedOptions.input === 'json') {
      stdin = JSON.stringify(json)
    } else {
      stdin = json
    }
  }

  return {
    command: JQ_PATH,
    args,
    stdin
  }
}
