#!/bin/bash

# code-stats.sh
# Show code statistics for your project.

# Script version.
VERSION='0.1.3'

# Debug off by default.
DEBUG=

# Paths defaults to all visible in current dir.
PATHS=*

# Pattern of filenames to exclude.
EXCLUDE='^$'
DEFAULT_EXCLUDE='node_modules|jquery|underscore|mustache.js|require|order.js|text.js'

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
  ts                  # TypeScript
  swift               # Swift
  scala               # Scala

  ## More languages

  asm                 # Assembly
  clj                 # Clojure
  go                  # Go
  lisp                # Lisp
  hs                  # Haskell
  pde                 # Processing
  scm                 # Scheme
  proto               # Protocol Buffers
  
  ## Web and docs

  html htm xhtml xml  # Markup
  css                 # Styles
  mustache haml jade  # Templates
  less sass scss styl # Preprocessed CSS
  md markdown         # Docs

  ## Config

  cfg ini             # Settings
  json yml            # Serialized
)

showVersion() {
  cat <<-version

  code-stats ${VERSION}

version
}

showHelp() {
  cat <<-help

  Usage: code-stats [options] [<paths>]

    <paths>                      Paths to search; defaults to '*'.

  Options:

    -d, --debug                  Enable debug; shows processed filenames.
    -h, --help                   Show this help info.
    -v, --version                Show the code-stats version.
    -x, --exclude <pattern>      Exclude files by regex, along with defaults.
    -X, --exclude-only <pattern> Exclude files by regex, instead of defaults.

help
}

debug() {
  test "$DEBUG" -a "$*" && \
    echo "$@" >&2
}

printHeader() {
  echo ""
  echo " Filetype | Line count"
  echo "-----------------------"
}

findSourceFiles() {
  local paths="$@"
  local allExts=$( echo "\(${TYPES[@]}\)" | sed 's/ /\\|/g' )
  find ${paths} -type f \
    | grep "\.$allExts\$" \
    | egrep -v "$EXCLUDE" \
    | egrep -v "$DEFAULT_EXCLUDE"
}

countLines() {
  local files="$1"
  echo "$files" | xargs cat | wc -l
}

printCounts() {

  # Find all source files.
  local sourceFiles=$( findSourceFiles "$PATHS" )

  # For each extension type...
  for ext in ${TYPES[@]}; do

    # Filter files, count lines, debug if found.
    local files=$( echo "$sourceFiles" | grep "\.$ext\$" )
    local count=$( countLines "$files" )
    debug "$files"

    # Print type and line count.
    printf "% 9s | %s\n" ${ext} ${count}
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
      -d | --debug        ) DEBUG=1; shift ;;
      -h | --help         ) showHelp; exit 0 ;;
      -v | --version      ) showVersion; exit 0 ;;
      -x | --exclude      ) EXCLUDE="$2"; shift; shift ;;
      -X | --exclude-only ) EXCLUDE="$2"; DEFAULT_EXCLUDE='^$'; shift; shift ;;
      *                   ) shift ;;
    esac
  done

  # Any remaining arguments become search paths.
  test "$1" && \
    PATHS="$@"

  # Debug options.
  debug "PATHS: $PATHS"
  debug "TYPES: ${TYPES[@]}"
  debug "EXCLUDE: $EXCLUDE"
  debug "DEFAULT_EXCLUDE: $DEFAULT_EXCLUDE"
}

main() {
  getOpts "$@"
  printHeader
  printBody
}

# Lets do this!
main "$@"
