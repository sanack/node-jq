#!/usr/bin/env node
const { spawn } = require('child_process')
const path = require('path')

const jqName = process.platform === 'win32' ? 'jq.exe' : 'jq'
const jqPath = path.join(__dirname, jqName)

const child = spawn(jqPath, process.argv.slice(2), { stdio: 'inherit' })
child.on('exit', (code) => process.exit(code))
