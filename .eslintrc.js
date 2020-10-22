module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
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
  ],
  rules: {
    'no-void': 'off'
  }
}
