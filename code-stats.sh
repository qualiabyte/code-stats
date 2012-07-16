#!/bin/bash

# code-stats.sh
# Show code statistics for your project.

# Script version.
VERSION='0.0.1'

# Debug off by default.
DEBUG=

# Paths defaults to all visible in current dir.
PATHS=*

# Pattern of filenames to exclude.
EXCLUDE="(node_modules|jquery|underscore|require|mustache.js|order.js|text.js)"

# Filetypes to count.
TYPES=(
                      ## Top languages (Github)
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
                      ## More languages
  asm                 # Assembly
  clj                 # Clojure
  go                  # Go
  lisp                # Lisp
  hs                  # Haskell
  scm                 # Scheme
  pde                 # Processing
                      ## Web and docs
  html htm xhtml      # Markup
  css                 # Styles
  mustache            # Templates
  less sass stylus    # Preprocessed CSS
  md markdown         # Docs
)

showVersion() {
  cat <<-version

  code-stats $VERSION

version
}

showHelp() {
  cat <<-help

  Usage: code-stats [options]

  Options:
    -d, --debug    Enable debug; shows processed filenames.
    -h, --help     Show this help info.
    -v, --version  Show the code-stats version.

help
}

debug() {
  test "$DEBUG" -a "$1" && \
    echo "$1" >&2
}

printHeader() {
  echo " Filetype | Line count"
  echo "-----------------------"
}

findSourceFiles() {
  local paths="$@"
  local allExts=$( echo "\(${TYPES[@]}\)" | sed 's/ /\\|/g' )
  find $paths -type f -iregex ".*\.$allExts\$" | egrep -v "$EXCLUDE"
  debug "paths: $paths"
  debug "allExts: $allExts"
}

countLines() {
  local files="$1"
  echo "$files" | xargs cat | wc -l
}

printCounts() {

  # Find all source files.
  local sourceFiles=$( findSourceFiles * )

  # For each extension type...
  for ext in ${TYPES[@]}; do

    # Filter files, count lines, debug if found.
    local files=$( echo "$sourceFiles" | grep "\.$ext\$" )
    local count=$( countLines "$files" )
    debug "$files"

    # Print type and line count.
    printf "% 9s | %s\n" $ext $count
  done
}

printSorted() {
  printCounts | sort -r -n --key=3 | grep -v ' | 0'
}

printBody() {
  local sorted=$( printSorted )
  local total=$( echo "$sorted" | awk '{ total+= $3; }END{ print total }' )
  echo "$sorted"
  echo "~~~~~~~~~~~~~~~~~~~~~~~"
  echo "      All | $total"
}

getOpts() {
  while [[ "$1" == -* ]]; do
    case "$1" in
      -d | --debug   ) DEBUG=1; shift ;;
      -h | --help    ) showHelp; exit 0; ;;
      -v | --version ) showVersion; exit 0 ;;
      *              ) shift ;;
    esac
  done
}

main() {
  getOpts "$@"
  printHeader
  printBody
}

# Lets do this!
main "$@"
