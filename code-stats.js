#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
// code-stats.js
// Show code statistics for your project.
var fs = require("fs");
var globby_1 = require("globby");
// @ts-ignore
var package_json_1 = require("./package.json");
// Debug off by default.
var isDebug = false;
// Paths defaults to all visible in current dir.
var DEFAULT_PATHS = ['*'];
// Pattern of filenames to exclude.
var DEFAULT_EXCLUDE = 'node_modules|jquery|underscore|mustache.js|require|order.js|text.js';
// Table output configuration.
var TABLE = {
    HEADERS: ["Type", "Files", "Lines"],
    COLUMN_ALIGN: "left",
    // Markdown-style delimiters (see: https://www.markdownguide.org/extended-syntax/#tables)
    COLUMN_SEPARATOR: " | ",
    DIVIDER_COLUMN_SEPARATOR: "-|-",
    DIVIDER: "-"
};
// Default filetypes menu.
var TYPES_MENU = "\n\n  # Top languages (Github)\n\n  js coffee           # Javascript\n  rb erb              # Ruby\n  py                  # Python\n  sh                  # Shell\n  java                # Java\n  php                 # Php\n  c h                 # C\n  cpp cc cxx          # C++\n  pl pm t ep          # Perl\n  m mm                # Objective-C\n  ts                  # TypeScript\n  swift               # Swift\n  scala               # Scala\n\n  # More languages\n\n  asm                 # Assembly\n  clj                 # Clojure\n  go                  # Go\n  kt                  # Kotlin\n  rs                  # Rust\n  cs csx              # C#\n  dart                # Dart\n  sql                 # SQL\n  lisp                # Lisp\n  hs                  # Haskell\n  pde                 # Processing\n  scm                 # Scheme\n  proto               # Protocol Buffers\n\n  # Web and docs\n\n  html htm xhtml xml  # Markup\n  css                 # Styles\n  mustache haml jade  # Templates\n  less sass scss styl # Preprocessed CSS\n  md markdown         # Docs\n\n  # Config\n\n  cfg ini             # Settings\n  json yml            # Serialized\n  gradle              # Gradle\n  .rlib               # Rust Metadata\n";
// Filetypes to count.
var DEFAULT_TYPES = parseTypesMenu(TYPES_MENU);
function parseTypesMenu(menu) {
    return menu
        .replace(/\#.*/g, '')
        .trim()
        .split(/\s+/g);
}
function log(message) {
    console.log(message);
}
function debug() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (isDebug)
        console.debug.apply(console, args);
}
function showVersion() {
    var message = "\n  code-stats " + package_json_1["default"].version + "\n";
    log(message);
}
function showHelp() {
    var message = "\n  Usage: code-stats [options] [<paths>]\n\n    <paths>                       Paths to search; defaults to '*'.\n\n  Options:\n\n    -a, --all                     Include files of all types.\n    -d, --debug                   Debug options, files, and counts.\n    -h, --help                    Show this help info.\n    -t, --types <extensions>      File extensions to search, along with defaults (space separated list).\n    -T, --types-only <extensions> File extensions to search, instead of defaults (space separated list).\n    -x, --exclude <pattern>       Exclude files, along with defaults (regex).\n    -X, --exclude-only <pattern>  Exclude files, instead of defaults (regex).\n    -v, --version                 Show the code-stats version.\n";
    log(message);
}
function collectCodeStats(_a) {
    var paths = _a.paths, types = _a.types, exclude = _a.exclude, useDefaultExclude = _a.useDefaultExclude;
    return __awaiter(this, void 0, void 0, function () {
        var totalLines, filesByType, linesByType, filenames, _i, filenames_1, filename, _b, type, lines, totalFiles;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    totalLines = 0;
                    filesByType = {};
                    linesByType = {};
                    filenames = findSourceFiles(paths, types, exclude, useDefaultExclude);
                    _i = 0, filenames_1 = filenames;
                    _c.label = 1;
                case 1:
                    if (!(_i < filenames_1.length)) return [3 /*break*/, 4];
                    filename = filenames_1[_i];
                    return [4 /*yield*/, collectSourceFileCodeStats(filename)];
                case 2:
                    _b = _c.sent(), type = _b.type, lines = _b.lines;
                    totalLines += lines;
                    filesByType[type] = (filesByType[type] || 0) + 1;
                    linesByType[type] = (linesByType[type] || 0) + lines;
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    totalFiles = filenames.length;
                    return [2 /*return*/, {
                            totalFiles: totalFiles,
                            totalLines: totalLines,
                            filesByType: filesByType,
                            linesByType: linesByType
                        }];
            }
        });
    });
}
function collectSourceFileCodeStats(filename) {
    return __awaiter(this, void 0, void 0, function () {
        var type, lines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    type = filename.replace(/^(.*)\.([^.]+)$/, '$2');
                    return [4 /*yield*/, countLines(filename)];
                case 1:
                    lines = _a.sent();
                    debug(filename, type, lines);
                    return [2 /*return*/, {
                            type: type,
                            lines: lines
                        }];
            }
        });
    });
}
function findFilesInPaths(paths) {
    var options = { expandDirectories: true };
    var filenames = globby_1["default"].sync(paths, options);
    return filenames;
}
function findSourceFiles(paths, types, exclude, useDefaultExclude) {
    var filenames = findFilesInPaths(paths);
    var typesRegex = new RegExp("\\.(" + types.join("|") + ")$");
    var excludeRegex = exclude && new RegExp("(" + exclude + ")");
    var defaultExcludeRegex = useDefaultExclude && new RegExp("(" + DEFAULT_EXCLUDE + ")");
    var matches = filenames
        .filter(function (name) { return typesRegex.test(name); })
        .filter(function (name) { return excludeRegex ? !excludeRegex.test(name) : true; })
        .filter(function (name) { return defaultExcludeRegex ? !defaultExcludeRegex.test(name) : true; });
    debug("Ignored files:", filenames.length - matches.length);
    return matches;
}
var RETURN = "\r".charCodeAt(0);
var NEWLINE = "\n".charCodeAt(0);
function countLines(file) {
    return __awaiter(this, void 0, void 0, function () {
        var promise;
        return __generator(this, function (_a) {
            promise = new Promise(function (resolve, reject) {
                var count = 0;
                var stream = fs.createReadStream(file)
                    .on('data', function (chunk) {
                    for (var i = 0; i < chunk.length; i++) {
                        var curr = chunk[i];
                        var next = i + 1 < chunk.length ? chunk[i + 1] : null;
                        if (curr == RETURN || curr == NEWLINE)
                            count++;
                        if (curr == RETURN && next == NEWLINE)
                            i++;
                    }
                })
                    .on('end', function () {
                    return resolve(count);
                });
            });
            return [2 /*return*/, promise];
        });
    });
}
function printResults(_a) {
    var linesByType = _a.linesByType, filesByType = _a.filesByType, totalLines = _a.totalLines, totalFiles = _a.totalFiles;
    var sortedRows = Object
        .keys(linesByType)
        .map(function (type) { return ({
        type: type,
        files: filesByType[type],
        lines: linesByType[type]
    }); })
        .sort(function (a, b) {
        return a.lines != b.lines
            ? a.lines - b.lines
            : a.type < b.type ? -1 : +1;
    })
        .reverse();
    var formattedRows = sortedRows.map(function (row) { return [
        row.type,
        "" + row.files,
        row.lines + " (" + formatPercent(row.lines / totalLines) + ")",
    ]; });
    var summary = ["All", "" + totalFiles, "" + totalLines];
    log("");
    printTable(TABLE.HEADERS, formattedRows, summary);
}
function formatPercent(fraction) {
    var n = fraction * 100;
    return n.toFixed(n >= 1 ? 0 : 1) + "%";
}
function printTable(headers, rows, footer) {
    var columnWidths = calculateColumnWidths(__spreadArray(__spreadArray([headers], rows), [footer]));
    printRow(headers, columnWidths);
    printDivider(columnWidths);
    rows.forEach(function (row) { return printRow(row, columnWidths); });
    printDivider(columnWidths);
    printRow(footer, columnWidths);
}
function calculateColumnWidths(allRows) {
    var widths = [];
    allRows.forEach(function (row) {
        row.forEach(function (col, i) {
            widths[i] = Math.max(widths[i] || 0, col.length);
        });
    });
    return widths;
}
function printRow(values, widths) {
    log(values.map(function (val, i) { return padColumn(val, widths[i]); }).join(TABLE.COLUMN_SEPARATOR).trim());
}
function printDivider(widths) {
    log(widths.map(function (width) { return repeat(TABLE.DIVIDER, width); }).join(TABLE.DIVIDER_COLUMN_SEPARATOR));
}
function padColumn(text, width, align) {
    if (align === void 0) { align = TABLE.COLUMN_ALIGN; }
    var pad = repeat(" ", width);
    return align == "left"
        ? ("" + text + pad).slice(0, pad.length)
        : ("" + pad + text).slice(-pad.length);
}
function repeat(char, length) {
    return Array.from({ length: length }, function () { return char; }).join("");
}
function getOpts() {
    var _a;
    var opts = {
        types: __spreadArray([], DEFAULT_TYPES),
        exclude: null,
        useDefaultExclude: true,
        paths: []
    };
    for (var i = 2; i < process.argv.length; i++) {
        var arg = process.argv[i];
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
                (_a = opts.types).push.apply(_a, process.argv[i + 1].split(' '));
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
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var opts, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = getOpts();
                    if (!opts) return [3 /*break*/, 2];
                    return [4 /*yield*/, collectCodeStats(opts)];
                case 1:
                    results = _a.sent();
                    printResults(results);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
// Let's do this!
main();
