"use strict";

exports.__esModule = true;
exports.default = void 0;

var _asar = _interopRequireDefault(require("asar"));

var _buffer = require("./buffer");

var _path = _interopRequireDefault(require("path"));

var _promisifiedFunctions = require("./promisified-functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const ASAR_EXTNAME = '.asar';

class Asar {
  constructor() {
    _defineProperty(this, "_archivePaths", new Set());
  }

  static async _isAsarArchive(archivePath) {
    try {
      const stats = await (0, _promisifiedFunctions.stat)(archivePath);
      return stats.isFile() && _path.default.extname(archivePath) === ASAR_EXTNAME;
    } catch (e) {
      return false;
    }
  }

  async _findArchivePath(fullPath) {
    let currentPath = fullPath;

    let currentDir = _path.default.dirname(currentPath);

    while (currentPath !== currentDir) {
      if (await Asar._isAsarArchive(currentPath)) return currentPath;
      currentPath = _path.default.dirname(currentPath);
      currentDir = _path.default.dirname(currentPath);
    }

    return '';
  }

  parse(fullPath) {
    for (const archivePath of this._archivePaths) {
      if (fullPath.startsWith(archivePath)) return {
        archive: archivePath,
        fileName: fullPath.substr(archivePath.length + 1)
      };
    }

    return {
      archive: '',
      fileName: ''
    };
  }

  async isAsar(fullPath) {
    for (const archivePath of this._archivePaths) {
      if (fullPath.startsWith(archivePath)) {
        if (!(await Asar._isAsarArchive(archivePath))) {
          this._archivePaths.delete(archivePath);

          break;
        }

        return true;
      }
    }

    const archivePath = await this._findArchivePath(fullPath);

    if (archivePath) {
      this._archivePaths.add(archivePath);

      return true;
    }

    return false;
  }

  extractFileToReadStream(archive, fileName) {
    const extractedFile = _asar.default.extractFile(archive, fileName);

    return (0, _buffer.toReadableStream)(extractedFile);
  }

  getFileInAsarNotFoundErrorMessage(archive, fileName) {
    return `Cannot find the "${fileName.replace(/\\/g, '/')}" file in the "${archive.replace(/\\/g, '/')}" archive.`;
  }

  getArchivePath(fullPath) {
    return this.parse(fullPath).archive;
  }

}

exports.default = Asar;
module.exports = exports.default;