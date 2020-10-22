jest.mock('fs')

describe('utils', () => {
  beforeEach(() => {
    require('fs').__createMockFiles('dist')
  })

  test('isDist', () => {
    const util = require('../bin/util')
    const spy = jest.spyOn(util, 'isDist')
    const is = util.isDist('basePath/dist')

    expect(spy).toHaveBeenCalled()
    expect(is).toBe(true)
  })
})
