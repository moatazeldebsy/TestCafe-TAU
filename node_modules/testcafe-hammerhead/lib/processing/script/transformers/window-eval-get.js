"use strict";

exports.__esModule = true;
exports.default = void 0;

var _instruction = _interopRequireDefault(require("../instruction"));

var _nodeBuilder = require("../node-builder");

var _esotopeHammerhead = require("esotope-hammerhead");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/*eslint-disable no-unused-vars*/

/*eslint-enable no-unused-vars*/
// Transform:
// const foo = window.eval; foo = window.eval; { _eval: window.eval }; return window.eval;
// -->
// const foo = _get$Eval(window.eval); foo = _get$Eval(window.eval); { _eval: _get$Eval(window.eval) }; return _get$Eval(window.eval);
const transformer = {
  nodeReplacementRequireTransform: false,
  nodeTypes: _esotopeHammerhead.Syntax.MemberExpression,
  condition: (node, parent) => {
    if (!parent) return false; // Skip: window.eval.field

    if (parent.type === _esotopeHammerhead.Syntax.MemberExpression && (parent.property === node || parent.object === node)) return false; // Skip: window.eval()

    if (parent.type === _esotopeHammerhead.Syntax.CallExpression && parent.callee === node) return false; // Skip: window.eval = 1, window["eval"] = 1

    if (parent.type === _esotopeHammerhead.Syntax.AssignmentExpression && parent.left === node) return false; // Skip already transformed: __get$Eval(window.eval), __get$Eval(window["eval"])

    if (parent.type === _esotopeHammerhead.Syntax.CallExpression && parent.callee.type === _esotopeHammerhead.Syntax.Identifier && parent.callee.name === _instruction.default.getEval) return false; // window.eval

    if (node.property.type === _esotopeHammerhead.Syntax.Identifier && node.property.name === 'eval') return true; // window['eval']

    if (node.property.type === _esotopeHammerhead.Syntax.Literal && node.property.value === 'eval') return true;
    return false;
  },
  run: _nodeBuilder.createGetEvalMethodCall
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;