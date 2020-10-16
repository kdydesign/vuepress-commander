#!/usr/bin/env node
const cac = require('cac')
const { cyan } = require('chalk')
const { spawn } = require('child_process')
const { version } = require('../package.json')

const { makeTemplate } = require('./util')

const cli = cac('vpc')

cli
  .command('new <post-name>', 'Create a new post.')
  .option('-f, --folder [folder]', '새 포스트를 생성할 디렉토리를 지정합니다.')
  .action((postName = 'new-post', cliOptions) => {
    makeTemplate(postName, cliOptions)

    console.log()
    console.log(cyan('✨ 새 포스트를 생성하였습니다.'))
  })

cli
  .command('dev [source-dir]', '로컬 서버를 실행합니다.')
  .action((sourceDir = 'src', cliOptions) => {
    console.log()
    console.log(cyan('✨ 로컬 서버를 실행합니다.'), sourceDir)
    const child = spawn('vuepress', ['dev'], { shell: true })

    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (data) => {
      process.stdout.write(data)
    })

    child.stderr.on('data', (data) => {
      process.stdout.write(data)
    })

    child.on('exit', (data) => {
      process.stdout.write('I\'m done!')
    })
  })

cli
  .command('build [source-dir]', '빌드합니다.')
  .action((sourceDir = 'src', cliOptions) => {
    console.log()
    console.log(cyan('✨ 빌드합니다.'), sourceDir)
    const child = spawn('vuepress', ['build'], { shell: true })

    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (data) => {
      process.stdout.write(data)
    })

    child.stderr.on('data', (data) => {
      process.stdout.write(data)
    })

    child.on('exit', (data) => {
      process.stdout.write('I\'m done!')
    })
  })

cli.help()

cli.version(version)

cli.parse()
