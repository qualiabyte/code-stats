const assert = require('assert')
const should = require('should')
const { exec } = require('child_process')

describe('sanity check', () => {
  it('should pass', () => {
    assert(1 + 1 === 2)
  })
})

describe('code-stats', () => {
  describe('code-stats <paths>', () => {
    it('should show line counts for each type', (done) => {
      exec('node code-stats.js test/fixtures', (err, stdout) => {
        should.not.exist(err)
        const expected = `
Type | Files | Lines
-----|-------|-----------
js   | 2     | 1010 (25%)
c    | 1     | 900 (22%)
rb   | 1     | 800 (20%)
py   | 1     | 700 (17%)
java | 1     | 600 (15%)
scss | 1     | 10 (0.2%)
-----|-------|-----------
All  | 7     | 4020
`
        stdout.should.equal(expected)
        done()
      })
    })
  })

  describe('-a, --all', () => {
    it('should include files of all types', (done) => {
      exec('node code-stats.js --all test/fixtures', (err, stdout) => {
        should.not.exist(err)
        const expected = `
Type | Files | Lines
-----|-------|-----------
js   | 2     | 1010 (25%)
c    | 1     | 900 (22%)
rb   | 1     | 800 (20%)
py   | 1     | 700 (17%)
java | 1     | 600 (15%)
scss | 1     | 10 (0.2%)
ext1 | 1     | 10 (0.2%)
ext2 | 1     | 5 (0.1%)
-----|-------|-----------
All  | 9     | 4035
`
        stdout.should.equal(expected)
        done()
      })
    })
  })


  describe('-x, --exclude <pattern>', () => {
    it('should exclude files in addition to defaults', (done) => {
      exec('node code-stats.js -x "js|java" test/fixtures', (err, stdout) => {
        should.not.exist(err)
        const expected = `
Type | Files | Lines
-----|-------|----------
c    | 1     | 900 (37%)
rb   | 1     | 800 (33%)
py   | 1     | 700 (29%)
scss | 1     | 10 (0.4%)
-----|-------|----------
All  | 4     | 2410
`
        stdout.should.equal(expected)
        done()
      })
    })
  })


  describe('-t, --types <extensions>', () => {
    it('should add custom file types in addition to defaults', (done) => {
      exec('node code-stats.js -t "ext1 ext2" test/fixtures', (err, stdout, stderr) => {
        should.not.exist(err)
        const expected = `
Type | Files | Lines
-----|-------|-----------
js   | 2     | 1010 (25%)
c    | 1     | 900 (22%)
rb   | 1     | 800 (20%)
py   | 1     | 700 (17%)
java | 1     | 600 (15%)
scss | 1     | 10 (0.2%)
ext1 | 1     | 10 (0.2%)
ext2 | 1     | 5 (0.1%)
-----|-------|-----------
All  | 9     | 4035
`
        stdout.should.equal(expected)
        done()
      })
    })
  })


  describe('-T, --types-only <extensions>', () => {
    it('should search only custom file types', (done) => {
      exec('node code-stats.js --types-only "ext1 ext2" test/fixtures', (err, stdout) => {
        should.not.exist(err)
        const expected = `
Type | Files | Lines
-----|-------|---------
ext1 | 1     | 10 (67%)
ext2 | 1     | 5 (33%)
-----|-------|---------
All  | 2     | 15
`
        stdout.should.equal(expected)
        done()
      })
    })
  })
})
