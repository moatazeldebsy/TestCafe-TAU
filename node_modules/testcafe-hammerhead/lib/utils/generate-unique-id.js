"use strict";

exports.__esModule = true;
exports.default = _default;

var _generate = _interopRequireDefault(require("nanoid/generate"));

var _url = _interopRequireDefault(require("nanoid/url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore
// @ts-ignore
const UNIQUE_ID_ALPHABET = _url.default.replace(/-|~/g, '');

const DEFAULT_ID_LENGTH = 9;

function _default(length) {
  return (0, _generate.default)(UNIQUE_ID_ALPHABET, length || DEFAULT_ID_LENGTH);
}

module.exports = exports.default;