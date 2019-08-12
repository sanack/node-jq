import isPathValid from "is-valid-path";

export const INVALID_PATH_ERROR =
  "node-jq: invalid path argument supplied (not a valid path)";
export const INVALID_JSON_PATH_ERROR =
  "node-jq: invalid path argument supplied (not a .json file)";

export function isJSONPath(path: string) {
  return /\.json$/.test(path);
}

export function validateJSONPath(path: string) {
  if (!isPathValid(path)) {
    throw new Error(`${INVALID_PATH_ERROR}: "${path}"`);
  }

  if (!isJSONPath(path)) {
    throw new Error(`${INVALID_JSON_PATH_ERROR}: "${path === "" ? "" : path}"`);
  }
}
