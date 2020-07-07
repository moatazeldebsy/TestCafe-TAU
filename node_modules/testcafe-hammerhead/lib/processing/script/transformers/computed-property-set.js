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
// obj[prop] = value -->
// __set$(object, prop, value)
const transformer = {
  nodeReplacementRequireTransform: true,
  nodeTypes: _esotopeHammerhead.Syntax.AssignmentExpression,
  condition: node => {
    const left = node.left; // super[prop] = value

    if (left.type === _esotopeHammerhead.Syntax.MemberExpression && left.object.type === _esotopeHammerhead.Syntax.Super) return false;
    if (node.operator === '=' && left.type === _esotopeHammerhead.Syntax.MemberExpression && left.computed) return left.property.type === _esotopeHammerhead.Syntax.Literal ? (0, _instrumented.shouldInstrumentProperty)(left.property.value) : true;
    return false;
  },
  run: node => {
    const memberExpression = node.left;
    return (0, _nodeBuilder.createComputedPropertySetWrapper)(memberExpression.property, memberExpression.object, node.right);
  }
};
var _default = transformer;
exports.default = _default;
module.exports = exports.default;