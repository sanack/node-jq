import { validateJsonPath } from './utils'

const optionDefaults = {
  input: 'file',
  output: 'string'
}

const optionMap = {
  input: {
    buildParams: (filter, json, params, value) => {
      if (value === 'file') {
        validateJsonPath(params[params.length - 1])
      } else {
        params.pop()
        params.unshift('--null-input')
        if (value === 'json') {
          json = JSON.stringify(json)
        }
        params[params.length - 1] = `${json} | ${filter}`
      }
    }
  },
  compactOutput: {
    buildParams: (filter, json, params, value) => {
      if (value === true) {
        params.unshift('--compact-output')
      }
    }
  }
}

export const parseOptions = (filter, json, options = {}) => {
  options = Object.assign(optionDefaults, options)
  return Object.keys(options).reduce(
    (params, key, index, array) => {
      if (optionMap[key] !== undefined) {
        optionMap[key].buildParams(filter, json, params, options[key])
      }
      return params
    },
    [filter, json]
  )
}
