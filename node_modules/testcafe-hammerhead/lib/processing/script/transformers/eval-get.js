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
// const foo = eval; foo = eval; { _eval: eval }; return eval;
// -->
// const foo = _get$Eval(eval); foo = _get$Eval(eval); { _eval: _get$Eval(eval) }; return _get$Eval(eval);
const transformer = {
  nodeReplacementRequireTransform: false,
  nodeTypes: _esotopeHammerhead.Syntax.Identifier,
  condition: (node, parent) => {
    if (node.name === 'eval' && parent) {
      // Skip: eval()
      if (parent.type === _esotopeHammerhead.Syntax.CallExpression && parent.callee === node) return false; // Skip: class X { eval () {} }

      if (parent.type === _esotopeHammerhead.Syntax.MethodDefinition) return false; // Skip: class eval { x () {} }

      if (parent.type === _esotopeHammerhead.Syntax.ClassDeclaration) return false; // Skip: window.eval, eval.call

      if (parent.type === _esotopeHammerhead.Syntax.MemberExpression) return false; // Skip: function eval () { ... }

      if ((parent.type === _esotopeHammerhead.Syntax.FunctionExpression || parent.type === _esotopeHammerhead.Syntax.FunctionDeclaration) && parent.id === node) return false; // Skip: function (eval) { ... } || function func(eval) { ... } || eval => { ... }

      if ((parent.type === _esotopeHammerhead.Syntax.FunctionExpression || parent.type === _esotopeHammerhead.Syntax.FunctionDeclaration || parent.type === _esotopeHammerhead.Syntax.ArrowFunctionExpression) && parent.params.indexOf(node) !== -1) return false; // Skip: { eval: value }

      if (parent.type === _esotopeHammerhead.Syntax.Property && parent.key === node) return false; // Skip: eval = value || function x (eval = value) { ... }

      if ((parent.type === _esotopeHammerhead.Syntax.AssignmentExpression || parent.type === _esotopeHammerhead.Syntax.AssignmentPattern) && parent.left === node) return false; // Skip: const eval = value;

      if (parent.type === _esotopeHammerhead.Syntax.VariableDeclarator && parent.id === node) return false; // Skip: eval++ || eval-- || ++eval || --eval

      if (parent.type === _esotopeHammerhead.Syntax.UpdateExpression && (parent.operator === '++' || parent.operator === '--')) return false; // Skip already transformed: __get$Eval(eval)

      if (parent.type === _esotopeHammerhead.Syntax.CallExpression && parent.callee.type === _esotopeHammerhead.Syntax.Identifier && parent.callee.name === _instruction.default.getEval) return false; // Skip: function x (...eval) {}

      if (parent.type === _esotopeHammerhead.Syntax.RestElement) return false; // Skip: export { eval } from "module";

      if (parent.type === _esotopeHammerhead.Syntax.ExportSpecifier) return false; // Skip: import { eval } from "module";

      if (parent.type === _esotopeHammerhead.Syntax.ImportSpecifier) return false;
      return true;
    }

    return false;
  },
  run: _nodeBuilder.createGetEvalMethodCall
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;