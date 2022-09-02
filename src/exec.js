import childProcess from 'child_process'
import stripFinalNewline from 'strip-final-newline'

const TEN_MEBIBYTE = 1024 * 1024 * 10

const exec = (command, args, stdin, cwd) => {
  return new Promise((resolve, reject) => {
    let stdout = ''
    let stderr = ''

    const spawnOptions = { maxBuffer: TEN_MEBIBYTE, cwd }

    const process = childProcess.spawn(command, args, spawnOptions)

    // Both the 'error' and 'close' handlers can close the Promise, so guard
    // against them both closing it.
    let promiseIsClosed = false

    process.on('error', err => {
      if (!promiseIsClosed) {
        promiseIsClosed = true
        return reject(err)
      }
    })

    process.on('close', code => {
      if (!promiseIsClosed) {
        promiseIsClosed = true
        if (code !== 0) {
          return reject(Error(stderr))
        } else {
          return resolve(stripFinalNewline(stdout))
        }
      }
    })

    if (stdin) {
      process.stdin.setEncoding('utf-8')
      process.stdin.write(stdin)
      process.stdin.end()
    }

    process.stdout.setEncoding('utf-8')
    process.stdout.on('data', data => {
      stdout += data
    })

    process.stderr.on('data', data => {
      stderr += data
    })
  })
}

export default exec
