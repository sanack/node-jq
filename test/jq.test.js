import chai, { expect, assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import { run, isAJson, isAJsonPath } from '../src/jq'
import path from 'path'
import jsonFixture from './fixtures/1.json'

const FIXTURES_PATH = path.join(__dirname, 'fixtures')
const ROOT_PATH = path.join(__dirname, '..')
const jsonPathFixture = path.join(FIXTURES_PATH, '1.json')
const jsPathFixture = path.join(FIXTURES_PATH, '1.js')
const filter = '. | map(select(.a == .id))'

describe('path', () => {
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
      const jsonStringifiedFixture = JSON.stringify(jsonFixture)
      expect(isAJson(jsonStringifiedFixture)).to.be.equal(true)
    })

    it('should return false when u give a non-json', () => {
      expect(isAJson('lola')).to.be.equal(false)
    })
  })
})

describe('jq runs a cli', () => {
  it('should return a stdout object', (done) => {
    run(filter, jsonPathFixture)
      .then((result) => {
        expect(result).to.be.instanceof(Object)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  it('should fail on a non valid filter', () => {
    return assert.isRejected(
      run('lola', jsonPathFixture),
      Error
    )
  })

  it('should fail on a non valid path', () => {
    return assert.isRejected(
      run(filter, path.join(ROOT_PATH, 'src', '*.js')),
      Error,
      'Is a invalid path'
    )
  })

  it('should fail on a non valid json', () => {
    return assert.isRejected(
      run(filter, path.join(ROOT_PATH, 'src', 'js.js')),
      Error,
      'Isn`t a JSON'
    )
  })

  it('should run the filter inline with null-input', (done) => {
    const jsonFixtureToString = JSON.stringify(jsonFixture)
    run(
      '.',
      jsonFixtureToString,
      { nullInput: true }
    )
    .then((result) => {
      expect(result).to.be.equal(jsonFixtureToString)
      done()
    })
    .catch((err) => {
      done(err)
    })
  })
})
