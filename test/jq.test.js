import chai, { expect, assert } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
import { run } from '../src/jq'
import path from 'path'

const FIXTURES_PATH = path.join(__dirname, 'fixtures')
const ROOT_PATH = path.join(__dirname, '..')
const jsonExample = path.join(FIXTURES_PATH, '1.json')
const query = '. | map(select(.a == .id))'

describe('jq runs a cli', () => {
  it('should return a stdout object', (done) => {
    run(query, jsonExample)
      .then((result) => {
        expect(result).to.be.instanceof(Object)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  it('should fail on a non valid query', () => {
    return assert.isRejected(
      run('lola', jsonExample),
      Error
    )
  })

  it('should fail on a non valid path', () => {
    return assert.isRejected(
      run(query, path.join(ROOT_PATH, 'src', '*.js')),
      Error,
      'Is a invalid path'
    )
  })

  it('should fail on a non valid json', () => {
    return assert.isRejected(
      run(query, path.join(ROOT_PATH, 'src', 'js.js')),
      Error,
      'Isn`t a JSON'
    )
  })
})
