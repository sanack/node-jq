import execa from 'execa'
import isValid from 'is-valid-path'

const isJSON = (path) => {
  return /\.json$/.test(path)
}

export const run = (filter, jsonPath) => {
  return new Promise((resolve, reject) => {
    if (typeof jsonPath !== 'string') {
      jsonPath = jsonPath.toString()
    }

    if (!isValid(jsonPath)) {
      reject(Error('Is a invalid path'))
    }

    if (!isJSON(jsonPath)) {
      reject(Error('Isn`t a JSON'))
    }

    execa('jq', [filter, jsonPath])
      .then(resolve)
      .catch(reject)
  })
}
