"use strict";

exports.__esModule = true;
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _promisifiedFunctions = require("../../utils/promisified-functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BaseResource {
  constructor(path) {
    _defineProperty(this, "_path", void 0);

    _defineProperty(this, "_error", null);

    _defineProperty(this, "_contentStream", null);

    this._path = path;
  }

  async _checkAccess(path) {
    try {
      await (0, _promisifiedFunctions.access)(path, _fs.default.constants.R_OK);
    } catch (e) {
      this._error = e;
    }
  }

  get error() {
    return this._error;
  }

  get contentStream() {
    return this._contentStream;
  }

}

exports.default = BaseResource;
module.exports = exports.default;