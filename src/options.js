export const buildNullInputParams = (filter, json) => {
  return [
    '--null-input',
    `${JSON.stringify(json)} | ${filter}`
  ]
}
