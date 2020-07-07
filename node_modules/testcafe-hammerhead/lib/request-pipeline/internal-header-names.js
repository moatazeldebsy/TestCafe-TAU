"use strict";

exports.__esModule = true;
exports.default = void 0;

var _builtinHeaderNames = _interopRequireDefault(require("./builtin-header-names"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/* eslint hammerhead/proto-methods: 2 */
const hammerheadPrefix = 'x-hammerhead-';
var _default = {
  credentials: hammerheadPrefix + 'credentials',
  origin: hammerheadPrefix + _builtinHeaderNames.default.origin,
  wwwAuthenticate: hammerheadPrefix + _builtinHeaderNames.default.wwwAuthenticate,
  proxyAuthenticate: hammerheadPrefix + _builtinHeaderNames.default.proxyAuthenticate,
  authorization: hammerheadPrefix + _builtinHeaderNames.default.authorization,
  proxyAuthorization: hammerheadPrefix + _builtinHeaderNames.default.proxyAuthorization
};
exports.default = _default;
module.exports = exports.default;