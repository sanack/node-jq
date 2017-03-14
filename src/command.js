import path from 'path'
import { parseOptions } from './options'

const JQ_PATH = path.join(__dirname, '..', 'bin', 'jq')

export const commandFactory = (filter, json, options = {}) => {
  return {
    command: JQ_PATH,
    args: parseOptions(filter, json, options)
  }
}
