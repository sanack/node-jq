import { expect } from 'chai'
import path from 'path'

import { commandFactory } from '../src/command'

const PATH_FIXTURES = path.join('test', 'fixtures')
const PATH_JSON_FIXTURE = path.join(PATH_FIXTURES, '1.json')

const FILTER_VALID = '.repository.type'

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
