import execa from 'execa'
import isValid from 'is-valid-path'

const beautify = (json) => {
  return JSON.stringify(JSON.parse(json), null, 4)
}

const isJSON = (file) => {
  return /\.json$/.test(file)
}

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
