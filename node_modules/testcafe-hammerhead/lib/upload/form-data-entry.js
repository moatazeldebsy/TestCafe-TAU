"use strict";

exports.__esModule = true;
exports.default = void 0;

var bufferUtils = _interopRequireWildcard(require("../utils/buffer"));

var _builtinHeaderNames = _interopRequireDefault(require("../request-pipeline/builtin-header-names"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const INPUT_NAME_RE = /;\s*name="([^"]*)"/i;
const FILE_NAME_RE = /;\s*filename="([^"]*)"/i;
const HEADER_RE = /^(.+?):\s*(.*)$/;

class FormDataEntry {
  constructor() {
    _defineProperty(this, "_headers", new Map());

    _defineProperty(this, "body", []);

    _defineProperty(this, "name", '');

    _defineProperty(this, "fileName", '');
  }

  _parseContentDisposition(contentDisposition) {
    const inputNameMatch = contentDisposition.match(INPUT_NAME_RE);
    const fileNameMatch = contentDisposition.match(FILE_NAME_RE);
    this.name = inputNameMatch && inputNameMatch[1] || '';
    this.fileName = fileNameMatch && fileNameMatch[1] || '';
  }

  _setHeader(name, value, rawHeader) {
    if (!this._headers.has(name)) this._headers.set(name, {
      rawName: typeof rawHeader === 'string' ? rawHeader : name,
      value
    });else this._headers.get(name).value = value;
  }

  _setContentDisposition(name, fileName) {
    this.name = name;
    this.fileName = fileName;

    this._setHeader(_builtinHeaderNames.default.contentDisposition, `form-data; name="${name}"; filename="${fileName}"`);
  } // API


  addFileInfo(fileInfo, idx) {
    const file = fileInfo.files[idx];

    this._setContentDisposition(fileInfo.name, file.name);

    this.body = [Buffer.from(file.data, 'base64')];

    this._setHeader(_builtinHeaderNames.default.contentType, file.type);
  }

  setRawHeader(rawHeader) {
    const [, rawName = '', value = ''] = rawHeader.match(HEADER_RE);
    const name = rawName.toLowerCase();

    this._headers.set(name, {
      rawName,
      value
    });

    if (name === _builtinHeaderNames.default.contentDisposition) this._parseContentDisposition(value);
  }

  toBuffer() {
    const chunks = [];

    for (const {
      rawName,
      value
    } of this._headers.values()) {
      chunks.push(Buffer.from(`${rawName}: ${value}`));
      chunks.push(bufferUtils.CRLF);
    }

    chunks.push(bufferUtils.CRLF);
    return Buffer.concat(chunks.concat(this.body));
  }

  cloneWithRawHeaders() {
    const entry = new FormDataEntry();

    for (const [name, {
      rawName
    }] of this._headers) entry._setHeader(name, '', rawName);

    return entry;
  }

}

exports.default = FormDataEntry;
module.exports = exports.default;