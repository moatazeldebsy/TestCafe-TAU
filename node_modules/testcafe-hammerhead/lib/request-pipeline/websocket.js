"use strict";

exports.__esModule = true;
exports.respondOnWebSocket = respondOnWebSocket;

var headerTransforms = _interopRequireWildcard(require("./header-transforms"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function writeWebSocketHead(socket, destRes, headers) {
  const {
    httpVersion,
    statusCode,
    statusMessage
  } = destRes;
  const resRaw = [`HTTP/${httpVersion} ${statusCode} ${statusMessage}`];
  const headersNames = Object.keys(headers);

  for (const headerName of headersNames) {
    const headerValue = headers[headerName];

    if (Array.isArray(headerValue)) {
      for (const value of headerValue) resRaw.push(headerName + ': ' + value);
    } else resRaw.push(headerName + ': ' + headerValue);
  }

  resRaw.push('', '');
  socket.write(resRaw.join('\r\n'));
}

function respondOnWebSocket(ctx) {
  const headers = headerTransforms.forResponse(ctx);
  const destRes = ctx.destRes;
  writeWebSocketHead(ctx.res, destRes, headers);
  destRes.socket.pipe(ctx.res);
  ctx.res.pipe(destRes.socket);
}