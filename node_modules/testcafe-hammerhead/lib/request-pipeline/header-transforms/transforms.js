"use strict";

exports.__esModule = true;
exports.processSetCookieHeader = processSetCookieHeader;
exports.forcedResponseTransforms = exports.responseTransforms = exports.forcedRequestTransforms = exports.requestTransforms = void 0;

var _builtinHeaderNames = _interopRequireDefault(require("../builtin-header-names"));

var _internalHeaderNames = _interopRequireDefault(require("../internal-header-names"));

var urlUtils = _interopRequireWildcard(require("../../utils/url"));

var _url2 = require("url");

var _sameOriginPolicy = require("../xhr/same-origin-policy");

var _cookie = require("../../utils/cookie");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function skip() {
  return void 0;
}

function skipIfStateSnapshotIsApplied(src, ctx) {
  return ctx.restoringStorages ? void 0 : src;
}

function transformAuthorizationHeader(src, ctx) {
  return (0, _sameOriginPolicy.shouldOmitCredentials)(ctx) ? void 0 : src;
}

function generateSyncCookie(ctx, parsedServerCookies) {
  parsedServerCookies = parsedServerCookies.filter(cookie => !cookie.httpOnly);
  let syncWithClientCookies = parsedServerCookies.map(cookie => {
    cookie.isServerSync = true;
    cookie.sid = ctx.session.id;
    return (0, _cookie.formatSyncCookie)(cookie);
  });

  if (ctx.parsedClientSyncCookie) {
    const outdatedSyncCookies = ctx.parsedClientSyncCookie.actual.filter(clientCookie => {
      if (clientCookie.isClientSync && !clientCookie.isWindowSync) return true;

      for (const serverCookie of parsedServerCookies) {
        if ((0, _cookie.isOutdatedSyncCookie)(clientCookie, serverCookie)) return true;
      }

      return false;
    });
    syncWithClientCookies = ctx.parsedClientSyncCookie.outdated.concat(outdatedSyncCookies).map(_cookie.generateDeleteSyncCookieStr).concat(syncWithClientCookies);
  }

  return syncWithClientCookies;
}

function resolveAndGetProxyUrl(url, ctx) {
  url = urlUtils.prepareUrl(url);
  const {
    host
  } = (0, _url2.parse)(url);
  let isCrossDomain = false;
  if (!host) url = (0, _url2.resolve)(ctx.dest.url, url);

  if (ctx.isIframe && ctx.dest.referer) {
    const isCrossDomainLocationBeforeRedirect = !urlUtils.sameOriginCheck(ctx.dest.referer, ctx.dest.url);
    const isCrossDomainLocationAfterRedirect = !urlUtils.sameOriginCheck(ctx.dest.referer, url);
    isCrossDomain = isCrossDomainLocationBeforeRedirect !== isCrossDomainLocationAfterRedirect;
  }

  return ctx.toProxyUrl(url, isCrossDomain, ctx.contentInfo.contentTypeUrlToken);
}

function transformRefreshHeader(src, ctx) {
  return src.replace(/(url=)(.*)$/i, (_match, prefix, url) => prefix + resolveAndGetProxyUrl(url, ctx));
}

function processSetCookieHeader(src, ctx) {
  let parsedCookies = src && !(0, _sameOriginPolicy.shouldOmitCredentials)(ctx) ? ctx.session.cookies.setByServer(ctx.dest.url, src) : [];
  return generateSyncCookie(ctx, parsedCookies);
} // Request headers


const requestTransforms = {
  [_builtinHeaderNames.default.host]: (_src, ctx) => ctx.dest.host,
  [_builtinHeaderNames.default.referer]: (_src, ctx) => ctx.dest.referer || void 0,
  [_builtinHeaderNames.default.origin]: (src, ctx) => ctx.dest.reqOrigin || src,
  [_builtinHeaderNames.default.contentLength]: (_src, ctx) => ctx.reqBody.length,
  [_builtinHeaderNames.default.cookie]: skip,
  [_builtinHeaderNames.default.ifModifiedSince]: skipIfStateSnapshotIsApplied,
  [_builtinHeaderNames.default.ifNoneMatch]: skipIfStateSnapshotIsApplied,
  [_builtinHeaderNames.default.authorization]: transformAuthorizationHeader,
  [_builtinHeaderNames.default.proxyAuthorization]: transformAuthorizationHeader,
  [_internalHeaderNames.default.origin]: skip,
  [_internalHeaderNames.default.credentials]: skip,
  [_internalHeaderNames.default.authorization]: skip,
  [_internalHeaderNames.default.proxyAuthorization]: skip
};
exports.requestTransforms = requestTransforms;
const forcedRequestTransforms = {
  [_builtinHeaderNames.default.cookie]: (_src, ctx) => (0, _sameOriginPolicy.shouldOmitCredentials)(ctx) ? void 0 : ctx.session.cookies.getHeader(ctx.dest.url) || void 0,
  // NOTE: All browsers except Chrome don't send the 'Origin' header in case of the same domain XHR requests.
  // So, if the request is actually cross-domain, we need to force the 'Origin' header to support CORS. (B234325)
  [_builtinHeaderNames.default.origin]: (src, ctx) => {
    const force = ctx.isAjax && !src && ctx.dest.domain !== ctx.dest.reqOrigin;
    return force ? ctx.dest.reqOrigin : src;
  },
  [_builtinHeaderNames.default.authorization]: (_src, ctx) => ctx.req.headers[_internalHeaderNames.default.authorization],
  [_builtinHeaderNames.default.proxyAuthorization]: (_src, ctx) => ctx.req.headers[_internalHeaderNames.default.proxyAuthorization]
}; // Response headers

exports.forcedRequestTransforms = forcedRequestTransforms;
const responseTransforms = {
  // NOTE: Disable Content Security Policy (see http://en.wikipedia.org/wiki/Content_Security_Policy).
  [_builtinHeaderNames.default.contentSecurityPolicy]: skip,
  [_builtinHeaderNames.default.contentSecurityPolicyReportOnly]: skip,
  [_builtinHeaderNames.default.xContentSecurityPolicy]: skip,
  [_builtinHeaderNames.default.xContentSecurityPolicyReportOnly]: skip,
  [_builtinHeaderNames.default.xWebkitCsp]: skip,
  // NOTE: Even if we are not able to be authorized, we should prevent showing the native credentials window.
  [_builtinHeaderNames.default.wwwAuthenticate]: skip,
  [_builtinHeaderNames.default.proxyAuthenticate]: skip,
  // NOTE: We perform CORS checks on our side, so we skip the related headers.
  [_builtinHeaderNames.default.accessControlAllowOrigin]: skip,
  // NOTE: Change the transform type if we have an iframe with an image as src,
  // because it was transformed to HTML with the image tag.
  [_builtinHeaderNames.default.contentType]: (src, ctx) => ctx.contentInfo.isIframeWithImageSrc ? 'text/html' : src,
  [_builtinHeaderNames.default.contentLength]: (src, ctx) => ctx.contentInfo.requireProcessing ? ctx.destResBody.length.toString() : src,
  [_builtinHeaderNames.default.location]: (src, ctx) => {
    // NOTE: The RFC 1945 standard requires location URLs to be absolute. However, most popular browsers
    // accept relative URLs. We transform relative URLs to absolute to correctly handle this situation.
    if (ctx.contentInfo.isRedirect) return resolveAndGetProxyUrl(src, ctx);
    return src;
  },
  [_builtinHeaderNames.default.xFrameOptions]: (src, ctx) => {
    const cspHeader = ctx.destRes.headers[_builtinHeaderNames.default.contentSecurityPolicy];
    if (cspHeader && cspHeader.includes('frame-ancestors ')) return void 0;
    if (!src.includes('ALLOW-FROM')) return src;
    src = src.replace('ALLOW-FROM', '').trim();
    const isCrossDomain = ctx.isIframe && !urlUtils.sameOriginCheck(ctx.dest.url, src);
    const proxiedUrl = ctx.toProxyUrl(src, isCrossDomain, ctx.contentInfo.contentTypeUrlToken);
    return 'ALLOW-FROM ' + proxiedUrl;
  },
  [_builtinHeaderNames.default.sourceMap]: skip,
  [_builtinHeaderNames.default.referrerPolicy]: () => 'unsafe-url',
  [_builtinHeaderNames.default.refresh]: (src, ctx) => transformRefreshHeader(src, ctx),
  [_builtinHeaderNames.default.link]: src => {
    if (/[;\s]rel=\s*prefetch/i.test(src)) return void 0;
    return src;
  }
};
exports.responseTransforms = responseTransforms;
const forcedResponseTransforms = {
  [_builtinHeaderNames.default.setCookie]: processSetCookieHeader,
  [_internalHeaderNames.default.wwwAuthenticate]: (_src, ctx) => ctx.destRes.headers[_builtinHeaderNames.default.wwwAuthenticate],
  [_internalHeaderNames.default.proxyAuthenticate]: (_src, ctx) => ctx.destRes.headers[_builtinHeaderNames.default.proxyAuthenticate]
};
exports.forcedResponseTransforms = forcedResponseTransforms;