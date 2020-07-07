"use strict";

exports.__esModule = true;
exports.default = _default;

var _domain = _interopRequireDefault(require("domain"));

var _osFamily = _interopRequireDefault(require("os-family"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore
const connectionResetDomain = _domain.default.create();

connectionResetDomain.on('error', err => {
  // NOTE: The nodejs throw the EPIPE error instead of the ECONNRESET error
  // when the connection is broken in some cases on MacOS and Linux
  // https://github.com/nodejs/node/blob/8b4af64f50c5e41ce0155716f294c24ccdecad03/test/parallel/test-http-destroyed-socket-write2.js
  if (err.code === 'ECONNRESET' || !_osFamily.default.win && err.code === 'EPIPE' || _osFamily.default.win && err.code === 'ECONNABORTED') return;
  connectionResetDomain.removeAllListeners('error');
  throw err;
});

function _default(fn) {
  connectionResetDomain.run(fn);
}

module.exports = exports.default;