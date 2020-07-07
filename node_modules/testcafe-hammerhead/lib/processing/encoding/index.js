"use strict";

exports.__esModule = true;
exports.decodeContent = decodeContent;
exports.encodeContent = encodeContent;

var _zlib = _interopRequireDefault(require("zlib"));

var _promisifiedFunctions = require("../../utils/promisified-functions");

var _brotli = require("./brotli");

var _iconvLite = _interopRequireDefault(require("iconv-lite"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GZIP_CONTENT_ENCODING = 'gzip';
const DEFLATE_CONTENT_ENCODING = 'deflate';
const BROTLI_CONTENT_ENCODING = 'br'; // NOTE: IIS has a bug when it sends 'raw deflate' compressed data for the 'Deflate' Accept-Encoding header.
// (see: http://zoompf.com/2012/02/lose-the-wait-http-compression)

async function inflateWithFallback(data) {
  try {
    return await (0, _promisifiedFunctions.inflate)(data);
  } catch (err) {
    if (err.code === 'Z_DATA_ERROR') return await (0, _promisifiedFunctions.inflateRaw)(data);
    throw err;
  }
}

async function decodeContent(content, encoding, charset) {
  if (encoding === GZIP_CONTENT_ENCODING) {
    // NOTE: https://github.com/request/request/pull/2492/files
    // Be more lenient with decoding compressed responses, since (very rarely)
    // servers send slightly invalid gzip responses that are still accepted
    // by common browsers.
    // Always using Z_SYNC_FLUSH is what cURL does.
    // GH-1915
    content = await (0, _promisifiedFunctions.gunzip)(content, {
      flush: _zlib.default.Z_SYNC_FLUSH,
      finishFlush: _zlib.default.Z_SYNC_FLUSH
    });
  } else if (encoding === DEFLATE_CONTENT_ENCODING) content = await inflateWithFallback(content);else if (encoding === BROTLI_CONTENT_ENCODING) content = await (0, _brotli.brotliDecompress)(content);

  charset.fromBOM(content);
  return _iconvLite.default.decode(content, charset.get());
}

async function encodeContent(content, encoding, charset) {
  const encodedContent = _iconvLite.default.encode(content, charset.get(), {
    addBOM: charset.isFromBOM()
  });

  if (encoding === GZIP_CONTENT_ENCODING) return (0, _promisifiedFunctions.gzip)(encodedContent);
  if (encoding === DEFLATE_CONTENT_ENCODING) return (0, _promisifiedFunctions.deflate)(encodedContent);
  if (encoding === BROTLI_CONTENT_ENCODING) return (0, _brotli.brotliCompress)(encodedContent);
  return encodedContent;
}