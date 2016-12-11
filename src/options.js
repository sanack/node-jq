import { validateJSONPath } from './utils'
import JSON5 from 'json5'

export const optionDefaults = {
  input: 'file',
  output: 'pretty'
}

const optionMap = {
  input: {
    buildParams: (filter, json, params, value) => {
      switch (value) {
        case 'file':
          validateJSONPath(params[params.length - 1])
          break

        default:
          params.pop()
          params.unshift('--null-input')
          if (value === 'json') {
            json = JSON.stringify(json)
          }
          if (value === 'json5') {
            json = JSON5.stringify(json)
          }
          params[params.length - 1] = `${json} | ${filter}`
          break
      }
    }
  },
  output: {
    buildParams: (filter, json, params, value) => {
      if (value === 'string') {
        params.unshift('--compact-output')
      }
    }
  }
}

const mergeOptionDefaults = (options = {}) => {
  Object.keys(optionDefaults).forEach((key) => {
    if (options[key] === undefined) {
      options[key] = optionDefaults[key]
    }
  })
}

export const parseOptions = (filter, json, options = {}) => {
  mergeOptionDefaults(options)
  return Object.keys(options).reduce(
    (params, key, index) => {
      if (optionMap[key] !== undefined) {
        optionMap[key].buildParams(filter, json, params, options[key])
      }
      return params
    },
    [filter, json]
  )
}
