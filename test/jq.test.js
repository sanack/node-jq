import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import { run } from '../src/jq'
import path from 'path'
import jsonFixture from './fixtures/1.json'

const jsonFixtureToString = JSON.stringify(jsonFixture)
const FIXTURES_PATH = path.join(__dirname, 'fixtures')
const ROOT_PATH = path.join(__dirname, '..')
const jsonPathFixture = path.join(FIXTURES_PATH, '1.json')
const jsPathFixture = path.join(FIXTURES_PATH, '1.js')
const asteriskPathFixture = path.join(ROOT_PATH, 'src', '*.js')
const filter = '. | map(select(.a == .id))'

describe('jq runs a cli', () => {
  it('should return a stdout object', () => {
    return expect(
      run(filter, jsonPathFixture)
    ).to.eventually.be.instanceof(Object)
  })

  it('should fail on a non valid filter', () => {
    return expect(
      run('lola', jsonPathFixture)
    ).to.eventually.be.rejectedWith(Error)
  })

  it('should fail on a non valid path', () => {
    return expect(
      run(filter, asteriskPathFixture)
    ).to.eventually.be.rejectedWith(Error)
  })

  it('should fail on a non valid json', () => {
    return expect(
      run(filter, jsPathFixture)
    ).to.eventually.be.rejectedWith(Error)
  })

  it('should run the filter inline with null-input', () => {
    return expect(
      run('.', jsonFixtureToString, { nullInput: true })
    ).to.eventually.become(jsonFixtureToString)
  })
})
