"use strict";

exports.__esModule = true;
exports.default = void 0;

var _baseResource = _interopRequireDefault(require("./base-resource"));

var _fs = _interopRequireDefault(require("fs"));

var _promisifiedFunctions = require("../../utils/promisified-functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TARGET_IS_NOT_FILE = 'The target of the operation is not a file';

class FileSystemResource extends _baseResource.default {
  constructor(path) {
    super(path);
  }

  _getStat() {
    return (0, _promisifiedFunctions.stat)(this._path).then(stats => ({
      stats,
      err: null
    }), err => ({
      stats: null,
      err
    }));
  }

  _createContentStream() {
    this._contentStream = _fs.default.createReadStream(this._path);
  }

  async init() {
    const {
      err,
      stats
    } = await this._getStat();
    this._error = err;

    if (stats) {
      if (!stats.isFile()) this._error = new Error(TARGET_IS_NOT_FILE);
      await this._checkAccess(this._path);
    }

    if (!this._error) this._createContentStream();
  }

}

exports.default = FileSystemResource;
module.exports = exports.default;