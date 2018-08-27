
# code-stats

Show code statistics for your project.

## Example

For example, running code-stats on its own directory:

    $ code-stats --exclude 'test/fixtures'

     Filetype | Line count
    -----------------------
           sh | 171
     markdown | 75
       coffee | 47
         json | 23
    ~~~~~~~~~~~~~~~~~~~~~~~
          All | 316

## Features

+ Reports line counts for various types of source files.
+ Optionally specify paths to include, and exclude files by pattern (see usage).
+ Excludes paths like `node_modules` by default.
+ Supports the following filetypes:

        ## Top languages (Github)                     ## More languages
        ---------------------------------------       ----------------------------------
        js coffee           # Javascript              asm                 # Assembly
        rb erb              # Ruby                    clj                 # Clojure
        py                  # Python                  go                  # Go
        sh                  # Shell                   lisp                # Lisp
        java                # Java                    hs                  # Haskell
        php                 # Php                     pde                 # Processing
        c h                 # C                       scm                 # Scheme
        cpp cc cxx          # C++                     proto               # Protocol Buffers
        pl pm t ep          # Perl
        m mm                # Objective-C

        ## Web and docs                               ## Config
        ---------------------------------------       ----------------------------------
        html htm xhtml xml  # Markup                  cfg ini             # Settings
        css                 # Styles                  json yml            # Serialized
        mustache haml jade  # Templates
        less sass scss styl # Preprocessed CSS
        md markdown         # Docs

## Installation

To get the `code-stats` command, install globally with npm:

    $ npm install -g code-stats

## Usage

Just run `code-stats` within your project directory:

    $ code-stats

## Options

Run `code-stats -h` to see the available options:

    Usage: code-stats [options] [<paths>]

      <paths>                      Paths to search; defaults to '*'.

    Options:

      -d, --debug                  Enable debug; shows processed filenames.
      -h, --help                   Show this help info.
      -v, --version                Show the code-stats version.
      -x, --exclude <pattern>      Exclude files by regex, along with defaults.
      -X, --exclude-only <pattern> Exclude files by regex, instead of defaults.

