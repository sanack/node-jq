import path from 'path'
import { parseOptions } from './options'

let JQ_PATH
// TODO: Install binary globally and use global on windows
if (process.platform === 'win32' && process.platform === 'win64') {
  JQ_PATH = 'jq'
} else {
  JQ_PATH = path.join(__dirname, '../bin/jq')
}

const escapeArg = (arg) => {
  arg = arg.toString()

  // Double up all the backslashes and escape the double quote
  arg = arg.replace(/(\\*)"/g, '$1$1\\"')

  // Escape the backslashes that would escape the double quote that's added
  // later to the end of the string
  arg = arg.replace(/(\\*)$/, '$1$1')

  arg = '"' + arg + '"'
  return arg
}

const shellEscape = (params) => {
  return params.reduce((previous, current) => {
    return previous + ' ' + escapeArg(current)
  }, '')
}

export const commandFactory = (filter, json, options = {}) => {
  return JQ_PATH + shellEscape(parseOptions(filter, json, options))
}
