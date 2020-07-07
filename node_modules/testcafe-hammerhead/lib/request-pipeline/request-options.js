"use strict";

exports.__esModule = true;
exports.default = void 0;

var _builtinHeaderNames = _interopRequireDefault(require("./builtin-header-names"));

var headerTransforms = _interopRequireWildcard(require("./header-transforms"));

var _upload = require("../upload");

var _matchUrlWildcard = _interopRequireDefault(require("match-url-wildcard"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RequestOptions {
  constructor(ctx) {
    _defineProperty(this, "url", void 0);

    _defineProperty(this, "protocol", void 0);

    _defineProperty(this, "hostname", void 0);

    _defineProperty(this, "host", void 0);

    _defineProperty(this, "port", void 0);

    _defineProperty(this, "path", void 0);

    _defineProperty(this, "method", void 0);

    _defineProperty(this, "credentials", void 0);

    _defineProperty(this, "body", void 0);

    _defineProperty(this, "isAjax", void 0);

    _defineProperty(this, "rawHeaders", void 0);

    _defineProperty(this, "headers", void 0);

    _defineProperty(this, "auth", void 0);

    _defineProperty(this, "requestId", void 0);

    _defineProperty(this, "proxy", void 0);

    _defineProperty(this, "agent", void 0);

    _defineProperty(this, "ecdhCurve", void 0);

    _defineProperty(this, "rejectUnauthorized", void 0);

    const bodyWithUploads = (0, _upload.inject)(ctx.req.headers[_builtinHeaderNames.default.contentType], ctx.reqBody); // NOTE: First, we should rewrite the request body, because the 'content-length' header will be built based on it.

    if (bodyWithUploads) ctx.reqBody = bodyWithUploads; // NOTE: All headers, including 'content-length', are built here.

    const headers = headerTransforms.forRequest(ctx);
    const proxy = ctx.session.externalProxySettings;
    this.url = ctx.dest.url;
    this.protocol = ctx.dest.protocol;
    this.hostname = ctx.dest.hostname;
    this.host = ctx.dest.host;
    this.port = ctx.dest.port;
    this.path = ctx.dest.partAfterHost;
    this.auth = ctx.dest.auth;
    this.method = ctx.req.method;
    this.credentials = ctx.session.getAuthCredentials();
    this.body = ctx.reqBody;
    this.isAjax = ctx.isAjax;
    this.rawHeaders = ctx.req.rawHeaders;
    this.headers = headers;
    this.requestId = ctx.requestId;

    this._applyExternalProxySettings(proxy, ctx, headers);
  }

  _applyExternalProxySettings(proxy, ctx, headers) {
    if (!proxy || (0, _matchUrlWildcard.default)(ctx.dest.url, proxy.bypassRules)) return;
    this.proxy = proxy;

    if (ctx.dest.protocol === 'http:') {
      this.path = this.protocol + '//' + this.host + this.path;
      this.host = proxy.host;
      this.hostname = proxy.hostname;
      this.port = proxy.port;
      if (proxy.authHeader) headers[_builtinHeaderNames.default.proxyAuthorization] = proxy.authHeader;
    }
  }

}

exports.default = RequestOptions;
module.exports = exports.default;