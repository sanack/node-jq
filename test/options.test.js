import chai, { expect } from 'chai'
import promised from 'chai-as-promised'
import path from 'path'

import { run } from '../src/jq'
import { optionDefaults } from '../src/options'

require('json5/lib/require')
chai.use(promised)

const PATH_FIXTURES = path.join(__dirname, 'test', 'fixtures')
const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')
const PATH_JSON5_FIXTURE = path.join(PATH_FIXTURES, '1.json5')

const FIXTURE_JSON = require(PATH_JSON_FIXTURE)
const FIXTURE_JSON5 = require(PATH_JSON5_FIXTURE)
const FIXTURE_JSON_STRING = JSON.stringify(FIXTURE_JSON)
const FIXTURE_JSON_PRETTY = JSON.stringify(FIXTURE_JSON, null, 2)

const OPTION_DEFAULTS = {
  input: 'file',
  output: 'pretty'
}

const multiEOL = text => {
  return [text, text.replace(/\n/g, '\r\n')]
}

describe('options', () => {
  it('defaults should be as expected', () => {
    expect(optionDefaults).to.deep.equal(OPTION_DEFAULTS)
  })

  describe('input: file', () => {
    it('should accept a file path as input', () => {
      return expect(run('.', PATH_JSON_FIXTURE, { input: 'file' })).to
        .eventually.be.fulfilled
    })
  })

  describe('input: json', () => {
    it('should accept a json object as input', () => {
      return expect(run('.', FIXTURE_JSON, { input: 'json' })).to.eventually.be
        .fulfilled
    })
  })

  describe('input: json5', () => {
    it('should accept a json object as input', () => {
      return expect(
        run('.', FIXTURE_JSON5, {
          input: 'json5'
        })
      ).to.eventually.be.fulfilled
    })
  })

  describe('input: string', () => {
    it('should accept a json string as input', () => {
      return expect(run('.', FIXTURE_JSON_STRING, { input: 'string' })).to
        .eventually.be.fulfilled
    })
  })

  describe('output: json', () => {
    it('should return a stringified json', () => {
      return expect(
        run('.', PATH_JSON_FIXTURE, { output: 'json' })
      ).to.eventually.become(FIXTURE_JSON)
    })

    it('it should return a string if the filter calls an array', () => {
      return expect(
        run('.contributors[]', PATH_JSON_FIXTURE, { output: 'json' })
      ).to.eventually.deep.oneOf(
        multiEOL(
          JSON.stringify(FIXTURE_JSON.contributors[0], null, 2) +
            '\n' +
            JSON.stringify(FIXTURE_JSON.contributors[1], null, 2)
        )
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
      ).to.eventually.deep.oneOf(multiEOL(FIXTURE_JSON_PRETTY))
    })
  })
})
