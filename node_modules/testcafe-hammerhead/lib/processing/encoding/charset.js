"use strict";

exports.__esModule = true;
exports.default = void 0;

var _labels = _interopRequireDefault(require("./labels"));

var _buffer = require("../../utils/buffer");

var _builtinHeaderNames = _interopRequireDefault(require("../../request-pipeline/builtin-header-names"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const CHARSET_RE = /(?:^|;)\s*charset=(.+)(?:;|$)/i;
const META_CHARSET_RE = /charset ?= ?['"]?([^ ;"']*)['"]?/i; // NOTE: HTTP 1.1 specifies ISO-8859-1 as the default charset
// (see: http://www.w3.org/International/O-HTTP-charset.en.php).

const DEFAULT_CHARSET = 'iso-8859-1';
const CHARSET_BOM_LIST = [{
  charset: 'utf-8',
  bom: Buffer.from([0xEF, 0xBB, 0xBF])
}, {
  charset: 'utf-16le',
  bom: Buffer.from([0xFF, 0xFE])
}, {
  charset: 'utf-16be',
  bom: Buffer.from([0xFE, 0xFF])
}];
var CharsetPriority;

(function (CharsetPriority) {
  CharsetPriority[CharsetPriority["BOM"] = 3] = "BOM";
  CharsetPriority[CharsetPriority["CONTENT_TYPE"] = 2] = "CONTENT_TYPE";
  CharsetPriority[CharsetPriority["URL"] = 1] = "URL";
  CharsetPriority[CharsetPriority["META"] = 1] = "META";
  CharsetPriority[CharsetPriority["DEFAULT"] = 0] = "DEFAULT";
})(CharsetPriority || (CharsetPriority = {}));

class Charset {
  constructor() {
    _defineProperty(this, "charset", DEFAULT_CHARSET);

    _defineProperty(this, "priority", CharsetPriority.DEFAULT);
  }

  set(charset, priority) {
    if (charset && this.charset !== charset && this.priority <= priority) {
      this.charset = charset;
      this.priority = priority;
      return true;
    }

    return false;
  }

  get() {
    return this.charset;
  }

  isFromBOM() {
    return this.priority === CharsetPriority.BOM;
  }

  fromBOM(resBuf) {
    for (let i = 0; i < CHARSET_BOM_LIST.length; i++) {
      if ((0, _buffer.startsWith)(resBuf, CHARSET_BOM_LIST[i].bom)) return this.set(CHARSET_BOM_LIST[i].charset, CharsetPriority.BOM);
    }

    return false;
  }

  fromContentType(contentTypeHeader) {
    if (this.priority <= CharsetPriority.CONTENT_TYPE) {
      const charsetMatch = contentTypeHeader && contentTypeHeader.match(CHARSET_RE);
      const charset = charsetMatch && charsetMatch[1];
      return this.set((0, _labels.default)(charset), CharsetPriority.CONTENT_TYPE);
    }

    return false;
  }

  fromUrl(charsetFromUrl) {
    if (charsetFromUrl && this.priority <= CharsetPriority.URL) return this.set((0, _labels.default)(charsetFromUrl), CharsetPriority.URL);
    return false;
  } // NOTE: Parsing charset from meta tags
  // www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#determining-the-character-encoding
  // Each <meta> descriptor should contain values of the "http-equiv", "content" and "charset" attributes.


  fromMeta(metas) {
    if (this.priority < CharsetPriority.META && metas.length) {
      let needPragma = null;
      let charsetStr = null;
      metas.forEach(attrs => {
        const shouldParseFromContentAttr = needPragma !== false && attrs.content && attrs.httpEquiv && attrs.httpEquiv.toLowerCase() === _builtinHeaderNames.default.contentType;

        if (shouldParseFromContentAttr) {
          const charsetMatch = attrs.content.match(META_CHARSET_RE);

          if (charsetMatch) {
            needPragma = true;
            charsetStr = charsetMatch[1];
          }
        }

        if (attrs.charset) {
          needPragma = false;
          charsetStr = attrs.charset;
        }
      });
      return this.set((0, _labels.default)(charsetStr), CharsetPriority.META);
    }

    return false;
  }

}

exports.default = Charset;
module.exports = exports.default;