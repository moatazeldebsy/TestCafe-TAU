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
const INVOCATION_FUNC_NAME_RE = /^(call|apply)$/; // Transform:
// eval.call(ctx, script);
// eval.apply(ctx, script); -->
// eval.call(ctx, __proc$Script(script));
// eval.apply(ctx, __proc$Script(script, true));

const transformer = {
  nodeReplacementRequireTransform: false,
  nodeTypes: _esotopeHammerhead.Syntax.CallExpression,
  condition: node => {
    // eval.<meth>(ctx, script, ...)
    if (node.arguments.length < 2) return false;

    if (node.callee.type === _esotopeHammerhead.Syntax.MemberExpression && node.callee.property.type === _esotopeHammerhead.Syntax.Identifier && INVOCATION_FUNC_NAME_RE.test(node.callee.property.name)) {
      const obj = node.callee.object; // eval.<meth>()

      if (obj.type === _esotopeHammerhead.Syntax.Identifier && obj.name === 'eval') return true; // obj.eval.<meth>(), obj[eval].<meth>()

      if (obj.type === _esotopeHammerhead.Syntax.MemberExpression && (obj.property.type === _esotopeHammerhead.Syntax.Identifier && obj.property.name || obj.property.type === _esotopeHammerhead.Syntax.Literal && obj.property.value) === 'eval') return true;
    }

    return false;
  },
  run: node => {
    const callee = node.callee;
    const property = callee.property;
    const newArg = (0, _nodeBuilder.createProcessScriptMethodCall)(node.arguments[1], property.name === 'apply');
    (0, _replaceNode.default)(node.arguments[1], newArg, node, 'arguments');
    return null;
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;