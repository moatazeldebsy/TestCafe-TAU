"use strict";

exports.__esModule = true;
exports.default = void 0;

var _nodeBuilder = require("../node-builder");

var _esotopeHammerhead = require("esotope-hammerhead");

var _instrumented = require("../instrumented");

// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

/*eslint-disable no-unused-vars*/

/*eslint-enable no-unused-vars*/
// Transform:
// obj.<wrappable-property> = value -->
// __set$(obj, '<wrappable-property>', value)
const transformer = {
  nodeReplacementRequireTransform: true,
  nodeTypes: _esotopeHammerhead.Syntax.AssignmentExpression,
  condition: node => {
    // super.prop = value
    if (node.left.type === _esotopeHammerhead.Syntax.MemberExpression && node.left.object.type === _esotopeHammerhead.Syntax.Super) return false;
    return node.operator === '=' && node.left.type === _esotopeHammerhead.Syntax.MemberExpression && !node.left.computed && node.left.property.type === _esotopeHammerhead.Syntax.Identifier && (0, _instrumented.shouldInstrumentProperty)(node.left.property.name);
  },
  run: node => {
    const memberExpression = node.left;
    const identifier = memberExpression.property;
    return (0, _nodeBuilder.createPropertySetWrapper)(identifier.name, memberExpression.object, node.right);
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;