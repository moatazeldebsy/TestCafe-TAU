"use strict";

exports.__esModule = true;
exports.default = void 0;

var _lodash = require("lodash");

var _mime = _interopRequireDefault(require("mime"));

var _path = _interopRequireDefault(require("path"));

var _util = require("util");

var _promisifiedFunctions = require("../utils/promisified-functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class UploadStorage {
  constructor(uploadRoots) {
    _defineProperty(this, "uploadRoots", void 0);

    this.uploadRoots = (0, _lodash.chain)(uploadRoots).castArray().uniq().value();
  }

  static async _getFilesToCopy(files) {
    const filesToCopy = [];
    const errs = [];

    for (const file of files) {
      try {
        const stats = await (0, _promisifiedFunctions.stat)(file.path);
        if (stats.isFile()) filesToCopy.push(file);
      } catch (err) {
        errs.push({
          path: file.path,
          err
        });
      }
    }

    return {
      filesToCopy,
      errs
    };
  }

  static _generateName(existingNames, fileName) {
    const extName = _path.default.extname(fileName);

    const template = _path.default.basename(fileName, extName) + ' %s' + extName;
    let index = 0;

    while (existingNames.includes(fileName)) fileName = (0, _util.format)(template, ++index);

    return fileName;
  }

  static async _getExistingFiles(uploadsRoot) {
    try {
      return await (0, _promisifiedFunctions.readDir)(uploadsRoot);
    } catch (e) {
      return [];
    }
  }

  async store(fileNames, data) {
    const storedFiles = [];
    const mainUploadRoot = this.uploadRoots[0];
    const err = await UploadStorage.ensureUploadsRoot(mainUploadRoot);
    if (err) return [{
      err: err.toString(),
      path: mainUploadRoot
    }];
    const existingFiles = await UploadStorage._getExistingFiles(mainUploadRoot);

    for (const fileName of fileNames) {
      const storedFileName = UploadStorage._generateName(existingFiles, fileName);

      const storedFilePath = _path.default.join(mainUploadRoot, storedFileName);

      try {
        await (0, _promisifiedFunctions.writeFile)(storedFilePath, data[storedFiles.length], {
          encoding: 'base64'
        });
        existingFiles.push(storedFileName);
        storedFiles.push({
          path: storedFilePath,
          file: storedFileName
        });
      } catch (e) {
        storedFiles.push({
          err: e.toString(),
          path: storedFilePath,
          file: fileName
        });
      }
    }

    return storedFiles;
  }

  async _resolvePath(filePath, result) {
    let resolvedPath = null;
    if (_path.default.isAbsolute(filePath)) resolvedPath = filePath;else {
      const nonExistingPaths = [];

      for (const uploadRoot of this.uploadRoots) {
        resolvedPath = _path.default.resolve(uploadRoot, filePath);
        if (await (0, _promisifiedFunctions.fsObjectExists)(resolvedPath)) break;
        nonExistingPaths.push(resolvedPath);
        resolvedPath = null;
      }

      if (resolvedPath === null) {
        result.push({
          err: `Cannot find the ${filePath}. None path of these exists: ${nonExistingPaths.join(', ')}.`,
          path: filePath,
          resolvedPaths: nonExistingPaths
        });
      }
    }
    return resolvedPath;
  }

  async get(filePathList) {
    const result = [];

    for (const filePath of filePathList) {
      const resolvedPath = await this._resolvePath(filePath, result);
      if (resolvedPath === null) continue;

      try {
        const fileContent = await (0, _promisifiedFunctions.readFile)(resolvedPath);
        const fileStats = await (0, _promisifiedFunctions.stat)(resolvedPath);
        result.push({
          data: fileContent.toString('base64'),
          info: {
            lastModifiedDate: fileStats.mtime,
            name: _path.default.basename(resolvedPath),
            type: _mime.default.lookup(resolvedPath)
          }
        });
      } catch (e) {
        result.push({
          err: e.toString(),
          path: filePath,
          resolvedPath
        });
      }
    }

    return result;
  }

  static async copy(uploadsRoot, files) {
    const {
      filesToCopy,
      errs
    } = await UploadStorage._getFilesToCopy(files);
    const copiedFiles = [];
    if (!filesToCopy.length) return {
      copiedFiles,
      errs
    };
    const existingFiles = await UploadStorage._getExistingFiles(uploadsRoot);

    for (const file of filesToCopy) {
      const copiedFileName = UploadStorage._generateName(existingFiles, file.name);

      const copiedFilePath = _path.default.join(uploadsRoot, copiedFileName);

      try {
        await (0, _promisifiedFunctions.writeFile)(copiedFilePath, await (0, _promisifiedFunctions.readFile)(file.path, null));
        existingFiles.push(copiedFileName);
        copiedFiles.push(copiedFilePath);
      } catch (err) {
        errs.push({
          path: file.path,
          err
        });
      }
    }

    return {
      copiedFiles,
      errs
    };
  }

  static async ensureUploadsRoot(uploadsRoot) {
    try {
      if (!(await (0, _promisifiedFunctions.fsObjectExists)(uploadsRoot))) await (0, _promisifiedFunctions.makeDir)(uploadsRoot);
      return null;
    } catch (err) {
      return err;
    }
  }

}

exports.default = UploadStorage;
module.exports = exports.default;