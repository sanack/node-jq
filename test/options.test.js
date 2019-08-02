import { expect } from 'chai'

import { run } from '../src/jq'
import { paramOptionDefaults } from '../src/options'

import {
  FIXTURE_COLOR, FIXTURE_JSON_STRING, FIXTURE_JSON_PRETTY, FIXTURE_JSON,
  PATH_JSON_FIXTURE, PATH_SLURP_FIXTURE_1, PATH_SLURP_FIXTURE_2, PATH_FIXTURES,
  PATH_SORT_FIXTURE,
  INVALID_JSON_PATH_ERROR, INVALID_PATH_ERROR, INVALID_TYPE_ERROR,
  INPUT_JSON_UNDEFINED_ERROR, INPUT_STRING_ERROR
} from "./constants";

const OPTION_DEFAULTS = {
  input: 'file',
  output: 'pretty',
  slurp: false,
  sort: false,
  raw: false
}

const multiEOL = text => {
  return [text, text.replace(/\n/g, '\r\n')]
}

describe('options', () => {
  it('defaults should be as expected', () => {
    expect(paramOptionDefaults).to.deep.equal(OPTION_DEFAULTS)
  })

  describe('input', () => {
    describe('file', () => {
      it('should accept a file path as input', done => {
        run('.', PATH_JSON_FIXTURE, { input: 'file' })
          .then(output => {
            expect(output).to.not.equal(null)
            done()
          })
          .catch(error => {
            done(error)
          })
      })

      it('should accept an array with multiple file paths as input', done => {
        run('.', [PATH_JSON_FIXTURE, PATH_JSON_FIXTURE], { input: 'file' })
          .then(output => {
            expect(output).to.not.equal(null)
            done()
          })
          .catch(error => {
            done(error)
          })
      })

      it('should fail on an empty path', done => {
        run('.', '', { input: 'file' })
          .catch(error => {
            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`${INVALID_JSON_PATH_ERROR}: ""`)
            done()
          })
          .catch(error => {
            done(error)
          })
      })

      it('should fail on a null path', done => {
        run('.', null, { input: 'file' })
          .catch(error => {
            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`${INVALID_PATH_ERROR}: "null"`)
            done()
          })
          .catch(error => {
            done(error)
          })
      })

      it('should fail on an undefined path', done => {
        run('.', undefined, { input: 'file' })
          .catch(error => {
            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`${INVALID_PATH_ERROR}: "undefined"`)
            done()
          })
          .catch(error => {
            done(error)
          })
      })
    })

    describe('json', () => {
      it('should accept a json object as input', done => {
        run('.', FIXTURE_JSON, { input: 'json' })
          .then(output => {
            expect(output).to.not.equal(null)
            done()
          })
          .catch(error => {
            done(error)
          })
      })

      it('should accept an empty string as json object', done => {
        run('.', '', { input: 'json' })
          .then(output => {
            expect(output).to.equal('""')
            done()
          })
          .catch(error => {
            done(error)
          })
      })

      it('should accept a null json object', done => {
        run('.', null, { input: 'json' })
          .then(output => {
            expect(output).to.equal('null')
            done()
          })
          .catch(error => {
            done(error)
          })
      })

      it('should fail on an undefined json object', done => {
        run('.', undefined, { input: 'json' })
          .catch(error => {
            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(INPUT_JSON_UNDEFINED_ERROR)
            done()
          })
          .catch(error => {
            done(error)
          })
      })
    })

    describe('string', () => {
      it('should accept a json string as input', done => {
        run('.', FIXTURE_JSON_STRING, { input: 'string' })
          .then(output => {
            expect(output).to.not.equal(null)
            done()
          })
          .catch(error => {
            done(error)
          })
      })

      it('should fail on an empty string', done => {
        run('.', '', { input: 'string' })
          .catch(error => {
            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`${INPUT_STRING_ERROR}: ""`)
            done()
          })
          .catch(error => {
            done(error)
          })
      })

      it('should fail on a null string', done => {
        run('.', null, { input: 'string' })
          .catch(error => {
            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`${INPUT_STRING_ERROR}: "null"`)
            done()
          })
          .catch(error => {
            done(error)
          })
      })

      it('should fail on an undefined string', done => {
        run('.', undefined, { input: 'string' })
          .catch(error => {
            expect(error).to.be.an.instanceof(Error)
            expect(error.message).to.equal(`${INPUT_STRING_ERROR}: "undefined"`)
            done()
          })
          .catch(error => {
            done(error)
          })
      })
    })
  })

  describe('output', () => {
    describe('json', () => {
      it('should return a stringified json', done => {
        run('.', PATH_JSON_FIXTURE, { output: 'json' })
          .then(obj => {
            expect(obj).to.deep.equal(FIXTURE_JSON)
            done()
          })
          .catch(error => {
            done(error)
          })
      })

      it('it should return a string if the filter calls an array', done => {
        run('.contributors[]', PATH_JSON_FIXTURE, { output: 'json' })
          .then(obj => {
            expect(obj).to.be.oneOf(
              multiEOL(
                JSON.stringify(FIXTURE_JSON.contributors[0], null, 2) +
                '\n' +
                JSON.stringify(FIXTURE_JSON.contributors[1], null, 2)
              )
            )
            done()
          })
          .catch(error => {
            done(error)
          })
      })
    })

    describe('string', () => {
      it('should return a minified json string', done => {
        run('.', PATH_JSON_FIXTURE, { output: 'string' })
          .then(output => {
            expect(output).to.equal(FIXTURE_JSON_STRING)
            done()
          })
          .catch(error => {
            done(error)
          })
      })
    })

    describe('compact', () => {
      it('should return a minified json string', done => {
        run('.', PATH_JSON_FIXTURE, { output: 'compact' })
          .then(output => {
            expect(output).to.equal(FIXTURE_JSON_STRING)
            done()
          })
          .catch(error => {
            done(error)
          })
      })
    })

    describe('pretty', () => {
      it('should return a prettified json string', done => {
        run('.', PATH_JSON_FIXTURE, { output: 'pretty' })
          .then(output => {
            expect(output).to.be.oneOf(multiEOL(FIXTURE_JSON_PRETTY))
            done()
          })
          .catch(error => {
            done(error)
          })
      })
    })

    describe('color', () => {
      it('should return a colored output', done => {
        run('.', PATH_JSON_FIXTURE, { color: true })
          .then(output => {
            expect(output).to.equal(FIXTURE_COLOR)
            done()
          })
          .catch(error => {
            done(error);
          })
      })
    })
  })

  describe('slurp: true', () => {
    it('should run the filter once on multiple objects as input', done => {
      run('.', [PATH_SLURP_FIXTURE_1, PATH_SLURP_FIXTURE_2], {
        output: 'json',
        slurp: true
      })
        .then(output => {
          expect(output).to.be.an('array')
          expect(output).to.have.lengthOf(2)
          done()
        })
        .catch(error => {
          done(error)
        })
    })
  })

  describe('sort: false', () => {
    it('keys should be ordered the same as in input file', done => {
      run('.', [PATH_SORT_FIXTURE], {
        output: 'string',
        sort: false
      })
        .then(output => {
          expect(output).to.be.a('string')
          expect(output).to.eql('{"z":1,"a":2}')
          done()
        })
        .catch(error => {
          done(error)
        })
    })
  })

  describe('sort: true', () => {
    it('keys should be ordered alphabetically', done => {
      run('.', [PATH_SORT_FIXTURE], {
        output: 'string',
        sort: true
      })
        .then(output => {
          expect(output).to.be.a('string')
          expect(output).to.eql('{"a":2,"z":1}')
          done()
        })
        .catch(error => {
          done(error)
        })
    })
  })

  describe('raw: true', () => {
    it('output should be able to output raw strings instead of JSON texts', done => {
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

    it('output should be able to output JSON texts instead of raw strings', done => {
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

  it('locations', (done) => {
    run('.', PATH_JSON_FIXTURE, { locations: [PATH_FIXTURES, PATH_FIXTURES] })
      .then((output) => {
        expect(output).to.not.equal(null)
        done()
      })
      .catch((error) => {
        done(error)
      })
  })

  describe('validators', () => {
    describe('invalid type', () => {
      it('should return non-colored output', done => {
        run('', PATH_JSON_FIXTURE)
          .then(output => {
            const normalizedOutput = output.replace(/\r\n/g, '\n')
            expect(normalizedOutput).to.equal(FIXTURE_JSON_PRETTY)
            done()
          })
          .catch(error => {
            done(error)
          })
      })
    })

    describe('invalid non-array value', () => {
      it('should return error', done => {
        run('.', PATH_JSON_FIXTURE, { locations: PATH_JSON_FIXTURE })
          .catch((error) => {
            expect(error).to.be.an.instanceof(Error);
            expect(error.message).to.equal(INVALID_TYPE_ERROR)
            done()
          })
      })
    })
    describe('invalid array objects type', () => {
      it('should return error', done => {
        run('.', PATH_JSON_FIXTURE, { locations: [PATH_JSON_FIXTURE, 0] })
          .catch((error) => {
            expect(error).to.be.an.instanceof(Error);
            expect(error.message).to.equal(INVALID_TYPE_ERROR)
            done()
          })
      })
    })
    describe('invalid value type', () => {
      it('should return error', done => {
        run('.', PATH_JSON_FIXTURE, { raw: "true"})
          .catch((error) => {
            expect(error).to.be.an.instanceof(Error);
            expect(error.message).to.equal(INVALID_TYPE_ERROR)
            done()
          })
      })
    })
  })
})