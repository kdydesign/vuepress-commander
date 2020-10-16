module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    'jest/globals': true
  },
  plugins: ['jest'],
  extends: [
    'standard',
    'plugin:import/errors',
    'plugin:import/warnings',
    'eslint:recommended'
  ]
}
