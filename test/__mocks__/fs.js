const fs = jest.createMockFromModule('fs')
let mockPath = void 0

function __createMockFiles (dest) {
  mockPath = 'basePath/' + dest
}

function existsSync (dest) {
  return mockPath === dest
}

fs.existsSync = existsSync
fs.__createMockFiles = __createMockFiles

module.exports = fs
