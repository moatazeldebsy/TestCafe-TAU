"use strict";

exports.__esModule = true;
exports.process = process;

var _url = _interopRequireDefault(require("url"));

var _page = _interopRequireDefault(require("./page"));

var _manifest = _interopRequireDefault(require("./manifest"));

var _script = _interopRequireDefault(require("./script"));

var _stylesheet = _interopRequireDefault(require("./stylesheet"));

var urlUtil = _interopRequireWildcard(require("../../utils/url"));

var _encoding = require("../encoding");

var _os = require("os");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const IS_WIN = (0, _os.platform)() === 'win32';
const DISK_RE = /^[A-Za-z]:/;
const RESOURCE_PROCESSORS = [_page.default, _manifest.default, _script.default, _stylesheet.default];

function getResourceUrlReplacer(ctx) {
  return function (resourceUrl, resourceType, charsetAttrValue, baseUrl) {
    if (!urlUtil.isSupportedProtocol(resourceUrl) && !urlUtil.isSpecialPage(resourceUrl)) return resourceUrl;
    if (IS_WIN && ctx.dest.protocol === 'file:' && DISK_RE.test(resourceUrl)) resourceUrl = '/' + resourceUrl; // NOTE: Resolves base URLs without a protocol ('//google.com/path' for example).

    baseUrl = baseUrl ? _url.default.resolve(ctx.dest.url, baseUrl) : '';
    resourceUrl = urlUtil.processSpecialChars(resourceUrl);

    let resolvedUrl = _url.default.resolve(baseUrl || ctx.dest.url, resourceUrl);

    if (!urlUtil.isValidUrl(resolvedUrl)) return resourceUrl; // NOTE: Script or <link rel='preload' as='script'>

    const isScriptLike = urlUtil.parseResourceType(resourceType).isScript;
    const charsetStr = charsetAttrValue || isScriptLike && ctx.contentInfo.charset.get();
    resolvedUrl = urlUtil.ensureTrailingSlash(resourceUrl, resolvedUrl);
    if (!urlUtil.isValidUrl(resolvedUrl)) return resolvedUrl;
    return ctx.toProxyUrl(resolvedUrl, false, resourceType, charsetStr);
  };
}

async function process(ctx) {
  const body = ctx.destResBody;
  const contentInfo = ctx.contentInfo;
  const encoding = contentInfo.encoding;
  const charset = contentInfo.charset;
  const decoded = await (0, _encoding.decodeContent)(body, encoding, charset);

  for (const processor of RESOURCE_PROCESSORS) {
    if (processor.shouldProcessResource(ctx)) {
      const urlReplacer = getResourceUrlReplacer(ctx); // @ts-ignore: Cannot invoke an expression whose type lacks a call signature

      const processed = processor.processResource(decoded, ctx, charset, urlReplacer);
      if (processed === _page.default.RESTART_PROCESSING) return await process(ctx);
      return await (0, _encoding.encodeContent)(processed, encoding, charset);
    }
  }

  return body;
}