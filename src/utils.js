import isPathValid from 'is-valid-path'

export const isAJsonPath = (path) => {
  return /\.json$/.test(path)
}

// FIXME: JSON.parse is so slow
//        we could access the first key of the object
export const isAJson = (json) => {
  try {
    JSON.parse(json)
  } catch (e) {
    return false
  }
  return true
}

export const validateJsonPath = (jsonPath) => {
  if (!isPathValid(jsonPath) || !isAJsonPath(jsonPath)) {
    throw (Error('Is a invalid path'))
  }

  if (!isAJson(jsonPath)) {
    throw (Error('Is not a JSON file'))
  }
}

// FIXME: (?)
// export const validateJsonPath = (json) => {
//   if (!isPathValid(json)) {
//     if (!isAJsonPath(json)) {
//       throw (Error('Isn`t a JSON'))
//     }
//     throw (Error('Is a invalid path'))
//   }
// }
