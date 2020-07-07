"use strict";

exports.__esModule = true;
exports.default = void 0;

var _incomingMessageMock = _interopRequireDefault(require("../incoming-message-mock"));

var _contentType = require("../../utils/content-type");

var _builtinHeaderNames = _interopRequireDefault(require("../builtin-header-names"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const PAGE_CONTENT_TYPE = 'text/html; charset=utf-8';
const EMPTY_PAGE_HTML = '<html><body></body></html>';
const INVALID_BODY_PARAMETER_TYPES = ['number', 'boolean'];
const INVALID_STATUS_CODE_MESSAGE = 'Invalid status code. It should be a number that is greater than 100 and less than 999.';

class ResponseMock {
  constructor(body, statusCode, headers) {
    _defineProperty(this, "body", void 0);

    _defineProperty(this, "statusCode", void 0);

    _defineProperty(this, "headers", void 0);

    _defineProperty(this, "requestOptions", null);

    this.body = body;
    this.statusCode = statusCode;
    this.headers = this._lowerCaseHeaderNames(headers);

    this._validateParameters();
  }

  _lowerCaseHeaderNames(headers) {
    if (!headers) return headers;
    const lowerCaseHeaders = {};
    Object.keys(headers).forEach(headerName => {
      lowerCaseHeaders[headerName.toLowerCase()] = headers[headerName];
    });
    return lowerCaseHeaders;
  }

  _validateBody() {
    const bodyType = typeof this.body;
    if (INVALID_BODY_PARAMETER_TYPES.includes(bodyType)) throw new TypeError(`The 'body' parameter has an invalid type - ${bodyType}.`);
  }

  _validateStatusCode() {
    if (this.statusCode === void 0) return;
    if (typeof this.statusCode !== 'number') throw new TypeError(INVALID_STATUS_CODE_MESSAGE);
    let statusCode = parseInt(this.statusCode, 10); // NOTE: for Infinity case

    statusCode |= 0;
    if (statusCode < 100 || statusCode > 999) throw new TypeError(INVALID_STATUS_CODE_MESSAGE);
  }

  _validateHeaders() {
    if (this.headers === void 0) return;
    if (typeof this.headers !== 'object') throw new TypeError('Invalid type of the \'headers\' parameter. It should be an object.');
  }

  _validateParameters() {
    this._validateBody();

    this._validateStatusCode();

    this._validateHeaders();
  }

  _getContentType() {
    if (this.body !== null && typeof this.body === 'object') return _contentType.JSON_MIME;
    return PAGE_CONTENT_TYPE;
  }

  setRequestOptions(opts) {
    this.requestOptions = opts;
  }

  async getResponse() {
    let response = {
      headers: {
        [_builtinHeaderNames.default.contentType]: this._getContentType()
      },
      trailers: {},
      statusCode: this.statusCode || 200
    };
    if (this.headers) response.headers = Object.assign(response.headers, this.headers);
    if (this.body === void 0) response._body = EMPTY_PAGE_HTML;else if (typeof this.body === 'function') {
      response.setBody = value => {
        response._body = value;
      };

      response = Object.assign(response, await this.body(this.requestOptions, response));
      delete response.setBody;
    } else response._body = this.body;
    response.headers = this._lowerCaseHeaderNames(response.headers);
    return new _incomingMessageMock.default(response);
  }

}

exports.default = ResponseMock;
module.exports = exports.default;