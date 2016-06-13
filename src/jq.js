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

const runJqNullInput = (filter, json) => {
  return new Promise((resolve, reject) => {
    execa(
      'jq',
      [
        '--null-input',
        `${filter} | ${JSON.stringify(json)}`
      ]
    )
    .then(({ stdout }) => {
      resolve(JSON.parse(stdout))
    })
    .catch(reject)
  })
}

const runJq = (filter, jsonPath) => {
  return new Promise((resolve, reject) => {
    execa(
      'jq',
      [filter, jsonPath]
    )
    .then(({ stdout }) => {
      resolve(JSON.parse(stdout))
    })
    .catch(reject)
  })
}

export const run = (filter, json, options = {}) => {
  return new Promise((resolve, reject) => {
    if (options.nullInput === true) {
      runJqNullInput(filter, json).then(resolve).catch(reject)
    } else {
      const jsonPath = validateJsonPath(json)
      runJq(filter, jsonPath).then(resolve).catch(reject)
    }
  })
}
