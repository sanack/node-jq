# node-jq

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?maxAge=3600)](http://standardjs.com/) [![npm release](https://img.shields.io/npm/v/node-jq.svg?maxAge=3600)](https://www.npmjs.com/package/node-jq)  [![Travis Build](https://img.shields.io/travis/sanack/node-jq/master.svg?maxAge=3600)](https://travis-ci.org/sanack/node-jq) [![Coverage Status](https://coveralls.io/repos/github/sanack/node-jq/badge.svg?branch=master)](https://coveralls.io/github/sanack/node-jq?branch=master) [![npm downloads](https://img.shields.io/npm/dm/node-jq.svg?maxAge=3600)](https://www.npmjs.com/package/node-jq) [![Gitter](https://badges.gitter.im/davesnx/node-jq.svg)](https://gitter.im/davesnx/node-jq?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[`jq`](https://stedolan.github.io/jq/) is a lightweight and flexible
    command-line JSON processor.

> Work in progress....

## Prerequisites

You will need [`jq`](https://stedolan.github.io/jq/download/) installed before
you can do anything with this package.

## Installation

```bash
npm install node-jq --save
```

## Usage

```javascript
import { run } from 'node-jq'
// or
const { run } = require('node-jq')

const filter = '. | map(select(.foo > 10))'
const jsonPath = '/path/to/json'

run(filter, jsonPath, options = {})
  .then((output) => {
    console.log(output)
    // something with the output
  })
  .catch((err) => {
    console.error(err)
    // something with the error
  })
```

## Options

| Option   | Type     | Default    | Values                        | Description                |
|----------|----------|------------|-------------------------------|----------------------------|
| `input`  | *String* | `'file'`   | `'file', 'json', 'string'`    | Specify the type of input  |
| `output` | *String* | `'pretty'` | `'json', 'string', 'pretty'`  | Specify the type of output |

## License

MIT
