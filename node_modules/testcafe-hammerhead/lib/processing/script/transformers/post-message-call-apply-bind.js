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
const INVOCATION_FUNC_NAME_RE = /^(call|apply|bind)$/; // Transform:
// postMessage.call(ctx, script);
// postMessage.apply(ctx, script);
// postMessage.bind(...); -->
// __get$PostMessage(postMessage).call(ctx, script);
// __get$PostMessage(postMessage).apply(ctx, script);
// __get$PostMessage(postMessage).bind(...);

const transformer = {
  nodeReplacementRequireTransform: false,
  nodeTypes: _esotopeHammerhead.Syntax.CallExpression,
  condition: node => {
    if (node.callee.type === _esotopeHammerhead.Syntax.MemberExpression && node.callee.property.type === _esotopeHammerhead.Syntax.Identifier && INVOCATION_FUNC_NAME_RE.test(node.callee.property.name)) {
      // postMessage.<call|apply>(ctx, script, ...)
      if (node.arguments.length < 2 && node.callee.property.name !== 'bind') return false;
      const obj = node.callee.object; // obj.postMessage.<meth>(), obj[postMessage].<meth>(),

      if (obj.type === _esotopeHammerhead.Syntax.MemberExpression && (obj.property.type === _esotopeHammerhead.Syntax.Identifier && obj.property.name || obj.property.type === _esotopeHammerhead.Syntax.Literal && obj.property.value) === 'postMessage') return true; // postMessage.<meth>()

      if (obj.type === _esotopeHammerhead.Syntax.Identifier && obj.name === 'postMessage') return true;
    }

    return false;
  },
  run: node => {
    const callee = node.callee;
    const getPostMessageNode = (0, _nodeBuilder.createGetPostMessageMethodCall)(callee.object);
    (0, _replaceNode.default)(callee.object, getPostMessageNode, callee, 'object');
    return null;
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;