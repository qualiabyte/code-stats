assert = require 'assert'
should = require 'should'
{exec} = require 'child_process'

describe 'sanity check', ->
  it 'should pass', ->
    assert 1 + 1 == 2

describe 'code-stats', ->
  it 'should show line counts for each type', (done) ->
    exec './code-stats test/fixtures', (err, stdout, stderr) ->
      should.not.exist err
      expected = """
         Filetype | Line count
        -----------------------
               js | 1000
                c | 900
               rb | 800
               py | 700
             java | 600
        ~~~~~~~~~~~~~~~~~~~~~~~
              All | 4000"""
      assert ~stdout.indexOf(expected), 'counts should match'
      done()
