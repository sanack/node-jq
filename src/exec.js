import childProcess from 'child_process'

const TEN_MEBIBYTE = 1024 * 1024 * 10

const exec = (cmd, params) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      cmd + sanitizeParams(params),
      { maxBuffer: TEN_MEBIBYTE },
      (error, stdout, stderr) => {
        if (error) {
          return reject(Error(stderr))
        }
        resolve(stdout.trim())
      }
    )
  })
}

const sanitizeParams = (params) => {
  return params.reduce((previous, current) => {
    return previous + ' ' + '\'' + current + '\''
  }, '')
}

export default exec
