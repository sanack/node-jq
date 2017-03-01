import chai, { expect } from 'chai'
import promised from 'chai-as-promised'
import dirtyChai from 'dirty-chai'
import path from 'path'
import { isJSONPath } from '../src/utils'

const PATH_FIXTURES = path.join(__dirname, 'fixtures')
const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')
const PATH_JS_FIXTURE = path.join(PATH_FIXTURES, '1.js')

chai.use(promised)
chai.use(dirtyChai)

describe('utils', () => {
  describe('#isJSONPath', () => {
    it('should return true when you give a json file', () => {
      expect(isJSONPath(PATH_JSON_FIXTURE)).to.be.true()
    })

    it('should return false when you a non-json file', () => {
      expect(isJSONPath(PATH_JS_FIXTURE)).to.be.false()
    })
  })
})
