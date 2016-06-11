const execa = require('execa')
const path = require('path')

const ROOT_PATH = path.join(__dirname, '..', '..')
const testp = path.join(ROOT_PATH, 'test.json')

execa('jq', ['. | map(select(.a == .id))', testp.toString()])
  .then((result) => {
    // console.log(JSON.stringify(JSON.parse(result.stdout), null, 4))
  })
  .catch((err) => {
    // console.log('ERROR', err.stderr)
  })

const jq = {
  getJSON (jsonPath) {
    return jsonPath.toString()
  },

  run (query, jsonPath) {
    return new Promise((resolve, reject) => {
      execa('jq', [query, this.getJSON(jsonPath)])
        .then(resolve)
        .catch(reject)
    })
  }
}

module.exports = class jq {
  construct () {

  }
}
