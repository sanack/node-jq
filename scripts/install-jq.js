#!/usr/bin/env node

'use strict'

const which = require('which')
const wget = require('download')
const fs = require('fs')
const path = require('path')

const JQ_NAME = 'jq'

const JQ_RELEASE_INFO = {
  url: 'http://github.com/stedolan/jq/releases/download/',
  version: 'jq-1.5'
}

const DOWNLOAD_URL = JQ_RELEASE_INFO.url + JQ_RELEASE_INFO.version + '/jq-'
const ROOT_PATH = path.join(__dirname, '..')
const BINARY_PATH = path.join(ROOT_PATH, 'node_modules/.bin/')
const ORIGINAL_PATH = process.env.PATH

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

process.env.PATH = cleanPath(ORIGINAL_PATH)

function findWhereIsInstalled (binary) {
  return which.sync(binary)
}

function findGlobaly (binary) {
  return !!findWhereIsInstalled(binary)
}

function downloadJqBinary (platform, arch) {
  platform = process.platform || platform
  arch = process.arch || arch
  var distribution

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
  return wget(DOWNLOAD_URL + distribution, 'node_modules/.bin')
}

function isInstalledLocally (path) {
  return fs.existsSync(path)
}

function saveAndRename (data) {
  console.log('Done!')
  return fs.writeFile(BINARY_PATH + 'jq', data)
}

function tryJqGlobaly () {
  if (!findGlobaly(JQ_NAME)) {
    console.log('Using jq global on ' + findWhereIsInstalled(JQ_NAME))
    process.exit(0)
  } else if (!isInstalledLocally(BINARY_PATH + JQ_NAME)) {
    return true
  }
}

Promise.resolve(true)
  .then(tryJqGlobaly)
  .then(downloadJqBinary)
  .then(saveAndRename)
  .catch(function (err) {
    console.log('Error', err)
  })
