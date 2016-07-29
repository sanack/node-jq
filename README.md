<p align="center">
  <img width="300" alt="node-jq logo" src="docs/assets/logo-with-margin.png" />
</p>

<p align="center">
<a href="https://stedolan.github.io/jq/">jq</a> is a lightweight and flexible
    command-line JSON processor, <a href="https://github.com/sanack/node-jq">node-jq</a> is running it on node.
</p>

<p align="center">
  <a href="http://standardjs.com/"><img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?maxAge=3600"></a>
  <a href="https://www.npmjs.com/package/node-jq"><img src="https://img.shields.io/npm/v/node-jq.svg?maxAge=3600"></a>
  <a href="https://travis-ci.org/sanack/node-jq"><img src="https://img.shields.io/travis/sanack/node-jq/master.svg?maxAge=3600"></a>
  <a href="https://coveralls.io/github/sanack/node-jq?branch=master"><img src="https://coveralls.io/repos/github/sanack/node-jq/badge.svg?branch=master"></a>
  <a href="https://gitter.im/davesnx/node-jq?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge"><img src="https://badges.gitter.im/davesnx/node-jq.svg"></a>
  <a href="https://www.npmjs.com/package/node-jq"><img src="https://img.shields.io/npm/dm/node-jq.svg?maxAge=3600"></a>
</p>

---

## Prerequisites

You need [jq](https://stedolan.github.io/jq/download/) installed before you can do anything with this package.

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
const options = {}

run(filter, jsonPath, options)
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

## How to use this?

We use it ourselves in an [Atom](https://atom.io/) plugin. Check it out: [atom-jq](https://github.com/sanack/atom-jq)

## License

[MIT](https://tldrlegal.com/license/mit-license)
