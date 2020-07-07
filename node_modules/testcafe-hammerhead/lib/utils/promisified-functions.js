"use strict";

exports.__esModule = true;
exports.exec = exports.fsObjectExists = exports.writeFile = exports.makeDir = exports.access = exports.stat = exports.readFile = exports.readDir = exports.inflateRaw = exports.inflate = exports.gunzip = exports.deflate = exports.gzip = void 0;

var _zlib = _interopRequireDefault(require("zlib"));

var _util = require("util");

var _fs = _interopRequireDefault(require("fs"));

var _child_process = _interopRequireDefault(require("child_process"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const gzip = (0, _util.promisify)(_zlib.default.gzip);
exports.gzip = gzip;
const deflate = (0, _util.promisify)(_zlib.default.deflate);
exports.deflate = deflate;
const gunzip = (0, _util.promisify)(_zlib.default.gunzip);
exports.gunzip = gunzip;
const inflate = (0, _util.promisify)(_zlib.default.inflate);
exports.inflate = inflate;
const inflateRaw = (0, _util.promisify)(_zlib.default.inflateRaw);
exports.inflateRaw = inflateRaw;
const readDir = (0, _util.promisify)(_fs.default.readdir);
exports.readDir = readDir;
const readFile = (0, _util.promisify)(_fs.default.readFile);
exports.readFile = readFile;
const stat = (0, _util.promisify)(_fs.default.stat);
exports.stat = stat;
const access = (0, _util.promisify)(_fs.default.access);
exports.access = access;
const makeDir = (0, _util.promisify)(_fs.default.mkdir);
exports.makeDir = makeDir;
const writeFile = (0, _util.promisify)(_fs.default.writeFile);
exports.writeFile = writeFile;

const fsObjectExists = fsPath => stat(fsPath).then(() => true, () => false);

exports.fsObjectExists = fsObjectExists;
const exec = (0, _util.promisify)(_child_process.default.exec);
exports.exec = exec;