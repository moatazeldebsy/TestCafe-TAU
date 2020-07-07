"use strict";

exports.__esModule = true;
exports.default = void 0;
// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/* eslint hammerhead/proto-methods: 2 */
const POSTFIX = '-hammerhead-shadow-ui';
var _default = {
  postfix: POSTFIX,
  charset: 'charset' + POSTFIX,
  script: 'script' + POSTFIX,
  selfRemovingScript: 'self-removing-script' + POSTFIX,
  uiStylesheet: 'ui-stylesheet' + POSTFIX
};
exports.default = _default;
module.exports = exports.default;