import { validateJSONPath } from './utils'
import tempWrite from 'temp-write'

export const optionDefaults = {
  input: 'file',
  output: 'pretty',
  slurp: false,
  sort: false
}

const optionMap = {
  input: {
    buildParams: (filter, json, params, value) => {
      if (value === 'file') {
        let path = params[params.length - 1]
        if (Array.isArray(path)) {
          params.pop()
          path.forEach((file) => {
            validateJSONPath(file)
            params.push(file)
          })
        } else {
          validateJSONPath(path)
        }
      } else {
        if (value === 'json') {
          json = JSON.stringify(json)
        }
        const filePath = tempWrite.sync(json)
        params[params.length - 1] = filePath
      }
    }
  },
  output: {
    buildParams: (filter, json, params, value) => {
      if (value === 'string' || value === 'compact') {
        params.unshift('--compact-output')
      }
    }
  },
  slurp: {
    buildParams: (filter, json, params, value) => {
      if (value === true) {
        params.unshift('--slurp')
      }
    }
  },
  sort: {
    buildParams: (filter, json, params, value) => {
      if (value === true) {
        params.unshift('--sort-keys')
      }
    }
  },
  color: {
    buildParams: (filter, json, params, value) => {
      if (value === true) {
        params.unshift('--color-output')
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
