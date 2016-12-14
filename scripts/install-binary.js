#!/usr/bin/env node

'use strict'

const BinBuild = require('bin-build')
const download = require('download')
const path = require('path')
const tempfile = require('tempfile')
const fs = require('fs')

const JQ_INFO = {
  name: 'jq',
  url: 'https://github.com/stedolan/jq/releases/download/',
  version: 'jq-1.5'
}

const OUTPUT_DIR = path.join(__dirname, '..', 'bin')
let FILE_PATH = path.join(OUTPUT_DIR, 'jq')
if (process.platform === 'win32' || process.platform === 'win64') {
  FILE_PATH += '.exe'
}

const jqExists = () => {
  try {
    return fs.statSync(FILE_PATH).isFile()
  } catch (err) {
    return false
  }
}

if (jqExists()) {
  console.log('jq is already installed here:', FILE_PATH)
  process.exit(0)
}

if (process.platform === 'win32' || process.platform === 'win64') {
  download(`${JQ_INFO.url}/${JQ_INFO.version}/jq-${process.platform}.exe`, OUTPUT_DIR)
  .then(() => {
    fs.renameSync(path.join(OUTPUT_DIR, `jq-${process.platform}.exe`), FILE_PATH)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
} else {
  new BinBuild().src(`${JQ_INFO.url}/${JQ_INFO.version}/${JQ_INFO.version}.tar.gz`)
  .cmd(`./configure --disable-maintainer-mode --prefix=${tempfile()} --bindir=${OUTPUT_DIR}`)
  .cmd('make')
  .cmd('make install')
  .run((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
}

console.log(`jq installed successfully on ${OUTPUT_DIR}`)
