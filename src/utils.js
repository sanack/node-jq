import isPathValid from 'is-valid-path'

const INVALID_PATH_ERROR = 'Invalid path'
const INVALID_JSON_PATH_ERROR = 'Not a json file'

export const isJSONPath = (path) => {
  return /\.json$/.test(path)
}

export const validateJSONPath = (JSONFile) => {
  if (!isPathValid(JSONFile)) {
    throw (Error(INVALID_PATH_ERROR))
  }

  if (!isJSONPath(JSONFile)) {
    throw (Error(INVALID_JSON_PATH_ERROR))
  }
}
