import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import path from 'path'

import { run } from '../src/jq'

const PATH_ROOT = path.join(__dirname, '..')
const PATH_FIXTURES = path.join(__dirname, 'fixtures')
const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')
const PATH_JS_FIXTURE = path.join(PATH_FIXTURES, '1.js')
const PATH_ASTERISK_FIXTURE = path.join(PATH_ROOT, 'src', '*.js')

const FILTER_VALID = '. | map(select(.a == .id))'
const FILTER_INVALID = 'invalid'

const ERROR_INVALID_FILTER = /error: invalid/
const ERROR_INVALID_PATH = 'Invalid path'
const ERROR_INVALID_JSON_PATH = 'Not a .json file'

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
})
