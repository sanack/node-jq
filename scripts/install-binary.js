#!/usr/bin/env node

'use strict'

const binBuild = require('bin-build')
const path = require('path')
const tempfile = require('tempfile')
const fs = require('fs')
const { DownloaderHelper } = require('node-downloader-helper')

async function download (url, saveDirectory) {
  const downloader = new DownloaderHelper(url, saveDirectory)

  return new Promise((resolve, reject) => {
    downloader.on('end', () => resolve())
    downloader.on('error', (err) => reject(err))
    downloader.on('progress.throttled', (downloadEvents) => {
      const percentageComplete =
        downloadEvents.progress < 100
          ? downloadEvents.progress.toPrecision(2)
          : 100
      console.info(`Downloaded: ${percentageComplete}%`)
    })

    downloader.start()
  })
}

const platform = process.platform
const arch = process.arch

const JQ_INFO = {
  name: 'jq',
  url: 'https://github.com/jqlang/jq/releases/download/',
  version: 'jq-1.7.1'
}

const JQ_NAME_MAP = {
  def: 'jq',
  win32: 'jq.exe'
}
const JQ_NAME =
  platform in JQ_NAME_MAP ? JQ_NAME_MAP[platform] : JQ_NAME_MAP.def

const OUTPUT_DIR = path.join(__dirname, '..', 'bin')

const fileExist = (path) => {
  try {
    return fs.existsSync(path)
  } catch (err) {
    return false
  }
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR)
  console.info(`${OUTPUT_DIR} directory was created`)
}

if (fileExist(path.join(OUTPUT_DIR, JQ_NAME))) {
  console.log('jq is already installed')
  process.exit(0)
}

if (process.env.NODE_JQ_SKIP_INSTALL_BINARY === 'true') {
  console.log('node-jq is skipping the download of jq binary')
  process.exit(0)
}

// if platform or arch is missing, download source instead of executable
const DOWNLOAD_MAP = {
  win32: {
    x64: 'jq-windows-amd64.exe',
    ia32: 'jq-windows-i386.exe'
  },
  darwin: {
    x64: 'jq-macos-amd64',
    arm64: 'jq-macos-arm64'
  },
  linux: {
    x64: 'jq-linux-amd64',
    ia32: 'jq-linux-i386',
    arm64: 'jq-linux-arm64'
  }
}

if (platform in DOWNLOAD_MAP && arch in DOWNLOAD_MAP[platform]) {
  // download the executable

  const filename = DOWNLOAD_MAP[platform][arch]
  const url = `${JQ_INFO.url}${JQ_INFO.version}/${filename}`

  console.log(`Downloading jq from ${url}`)
  download(url, OUTPUT_DIR)
    .then(() => {
      const distPath = path.join(OUTPUT_DIR, JQ_NAME)
      fs.renameSync(path.join(OUTPUT_DIR, filename), distPath)
      if (fileExist(distPath)) {
        // fs.chmodSync(distPath, fs.constants.S_IXUSR || 0o100)
        // Huan(202111): we need the read permission so that the build system can pack the node_modules/ folder,
        // i.e. build with Heroku CI/CD, docker build, etc.
        fs.chmodSync(distPath, 0o755)
      }
      console.log(`Downloaded in ${OUTPUT_DIR}`)
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
} else {
  // download source and build

  const url = `${JQ_INFO.url}/${JQ_INFO.version}/${JQ_INFO.version}.tar.gz`

  console.log(`Building jq from ${url}`)
  binBuild
    .url(url, [
      `./configure --with-oniguruma=builtin --prefix=${tempfile()} --bindir=${OUTPUT_DIR}`,
      'make -j8',
      'make install'
    ])
    .then(() => {
      console.log(`jq installed successfully on ${OUTPUT_DIR}`)
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}
