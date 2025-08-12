<br/>
<img width="300" alt="node-jq logo" src="docs/assets/logo-with-margin.png" />

![https://www.npmjs.com/package/node-jq](https://img.shields.io/npm/dm/node-jq.svg?maxAge=3600)
![https://www.npmjs.com/package/node-jq](https://img.shields.io/npm/v/node-jq.svg?maxAge=3600)
![https://codeclimate.com/github/sanack/node-jq/coverage](https://codeclimate.com/github/sanack/node-jq/badges/coverage.svg)
![https://github.com/sanack/node-jq/actions/workflows/ci.yml](https://github.com/sanack/node-jq/actions/workflows/ci.yml/badge.svg)

[node-jq](https://github.com/sanack/node-jq) is a Node.js wrapper for [jq](https://jqlang.github.io/jq/) - a lightweight and flexible command-line JSON processor

---

## Installation

```bash
$ npm install node-jq --save
# or
$ yarn add node-jq
```

## Fast

You can use `jq` directly after installing it:

```bash
npx node-jq '.foo' package.json
```

## Advanced installation

By default, `node-jq` downloads `jq` during the installation process with a post-install script. Depending on your OS it downloads from [https://github.com/jqlang/jq/releases] into `./node_modules/node-jq/bin/jq` to avoid colisions with any global installation. Check #161 #167 #171 for more information. You can safely rely on this location for your installed `jq`, we won't change this path without a major version upgrade.

### Skipping binary installation and use your local jq

If you want to skip the installation step of `jq`, you can do it with different mechanisms. `node-jq` will assume `jq` is in `$PATH` when skipping the installation.

Choose the one that fits best your needs:

- Ignore the installation by not running it with: `npm install node-jq --ignore-scripts`
  ```bash
  npm install node-jq --ignore-scripts
  ```
- Set `NODE_JQ_SKIP_INSTALL_BINARY` environment variable to `true`.
  ```bash
  export NODE_JQ_SKIP_INSTALL_BINARY="true"
  npm install node-jq
  ```
- Set `JQ_PATH` environment variable
  ```bash
  export JQ_PATH="../../jq"
  npm install node-jq
  ```
- Set `jq_path` in `.npmrc` (npm config files https://docs.npmjs.com/cli/v8/configuring-npm/npmrc)
  ```t
  # .npmrc
  jq_path=/usr/local/bin/jq
  ```
  ```bash
  npm install node-jq
  ```

## Usage

### jq example

Usually in your CLI using `jq`:

```bash
jq ".abilities[].moves" bulbasaur.json
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

#### node-jq equivalent

With `node-jq` you could run it programmatically and interact with the output as a [JavaScript Object](http://javascript.info/tutorial/objects):

> NOTE: Take care of the filter that you are using with `jq`, mapping an array or any other iterative output isn't a valid JavaScript Object, that might fail at parse-time.

```javascript
const jq = require('node-jq')

const filter = '.abilities[].moves'
const jsonPath = '/path/to/bulbasaur.json'
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
    // Something went wrong...
  })
```

## Options

### path to jq binary

By default, the `jq` binary installed with the package is used. You can override this in several ways:

1. **`.npmrc` configuration** (recommended for project-level settings):
   ```bash
   jq-path=jq
   # or
   jq-path=/usr/local/bin/jq
   ```

2. **Environment variable** (for runtime overrides):
   ```bash
   export JQ_PATH=/path/to/jq
   ```

The priority order is: `JQ_PATH` environment variable → `.npmrc` configuration → downloaded binary.

### input

|  Description  |  Type  |             Values             |  Default |
|:-------------:|:------:|:------------------------------:|:--------:|
| Type of input | string | `'file'`, `'json'`, `'string'` | `'file'` |

#### `input: 'file'`

Run the jq query against a **JSON file**.

```javascript
jq.run('.', '/path/to/file.json').then(console.log)
// { "foo": "bar" }
```

#### `input: 'file'` with multiple files

Run jq query against multiple **JSON files**.

```javascript
jq.run('.', ['/path/to/file.json','path/to/other_file.json']).then(console.log)
// { "foo": "bar" }
// { "otherFoo": "andBar" }
```

#### `input: 'json'`

Run the `jq` query against an **Object**.

```javascript
jq.run('.', { foo: 'bar' }, { input: 'json' }).then(console.log)
// { "foo": "bar" }

```

#### `input: 'string'`

Run the jq query against a **String**.

```javascript
jq.run('.', '{ foo: "bar" }', { input: 'string' }).then(console.log)
// { "foo": "bar" }
```

---

### output

| Description    | Values                                        | Default    |
|:--------------:|:---------------------------------------------:|:----------:|
| Type of output | `'pretty'`, `'json'`, `'compact'`, `'string'` | `'pretty'` |

#### `output: 'pretty'`

Return the output as a **String**.

```javascript
jq.run('.', '/path/to/file.json', { output: 'string' }).then(console.log)
// {
//   "foo": "bar"
// }
```

#### `output: 'json'`

Return the output as an **Object**.

```javascript
jq.run('.', '/path/to/file.json', { output: 'json' }).then(console.log)
// { foo: 'bar' }
```

#### `output: 'compact'|'string'`

Return the output as a **String**.

```javascript
jq.run('.', '/path/to/file.json', { output: 'compact' }).then(console.log)
// {"foo":"bar"}
jq.run('.', '/path/to/file.json', { output: 'string' }).then(console.log)
// {"foo":"bar"}
```

---

### slurp

|         Description          |     Values      | Default |
|:----------------------------:|:---------------:|:-------:|
| Read input stream into array | `true`, `false` | `false` |

#### `slurp: true`

Read input stream into array.

```javascript
jq.run('.', ['/path/to/file.json','/path/to/other_file.json'], { output: 'json', slurp: true }).then(console.log)
// [
//   {
//     "foo": "bar"
//   },
//   {
//     "otherFoo": "andBar"
//   }
// ]
```

### sort

|         Description                   |     Values      | Default |
|:-------------------------------------:|:---------------:|:-------:|
| Sort object keys in alphabetical order| `true`, `false` | `false` |

#### `sort: true`

Sorts object keys alphabetically.

```javascript
jq.run('.', ['/path/to/file.json'], { output: 'json', sort: true }).then(console.log)
// {
//   "a": 2,
//   "b": 1
// },
```

### args

|         Description                   |        Values        |   Default   |
|:-------------------------------------:|:--------------------:|:-----------:|
| Send custom args to the jq command    | `[object]`           | `undefined` |

#### `args: { myfruit: { hello: 'orange'}, myfruit2: "banana" }`

Adds the `--argjson myfruit "{ 'hello': 'orange' }" --arg myfruit2 orange` arguments to the internal jq command

```javascript
jq.run('{"fruit":$myfruit,"fruit2":$myfruit2}', ['/path/to/file.json'], { output: 'json', sort: true, args: { myfruit: { hello: 'orange' }, myfruit2: "banana" } }).then(console.log)
// {
//   fruit: {
//      hello: "orange"
//   },
//   fruit2: "banana"
// }
```

### cwd

|           Description            |   Values   |    Default    |
|:--------------------------------:|:----------:|:-------------:|
| Set working dir for `jq` process | valid path | process.cwd() |


```javascript
jq.run('.', ['file.json'], { output: 'json', sort: true }, '/path/to').then(console.log)
// {
//   "a": 2,
//   "b": 1
// },
```

### detached

|             Description              |     Values      | Default  |
|:------------------------------------:|:---------------:|:--------:|
| Run `jq` process as detached process | `true`, `false` | `false`  |

By default `jq` process will run 'attached' to the main process. That means that any interrupt signal main process receives will be propagated to `jq` process. For example, if main process receives `SIGTERM`, `jq` will also receive it and exit immediately.

However, in some cases you might **not** want `jq` to exit immediately and let it exit normally. For example, if you want to implement a graceful shutdown - main process receives `SIGTERM`, it finishes processing current json file and exits after processing is completed.

To achieve that run `jq` detached and NodeJS will not propagate `SIGTERM` to `jq` process allowing it to run until it completes.

```javascript
jq.run('.', ['file.json'], { output: 'json', sort: true }, undefined, true).then(console.log)
// {
//   "a": 2,
//   "b": 1
// },
```

## Projects using **node-jq**

- **[atom-jq](https://github.com/sanack/atom-jq)**: an [Atom](https://atom.io/) package for manipulating JSON
- **[json-splora](https://github.com/wellsjo/JSON-Splora)**: an [Electron](http://electron.atom.io/) implementation for manipulating JSON
- [Check more](https://github.com/sanack/node-jq/network/dependents?package_id=UGFja2FnZS0xNTIxMzU1MQ%3D%3D)

## Why?

Why would you want to manipulate JavaScript Objects with `jq` inside a nodejs app, when there are tools like [ramda](https://ramdajs.com) or [lodash](lodash.com)?

The idea was to port `jq` in node to be able to run it as-is. `node-jq` doesn't try to replace `Array`/`Object` filters, maps, transformations, and so on.

Our primary goal was to make `jq` syntax available inside an [Atom](https://atom.io/) extension: [atom-jq](https://github.com/sanack/atom-jq).

Other than that, `jq` is an interesting CLI tool to quickly parse and manipulate the response of an API, such as:

```bash
curl 'https://jsonplaceholder.typicode.com/comments' | jq '.[].postId'
```

There are also people dealing with complex use-cases, and some of them want to port their bash scripts to node:

- [ilya-sher.org/2016/05/11/most-jq-you-will-ever-need](https://ilya-sher.org/2016/05/11/most-jq-you-will-ever-need/)
- [cloudadvantage.com.au/new-aws-command-line-tool-and-jq](http://www.cloudadvantage.com.au/new-aws-command-line-tool-and-jq/)

## Want to learn `jq`?

Seems hard to learn, but it really isn't.

`jq` is like `sed` for `JSON`. *Slice*, *filter*, *map* and *transform* structured data in a **simple** and **powerful** way.

Take a look at [this great introduction](https://robots.thoughtbot.com/jq-is-sed-for-json) or a [jq lesson](http://programminghistorian.org/lessons/json-and-jq).

You can check out the [official manual](https://jqlang.github.io/jq/manual) and fiddle around in the online playground [jqplay.org](https://jqplay.org).

## License

[License](./LICENSE.md)
