import { expect } from 'chai'
import path from 'path'

import { run } from '../src/jq'
import { optionDefaults } from '../src/options'

const PATH_FIXTURES = path.join('test', 'fixtures')
const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')
const PATH_SLURP_FIXTURE_1 = path.join(PATH_FIXTURES, 'slurp1.json')
const PATH_SLURP_FIXTURE_2 = path.join(PATH_FIXTURES, 'slurp2.json')
const PATH_SORT_FIXTURE = path.join(PATH_FIXTURES, 'sort.json')

const FIXTURE_JSON = require('./fixtures/1.json')
const FIXTURE_JSON_STRING = JSON.stringify(FIXTURE_JSON)
const FIXTURE_JSON_PRETTY = JSON.stringify(FIXTURE_JSON, null, 2)

const OPTION_DEFAULTS = {
  input: 'file',
  output: 'pretty',
  slurp: false,
  sort: false,
  raw: false
}

const multiEOL = (text) => {
  return [text, text.replace(/\n/g, '\r\n')]
}

describe('options', () => {
  it('defaults should be as expected', () => {
    expect(optionDefaults).to.deep.equal(OPTION_DEFAULTS)
  })

  describe('input: file', () => {
    it('should accept a file path as input', (done) => {
      run('.', PATH_JSON_FIXTURE, { input: 'file' })
        .then((output) => {
          expect(output).to.not.equal(null)
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })

  describe('input: file', () => {
    it('should accept an array with multiple file paths as input', (done) => {
      run('.', [
        PATH_JSON_FIXTURE,
        PATH_JSON_FIXTURE
      ], { input: 'file' })
        .then((output) => {
          expect(output).to.not.equal(null)
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })

  describe('input: json', () => {
    it('should accept a json object as input', (done) => {
      run('.', FIXTURE_JSON, { input: 'json' })
        .then((output) => {
          expect(output).to.not.equal(null)
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })

  describe('input: string', () => {
    it('should accept a json string as input', (done) => {
      run('.', FIXTURE_JSON_STRING, { input: 'string' })
        .then((output) => {
          expect(output).to.not.equal(null)
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })

  describe('output: json', () => {
    it('should return a stringified json', (done) => {
      run('.', PATH_JSON_FIXTURE, { output: 'json' })
        .then((obj) => {
          expect(obj).to.deep.equal(FIXTURE_JSON)
          done()
        })
        .catch((error) => {
          done(error)
        })
    })

    it('it should return a string if the filter calls an array', (done) => {
      run('.contributors[]', PATH_JSON_FIXTURE, { output: 'json' })
        .then((obj) => {
          expect(obj).to.be.oneOf(
            multiEOL(
              JSON.stringify(FIXTURE_JSON.contributors[0], null, 2) +
            '\n' +
            JSON.stringify(FIXTURE_JSON.contributors[1], null, 2)
            )
          )
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })

  describe('output: string', () => {
    it('should return a minified json string', (done) => {
      run('.', PATH_JSON_FIXTURE, { output: 'string' })
        .then((output) => {
          expect(output).to.equal(FIXTURE_JSON_STRING)
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })

  describe('output: compact', () => {
    it('should return a minified json string', (done) => {
      run('.', PATH_JSON_FIXTURE, { output: 'compact' })
        .then((output) => {
          expect(output).to.equal(FIXTURE_JSON_STRING)
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })

  describe('output: pretty', () => {
    it('should return a prettified json string', (done) => {
      run('.', PATH_JSON_FIXTURE, { output: 'pretty' })
        .then((output) => {
          expect(output).to.be.oneOf(
            multiEOL(FIXTURE_JSON_PRETTY)
          )
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })

  describe('slurp: true', () => {
    it('should run the filter once on multiple objects as input', (done) => {
      run('.', [
        PATH_SLURP_FIXTURE_1,
        PATH_SLURP_FIXTURE_2
      ], {
        output: 'json',
        slurp: true
      })
        .then((output) => {
          expect(output).to.be.an('array')
          expect(output).to.have.lengthOf(2)
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })

  describe('sort: false', () => {
    it('keys should be ordered the same as in input file', (done) => {
      run('.', [
        PATH_SORT_FIXTURE
      ], {
        output: 'string',
        sort: false
      })
        .then((output) => {
          expect(output).to.be.a('string')
          expect(output).to.eql('{"z":1,"a":2}')
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })

  describe('sort: true', () => {
    it('keys should be ordered alphabetically', (done) => {
      run('.', [
        PATH_SORT_FIXTURE
      ], {
        output: 'string',
        sort: true
      })
        .then((output) => {
          expect(output).to.be.a('string')
          expect(output).to.eql('{"a":2,"z":1}')
          done()
        })
        .catch((error) => {
          done(error)
        })
    })
  })

  describe('raw: true', () => {
    it('output should be able to output raw strings instead of JSON texts', (done) => {
      run('.name', PATH_JSON_FIXTURE, {
        input: 'file',
        raw: true
      })
        .then(output => {
          expect(output).to.equal('node-jq')
          done()
        })
        .catch(e => done(e))
    })

    it('output should be able to output JSON texts instead of raw strings', (done) => {
      run('.name', PATH_JSON_FIXTURE, {
        input: 'file',
        raw: false
      })
        .then(output => {
          expect(output).to.equal('"node-jq"')
          done()
        })
        .catch(e => done(e))
    })
  })
})
