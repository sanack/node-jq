export const optionDefaults = {
  input: 'file',
  output: 'pretty',
  slurp: false,
  sort: false,
  raw: false
}

const optionMap = {
  output: {
    buildParams: (params, value) => {
      if (value === 'string' || value === 'compact') {
        params.unshift('--compact-output')
      }
    }
  },
  slurp: {
    buildParams: (params, value) => {
      if (value === true) {
        params.unshift('--slurp')
      }
    }
  },
  sort: {
    buildParams: (params, value) => {
      if (value === true) {
        params.unshift('--sort-keys')
      }
    }
  },
  color: {
    buildParams: (params, value) => {
      if (value === true) {
        params.unshift('--color-output')
      }
    }
  },
  raw: {
    buildParams: (params, value) => {
      if (value === true) {
        params.unshift('-r')
      }
    }
  }
}

export const parseOptions = (options = {}) => {
  return Object.keys(options).reduce((params, key, index) => {
    if (optionMap[key] !== undefined) {
      optionMap[key].buildParams(params, options[key])
    }
    return params
  }, [])
}
