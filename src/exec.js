import childProcess from 'child_process'
import stripEof from 'strip-eof'

const TEN_MEBIBYTE = 1024 * 1024 * 10

const exec = (cmd, params) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      cmd + buildParams(params),
      { maxBuffer: TEN_MEBIBYTE },
      (error, stdout, stderr) => {
        if (error) {
          return reject(Error(stderr))
        }
        resolve(stripEof(stdout))
      }
    )
  })
}

const escapeArg = (arg) => {
  arg = arg.toString()

  // Double up all the backslashes and escape the double quote
  arg = arg.replace(/(\\*)"/g, '$1$1\\"')

  // Escape the backslashes that would escape the double quote that's added
  // later to the end of the string
  arg = arg.replace(/(\\*)$/, '$1$1')

  arg = '"' + arg + '"'
  return arg
}

const buildParams = (params) => {
  return params.reduce((previous, current) => {
    return previous + ' ' + escapeArg(current)
  }, '')
}

export default exec
