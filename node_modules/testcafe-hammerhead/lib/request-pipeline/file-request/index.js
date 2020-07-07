"use strict";

exports.__esModule = true;
exports.default = void 0;

var _mime = _interopRequireDefault(require("mime"));

var _events = require("events");

var _url = require("url");

var _messages = require("../../messages");

var _createResource = _interopRequireDefault(require("./create-resource"));

var _builtinHeaderNames = _interopRequireDefault(require("../builtin-header-names"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DISK_RE = /^\/[A-Za-z]:/;

class FileRequest extends _events.EventEmitter {
  constructor(url) {
    super();

    _defineProperty(this, "_url", void 0);

    _defineProperty(this, "_path", void 0);

    this._url = url;
    this._path = FileRequest._getPath(url);
  }

  async init() {
    const resource = await (0, _createResource.default)(this._path);
    if (resource.error) this._onError(resource.error);else this._onOpen(resource.contentStream);
  }

  static _getPath(proxiedUrl) {
    const parsedUrl = (0, _url.parse)(proxiedUrl); // @ts-ignore

    let path = decodeURIComponent(parsedUrl.pathname);
    if (DISK_RE.test(path)) path = path.substr(1);
    return path;
  }

  _onError(err) {
    this.emit('fatalError', (0, _messages.getText)(_messages.MESSAGE.cantReadFile, this._url, err.message));
  }

  _onOpen(contentStream) {
    let stream = contentStream;
    stream = Object.assign(stream, {
      statusCode: 200,
      trailers: {},
      headers: {
        [_builtinHeaderNames.default.contentType]: _mime.default.lookup(this._path)
      }
    });
    this.emit('response', stream);
  }

}

exports.default = FileRequest;
module.exports = exports.default;