"use strict";

exports.__esModule = true;
exports.default = void 0;

var _computedPropertyGet = _interopRequireDefault(require("./computed-property-get"));

var _computedPropertySet = _interopRequireDefault(require("./computed-property-set"));

var _concatOperator = _interopRequireDefault(require("./concat-operator"));

var _eval = _interopRequireDefault(require("./eval"));

var _evalBind = _interopRequireDefault(require("./eval-bind"));

var _evalCallApply = _interopRequireDefault(require("./eval-call-apply"));

var _evalGet = _interopRequireDefault(require("./eval-get"));

var _windowEvalGet = _interopRequireDefault(require("./window-eval-get"));

var _postMessageGet = _interopRequireDefault(require("./post-message-get"));

var _windowPostMessageGet = _interopRequireDefault(require("./window-post-message-get"));

var _postMessageCallApplyBind = _interopRequireDefault(require("./post-message-call-apply-bind"));

var _forIn = _interopRequireDefault(require("./for-in"));

var _forOf = _interopRequireDefault(require("./for-of"));

var _locationGet = _interopRequireDefault(require("./location-get"));

var _locationSet = _interopRequireDefault(require("./location-set"));

var _propertyGet = _interopRequireDefault(require("./property-get"));

var _propertySet = _interopRequireDefault(require("./property-set"));

var _methodCall = _interopRequireDefault(require("./method-call"));

var _jsProtocolLastExpression = _interopRequireDefault(require("./js-protocol-last-expression"));

var _staticImport = _interopRequireDefault(require("./static-import"));

var _dynamicImport = _interopRequireDefault(require("./dynamic-import"));

var _declarationDestructuring = _interopRequireDefault(require("./declaration-destructuring"));

var _assignmentDestructuring = _interopRequireDefault(require("./assignment-destructuring"));

var _funcArgsDestructing = _interopRequireDefault(require("./func-args-destructing"));

var _esotopeHammerhead = require("esotope-hammerhead");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------
const TRANSFORMERS = [(0, _funcArgsDestructing.default)(_esotopeHammerhead.Syntax.FunctionDeclaration), (0, _funcArgsDestructing.default)(_esotopeHammerhead.Syntax.FunctionExpression), (0, _funcArgsDestructing.default)(_esotopeHammerhead.Syntax.ArrowFunctionExpression), _assignmentDestructuring.default, _computedPropertyGet.default, _computedPropertySet.default, _concatOperator.default, _eval.default, _evalBind.default, _evalCallApply.default, _evalGet.default, _windowEvalGet.default, _postMessageGet.default, _windowPostMessageGet.default, _postMessageCallApplyBind.default, _forIn.default, _forOf.default, _locationGet.default, _locationSet.default, _propertyGet.default, _propertySet.default, _methodCall.default, _jsProtocolLastExpression.default, _staticImport.default, _dynamicImport.default, _declarationDestructuring.default];

function createTransformerMap() {
  const transformerMap = new Map();

  for (const transformer of TRANSFORMERS) {
    const nodeType = transformer.nodeTypes;
    let transformers = transformerMap.get(nodeType);

    if (!transformers) {
      transformers = [];
      transformerMap.set(nodeType, transformers);
    }

    transformers.push(transformer);
  }

  return transformerMap;
}

var _default = createTransformerMap();

exports.default = _default;
module.exports = exports.default;