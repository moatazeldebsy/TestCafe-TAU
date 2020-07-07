"use strict";

exports.__esModule = true;
exports.default = void 0;

var _baseResource = _interopRequireDefault(require("./base-resource"));

var _asar = _interopRequireDefault(require("../../utils/asar"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const asar = new _asar.default();

class AsarResource extends _baseResource.default {
  constructor(resourcePath) {
    // NOTE: use a normalized path (GH-2101 PR)
    super(_path.default.normalize(resourcePath));

    _defineProperty(this, "_archive", '');

    _defineProperty(this, "_fileName", '');
  }

  _createContentStream() {
    try {
      this._contentStream = asar.extractFileToReadStream(this._archive, this._fileName);
    } catch (e) {
      e.message = asar.getFileInAsarNotFoundErrorMessage(this._archive, this._fileName);
      this._error = e;
    }
  }

  get isArchiveFound() {
    return !!this._archive;
  }

  async init() {
    if (!(await asar.isAsar(this._path))) return;
    const {
      archive,
      fileName
    } = await asar.parse(this._path);
    this._archive = archive;
    this._fileName = fileName;
    await this._checkAccess(this._archive);
    if (!this._error) this._createContentStream();
  }

}

exports.default = AsarResource;
module.exports = exports.default;