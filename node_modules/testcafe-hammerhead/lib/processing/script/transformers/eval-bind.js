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
// foo = eval.bind(...); -->
// foo = __get$Eval(eval).bind(...);
const transformer = {
  nodeReplacementRequireTransform: false,
  nodeTypes: _esotopeHammerhead.Syntax.CallExpression,
  condition: node => {
    if (node.callee.type === _esotopeHammerhead.Syntax.MemberExpression && node.callee.property.type === _esotopeHammerhead.Syntax.Identifier && node.callee.property.name === 'bind') {
      const obj = node.callee.object; // obj.eval.bind(), obj[eval].bind()

      if (obj.type === _esotopeHammerhead.Syntax.MemberExpression && (obj.property.type === _esotopeHammerhead.Syntax.Identifier && obj.property.name || obj.property.type === _esotopeHammerhead.Syntax.Literal && obj.property.value) === 'eval') return true; // eval.bind()

      if (obj.type === _esotopeHammerhead.Syntax.Identifier && obj.name === 'eval') return true;
    }

    return false;
  },
  run: node => {
    const callee = node.callee;
    const getEvalNode = (0, _nodeBuilder.createGetEvalMethodCall)(callee.object);
    (0, _replaceNode.default)(callee.object, getEvalNode, callee, 'object');
    return null;
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;