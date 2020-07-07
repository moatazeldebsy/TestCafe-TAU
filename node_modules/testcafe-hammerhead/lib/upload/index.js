"use strict";

exports.__esModule = true;
exports.inject = inject;

var _formData = _interopRequireDefault(require("./form-data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function inject(contentTypeHeader, body) {
  const formData = new _formData.default();
  formData.parseContentTypeHeader(contentTypeHeader);
  if (!formData.boundary) return null;
  formData.parseBody(body);
  formData.expandUploads();
  return formData.toBuffer();
}