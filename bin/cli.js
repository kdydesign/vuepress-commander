#!/usr/bin/env node
const cac = require('cac')
const { cyan, red } = require('chalk')
const { join } = require('path')
const { version } = require('../package.json')

const { initConfig } = require('./util')
const { newPost, vuepressCmd, cleanDest, deploy } = require('./action')

const cli = cac('vpc')
const vpcConfig = initConfig()

cli
  .command('new <post-name>', 'Create a new post.')
  .option('-f, --folder [folder]', 'Specify the directory in which to create the new post.')
  .action((postName = 'new-post', cliOptions) => {
    let folder = `${process.cwd()}/${vpcConfig.basePath}`

    if (cliOptions.folder) {
      folder = join(folder, cliOptions.folder)
    }

    newPost(postName, folder)

    console.log()
    console.log(cyan('🎉 You have created a new post.'))
  })

cli
  .command('serve', 'Runs the local server.')
  .action(() => {
    vuepressCmd('dev', {
      startMsg: '🚀 Runs the local server.',
      endMsg: 'Local server is running.'
    })
  })

cli
  .command('generate', 'Builds as a static page.')
  .action(() => {
    vuepressCmd('build', {
      startMsg: '✨ Builds as a static page.',
      endMsg: 'Build succeeded.'
    })
  })

cli
  .command('clean [clean-dir]', 'Delete the build result.')
  .action((cleanDir) => {
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
  .command('deploy', 'Deploy the build results to the git.')
  .action(() => {
    deploy(vpcConfig)
  })

cli.on('command:*', () => {
  console.error(red('❗ Unknown command: %s', cli.args.join(' ')))
  cli.outputHelp()

  process.exit(1)
})

cli.help()

cli.version(version)

cli.parse()
