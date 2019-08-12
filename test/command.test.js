import { expect } from 'chai'
import path from 'path'

import { commandFactory } from '../src/command'
import { FILTER_UNDEFINED_ERROR } from '../src/command'
import { INVALID_PATH_ERROR, INVALID_JSON_PATH_ERROR } from '../src/utils'

const PATH_ROOT = path.join(__dirname, '..')
const PATH_ASTERISK_FIXTURE = path.join(PATH_ROOT, 'src', '*.js')
const PATH_FIXTURES = path.join('test', 'fixtures')

const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')
const PATH_JS_FIXTURE = path.join(PATH_FIXTURES, '1.js')
const PATH_LARGE_JSON_FIXTURE = path.join(PATH_FIXTURES, 'large.json')
const PATH_VARIABLE_JSON_FIXTURE = path.join(PATH_FIXTURES, 'var.json')

const FIXTURE_JSON = require('./fixtures/1.json')
const FIXTURE_JSON_STRING = JSON.stringify(FIXTURE_JSON, null, 2)

const FILTER_VALID = '.repository.type'
const FILTER_INVALID = 'invalid'
const FILTER_WITH_VARIABLE =
    '[ . as $x | .user[] | {"user": ., "site": $x.site} ]'

const ERROR_INVALID_FILTER = /invalid/

const EMPTY_OPTION_RESULT = {
    command: path.join(__dirname, '../bin/jq'),
    args: [
        FILTER_VALID,
        PATH_JSON_FIXTURE
    ],
    stdin: ''
}

describe('command', () => {
    it('factory should accept undefined options', done => {
        try {
            const result = commandFactory(FILTER_VALID, PATH_JSON_FIXTURE)
            expect(result).to.deep.equal(EMPTY_OPTION_RESULT)
      done()
        } catch (e) {
            done(e)
        }
    })
})
