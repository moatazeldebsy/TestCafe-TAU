"use strict";

exports.__esModule = true;
exports.default = _default;

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/* eslint hammerhead/proto-methods: 2 */
// NOTE: taken from https://github.com/benjamingr/RegExp.escape
function _default(str) {
  return str.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = exports.default;