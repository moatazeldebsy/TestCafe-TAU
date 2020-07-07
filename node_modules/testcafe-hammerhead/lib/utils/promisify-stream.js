"use strict";

exports.__esModule = true;
exports.default = _default;

function _default(s) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    s.on('data', chunk => chunks.push(chunk));
    s.on('end', () => resolve(Buffer.concat(chunks)));
    s.on('error', error => reject(error));
  });
}

module.exports = exports.default;