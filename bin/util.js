const { resolve, dirname, join } = require('path')
const { readFileSync, writeFileSync } = require('fs')
const mkdirp = require('mkdirp')
const handlebars = require('handlebars')
const moment = require('moment')

function writeFile (content, dist) {
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

  const postTemplate = resolve(__dirname, `../templates/post.hbs`)
  const makePost = join(folder, `${postName}.md`)
  const source = readFileSync(postTemplate, 'utf8')
  const template = handlebars.compile(source)
  const ctx = template({ date: moment().format('YYYY-MM-DD HH:mm:ss') })

  writeFile(ctx, makePost)
}
