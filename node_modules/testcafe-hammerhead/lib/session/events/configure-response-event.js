"use strict";

exports.__esModule = true;
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ConfigureResponseEvent {
  constructor(requestContext, requestFilterRule, opts) {
    _defineProperty(this, "_requestContext", void 0);

    _defineProperty(this, "_requestFilterRule", void 0);

    _defineProperty(this, "opts", void 0);

    this._requestContext = requestContext;
    this._requestFilterRule = requestFilterRule;
    this.opts = opts;
  }

  setHeader(name, value) {
    this._requestContext.destRes.headers[name.toLowerCase()] = value;
  }

  removeHeader(name) {
    delete this._requestContext.destRes.headers[name.toLowerCase()];
  }

}

exports.default = ConfigureResponseEvent;
module.exports = exports.default;