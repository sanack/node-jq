import { expect } from 'chai'
import { isJSONPath } from '../src/utils'

import { PATH_JSON_FIXTURE, PATH_JS_FIXTURE } from "./constants"

describe('utils', () => {
  describe('#isJSONPath', () => {
    it('should return true when you give a json file', () => {
      expect(isJSONPath(PATH_JSON_FIXTURE)).to.equal(true)
    })

    it('should return false when you a non-json file', () => {
      expect(isJSONPath(PATH_JS_FIXTURE)).to.equal(false)
    })
  })
})
