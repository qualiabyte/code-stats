#! /usr/bin/env node

"use strict"

// code-stats.js
// Show code statistics for your project.

const { execSync } = require('child_process')
const fs = require('fs')

// Script version.
const VERSION = '0.1.4'

// Debug off by default.
var DEBUG = false

// Paths defaults to all visible in current dir.
var PATHS = []
var DEFAULT_PATHS = ['*']

// Pattern of filenames to exclude.
var EXCLUDE = '^$'
var DEFAULT_EXCLUDE = 'node_modules|jquery|underscore|mustache.js|require|order.js|text.js'

// Default filetypes menu.
var TYPES_MENU = `

  # Top languages (Github)

  js coffee           # Javascript
  rb erb              # Ruby
  py                  # Python
  sh                  # Shell
  java                # Java
  php                 # Php
  c h                 # C
  cpp cc cxx          # C++
  pl pm t ep          # Perl
  m mm                # Objective-C
  ts                  # TypeScript
  swift               # Swift
  scala               # Scala

  # More languages

  asm                 # Assembly
  clj                 # Clojure
  go                  # Go
  lisp                # Lisp
  hs                  # Haskell
  pde                 # Processing
  scm                 # Scheme
  proto               # Protocol Buffers

  # Web and docs

  html htm xhtml xml  # Markup
  css                 # Styles
  mustache haml jade  # Templates
  less sass scss styl # Preprocessed CSS
  md markdown         # Docs

  # Config

  cfg ini             # Settings
  json yml            # Serialized
`

// Filetypes to count.
var TYPES = parseTypesMenu(TYPES_MENU)

function parseTypesMenu(menu) {
  return menu
    .replace(/\#.*/g, '')
    .trim()
    .split(/\s+/g)
}

function log(message) {
  console.log(message)
}

function debug() {
  if (DEBUG)
    console.debug.apply(null, arguments)
}

function showVersion() {
  let message = `
  code-stats ${VERSION}
`
  log(message)
}

function showHelp() {
  let message = `
  Usage: code-stats [options] [<paths>]

    <paths>                       Paths to search; defaults to '*'.

  Options:

    -d, --debug                   Enable debug; shows processed filenames.
    -h, --help                    Show this help info.
    -v, --version                 Show the code-stats version.
    -t, --types <extensions>      File extensions to search, along with defaults (space separated list).
    -T, --types-only <extensions> File extensions to search, instead of defaults (space separated list).
    -x, --exclude <pattern>       Exclude files by regex, along with defaults.
    -X, --exclude-only <pattern>  Exclude files by regex, instead of defaults.
`
  log(message)
}

function printHeader() {
  let message = `
 Filetype | Line count
-----------------------`
  log(message)
}

function printBody() {
  printSorted()
}

function printSorted() {
  printCounts()
}

function findSourceFiles(paths) {
  let result = execSync(`find ${paths.join(' ')} -type f`, { encoding: 'utf8' })
  let filenames = result.split("\n")

  let regex1 = new RegExp('\\.(' + TYPES.join('|') + ')$')
  let regex2 = new RegExp('(' + EXCLUDE + ')')
  let regex3 = new RegExp('(' + DEFAULT_EXCLUDE + ')')

  let matches = filenames
    .filter(name => regex1.test(name))
    .filter(name => !regex2.test(name))
    .filter(name => !regex3.test(name))

  return matches
}

const RETURN = "\r".charCodeAt(0)
const NEWLINE = "\n".charCodeAt(0)

function countLines(file) {
  let promise = new Promise((resolve, reject) => {
    let count = 0
    let stream = fs.createReadStream(file)
      .on('data', (chunk) => {
        for (let i = 0; i < chunk.length; i++) {
          let curr = chunk[i]
          let next = i+1 < chunk.length ? chunk[i+1] : null
          if (curr == RETURN || curr == NEWLINE) count++
          if (curr == RETURN && next == NEWLINE) i++
        }
      })
      .on('end', () =>
        resolve(count))
  })
  return promise
}

async function printCounts() {
  const filenames = findSourceFiles(PATHS)
  let total = 0

  // Init type counts.
  const countsByType = {}
  for (let type of TYPES)
    countsByType[type] = 0

  // Count lines for each file.
  for (let name of filenames) {
    let type = name.replace(/^(.*)\.([^.]+)$/, '$2')
    let count = await countLines(name)

    debug(name, count)

    if (countsByType[type] === undefined)
      countsByType[type] = count
    else
      countsByType[type] += count

    total += count
  }

  // Create sorted list of count results.
  const results = Object
    .keys(countsByType)
    .map((type) => ({ type: type, count: countsByType[type] }))
    .sort((a, b) =>
      a.count != b.count
        ? a.count - b.count
        : a.type < b.type ? -1 : +1)
    .reverse()

  // Print counts for types.
  for (let result of results) {
    if (result.count == 0) continue
    let pad = '         '
    let left = (pad + result.type).slice(-9)
    let line = left + " | " + result.count
    log(line)
  }

  // Print total count.
  log(`~~~~~~~~~~~~~~~~~~~~~~~`)
  log(`      All | ${total}`)
}

function getOpts() {
  for (let i = 2; i < process.argv.length; i++) {
    let arg = process.argv[i]
    switch (arg) {
      case '-a': case '--any':          { TYPES = ['.*']; break }
      case '-d': case '--debug':        { DEBUG = true; break }
      case '-h': case '--help':         { showHelp(); process.exit(0) }
      case '-v': case '--version':      { showVersion(); process.exit(0) }
      case '-t': case '--types':        { TYPES = TYPES.concat(process.argv[i+1].split(' ')); i++; break }
      case '-T': case '--types-only':   { TYPES = process.argv[i+1].split(' '); i++; break }
      case '-x': case '--exclude':      { EXCLUDE = process.argv[i+1]; i++; break }
      case '-X': case '--exclude-only': { EXCLUDE = process.argv[i+1]; DEFAULT_EXCLUDE = "^$"; i++; break }
      default:                          { PATHS.push(process.argv[i]) }
    }
  }

  // Use default search paths if none given.
  if (PATHS.length == 0)
    PATHS = DEFAULT_PATHS

  debug(`PATHS: ${PATHS}`)
  debug(`TYPES: ${TYPES}`)
  debug(`EXCLUDE: ${EXCLUDE}`)
  debug(`DEFAULT_EXCLUDE: ${DEFAULT_EXCLUDE}`)
}

function main() {
  getOpts()
  printHeader()
  printBody()
}

// Let's do this!
main()
