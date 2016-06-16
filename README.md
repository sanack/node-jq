# node-jq

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) [![Build Status](https://api.travis-ci.org/sanack/node-jq.svg)](https://travis-ci.org/sanack/node-jq)  [![GitHub release](https://img.shields.io/github/release/davesnx/node-jq.svg?maxAge=2592000)](https://github.com/sanack/node-jq/releases/latest)  [![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/node-jq) [![Gitter](https://badges.gitter.im/davesnx/node-jq.svg)](https://gitter.im/davesnx/node-jq?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[`jq`](https://stedolan.github.io/jq/) is a lightweight and flexible
    command-line JSON processor.

> Work in progress...

## Installation

Need to have [`jq`](https://stedolan.github.io/jq/download/) installed.

```bash
npm install node-jq --save
```

## Usage

```javascript
import { run } from 'node-jq'
// or
const run = require('node-jq').run

const filter = '. | map(select(.foo > 10))'
const jsonPath = path.join(__dirname, 'path', 'to', 'json')

run(filter, jsonPath)
  .then((output) => {
    // something with the output
  })
  .catch((err) => {
    // something with the error
  })
```

## License

MIT
