"use strict";

exports.__esModule = true;
exports.createLineIterator = createLineIterator;
exports.appendLine = appendLine;
exports.startsWith = startsWith;
exports.toReadableStream = toReadableStream;
exports.CRLF = void 0;

var _stream = require("stream");

const LF = 0x0A;
const CR = 0x0D;
const CRLF_LENGTH = 2;
const CRLF = Buffer.from([CR, LF]);
exports.CRLF = CRLF;

function createLineIterator(buffer) {
  return {
    [Symbol.iterator]: function* () {
      const lastIdx = buffer.length - 1;
      let start = 0;

      for (let i = 0; i < buffer.length; i++) {
        if (i === lastIdx) yield buffer.slice(start);else if (buffer[i] === CR && buffer[i + 1] === LF) {
          yield buffer.slice(start, i);
          start = i + CRLF_LENGTH;
        }
      }
    }
  };
}

function appendLine(lines, line) {
  if (lines.length) lines.push(CRLF);
  lines.push(line);
}

function startsWith(buffer, searchBuffer) {
  if (buffer.length < searchBuffer.length) return false;

  for (let i = 0; i < searchBuffer.length; i++) {
    if (buffer[i] !== searchBuffer[i]) return false;
  }

  return true;
}

function toReadableStream(buffer) {
  const stream = new _stream.Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}