import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

import { run } from '../src/jq'

import FIXTURE_JSON from './fixtures/1.json'

describe('options', () => {
  describe('--null-input', () => {
    it('should run the filter inline with null-input', () => {
      return expect(
        run('.', FIXTURE_JSON, { nullInput: true })
      ).to.eventually.become(FIXTURE_JSON)
    })
  })
})
