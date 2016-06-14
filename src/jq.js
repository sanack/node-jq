import execa from 'execa'
import isPathValid from 'is-valid-path'

export const isAJsonPath = (path) => {
  return /\.json$/.test(path)
}

export const isAJson = (json) => {
  try {
    JSON.parse(json)
  } catch (e) {
    return false
  }
  return true
}

const validateJsonPath = (json) => {
  if (isPathValid(json)) {
    if (typeof json !== 'string') {
      json = json.toString()
    }

    if (!isPathValid(json)) {
      if (!isAJsonPath(json)) {
        throw (Error('Isn`t a JSON'))
      }
      throw (Error('Is a invalid path'))
    }
  }

  return json
}

const buildNullInputParams = (filter, json) => {
  return [
    '--null-input',
    `${filter} | ${JSON.stringify(json)}`
  ]
}

const createJqCommand = (filter, json, options = {}) => {
  const command = {
    cmd: 'jq',
    params: []
  }

  if (options.nullInput === true) {
    command.params = buildNullInputParams(filter, json)
  } else {
    validateJsonPath(json)
    command.params = [filter, json]
  }

  return command
}

const runJq = (filter, json, options) => {
  return new Promise((resolve, reject) => {
    const { cmd, params } = createJqCommand(filter, json, options)
    execa(cmd, params)
    .then(({ stdout }) => {
      resolve(JSON.parse(stdout))
    })
    .catch(reject)
  })
}

export const run = (filter, json, options = {}) => {
  return new Promise((resolve, reject) => {
    runJq(filter, json, options).then(resolve).catch(reject)
  })
}
