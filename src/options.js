import { validateJSONPath } from './utils'

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
  },
  raw: {
    buildParams: (filter, json, params, value) => {
      if (value === true) {
        params.unshift('-r')
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
