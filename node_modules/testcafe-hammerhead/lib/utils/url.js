"use strict";

exports.__esModule = true;
exports.parseResourceType = parseResourceType;
exports.getResourceTypeString = getResourceTypeString;
exports.isSubDomain = isSubDomain;
exports.sameOriginCheck = sameOriginCheck;
exports.getURLString = getURLString;
exports.getProxyUrl = getProxyUrl;
exports.getDomain = getDomain;
exports.parseProxyUrl = parseProxyUrl;
exports.getPathname = getPathname;
exports.parseUrl = parseUrl;
exports.isSupportedProtocol = isSupportedProtocol;
exports.resolveUrlAsDest = resolveUrlAsDest;
exports.formatUrl = formatUrl;
exports.correctMultipleSlashes = correctMultipleSlashes;
exports.processSpecialChars = processSpecialChars;
exports.ensureTrailingSlash = ensureTrailingSlash;
exports.isSpecialPage = isSpecialPage;
exports.isRelativeUrl = isRelativeUrl;
exports.isValidUrl = isValidUrl;
exports.ensureOriginTrailingSlash = ensureOriginTrailingSlash;
exports.omitDefaultPort = omitDefaultPort;
exports.prepareUrl = prepareUrl;
exports.updateScriptImportUrls = updateScriptImportUrls;
exports.HTTPS_DEFAULT_PORT = exports.HTTP_DEFAULT_PORT = exports.SPECIAL_PAGES = exports.SPECIAL_ERROR_PAGE = exports.SPECIAL_BLANK_PAGE = exports.TRAILING_SLASH_RE = exports.REQUEST_DESCRIPTOR_SESSION_INFO_VALUES_SEPARATOR = exports.REQUEST_DESCRIPTOR_VALUES_SEPARATOR = exports.HASH_RE = exports.SUPPORTED_PROTOCOL_RE = void 0;

var _stringTrim = _interopRequireDefault(require("./string-trim"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------
const PROTOCOL_RE = /^([\w-]+?:)(\/\/|[^\\/]|$)/;
const LEADING_SLASHES_RE = /^(\/\/)/;
const HOST_RE = /^(.*?)(\/|%|\?|;|#|$)/;
const PORT_RE = /:([0-9]*)$/;
const QUERY_AND_HASH_RE = /(\?.+|#[^#]*)$/;
const PATH_AFTER_HOST_RE = /^\/([^/]+?)\/([\S\s]+)$/;
const HTTP_RE = /^(?:https?):/;
const FILE_RE = /^file:/i;
const SUPPORTED_PROTOCOL_RE = /^(?:https?|file):/i;
exports.SUPPORTED_PROTOCOL_RE = SUPPORTED_PROTOCOL_RE;
const HASH_RE = /^#/;
exports.HASH_RE = HASH_RE;
const REQUEST_DESCRIPTOR_VALUES_SEPARATOR = '!';
exports.REQUEST_DESCRIPTOR_VALUES_SEPARATOR = REQUEST_DESCRIPTOR_VALUES_SEPARATOR;
const REQUEST_DESCRIPTOR_SESSION_INFO_VALUES_SEPARATOR = '*';
exports.REQUEST_DESCRIPTOR_SESSION_INFO_VALUES_SEPARATOR = REQUEST_DESCRIPTOR_SESSION_INFO_VALUES_SEPARATOR;
const TRAILING_SLASH_RE = /\/$/;
exports.TRAILING_SLASH_RE = TRAILING_SLASH_RE;
const SPECIAL_BLANK_PAGE = 'about:blank';
exports.SPECIAL_BLANK_PAGE = SPECIAL_BLANK_PAGE;
const SPECIAL_ERROR_PAGE = 'about:error';
exports.SPECIAL_ERROR_PAGE = SPECIAL_ERROR_PAGE;
const SPECIAL_PAGES = [SPECIAL_BLANK_PAGE, SPECIAL_ERROR_PAGE];
exports.SPECIAL_PAGES = SPECIAL_PAGES;
const HTTP_DEFAULT_PORT = '80';
exports.HTTP_DEFAULT_PORT = HTTP_DEFAULT_PORT;
const HTTPS_DEFAULT_PORT = '443';
exports.HTTPS_DEFAULT_PORT = HTTPS_DEFAULT_PORT;
const SPECIAL_PAGE_DEST_RESOURCE_INFO = {
  protocol: 'about:',
  host: '',
  hostname: '',
  port: '',
  partAfterHost: ''
};

function parseResourceType(resourceType) {
  if (!resourceType) {
    return {
      isIframe: false,
      isForm: false,
      isScript: false,
      isEventSource: false,
      isHtmlImport: false,
      isWebSocket: false
    };
  }

  return {
    isIframe: /i/.test(resourceType),
    isForm: /f/.test(resourceType),
    isScript: /s/.test(resourceType),
    isEventSource: /e/.test(resourceType),
    isHtmlImport: /h/.test(resourceType),
    isWebSocket: /w/.test(resourceType)
  };
}

function getResourceTypeString(resourceType) {
  if (!resourceType) return null;
  if (!resourceType.isIframe && !resourceType.isForm && !resourceType.isScript && !resourceType.isEventSource && !resourceType.isHtmlImport && !resourceType.isWebSocket) return null;
  return [resourceType.isIframe ? 'i' : '', resourceType.isForm ? 'f' : '', resourceType.isScript ? 's' : '', resourceType.isEventSource ? 'e' : '', resourceType.isHtmlImport ? 'h' : '', resourceType.isWebSocket ? 'w' : ''].join('');
}

function isSubDomain(domain, subDomain) {
  domain = domain.replace(/^www./i, '');
  subDomain = subDomain.replace(/^www./i, '');
  if (domain === subDomain) return true;
  const index = subDomain.lastIndexOf(domain);
  return subDomain[index - 1] === '.' && subDomain.length === index + domain.length;
}

function sameOriginCheck(location, checkedUrl) {
  if (!checkedUrl) return true;
  const parsedLocation = parseUrl(location);
  const parsedCheckedUrl = parseUrl(checkedUrl);
  const parsedProxyLocation = parseProxyUrl(location);
  const parsedDestUrl = parsedProxyLocation ? parsedProxyLocation.destResourceInfo : parsedLocation;
  const isRelative = !parsedCheckedUrl.host;
  if (isRelative || parsedCheckedUrl.host === parsedLocation.host && parsedCheckedUrl.protocol === parsedLocation.protocol) return true;

  if (parsedDestUrl) {
    const portsEq = !parsedDestUrl.port && !parsedCheckedUrl.port || parsedDestUrl.port && parsedDestUrl.port.toString() === parsedCheckedUrl.port;
    return parsedDestUrl.protocol === parsedCheckedUrl.protocol && !!portsEq && parsedDestUrl.hostname === parsedCheckedUrl.hostname;
  }

  return false;
} // NOTE: Convert the destination protocol and hostname to the lower case. (GH-1)


function convertHostToLowerCase(url) {
  const parsedUrl = parseUrl(url);
  parsedUrl.protocol = parsedUrl.protocol && parsedUrl.protocol.toLowerCase();
  parsedUrl.host = parsedUrl.host && parsedUrl.host.toLowerCase();
  return formatUrl(parsedUrl);
}

function getURLString(url) {
  // TODO: fix it
  // eslint-disable-next-line no-undef
  if (url === null && /iPad|iPhone/i.test(window.navigator.userAgent)) return '';
  return String(url).replace(/\n|\t/g, '');
}

function getProxyUrl(url, opts) {
  const sessionInfo = [opts.sessionId];
  if (opts.windowId) sessionInfo.push(opts.windowId);
  const params = [sessionInfo.join(REQUEST_DESCRIPTOR_SESSION_INFO_VALUES_SEPARATOR)];
  if (opts.resourceType) params.push(opts.resourceType);
  if (opts.charset) params.push(opts.charset.toLowerCase());
  if (opts.reqOrigin) params.push(opts.reqOrigin);
  const descriptor = params.join(REQUEST_DESCRIPTOR_VALUES_SEPARATOR);
  const proxyProtocol = opts.proxyProtocol || 'http:';
  return `${proxyProtocol}//${opts.proxyHostname}:${opts.proxyPort}/${descriptor}/${convertHostToLowerCase(url)}`;
}

function getDomain(parsed) {
  return formatUrl({
    protocol: parsed.protocol,
    host: parsed.host,
    hostname: parsed.hostname,
    port: parsed.port
  });
}

function parseRequestDescriptor(desc) {
  const params = desc.split(REQUEST_DESCRIPTOR_VALUES_SEPARATOR);
  if (!params.length) return null;
  const sessionInfo = params[0].split(REQUEST_DESCRIPTOR_SESSION_INFO_VALUES_SEPARATOR);
  const sessionId = sessionInfo[0];
  const resourceType = params[1] || null;
  const resourceData = params[2] || null;
  const parsedDesc = {
    sessionId,
    resourceType
  };
  if (sessionInfo[1]) parsedDesc.windowId = sessionInfo[1];

  if (resourceType && resourceData) {
    const parsedResourceType = parseResourceType(resourceType);
    if (parsedResourceType.isScript) parsedDesc.charset = resourceData;else if (parsedResourceType.isWebSocket) parsedDesc.reqOrigin = decodeURIComponent(resourceData);
  }

  return parsedDesc;
}

function parseProxyUrl(proxyUrl) {
  // TODO: Remove it.
  const parsedUrl = parseUrl(proxyUrl);
  if (!parsedUrl.partAfterHost) return null;
  const match = parsedUrl.partAfterHost.match(PATH_AFTER_HOST_RE);
  if (!match) return null;
  const parsedDesc = parseRequestDescriptor(match[1]); // NOTE: We should have, at least, the job uid and the owner token.

  if (!parsedDesc) return null;
  let destUrl = match[2]; // Browser can redirect to a special page with hash (GH-1671)

  const destUrlWithoutHash = destUrl.replace(/#[\S\s]*$/, '');
  if (!isSpecialPage(destUrlWithoutHash) && !SUPPORTED_PROTOCOL_RE.test(destUrl)) return null;
  let destResourceInfo = null;
  if (isSpecialPage(destUrlWithoutHash)) destResourceInfo = SPECIAL_PAGE_DEST_RESOURCE_INFO;else {
    destUrl = omitDefaultPort(destUrl);
    destResourceInfo = parseUrl(destUrl);
  }
  return {
    destUrl,
    destResourceInfo,
    partAfterHost: parsedUrl.partAfterHost,
    proxy: {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port
    },
    sessionId: parsedDesc.sessionId,
    resourceType: parsedDesc.resourceType,
    charset: parsedDesc.charset,
    reqOrigin: parsedDesc.reqOrigin,
    windowId: parsedDesc.windowId
  };
}

function getPathname(path) {
  return path.replace(QUERY_AND_HASH_RE, '');
}

function parseUrl(url) {
  const parsed = {};
  url = processSpecialChars(url);
  if (!url) return parsed;
  url = (0, _stringTrim.default)(url); // Protocol

  let hasImplicitProtocol = false;
  const remainder = url.replace(PROTOCOL_RE, (_str, protocol, strAfterProtocol) => {
    parsed.protocol = protocol;
    return strAfterProtocol;
  }).replace(LEADING_SLASHES_RE, () => {
    hasImplicitProtocol = true;
    return '';
  }); // NOTE: the URL is relative.

  if (!parsed.protocol && !hasImplicitProtocol) {
    parsed.partAfterHost = url;
    return parsed;
  } // Host


  parsed.partAfterHost = remainder.replace(HOST_RE, (_str, host, restPartSeparator) => {
    parsed.host = host;
    parsed.port = '';
    return restPartSeparator;
  });

  if (typeof parsed.host === 'string') {
    const authHostArr = parsed.host.split('@');

    if (authHostArr.length === 2) {
      parsed.auth = authHostArr[0];
      parsed.host = authHostArr[1];
    }
  }

  parsed.hostname = parsed.host ? parsed.host.replace(PORT_RE, (_str, port) => {
    parsed.port = port;
    return '';
  }) : '';
  return parsed;
}

function isSupportedProtocol(url) {
  url = (0, _stringTrim.default)(url || '');
  const isHash = HASH_RE.test(url);
  if (isHash) return false;
  const protocol = url.match(PROTOCOL_RE);
  if (!protocol) return true;
  return SUPPORTED_PROTOCOL_RE.test(protocol[0]);
}

function resolveUrlAsDest(url, getProxyUrlMeth) {
  getProxyUrlMeth = getProxyUrlMeth || getProxyUrl;

  if (isSupportedProtocol(url)) {
    const proxyUrl = getProxyUrlMeth(url);
    const parsedProxyUrl = parseProxyUrl(proxyUrl);
    return parsedProxyUrl ? formatUrl(parsedProxyUrl.destResourceInfo) : url;
  }

  return url;
}

function formatUrl(parsedUrl) {
  // NOTE: the URL is relative.
  if (parsedUrl.protocol !== 'file:' && !parsedUrl.host && (!parsedUrl.hostname || !parsedUrl.port)) //@ts-ignore
    return parsedUrl.partAfterHost;
  let url = parsedUrl.protocol || '';
  if (parsedUrl.protocol !== 'about:') url += '//';
  if (parsedUrl.auth) url += parsedUrl.auth + '@';
  if (parsedUrl.host) url += parsedUrl.host;else {
    url += parsedUrl.hostname;
    if (parsedUrl.port) url += ':' + parsedUrl.port;
  }
  if (parsedUrl.partAfterHost) url += parsedUrl.partAfterHost;
  return url;
}

function correctMultipleSlashes(url, pageProtocol = '') {
  // NOTE: Remove unnecessary slashes from the beginning of the url and after scheme.
  // For example:
  // "//////example.com" -> "//example.com" (scheme-less HTTP(S) URL)
  // "////home/testcafe/documents" -> "///home/testcafe/documents" (scheme-less unix file URL)
  // "http:///example.com" -> "http://example.com"
  //
  // And add missing slashes after the file scheme.
  // "file://C:/document.txt" -> "file:///C:/document.txt"
  if (url.match(FILE_RE) || pageProtocol.match(FILE_RE)) {
    return url.replace(/^(file:)?\/+(\/\/\/.*$)/i, '$1$2').replace(/^(file:)?\/*([A-Za-z]):/i, '$1///$2:');
  }

  return url.replace(/^(https?:)?\/+(\/\/.*$)/i, '$1$2');
}

function processSpecialChars(url) {
  return correctMultipleSlashes(getURLString(url));
}

function ensureTrailingSlash(srcUrl, processedUrl) {
  if (!isValidUrl(processedUrl)) return processedUrl;
  const srcUrlEndsWithTrailingSlash = TRAILING_SLASH_RE.test(srcUrl);
  const processedUrlEndsWithTrailingSlash = TRAILING_SLASH_RE.test(processedUrl);
  if (srcUrlEndsWithTrailingSlash && !processedUrlEndsWithTrailingSlash) processedUrl += '/';else if (srcUrl && !srcUrlEndsWithTrailingSlash && processedUrlEndsWithTrailingSlash) processedUrl = processedUrl.replace(TRAILING_SLASH_RE, '');
  return processedUrl;
}

function isSpecialPage(url) {
  return SPECIAL_PAGES.indexOf(url) !== -1;
}

function isRelativeUrl(url) {
  const parsedUrl = parseUrl(url);
  return parsedUrl.protocol !== 'file:' && !parsedUrl.host;
}

function isValidPort(port) {
  const parsedPort = parseInt(port, 10);
  return parsedPort > 0 && parsedPort <= 65535;
}

function isValidUrl(url) {
  const parsedUrl = parseUrl(url);
  return parsedUrl.protocol === 'file:' || !!parsedUrl.hostname && (!parsedUrl.port || isValidPort(parsedUrl.port));
}

function ensureOriginTrailingSlash(url) {
  // NOTE: If you request an url containing only port, host and protocol
  // then browser adds the trailing slash itself.
  const parsedUrl = parseUrl(url);
  if (!parsedUrl.partAfterHost && HTTP_RE.test(parsedUrl.protocol)) return url + '/';
  return url;
}

function omitDefaultPort(url) {
  // NOTE: If you request an url containing default port
  // then browser remove this one itself.
  const parsedUrl = parseUrl(url);
  const hasDefaultPort = parsedUrl.protocol === 'https:' && parsedUrl.port === HTTPS_DEFAULT_PORT || parsedUrl.protocol === 'http:' && parsedUrl.port === HTTP_DEFAULT_PORT;

  if (hasDefaultPort) {
    parsedUrl.host = parsedUrl.hostname;
    parsedUrl.port = '';
    return formatUrl(parsedUrl);
  }

  return url;
}

function prepareUrl(url) {
  url = omitDefaultPort(url);
  url = ensureOriginTrailingSlash(url);
  return url;
}

function updateScriptImportUrls(cachedScript, serverInfo, sessionId, windowId) {
  const regExp = new RegExp('(' + serverInfo.protocol + '//' + serverInfo.hostname + ':(?:' + serverInfo.port + '|' + serverInfo.crossDomainPort + ')/)[^/' + REQUEST_DESCRIPTOR_VALUES_SEPARATOR + ']+', 'g');
  const pattern = '$1' + sessionId + (windowId ? REQUEST_DESCRIPTOR_SESSION_INFO_VALUES_SEPARATOR + windowId : '');
  return cachedScript.replace(regExp, pattern);
}