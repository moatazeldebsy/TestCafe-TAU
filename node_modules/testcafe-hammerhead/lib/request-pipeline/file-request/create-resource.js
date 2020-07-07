"use strict";

exports.__esModule = true;
exports.default = createResource;

var _filesystemResource = _interopRequireDefault(require("./filesystem-resource"));

var _asarResource = _interopRequireDefault(require("./asar-resource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isFileNotExists(errCode) {
  return errCode === 'ENOENT' || errCode === 'ENOTDIR'; // NOTE: found it (ENOTDIR) on travis server tests (GH-2043 PR)
}

async function createResource(path) {
  let resource = new _filesystemResource.default(path);
  await resource.init();

  if (resource.error && isFileNotExists(resource.error.code)) {
    const asarResource = new _asarResource.default(path);
    await asarResource.init();
    if (asarResource.isArchiveFound) resource = asarResource;
  }

  return resource;
}

module.exports = exports.default;