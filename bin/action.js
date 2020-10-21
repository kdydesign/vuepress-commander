const { cyan, green, bgBlue, black } = require('chalk')
const { spawn } = require('child_process')
const { join } = require('path')
const ora = require('ora')
const rimraf = require('rimraf')
const simpleGit = require('simple-git')

const { makeTemplate } = require('./util')

/**
 * new post
 *
 * @param postName
 * @param folder
 */
exports.newPost = (postName, folder) => {
  makeTemplate(postName, folder)
}

/**
 * vuepress command
 *
 * @param cmd
 * @param startMsg
 * @param endMsg
 */
exports.vuepressCmd = (cmd, { startMsg, endMsg }) => {
  const child = spawn('vuepress', [cmd], { shell: true })

  console.log()
  console.log(cyan(startMsg))

  child.stdout.setEncoding('utf8')
  child.stdout.on('data', data => process.stdout.write(data))
  child.stderr.on('data', data => process.stdout.write(data))

  child.on('exit', data => process.stdout.write(green(endMsg)))
}

/**
 * clean build
 *
 * @param destDir
 */
exports.cleanDest = (destDir) => {
  rimraf.sync(destDir)

  console.log('🚽 Cleaned build artifacts.\n')
}

/**
 * git deploy
 *
 * @param git
 * @returns {Promise<void>}
 */
exports.deploy = async ({ git, dest }) => {
  const throbber = ora(bgBlue(black('[Deploy]'))).start()

  const simGit = simpleGit({
    baseDir: join(process.cwd(), dest)
  })

  try {
    await simGit
      .checkIsRepo()
      .then(async isRepo => {
        if (!isRepo) {
          await simGit
            .init(() => console.log(green(': init success..')))
            .addRemote('origin', git, (err, result) => {
              if (err) {
                console.log(err)
              }

              console.log(green(': remote success..'))
            })
        }
      })

    await simGit.add('.', (err, result) => {
      if (err) {
        console.log(err)
      }

      console.log(green(': add file success..'))
    })

    await simGit.commit('vuepress-cli Deploy', (err, result) => {
      if (err) {
        console.log(err)
      }

      console.log(green(': commit file success..'))
    })

    await simGit.push(['-u', 'origin', 'master', '-f'], (err, result) => {
      if (err) {
        console.log(err)
      }

      console.log(green(': push file success..'))
      console.log()
      throbber.stopAndPersist({
        symbol: green('✔'),
        text: green('배포 완료')
      })
    })
  } catch (err) {
    console.log(err)
  }
}
