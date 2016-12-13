import chai, { expect } from 'chai'
import promised from 'chai-as-promised'
chai.use(promised)
import path from 'path'

import { run } from '../src/jq'
import { optionDefaults } from '../src/options'

const PATH_FIXTURES = path.join(__dirname, 'fixtures')
const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')

const FIXTURE_JSON = require(PATH_JSON_FIXTURE)
const FIXTURE_JSON_STRING = JSON.stringify(FIXTURE_JSON)
const FIXTURE_JSON_PRETTY = JSON.stringify(FIXTURE_JSON, null, 2)

const OPTION_DEFAULTS = {
  input: 'file',
  output: 'pretty'
}

describe('options', () => {
  it('defaults should be as expected', () => {
    expect(optionDefaults).to.deep.equal(OPTION_DEFAULTS)
  })

  describe('input: file', () => {
    it('should accept a file path as input', () => {
      return expect(
        run('.', PATH_JSON_FIXTURE, { input: 'file' })
      ).to.eventually.be.fulfilled
    })
  })

  describe('input: json', () => {
    it('should accept a json object as input', () => {
      return expect(
        run('.', FIXTURE_JSON, { input: 'json' })
      ).to.eventually.be.fulfilled
    })
  })

  describe('input: string', () => {
    it('should accept a json string as input', () => {
      return expect(
        run('.', FIXTURE_JSON_STRING, { input: 'string' })
      ).to.eventually.be.fulfilled
    })
  })

  describe('output: json', () => {
    it('should return a json', () => {
      return expect(
        run('.', PATH_JSON_FIXTURE, { output: 'json' })
      ).to.eventually.become(FIXTURE_JSON)
    })

    it('should return a json in case of filter fail', () => {
      return expect(
        run('.contributors[]', PATH_JSON_FIXTURE, { output: 'json' })
      ).to.eventually.become(
        JSON.stringify(FIXTURE_JSON.contributors[0], null, 2) +
        '\n' +
        JSON.stringify(FIXTURE_JSON.contributors[1], null, 2)
      )
    })
  })

  describe('output: string', () => {
    it('should return a minified json string', () => {
      return expect(
        run('.', PATH_JSON_FIXTURE, { output: 'string' })
      ).to.eventually.become(FIXTURE_JSON_STRING)
    })
  })

  describe('output: pretty', () => {
    it('should return a prettified json string', () => {
      return expect(
        run('.', PATH_JSON_FIXTURE, { output: 'pretty' })
      ).to.eventually.become(FIXTURE_JSON_PRETTY)
    })
  })
})
