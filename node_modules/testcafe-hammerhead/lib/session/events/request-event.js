"use strict";

exports.__esModule = true;
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RequestEvent {
  constructor(requestContext, requestFilterRule, requestInfo) {
    _defineProperty(this, "_requestContext", void 0);

    _defineProperty(this, "_requestFilterRule", void 0);

    _defineProperty(this, "_requestInfo", void 0);

    this._requestContext = requestContext;
    this._requestFilterRule = requestFilterRule;
    this._requestInfo = requestInfo;
  }

  setMock(mock) {
    this._requestContext.session.setMock(this._requestFilterRule, mock);
  }

  get requestOptions() {
    return this._requestContext.reqOpts;
  }

  get isAjax() {
    return this._requestInfo.isAjax;
  }

}

exports.default = RequestEvent;
module.exports = exports.default;