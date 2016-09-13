#!/usr/bin/env node

'use strict'

const which = require('which')
const fs = require('fs')
const path = require('path')
const download = require('download')

const JQ_NAME = 'jq'

const JQ_RELEASE_INFO = {
  url: 'https://github.com/stedolan/jq/releases/download/',
  version: 'jq-1.5'
}

const DOWNLOAD_URL = JQ_RELEASE_INFO.url + JQ_RELEASE_INFO.version + '/jq-'
const ROOT_PATH = path.join(__dirname, '..')
const BINARY_PATH = path.join(ROOT_PATH, 'node_modules/.bin/')
const SYSTEM_PATH = process.env.PATH

/**
 * Returns a clean path that helps avoid `which` finding bin files installed
 * by NPM for this repo.
 * @param {string} path
 * @return {string}
 */

function cleanPath (path) {
  return path
      .replace(/:[^:]*node_modules[^:]*/g, '')
      .replace(/(^|:)\.\/bin(:|$)/g, ':')
      .replace(/^:+/, '')
      .replace(/:+$/, '')
}

function getBinaryLocation (binary) {
  try {
    return which.sync(binary)
  } catch (err) {
    return ''
  }
}

function isInstalledGlobally (binary) {
  return getBinaryLocation(binary) !== ''
}

function downloadJqBinary (platform, arch) {
  platform = process.platform || platform
  arch = process.arch || arch
  let distribution

  if (platform === 'linux' && arch === 'x64') {
    distribution = 'linux32'
  } else if (platform === 'linux' && arch === 'ia32') {
    distribution = 'linux64'
  } else if (platform === 'darwin' || platform === 'openbsd' || platform === 'freebsd') {
    distribution = 'osx-amd64'
  } else if (platform === 'win32') {
    distribution = 'win32'
  } else if (platform === 'win64') {
    distribution = 'win64'
  } else {
    console.log('Log non supporting ' + distribution + ' distribution')
  }

  console.log('Downloading from... \n', DOWNLOAD_URL + distribution)
  return download(DOWNLOAD_URL + distribution, 'node_modules/.bin')
}

function isInstalledLocally (path) {
  return fs.existsSync(path)
}

function saveAndRenameToJq (data) {
  console.log('Done!')
  return fs.writeFile(BINARY_PATH + 'jq', data, { mode: 0o777, encoding: 'binary' })
}

function tryJqGlobally () {
  if (isInstalledGlobally(JQ_NAME)) {
    console.log('Using jq global on ' + getBinaryLocation(JQ_NAME))
    process.exit(0)
  } else if (isInstalledLocally(BINARY_PATH + JQ_NAME)) {
    console.log('Already installed on ' + BINARY_PATH)
    process.exit(0)
  } else {
    return true
  }
}

function assertLocalOrGlobal () {
  if (isInstalledLocally(JQ_NAME) || isInstalledGlobally(JQ_NAME)) {
    console.log('  Something bad happened with the installation of jq')
    process.exit(1)
  }
}

process.env.PATH = cleanPath(SYSTEM_PATH)

Promise.resolve(true)
  .then(tryJqGlobally)
  .then(downloadJqBinary)
  .then(saveAndRenameToJq)
  .then(assertLocalOrGlobal)
  .catch(function (err) {
    console.log('Error: ', err)
  })
