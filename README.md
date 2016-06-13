# node-jq [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[`jq`](https://stedolan.github.io/jq/) is a lightweight and flexible command-line JSON processor.

> Work in progress...

## Install

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
