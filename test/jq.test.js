import chai, { expect } from 'chai'
import promised from 'chai-as-promised'
import path from 'path'

import { run } from '../src/jq'

chai.use(promised)

const PATH_ROOT = path.join(__dirname, '..')
const PATH_ASTERISK_FIXTURE = path.join(PATH_ROOT, 'src', '*.js')
const PATH_FIXTURES = path.join('test', 'fixtures')

const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')
const PATH_JS_FIXTURE = path.join(PATH_FIXTURES, '1.js')
const PATH_VARIABLE_JSON_FIXTURE = path.join(PATH_FIXTURES, 'var.json')

const FILTER_VALID = '.repository.type'
const FILTER_INVALID = 'invalid'
const FILTER_WITH_VARIABLE = '[ . as $x | .user[] | {"user": ., "site": $x.site} ]'

const ERROR_INVALID_FILTER = /error: invalid/
const ERROR_INVALID_PATH = 'Invalid path'
const ERROR_INVALID_JSON_PATH = 'Not a json file'

describe('jq core', () => {
  it('should fulfill its promise', () => {
    return expect(
      run(FILTER_VALID, PATH_JSON_FIXTURE)
    ).to.eventually.be.fulfilled
  })

  it('should fail on an invalid filter', () => {
    return expect(
      run(FILTER_INVALID, PATH_JSON_FIXTURE)
    ).to.eventually.be.rejectedWith(Error, ERROR_INVALID_FILTER)
  })

  it('should fail on an invalid path', () => {
    return expect(
      run(FILTER_VALID, PATH_ASTERISK_FIXTURE)
    ).to.eventually.be.rejectedWith(Error, ERROR_INVALID_PATH)
  })

  it('should fail on an invalid json', () => {
    return expect(
      run(FILTER_VALID, PATH_JS_FIXTURE)
    ).to.eventually.be.rejectedWith(Error, ERROR_INVALID_JSON_PATH)
  })

  it('should not evaluate variables in the shell', () => {
    return expect(
      run(FILTER_WITH_VARIABLE, PATH_VARIABLE_JSON_FIXTURE)
    ).to.eventually.have('user')
  })
})
