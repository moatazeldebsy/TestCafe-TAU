"use strict";

exports.__esModule = true;
exports.PreparedResponseInfo = exports.ResponseInfo = exports.RequestInfo = void 0;

var _sameOriginCheckFailedStatusCode = _interopRequireDefault(require("../../request-pipeline/xhr/same-origin-check-failed-status-code"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RequestInfo {
  constructor(ctx) {
    _defineProperty(this, "requestId", void 0);

    _defineProperty(this, "userAgent", void 0);

    _defineProperty(this, "url", void 0);

    _defineProperty(this, "method", void 0);

    _defineProperty(this, "isAjax", void 0);

    _defineProperty(this, "headers", void 0);

    _defineProperty(this, "body", void 0);

    _defineProperty(this, "sessionId", void 0);

    this.requestId = ctx.requestId;
    this.userAgent = ctx.reqOpts.headers['user-agent'] || '';
    this.url = ctx.reqOpts.url;
    this.method = ctx.reqOpts.method.toLowerCase();
    this.isAjax = ctx.isAjax;
    this.headers = ctx.reqOpts.headers;
    this.body = ctx.reqOpts.body;
    this.sessionId = ctx.session.id;
  }

}

exports.RequestInfo = RequestInfo;

class ResponseInfo {
  constructor(ctx) {
    _defineProperty(this, "requestId", void 0);

    _defineProperty(this, "statusCode", void 0);

    _defineProperty(this, "sessionId", void 0);

    _defineProperty(this, "headers", void 0);

    _defineProperty(this, "body", void 0);

    this.requestId = ctx.requestId;
    this.headers = ctx.destRes.headers;
    this.body = ctx.nonProcessedDestResBody;
    this.statusCode = ctx.isSameOriginPolicyFailed ? _sameOriginCheckFailedStatusCode.default : ctx.destRes.statusCode;
    this.sessionId = ctx.session.id;
  }

}

exports.ResponseInfo = ResponseInfo;

class PreparedResponseInfo {
  constructor(responseInfo, opts) {
    _defineProperty(this, "requestId", void 0);

    _defineProperty(this, "statusCode", void 0);

    _defineProperty(this, "sessionId", void 0);

    _defineProperty(this, "headers", void 0);

    _defineProperty(this, "body", void 0);

    this.requestId = responseInfo.requestId;
    this.statusCode = responseInfo.statusCode;
    this.sessionId = responseInfo.sessionId;
    if (opts.includeHeaders) this.headers = responseInfo.headers;
    if (opts.includeBody) this.body = responseInfo.body;
  }

}

exports.PreparedResponseInfo = PreparedResponseInfo;