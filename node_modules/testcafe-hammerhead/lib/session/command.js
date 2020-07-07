"use strict";

exports.__esModule = true;
exports.default = void 0;
// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/* eslint hammerhead/proto-methods: 2 */
const ServiceCommands = {
  getUploadedFiles: 'hammerhead|command|get-uploaded-files',
  setCookie: 'hammerhead|command|set-cookie',
  uploadFiles: 'hammerhead|command|upload-files'
};
var _default = ServiceCommands;
exports.default = _default;
module.exports = exports.default;