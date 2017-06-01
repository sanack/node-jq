import { expect } from 'chai'
import path from 'path'

import { run } from '../src/jq'
import { optionDefaults } from '../src/options'

const PATH_FIXTURES = path.join('test', 'fixtures')
const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')

const FIXTURE_JSON = require('./fixtures/1.json')
const FIXTURE_JSON_STRING = JSON.stringify(FIXTURE_JSON)
const FIXTURE_JSON_PRETTY = JSON.stringify(FIXTURE_JSON, null, 2)

const OPTION_DEFAULTS = {
  input: 'file',
  output: 'pretty'
}

const multiEOL = (text) => {
  return [text, text.replace(/\n/g, '\r\n')]
}

describe('options', () => {
  it('defaults should be as expected', () => {
    expect(optionDefaults).to.deep.equal(OPTION_DEFAULTS)
  })

  describe('input: file', () => {
    it('should accept a file path as input', () => {
      run('.', PATH_JSON_FIXTURE, { input: 'file' })
      .then((output) => {
        expect(output).to.not.equal(null)
      })
      .catch((error) => {
        expect(error, error.message).to.equal(null)
      })
    })
  })

  describe('input: json', () => {
    it('should accept a json object as input', () => {
      run('.', FIXTURE_JSON, { input: 'json' })
      .then((output) => {
        expect(output).to.not.equal(null)
      })
      .catch((error) => {
        expect(error, error.message).to.equal(null)
      })
    })
  })

  describe('input: string', () => {
    it('should accept a json string as input', () => {
      run('.', FIXTURE_JSON_STRING, { input: 'string' })
      .then((output) => {
        expect(output).to.not.equal(null)
      })
      .catch((error) => {
        expect(error, error.message).to.equal(null)
      })
    })
  })

  describe('output: json', () => {
    it('should return a stringified json', () => {
      run('.', PATH_JSON_FIXTURE, { output: 'json' })
      .then((obj) => {
        expect(obj).to.deep.equal(FIXTURE_JSON)
      })
      .catch((error) => {
        expect(error, error.message).to.equal(null)
      })
    })

    it('it should return a string if the filter calls an array', () => {
      run('.contributors[]', PATH_JSON_FIXTURE, { output: 'json' })
      .then((obj) => {
        expect(obj).to.be.oneOf(
          multiEOL(
            JSON.stringify(FIXTURE_JSON.contributors[0], null, 2) +
            '\n' +
            JSON.stringify(FIXTURE_JSON.contributors[1], null, 2)
          )
        )
      })
      .catch((error) => {
        expect(error, error.message).to.equal(null)
      })
    })
  })

  describe('output: string', () => {
    it('should return a minified json string', () => {
      run('.', PATH_JSON_FIXTURE, { output: 'string' })
      .then((output) => {
        expect(output).to.equal(FIXTURE_JSON_STRING)
      })
      .catch((error) => {
        expect(error, error.message).to.equal(null)
      })
    })
  })

  describe('output: pretty', () => {
    it('should return a prettified json string', () => {
      run('.', PATH_JSON_FIXTURE, { output: 'pretty' })
      .then((output) => {
        expect(output).to.be.oneOf(
          multiEOL(FIXTURE_JSON_PRETTY)
        )
      })
      .catch((error) => {
        expect(error, error.message).to.equal(null)
      })
    })
  })
})
