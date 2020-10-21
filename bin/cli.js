#!/usr/bin/env node
const cac = require('cac')
const { cyan } = require('chalk')
const { join } = require('path')
const { version } = require('../package.json')

const { initConfig } = require('./util')
const { newPost, vuepressCmd, cleanDest, deploy } = require('./action')

const cli = cac('vpc')
const vpcConfig = initConfig()

cli
  .command('new <post-name>', 'Create a new post.')
  .option('-f, --folder [folder]', '새 포스트를 생성할 디렉토리를 지정합니다.')
  .action((postName = 'new-post', cliOptions) => {
    let folder = `${process.cwd()}/${vpcConfig.basePath}`

    if (cliOptions.folder) {
      folder = join(folder, cliOptions.folder)
    }

    newPost(postName, folder)

    console.log()
    console.log(cyan('✨ 새 포스트를 생성하였습니다.'))
  })

cli
  .command('serve [source-dir]', '로컬 서버를 실행합니다.')
  .action((sourceDir = 'src', cliOptions) => {
    vuepressCmd('dev', {
      startMsg: '✨ 로컬 서버를 실행합니다.',
      endMsg: '로걸 서버가 구동되었습니다.'
    })
  })

cli
  .command('generate [source-dir]', '빌드합니다.')
  .action((sourceDir = 'src', cliOptions) => {
    vuepressCmd('build', {
      startMsg: '✨ 빌드합니다.',
      endMsg: '빌드에 성공하였습니다.'
    })
  })

cli
  .command('clean [clean-dir]', '빌드 삭제.')
  .action((cleanDir, cliOptions) => {
    let destDir = cleanDir

    if (!cleanDir && !vpcConfig.dest) {
      destDir = '.vuepress/dist'
    }

    if (!cleanDir && vpcConfig.dest) {
      destDir = vpcConfig.dest
    }

    cleanDest(`${process.cwd()}/${destDir}`)
  })

cli
  .command('deploy', '빌드 삭제.')
  .action((destDir = 'dist', cliOptions) => {
    deploy(vpcConfig)
  })

cli.help()

cli.version(version)

cli.parse()
