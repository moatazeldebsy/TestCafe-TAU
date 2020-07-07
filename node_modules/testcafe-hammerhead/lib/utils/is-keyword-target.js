"use strict";

exports.__esModule = true;
exports.default = _default;
const KEYWORD_TARGETS = ['_blank', '_self', '_parent', '_top'];

function _default(value = '') {
  value = value.toLowerCase();
  return KEYWORD_TARGETS.indexOf(value) !== -1;
}

module.exports = exports.default;