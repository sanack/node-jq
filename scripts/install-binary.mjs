#!/usr/bin/env node

'use strict'

// First check if the user has configured the environment variable to skip the download of jq binary

if (process.env.NODE_JQ_SKIP_INSTALL_BINARY === 'true') {
  console.log('node-jq is skipping the download of jq binary');
  process.exit(0);
}

if (process.env.JQ_PATH) {
  console.log('node-jq is skipping the download of jq binary');
  console.log(`Using the configured jq binary by environment variable JQ_PATH at "${process.env.JQ_PATH}"`)
  process.exit(0);
}

if (process.env.npm_config_jq_path) {
  console.log('node-jq is skipping the download of jq binary')
  console.log(`Using the configured jq binary by npm_config_jq_path at "${process.env.npm_config_jq_path}"`)
  process.exit(0)
}

import { spawn } from 'node:child_process'
import {
  chmodSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  renameSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { Readable } from 'node:stream'
import { fileURLToPath } from 'node:url'
import { extract } from 'tar'
import { temporaryDirectory } from 'tempy'

const PLATFORM = process.platform
const ARCH = process.arch

const JQ_INFO = {
  name: 'jq',
  url: 'https://github.com/jqlang/jq/releases/download/',
  version: 'jq-1.7.1',
}

const JQ_NAME_MAP = {
  def: 'jq',
  win32: 'jq.exe',
}
const JQ_NAME =
  PLATFORM in JQ_NAME_MAP ? JQ_NAME_MAP[PLATFORM] : JQ_NAME_MAP.def

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = join(__dirname, '..', 'bin')

const fileExist = (path) => {
  try {
    return existsSync(path)
  } catch (err) {
    return false
  }
}

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR)
  console.info(`${OUTPUT_DIR} directory was created`)
}

if (fileExist(join(OUTPUT_DIR, JQ_NAME))) {
  console.log('jq is already installed')
  process.exit(0)
}

// if platform or arch is missing, download source instead of executable
const DOWNLOAD_MAP = {
  win32: {
    x64: 'jq-windows-amd64.exe',
    ia32: 'jq-windows-i386.exe',
  },
  darwin: {
    x64: 'jq-macos-amd64',
    arm64: 'jq-macos-arm64',
  },
  linux: {
    x64: 'jq-linux-amd64',
    ia32: 'jq-linux-i386',
    arm64: 'jq-linux-arm64',
  },
}

try {
  if (PLATFORM in DOWNLOAD_MAP && ARCH in DOWNLOAD_MAP[PLATFORM]) {
    const filename = DOWNLOAD_MAP[PLATFORM][ARCH]
    const url = `${JQ_INFO.url}${JQ_INFO.version}/${filename}`

    downloadJqBinary(url, filename)
  } else {
    const url = `${JQ_INFO.url}${JQ_INFO.version}/${JQ_INFO.version}.tar.gz`

    buildJqSource(url)
  }
} catch (err) {
  console.error(err)
  process.exit(1)
}

async function downloadJqBinary(url, filename) {
  console.log(`Downloading jq from ${url}`)

  await downloadFile(url, `${OUTPUT_DIR}/${filename}`)

  const distPath = join(OUTPUT_DIR, JQ_NAME)
  renameSync(join(OUTPUT_DIR, filename), distPath)
  if (fileExist(distPath)) {
    // fs.chmodSync(distPath, fs.constants.S_IXUSR || 0o100)
    // Huan(202111): we need the read permission so that the build system can pack the node_modules/ folder,
    // i.e. build with Heroku CI/CD, docker build, etc.
    chmodSync(distPath, 0o755)
  }
  console.log(`Downloaded in ${OUTPUT_DIR}`)
}

async function buildJqSource(url) {
  const tempDir = temporaryDirectory()

  console.log(`Building jq from ${url}`)

  try {
    const tarballPath = join(tempDir, `${JQ_INFO.version}.tar.gz`)
    await downloadFile(url, tarballPath)

    await extract({
      file: tarballPath,
      cwd: tempDir,
    })

    const sourceDir = join(tempDir, JQ_INFO.version)
    await runCommand(
      './configure',
      [
        '--with-oniguruma=builtin',
        `--prefix=${tempDir}`,
        `--bindir=${OUTPUT_DIR}`,
      ],
      { cwd: sourceDir },
    )
    await runCommand('make', ['-j8'], { cwd: sourceDir })
    await runCommand('make', ['install'], { cwd: sourceDir })

    console.log(`jq installed successfully in ${OUTPUT_DIR}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

async function downloadFile(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download jq: ${res.statusText}`)

  const totalSize = parseInt(res.headers.get('content-length'), 10)
  let downloadedSize = 0

  const fileStream = createWriteStream(dest)
  const dataStream = Readable.from(res.body)

  return new Promise((resolve, reject) => {
    dataStream.on('data', (chunk) => {
      downloadedSize += chunk.length
      const percentage = ((downloadedSize / totalSize) * 100).toFixed(2)
      process.stdout.write(`Downloading jq: ${percentage}%\r`)
    })

    dataStream.pipe(fileStream)

    dataStream.on('end', () => {
      console.log('\nDownload complete')
      fileStream.end()
      resolve()
    })

    dataStream.on('error', (err) => {
      fileStream.end()
      reject(err)
    })
  })
}

async function runCommand(command, args, options) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, options)

    proc.stdout.on('data', (data) => {
      process.stdout.write(`${command}: ${data}`)
    })

    proc.stderr.on('data', (data) => {
      process.stderr.write(`${command}: error: ${data}`)
    })

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`))
      } else {
        resolve()
      }
    })
  })
}
