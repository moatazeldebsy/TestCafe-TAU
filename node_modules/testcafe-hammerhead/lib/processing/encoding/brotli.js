"use strict";

exports.__esModule = true;
exports.brotliCompress = brotliCompress;
exports.brotliDecompress = brotliDecompress;

var _zlib = _interopRequireDefault(require("zlib"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NOTE: Brotli encoding support was backported to the 10.x Node.js version (starts from 10.16).
// https://github.com/nodejs/node/pull/24938
// However, we can't remove the 'brotli' module right now to not make trouble customers with versions from 10.0 to 10.15.
// We will remove the 'brotli' module after 10.x version support is ended (2021-04-30)
const hasBuiltInBrotliSupport = ('brotliCompress' in _zlib.default); // @ts-ignore

const builtInBrotliCompress = hasBuiltInBrotliSupport ? (0, _util.promisify)(_zlib.default.brotliCompress) : null; // @ts-ignore

const builtInBrotliDecompress = hasBuiltInBrotliSupport ? (0, _util.promisify)(_zlib.default.brotliDecompress) : null;

function brotliCompress(data) {
  return hasBuiltInBrotliSupport ? builtInBrotliCompress(data) : Buffer.from(require('brotli').compress(data));
}

function brotliDecompress(data) {
  return hasBuiltInBrotliSupport ? builtInBrotliDecompress(data) : Buffer.from(require('brotli').decompress(data));
}