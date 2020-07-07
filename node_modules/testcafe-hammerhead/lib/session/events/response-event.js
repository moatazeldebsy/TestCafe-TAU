"use strict";

exports.__esModule = true;
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ResponseEvent {
  constructor(requestFilterRule, preparedResponseInfo) {
    _defineProperty(this, "_requestFilterRule", void 0);

    _defineProperty(this, "requestId", void 0);

    _defineProperty(this, "statusCode", void 0);

    _defineProperty(this, "sessionId", void 0);

    _defineProperty(this, "headers", void 0);

    _defineProperty(this, "body", void 0);

    this._requestFilterRule = requestFilterRule;
    this.requestId = preparedResponseInfo.requestId;
    this.statusCode = preparedResponseInfo.statusCode;
    this.sessionId = preparedResponseInfo.sessionId;
    if (preparedResponseInfo.headers) this.headers = preparedResponseInfo.headers;
    if (preparedResponseInfo.body) this.body = preparedResponseInfo.body;
  }

}

exports.default = ResponseEvent;
module.exports = exports.default;