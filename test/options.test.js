import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

import { run } from '../src/jq'

import FIXTURE_JSON from './fixtures/1.json'
const FIXTURE_JSON_STRING = JSON.stringify(FIXTURE_JSON)

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

  describe('output: compact', () => {
    it('should run the filter inline with --compact-output', () => {
      return expect(
        run('.', FIXTURE_JSON, {
          input: 'json',
          output: 'compact'
        })
      ).to.eventually.become(FIXTURE_JSON_STRING)
    })
  })
})
