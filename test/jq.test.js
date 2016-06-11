import test from 'ava'
import Jq from '../src/jq'
// const path = require('path')

// const ROOT_PATH = path.join(__dirname, '..', '..')
// const testp = path.join(ROOT_PATH, 'test.json')

test('whatever', t => {
  t.plan(1)

  return Promise.resolve(3).then(n => {
    t.is(n, 3)
  })
})
