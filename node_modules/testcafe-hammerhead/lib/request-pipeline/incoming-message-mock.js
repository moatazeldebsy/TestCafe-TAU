"use strict";

exports.__esModule = true;
exports.default = void 0;

var _stream = require("stream");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

;

class IncomingMessageMock extends _stream.Readable {
  constructor(init) {
    super();

    _defineProperty(this, "_body", void 0);

    _defineProperty(this, "headers", void 0);

    _defineProperty(this, "trailers", void 0);

    _defineProperty(this, "statusCode", void 0);

    this.headers = init.headers;
    this.trailers = init.trailers;
    this.statusCode = init.statusCode;
    this._body = this._getBody(init._body);
  }

  _read() {
    this.push(this._body);
    this._body = null;
  }

  _getBody(body) {
    if (!body) return Buffer.alloc(0);else if (body instanceof Buffer) return body;
    const bodyStr = typeof body === 'object' ? JSON.stringify(body) : String(body);
    return Buffer.from(bodyStr);
  }

}

exports.default = IncomingMessageMock;
module.exports = exports.default;