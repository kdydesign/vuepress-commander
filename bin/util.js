const { resolve, dirname, join } = require('path')
const { readFileSync, writeFileSync, existsSync } = require('fs')
const mkdirp = require('mkdirp')
const handlebars = require('handlebars')
const moment = require('moment')
const { red } = require('chalk')

function writeFile (content, dist) {
  if (existsSync(dist)) {
    console.trace(red('이미 같은 이름의 포스트가 존재합니다.'))
    process.exit(1)
  }

  mkdirp.sync(dirname(dist))
  writeFileSync(dist, content)
}

exports.getLocale = () => {
  return Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0]
}

exports.makeTemplate = (postName, cliOptions) => {
  let folder = process.cwd()

  if (cliOptions.folder) {
    folder = join(folder, cliOptions.folder)
  }

  const postTemplate = resolve(__dirname, '../templates/post.hbs')
  const makePost = join(folder, `${postName}.md`)
  const source = readFileSync(postTemplate, 'utf8')
  const template = handlebars.compile(source)
  const ctx = template({ date: moment().format('YYYY-MM-DD HH:mm:ss') })

  writeFile(ctx, makePost)
}
