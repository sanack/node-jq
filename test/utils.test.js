import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import path from 'path'

import { isAJsonPath, isAJson } from '../src/utils'

import FIXTURE_JSON from './fixtures/1.json'
const FIXTURE_VALID_JSON_STRING = JSON.stringify(FIXTURE_JSON)
const FIXTURE_INVALID_JSON_STRING = 'test_invalid'

const PATH_FIXTURES = path.join(__dirname, 'fixtures')
const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')
const PATH_JS_FIXTURE = path.join(PATH_FIXTURES, '1.js')

describe('utils', () => {
  describe('#isAJsonPath', () => {
    it('should return true when u give a jsonpath', () => {
      expect(isAJsonPath(PATH_JSON_FIXTURE)).to.be.true
    })

    it('should return false when u give a non-jsonpath', () => {
      expect(isAJsonPath(PATH_JS_FIXTURE)).to.be.false
    })
  })

  describe('#isAJson', () => {
    it('should return true when u give a json', () => {
      expect(isAJson(FIXTURE_VALID_JSON_STRING)).to.be.true
    })

    it('should return false when u give a non-json', () => {
      expect(isAJson(FIXTURE_INVALID_JSON_STRING)).to.be.false
    })
  })
})
