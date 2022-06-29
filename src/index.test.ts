import { describe, it, expect } from 'vitest'
import path from 'path'

import { run } from '.'

const PATH_ROOT = path.join(__dirname, '..')
const PATH_BIN = path.join(PATH_ROOT, './bin')
const PATH_FIXTURES = path.join(__dirname, '__test__', 'fixtures')

const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')
const PATH_LARGE_JSON_FIXTURE = path.join(PATH_FIXTURES, 'large.json')
const PATH_VARIABLE_JSON_FIXTURE = path.join(PATH_FIXTURES, 'var.json')

import FIXTURE_JSON from './__test__/fixtures/1.json'
const FIXTURE_JSON_STRING = JSON.stringify(FIXTURE_JSON, null, 2)

const FILTER_VALID = '.repository.type'
const FILTER_INVALID = 'invalid'
const FILTER_INVALID_WITH_SPACE = 'invalid expr'
const FILTER_WITH_VARIABLE =
  '[ . as $x | .user[] | {"user": ., "site": $x.site} ]'

const ERROR_INVALID_FILTER = /invalid/

const CWD_OPTION = path.join(PATH_BIN, '../')

describe('jq core', () => {
  it('should fulfill its promise', () => {
    return run(FILTER_VALID, PATH_JSON_FIXTURE)
      .then(output => {
        expect(output).to.equal('"git"')
      })
  })

  it('should pass on an empty filter', () => {
    return run('', PATH_JSON_FIXTURE)
      .then(output => {
        if (typeof output === "string") {
          const normalizedOutput = output.replace(/\r\n/g, '\n')
          expect(normalizedOutput).to.equal(FIXTURE_JSON_STRING)
        }
      })
  })

  it('should fail on an invalid filter', () => {
    return run(FILTER_INVALID, PATH_JSON_FIXTURE)
      .catch(error => {
        expect(error).to.be.an.instanceof(Error)
        expect(error.message).to.match(ERROR_INVALID_FILTER)
      })
  })

  it('should not evaluate variables in the shell', () => {
    return run(FILTER_WITH_VARIABLE, PATH_VARIABLE_JSON_FIXTURE, { output: 'json' })
      .then((obj: any) => {
          expect(obj[0]).to.have.property('user')
      })
  })

  it('should allow inputs over max argument size limit', () => {
    return run('.', PATH_LARGE_JSON_FIXTURE)
      .then(output => {
        expect(output).to.be.a('string')
      })
  })

  it('should allow custom jqPath from function argument', () => {
    return run(FILTER_VALID, PATH_JSON_FIXTURE, undefined, PATH_BIN)
      .then(output => {
        expect(output).to.equal('"git"')
      })
  })

  it('should allow custom jqPath from env', () => {
    process.env.JQ_PATH = PATH_BIN
    return run(FILTER_VALID, PATH_JSON_FIXTURE)
      .then(output => {
        expect(output).to.equal('"git"')
      })
    process.env.JQ_PATH = undefined
  })

  it('should allow custom cwd', () => {
    return run(FILTER_VALID, PATH_JSON_FIXTURE, undefined, undefined, CWD_OPTION)
      .then(output => {
        expect(output).to.equal('"git"')
      })
  })

  it('should not fail on invalid filter and input json', () => {
    return run(FILTER_INVALID_WITH_SPACE, FIXTURE_JSON, { input: 'json' })
      .then(output => {
        expect(output).to.equal('null')
      })
  })

  /* it('should fail on an invalid filter', () => {
    return run(FILTER_INVALID, PATH_JSON_FIXTURE)
      .catch(error => {
        expect(error).to.be.an.instanceof(Error)
        expect(error.message).to.match(ERROR_INVALID_FILTER)
      })
  }) */
})
