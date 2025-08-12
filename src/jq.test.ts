import { expect } from 'chai'
import path from 'path'
import { readFileSync } from 'fs'

import { run } from './jq'

const PATH_ROOT = path.join(__dirname, '..')
const PATH_BIN = path.join(PATH_ROOT, './bin')
const PATH_ASTERISK_FIXTURE = path.join(PATH_ROOT, 'src', '*.js')
const PATH_FIXTURES = path.join(__dirname, '__test__', 'fixtures')

const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')
const PATH_JS_FIXTURE = path.join(PATH_FIXTURES, '1.js')
const PATH_LARGE_JSON_FIXTURE = path.join(PATH_FIXTURES, 'large.json')
const PATH_VARIABLE_JSON_FIXTURE = path.join(PATH_FIXTURES, 'var.json')

const FILTER_VALID = '.repository.type'
const FILTER_INVALID = 'invalid'
const FILTER_WITH_VARIABLE =
  '[ . as $x | .user[] | {"user": ., "site": $x.site} ]'

const ERROR_INVALID_FILTER = /invalid/

const CWD_OPTION = path.join(PATH_BIN, '../')

describe('jq core', () => {
  it('should fulfill its promise', (done) => {
    run(FILTER_VALID, PATH_JSON_FIXTURE)
      .then((output) => {
        expect(output).to.equal('"git"')
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should pass on a null filter', (done) => {
    run(null, PATH_JSON_FIXTURE)
      .then((output) => {
        expect(output).to.equal('null')
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should fail on an invalid filter', (done) => {
    run(FILTER_INVALID, PATH_JSON_FIXTURE)
      .catch((error) => {
        expect(error).to.be.an.instanceof(Error)
        expect((error as Error).message).to.match(ERROR_INVALID_FILTER)
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should catch errors from child process stdin', function (done) {
    // This is a very specific case of error, only triggered if:
    // 1) The jq process exits early (e.g. due to an invalid filter)
    // AND
    // 2) We are trying to send a large amount of data over stdin,
    //    (which will take longer to do than jq takes to exit).
    this.timeout(10000)
    run(
      FILTER_INVALID,
      JSON.parse(readFileSync(PATH_LARGE_JSON_FIXTURE).toString()) as string,
      { input: 'json' },
    )
      .then(() => {
        done('Expected an error to be thrown from child process stdin')
      })
      .catch((error) => {
        expect(error).to.be.an.instanceof(Error)
        // On Mac/Linux, the error code is "EPIPE".
        // On Windows, the equivalent code is "EOF".
        expect((error as Error).message).to.be.oneOf([
          'write EPIPE',
          'write EOF',
        ])
        expect((error as Error & { code: string }).code).to.be.oneOf([
          'EPIPE',
          'EOF',
        ])
        expect((error as Error & { syscall: string }).syscall).to.equal('write')
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should fail on an undefined filter', (done) => {
    // @ts-expect-error - intentionally testing undefined filter
    run(undefined, PATH_JSON_FIXTURE)
      .catch((error) => {
        expect(error).to.be.an.instanceof(Error)
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should fail on an invalid path', (done) => {
    run(FILTER_VALID, PATH_ASTERISK_FIXTURE)
      .catch((error) => {
        expect(error).to.be.an.instanceof(Error)
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should fail on an invalid json', (done) => {
    run(FILTER_VALID, PATH_JS_FIXTURE)
      .catch((error) => {
        expect(error).to.be.an.instanceof(Error)
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should not evaluate variables in the shell', (done) => {
    run(FILTER_WITH_VARIABLE, PATH_VARIABLE_JSON_FIXTURE, { output: 'json' })
      .then((obj: unknown) => {
        expect((obj as [{ user: unknown }])[0]).to.have.property('user')
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should allow inputs over max argument size limit', (done) => {
    run('.', PATH_LARGE_JSON_FIXTURE)
      .then((output) => {
        expect(output).to.be.a('string')
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should allow custom jqPath from function argument', (done) => {
    run(FILTER_VALID, PATH_JSON_FIXTURE, undefined, PATH_BIN)
      .then((output) => {
        expect(output).to.equal('"git"')
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should allow custom jqPath from env', (done) => {
    process.env.JQ_PATH = PATH_BIN
    run(FILTER_VALID, PATH_JSON_FIXTURE)
      .then((output) => {
        expect(output).to.equal('"git"')
        done()
      })
      .catch((error) => {
        done(error)
      })
    process.env.JQ_PATH = undefined
  })

  it('should allow custom cwd', (done) => {
    run(FILTER_VALID, PATH_JSON_FIXTURE, undefined, CWD_OPTION)
      .then((output) => {
        expect(output).to.equal('"git"')
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should run as detached', (done) => {
    run(FILTER_VALID, PATH_JSON_FIXTURE, undefined, undefined, true)
      .then((output) => {
        expect(output).to.equal('"git"')
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should output empty string for a match on json output', (done) => {
    run('.foo', { foo: '' }, { input: 'json', output: 'json' })
      .then((output) => {
        expect(output).to.equal('')
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  it('should output undefined for no match on json output', (done) => {
    run('select(.foo == "bar")', { foo: '' }, { input: 'json', output: 'json' })
      .then((output) => {
        expect(output).to.equal(undefined)
        done()
      })
      .catch((error) => {
        done(error)
      })
  })
})
