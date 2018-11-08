#!/usr/bin/env node

'use strict'

const BinBuild = require('bin-build')
const path = require('path')
const tempfile = require('tempfile')
const fs = require('fs')
const download = require('download')

const platform = process.platform
const arch = process.arch

const JQ_INFO = {
  name: 'jq',
  url: 'https://github.com/stedolan/jq/releases/download/',
  version: 'jq-1.6'
}

const JQ_NAME_MAP = {
  'def': 'jq',
  'win32': 'jq.exe'
}
const JQ_NAME = (platform in JQ_NAME_MAP) ? JQ_NAME_MAP[platform] : JQ_NAME_MAP.def

const OUTPUT_DIR = path.join(__dirname, '..', 'bin')

const jqExists = () => {
  try {
    return fs.statSync((path.join(OUTPUT_DIR, JQ_NAME))).isFile()
  } catch (err) {
    return false
  }
}

if (jqExists()) {
  console.log('jq is already installed')
  process.exit(0)
}

// if platform is missing, download source instead of executable
const DOWNLOAD_MAP = {
  'win32': {
    'def': 'jq-win32.exe',
    'x64': 'jq-win64.exe'
  }
}

if (platform in DOWNLOAD_MAP) {
  // download the executable

  const filename = (arch in DOWNLOAD_MAP[platform]) ? DOWNLOAD_MAP[platform][arch] : DOWNLOAD_MAP[platform].def
  const url = `${JQ_INFO.url}${JQ_INFO.version}/${filename}`

  console.log(`Downloading jq from ${url}`)
  download(url, OUTPUT_DIR).then(() => {
    fs.renameSync(path.join(OUTPUT_DIR, filename), path.join(OUTPUT_DIR, JQ_NAME))
    console.log(`Downloaded in ${OUTPUT_DIR}`)
  })
} else {
  // download source and build

  const build = new BinBuild()
    .src(`${JQ_INFO.url}/${JQ_INFO.version}/${JQ_INFO.version}.tar.gz`)
    .cmd(`./configure --disable-maintainer-mode --prefix=${tempfile()} --bindir=${OUTPUT_DIR}`)
    .cmd('make')
    .cmd('make install')

  build.run((err) => {
    if (err) {
      console.log(`Err: ${err}`)
    } else {
      console.log(`jq installed successfully on ${OUTPUT_DIR}`)
    }
  })
}
