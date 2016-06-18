import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

import { run } from '../src/jq'

import FIXTURE_JSON from './fixtures/1.json'

describe('options', () => {
  describe('input: json', () => {
    it('should run the filter inline with --null-input', () => {
      return expect(
        run('.', FIXTURE_JSON, {
          input: 'json',
          output: 'json'
        })
      ).to.eventually.become(FIXTURE_JSON)
    })
  })

  describe('compactOutput', () => {
    it('should run the filter inline with --compact-output', () => {
      return expect(
        run('.', FIXTURE_JSON, {
          compactOutput: true,
          input: 'json'
        })
      ).to.eventually.become(JSON.stringify(FIXTURE_JSON))
    })
  })
})
