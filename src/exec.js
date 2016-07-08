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

const escapeArg = (arg, quote) => {
  // Convert to string
  arg = '' + arg
  // If we are not going to quote the argument,
  // escape shell metacharacters, including double and single quotes:
  if (!quote) {
    arg = arg.replace(/([\(\)%!\^<>&|;,"'\s])/g, '^$1')
  } else {
    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"')
    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1')
    // All other backslashes occur literally
    // Quote the whole thing:
    arg = '"' + arg + '"'
  }
  return arg
}

const buildParams = (params) => {
  return params.reduce((previous, current) => {
    return previous + ' ' + escapeArg(current, true)
  }, '')
}

export default exec
