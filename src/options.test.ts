import { describe, it, expect } from 'vitest'
import path from 'path'

import { run } from '.'
import { optionDefaults } from './options'
import FIXTURE_JSON from './__test__/fixtures/1.json'
import FIXTURE_JSON_ARRAY from './__test__/fixtures/2.json'

const PATH_FIXTURES = path.join(__dirname, '__test__', 'fixtures')
const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')
const PATH_JSON_ARRAY_FIXTURE = path.join(PATH_FIXTURES, '2.json')
const PATH_SLURP_FIXTURE_1 = path.join(PATH_FIXTURES, 'slurp1.json')
const PATH_SLURP_FIXTURE_2 = path.join(PATH_FIXTURES, 'slurp2.json')
const PATH_SORT_FIXTURE = path.join(PATH_FIXTURES, 'sort.json')

const FIXTURE_JSON_STRING = JSON.stringify(FIXTURE_JSON)
const FIXTURE_JSON_PRETTY = JSON.stringify(FIXTURE_JSON, null, 2)

const FIXTURE_JSON_ARRAY_STRING = JSON.stringify(FIXTURE_JSON_ARRAY)
const FIXTURE_JSON_ARRAY_PRETTY = JSON.stringify(FIXTURE_JSON_ARRAY, null, 2)

const OPTION_DEFAULTS = {
  input: 'file',
  output: 'pretty',
  slurp: false,
  sort: false,
  raw: false,
  locations: [],
  color: false
}

const multiEOL = (text: string) => {
  return [text, text.replace(/\n/g, '\r\n')]
}

describe('options', () => {
  it('defaults should be as expected', () => {
    expect(optionDefaults).to.deep.equal(OPTION_DEFAULTS)
  })

  describe('input', () => {
    describe('file', () => {
      it('should accept a file path as input', () => {
        return run('.', PATH_JSON_FIXTURE, { input: 'file' })
          .then(output => {
            expect(output).to.not.equal(null)
          })
      })

      it('should accept an array with multiple file paths as input', () => {
        return run('.', [PATH_JSON_FIXTURE, PATH_JSON_FIXTURE], { input: 'file' })
          .then(output => {
            expect(output).to.not.equal(null)
          })
      })

      it('should fail on an empty path', () => {
        return run('.', '', { input: 'file' })
          .catch(error => {
            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`node-jq: invalid path argument supplied: ""`)
          })
      })

      it('should fail on a null path', () => {
        return run('.', null, { input: 'file' })
          .catch(error => {
            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`node-jq: invalid path argument supplied: "null"`)
          })
      })

      it('should fail on an undefined path', () => {
        return run('.', undefined, { input: 'file' })
          .catch(error => {
            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`node-jq: invalid path argument supplied: "undefined"`)
          })
      })
    })

    describe('json', () => {
      it('should accept a json object as input', () => {
        return run('.', FIXTURE_JSON, { input: 'json' })
          .then(output => {
            expect(output).to.not.equal(null)
          })
      })

      it('should accept an array object', () => {
        return run('.', FIXTURE_JSON_ARRAY, { input: 'json' })
          .then(output => {
            expect(output).to.not.equal(null)
          })
      })

      it('should accept an empty string as json object', () => {
        return run('.', '', { input: 'json' })
          .then(output => {
            expect(output).to.equal('""')
          })
      })
    })

    describe('string', () => {
      it('should accept a json string as input', () => {
        return run('.', FIXTURE_JSON_STRING, { input: 'string' })
          .then(output => {
            expect(output).to.not.equal(null)
          })
      })
    })
  })

  describe('output', () => {
    describe('json', () => {
      it('should return a stringified json', () => {
        return run('.', PATH_JSON_FIXTURE, { output: 'json' })
          .then(obj => {
            expect(obj).to.deep.equal(FIXTURE_JSON)
          })
      })

      it('it should return a string if the filter calls an array', () => {
        return run('.contributors[]', PATH_JSON_FIXTURE, { output: 'json' })
          .then(obj => {
            expect(obj).to.be.oneOf(
              multiEOL(
                JSON.stringify(FIXTURE_JSON.contributors[0], null, 2) +
                  '\n' +
                  JSON.stringify(FIXTURE_JSON.contributors[1], null, 2)
              )
            )
          })
      })
    })

    describe('string', () => {
      it('should return a minified json string', () => {
        return run('.', PATH_JSON_FIXTURE, { output: 'string' })
          .then(output => {
            expect(output).to.equal(FIXTURE_JSON_STRING)
          })
      })

      it('should return a minified json array string', () => {
        return run('.', PATH_JSON_ARRAY_FIXTURE, { output: 'string' })
          .then(output => {
            expect(output).to.equal(FIXTURE_JSON_ARRAY_STRING)
          })
      })
    })

    describe('compact', () => {
      it('should return a minified json string', () => {
        return run('.', PATH_JSON_FIXTURE, { output: 'compact' })
          .then(output => {
            expect(output).to.equal(FIXTURE_JSON_STRING)
          })
      })
    })

    describe('pretty', () => {
      it('should return a prettified json string', () => {
        return run('.', PATH_JSON_FIXTURE, { output: 'pretty' })
          .then(output => {
            expect(output).to.be.oneOf(multiEOL(FIXTURE_JSON_PRETTY))
          })
      })

      it('should return a prettified json array string', () => {
        return run('.', PATH_JSON_ARRAY_FIXTURE, { output: 'pretty' })
          .then(output => {
            expect(output).to.be.oneOf(multiEOL(FIXTURE_JSON_ARRAY_PRETTY))
          })
      })
    })
  })

  describe('slurp: true', () => {
    it('should run the filter once on multiple objects as input', () => {
      run('.', [PATH_SLURP_FIXTURE_1, PATH_SLURP_FIXTURE_2], {
        output: 'json',
        slurp: true
      })
        .then(output => {
          expect(output).to.be.an('array')
          expect(output).to.have.lengthOf(2)
        })
        .catch(error => {
          expect(error).to.be.undefined
        })
    })
  })

  describe('sort: false', () => {
    it('keys should be ordered the same as in input file', () => {
      run('.', [PATH_SORT_FIXTURE], {
        output: 'string',
        sort: false
      })
        .then(output => {
          expect(output).to.be.a('string')
          expect(output).to.eql('{"z":1,"a":2}')
        })
        .catch(error => {
          expect(error).to.be.undefined
        })
    })
  })

  describe('sort: true', () => {
    it('keys should be ordered alphabetically', () => {
      return run('.', [PATH_SORT_FIXTURE], {
        output: 'string',
        sort: true
      })
        .then(output => {
          expect(output).to.be.a('string')
          expect(output).to.eql('{"a":2,"z":1}')
        })
        .catch(error => {
          expect(error).to.be.undefined
        })
    })
  })

  describe('raw: true', () => {
    it('output should be able to output raw strings instead of JSON texts', () => {
      return run('.name', PATH_JSON_FIXTURE, {
        input: 'file',
        raw: true
      })
        .then(output => {
          expect(output).to.equal('node-jq')
        })
    })

    it('output should be able to output JSON texts instead of raw strings', () => {
      return run('.name', PATH_JSON_FIXTURE, {
        input: 'file',
        raw: false
      })
        .then(output => {
          expect(output).to.equal('"node-jq"')
        })
    })
  })
})
