const assert = require('chai').assert,
      isDir = require('./../routes/util').isDir

describe('Routes util tests', function(){
  it('returns isDir true', function(){
    assert.isTrue(isDir('path/to/dir/'))
  })

  it('returns isDir false', function(){
    assert.isFalse(isDir('path/to/dir/file.text'))
  })

  it('treats empty path as non dir path', function(){
    assert.isFalse(isDir(''))
  })

  it('handles invalid path', function(){
    assert.isFalse(isDir(null))
    assert.isFalse(isDir(undefined))
  })
})
