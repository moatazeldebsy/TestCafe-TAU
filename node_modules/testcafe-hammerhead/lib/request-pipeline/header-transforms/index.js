"use strict";

exports.__esModule = true;
exports.forRequest = forRequest;
exports.forResponse = forResponse;
exports.transformHeadersCaseToRaw = transformHeadersCaseToRaw;
exports.setupPreventCachingHeaders = setupPreventCachingHeaders;

var _builtinHeaderNames = _interopRequireDefault(require("../builtin-header-names"));

var _transforms = require("./transforms");

var _http = require("../../utils/http");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformHeaders(srcHeaders, ctx, transformList, forcedTransforms) {
  const destHeaders = {};

  const applyTransform = function (headerName, headers, transforms) {
    const src = headers[headerName];
    const transform = transforms[headerName];
    const dest = transform ? transform(src, ctx) : src;
    if (dest !== void 0) destHeaders[headerName] = dest;
  };

  Object.keys(srcHeaders).forEach(headerName => applyTransform(headerName, srcHeaders, transformList));
  if (forcedTransforms) Object.keys(forcedTransforms).forEach(headerName => applyTransform(headerName, destHeaders, forcedTransforms));
  return destHeaders;
} // API


function forRequest(ctx) {
  return transformHeaders(ctx.req.headers, ctx, _transforms.requestTransforms, _transforms.forcedRequestTransforms);
}

function forResponse(ctx) {
  return transformHeaders(ctx.destRes.headers, ctx, _transforms.responseTransforms, _transforms.forcedResponseTransforms);
}

function transformHeadersCaseToRaw(headers, rawHeaders) {
  const processedHeaders = {};
  const headersNames = Object.keys(headers);

  for (let i = 0; i < rawHeaders.length; i += 2) {
    const rawHeaderName = rawHeaders[i];
    const headerName = rawHeaderName.toLowerCase();
    const headerIndex = headersNames.indexOf(headerName);

    if (headerIndex > -1) {
      processedHeaders[rawHeaderName] = headers[headerName];
      headersNames[headerIndex] = void 0;
    }
  }

  for (const headerName of headersNames) {
    if (headerName !== void 0) processedHeaders[headerName] = headers[headerName];
  }

  return processedHeaders;
}

function setupPreventCachingHeaders(headers) {
  headers[_builtinHeaderNames.default.cacheControl] = _http.PREVENT_CACHING_HEADERS[_builtinHeaderNames.default.cacheControl];
  headers[_builtinHeaderNames.default.pragma] = _http.PREVENT_CACHING_HEADERS[_builtinHeaderNames.default.pragma];
  delete headers[_builtinHeaderNames.default.eTag];
  delete headers[_builtinHeaderNames.default.expires];
}