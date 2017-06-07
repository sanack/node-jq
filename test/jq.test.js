import { expect } from 'chai'
import path from 'path'

import { run } from '../src/jq'

const PATH_ROOT = path.join(__dirname, '..')
const PATH_ASTERISK_FIXTURE = path.join(PATH_ROOT, 'src', '*.js')
const PATH_FIXTURES = path.join('test', 'fixtures')

const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')
const PATH_JS_FIXTURE = path.join(PATH_FIXTURES, '1.js')
const PATH_VARIABLE_JSON_FIXTURE = path.join(PATH_FIXTURES, 'var.json')

const FILTER_VALID = '.repository.type'
const FILTER_INVALID = 'invalid'
const FILTER_WITH_VARIABLE = '[ . as $x | .user[] | {"user": ., "site": $x.site} ]'

const ERROR_INVALID_FILTER = /invalid/
const ERROR_INVALID_PATH = 'Invalid path'
const ERROR_INVALID_JSON_PATH = 'Not a json file'

describe('jq core', () => {
  it('should fulfill its promise', (done) => {
    run(FILTER_VALID, PATH_JSON_FIXTURE)
    .then((output) => {
      expect(output).to.be.a('string')
      done()
    })
    .catch((error) => {
      done(error)
    })
  })

  it('should fail on an invalid filter', (done) => {
    run(FILTER_INVALID, PATH_JSON_FIXTURE)
    .catch((error) => {
      try {
        expect(error).to.be.an.instanceof(Error)
        expect(error.message).to.match(ERROR_INVALID_FILTER)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('should fail on an invalid path', (done) => {
    run(FILTER_VALID, PATH_ASTERISK_FIXTURE)
    .catch((error) => {
      try {
        expect(error).to.be.an.instanceof(Error)
        expect(error.message).to.equal(ERROR_INVALID_PATH)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('should fail on an invalid json', (done) => {
    run(FILTER_VALID, PATH_JS_FIXTURE)
    .catch((error) => {
      try {
        expect(error).to.be.an.instanceof(Error)
        expect(error.message).to.equal(ERROR_INVALID_JSON_PATH)
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('should not evaluate variables in the shell', (done) => {
    run(FILTER_WITH_VARIABLE, PATH_VARIABLE_JSON_FIXTURE, { output: 'json' })
    .then((obj) => {
      expect(obj[0]).to.have.property('user')
      done()
    })
    .catch((error) => {
      done(error)
    })
  })
})
