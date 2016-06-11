# node-jq [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[`jq`](https://stedolan.github.io/jq/) is a lightweight and flexible command-line JSON processor.

> Work in progress...

## Install

Need to have [`jq`](https://stedolan.github.io/jq/download/) installed.

```bash
npm install atom-jq --save
```

## Usage

```javascript
import * as jq from 'node-jq'
// or
const jq = require('node-jq')

/**
 * run
 * @param  {string} query Filter
 * @param  {string} file  Path to the json
 * @return {Promise}
 */
jq.run(query, file)
  .then((output) => {
    // something with the output
  })
  .catch((err) => {
    // something with the error
  })

```

## License
MIT
