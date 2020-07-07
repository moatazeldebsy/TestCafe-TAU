"use strict";

exports.__esModule = true;
exports.default = void 0;

var _nodeBuilder = require("../node-builder");

var _esotopeHammerhead = require("esotope-hammerhead");

var _replaceNode = _interopRequireDefault(require("./replace-node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/*eslint-disable no-unused-vars*/

/*eslint-enable no-unused-vars*/
// Transform:
// import(something).then()
// -->
// import(__get$ProxyUrl(something)).then()
const transformer = {
  nodeReplacementRequireTransform: true,
  nodeTypes: _esotopeHammerhead.Syntax.CallExpression,
  // @ts-ignore
  condition: node => node.callee.type === _esotopeHammerhead.Syntax.Import,
  run: node => {
    const newArgs = (0, _nodeBuilder.createGetProxyUrlMethodCall)(node.arguments[0], transformer.baseUrl);
    (0, _replaceNode.default)(node.arguments[0], newArgs, node, 'arguments');
    return null;
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;