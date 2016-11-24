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

const OUPUT_DIR = path.join(__dirname, '..', 'bin')

const jqExists = () => {
  try {
    return fs.statSync((path.join(OUPUT_DIR, 'jq'))).isFile()
  } catch (err) {
    return false
  }
}

if (jqExists()) {
  process.exit(0)
  console.log('jq is already installed')
}

const build = new BinBuild()
  .src(`${JQ_INFO.url}/${JQ_INFO.version}/${JQ_INFO.version}.tar.gz`)
  .cmd(`./configure --disable-maintainer-mode --bindir=${OUPUT_DIR} --libdir=${tempfile()}`)
  .cmd('make')
  .cmd('make install')

build.run((err) => {
  if (err) {
    console.log(`Err: ${err}`)
  }
  console.log(`jq installed successfully on ${OUPUT_DIR}`)
})
