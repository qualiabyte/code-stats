#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// code-stats.js
// Show code statistics for your project.
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
// @ts-ignore
const package_json_1 = __importDefault(require("./package.json"));
// Debug off by default.
let isDebug = false;
// Paths defaults to all visible in current dir.
const DEFAULT_PATHS = ['*'];
// Pattern of filenames to exclude.
const DEFAULT_EXCLUDE = 'node_modules|jquery|underscore|mustache.js|require|order.js|text.js';
// Table output configuration.
const TABLE = {
    HEADERS: ["Type", "Files", "Lines"],
    COLUMN_ALIGN: "left",
    // Markdown-style delimiters (see: https://www.markdownguide.org/extended-syntax/#tables)
    COLUMN_SEPARATOR: " | ",
    DIVIDER_COLUMN_SEPARATOR: "-|-",
    DIVIDER: "-"
};
// Default filetypes menu.
const TYPES_MENU = `

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
`;
// Filetypes to count.
const DEFAULT_TYPES = parseTypesMenu(TYPES_MENU);
function parseTypesMenu(menu) {
    return menu
        .replace(/\#.*/g, '')
        .trim()
        .split(/\s+/g);
}
function log(message) {
    console.log(message);
}
function debug(...args) {
    if (isDebug)
        console.debug(...args);
}
function showVersion() {
    let message = `
  code-stats ${package_json_1.default.version}
`;
    log(message);
}
function showHelp() {
    let message = `
  Usage: code-stats [options] [<paths>]

    <paths>                       Paths to search; defaults to '*'.

  Options:

    -a, --all                     Include files of all types.
    -d, --debug                   Debug options, files, and counts.
    -h, --help                    Show this help info.
    -t, --types <extensions>      File extensions to search, along with defaults (space separated list).
    -T, --types-only <extensions> File extensions to search, instead of defaults (space separated list).
    -x, --exclude <pattern>       Exclude files, along with defaults (regex).
    -X, --exclude-only <pattern>  Exclude files, instead of defaults (regex).
    -v, --version                 Show the code-stats version.
`;
    log(message);
}
async function collectCodeStats({ paths, types, exclude, useDefaultExclude }) {
    let totalFiles = 0;
    let totalLines = 0;
    const linesByType = {};
    const filesByType = {};
    const filenames = findSourceFiles(paths, types, exclude, useDefaultExclude);
    for (const filename of filenames) {
        const { type, lines } = await collectSourceFileCodeStats(filename);
        totalFiles++;
        totalLines += lines;
        filesByType[type] = (filesByType[type] || 0) + 1;
        linesByType[type] = (linesByType[type] || 0) + lines;
    }
    return {
        totalFiles,
        totalLines,
        filesByType,
        linesByType
    };
}
async function collectSourceFileCodeStats(filename) {
    const type = filename.replace(/^(.*)\.([^.]+)$/, '$2');
    const lines = await countLines(filename);
    debug(filename, type, lines);
    return {
        type,
        lines
    };
}
function findSourceFiles(paths, types, exclude, useDefaultExclude) {
    const result = child_process_1.execSync(`find ${paths.join(' ')} -type f`, { encoding: 'utf8' });
    const filenames = result.split("\n");
    const typesRegex = new RegExp(`\\.(${types.join("|")})$`);
    const excludeRegex = exclude && new RegExp(`(${exclude})`);
    const defaultExcludeRegex = useDefaultExclude && new RegExp(`(${DEFAULT_EXCLUDE})`);
    const matches = filenames
        .filter(name => typesRegex.test(name))
        .filter(name => excludeRegex ? !excludeRegex.test(name) : true)
        .filter(name => defaultExcludeRegex ? !defaultExcludeRegex.test(name) : true);
    return matches;
}
const RETURN = "\r".charCodeAt(0);
const NEWLINE = "\n".charCodeAt(0);
async function countLines(file) {
    let promise = new Promise((resolve, reject) => {
        let count = 0;
        let stream = fs_1.default.createReadStream(file)
            .on('data', (chunk) => {
            for (let i = 0; i < chunk.length; i++) {
                let curr = chunk[i];
                let next = i + 1 < chunk.length ? chunk[i + 1] : null;
                if (curr == RETURN || curr == NEWLINE)
                    count++;
                if (curr == RETURN && next == NEWLINE)
                    i++;
            }
        })
            .on('end', () => resolve(count));
    });
    return promise;
}
function printResults({ linesByType, filesByType, totalLines, totalFiles }) {
    const sortedRows = Object
        .keys(linesByType)
        .map(type => ({
        type,
        files: filesByType[type],
        lines: linesByType[type],
        percent: linesByType[type] / totalLines
    }))
        .sort((a, b) => a.lines != b.lines
        ? a.lines - b.lines
        : a.type < b.type ? -1 : +1)
        .reverse();
    const formattedRows = sortedRows.map(row => [
        row.type,
        `${row.files}`,
        `${row.lines} (${formatPercent(row.lines / totalLines)})`,
    ]);
    const summary = ["All", `${totalFiles}`, `${totalLines}`];
    log("");
    printTable(TABLE.HEADERS, formattedRows, summary);
}
function formatPercent(fraction) {
    const n = fraction * 100;
    return `${n.toFixed(n >= 1 ? 0 : 1)}%`;
}
function printTable(headers, rows, footer) {
    const columnWidths = calculateColumnWidths([headers, ...rows, footer]);
    printRow(headers, columnWidths);
    printDivider(columnWidths);
    rows.forEach(row => printRow(row, columnWidths));
    printDivider(columnWidths);
    printRow(footer, columnWidths);
}
function calculateColumnWidths(allRows) {
    const widths = [];
    allRows.forEach(row => {
        row.forEach((col, i) => {
            widths[i] = Math.max(widths[i] || 0, col.length);
        });
    });
    return widths;
}
function printRow(values, widths) {
    log(values.map((val, i) => padColumn(val, widths[i])).join(TABLE.COLUMN_SEPARATOR).trim());
}
function printDivider(widths) {
    log(widths.map(width => repeat(TABLE.DIVIDER, width)).join(TABLE.DIVIDER_COLUMN_SEPARATOR));
}
function padColumn(text, width, align = TABLE.COLUMN_ALIGN) {
    const pad = repeat(" ", width);
    return align == "left"
        ? `${text}${pad}`.slice(0, pad.length)
        : `${pad}${text}`.slice(-pad.length);
}
function repeat(char, length) {
    return Array.from({ length }, () => char).join("");
}
function getOpts() {
    const opts = {
        types: [...DEFAULT_TYPES],
        exclude: null,
        useDefaultExclude: true,
        paths: []
    };
    for (let i = 2; i < process.argv.length; i++) {
        const arg = process.argv[i];
        switch (arg) {
            case '-a':
            case '--all': {
                opts.types = ['.*'];
                break;
            }
            case '-d':
            case '--debug': {
                isDebug = true;
                break;
            }
            case '-h':
            case '--help': {
                showHelp();
                return false;
            }
            case '-v':
            case '--version': {
                showVersion();
                return false;
            }
            case '-t':
            case '--types': {
                opts.types.push(...process.argv[i + 1].split(' '));
                i++;
                break;
            }
            case '-T':
            case '--types-only': {
                opts.types = process.argv[i + 1].split(' ');
                i++;
                break;
            }
            case '-x':
            case '--exclude': {
                opts.exclude = process.argv[i + 1];
                i++;
                break;
            }
            case '-X':
            case '--exclude-only': {
                opts.exclude = process.argv[i + 1];
                opts.useDefaultExclude = false;
                i++;
                break;
            }
            default: {
                opts.paths.push(process.argv[i]);
            }
        }
    }
    // Use default search paths if none given.
    if (opts.paths.length == 0)
        opts.paths = DEFAULT_PATHS;
    debug(JSON.stringify(opts, null, 2));
    return opts;
}
async function main() {
    const opts = getOpts();
    if (opts) {
        const results = await collectCodeStats(opts);
        printResults(results);
    }
}
// Let's do this!
main();
