export const isStringArray = (values: unknown[]): values is string[] =>
  values.every((value) => typeof value === 'string')

export const isJSONPath = (path: string) => {
  return /\.json|.jsonl$/.test(path)
}
