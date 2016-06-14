import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import path from 'path'
import jsonFixture from './fixtures/1.json'
import { isAJsonPath, isAJson } from '../src/utils'

const jsonFixtureToString = JSON.stringify(jsonFixture)
const FIXTURES_PATH = path.join(__dirname, 'fixtures')
const jsonPathFixture = path.join(FIXTURES_PATH, '1.json')
const jsPathFixture = path.join(FIXTURES_PATH, '1.js')

describe('utils', () => {
  describe('#isAJsonPath', () => {
    it('should return true when u give a jsonpath', () => {
      expect(isAJsonPath(jsonPathFixture)).to.be.equal(true)
    })

    it('should return false when u give a non-jsonpath', () => {
      expect(isAJsonPath(jsPathFixture)).to.be.equal(false)
    })
  })

  describe('#isAJson', () => {
    it('should return true when u give a json', () => {
      expect(isAJson(jsonFixtureToString)).to.be.equal(true)
    })

    it('should return false when u give a non-json', () => {
      expect(isAJson('lola')).to.be.equal(false)
    })
  })
})
