import { validateJSONPath } from './utils'

export const optionDefaults = {
  input: 'file',
  output: 'pretty'
}

const optionMap = {
  input: {
    buildParams: (filter, json, params, value) => {
      if (value === 'file') {
        let path = params[params.length - 1]
        if (path instanceof Array) {
          params.pop()
          path.forEach((file) => {
            validateJSONPath(file)
            params.push(file)
          })
        } else {
          validateJSONPath(params[params.length - 1])
        }
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
