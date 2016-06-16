import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import { run } from '../src/jq'
import jsonFixture from './fixtures/1.json'

describe('options', () => {
  describe('input: json', () => {
    it('should run the filter inline with --null-input', () => {
      return expect(
        run('.', jsonFixture, {
          input: 'json',
          output: 'json'
        })
      ).to.eventually.become(jsonFixture)
    })
  })

  describe('compactOutput', () => {
    it('should run the filter inline with --compact-output', () => {
      return expect(
        run('.', jsonFixture, {
          compactOutput: true,
          input: 'json'
        })
      ).to.eventually.become(JSON.stringify(jsonFixture))
    })
  })
})
