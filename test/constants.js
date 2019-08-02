import path from 'path'
import fs from 'fs'

export { INPUT_JSON_UNDEFINED_ERROR, INPUT_STRING_ERROR } from '../src/utils'

export const PATH_ROOT = path.join(__dirname, '..')
export const PATH_ASTERISK_FIXTURE = path.join(PATH_ROOT, 'src', '*.js')
export const PATH_FIXTURES = path.join('test', 'fixtures')
export const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')
export const PATH_JS_FIXTURE = path.join(PATH_FIXTURES, '1.js')
export const PATH_LARGE_JSON_FIXTURE = path.join(PATH_FIXTURES, 'large.json')
export const PATH_VARIABLE_JSON_FIXTURE = path.join(PATH_FIXTURES, 'var.json')
export const PATH_SLURP_FIXTURE_1 = path.join(PATH_FIXTURES, 'slurp1.json')
export const PATH_SLURP_FIXTURE_2 = path.join(PATH_FIXTURES, 'slurp2.json')
export const PATH_SORT_FIXTURE = path.join(PATH_FIXTURES, 'sort.json')

export const FIXTURE_JSON = require('./fixtures/1.json')
export const FIXTURE_JSON_STRING = JSON.stringify(FIXTURE_JSON)
export const FIXTURE_JSON_PRETTY = JSON.stringify(FIXTURE_JSON, null, 2)
export const FIXTURE_COLOR = fs.readFileSync(path.join(__dirname, './fixtures/color.dat')).toString()

export const FILTER_VALID = '.repository.type'
export const FILTER_INVALID = 'invalid'
export const FILTER_WITH_VARIABLE =
    '[ . as $x | .user[] | {"user": ., "site": $x.site} ]'
export { FILTER_UNDEFINED_ERROR } from '../src/utils'

export const ERROR_INVALID_FILTER = /invalid/
export const ERROR_INVALID_JQPATH = /^spawn [^\s]* ENOENT$/

export { INVALID_PATH_ERROR, INVALID_JSON_PATH_ERROR, INVALID_TYPE_ERROR } from '../src/utils'
