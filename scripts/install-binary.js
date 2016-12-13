#!/usr/bin/env node

'use strict'

const BinBuild = require('bin-build')
const path = require('path')
const tempfile = require('tempfile')
const fs = require('fs')

const JQ_INFO = {
  name: 'jq',
  url: 'https://github.com/stedolan/jq/releases/download/',
  version: 'jq-1.5'
}

const OUTPUT_DIR = path.join(__dirname, '..', 'bin')

const jqExists = () => {
  try {
    return fs.statSync((path.join(OUTPUT_DIR, 'jq'))).isFile()
  } catch (err) {
    return false
  }
}

if (jqExists()) {
  console.log('jq is already installed here:', path.join(OUTPUT_DIR, 'jq'))
  process.exit(0)
}

const build = new BinBuild()
  .src(`${JQ_INFO.url}/${JQ_INFO.version}/${JQ_INFO.version}.tar.gz`)
  .cmd(`./configure --disable-maintainer-mode --bindir=${OUTPUT_DIR} --libdir=${tempfile()}`)
  .cmd('make')
  .cmd('make install')

if (process.platform === 'win32' && process.platform === 'win64') {
  // TODO: Install binary from
  // https://github.com/stedolan/jq/releases/download/jq-1.5/jq-win64.exe
  // or https://github.com/stedolan/jq/releases/download/jq-1.5/jq-win32.exe
  console.log('Using global jq installation on Windows')
  process.exit(0)
}

build.run((err) => {
  if (err) {
    console.log(err)
  }
  console.log(`jq installed successfully on ${OUTPUT_DIR}`)
})
