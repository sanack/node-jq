import { expect } from 'chai'
import path from 'path'

import { run } from '../src/jq'
import { FILTER_UNDEFINED_ERROR } from '../src/command'
import { INVALID_PATH_ERROR, INVALID_JSON_PATH_ERROR } from '../src/utils'

const PATH_ROOT = path.join(__dirname, '..')
const PATH_BIN = path.join(PATH_ROOT, './bin')
const PATH_ASTERISK_FIXTURE = path.join(PATH_ROOT, 'src', '*.js')
const PATH_FIXTURES = path.join('test', 'fixtures')

const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')
const PATH_JS_FIXTURE = path.join(PATH_FIXTURES, '1.js')
const PATH_LARGE_JSON_FIXTURE = path.join(PATH_FIXTURES, 'large.json')
const PATH_VARIABLE_JSON_FIXTURE = path.join(PATH_FIXTURES, 'var.json')

const FIXTURE_JSON = require('./fixtures/1.json')
const FIXTURE_JSON_STRING = JSON.stringify(FIXTURE_JSON, null, 2)

const FILTER_VALID = '.repository.type'
const FILTER_INVALID = 'invalid'
const FILTER_WITH_VARIABLE =
  '[ . as $x | .user[] | {"user": ., "site": $x.site} ]'

const ERROR_INVALID_FILTER = /invalid/

const CWD_OPTION = path.join(PATH_BIN, '../')

describe('jq core', () => {
  it('should fulfill its promise', done => {
    run(FILTER_VALID, PATH_JSON_FIXTURE)
      .then(output => {
        expect(output).to.equal('"git"')
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should pass on an empty filter', done => {
    run('', PATH_JSON_FIXTURE)
      .then(output => {
        const normalizedOutput = output.replace(/\r\n/g, '\n')
        expect(normalizedOutput).to.equal(FIXTURE_JSON_STRING)
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should pass on a null filter', done => {
    run(null, PATH_JSON_FIXTURE)
      .then(output => {
        expect(output).to.equal('null')
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should fail on an invalid filter', done => {
    run(FILTER_INVALID, PATH_JSON_FIXTURE)
      .catch(error => {
        expect(error).to.be.an.instanceof(Error)
        expect(error.message).to.match(ERROR_INVALID_FILTER)
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should fail on an undefined filter', done => {
    run(undefined, PATH_JSON_FIXTURE)
      .catch(error => {
        expect(error).to.be.an.instanceof(Error)
        expect(error.message).to.equal(FILTER_UNDEFINED_ERROR)
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should fail on an invalid path', done => {
    run(FILTER_VALID, PATH_ASTERISK_FIXTURE)
      .catch(error => {
        expect(error).to.be.an.instanceof(Error)
        expect(error.message).to.equal(
          `${INVALID_PATH_ERROR}: "${PATH_ASTERISK_FIXTURE}"`
        )
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should fail on an invalid json', done => {
    run(FILTER_VALID, PATH_JS_FIXTURE)
      .catch(error => {
        expect(error).to.be.an.instanceof(Error)
        expect(error.message).to.equal(
          `${INVALID_JSON_PATH_ERROR}: "${PATH_JS_FIXTURE}"`
        )
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should not evaluate variables in the shell', done => {
    run(FILTER_WITH_VARIABLE, PATH_VARIABLE_JSON_FIXTURE, { output: 'json' })
      .then(obj => {
        expect(obj[0]).to.have.property('user')
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should allow inputs over max argument size limit', done => {
    run('.', PATH_LARGE_JSON_FIXTURE)
      .then(output => {
        expect(output).to.be.a('string')
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should allow custom jqPath from function argument', done => {
    run(FILTER_VALID, PATH_JSON_FIXTURE, undefined, PATH_BIN)
      .then(output => {
        expect(output).to.equal('"git"')
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should allow custom jqPath from env', done => {
    process.env.JQ_PATH = PATH_BIN
    run(FILTER_VALID, PATH_JSON_FIXTURE)
      .then(output => {
        expect(output).to.equal('"git"')
        done()
      })
      .catch(error => {
        done(error)
      })
    process.env.JQ_PATH = undefined
  })

  it('should allow custom cwd', done => {
    run(FILTER_VALID, PATH_JSON_FIXTURE, undefined, undefined, CWD_OPTION)
      .then(output => {
        expect(output).to.equal('"git"')
        done()
      })
      .catch(error => {
        done(error)
      })
  })
})
