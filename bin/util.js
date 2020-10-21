const { resolve, dirname, join } = require('path')
const { readFileSync, writeFileSync, existsSync } = require('fs')
const mkdirp = require('mkdirp')
const handlebars = require('handlebars')
const moment = require('moment')
const { red } = require('chalk')

/**
 * initial configuration
 *
 * @returns {{git: *, dest: string}}
 */
exports.initConfig = () => {
  const configPath = `${process.cwd()}/vpc.config.js`
  let defaultConfig = {
    basePath: 'docs',
    git: void 0,
    dest: '.vuepress/dist'
  }

  try {
    if (existsSync(configPath)) {
      const vpcConfig = require(`${process.cwd()}/vpc.config.js`)

      defaultConfig = Object.assign(defaultConfig, vpcConfig)
    }

    return defaultConfig
  } catch (err) {
    console.error(err)
  }
}

/**
 * write file
 *
 * @param content
 * @param dist
 */
function writeFile (content, dist) {
  if (existsSync(dist)) {
    console.trace(red('이미 같은 이름의 포스트가 존재합니다.'))
    process.exit(1)
  }

  mkdirp.sync(dirname(dist))
  writeFileSync(dist, content)
}

/**
 * get locale
 *
 * @returns {*}
 */
exports.getLocale = () => {
  return Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0]
}

/**
 * make template
 *
 * @param postName
 * @param cliOptions
 */
exports.makeTemplate = (postName, folder) => {
  const postTemplate = resolve(__dirname, '../templates/post.hbs')
  const makePost = join(folder, `${postName}.md`)
  const source = readFileSync(postTemplate, 'utf8')
  const template = handlebars.compile(source)
  const ctx = template({ date: moment().format('YYYY-MM-DD HH:mm:ss') })

  writeFile(ctx, makePost)
}

/**
 * check dist
 *
 * @param path
 * @returns {boolean}
 */
exports.isDist = (path) => {
  try {
    if (existsSync(path)) {
      return true
    }
  } catch (err) {
    console.error(err)
  }

  return false
}
