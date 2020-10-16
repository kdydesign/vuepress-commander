#!/usr/bin/env node
const cac = require('cac')
const chalk = require('chalk')
const { join, dirname } = require('path')
const { version } = require('../package.json')

const { makeTemplate } = require('./util')


const cli = cac('vpc')

cli
  .command('new <post-name>', 'Create a new post.')
  .option('-f, --folder [folder]', '새 포스트를 생성할 디렉토리를 지정합니다.')
  .action((postName = 'new-post', cliOptions) => {
    makeTemplate(postName, cliOptions)
  })


cli.help()

cli.version(version)

cli.parse()
