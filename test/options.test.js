import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import { run } from '../src/jq'
import jsonFixture from './fixtures/1.json'

const jsonFixtureToString = JSON.stringify(jsonFixture)

describe('options', () => {
  describe('--null-input', () => {
    it('should run the filter inline with null-input', () => {
      return expect(
        run('.', jsonFixtureToString, { nullInput: true })
      ).to.eventually.become(jsonFixtureToString)
    })
  })
})
