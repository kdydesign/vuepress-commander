const { resolve, dirname, join } = require('path')
const { readFileSync, writeFileSync, existsSync } = require('fs')
const mkdirp = require('mkdirp')
const handlebars = require('handlebars')
const moment = require('moment')
const { red } = require('chalk')

/**
 * initial configuration
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
 */
function writeFile (content, dist) {
  if (existsSync(dist)) {
    console.trace(red('A post with the same name already exists.'))
    process.exit(1)
  }

  mkdirp.sync(dirname(dist))
  writeFileSync(dist, content)
}

/**
 * get locale
 */
exports.getLocale = () => {
  return Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0]
}

/**
 * make template
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
 */
exports.isDist = (path) => {
  try {
    return existsSync(path)
  } catch (err) {
    console.error(err)
  }

  return false
}
