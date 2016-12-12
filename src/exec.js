import childProcess from 'child_process'
import stripEof from 'strip-eof'

const TEN_MEBIBYTE = 1024 * 1024 * 10

const exec = (command) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      command,
      { maxBuffer: TEN_MEBIBYTE },
      (error, stdout, stderr) => {
        if (error) {
          return reject(Error(stderr))
        }
        return resolve(stripEof(stdout))
      }
    )
  })
}

export default exec
