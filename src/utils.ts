import isPathvalid from "is-valid-path";

export const FILTER_UNDEFINED_ERROR =
  'node-jq: invalid filter argument supplied: "undefined"';

export const INVALID_PATH_ERROR =
  "node-jq: invalid path argument supplied (not a valid path)";
export const INVALID_JSON_PATH_ERROR =
  "node-jq: invalid path argument supplied (not a .json file)";
export const INVALID_TYPE_ERROR =
  "node-jq: invalid type of value supplied";

export const INPUT_JSON_UNDEFINED_ERROR =
  'node-jq: invalid json object argument supplied: "undefined"';
export const INPUT_STRING_ERROR =
  "node-jq: invalid json string argument supplied";

export function isJSONPath(path: string) {
  return /\.json$/.test(path);
}

export function validateJSONPath(path: string) {
  if (!isPathvalid(path)) {
    throw new Error(`${INVALID_PATH_ERROR}: "${path}"`);
  }

  if (!isJSONPath(path)) {
    throw new Error(`${INVALID_JSON_PATH_ERROR}: "${path === "" ? "" : path}"`);
  }
}

export function getFileArray(path: string[] | string) {
  if (Array.isArray(path)) {
    return path.reduce((array: string[], file) => {
      validateJSONPath(file);
      return [...array, file];
    }, []);
  }
  validateJSONPath(path);
  return [path];
}

export function validIfType(valType: string, fn: (value: any) => any) {
  return (value: any) => {
    if (typeof value === valType) {
      return fn(value);
    }
    throw new Error(INVALID_TYPE_ERROR);
  };
}

export function validIfTrue(fn: (value: any) => any) {
  return validIfType("boolean", (value: boolean) => {
    if (value === true) {
      return fn(value);
    }
  });
}

export function validIfArrayOfType(valType: string, fn: (value: any) => any) {
  return (value: any)  => {
    if (!Array.isArray(value)) {
      throw new Error(INVALID_TYPE_ERROR);
    }

    const valTypes = new Set(value.map((x: any) => typeof x));
    if (valTypes.size !== 1) {
      throw new Error(INVALID_TYPE_ERROR);
    }

    validIfType(valType, () => {
      return true;
    })(value[0]);

    return fn(value);
  };
}

export function validateFilterAndInput(filter: any, json: any, input: any) {
  if (typeof filter === "undefined") {
    throw new Error(FILTER_UNDEFINED_ERROR);
  } else if (input === "json" && typeof json === "undefined") {
    throw new Error(INPUT_JSON_UNDEFINED_ERROR);
  } else if (input === "string" && !json) {
    throw new Error(`${INPUT_STRING_ERROR}: "${json === "" ? "" : json}"`);
  }
}
