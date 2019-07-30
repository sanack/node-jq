import path from 'path'
import { parseOptions, optionDefaults } from './options'
import { validateJSONPath } from './utils'

const JQ_PATH = process.env.JQ_PATH || path.join(__dirname, '..', 'bin', 'jq')

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

export const commandFactory = (filter, json, options = {}) => {
  const mergedOptions = {
    ...optionDefaults,
    ...options
  }
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
