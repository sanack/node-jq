import isPathValid from 'is-valid-path'

const INVALID_PATH_ERROR = 'Invalid path'
const INVALID_JSON_PATH_ERROR = 'Not a .json file'

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
  if (!isPathValid(jsonPath)) {
    throw (Error(INVALID_PATH_ERROR))
  }

  if (!isAJsonPath(jsonPath)) {
    throw (Error(INVALID_JSON_PATH_ERROR))
  }
}
