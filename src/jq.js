import execa from 'execa'
import isValid from 'is-valid-path'

const isJSON = (file) => {
  return /\.json$/.test(file)
}

/**
 * run
 * @param  {string} query Filter that jq will apply to the json
 * @param  {string} file  Path to the json
 * @return {Promise}
 */
export const run = (query, file) => {
  return new Promise((resolve, reject) => {
    if (typeof file !== 'string') {
      file = file.toString()
    }

    if (!isValid(file)) {
      reject(Error('Is a invalid path'))
    }

    if (!isJSON(file)) {
      reject(Error('Isn`t a JSON'))
    }

    execa('jq', [query, file])
      .then((result) => {
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
