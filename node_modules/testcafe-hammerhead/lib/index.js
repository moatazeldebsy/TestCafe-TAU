"use strict";

exports.__esModule = true;
exports.default = void 0;

var _proxy = _interopRequireDefault(require("./proxy"));

var _session = _interopRequireDefault(require("./session"));

var _responseMock = _interopRequireDefault(require("./request-pipeline/request-hooks/response-mock"));

var _requestFilterRule = _interopRequireDefault(require("./request-pipeline/request-hooks/request-filter-rule"));

var _storage = _interopRequireDefault(require("./upload/storage"));

var _script = require("./processing/script");

var _configureResponseEventOptions = _interopRequireDefault(require("./session/events/configure-response-event-options"));

var _sameOriginCheckFailedStatusCode = _interopRequireDefault(require("./request-pipeline/xhr/same-origin-check-failed-status-code"));

var _stateSnapshot = _interopRequireDefault(require("./session/state-snapshot"));

var _url = require("./utils/url");

var _generateUniqueId = _interopRequireDefault(require("./utils/generate-unique-id"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Proxy: _proxy.default,
  Session: _session.default,
  UploadStorage: _storage.default,
  processScript: _script.processScript,
  isScriptProcessed: _script.isScriptProcessed,
  ResponseMock: _responseMock.default,
  RequestFilterRule: _requestFilterRule.default,
  ConfigureResponseEventOptions: _configureResponseEventOptions.default,
  SAME_ORIGIN_CHECK_FAILED_STATUS_CODE: _sameOriginCheckFailedStatusCode.default,
  StateSnapshot: _stateSnapshot.default,
  SPECIAL_BLANK_PAGE: _url.SPECIAL_BLANK_PAGE,
  SPECIAL_ERROR_PAGE: _url.SPECIAL_ERROR_PAGE,
  generateUniqueId: _generateUniqueId.default
};
exports.default = _default;
module.exports = exports.default;