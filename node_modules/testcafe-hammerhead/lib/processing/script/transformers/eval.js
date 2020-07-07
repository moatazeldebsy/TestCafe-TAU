"use strict";

exports.__esModule = true;
exports.default = void 0;

var _nodeBuilder = require("../node-builder");

var _replaceNode = _interopRequireDefault(require("./replace-node"));

var _esotopeHammerhead = require("esotope-hammerhead");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/*eslint-disable no-unused-vars*/

/*eslint-enable no-unused-vars*/
// Transform:
// eval(script); --> eval(__proc$Script(script));
const transformer = {
  nodeReplacementRequireTransform: false,
  nodeTypes: _esotopeHammerhead.Syntax.CallExpression,
  condition: node => {
    if (!node.arguments.length) return false;
    const callee = node.callee; // eval()

    if (callee.type === _esotopeHammerhead.Syntax.Identifier && callee.name === 'eval') return true; // obj.eval(), obj['eval'](),

    return callee.type === _esotopeHammerhead.Syntax.MemberExpression && (callee.property.type === _esotopeHammerhead.Syntax.Identifier && callee.property.name || callee.property.type === _esotopeHammerhead.Syntax.Literal && callee.property.value) === 'eval';
  },
  run: node => {
    const newArgs = (0, _nodeBuilder.createProcessScriptMethodCall)(node.arguments[0]);
    (0, _replaceNode.default)(node.arguments[0], newArgs, node, 'arguments');
    return null;
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;