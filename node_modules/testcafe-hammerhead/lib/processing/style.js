"use strict";

exports.__esModule = true;
exports.default = void 0;

var _regexpEscape = _interopRequireDefault(require("../utils/regexp-escape"));

var _internalAttributes = _interopRequireDefault(require("../processing/dom/internal-attributes"));

var _url = require("../utils/url");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const SOURCE_MAP_RE = /(?:\/\*\s*(?:#|@)\s*sourceMappingURL\s*=[\s\S]*?\*\/)|(?:\/\/[\t ]*(?:#|@)[\t ]*sourceMappingURL[\t ]*=.*)/ig;
const CSS_URL_PROPERTY_VALUE_PATTERN = /(url\s*\(\s*)(?:(')([^\s']*)(')|(")([^\s"]*)(")|([^\s)]*))(\s*\))|(@import\s+)(?:(')([^\s']*)(')|(")([^\s"]*)("))/g;
const STYLESHEET_PROCESSING_START_COMMENT = '/*hammerhead|stylesheet|start*/';
const STYLESHEET_PROCESSING_END_COMMENT = '/*hammerhead|stylesheet|end*/';
const HOVER_PSEUDO_CLASS_RE = /\s*:\s*hover(\W)/gi;
const PSEUDO_CLASS_RE = new RegExp(`\\[${_internalAttributes.default.hoverPseudoClass}\\](\\W)`, 'ig');
const IS_STYLE_SHEET_PROCESSED_RE = new RegExp(`\\s*${(0, _regexpEscape.default)(STYLESHEET_PROCESSING_START_COMMENT)}`, 'gi');
const STYLESHEET_PROCESSING_COMMENTS_RE = new RegExp(`\\s*${(0, _regexpEscape.default)(STYLESHEET_PROCESSING_START_COMMENT)}\n?|` + `\n?${(0, _regexpEscape.default)(STYLESHEET_PROCESSING_END_COMMENT)}\\s*`, 'gi');

class StyleProcessor {
  constructor() {
    _defineProperty(this, "STYLESHEET_PROCESSING_START_COMMENT", STYLESHEET_PROCESSING_START_COMMENT);

    _defineProperty(this, "STYLESHEET_PROCESSING_END_COMMENT", STYLESHEET_PROCESSING_END_COMMENT);
  }

  process(css, urlReplacer, isStylesheetTable) {
    if (!css || typeof css !== 'string' || IS_STYLE_SHEET_PROCESSED_RE.test(css)) return css;
    const prefix = isStylesheetTable ? STYLESHEET_PROCESSING_START_COMMENT + '\n' : '';
    const postfix = isStylesheetTable ? '\n' + STYLESHEET_PROCESSING_END_COMMENT : ''; // NOTE: Replace the :hover pseudo-class.

    css = css.replace(HOVER_PSEUDO_CLASS_RE, '[' + _internalAttributes.default.hoverPseudoClass + ']$1'); // NOTE: Remove all 'source map' directives.

    css = css.replace(SOURCE_MAP_RE, ''); // NOTE: Replace URLs in CSS rules with proxy URLs.

    return prefix + this._replaceStylsheetUrls(css, urlReplacer) + postfix;
  }

  cleanUp(css, parseProxyUrl) {
    if (typeof css !== 'string') return css;
    css = css.replace(PSEUDO_CLASS_RE, ':hover$1').replace(STYLESHEET_PROCESSING_COMMENTS_RE, '');
    return this._replaceStylsheetUrls(css, url => {
      const parsedProxyUrl = parseProxyUrl(url);
      return parsedProxyUrl ? parsedProxyUrl.destUrl : url;
    });
  }

  _replaceStylsheetUrls(css, processor) {
    return css.replace(CSS_URL_PROPERTY_VALUE_PATTERN, (match, prefix1, openQuote1, url1, closeQuote1, openQuote2, url2, closeQuote2, url3, postfix, prefix2, openQuote3, url4, closeQuote3, openQuote4, url5, closeQuote4) => {
      const prefix = prefix1 || prefix2;
      const openQuote = openQuote1 || openQuote2 || openQuote3 || openQuote4 || '';
      const url = url1 || url2 || url3 || url4 || url5;
      const closeQuote = closeQuote1 || closeQuote2 || closeQuote3 || closeQuote4 || '';
      postfix = postfix || '';
      const processedUrl = (0, _url.isSpecialPage)(url) ? url : processor(url);
      return url ? prefix + openQuote + processedUrl + closeQuote + postfix : match;
    });
  }

}

var _default = new StyleProcessor();

exports.default = _default;
module.exports = exports.default;