"use strict";

exports.__esModule = true;
exports.default = void 0;

var _internalAttributes = _interopRequireDefault(require("../processing/dom/internal-attributes"));

var _formDataEntry = _interopRequireDefault(require("./form-data-entry"));

var bufferUtils = _interopRequireWildcard(require("../utils/buffer"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const BOUNDARY_RE = /;\s*boundary=([^;]*)/i;
var ParserState;

(function (ParserState) {
  ParserState[ParserState["inPreamble"] = 0] = "inPreamble";
  ParserState[ParserState["inHeaders"] = 1] = "inHeaders";
  ParserState[ParserState["inBody"] = 2] = "inBody";
  ParserState[ParserState["inEpilogue"] = 3] = "inEpilogue";
})(ParserState || (ParserState = {}));

class FormData {
  constructor() {
    _defineProperty(this, "boundary", null);

    _defineProperty(this, "_boundaryEnd", null);

    _defineProperty(this, "_epilogue", []);

    _defineProperty(this, "_entries", []);

    _defineProperty(this, "_preamble", []);
  }

  _removeEntry(name) {
    this._entries = this._entries.filter(entry => entry.name !== name);
  }

  _injectFileInfo(fileInfo) {
    const entries = this._getEntriesByName(fileInfo.name);

    let previousEntry = null;

    for (let idx = 0; idx < fileInfo.files.length; idx++) {
      let entry = entries[idx];

      if (!entry) {
        entry = previousEntry ? previousEntry.cloneWithRawHeaders() : new _formDataEntry.default();

        this._entries.push(entry);
      }

      previousEntry = entry;
      entry.addFileInfo(fileInfo, idx);
    }
  }

  _isBoundary(line) {
    return this.boundary.equals(line);
  }

  _isBoundaryEnd(line) {
    return this._boundaryEnd.equals(line);
  }

  _getEntriesByName(name) {
    return this._entries.reduce((found, entry) => {
      if (entry.name === name) found.push(entry);
      return found;
    }, []);
  }

  expandUploads() {
    const uploadsEntry = this._getEntriesByName(_internalAttributes.default.uploadInfoHiddenInputName)[0];

    if (uploadsEntry) {
      const body = Buffer.concat(uploadsEntry.body).toString();
      const files = JSON.parse(body);

      this._removeEntry(_internalAttributes.default.uploadInfoHiddenInputName);

      files.forEach(fileInfo => this._injectFileInfo(fileInfo));
    }
  }

  parseContentTypeHeader(header) {
    header = String(header);

    if (header.includes('multipart/form-data')) {
      const boundaryMatch = header.match(BOUNDARY_RE);
      const token = boundaryMatch && boundaryMatch[1];

      if (token) {
        this.boundary = Buffer.from('--' + token);
        this._boundaryEnd = Buffer.from('--' + token + '--');
      }
    }
  }

  parseBody(body) {
    let state = ParserState.inPreamble;
    const lines = bufferUtils.createLineIterator(body);
    let currentEntry = null;

    for (const line of lines) {
      if (this._isBoundary(line)) {
        if (currentEntry) this._entries.push(currentEntry);
        state = ParserState.inHeaders;
        currentEntry = new _formDataEntry.default();
      } else if (this._isBoundaryEnd(line)) {
        if (currentEntry) this._entries.push(currentEntry);
        state = ParserState.inEpilogue;
      } else if (state === ParserState.inPreamble) bufferUtils.appendLine(this._preamble, line);else if (state === ParserState.inHeaders) {
        if (line.length) currentEntry.setRawHeader(line.toString());else state = ParserState.inBody;
      } else if (state === ParserState.inEpilogue) bufferUtils.appendLine(this._epilogue, line);else if (state === ParserState.inBody) bufferUtils.appendLine(currentEntry.body, line);
    }
  }

  toBuffer() {
    if (!this._boundaryEnd || !this.boundary) return null;
    let chunks = this._preamble;
    if (chunks.length) chunks.push(bufferUtils.CRLF);

    for (const entry of this._entries) {
      chunks.push(this.boundary, bufferUtils.CRLF, entry.toBuffer(), bufferUtils.CRLF);
    }

    chunks.push(this._boundaryEnd, bufferUtils.CRLF);
    chunks = chunks.concat(this._epilogue);
    return Buffer.concat(chunks);
  }

}

exports.default = FormData;
module.exports = exports.default;