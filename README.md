<p align="center">
  <img width="300" alt="node-jq logo" src="docs/assets/logo-with-margin.png" />
</p>

<p style="width:100%;" align="center">
  <a href="http://standardjs.com/"><img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?maxAge=3600"></a>
  <a href="https://coveralls.io/github/sanack/node-jq?branch=master"><img src="https://coveralls.io/repos/github/sanack/node-jq/badge.svg?branch=master"></a>
  <a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg"></a>
  <br>
  <a href="https://www.npmjs.com/package/node-jq"><img src="https://img.shields.io/npm/dm/node-jq.svg?maxAge=3600"></a>
  <a href="https://www.npmjs.com/package/node-jq"><img src="https://img.shields.io/npm/v/node-jq.svg?maxAge=3600"></a>
  <a href="https://gitter.im/davesnx/node-jq?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge"><img src="https://badges.gitter.im/davesnx/node-jq.svg"></a>
  <br>
    <a href="https://circleci.com/gh/sanack/node-jq">
      <img src="https://circleci.com/gh/sanack/node-jq.png?style=shield">
    </a>
    <a href="https://ci.appveyor.com/project/mackermans/node-jq">
      <img src="https://ci.appveyor.com/api/projects/status/32r7s2skrgm9ubva?svg=true">
    </a>
</p>

<h2>Run jq in node</h2>
<h4 align="center"><a href="https://github.com/sanack/node-jq">node-jq</a> is a wrapper for <a href="https://stedolan.github.io/jq/">jq</a> - a lightweight and flexible command-line JSON processor.</h4>

## Installation

```bash
npm install node-jq --save
```

## Usage

Usually in your CLI with jq you run:
```bash
jq ".abilities[].moves" bulbasur.json
```
and you get
```bash
{
  "name": "heartgold-soulsilver",
  "power": "10"
}
{
  "name": "platinum",
  "power": "50"
}
{
  "name": "diamond-pearl",
  "power": "99"
}
```

with node-jq you could run it programatically and operate with the output as a [JavaScript Object](http://javascript.info/tutorial/objects):

```javascript
const jq = require('node-jq')

const filter = '.abilities[].moves'
const jsonPath = '/path/to/bulbasur.json'
const options = {}

jq.run(filter, jsonPath, options)
  .then((output) => {
    console.log(output)
    /*
      {
        "name": "heartgold-soulsilver",
        "power": "10"
      },
      {
        "name": "platinum",
        "power": "50"
      },
      {
        "name": "diamond-pearl",
        "power": "99"
      }
    */
  })
  .catch((err) => {
    console.error(err)
    // Something when wrong...
  })
```

## Options

### `input`: Specify the type of input
*String*: `'file', 'json', 'string'`
default: `'file'` 

`input: 'file'`
Run the jq query against a **JSON file**.
```js
jq.run('.', 'path_to.json').then(console.log)
```

`input: 'json'`
Run the jq query against a **Object**.
```js
jq.run('.', { lola: "flores" }, { input: 'json' }).then(console.log)
// { lola: "flores" }
```

`input: 'string'`
Run the jq query against a **String**.
```js
jq.run('.', '{ lola: "flores" }', { input: 'string' }).then(console.log)
// { lola: "flores" }
```

### `output`: Specify the type of output
*String*: `'json', 'string', 'pretty'`
default: `'pretty'`

`output: 'pretty'`
Return the output as a **String**.
```js
jq.run('.', 'path_to.json', { output: 'string' }).then(console.log)
// {
//   lola: "flores"
// }
```

`output: 'json'`
Return the output as a **Object**.
```js
jq.run('.', 'path_to.json', { output: 'json' }).then(console.log)
// { lola: "flores" }
```

`output: 'string'`
Return the output as a **String**.
```js
jq.run('.', 'path_to.json', { output: 'string' }).then(console.log)
// '{ lola: "flores" }'
```

## Who use this?

- **[atom-jq](https://github.com/sanack/atom-jq)**: an [Atom](https://atom.io/) plugin for play arround jq.
- **[JSON-Splora](https://github.com/wellsjo/JSON-Splora)**: GUI for editing, visualizing, and manipulating JSON

## Why?

A normal thought could be: why you want to trait JavaScript Objects with jq syntax on a Node App? (Having tools like [lodash](lodash.com)).
Basically I wanted to port jq in node for being able to run it as it is. node-jq doesn't try to replace Object fitlers/maps/transformations.

Given a little bit of context, what are the use cases of jq.
I found interesting jq for read fast the response of an API in mi CLI. 
Something like that:
```bash
curl 'https://jsonplaceholder.typicode.com/comments' | jq '.[].postId'
```
but also there are alot of people fighting with complex responses like AWS:

- [ilya-sher.org/2016/05/11/most-jq-you-will-ever-need](https://ilya-sher.org/2016/05/11/most-jq-you-will-ever-need/)
- [cloudadvantage.com.au/new-aws-command-line-tool-and-jq](http://www.cloudadvantage.com.au/new-aws-command-line-tool-and-jq/)

But at the end my objective with this module was for create [atom-jq](https://github.com/sanack/atom-jq) and be able to run it 'inside' atom.

## Want to learn `jq`?

Seems hard to learn, but it isn't.

jq is like `sed` for JSON. *Slice*, *filter*, *map* and *transform* structured data in a **simple** way and **powerful**.

Take a look into [this](https://robots.thoughtbot.com/jq-is-sed-for-json) great introduction or more [detailed](http://programminghistorian.org/lessons/json-and-jq).

You can check out the [official manual](https://stedolan.github.io/jq/manual) and play online in [jqplay.org](https://jqplay.org).

## License

[MIT](https://tldrlegal.com/license/mit-license)
