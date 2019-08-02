import { expect } from 'chai'
import { run, JQ, jq } from '../src/jq'

import {
  FIXTURE_JSON_PRETTY,
  FILTER_VALID, FILTER_WITH_VARIABLE, PATH_JS_FIXTURE,
  FILTER_UNDEFINED_ERROR,
  PATH_JSON_FIXTURE, PATH_ASTERISK_FIXTURE, PATH_VARIABLE_JSON_FIXTURE,
  PATH_LARGE_JSON_FIXTURE, PATH_JS_FIXTURE, PATH_FIXTURES,
  INVALID_JSON_PATH_ERROR, INVALID_PATH_ERROR,
  ERROR_INVALID_JQPATH
} from "./constants"

describe('jq core', () => {
  it('should fulfill its promise', done => {
    run(FILTER_VALID, PATH_JSON_FIXTURE)
      .then(output => {
        expect(output).to.equal('"git"')
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should pass on an empty filter', done => {
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

  it('should pass on a null filter', done => {
    run(null, PATH_JSON_FIXTURE)
      .then(output => {
        expect(output).to.equal('null')
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should fail on an undefined filter', done => {
    run(undefined, PATH_JSON_FIXTURE)
      .catch(error => {
        expect(error).to.be.an.instanceof(Error)
        expect(error.message).to.equal(FILTER_UNDEFINED_ERROR)
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should fail on an undefined filter', done => {
    run(undefined, PATH_JSON_FIXTURE)
      .catch(error => {
        expect(error).to.be.an.instanceof(Error)
        expect(error.message).to.equal(FILTER_UNDEFINED_ERROR)
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should fail on an invalid path', done => {
    run(FILTER_VALID, PATH_ASTERISK_FIXTURE)
      .catch(error => {
        expect(error).to.be.an.instanceof(Error)
        expect(error.message).to.equal(
          `${INVALID_PATH_ERROR}: "${PATH_ASTERISK_FIXTURE}"`
        )
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should fail on an invalid json', done => {
    run(FILTER_VALID, PATH_JS_FIXTURE)
      .catch(error => {
        expect(error).to.be.an.instanceof(Error)
        expect(error.message).to.equal(
          `${INVALID_JSON_PATH_ERROR}: "${PATH_JS_FIXTURE}"`
        )
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should not evaluate variables in the shell', done => {
    run(FILTER_WITH_VARIABLE, PATH_VARIABLE_JSON_FIXTURE, { output: 'json' })
      .then(obj => {
        expect(obj[0]).to.have.property('user')
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should allow inputs over max argument size limit', done => {
    run('.', PATH_LARGE_JSON_FIXTURE)
      .then(output => {
        expect(output).to.be.a('string')
        done()
      })
      .catch(error => {
        done(error)
      })
  })

  it('should return error from invalid jq path', done => {
    const jq = new JQ(`${PATH_FIXTURES}\\jq`);
    jq.run('.', PATH_JSON_FIXTURE)
      .catch(error => {
        expect(error.message).to.match(ERROR_INVALID_JQPATH)
        done()
      })
  })

  it('should return error from invalid filter', done => {
    run('include invalid.jq; .', PATH_JSON_FIXTURE)
      .catch(error => {
        expect(error.message).to.not.equal(undefined)
        done()
       })
  })

  it('should accept undefined parameter options', done => {
    const params = jq.parseParamOptions(undefined, ".", PATH_JSON_FIXTURE)
    expect(params).to.not.equal(null);
    done();
  })
})
