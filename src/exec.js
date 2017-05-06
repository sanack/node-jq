import childProcess from 'child_process'
import stripEof from 'strip-eof'

const TEN_MEBIBYTE = 1024 * 1024 * 10

const exec = (command, args) => {
  return new Promise((resolve, reject) => {
    var stdout = ''
    var stderr = ''

    const process = childProcess.spawn(
      command,
      args,
      { maxBuffer: TEN_MEBIBYTE }
    )

    process.stdout.on('data', (data) => {
      stdout += data
    })

    process.stderr.on('data', (data) => {
      stderr += data
    })

    process.on('close', (code) => {
      if (code !== 0) {
        return reject(Error(stderr))
      } else {
        return resolve(stripEof(stdout))
      }
    })
  })
}

export default exec
