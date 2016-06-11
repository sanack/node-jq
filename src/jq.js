import execa from 'execa'
import isValid from 'is-valid-path'

const isJSON = (path) => {
  return /\.json$/.test(path)
}

/**
 * run
 * @param  {string} filter Filter that jq will apply to the json
 * @param  {string} jsonPath  Path to the json
 * @return {Promise}
 */
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
